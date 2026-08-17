---
description: Implementation guidance for PoX-5, grouped by interaction cluster.
---

# Development

This section walks through PoX-5 from the integrator's perspective. Pages are grouped by the interaction shape they cover rather than by actor — most users hit more than one cluster (a partner onboards, reads their position, enrolls in a paired bond, claims rewards, then renews).

All examples use [`@stacks/bitcoin-staking`](https://github.com/hirosystems/stacks.js/tree/feat/bitcoin-staking/packages/bitcoin-staking) for the PoX-5 surface and `@stacks/transactions` for signing and broadcast. The actor-oriented overview lives at [Actors](../actors/); these pages assume you already know which path you're building for.

### How the flow unfolds

A typical integration moves through four stages. The second one forks based on which path your user takes — most apps support more than one.

1. **Get allowlisted and onboard** — [Onboarding](onboarding.md) Native-bond participation in PoX-5 is allowlisted. To get your users (or your platform) on a bond's allowlist, you communicate with the Stacks Endowment off-chain; the Endowment publishes the allowlist and bond parameters on-chain before each bond opens. Plan for this contact early — it is not an API call. A later, permissionless protocol version (PoX-6) is expected to remove this manual step. If you operate signer infrastructure, [Advanced › Signers](advanced/signers.md) covers signer-key grants and revocations.
2. **Open a position** — your user commits assets through one of three paths:
   * [**Paired BTC**](paired-btc.md) — L1 BTC timelock + L2 STX lock. Institutional, T1 paired yield, self-custodial.
   * [**Solo STX**](solo-stx.md) — STX-only stake, no BTC commitment. Earns T3 residual after T1 and reserve.
   * [**Pool**](pools.md) — sBTC + STX through a whitelisted pool operator. Lower friction, shared envelope.
3. **Receive rewards** — [Rewards](rewards.md) Distributions are pulled, not pushed. Your job is to read accumulated reward balances, show them to the user, and offer a claim path. Payout is in sBTC; an optional L1 BTC payout is handled in the signer-manager layer. The Rewards page covers the read and claim calls.
4. **Renew or exit** — [Paired BTC › Renew](paired-btc.md#renew-into-the-next-bond-period) In roughly the last week of a bond, the L1 timelock has expired but STX is still locked. Your user either constructs the next L1 timelock to roll into the next bonding period without losing continuity, or exits and lets STX unlock at the bond's end. The [Paired BTC](paired-btc.md) and [Rewards](rewards.md) pages cover this flow.
