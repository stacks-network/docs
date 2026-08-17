---
description: Implementation guidance for PoX-5, grouped by interaction cluster.
---

# Development

This section walks through PoX-5 from the SDK's perspective. Pages are grouped by the interaction shape they cover rather than by actor — most users hit more than one cluster (a partner onboards, reads their position, enrolls in a paired bond, claims rewards, then renews).

All examples use [`@stacks/bitcoin-staking`](https://github.com/hirosystems/stacks.js/tree/feat/bitcoin-staking/packages/bitcoin-staking) for the PoX-5 surface and `@stacks/transactions` for signing and broadcast. The actor-oriented overview lives at [Actors](../actors/); these pages assume you already know which path you're building for.

### How the flow unfolds

A typical integration moves through five stages. The third one forks based on which path your user takes — most apps support more than one.

1. **Read current state** — [Read-Only Queries](read-only.md) Before any transaction, fetch the current bond index, your user's allowlist row, and any positions they already hold. Pure on-chain reads through the SDK's `fetch*` helpers. This answers "where are we in the cycle and what is this user permitted to do right now?" Every later step branches off what you learn here.
2. **One-time onboarding** — [Onboarding](onboarding.md) Bootstrapping transactions that configure _who is allowed to do what_: the allowlist and parameters the Endowment submits before a bond is published. No yield-bearing capital moves at this stage, and a returning user may have most of it already in place. If you operate signer infrastructure, [Advanced › Signers](advanced/signers.md) covers the signer-key grants and revocations stakers route through.
3.  **Open a position** — your user commits assets through one of three paths:

    <table data-view="cards"><thead><tr><th></th><th></th><th data-hidden data-card-target data-type="content-ref"></th></tr></thead><tbody><tr><td><strong>Paired BTC</strong></td><td>L1 BTC timelock + L2 STX lock. Institutional, T1 paired yield, self-custodial.</td><td><a href="paired-btc.md">paired-btc.md</a></td></tr><tr><td><strong>Solo STX</strong></td><td>STX-only stack, no BTC commitment. Earns T3 residual after T1 and reserve.</td><td><a href="solo-stx.md">solo-stx.md</a></td></tr><tr><td><strong>Pool</strong></td><td>sBTC + STX through a whitelisted pool operator. Lower friction, shared envelope.</td><td><a href="pools.md">pools.md</a></td></tr></tbody></table>

    Each path has its own transaction shape, but they share the same prerequisites you established in steps 1–2.
4. **Receive rewards** — [Rewards](rewards.md) Distributions are pulled, not pushed — `calculate-rewards` and `claim-rewards` are open entrypoints anyone can call to settle a cycle. Your job is to read accumulated reward balances, surface them to the user, and offer a claim path. Payout is in sBTC; a staker who elected a BTC reward address receives an L1 withdrawal handled in the signer-manager layer, not in pox-5.
5. **Renew or exit** — re-lock window (D172 → D182) In the last 1,050 Bitcoin blocks (`reward-cycle-length / 2`, ≈ 7.3 days on mainnet) of a bond, the L1 timelock has expired but STX is still locked. Your user either constructs the next L1 timelock to roll into the next bonding period without losing continuity, or exits and lets STX unlock at D182. This UX is covered inline on the [Paired BTC](paired-btc.md) and [Rewards](rewards.md) pages.

### Pages

<table data-view="cards"><thead><tr><th></th><th data-hidden data-card-target data-type="content-ref"></th></tr></thead><tbody><tr><td><strong>Onboarding</strong></td><td><a href="onboarding.md">onboarding.md</a></td></tr><tr><td><strong>Read-Only Queries</strong></td><td><a href="read-only.md">read-only.md</a></td></tr><tr><td><strong>Paired BTC</strong></td><td><a href="paired-btc.md">paired-btc.md</a></td></tr><tr><td><strong>Solo STX</strong></td><td><a href="solo-stx.md">solo-stx.md</a></td></tr><tr><td><strong>Pools</strong></td><td><a href="pools.md">pools.md</a></td></tr><tr><td><strong>Rewards</strong></td><td><a href="rewards.md">rewards.md</a></td></tr><tr><td><strong>Advanced</strong></td><td><a href="advanced/">advanced</a></td></tr></tbody></table>

This section walks through PoX-5 from the SDK's perspective. Pages are grouped by the interaction shape they cover rather than by actor — most users hit more than one cluster (a partner onboards, reads their position, enrolls in a paired bond, claims rewards, then renews).

All examples use [`@stacks/bitcoin-staking`](https://github.com/hirosystems/stacks.js/tree/feat/bitcoin-staking/packages/bitcoin-staking) for the PoX-5 surface and `@stacks/transactions` for signing and broadcast. The actor-oriented overview lives at [Actors](../actors/); these pages assume you already know which path you're building for.

### How the flow unfolds

A typical integration moves through five stages. The third one forks based on which path your user takes — most apps support more than one.

1. **Read current state** — [Read-Only Queries](read-only.md) Before any transaction, fetch the current bond index, your user's allowlist row, and any positions they already hold. Pure on-chain reads through the SDK's `fetch*` helpers. This answers "where are we in the cycle and what is this user permitted to do right now?" Every later step branches off what you learn here.
2. **One-time onboarding** — [Onboarding](onboarding.md) Bootstrapping transactions that configure _who is allowed to do what_: the allowlist and parameters the Endowment submits before a bond is published. No yield-bearing capital moves at this stage, and a returning user may have most of it already in place. If you operate signer infrastructure, [Advanced › Signers](advanced/signers.md) covers the signer-key grants and revocations stakers route through.
3.  **Open a position** — your user commits assets through one of three paths:

    <table data-view="cards"><thead><tr><th></th><th></th><th data-hidden data-card-target data-type="content-ref"></th></tr></thead><tbody><tr><td><strong>Paired BTC</strong></td><td>L1 BTC timelock + L2 STX lock. Institutional, T1 paired yield, self-custodial.</td><td><a href="paired-btc.md">paired-btc.md</a></td></tr><tr><td><strong>Solo STX</strong></td><td>STX-only stack, no BTC commitment. Earns T2 residual after T1, ahead of the reserve.</td><td><a href="solo-stx.md">solo-stx.md</a></td></tr><tr><td><strong>Pool</strong></td><td>sBTC + STX through a whitelisted pool operator. Lower friction, shared envelope.</td><td><a href="pools.md">pools.md</a></td></tr></tbody></table>

    Each path has its own transaction shape, but they share the same prerequisites you established in steps 1–2.
4. **Receive rewards** — [Rewards](rewards.md) Distributions are pulled, not pushed — `calculate-rewards` and `claim-rewards` are open entrypoints anyone can call to settle a cycle. Your job is to read accumulated reward balances, surface them to the user, and offer a claim path. Payout is in sBTC; a staker who elected a BTC reward address receives an L1 withdrawal handled in the signer-manager layer, not in pox-5.
5. **Renew or exit** — re-lock window (D172 → D182) In the last 1,050 Bitcoin blocks (`reward-cycle-length / 2`, ≈ 7.3 days on mainnet) of a bond, the L1 timelock has expired but STX is still locked. Your user either constructs the next L1 timelock to roll into the next bonding period without losing continuity, or exits and lets STX unlock at D182. This UX is covered inline on the [Paired BTC](paired-btc.md) and [Rewards](rewards.md) pages.

### Pages

<table data-view="cards"><thead><tr><th></th><th data-hidden data-card-target data-type="content-ref"></th></tr></thead><tbody><tr><td><strong>Onboarding</strong></td><td><a href="onboarding.md">onboarding.md</a></td></tr><tr><td><strong>Read-Only Queries</strong></td><td><a href="read-only.md">read-only.md</a></td></tr><tr><td><strong>Paired BTC</strong></td><td><a href="paired-btc.md">paired-btc.md</a></td></tr><tr><td><strong>Solo STX</strong></td><td><a href="solo-stx.md">solo-stx.md</a></td></tr><tr><td><strong>Pools</strong></td><td><a href="pools.md">pools.md</a></td></tr><tr><td><strong>Rewards</strong></td><td><a href="rewards.md">rewards.md</a></td></tr><tr><td><strong>Questionnaire Flow</strong></td><td><a href="/broken/pages/jKTM0VCdfi4mFSVGKqNk">Broken link</a></td></tr><tr><td><strong>Advanced</strong></td><td><a href="advanced/">advanced</a></td></tr></tbody></table>
