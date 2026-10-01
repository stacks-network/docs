---
description: >-
  Short answers about protocol bonds under PoX-5, with links to the guides that
  cover each in full.
---

# Bond FAQ

## How long is a protocol bond?

12 reward cycles, 25,200 Bitcoin blocks, roughly six months. The term is fixed for every bond.

## Can I hold more than one bond, or a bond and an STX-only stake?

No to both. A Stacks principal holds one position at a time. A registration that overlaps an existing bond fails with `ERR_ALREADY_REGISTERED` (u9), and one that overlaps an STX-only stake fails with `ERR_ALREADY_STAKED` (u19). A position that ends before the new one starts can roll into it.

The rule is keyed on the Stacks address, not on your Bitcoin keys, so the same Bitcoin keys can lock BTC for later bonds.

## Can I lock BTC on L1 and sBTC in the same bond?

No. A registration is either native BTC, as up to 10 lock outputs on Bitcoin, or sBTC held by the contract. Each lock output can commit its own unlock height, as long as every one is at or above the bond's minimum.

## Can I add BTC after registering?

No. Commit the full amount when you register. Nothing in pox-5 adds BTC to an existing bond position.

## What am I paid in?

Rewards are paid in sBTC: miner BTC is auto-bridged to sBTC for distribution. If you supplied a Bitcoin payout address and your signer-manager supports it, as the reference signer-manager and compatible ones do, your share is withdrawn to native BTC on L1 when it is claimed.

The payout address travels in `signer-calldata` to your signer-manager. See [How you are paid](../staking-stx/stack-with-a-pool.md#how-you-are-paid).

## When can I register, and when does registration close?

Registration opens once the bond is set up, which happens within the two reward cycles before it starts. It closes when the prepare phase before the bond's start begins, at least 100 Bitcoin blocks before the start height. See [Opening a Bond Position](opening-a-bond-position.md).

## Can I exit my bond early?

Yes, during the reward phase of any cycle, which excludes its last 100 Bitcoin blocks (the prepare phase).

* **Native BTC bond.** Call `announce-l1-early-exit` from your own Stacks address; no contract or other party can call it for you. You stop earning from that point, then spend your BTC back through the early-exit branch with a co-signature from the early-exit signer. Your STX stays locked until the bond's original end.
* **sBTC bond.** Withdraw with `unstake-sbtc`.

See [Ending or Changing a Bond Position](ending-or-changing-a-bond-position.md).

## What if my registration fails?

See [Bond Troubleshooting](bond-troubleshooting.md). If you funded the bond's checked lock address, a failed registration does not cost you the BTC: it stays spendable by you through the timelock path.
