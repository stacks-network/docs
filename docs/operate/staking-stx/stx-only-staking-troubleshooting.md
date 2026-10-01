---
description: >-
  Why an STX-only stake, stake update or unstake fails under PoX-5, and what to
  do about it.
---

# STX-only Staking Troubleshooting

Each section below starts from the error a failed transaction returns. The error codes are the `pox-5` contract's, so you see the same codes whichever app you use.

{% hint style="info" %}
**Check before you send.** `@stacks/bitcoin-staking` has read-only preflights that run the contract's own checks against current chain state: `fetchEligibleStake`, `fetchEligibleStakeUpdate` and `fetchEligibleUnstake`. A transaction ID only confirms that the transaction was submitted. Confirm the position on-chain or in your wallet before treating it as done.
{% endhint %}

## `stake` fails with ERR\_ALREADY\_STAKED (u19)

You already hold a position. PoX-5 allows one position per Stacks principal, and STX-only staking and a protocol bond are mutually exclusive.

* **You already have an STX-only stake.** Use `stake-update` to add STX or extend the term instead of a second `stake`.
* **You are in a protocol bond.** You can only stake STX-only once the bond ends no later than your stake's first reward cycle. Until then `stake` fails with u19.

Moving from an ending bond has one more condition: the transaction has to land after the bond's L1 unlock height, or it fails with ERR\_ROLLOVER\_TOO\_EARLY (u48). See [Ending or Changing a Bond Position](../protocol-bonds/ending-or-changing-a-bond-position.md).

## `stake` or `stake-update` fails with ERR\_STAKE\_IN\_PREPARE\_PHASE (u47)

Both calls are rejected during the prepare phase, the last 100 Bitcoin blocks of every reward cycle, while the next cycle's signer set is fixed. This happens every cycle, not once.

A transaction broadcast during the prepare phase does not wait for it to end. It fails when it is mined. Check first with `isInPreparePhase({ burnHeight, poxInfo })` and send once the next cycle has started.

## `unstake` fails with ERR\_UNSTAKE\_IN\_PREPARE\_PHASE (u28)

`unstake` is blocked in the same prepare-phase window, with its own error code. Send it once the next cycle has started.

## `stake-update` or `unstake` fails with ERR\_INVALID\_OLD\_SIGNER\_MANAGER (u36)

The `old-signer-manager` you passed is not the signer-manager your position is recorded with. Read it back before you build the call: `fetchStakerInfo` returns it as `details.signer`.

## `stake` fails with ERR\_INVALID\_START\_BURN\_HEIGHT (u24)

`stake` enrolls you from the next reward cycle, and `start-burn-ht` has to be a Bitcoin block height in the current cycle so that it points at that next cycle. A height from an earlier cycle, often from a transaction built and then left unsigned across a cycle boundary, fails. Rebuild the transaction with a current height.

## `stake` or `stake-update` fails with ERR\_INVALID\_NUM\_CYCLES (u20)

A position can run for 1 to 96 reward cycles (`MAX_NUM_CYCLES`). For `stake-update` the limit applies to the term remaining after the extension, counted from the next cycle, not to the extension alone.

`unstake` ends a position during the reward phase of any cycle, whatever term you chose.

## I want to stake less

`stake-update` can only add STX and extend the term. It cannot lower the amount or shorten the term.

To reduce a position, `unstake`, wait for your STX to unlock at the start of the next reward cycle, then `stake` the smaller amount. That new stake starts from the cycle after, so you earn nothing for one reward cycle in between.

## My STX did not unlock straight after `unstake`

That is expected. `unstake` removes you from every future cycle, but the current cycle runs to its end and you still earn for it. Your STX unlocks at the start of the next reward cycle.

## Related

* [Stake to an Existing Signer-Manager](stack-with-a-pool.md)
* [What's Changed in PoX-5](whats-changed-in-pox-5.md)
* [Key and Address Rotation](key-and-address-rotation.md)
