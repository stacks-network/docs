---
description: >-
  Running an STX-only pool under PoX-5: what changed, how rewards reach your
  members, and what you can leave to them.
---

# Operate a Pool

Under PoX-4, operating a pool meant a recurring pile of transactions: accept each delegation, commit the aggregate, re-commit when it grew, attach a fresh signer signature every cycle. **None of that exists in PoX-5.**

After you have deployed a signer-manager contract and bound your signer key to it, your ongoing job is to **run the signer**. Everything else is optional.

{% hint style="info" %}
This page covers the **STX-only pool**: any signer-manager contract that multiple STX stakers stake to. The whitelisted community-tranche sBTC bond pool is a different model — there the pool contract is itself the staker via `register-for-bond`, and it must be on a bond's capacity allowlist. That path is documented separately.
{% endhint %}

### What you no longer do

* **No `delegate-stack-stx`.** There is no per-staker acceptance transaction. Stakers stake to your contract directly.
* **No `stack-aggregation-commit`.** Your signer-manager is added to a cycle's signer set _lazily_ — the first time its aggregate stake crosses the fixed 50,000 STX `SIGNER_SET_MIN_USTX` minimum, as a side effect of some staker's own `stake` or `stake-update` call.
* **No per-cycle signer signature.** The signer key is bound to your manager once, via `grant-signer-key` and `register-signer`.
* **No `stack-aggregation-increase`.** A staker who wants to add STX calls `stake-update` themselves.

The practical effect: there is no longer a deadline you can miss. Nothing lapses because you forgot to submit a transaction before the prepare phase.

### What you do

1. **Set up once** — see [Deploy a Signer Manager Contract](https://docs.stacks.co/operate/deploy-a-signer-manager-contract).
2. **Run the infrastructure** — a Bitcoin node, a Stacks node, and the signer software. See [Run a Signer](https://docs.stacks.co/operate/run-a-signer).
3. **Watch your threshold** — below.
4. **Optionally, claim rewards for your members** — below. This is the one genuinely discretionary part of the job.

### Stakers come to you

There is no acceptance step. A staker calls `stake` naming your signer-manager's contract principal, choosing their own amount and a lock of 1 to 96 cycles. Your contract's `validate-stake!` callback is your only gate — allowlisting, minimums or other conditions are logic you write there, not something PoX-5 provides.

One consequence worth planning for: **you cannot enforce a minimum stake on-chain** unless you build it into `validate-stake!`, because members stake directly rather than through you. If your concern is that very small positions aren't worth the payout cost, the lever is on the claiming side — only auto-claim above an amount you choose — not on the staking side.

#### Knowing whether you are in the signer set

Two read-only calls, no dashboard required:

* `fetchAmountDelegatedForSigner` — total uSTX staked to your manager for a cycle, bonds and STX-only combined. Compare against `SIGNER_SET_MIN_USTX` (50,000 STX).
* `fetchSignerSetContainsForCycle({ signer, rewardCycle, network })` — whether you are actually in the set for that cycle.

### How rewards reach your members

The path has changed shape, and it is worth understanding before you design your payout policy:

```
BTC (miner commitments)
  → sBTC accrues in the pox-5 contract
    → sBTC in your signer-manager        (claim-rewards)
      → member receives BTC or sBTC      (claim-staker-rewards)
```

Two claims, and **both are permissionless**:

* **`claim-rewards`** moves your signer's rewards for a cycle out of pox-5 and into your signer-manager.
* **`claim-staker-rewards`** distributes one member's share, after your fee.

Anyone can call either. That is the point: your members are not dependent on you, and you are not a custodian at any stage.

{% hint style="info" %}
The reference contract's staker claim covers **one member per call**. There is no batch claim in the contract today.
{% endhint %}

#### BTC or sBTC — the member chooses

When a member stakes, they can attach calldata containing a Bitcoin payout address and a **maximum L1 fee in sats**. What they receive on claim depends on it:

| Member supplied                                          | They receive                                             |
| -------------------------------------------------------- | -------------------------------------------------------- |
| A BTC address, and the fee fits within their maximum     | **Native BTC**, autobridged sBTC to L1                   |
| No BTC address                                           | **sBTC**, to the address they staked from (the default)  |
| A BTC address, but the L1 fee would exceed their maximum | **sBTC** — the withdrawal falls back rather than failing |

The L1 fee comes out of that member's own yield, before payout. Your fee is taken earlier still, at the sBTC level — so choosing native BTC does not avoid it.

You can make the Bitcoin address mandatory in your own interface, and you can recommend it. But a member who stakes to your contract through a different interface may not have supplied one, and **your process is identical either way** — you call the same claim, and they get whichever asset their calldata implies.

For small positions sBTC is usually the better outcome anyway: it is cheaper to move and it avoids creating tiny UTXOs.

#### Why the single batched Bitcoin payout is gone

Under PoX-4 an operator could receive BTC and fan it out in one large Bitcoin transaction. That is no longer possible, for three reasons worth being straight about:

* Miner commitments now fund a **three-tranche waterfall** — bond participants are paid a target yield first, and STX-only stakers are paid from the remainder. Rewards are no longer a simple per-cycle BTC pot to divide.
* Settling in **sBTC on Stacks is cheaper** than settling on L1, and only the members who want L1 pay for L1.
* It requires **less trust**. Rewards never pass through an operator-controlled wallet. There is no window in which you hold members' funds.

### Claiming for members, or leaving it to them

Both are legitimate, and the choice is genuinely yours.

**Claim for your members.** This is what they are used to from previous PoX regimes, and it is the friendlier default. You pay the Stacks transaction fees, and you may choose to sponsor them. You can claim on any cadence — every cycle, monthly, or only once accrued rewards are worth the cost.

**Let members self-claim.** Then charge a lower fee and say so. Members can let sBTC accumulate in your contract for as long as they like — months, if they want — and claim once the amount justifies the L1 fee. That flexibility did not exist under fixed payout schedules.

What you should not do is leave it ambiguous. Members who assume you are claiming for them will otherwise see nothing arrive.

{% hint style="warning" %}
If you do claim for members, communicate the practical minimum. A member with a very small position who elected a BTC payout may find the L1 fee consumes their yield — they will receive sBTC instead, which is the correct outcome but a surprising one if unexplained.
{% endhint %}

### Your fee, and the ceiling on it

Fees are set and collected on your signer-manager — see [Take a Signer Fee](https://docs.stacks.co/operate/take-a-signer-fee).

One point worth understanding before you deploy. The reference contract permits any fee from 0% to 99.99%, adjustable by an admin at any time. A contract deployed with a **lower hard ceiling** is a materially stronger commitment to members, because the ceiling is immutable code while the fee itself is a variable. A manager that can never charge more than 5% is a different proposition from one that merely charges 5% today.

{% hint style="warning" %}
Changing to a different signer-manager contract later is not a migration. Members who staked to your original contract stay there until their locks end — so running both means running two signers and two Stacks nodes side by side. Decide before you accept stake.
{% endhint %}

### Tooling

* [Leather](https://app.leather.io/staking) includes a claim function members can use themselves.
* [stx.fan/signer](https://stx.fan/signer/) is an open-source set of standalone tools, including one that indexes who has staked to your manager. The [source](https://github.com/no314/stx-fan/tree/main/signer) can be repurposed for your own interface.
