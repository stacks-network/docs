---
description: >-
  Dry-run any PoX-5 entrypoint's assert chain client-side and get back the
  contract's own error codes before broadcasting.
---

# Eligibility Preflights

Every state-changing PoX-5 entrypoint guards itself with a chain of asserts, and a failed assert costs the sender a transaction fee for nothing. `@stacks/bitcoin-staking` ships a `fetchEligible*` preflight for each entrypoint that rebuilds those asserts client-side from read-only fetches — no transaction, no fee, no signature. Run the preflight, and if it passes, build and broadcast; if it fails, you get the exact error codes the contract would return.

All examples use `@stacks/bitcoin-staking` for the PoX-5 surface.

### The `EligibilityResult` contract

Every preflight resolves to the same shape:

```ts
type EligibilityResult =
  | { ok: true }
  | { ok: false; reasons: [Pox5ErrorCode, ...Pox5ErrorCode[]] };
```

On `ok: false`, `reasons` lists **every** gate that would fail — not just the first — as the contract's own error codes (`Pox5ErrorCode`), in the order the contract evaluates them. `reasons[0]` is the error the transaction would actually abort with; the rest tell you what would fail next once you've fixed it. The `POX5_ERROR_NAMES` and `POX5_ERROR_DESCRIPTIONS` maps translate each code to its Clarity constant name (e.g. `ERR_NOT_ALLOWLISTED`) and a human-readable description.

Two caveats apply across the whole family:

* **Point-in-time.** Timing gates ([prepare phase](../../glossary.md#prepare-phase-prepare-window), bond setup windows, bond start heights) are evaluated against the _current_ burn height. A result that is true now can flip by the time your transaction is mined — treat a passing preflight near a [cycle boundary](../../glossary.md#cycle-boundary) with suspicion.
* **Some gates can't be reproduced off-chain.** The signer-manager's `validate-stake!` trait call, parts of the L1 SPV proof, and `contract-caller` construction concerns are only enforced on-chain (details per function below). A passing preflight is a strong signal, not a guarantee.

Preflights that need chain metadata accept an optional `poxInfo` (from `fetchPoxInfo`), so callers that already hold it avoid the extra round-trip.

### Worked example: `register-for-bond`

`fetchEligibleRegisterForBond` takes the same identifying inputs you'd pass to `buildRegisterForBond` and checks the allowlist, timing, STX minimum and balance, signer registration and key grant, overlapping positions, and rollover window:

```ts
import { POX5_ERROR_NAMES, fetchEligibleRegisterForBond } from '@stacks/bitcoin-staking';

const network = 'mainnet';

const eligible = await fetchEligibleRegisterForBond({
  bondIndex: 4,
  staker: user.stxAddress, // the future tx-sender
  amountUstx: 150_000_000_000n,
  satsTotal: 100_000_000n, // sBTC amount, or summed L1 lockup outputs
  signerManager: 'SP000…USER.signer-manager',
  network,
});

if (!eligible.ok) {
  // reasons[0] is what the tx would actually abort with
  const named = eligible.reasons.map(code => `${POX5_ERROR_NAMES[code]} (u${code})`);
  throw new Error(`register-for-bond would fail: ${named.join(', ')}`);
}

// Safe to buildRegisterForBond(...) with the same inputs and broadcast.
```

When registering with an L1 lockup (`kind: 'btc'`), also pass the lockup `outputs` — this enables the unlock-height (`u52`), duplicate-outpoint (`u46`), and block-header (`u40`) SPV checks. Pass the summed output sats as `satsTotal` regardless. The merkle proof (`u41`), output script (`u42`), amount (`u45`), and tx-parse (`u39`) legs of the proof are verified only on-chain.

In simpler flows a one-line guard before the builder call is enough:

```ts
const eligible = await fetchEligibleUnstake({ staker: user.stxAddress, oldSignerManager, network });
if (!eligible.ok) throw new Error('unstake would fail: u' + eligible.reasons.join(', u'));
```

### The full family

Each preflight gates exactly one entrypoint:

| Preflight                             | Entrypoint                 | Main gates checked                                                                                                                                                                                                                                                                          |
| ------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fetchEligibleRegisterForBond`        | `register-for-bond`        | Allowlist, prepare phase, bond exists and hasn't started, STX minimum and balance, signer registered with active key grant, `satsTotal` within allowance, no overlapping position, rollover within the L1 unlock window; with `outputs`: unlock-height, duplicate outpoint, header validity |
| `fetchEligibleUpdateBondRegistration` | `update-bond-registration` | Active bond membership, not in prepare phase, `oldSignerManager` matches the current signer, new signer differs and is registered with an active key grant                                                                                                                                  |
| `fetchEligibleAnnounceL1EarlyExit`    | `announce-l1-early-exit`   | Active bond membership, not in prepare phase, membership is an L1 lock, `oldSignerManager` matches, no early exit already announced                                                                                                                                                         |
| `fetchEligibleUnstakeSbtc`            | `unstake-sbtc`             | Bond membership exists (expired-but-present counts), `amountToWithdrawSats` within the staker's shares, not in prepare phase, `signerManager` matches, membership is sBTC-backed                                                                                                            |
| `fetchEligibleStake`                  | `stake`                    | Not in prepare phase, signer registered with active key grant, `startBurnHt` resolves to the next cycle, lock period in `[1, MAX_NUM_CYCLES]`, no existing STX-only stake or overlapping bond, rollover within the L1 unlock window, balance covers `amountUstx`                            |
| `fetchEligibleStakeUpdate`            | `stake-update`             | Active STX-only stake, not in prepare phase, `oldSignerManager` matches, new signer registered with active key grant, resulting lock period in `[1, MAX_NUM_CYCLES]`, unlocked STX covers `amountIncrease`                                                                                  |
| `fetchEligibleUnstake`                | `unstake`                  | Active STX-only stake, `oldSignerManager` matches, not in prepare phase — every on-chain gate is covered                                                                                                                                                                                    |
| `fetchEligibleCalculateRewards`       | `calculate-rewards`        | Distribution cycle not already computed, `bondIndices` includes every active bond at the calculation height, each listed bond exists and is active, list ordered by descending `stx-value-ratio` (ties: ascending bond index)                                                               |
| `fetchEligibleClaimRewards`           | `claim-rewards`            | Rewards not permanently paused, total claimable > 0 across the STX-only leg and each `bondIndices` leg                                                                                                                                                                                      |
| `fetchEligibleSetupBond`              | `setup-bond`               | Caller is the bond admin, setup window open (not too soon, not too late), bond index unused, no duplicate stakers in the allowlist                                                                                                                                                          |
| `fetchEligibleSetBondAdmin`           | `set-bond-admin`           | Caller is the current `bond-admin`                                                                                                                                                                                                                                                          |
| `fetchEligibleGrantSignerKey`         | `grant-signer-key`         | The `(signerKey, signerManager, authId)` grant triple hasn't been used, the SIP-018 signature recovers to `signerKey`                                                                                                                                                                       |
| `fetchEligibleRevokeSignerGrant`      | `revoke-signer-grant`      | Caller is the Stacks principal derived from `signerKey`                                                                                                                                                                                                                                     |

### What preflights can't see

A few gates live outside what read-only fetches can reproduce; a passing preflight does not clear them:

* **`validate-stake!`** — `register-for-bond`, `update-bond-registration`, `stake`, and `stake-update` all call into the signer-manager contract, which may reject the transaction on its own logic (allowlisting, capacity, fees). See [Signers](signers.md) for how managers own approval.
* **Caller-construction gates** — `announce-l1-early-exit` requires `contract-caller == tx-sender == staker` (send it directly from the staker, never through an intermediary contract), and `grant-signer-key` requires `contract-caller == signerManager` (the signer-manager contract submits it itself). These fail at the contract regardless of what the preflight says about state.
* **Token transfers** — `unstake-sbtc` and `claim-rewards` move sBTC the contract already custodies, so the transfer itself isn't checked.
* **L1 SPV proof legs** — for `register-for-bond` with `outputs`, the merkle proof, output script, amount, and tx-parse checks run only on-chain.

A few behavioral notes worth knowing:

* `fetchEligibleStakeUpdate` reports a lock period ≤ 0 as `INVALID_NUM_CYCLES`, though on-chain a negative result is a uint underflow (runtime abort) rather than that error code.
* `fetchEligibleGrantSignerKey` collapses the contract's `ERR_INVALID_SIGNATURE_RECOVER (u13)` (malformed signature) and `ERR_INVALID_SIGNATURE_PUBKEY (u14)` (recovers to a different key) into the latter.
* `fetchEligibleClaimRewards` takes a _reward_ cycle, not a distribution-cycle index — passing the wrong cycle yields 0 earned and a `NO_CLAIMABLE_REWARDS` result rather than an error.
