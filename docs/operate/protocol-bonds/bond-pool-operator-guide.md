---
description: >-
  Running a whitelisted community-tranche sBTC bond pool under PoX-5:
  registration, monitoring, and the operator's escape hatches.
---

# Bond Pool (BTC + STX) Operator Guide

This guide covers running a whitelisted community sBTC pool for PoX-5 protocol bonds. It is a different job from operating an STX-only pool, which is covered in [Operate a Pool](../staking-stx/operate-a-pool.md).

## Scope: sBTC pools only

The community allocation is sBTC-only via a pool. Native-BTC bonds are individual-only. The L1 path requires a lockup script committing to a single staker principal, so there is no pool path for it.

Each staker holds at most one bond membership, and the consequence shapes everything else here: **the pool contract itself is the PoX-5 staker**, not the members behind it. PoX-5 sees one membership keyed on your contract principal. Every member-level record lives in your contract.

## What a whitelisted pool operator does

Manage the community allocation, expected to be roughly 10% of paired BTC capacity in the protocol bond tranche during the PoX-5 bootstrap. Enroll members, lock pooled sBTC and STX, receive pool-level rewards, and distribute them pro rata.

Reward routing is not something you set at registration. There is no `pox-addr` argument on `register-for-bond`; where rewards land is a signer-manager concern, passed as opaque `signer-calldata`.

## Registration flow

* Members deposit STX and sBTC into your contract. The member-facing deposit flow is entirely yours to define; it is not part of pox-5.
* Your contract calls `register-for-bond` **once**, with the aggregated member totals.
* Prerequisites: your contract must already be registered as a signer with a live signer key grant, and must hold an allowance on that bond, or you get `ERR_NOT_ALLOWLISTED u11`. Exceeding the allowance returns `ERR_TOO_MUCH_SATS u10`.
* The STX you commit must clear the bond's minimum for the sats you are locking, or `ERR_INSUFFICIENT_STX u8`. That minimum is a **fraction** of the BTC value at the published ratio, not full coverage of it. On-chain the floor is `min-ustx-for-sats-amount(sats-amount, stx-value-ratio, min-ustx-ratio)`, and both `stx-value-ratio` and `min-ustx-ratio` are per-bond parameters the bond admin supplies at `setup-bond`. The white paper's 5% is an illustrative value, not a constant. Read the live bond parameters.
* You must also hold the STX. `register-for-bond` checks locked plus unlocked balance together and returns `ERR_INSUFFICIENT_STX u8` if the total falls short.
* Registration must land before the bond's start height, or `ERR_BOND_ALREADY_STARTED u43`, and is rejected during the prepare phase with `ERR_STAKE_IN_PREPARE_PHASE u47`.

The pool is then bonded for the full 12-cycle term as a single membership.

### If members commit less than your allowance

The allowance is a ceiling, not a target. `register-for-bond` asserts only that `sats-total <= allowance`, failing with `ERR_TOO_MUCH_SATS u10` when the aggregate is too large; there is no minimum-commitment gate anywhere in the function. An under-subscribed pool therefore registers for the amount it actually raised, and that smaller amount is what gets staked.

## Persist the unlock bytes

The `staker-unlock-bytes` tail chosen at registration is **not stored on-chain**. Your contract cannot recover it later, and neither can pox-5. Persist it yourself for the pool's own lockup. Without it the P2WSH lock address cannot be rederived and the locked BTC cannot be reclaimed.

## Monitoring

Read-only calls compose an operator dashboard, all keyed on your contract principal as the signer, a reward cycle, and `(some bond-index)`:

| Call                                             | Returns                                                    |
| ------------------------------------------------ | ---------------------------------------------------------- |
| `get-signer-unclaimed-rewards-for-cycle`         | Settled but unclaimed sBTC                                 |
| `get-signer-rewards-per-token-settled-for-cycle` | The rewards-per-token snapshot at last settlement          |
| `get-earned`                                     | Total claimable now, including accrual since that snapshot |

`get-earned` is the one to display. It composes the other two with your current shares: `earned = pending + (shares × (rpt − rptPaid)) / PRECISION`, where `PRECISION` is the contract constant `u1000000000000000000`.

For a single member's position rather than the pool's, use `get-earned-staker-rewards`, which takes a staker principal as well. Reward claims run through `claim-rewards`, called by your contract, and `claim-staker-rewards-for-signer` marks an individual member settled.

### SDK equivalents

The three signer-side reads are wrapped in `@stacks/bitcoin-staking` 7.6.0:

| Function                            | Wraps                                            |
| ----------------------------------- | ------------------------------------------------ |
| `fetchEarned`                       | `get-earned`                                     |
| `fetchSignerUnclaimedRewards`       | `get-signer-unclaimed-rewards-for-cycle`         |
| `fetchSignerRewardsPerTokenSettled` | `get-signer-rewards-per-token-settled-for-cycle` |

All three take `{ signerManager, rewardCycle, bondIndex? } & NetworkClientParam`. Omit `bondIndex` for the STX-only leg; pass it for a bond leg.

The staker-side variants are **separate functions**, and this is the distinction that costs people time: `fetchEarnedStakerRewards`, `fetchStakerUnclaimedRewards`, and `fetchStakerRewardsPerTokenSettled`, which additionally require `staker`. As the pool operator you read the signer-side figures. A pool member reads the staker-side ones. Label which is which wherever your interface shows a balance.

## Escape hatches

### `update-bond-registration`

Rotate the pool to a new signer-manager mid-bond. Reverts with `ERR_UPDATE_BOND_SAME_SIGNER u44` if the signer-manager passed is the one already in place, and is rejected during the prepare phase with `ERR_STAKE_IN_PREPARE_PHASE u47`. The new signer-manager needs a live signer key grant, or `ERR_SIGNER_KEY_GRANT_NOT_FOUND u17`.

It settles rewards with both the old and the new signer and moves shares between them. The change takes effect from the next reward cycle, or from the bond's start cycle if the bond has not begun.

Positions and term are unaffected. This changes who manages, not what is locked.

### `unstake-sbtc`

Withdraw locked sBTC, in full or in part, with no bond-deadline restriction. That is unlike L1-locked participants, who are bound by their CLTV and must use the early-exit path instead.

Four conditions still apply:

* **Rejected during the prepare phase**, with `ERR_STAKE_IN_PREPARE_PHASE u47`. "At any time" does not include the last 100 Bitcoin blocks of a cycle.
* The membership must not be an L1 lock, or `ERR_CANNOT_UNSTAKE_SBTC u38`.
* The signer-manager passed must match the current signer, or `ERR_INVALID_OLD_SIGNER_MANAGER u36`.
* The amount cannot exceed the current stake, or `ERR_INVALID_UNSTAKE_SBTC_AMOUNT u37`.

The staker is taken from `tx-sender` rather than passed as an argument, so your contract must be the direct caller and it withdraws the pool's own position. There is no path by which pox-5 withdraws on behalf of an individual member: member exits are your contract's problem, settled against the pool's aggregate position.

`unstake-sbtc` reads `protocol-bond-memberships` directly, rather than through the expiry-filtered `get-bond-membership` that `update-bond-registration` uses. So it still works after the bond's term ends, while `update-bond-registration` returns `ERR_NOT_BOND_PARTICIPANT u34`. That is your route to retrieving pooled sBTC after a bond closes.

The sBTC transfer goes to the caller via the hardcoded mainnet token principal `SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token`.

### Rolling the pool forward

Rather than withdrawing and re-registering, call `register-for-bond` again for a later bond. The contract transfers only the net sBTC difference between the two positions, so a pool rolling into a same-size bond moves no sBTC at all.

This is allowed only once the old bond's L1 unlock height is reached, which is half a reward cycle before its L2 end. Earlier gives `ERR_ROLLOVER_TOO_EARLY u48`. Overlapping terms give `ERR_ALREADY_REGISTERED u9`.

That window is 1,050 Bitcoin blocks wide, but only 950 of them are usable. The last 100 blocks of every cycle are the prepare phase, where `register-for-bond` is rejected with `ERR_STAKE_IN_PREPARE_PHASE u47`, so the roll has to land before the prepare phase that precedes the bond's end.

<div data-with-frame="true"><figure><img src="https://4065274862-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F4cpTb2lbw0LAOuMHrvhA%2Fuploads%2FrJdcjN2HFTvByme81Aau%2Fstaking-rollover-window.png?alt=media&#x26;token=ec8978a6-ad51-4514-80ef-63d5c645b141" alt="The rollover window at the end of a bond. Gate one, non-overlap, passes for bond n+6 or an STX-only stake from the next cycle. Gate two, the rollover window, fails before Day 175 and passes from Day 175. Both gates are open together for 950 Bitcoin blocks, from Day 175 until the prepare phase before Day 182, after 24,150 of the bond&#x27;s 25,200 blocks. Once open the window does not close."><figcaption><p>Two gates, one window. It opens 1,050 blocks before the bond ends, and 950 of those blocks are usable.</p></figcaption></figure></div>

## Related reading

* [Bitcoin Staking Glossary](https://docs.stacks.co/learn/bitcoin-staking/glossary)
* [Protocol Bond and Rewards Mechanics](https://docs.stacks.co/learn/bitcoin-staking/rewards-and-tranches)
* [What's changed in PoX-5](../staking-stx/whats-changed-in-pox-5.md)

## Sources

Every contract-level claim on this page is checked against the pinned release and the deployed contract:

* [`pox-5.clar` at tag 4.0.1](https://github.com/stacks-network/stacks-core/blob/4.0.1/stackslib/src/chainstate/stacks/boot/pox-5.clar)
* [`SP000000000000000000002Q6VF78.pox-5` on mainnet](https://explorer.hiro.so/txid/SP000000000000000000002Q6VF78.pox-5?chain=mainnet\&tab=sourceCode)

The roughly-10% community carve-out is Endowment allocation policy and has no contract representation. The SDK names come from `@stacks/bitcoin-staking` 7.6.0, not from pox-5.
