# Dual Stacking Smart Contract

## Overview

The Dual Stacking contract enables participants to earn boosted sBTC rewards by holding sBTC and optionally stacking STX. It operates in cycles with periodic snapshots to calculate rewards based on holdings and stacking participation.

{% hint style="info" %}
For the live dual stacking contract on mainnet, check out the contract page [here](https://explorer.hiro.so/txid/SP1HFCRKEJ8BYW4D0E3FAWHFDX8A25PPAA83HWWZ9.dual-stacking-v1?chain=mainnet).
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
#### Initialization

The contract is initialized once with a Stacks block height parameter that is the first one in the Bitcoin block specified, or after it, in case there aren't any STX blocks anchored to it.
{% endstep %}

{% step %}
#### Enrollment

Users can self-enroll for participation with custom reward addresses. DeFi protocols can be enrolled by admin with custom tracking, stacking, and reward addresses. All participants can opt-out or change their addresses at any time.
{% endstep %}

{% step %}
#### Snapshots and Cycles

Anyone can trigger periodic snapshots that capture participant sBTC balances and STX stacking amounts from on-chain data based on predefined block intervals.
{% endstep %}

{% step %}
#### Ratio Computation

After snapshots are complete, anyone can propose a golden ratio (optimal STX/sBTC ratio), tally participant distributions, and validate if their proposal meets the 95th percentile criteria to determine the benchmark for maximum rewards.
{% endstep %}

{% step %}
#### Weight Calculation

Anyone can trigger participant weight calculations using the validated dual stacking formula that provides up to 10x boost (configurable) for those who meet or exceed the golden ratio.
{% endstep %}

{% step %}
#### Rewards

Anyone can trigger reward distribution every cycle based on calculated weights. Administrators can update configurations like APR, yield boost multiplier, snapshot length, and number of snapshots per cycle.
{% endstep %}

{% step %}
#### Administrative Controls

Admins maintain protocol parameters, enroll/opt-out DeFi protocols with special address configurations, manage whitelists and blacklists, and can perform emergency operations if needed.
{% endstep %}
{% endstepper %}

***

## Cycle Structure

* Each cycle consists of a fixed number of snapshots (default 14).
* Each snapshot occurs after a set number of Bitcoin blocks (default 150).
* The total cycle length is thus 2100 Bitcoin blocks by default (14 snapshots × 150 blocks).
* These defaults can be adjusted for production environments (e.g., 1 snapshot per day with appropriate block counts).

## Dual Stacking Formula

Weight Calculation:

$$
w_i = \cfrac{[B_i \cdot (1 + M \cdot \sqrt{r_i})]}{n}
$$

Where:

* _w_<sub>_i_</sub>_&#x20;= weight for user i_
* _B_<sub>_i_</sub>_&#x20;= sBTC balance of user i (sum across all snapshots)_
* _M = yield boost multiplier (default 9, meaning max boost of 10x)_
* _r_<sub>_i_</sub>_&#x20;= min(d_<sub>_i_</sub>_/D, 1), the ratio adjustment factor_
* _d_<sub>_i_</sub>_&#x20;= S_<sub>_i_</sub>_/B_<sub>_i_</sub>_, user's personal STX/sBTC ratio_
* _S_<sub>_i_</sub>_&#x20;= STX stacked by user i (sum across all snapshots)_
* _D = golden ratio (95th percentile STX/sBTC ratio across all participants)_
* _n = number of snapshots per cycle (default 14)_

Rewards Distribution:

$$
R_i = (\frac{w_i}{Σw}) \cdot Total Rewards
$$

Where:

* _R_<sub>_i_</sub>_&#x20;= reward for user i_
* _Σw = sum of all participant weights_
* _Total Rewards = min(pool balance, APR-based cap)_

Key Properties:

* _Participants with d_<sub>_i_</sub>_&#x20;≥ D receive maximum boost of (M+1) x (default 10x)._
* _Participants with d_<sub>_i_</sub>_&#x20;= 0 (no STX stacked) receive base rewards (1x)._
* _Boost scales with the square root of the ratio for intermediate values._
* _Whitelisted DeFi tracking addresses automatically receive maximum boost without needing to stack STX._
* _Weights are divided by the number of snapshots per cycle to normalize across the cycle duration._

***

## Cycle Workflow

The Dual Stacking smart contract operates in cycles, each divided into snapshots. The process ensures accurate reward distribution through a series of permissionless operations that anyone can execute.

{% stepper %}
{% step %}
#### Snapshot Phase (Anyone Can Execute)

* capture-snapshot-balances: Anyone can capture balances for enrolled users after each snapshot.
* advance-to-next-snapshot: Anyone can transition to the next snapshot.
* finalize-snapshots: Anyone can conclude all snapshot data after the final snapshot.
{% endstep %}

{% step %}
#### Ratio Validation Phase (Competitive & Permissionless)

* propose-golden-ratio: Anyone can propose a golden ratio.
* tally-participant-ratios: The proposer tallies participant ratios relative to their proposed ratio.
* validate-ratio: The proposer validates their proposal — succeeds only if it represents the 95th percentile.
* Multiple proposals can be submitted; the first valid one locks in for the cycle.
{% endstep %}

{% step %}
#### Weight Computation Phase (Anyone Can Execute)

* calculate-participant-weights: Anyone can calculate participant weights using the dual stacking formula.
* finalize-weight-computation: Anyone can finalize weight computation.
{% endstep %}

{% step %}
#### Reward Distribution Phase (Anyone Can Execute)

* set-is-distribution-enabled: Anyone can enable reward distribution by determining the available reward pool.
* distribute-rewards: Anyone can distribute rewards to enrolled users based on their weights.
* finalize-reward-distribution: Anyone can finalize reward distribution after all participants are rewarded.
{% endstep %}

{% step %}
#### Cycle Transition (Anyone Can Execute)

* advance-to-next-cycle: Anyone can advance to the next cycle after all rewards are distributed.
{% endstep %}
{% endstepper %}

Note: All operations read data directly from the blockchain (sBTC balances from the sBTC token contract, STX stacking from native Stacks protocol). No off-chain data sources or trusted intermediaries are required.

***

## Public Functions

### 1. Contract Initialization

#### initialize-contract

Activates the contract with an initial cycle.

* Parameters: stx-block-height (uint)
* Assertions:
  * Current Bitcoin block height must be >= the configured cycle start Bitcoin block height.
  * The contract must not be active.
  * The Stacks block height must bracket the configured Bitcoin block height.
* Effect:
  * Initializes state variables for the first cycle and marks the contract as active.
  * Records cycle data and the first snapshot.

#### update-initialize-block

Updates the initialization Bitcoin block height before the contract is activated.

* Parameters: new-bitcoin-block-height (uint)
* Assertions:
  * Contract must not be active.
  * Caller must be the admin.
* Effect:
  * Updates the starting Bitcoin block height for the first cycle.

#### update-cycle-data-before-initialized

Updates both the snapshots per cycle and blocks per snapshot for the first cycle before initialization.

* Parameters: updated-snapshots-per-cycle (uint), updated-blocks-per-snapshot (uint)
* Assertions:
  * Contract must not be active.
  * Caller must be the admin.
* Effect:
  * Sets the cycle structure for the first cycle.

***

### 2. Enrollment

#### enroll

Enrolls the caller for rewards in future cycles.

* Parameters: rewarded-address (optional principal)
* Assertions:
  * Caller must not already be enrolled.
  * Caller must not be blacklisted.
  * Caller must hold at least the minimum required sBTC amount.
* Effect:
  * Adds the caller to the participants map with tracking, stacking, and rewarded addresses set appropriately.
  * Increments the next cycle participant count.

#### enroll-defi

Enrolls a DeFi protocol for rewards with custom addresses (admin only).

* Parameters:
  * defi-contract (principal)
  * tracking-address (principal)
  * rewarded-address (principal)
  * stacking-address (optional principal)
* Assertions:
  * Caller must be the admin.
  * DeFi contract must not already be enrolled.
  * DeFi contract must not be blacklisted.
* Effect:
  * Adds the DeFi protocol to the participants map with custom addresses.
  * Increments the next cycle participant count.

#### enroll-defi-batch

Batch enroll multiple DeFi protocols (admin only).

* Parameters: defi-contracts (list 900 {...})
* Assertions:
  * Caller must be the admin.
* Effect:
  * Enrolls multiple DeFi protocols in a single transaction.

#### opt-out

Allows the caller to opt out of participation in future cycles.

* Assertions:
  * Caller must be enrolled.
* Effect:
  * Removes the caller from the participants map.
  * Decrements the next cycle participant count.

#### opt-out-defi

Opts out a DeFi protocol from participation (admin only).

* Parameters: defi-contract (principal)
* Assertions:
  * Caller must be the admin.
  * DeFi contract must be enrolled.
* Effect:
  * Removes the DeFi protocol from the participants map.

#### opt-out-defi-batch

Batch opt out multiple DeFi protocols (admin only).

* Parameters: defi-contracts (list 200 principal)
* Assertions:
  * Caller must be the admin.
* Effect:
  * Opts out multiple DeFi protocols in a single transaction.

***

### 3. Participant Address Management

* change-reward-address
* change-reward-address-defi
* change-stacking-address-defi
* change-tracking-address-defi
* change-addresses-defi
* change-addresses-defi-batch

(Each function has parameters, admin assertions where applicable, and updates participant/DeFi addresses as described in the original spec.)

***

### 4. Snapshots and Cycles

#### capture-snapshot-balances

Captures snapshot balances for a list of participants at the current snapshot block height. Permissionless.

* Parameters: principals (list of up to 900 principals)
* Assertions:
  * The contract must be active.
  * The current snapshot Stacks block height must be available.
* Effect:
  * Reads sBTC balance from the sBTC token contract for each participant.
  * Reads STX stacked amount from native Stacks protocol (including liquid stacking if enabled).
  * Updates snapshot totals and participant holdings.
  * Tracks stacking and tracking addresses.

#### advance-to-next-snapshot

Advances the contract to the next snapshot within the current cycle. Permissionless.

* Parameters: new-stx-block-height (uint)
* Assertions:
  * The contract must be active.
  * All participants must be snapshotted.
  * Current Bitcoin block height must have reached the next snapshot block.
  * The cycle must not have ended.
  * The Stacks block height must bracket the next snapshot Bitcoin block height.
* Effect:
  * Increments snapshot index.
  * Aggregates snapshot totals into cycle totals.
  * Resets snapshot counters.
  * Records the new snapshot block heights.

#### finalize-snapshots

Finalizes all snapshots for the current cycle after the last snapshot is complete. Permissionless.

* Assertions:
  * The contract must be active.
  * Snapshots must not already be finalized.
  * Must be on the last snapshot of the cycle.
  * All participants must be snapshotted in the final snapshot.
* Effect:
  * Aggregates the final snapshot totals into cycle totals.
  * Marks snapshots as finalized.
  * Sets last operation state to "concluded".
  * Enables the ratio proposal phase.

#### advance-to-next-cycle

Advances the contract to the next cycle after all rewards are distributed. Permissionless.

* Parameters: stx-block-height (uint)
* Assertions:
  * The contract must be active.
  * Current Bitcoin block height must have reached the next cycle.
  * All participants must be rewarded.
  * Reward distribution must be finalized.
  * The Stacks block height must bracket the next cycle Bitcoin block height.
* Effect:
  * Increments cycle ID.
  * Resets state variables for the new cycle.
  * Updates cycle configuration from next-cycle settings.
  * Initializes the first snapshot of the new cycle.

***

### 5. Ratio Computation and Validation

#### propose-golden-ratio

Proposes a golden ratio for the current cycle. Permissionless.

* Parameters: ratio (uint) — proposed ratio scaled by 10^8
* Assertions:
  * Snapshots must be finalized.
  * A ratio must not already be validated for this cycle.
  * The caller must not have already proposed a ratio for this cycle.
* Effect:
  * Records the proposed ratio for the caller.
  * Initializes tracking for participant tallying.
  * Sets last operation state to "proposed-ratio".

#### change-proposed-golden-ratio

Change a previously proposed golden ratio before validation.

* Parameters: ratio (uint)
* Assertions:
  * The caller must have already proposed a ratio.
  * The ratio must not yet be validated.
* Effect:
  * Updates the proposed ratio and resets tally data.

#### tally-participant-ratios

Tallies how many participants have ratios above, below, or equal to the proposed golden ratio.

* Parameters: principals (list of up to 900 principals)
* Assertions:
  * The caller must have proposed a ratio.
  * The ratio must not yet be validated.
  * Must not have already tallied all participants.
* Effect:
  * Computes each participant's STX/sBTC ratio.
  * Tracks sBTC amounts above, below, and equal to the proposed ratio.
  * Increments participants counted.

#### validate-ratio

Validates that the proposed ratio represents the 95th percentile of participant ratios.

* Assertions:
  * The caller must have proposed a ratio.
  * All participants must be tallied.
  * The ratio must not already be validated.
  * If no STX is stacked by anyone, ratio must equal 1.0 (baseline).
  * sBTC above the ratio must be ≤ 5% of total sBTC.
  * sBTC at or above the ratio must be ≥ 5% of total sBTC.
* Effect:
  * Marks the ratio as validated.
  * Records the validated ratio for the cycle.
  * Sets last operation state to "ratio-validated".

#### set-max-percentage-above-ratio

Updates the percentage threshold for validation (admin only).

* Parameters: new-max-percentage-above-ratio (uint) — default 500 = 5%
* Assertions:
  * Caller must be the admin.
* Effect:
  * Updates the validation threshold.

***

### 6. Weight Computation

#### calculate-participant-weights

Calculates participant weights using the dual stacking formula. Permissionless.

* Parameters: principals (list of up to 900 principals)
* Assertions:
  * The ratio must be validated.
  * The current cycle Stacks block height must be available.
* Effect:
  * Retrieves validated golden ratio D.
  * Applies minimum threshold to D to prevent division by zero $$D = max(D, 10^-8)$$.
  * For each participant, computes weight using: $$w_i = \cfrac{[B_i \cdot (1 + M \cdot √r_i)]}{n}$$
  * Accumulates total weights in total-weights-sum.
  * Records individual weights per tracking address (not per enrolled address).

Notes:

* Multiple enrolled addresses sharing the same tracking address will share the same weight.
* Can be called in batches of up to 900 participants.

#### finalize-weight-computation

Finalizes the weight computation phase. Permissionless.

* Assertions:
  * The ratio must be validated.
  * Weights must not already be finalized.
  * All participants must have weights computed.
* Effect:
  * Marks weights as computed.
  * Sets last operation state to "weights-finalized".
  * Enables the reward distribution phase.

***

### 7. Reward Distribution

#### set-is-distribution-enabled

Prepares the contract to distribute rewards by determining the available reward pool. Permissionless.

* Assertions:
  * The contract must be active.
  * Distribution must not already be enabled.
  * Weights must be computed.
* Effect:
  * Reads the contract's sBTC balance.
  * Calculates rewards to distribute: min(pool balance, APR-based cap).
  * The cap is: $$(CPR × total-weights-sum) / (M + 1)$$
  * Marks rewards as ready for distribution.
  * Sets last operation state to "set-can-distribute".

#### distribute-rewards

Distributes rewards to participants based on their computed weights. Permissionless.

* Parameters: principals (list of up to 900 principals)
* Assertions:
  * Distribution must be enabled.
* Effect:
  * Calculates reward for each participant: (weight / total-weights) × total-rewards
  * Transfers sBTC rewards to rewarded addresses.
  * Marks participants as rewarded.
  * Aggregates rewards per rewarded address.

Notes:

* Can be called in batches of up to 900 participants.
* Multiple enrolled addresses sharing the same rewarded address aggregate rewards and only trigger one transfer per tracking address.

#### finalize-reward-distribution

Marks reward distribution as finalized for the current cycle. Permissionless.

* Assertions:
  * The contract must be active.
  * All participants must be rewarded.
  * Distribution must be enabled.
  * Must not already be finalized.
* Effect:
  * Records the finalization block height.
  * Sets last operation state to "finalized".
  * Enables cycle advancement.
  * Triggers external DeFi protocols to distribute their internal rewards (they monitor this finalization event).

***

### 8. Administrative Controls

* update-admin
* update-min-sbtc-hold-required-for-enrollment
* update-snapshot-length
* update-snapshots-per-cycle
* update-cycle-data
* update-bitcoin-blocks-per-year
* update-APR
* update-yield-boost-multiplier
* set-liquid-stacking
* emergency-withdraw-sbtc

(Each of the above has parameters, admin-only assertions where applicable, and effects described in the original spec. Notable constraints include APR bounds and multiplier bounds.)

***

### 9. Blacklist Management

* add-blacklisted
* add-blacklisted-batch
* remove-blacklisted
* remove-blacklisted-batch

(Admin-only operations to manage blacklist; adding an enrolled address auto opts it out.)

***

### 10. DeFi Whitelist Management

#### whitelist-defi-tracking

Adds a DeFi tracking address to the whitelist (gives maximum weight boost automatically).

* Parameters: defi-rewards-contract (principal)
* Assertions:
  * Caller must be the admin.
  * Address must not already be whitelisted.
* Effect:
  * Adds the tracking address to the whitelist.
  * Whitelisted addresses receive maximum boost (r<sub>i</sub> = 1.0) in weight calculations.
  * During snapshots, whitelisted addresses have their STX stacking recorded as 0 (they don't need to stack STX to receive max boost).

#### remove-whitelisted-defi-tracking

Removes a DeFi tracking address from the whitelist (admin only).

* Parameters: defi-rewards-contract (principal)
* Assertions:
  * Caller must be the admin.
  * Address must be whitelisted.
* Effect:
  * Removes the tracking address from the whitelist.

#### remove-whitelisted-defi-tracking-batch

Batch removes DeFi tracking addresses from the whitelist (admin only).

* Parameters: defi-rewards-contract (list 200 principal)
* Assertions:
  * Caller must be the admin.
* Effect:
  * Removes multiple tracking addresses from the whitelist.

***

## Private Functions

* update-snapshot-for-new-cycle: Resets snapshot counters and sets initial snapshot block heights.
* reset-state-for-cycle: Applies next-cycle configuration, resets flags and totals, records cycle data, updates participant count.
* capture-participant-balances: Reads sBTC and STX stacked at snapshot height, updates holdings and aggregates totals.
* calculate-participant-weight: Computes weight per tracking address using the dual stacking formula (integer math details in original spec).
* tally-user-ratio: Classifies a user's ratio relative to a proposed ratio and accumulates sBTC totals.
* distribute-reward-user: Transfers reward per tracking address and updates rewarded status.
* remove-participant: Deletes participant and decrements counts.
* enroll-defi-one / change-addresses-defi-one: helpers for batch operations.
* is-blacklisted: checks blacklist membership.

(Private functions implement the described effects and integer scaling considerations; refer to function details above for math/scaling behavior.)

***

## Read-Only Functions

### Cycle Information

* get-current-cycle-id
* cycle-data
* get-cycle-current-state
* current-overview-data
* get-yield-cycle-data
* nr-cycles-year
* cycle-percentage-rate

### Snapshot Information

* snapshot-data
* get-stacks-block-height-for-cycle-snapshot
* get-bitcoin-block-height-for-cycle-snapshot

### Reward Information

* get-reward-distribution-status
* is-distribution-ready
* reward-amount-for-cycle-and-address
* reward-amount-for-cycle-and-reward-address
* is-distribution-finalized-for-current-cycle
* get-distribution-finalized-at-height

### Ratio and Weight Information

* get-ratio-data
* get-weight-computation-status
* get-participant-weight

### Participant Information

* is-enrolled-in-next-cycle
* is-enrolled-this-cycle
* get-is-blacklisted
* get-is-blacklisted-list
* get-is-whitelisted-defi
* get-latest-reward-address
* get-participant-cycle-info

### State and Configuration

* get-last-operation-state
* get-admin
* get-is-contract-active
* get-current-bitcoin-block-height
* get-minimum-enrollment-amount
* get-next-action-bitcoin-height
* get-contract-sbtc-balance
* get-apr-data

### STX Stacking Queries

* get-amount-stx-stacked
* get-amount-stx-stacked-at-block-height
* get-amount-stacked-at-block-height
* get-amount-stacked-now
