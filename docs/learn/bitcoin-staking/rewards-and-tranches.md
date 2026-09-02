---
description: >-
  Where each cycle's reward pool goes: the three-tranche waterfall, the reserve
  fund, the coverage-ratio band, and the one-way pause.
---

# Protocol Bond and Rewards Mechanics

Rewards accrue to the pox-5 contract as sBTC and are distributed in a fixed priority order. Bonds are paid first, and only what is left over reaches STX-only stakers and the reserve. That ordering is the whole design: it stabilizes BTC-side yield at the cost of making STX-only returns more variable.

Distribution runs on its own clock. A distribution cycle is half a reward cycle, 1,050 Bitcoin blocks on mainnet or roughly a week. So there are two distributions per reward cycle and about 50 a year. The contract hardcodes that figure as the divisor in each bond's per-distribution target.

Terms used here are defined in the [Glossary](glossary.md).

## The waterfall, in order

Distribution is not automatic in the sense of happening on its own. Anyone can call `calculate-rewards` — it is permissionless — and it runs at most once per distribution height, rejecting a second call with `ERR_DISTRIBUTION_ALREADY_COMPUTED u30`. It also asserts that every currently-active bond appears in the `(list 6 uint)` it is given, failing with `ERR_ACTIVE_BOND_NOT_INCLUDED u33` otherwise. Rewards do not arrive; someone has to poke the contract.

<div data-with-frame="true"><figure><img src="https://2842511454-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FH74xqoobupBWwBsVMJhK%2Fuploads%2FA6QAOhEP5EQlLCU1Ttc7%2Fstaking-reward-waterfall.png?alt=media&#x26;token=60248573-61ae-4999-9630-5e6ad8560e75" alt="A three-step waterfall diagram. The cycle&#x27;s reward pool flows first into the protocol bond tranche, which takes each active bond&#x27;s target yield in full. What remains, labelled the cycle excess, flows into a second step that splits eighty-five percent to the STX-only staking tranche and fifteen percent to the reserve fund tranche."><figcaption><p>Each cycle's reward pool fills the protocol bond tranche first. Only the cycle excess reaches the STX-only staking tranche and the reserve fund tranche, which split it 85/15.</p></figcaption></figure></div>

### The protocol bond tranche

Each active bond is paid its target yield before anything else is allocated. Per distribution:

```clarity
(target-yield (/ (/ (* total-sats (get target-rate bond)) u10000) u50))
```

That is the bond's total staked sats times its target rate in basis points, divided by 50 distributions a year.

Bonds are paid in a canonical order enforced by the contract, which rejects a wrongly ordered list with `ERR_INVALID_BOND_PERIOD_ORDERING (u29)`: descending `stx-value-ratio`, with ascending bond index as the tiebreak. `stx-value-ratio` is uSTX per 100 sats, so the bonds with the most STX locked per unit of BTC are paid first.

This matters when the pool cannot cover every bond. Each bond takes its full target if the remaining pool covers it and otherwise takes whatever is left. A shortfall is therefore not spread proportionally. It falls entirely on the last bonds in the order, meaning the lowest `stx-value-ratio` bonds.

A bond's target rate is fixed for its whole term. It is written once at `setup-bond` and no function mutates it, so the rate applies consistently across every distribution in the bonding period.

Roughly 10% of protocol bond capacity is reserved for community participation via pools, alongside negotiated allocations for whitelisted institutional partners. This is an allocation policy from white paper Section 4.2. There is no capacity or carve-out constant in the contract.

### The STX-only staking tranche

Miner revenue beyond the protocol bond obligations is the **cycle excess**. It splits between the STX-only staking tranche and the reserve fund tranche. STX-only stakers take 85% of it, distributed pro rata by shares staked. The participant-facing side of this is covered in [Stake to an Existing Signer-Manager](https://docs.stacks.co/operate/staking-stx/stack-with-a-pool).

If a cycle has no STX-only stakers at all, that 85% is not left unallocated and does not inflate the per-cycle rewards-per-token figure. `unallocated-staker-cut` folds the whole staker share into `reserve-deposit` instead of stranding it.

### The reserve fund tranche

The reserve takes the other 15%, set by `RESERVE_RATIO u1500` against a 10,000 basis-point denominator. The reserve cut is computed first and the STX-staker share is the remainder:

```clarity
(reserve-cut (/ (* remaining-rewards RESERVE_RATIO) u10000))
(stx-staker-rewards (- remaining-rewards reserve-cut))
```

That computation order is the reverse of the priority order described above, and it is deliberate. The waterfall positions are the economic model's priority labels; the code order is arithmetic. Reading the contract without that distinction makes the documentation look like it contradicts the source.

The white paper calls 85/15 a proposed initial value for the reserve allocation percentage. On mainnet it is not a parameter: `RESERVE_RATIO` is a contract constant, so changing the split requires a new contract.

The reserve exists to buffer protocol bond shortfalls.

The white paper describes the reserve as held in two sleeves, a BTC sleeve and a USD sleeve of stables or short-duration treasuries, with new contributions split at deposit time. In a drawdown the BTC sleeve is drawn first and the USD sleeve is the last line of defense. None of that sleeve structure exists in pox-5. The contract tracks a single `reserve-balance` denominated in sBTC, so the two-sleeve split and the drawdown order are treasury-level arrangements outside the chain.

**Nothing inside the contract can draw it down.** `reserve-balance` is incremented in `calculate-rewards` and decremented in exactly one place: `transfer-from-reserve`, which is `define-private`, carries `#[allow(unused_private_fn)]`, and has no call site anywhere in the contract. Its own comment states the position plainly: it "can only be called by the node as part of consensus (via the SIP process)." Neither the bond admin nor the pause admin can reach it, so releasing reserve funds requires a hard fork. When invoked that way it checks the balance covers the amount (`ERR_INSUFFICIENT_RESERVE_BALANCE u51`), debits `reserve-balance`, and transfers the sBTC. That error constant exists solely for that path, which is why it looks unreferenced.

A second private function, `transfer-stranded-rewards`, is dormant the same way and is broader in scope: a catch-all for moving sBTC out of the contract, for instance rewards stranded by a pause. Unlike `transfer-from-reserve` it keeps no internal accounting and bounds the amount against nothing.

The reserve therefore accrues automatically and is released only by hard fork. Stating that plainly matters, because it otherwise reads as a bug.

## Coverage ratio

Coverage ratio is the reward pool per cycle divided by paired-BTC obligations per cycle. The target is 2.0x, with a response band running from 0.8x up to 2.0x and above.

During the PoX-5 bootstrap this band is managed manually by the Stacks Endowment. Nothing in the contract computes, stores, or reacts to a coverage ratio. Automatic on-chain band responses are anticipated for PoX-6.

## The Andon cord

The Andon cord is separate from the coverage-ratio bands and is the only circuit breaker that exists on-chain.

The pause admin calls `pause-rewards`. After that, `claim-rewards` fails its `(not (var-get rewards-paused))` assertion and reverts with `ERR_REWARDS_PAUSED u53`.

The brake is real because the role is held by a live principal. In the deployed contract both admin roles initialize to the same one:

```clarity
(define-data-var bond-admin principal 'SP72DMR3MJKS7RVBY33JVV7EEJSQ1PYDVKDP10FX)
(define-data-var pause-admin principal 'SP72DMR3MJKS7RVBY33JVV7EEJSQ1PYDVKDP10FX)
```

On non-mainnet networks `make_pox_5_body` rewrites both literals to the configured admin at deploy time. The `TODO: this should be set to some predefined multisig for mainnet` comment in the source sits on `bond-admin` only, not on `pause-admin`.

Pausing stops claims. It does not redirect rewards, which keep accruing in the contract.

It is one-way. The contract has no unpause function, which its own comment states: "This is one-way: there is no unpause function. Once paused, rewards can keep accumulating here, and recovery requires a hard fork." That recovery is what `transfer-stranded-rewards` exists for.

## The two admin roles

`bond-admin` and `pause-admin` are distinct roles, held in separate data variables and separately transferable, though both initialize to the same principal. Both are Endowment operations. If you are reading this page as a participant, you will not be calling either of them.

| Role          | Sets                                                                                                                      | Rotated by                                             | Guard                                     |
| ------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ----------------------------------------- |
| `bond-admin`  | Bond parameters via `setup-bond`: `target-rate`, `stx-value-ratio`, `min-ustx-ratio`, `early-unlock-bytes`, the allowlist | `set-bond-admin`, callable only by the current holder  | `ERR_UNAUTHORIZED u1`, reentrancy-guarded |
| `pause-admin` | The one-way rewards pause via `pause-rewards`                                                                             | `set-pause-admin`, callable only by the current holder | `ERR_UNAUTHORIZED u1`, reentrancy-guarded |

Both gate on `contract-caller`, so neither can be forwarded through an intermediary contract.

## Sources

Every contract-level claim on this page is checked against the pinned release and the deployed contract:

* [`pox-5.clar` at tag 4.0.1](https://github.com/stacks-network/stacks-core/blob/4.0.1/stackslib/src/chainstate/stacks/boot/pox-5.clar)
* [`SP000000000000000000002Q6VF78.pox-5` on mainnet](https://explorer.hiro.so/txid/SP000000000000000000002Q6VF78.pox-5?chain=mainnet\&tab=sourceCode)

The 10% community carve-out and the coverage-ratio target and bands do not appear in the contract in any form. Both are design-level, from the white paper.
