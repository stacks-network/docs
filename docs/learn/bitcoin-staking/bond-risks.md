---
description: >-
  What can and cannot go wrong with a protocol bond: principal, the STX lock,
  the Bitcoin leg, yield, early exit, admin powers, and the sBTC dependency.
---

# Bond Risks

## Principal

Bitcoin Staking has no slashing. On a native BTC bond, your BTC stays in an output you control and is spendable by you alone once its timelock passes, whatever happens on Stacks, to miners or to the reserve. Your STX unlocks at the end of the bond term. On an sBTC bond, your principal is sBTC held by the contract, so it carries the sBTC dependency below.

## You are in for the full bond

A bond runs its full 12-cycle term, and there is nothing to renew or repeat during it. Leaving early returns the Bitcoin leg only: your BTC through an early exit, or your sBTC through `unstake-sbtc`. Your STX stays locked for the full term either way, and earns nothing after you leave.

## Your Bitcoin leg

* **Native BTC is locked until its unlock height.** Before that, the only way out is an early exit, which needs a co-signature. See [Ending or Changing a Bond Position](https://docs.stacks.co/operate/protocol-bonds/ending-or-changing-a-bond-position).
* **A failed or late registration does not release it.** The timelock is enforced by Bitcoin. If you fund the lock address and registration fails or misses the deadline, the BTC stays locked until its unlock height.
* **You need the lock script to spend it.** The contract does not keep it. Save it at registration; it can be rebuilt from your registration transaction.
* **sBTC can be withdrawn at any time** with `unstake-sbtc`, in part or in full, including after the bond ends.

## Yield is a target, not a guarantee

Rewards come from miner revenue and follow the waterfall: Bitcoin staking, then STX-only staking, then the reserve. Bitcoin staking takes its target yield first, and what remains splits 85% to STX-only staking and 15% to the reserve. If miner revenue falls, STX-only staking absorbs the shortfall before Bitcoin staking does. The reserve exists to cover Bitcoin staking, but during PoX-5 it only accrues: no contract function can spend it, so drawing on it requires a hard fork. See [Protocol Bond and Rewards Mechanics](rewards-and-tranches.md).

## Early exit depends on a signing service

The early-exit branch of the lockup script needs a co-signature from a key held by an off-chain signing service. The service signs only after it sees your `announce-l1-early-exit` on Stacks. If it cannot sign, you cannot exit early, but you can still spend your BTC alone once the timelock passes. An early exit forfeits the rest of the term's yield.

## Admin powers

Two admin roles exist in the contract:

* The **bond admin** sets up each bond: its parameters, early-exit subscript and allowlist.
* The **pause admin** can permanently stop signer-managers from claiming rewards. There is no unpause: rewards keep accruing, and paying them out afterwards requires a hard fork. The pause cannot redirect rewards, move principal, or block `unstake-sbtc`.

## The sBTC dependency

Rewards pay out in sBTC by default, reserve accumulations are held in sBTC, and an sBTC bond's principal is sBTC. All three depend on the sBTC signer set staying honest. A native BTC bond limits that exposure to its rewards.

## Audits

The PoX-5 code was audited by Trail of Bits and Clarity Alliance, with additional review by Asymmetric Research ([announcement](https://www.stacks.co/blog/the-stacks-pox-5-hardfork-is-live-what-comes-next)).
