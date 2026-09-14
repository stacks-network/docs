---
description: >-
  What existing PoX-4 stackers need to know and do now that Epoch 4.0 has
  activated.
---

# What's Changed in PoX-5

### Your STX has already unlocked

At Epoch 4.0 activation — Bitcoin block `960,230` — all STX locked under PoX-4 unlocked immediately. No manual action was needed to exit PoX-4, and stackers continued to receive rewards for the cycle already in progress.

Cycle 140 is still running under PoX-4 rules for mining and yield. **PoX-5's first full cycle is 141**, beginning at Bitcoin block `962,150`.

### Act before block 962,050 to make cycle 141

You cannot stake during a cycle's prepare phase — the last 100 Bitcoin blocks before the next cycle begins. For cycle 141:

| Milestone                         | Bitcoin block         |
| --------------------------------- | --------------------- |
| Epoch 4.0 activation              | `960,230`             |
| Last block to stake for cycle 141 | `962,049`             |
| Prepare phase (staking closed)    | `962,050` – `962,149` |
| Cycle 141 begins                  | `962,150`             |

Missing this window is not permanent. You can stake at any time outside a prepare phase — you simply start earning from the cycle after the one you enrol in.

### Re-enrollment: two positions, one interface

PoX-5 enforces **one staking position per Stacks principal**. There are two kinds of position, and they are mutually exclusive:

1. **STX-only staking** — no BTC commitment, no capacity limit, no auction. This is the direct continuation of PoX-4 stacking. Your reward share comes from the STX-only staking tranche of the new yield waterfall.
2. **Protocol Bond** — new and opt-in. Pairs a self-custodial BTC L1 timelock with an STX lock for a 12-cycle (\~6-month) term (`BOND_LENGTH_CYCLES = u12`).

You cannot hold a bond and an STX-only position at once, and you cannot hold two concurrent bonds. The exclusivity is keyed on your STX principal.

#### Solo versus pooled is no longer a separate path

Under PoX-4, solo stacking and delegated stacking were two different mechanisms. PoX-5 removes that split. Every staker — solo or pooled — stakes to a **signer-manager contract**. The only difference is who runs it:

* **Run your own signer-manager** and stake to it. This is what solo stacking now means.
* **Stake to someone else's signer-manager.** This is what pooling now means.

Same interface, same contract calls, same reward mechanics either way.

Because `claim-rewards` and `claim-staker-rewards` are ungated — anyone can call them to trigger distribution — any signer-manager can effectively operate as a pool. What distinguishes an operator is the **admin role**: only a signer-manager's admin can set its fee.

The reference signer-manager contract permits a fee anywhere from 0% to 99.99%. Expect public pools to deploy contracts with a lower ceiling than that, while the high end exists deliberately for cause-driven pools where participants choose to direct most or all of their rewards to a cause.

### Wallet compatibility

* **Leather** and **Xverse** support PoX-5. Update to the latest version before staking.
* **Ledger** — Stacks App `0.26.15` or higher is required for transactions that carry the new staking and PoX post-conditions.

### How you get paid

PoX-5 accumulates rewards as **sBTC**. What you receive when you claim depends on whether you have given your signer-manager a Bitcoin payout address.

* **No Bitcoin address supplied** — you are paid in sBTC.
* **Bitcoin address supplied, and your signer-manager supports it** — claiming initiates an sBTC-to-L1 withdrawal to that address, so you receive native BTC.
* **The withdrawal cannot be completed within your maximum fee** — it falls back to sBTC. You are not left stuck; the amount is reclaimable back to you.

{% hint style="info" %}
Supporting BTC payouts is a **signer-manager feature, not a protocol guarantee**. The reference contract implements it; a custom manager need not. Check before you rely on it.
{% endhint %}

The payout address is not a field in the PoX-5 contract the way a reward address was in PoX-4. You pass it as calldata on your staking transaction — a Bitcoin address plus a maximum withdrawal fee — and your signer-manager stores it against your principal. Passing new calldata on a later `stake-update` replaces it; omitting calldata clears it and returns you to sBTC payouts.

One consequence worth knowing: any signer fee is taken at the sBTC level, **before** the conversion to L1 BTC. Choosing native BTC payouts does not avoid the fee.

### Where to stake

STX-only staking is available through [Leather](https://app.leather.io/staking).

Protocol Bonds are rolling out in phases, beginning with an institutional Genesis Bond and widening to selected pools as capacity opens. Access is not yet general.

### Managing your stake

{% hint style="warning" %}
One rule governs everything in this section: **nothing can be changed during a cycle's prepare phase** — the last 100 Bitcoin blocks before the next cycle begins. Staking, stake updates and unstaking are all rejected in that window.

Most staking dapps will hide or disable these options during the prepare phase. If a transaction is broadcast anyway, it does not queue for later — it fails when it is mined.
{% endhint %}

#### Updating your stake

Under PoX-4, most changes to a stacking position cost you a cooldown cycle. PoX-5 removes that. In a single update transaction, with no missed cycle, you can:

* **Increase** the amount you stake
* **Extend** your lock by additional cycles
* **Switch signer-manager** — move to a different pool, or to one you run yourself
* **Change or clear your Bitcoin payout address** and its maximum withdrawal fee

These can be combined in one transaction.

Registration is also persistent now: you register once across all your staked cycles. Pool operators no longer submit a per-cycle commitment transaction, and `stack-aggregation-commit` is gone entirely.

**Decreasing your stake is the exception.** There is no way to reduce a stake in place. To stake a smaller amount you must unstake, wait for your STX to unlock at the end of the current cycle, and then stake again at the lower amount. That costs you a cycle of rewards — the one case where the old cooldown behaviour effectively still applies.

#### Lock length and exiting

STX-only staking commits for 1 to 96 cycles (`MAX_NUM_CYCLES = u96`). You are not trapped for that term: calling `unstake` releases you at the end of the current cycle.

Early exit is a **bond** feature, not an STX-only one, and it releases only the BTC side. A bond participant who exercises early exit forfeits undistributed yield for the remainder of the period, and their paired STX stays locked for the full bond term.

### Emission note

The coinbase block reward is **restored to 1,000 STX per Bitcoin block** at activation, reversing the SIP-029 step-down to 500 STX. This increases the total reward pool that both positions draw from.

### What does not change — and what does

STX-only staking remains fully available. A BTC commitment is never required for that path.

What does change is how STX-only rewards are calculated. Miner BTC commitments now fund a three-tranche waterfall: the protocol bond tranche is paid its predetermined target yield rate first, and the STX-only staking tranche is paid from what remains — the cycle excess — split 85% to stakers and 15% to the reserve fund tranche.

In practice this means **STX-only returns are more variable than under PoX-4**, because bond obligations are served before the STX-only pool. When miner revenue is high relative to bond commitments, STX-only stakers benefit from the excess; when it is tight, their share compresses first.

### References

* [SIP-045: PoX-5 Bitcoin Staking](https://github.com/stacksgov/sips/blob/main/sips/sip-045/sip-045-pox-5-bitcoin-staking.md)
* [Stacks Core 4.0.1 release](https://github.com/stacks-network/stacks-core/releases/tag/4.0.1)
