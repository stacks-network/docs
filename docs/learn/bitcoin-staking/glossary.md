---
description: >-
  Terms used across the Bitcoin Staking documentation: bonds, the bond timeline,
  tranches, coverage ratio, early exit, and the PoX-5 vocabulary.
---

# Bitcoin Staking Glossary

Terms used across the Bitcoin Staking (PoX-5) documentation set.

## Protocol bond

A 12-cycle dual-asset commitment, roughly six months: a BTC timelock on Bitcoin L1 paired with an STX lock on Stacks L2, cryptographically linked, targeting Tranche 1 yield on the BTC leg. The term is the contract constant `BOND_LENGTH_CYCLES u12`.

## Day 0 / Day 175 / Day 182 (bond timeline)

Day 0 is the cutoff by which both legs must be locked to be eligible; registration must land before the bond's start height. Day 175 is the L1 timelock's minimum unlock height. It sits exactly half a reward cycle before the bond's L2 end, which is 1,050 Bitcoin blocks on mainnet, about seven days. Day 182 ends the bonding period on L2; the STX unlocks at the next cycle boundary.

The L1 lockup is rejected at registration if its unlock height is below Day 175.

## Bonding period

The full 12-cycle term of a single bond, Day 0 through Day 182. Six bonding periods run concurrently and staggered, opening every two cycles. Bond index _n_ ends when bond index _n+6_ begins, which is what produces the six-deep overlap.

## Signer cycle (reward cycle)

Another name for a reward cycle: 2,100 Bitcoin blocks, about 14 days on mainnet. It is one reward phase plus its trailing 100-block prepare phase. The other cycle figures on this page are derived from it.

## Distribution cycle

Half a reward cycle, 1,050 Bitcoin blocks on mainnet, and the clock rewards are calculated on. Two distributions per reward cycle, about 50 a year, which is the divisor in each bond's per-distribution target yield.

## Lockup script

The L1 leg is a P2WSH output with two spend branches. The timelock branch requires the staker's signature after the CLTV height. The early-exit branch requires revealing a 32-byte preimage, satisfying the bond's early-unlock subscript, and the staker's signature. The staker is bound to the script by a hashed commitment, `sha256(sha256(to-consensus-buff? staker))`, rather than a cleartext push. That is why an L1 bond is inherently single-staker and cannot be pooled.

The staker's own signature is required on both branches, not only the timelock one: `staker-unlock-bytes` runs unconditionally after `OP_ENDIF`, outside the branch selection. An early-exit spend therefore needs the staker's signature and the 32-byte commitment preimage in addition to whatever the early-unlock subscript demands.

## BTC SPV proof

The Bitcoin-side proof supplied at registration to show that the L1 timelock output exists and is confirmed. Two hard caps matter before you build a registration:

* **At most 10 lockup outpoints per registration.** `register-for-bond`'s `btc-lockup` ok branch is typed `outputs: (list 10 {…})`, and the validation fold caps its `seen-outpoints` accumulator at `u10`. A repeated `(txid, output-index)` fails with `ERR_DUPLICATE_LOCKUP_OUTPOINT u46`. You can spread the BTC across several timelock UTXOs, but not more than ten.
* **Merkle proofs cannot exceed depth 14.** The proof's `leaf-hashes` field is typed `(list 14 (buff 32))`.

## Tranche 1: Active Protocol Bonds

The first stop in the waterfall. Every active bond is paid its target yield before anything else is allocated. About 10% of Tranche 1 capacity is reserved for community participation via pools, per white paper Section 4.2. Full treatment in [Rewards and tranches](rewards-and-tranches.md).

## Tranche 2: STX-Only Stakers

The second stop. STX-only stakers take 85% of the cycle excess, pro rata by shares staked.

## Tranche 3: Reserve Fund

The third stop. Takes the remaining 15% of the cycle excess.

> **House convention.** This glossary is the one page in the set that carries the tranche numbers: Tranche 1 is protocol bonds, Tranche 2 is STX-only stakers, Tranche 3 is the reserve fund. Everywhere else in the documentation the tranches are named, never numbered: the protocol bond tranche, the STX-only staking tranche, the reserve fund tranche. When two or more are named together the order is always protocol bonds, then STX-only, then reserve fund.

## Cycle excess

Miner revenue beyond Tranche 1 obligations for that cycle. It is what Tranche 2 and Tranche 3 split, 85% to STX-only stakers and 15% to the reserve.

## Waterfall

The priority ordering of rewards across the three tranches: bonds first, then the excess split between STX-only stakers and the reserve. Bonds are paid in descending `stx-value-ratio` order, and a shortfall falls entirely on the last bonds in that order rather than being spread proportionally. The effect is a more stable BTC-side yield and a more variable STX-only return.

Outside this glossary the three stops are referred to by name, in the order protocol bonds, STX-only, reserve fund. Full treatment in [Rewards and tranches](rewards-and-tranches.md).

## Coverage ratio

Reward pool per cycle divided by paired-BTC obligations per cycle. The target is 2.0x with a response band from 0.8x to 2.0x and above, managed manually by the Stacks Endowment during the PoX-5 bootstrap. The contract neither computes nor reacts to it; this is a design-level construct.

## Reserve fund

The third stop in the waterfall. It accrues 15% of the cycle excess, plus the STX-staker cut in any cycle with no STX-only stakers.

The white paper describes it as held in two sleeves, a BTC sleeve and a USD sleeve of stables or short-duration treasuries, split at deposit time, with the BTC sleeve drawn first and the USD sleeve as the last line of defense. That structure is not in pox-5, which tracks one `reserve-balance` denominated in sBTC. The sleeves are a treasury arrangement off-chain.

Nothing inside the contract can draw it down. `reserve-balance` is incremented in `calculate-rewards` and decremented in exactly one place, `transfer-from-reserve`, which is `define-private`, carries `#[allow(unused_private_fn)]`, and has no call site anywhere in the contract. It can only be invoked by the node as part of consensus, so reaching the reserve requires a hard fork. Neither the bond admin nor the pause admin can reach it.

## PoX-5

The Clarity boot contract implementing Bitcoin Staking. It replaced PoX-4 at Epoch 4.0. PoX-5 runs an Endowment-mediated bootstrap in which capacity, ratio, and target APY are set administratively; PoX-6 is the planned algorithmic successor.

## Epoch 4.0

The Stacks consensus epoch that activated PoX-5 together with SIP-044's Clarity and consensus changes: the new block header version scheme, cost-voting removal, restored 1,000 STX per block emission, and burn-address removal. It activated at Bitcoin block 960,230 and requires release 4.0.1.

## Prepare phase

The last 100 Bitcoin blocks of every reward cycle, recurring every cycle, during which the next cycle's signer and staker set is frozen. Six entrypoints are rejected during it with `ERR_STAKE_IN_PREPARE_PHASE (u47)`: `register-for-bond`, `update-bond-registration`, `stake`, `stake-update`, `announce-l1-early-exit`, and `unstake-sbtc`. `unstake` is rejected by a separate check with `ERR_UNSTAKE_IN_PREPARE_PHASE (u28)`.

## Signer-manager

A contract that every staker delegates to, bond or STX-only. It owns approval logic through the `validate-stake!` callback defined by `signer-manager-trait`, and is where rewards land before onward distribution. Most integrators use a provided signer-manager rather than writing one. See [Stake to an Existing Signer-Manager](https://docs.stacks.co/operate/staking-stx/stack-with-a-pool).

## Signer set minimum

`SIGNER_SET_MIN_USTX u50000000000` is 50,000 STX. It is an aggregate threshold on total uSTX delegated to a signer, counting both bond STX and STX-only STX, with no per-staker minimum. A signer crossing it is added to that cycle's signer set; falling below removes them.

## Early exit

The early-exit branch of the L1 lockup script, which requires the early-unlock key and the staker together. Neither can move the coins alone.

### What the contract permits

The early-unlock subscript is set per bond by the bond admin at `setup-bond`. The contract's own doc comment says `early-unlock-bytes` "should be of the form `<pubkey> OP_CHECKSIG` or an M-of-N `CHECKMULTISIG` template, and MUST leave a valid result on the stack (it is consumed by the shared OP\_VERIFY)." It is stored as an opaque `(buff 683)` per bond and the contract never inspects its shape. The signer-set shape is therefore a per-bond policy choice, not a protocol constant.

### What is actually deployed

In practice it is always a single cosigner public key with `OP_CHECKSIG`, one key managed by a redundant, KMS-backed early-exit signing service, not an on-chain multisig. That is an operational choice, not a protocol constraint. Either statement alone misleads: told only "M-of-N", you design for a multisig that will not exist; told only "always one key", you believe the contract enforces something it does not.

### The Stacks-side call

`announce-l1-early-exit` is the Stacks-side call, and the staker must make it themselves: `contract-caller` must equal both `tx-sender` and the staker argument, so no contract can make it on their behalf. It zeroes the membership's `amount-sats` while leaving the membership row in place, which is why **the paired STX stays locked to term**.

It is once per bond. A second announce for the same bond reverts with `ERR_L1_EARLY_EXIT_ALREADY_ANNOUNCED u50`, so callers should check `fetchHasAnnouncedL1EarlyExit` first.

### Ordering

The contract enforces no ordering between `announce-l1-early-exit` and the Bitcoin-side spend. Operationally the ordering is fixed anyway: the co-signer only signs after finding the announce transaction on Stacks, and the position stops earning the moment that announcement lands. Building from the contract semantics alone produces the wrong flow.

Co-signing is only needed before the CLTV height. After it, the staker reclaims alone through the `OP_IF` branch and no co-signer is involved.

sBTC-locked participants use `unstake-sbtc` instead, which has no early-exit gating and no announcement step.

## sBTC auto-bridge

The default reward path: miner BTC routes into the reward pool and is auto-bridged to sBTC for distribution. A staker may opt out to an L1 BTC payout by supplying `signer-calldata` at the signer-manager layer. It is not a `register-for-bond` parameter. `signer-calldata` is an opaque `(optional (buff 500))` that pox-5 passes through to the signer-manager without interpreting it.

## Rollover window

The period in which an ending bond can roll directly into a new bond or into an STX-only stake without an intervening withdrawal. It opens at the bond's L1 unlock height, half a reward cycle before the bond's L2 end, and does not close. Both `register-for-bond` and `stake` check it when the caller already holds a bond membership; acting earlier returns `ERR_ROLLOVER_TOO_EARLY (u48)`.

A separate non-overlap test rejects a new position whose first cycle falls before the old bond's end. Both gates first pass together in the bond's final half reward cycle, so that is the earliest a roll can happen. A bond-to-bond roll transfers only the net sBTC difference; a bond-to-STX-only roll refunds all custodied sBTC.

## Andon cord

The one-way on-chain circuit breaker. The pause admin calls `pause-rewards`, after which `claim-rewards` reverts with `ERR_REWARDS_PAUSED (u53)`. Rewards keep accruing in the contract. There is no unpause function; recovery requires a hard fork.

## `BOND_GAP_CYCLES`

The contract constant `u2`. It sets both the window in which a new bond may be set up before its start height and the cadence at which new bonds open, which is what produces six overlapping 12-cycle bonds at steady state.

## Sources

Every contract-level claim on this page is checked against the pinned release and the deployed contract:

* [`pox-5.clar` at tag 4.0.1](https://github.com/stacks-network/stacks-core/blob/4.0.1/stackslib/src/chainstate/stacks/boot/pox-5.clar)
* [`SP000000000000000000002Q6VF78.pox-5` on mainnet](https://explorer.hiro.so/txid/SP000000000000000000002Q6VF78.pox-5?chain=mainnet\&tab=sourceCode)

The coverage-ratio target and band, and the auto-bridge as the default reward path, do not appear in the contract in any form. Both come from `glossary.mdx` and the white paper.
