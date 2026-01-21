# Dual Stacking Smart Contract - 2026 Edition

## Overview

The Dual Stacking contract enables participants to earn boosted sBTC rewards by holding sBTC and optionally stacking STX. It operates in cycles with periodic snapshots to calculate rewards based on holdings and stacking participation.

{% hint style="info" %}
**Current Version:** The contract was successfully upgraded to `.dual-stacking-v2_0_2` on December 15, 2025.

For the live dual stacking contract on mainnet, check out the contract page [here](https://explorer.hiro.so/txid/SP1HFCRKEJ8BYW4D0E3FAWHFDX8A25PPAA83HWWZ9.dual-stacking-v2_0_2?chain=mainnet).

**v2.0.2 Upgrade Features (December 2025):**
- More flexible reward parameters for dynamic APR adjustments
- Enhanced visibility of sBTC holdings and rewards within the Dual Stacking web app
- Improved UI/UX for tracking participant balances and reward composition
- Automatic migration for existing v1 participants (no action required if previously enrolled)
- Enhanced dashboard metrics and real-time reward calculations
{% endhint %}

### Decentralized Architecture

* Permissionless operations: Anyone can execute critical cycle operations including snapshot capturing, ratio proposal/validation, weight calculation, and reward distribution.
* On-chain data only: All participant data (sBTC balances, STX stacking amounts) is read directly from the blockchain — no off-chain oracles or trusted data sources required.
* Competitive ratio discovery: Multiple participants can propose different golden ratios; the system validates based on mathematical criteria (95th percentile), not admin approval.
* Transparent execution: All operations are executed on-chain with verifiable results and public event logs.
* Self-service enrollment: Users can enroll, opt-out, and manage their participation independently.

### Main Operations

{% stepper %}
{% step %}
**Initialization**

The contract is initialized once with a Stacks block height parameter that is the first one in the Bitcoin block specified, or after it, in case there aren't any STX blocks anchored to it.

**Note:** As of the v2.0.2 upgrade, enrollment status is now more clearly displayed in the web app dashboard at app.stacks.co.
{% endstep %}

{% endstep %}

{% step %}
**Enrollment**

Users can self-enroll for participation with custom reward addresses. DeFi protocols can be enrolled by admin with custom tracking, stacking, and reward addresses. All participants can opt-out or change their addresses at any time.

**Note:** As of the v2.0.2 upgrade, enrollment status is now more clearly displayed in the web app dashboard at app.stacks.co.
{% endstep %}

{% step %}
**Snapshots and Cycles**

Anyone can trigger periodic snapshots that capture participant sBTC balances and STX stacking amounts from on-chain data based on predefined block intervals.
{% endstep %}

{% step %}
**Ratio Computation**

After snapshots are complete, anyone can propose a golden ratio (optimal STX/sBTC ratio), tally participant distributions, and validate if their proposal meets the 95th percentile criteria to determine the benchmark for maximum rewards.
{% endstep %}

{% step %}
**Weight Calculation**
Anyone can trigger participant weight calculations using the validated dual stacking formula that provides up to 10x boost (configurable) for those who meet or exceed the golden ratio.
{% endstep %}
