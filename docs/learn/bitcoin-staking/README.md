---
description: >-
  Bitcoin Staking under PoX-5: what a protocol bond is, how to start, where
  rewards come from, and what happened to your PoX-4 stack.
---

# Bitcoin Staking

Bitcoin Staking is PoX-5's evolution of Proof of Transfer. Participants earn BTC-denominated yield while their BTC stays self-custodied on Bitcoin L1, or is held as sBTC on the paired and pool paths.

The protocol bond in one paragraph: a 12-cycle commitment, roughly six months, pairing a BTC timelock on L1 with an STX lock on L2. The link is cryptographic: the Bitcoin lockup is a P2WSH script committing to a hash of your Stacks principal, and pox-5 verifies that commitment, the lockup amount, and a Merkle proof of the transaction before it will register you. Both legs must be locked before the bond's Day 0 cutoff, and registration has to land at least 100 Bitcoin blocks earlier than that, because the prepare phase immediately before Day 0 rejects it. The L1 lock goes first, because registration is what proves it.

Participation runs in four stages: get allowlisted and onboard, open a position, receive rewards, and then renew or exit.

## Choose a path

The paths are mutually exclusive per wallet:

* **Native BTC bond.** BTC stays in your own custody under a timelock. Individual only. There is no pool path for the native-BTC leg. Allowlisted.
* **sBTC bond, directly or through a pool.** Locked sBTC rather than a native timelock. This is the only path with a pool option.
* **STX-only staking.** No Bitcoin leg. Covered in [Stake to an Existing Signer-Manager](https://docs.stacks.co/operate/staking-stx/stack-with-a-pool).

One position per principal: a wallet cannot hold a bond and an STX-only stake whose terms overlap, and cannot hold two overlapping bonds. What the contract actually rejects is overlap, not succession: a position whose term ends on or before the next one begins is allowed, and that is what makes rolling from one bond to the next possible without unwinding.

## Getting allowlisted

Start here, and start early. Native-bond participation in PoX-5 is allowlisted, and getting onto a bond's allowlist is an off-chain conversation with the Stacks Endowment, not an API call. The Endowment then publishes the allowlist and the bond parameters on-chain before the bond opens.

The timing matters more than it looks. Bond parameters are published roughly seven days before Day 0, and the allowlist is fixed at `setup-bond`. A staker who is not on it at that moment cannot join that bond at all; the next opportunity is the next bond. A later, permissionless protocol version, PoX-6, is expected to remove this manual step.

## How to start

Before any flow: connect a wallet, complete the allowlist conversation if you are taking the native-BTC path, associate yourself with a signer-manager, satisfy the applicable ratio requirement, and complete the L1 lock before the L2 lock.

Two prerequisites:

* **A SegWit-capable Bitcoin wallet.** The lockup output is P2WSH. A wallet that cannot pay to one cannot fund a bond.
* **A signer-manager.** Every participant, bonded or STX-only, must be associated with one, either a signer-manager they run themselves or one they stake to. There is no separate solo path.

You do not set a reward address. There is no `pox-addr` argument on `register-for-bond`; reward routing moved out of the protocol and is now a signer-manager concern, passed as opaque `signer-calldata`.

Registration is rejected during the prepare phase, which is the last 100 Bitcoin blocks of every cycle. Do not plan to start a position at a cycle boundary.

Step-by-step guides with screenshots exist for the end-to-end flows institutional partners are expected to follow; [reach out for support](mailto:support@stackslabs.com?subject=Help%20wanted%20with%20bitcoin%20staking%20end-to-end%20steps%20to%20take) and we will point you at the right one. Liquid-staking options are expected to follow later and may be provided by third parties. StackingDAO, for example, has indicated it will offer stBTC, a liquid-staked sBTC token. Nothing of that kind is available today.

## The bond timeline

<div data-with-frame="true"><figure><img src="https://2842511454-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FH74xqoobupBWwBsVMJhK%2Fuploads%2FG660xt3cld5Hh0RkGykm%2Fstaking-bond-timeline_v2.png?alt=media&#x26;token=f0cb4501-14e4-44c6-a8a4-4340f01e953e" alt="A timeline of a single protocol bond. Day 0 marks the deadline for both legs to be locked, with a prepare phase of one hundred Bitcoin blocks immediately before it during which registration is rejected. The bond then runs for twelve reward cycles. Day 175 marks the Bitcoin timelock&#x27;s minimum unlock height, one thousand and fifty blocks before the end. Day 182 marks the end of the bonding period on Stacks. Six overlapping bonds are shown, each starting two reward cycles after the last."><figcaption><p>One bond's life. Registration must land at least 100 Bitcoin blocks before Day 0. The L1 timelock opens at Day 175, 1,050 blocks before the L2 term ends at Day 182.</p></figcaption></figure></div>

Three markers describe a bond:

* **Day 0.** Both legs must be locked by this height. Registration has to land at least 100 Bitcoin blocks earlier, because the prepare phase immediately before Day 0 rejects it.
* **Day 175.** The L1 timelock's minimum unlock height, 1,050 Bitcoin blocks before the L2 end, about seven days.
* **Day 182.** The bonding period ends on L2. Your STX unlocks at the next cycle boundary.

Around any one bond sits the wider schedule. A new bond opens every 2 reward cycles, which is 4,200 Bitcoin blocks, and each bond runs 12 reward cycles, or 25,200 Bitcoin blocks. Six bonds are live at any moment, and bond _n_ ends at the block where bond _n+6_ starts, and that alignment is what makes a direct roll-over possible. Rewards are distributed 24 times over a bond's life, once every 1,050 Bitcoin blocks.

The re-lock window is 1,050 Bitcoin blocks, of which only the first 950 are usable; the last 100 are the prepare phase.

One caveat worth carrying knowingly: 25,200 blocks is 175 days at 144 blocks per day, yet the L2 term ends at the marker labeled Day 182. The day numbers are calendar labels from the white paper, not figures derived from the block math. Where precision matters, use the block counts and treat the day numbers as signposts.

## Where the yield comes from

Bonds are paid first from each cycle's miner-revenue-derived pool. The protocol bond tranche takes its target yield in full, and what remains is split between the STX-only staking tranche and the reserve fund tranche. The full breakdown of the waterfall, the tranches, the coverage ratio, and the reserve is on [Protocol Bond and Rewards Mechanics](rewards-and-tranches.md).

By default rewards pay out in sBTC via an auto-bridge. A native BTC-L1 payout is an opt-out configured at the signer-manager layer through `signer-calldata`, not a `register-for-bond` parameter.

## Ending or changing a position

A bond is a 12-cycle commitment, but there are two exit paths and which one you use is decided by how your Bitcoin is locked.

If you are L1-locked, you announce the exit on Stacks by calling `announce-l1-early-exit`, and then spend the Bitcoin through the lockup script's early-exit branch. If you are sBTC-locked, you call `unstake-sbtc`, which can withdraw the position in full or in part. Both calls are rejected during the prepare phase.

Neither releases your STX before the term ends. You can also move to a different signer-manager mid-term, or roll straight into a new bond or an STX-only stake once the old bond's Bitcoin leg unlocks.

## If you were stacking under PoX-4

PoX-5 replaced PoX-4 outright at Epoch 4.0, which activated at Bitcoin block 960,230. All PoX-4 locks released, though a cycle already in progress at the fork still paid out.

There is no automatic migration. Every former stacker had to actively choose a new path: a protocol bond or an STX-only stake. If you have not, your STX is unlocked and earning nothing.

STX-only staking under PoX-5 is capped at 96 cycles per lock. There is no indefinite option.

## Contract reference

The deployed contract is the reference: [`SP000000000000000000002Q6VF78.pox-5`](https://explorer.hiro.so/txid/SP000000000000000000002Q6VF78.pox-5?chain=mainnet\&tab=sourceCode). For line-level reading, the source is pinned at release tag [4.0.1](https://github.com/stacks-network/stacks-core/blob/4.0.1/stackslib/src/chainstate/stacks/boot/pox-5.clar).

## Related reading

* [Bitcoin Staking Glossary](glossary.md)
* [Protocol Bond and Rewards Mechanics](rewards-and-tranches.md)
* [Stacking](https://docs.stacks.co/learn/block-production/staking)
