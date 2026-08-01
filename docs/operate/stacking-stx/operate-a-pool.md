---
description: >-
  Running an STX-only pool under PoX-5: what the ongoing job is, how rewards
  reach your members, and what you can leave to them.
---

# Operate a Pool

After you have deployed a signer-manager contract and bound your signer key to it, your ongoing job is to **run the signer**. Everything else is optional.

{% hint style="info" %}
This page covers the **STX-only pool**: any signer-manager contract that multiple STX stakers stake to. The whitelisted community-tranche sBTC bond pool works differently. There the pool contract is itself the staker via `register-for-bond`, and it must be on a bond's capacity allowlist. That path is documented separately.
{% endhint %}

### What you do

1. **Set up once.** See [Deploy a Signer Manager Contract](https://docs.stacks.co/operate/deploy-a-signer-manager-contract).
2. **Run the infrastructure:** a Bitcoin node, a Stacks node, and the signer software. See [Run a Signer](https://docs.stacks.co/operate/run-a-signer).
3. **Watch your threshold.** Covered below.
4. **Claim rewards for your members, if you choose to.** Covered below. This is the one discretionary part of the job.

### Stakers come to you

There is no acceptance step. A staker calls `stake` naming your signer-manager's contract principal, choosing their own amount and a lock of 1 to 96 cycles. Your contract's `validate-stake!` callback is your only gate. Allowlisting, minimums, and any other condition are logic you write there, rather than something PoX-5 provides.

Because members stake directly, you cannot enforce a minimum stake on-chain unless you build it into `validate-stake!`. If your concern is that very small positions cost more to pay out than they yield, the lever sits on the claiming side: auto-claim only above an amount you choose.

#### Knowing whether you are in the signer set

Check it with read-only calls, no dashboard required:

* `fetchAmountDelegatedForSigner` returns the total uSTX staked to your manager for a cycle, bonds and STX-only combined. Compare it against `SIGNER_SET_MIN_USTX` (50,000 STX).
* `fetchSignerSetContainsForCycle({ signer, rewardCycle, network })` returns whether you are in the set for that cycle.

### How rewards reach your members

The path from miner to member:

```
BTC (miner commitments)
  → sBTC accrues in the pox-5 contract
    → sBTC in your signer-manager        (claim-rewards)
      → member receives BTC or sBTC      (claim-staker-rewards)
```

Both claims are permissionless:

* **`claim-rewards`** moves your signer's rewards for a cycle out of pox-5 and into your signer-manager.
* **`claim-staker-rewards`** distributes one member's share, after your fee.

Anyone can call either, so your members can recover their rewards without you, and you never hold their funds.

{% hint style="info" %}
The reference contract's staker claim covers **one member per call**. The contract has no batch claim today.
{% endhint %}

#### BTC or sBTC: the member chooses

When a member stakes, they can attach calldata carrying a Bitcoin payout address and a **maximum L1 fee in sats**. Your manager stores both against that member and reads them back at claim time:

| Member supplied                                               | They receive                                            |
| ------------------------------------------------------------- | ------------------------------------------------------- |
| No BTC address                                                | **sBTC**, to the address they staked from (the default) |
| A BTC address, with rewards above the maximum L1 fee they set | **Native BTC**, withdrawn from sBTC to L1               |
| A BTC address, with rewards below the maximum L1 fee they set | **Nothing.** The claim reverts                          |

{% hint style="warning" %}
**A member whose rewards fall below their own stated maximum L1 fee cannot be paid at all.** The reference manager checks whether their share covers the fee budget they set. If it does not, the whole claim reverts with `ERR_NO_CLAIMABLE_REWARDS` (u1001). There is no fallback to sBTC.

Their rewards stay in your contract until they accrue past that budget, or until the member re-stakes with a lower maximum. An auto-claim routine that does not skip these members will retry the same failing transaction every cycle.
{% endhint %}

The maximum is a budget, not a prediction. The reference manager never compares it against the actual L1 fee. It subtracts the full budget from the member's share, hands that to the sBTC withdrawal system, and reconciles the unused remainder afterwards.

Your fee comes off first, from the gross. The member's L1 fee budget then comes out of what remains, so choosing native BTC does not avoid your fee.

You can make the Bitcoin address mandatory in your own interface, and you can recommend it. A member who stakes to your contract through a different interface may not have supplied one.

One behaviour to warn members about: supplying no calldata on a later `stake` or `stake-update` **deletes** any address they previously set. The reference manager clears the stored entry rather than keeping the old value, so a member who re-stakes without resupplying their address reverts to sBTC payouts with no error.

Small positions do better in sBTC. It costs less to move, it avoids creating tiny UTXOs, and it avoids the failed-claim case above.

### Claiming for members, or leaving it to them

Both are legitimate.

**Claim for your members.** This matches what they are used to from previous PoX regimes. You pay the Stacks transaction fees, and you can sponsor them. You choose the cadence: every cycle, monthly, or once accrued rewards exceed the cost of claiming.

**Let members self-claim.** Charge a lower fee and say so. Members can leave sBTC accumulating in your contract for months and claim once the amount justifies the L1 fee.

State which one you do. Members who assume you are claiming for them will otherwise see nothing arrive.

{% hint style="warning" %}
If you claim for members, publish the practical minimum, and tell members who elect a BTC payout to set a maximum L1 fee their position can actually cover. A member who sets one too high gets a reverting claim rather than a smaller payout.
{% endhint %}

### Your fee, and the ceiling on it

Fees are set and collected on your signer-manager. See [Take a Signer Fee](https://docs.stacks.co/operate/take-a-signer-fee).

The reference contract permits any fee from 0% to 99.99%, adjustable by an admin at any time. Deploying with a **lower hard ceiling** is a stronger commitment to members, because the ceiling is immutable code while the fee is a variable. A manager that can never charge more than 5% is a stronger guarantee than one that charges 5% today.

{% hint style="warning" %}
Changing to a different signer-manager contract later is not a migration. Members who staked to your original contract stay there until their locks end, so running both means running two signers and two Stacks nodes side by side. Decide before you accept stake.
{% endhint %}

### Tooling

* [Leather](https://app.leather.io/staking) includes a claim function members can use themselves.
* [stx.fan/signer](https://stx.fan/signer/) is an open-source set of standalone tools, including one that indexes who has staked to your manager. The [source](https://github.com/no314/stx-fan/tree/main/signer) can be repurposed for your own interface.

### What changed from PoX-4

If you operated a pool before Epoch 4.0, these recurring transactions have gone:

* **`delegate-stack-stx`.** There is no per-staker acceptance transaction. Stakers stake to your contract directly.
* **`stack-aggregation-commit`.** Your signer-manager joins a cycle's signer set _lazily_, the first time its aggregate stake crosses the fixed 50,000 STX `SIGNER_SET_MIN_USTX` minimum, as a side effect of some staker's own `stake` or `stake-update` call.
* **Per-cycle signer signatures.** The signer key binds to your manager once, via `grant-signer-key` and `register-signer`.
* **`stack-aggregation-increase`.** A staker who wants to add STX calls `stake-update` themselves.

No deadline remains that you can miss. Nothing lapses because you forgot to submit a transaction before the prepare phase.

The single batched Bitcoin payout is gone too. Under PoX-4 an operator could receive BTC and fan it out in one large Bitcoin transaction. What replaced it:

* Miner commitments now fund a **three-tranche waterfall** across bond participants, STX-only stakers, and the reserve fund. Bond participants are paid their target yield first and STX-only stakers are paid from the cycle excess, so rewards are no longer a per-cycle BTC pot to divide.
* Settling in **sBTC on Stacks costs less** than settling on L1, and only the members who want L1 pay for L1.
* Rewards never pass through an operator-controlled wallet, so no window exists in which you hold members' funds.
