---
description: >-
  Terms for PoX-5 Bitcoin Staking, protocol bonds, the waterfall, and
  staking.stacks.co—aligned with the launch scope, product app note, and
  Waterfall white paper.
---

# Glossary

### Allocation (bond capacity)

How much BTC (and paired STX at the published ratio) a whitelisted partner or pool may commit for a bonding period. The app shows allocation state as **Allocated**, **Pending**, or **Not whitelisted** after wallet connect.

### APY (target)

Annual percentage yield framing for what the program **targets** on paired BTC for a bonding period—not a guaranteed return; realized payouts depend on miner revenue, reserve, and waterfall distribution.

### Auction (capacity allocation)

Mechanism to ration limited Tranche 1 BTC yield capacity. In the **PoX-6** end state this is permissionless and sealed-bid; in **PoX-5** the Endowment sets capacity and allocations administratively while longer-form docs still describe auction shape for the future.

### Auction window

Roughly the week before a bonding period when parameters are published and (in fully decentralized form) bids are collected.

### Auto-bridge (sBTC)

Default path that routes miner BTC into **sBTC** for reward distribution on L2; participants may opt out to receive L1 BTC instead where supported.

### Available capacity and capacity allocation (PoX-5)

Two principal parameters the Endowment sets manually each bonding period in bootstrap: how much BTC capacity exists and how it is split among partners and pools.

### Bitcoin Staking

Stacks' evolution of Proof-of-Transfer: participants can earn **BTC-denominated** yield while BTC remains under self-custodial timelocks (native BTC path) or, via pools, as sBTC on L2. Eligibility and tranches differ from PoX-4.

### Bitcoin bond

Shorthand in the white paper for a **protocol bond** whose Bitcoin leg is native BTC (paired with STX).

### Bond period index

A whole number that identifies one bonding period's entry in the contract. Bond period **0** is the first; the admin picks each new `bond-index` when setting up a bond, and setup rejects a repeated index. Functions that touch a single bond — `register-for-bond`, `unstake-sbtc`, `announce-l1-early-exit`, `update-bond-registration` — take or look up this index to know which bond period they are acting on. The reward entrypoints `calculate-rewards` and `claim-rewards` can address up to six bond periods at once.

### Bonding period

About **six months** of Bitcoin blocks (**25,200** in the time-intervals table), running from **Day 0** through **Day 182**, with six such periods staggered and overlapping at steady state.

### Bootstrap phase (PoX-5)

Managed program phase before full on-chain auction and algorithmic parameters: Endowment sets capacity, ratio, allocations, and comms; reserve may accrue in a constrained mode until PoX-6 activates further behaviors.

### BTC capacity envelope (pool)

The Endowment-negotiated **cap** on how much BTC-equivalent exposure a whitelisted pool can enroll against from the community tranche.

### BTC SPV proof

A Simplified Payment Verification (SPV) proof shows that a Bitcoin transaction is confirmed on the Bitcoin chain, without needing a full Bitcoin node. It bundles a block header with a merkle-path (a set of hashes) that ties one transaction's output to that header. Anyone holding the header and the path can check the transaction was included in that block.

At registration, `register-for-bond` submits this proof for each L1 lockup output. The contract checks the Bitcoin block header, confirms the transaction's merkle inclusion in that block, and confirms the targeted output's script matches the expected [P2WSH lockup output](glossary.md#lockup-script-p2wsh-lockup-output). It also confirms the output's committed unlock height falls within the bond's allowed window, that the output amount matches what the staker declared, and that the same output is not reused across a registration. Any failed check reverts the registration. See [Bitcoin's SPV documentation](https://developer.bitcoin.org/devguide/operating_modes.html#simplified-payment-verification-spv) for the general mechanism.

### Burn address (PoX-4 prepare phase)

During the last part of each PoX-4 cycle, PoX payouts go to a burn address in the prepare phase—a baseline contrast when explaining cadence changes under PoX-5.

### Capacity asset (STX role)

In protocol bonds, **STX** is framed as the asset that gates participation and signing weight while **BTC** is the yield-bearing leg; paired STX in Tranche 1 does not earn stacking yield.

### Clearing yield

Auction outcome: the **highest accepted** yield bid in uniform-price clearing; winners earn that clearing yield. Distinct from **target yield** published ahead of clearing.

### Community tranche (\~10%)

Share of Tranche 1 capacity reserved for retail-facing **whitelisted pool operators** during PoX-5.

### Confirmation phase (L1 lock-up)

Window in which participants must finish **L1 BTC timelocks** after allocation and before **Day 0**; table rows tie this to PoX-5 rolling issuance.

### Cooldown (removed)

PoX-5 removes the old cooldown rule for many flows: reward address, signer, and similar updates are intended **before the next prepare phase** without missing a cycle.

### Commit–reveal (auction)

Optional sealed-bid mechanism where bids are committed privately then **revealed together** at clearing to reduce **sniping** and last-block gaming in permissionless auction designs.

### Coverage ratio

Health metric: **reward pool per cycle ÷ paired BTC obligations per cycle**; bands (e.g. healthy, stressed) drive issuance and reserve use in the economic model.

### Cycle boundary

Stacks/PoX timing milestone used for signer set transitions, payouts, and UI copy (e.g. STX unlock "at the next cycle boundary" after period rules are satisfied).

### Cycle excess

Miner revenue remaining after **Tranche 1** obligations in a cycle; split per policy between the **STX-only staking tranche** and the **reserve fund tranche**.

### Custodial aggregation

Custody providers aggregating many clients' positions; bounded in reward design notes by **actually locked STX** and auction economics.

### Day 0, Day 175, and Day 182 (bond timeline)

"Day" numbers count days since the start of a bonding period. **Day 0** is day zero: the cutoff when paired BTC (L1) and STX (L2) must be locked to be eligible. **Day 175** is around day 175: the day the **L1 timelock expires**. **Day 182** is around day 182: the day the bond ends on L2.

* **Day 0** — the bond's start and lock cutoff. Paired BTC and STX must both be locked by this point.
* **Day 175** — the L1 timelock expires. STX remains locked on L2.
* **Day 182** — the bond ends on L2. STX unlock follows protocol rules.

### Drawdown priority (paired BTC)

White-paper design term for how a shortfall would be distributed among paired positions if the reserve were exhausted (ordering by STX price at lock time). `pox-5.clar` defines no per-position shortfall ordering: reward accounting is flat per-token (`rewards-per-token-for-cycle`), and the reserve accrues a fixed `RESERVE_RATIO` cut ([pox-5.clar:107](https://github.com/stacks-network/stacks-core/blob/4.0.1/stackslib/src/chainstate/stacks/boot/pox-5.clar#L107)) into `reserve-balance`.

### Dual-asset commitment

The requirement to link an **L1 BTC timelock** with an **L2 STX lock** (and registration) for protocol bonds.

### Dual stacking (legacy product)

Separate legacy yield product slated to wind down alongside Bitcoin Staking messaging; distinct from **dual-asset** protocol bonds.

### Distribution cycle

A reward-accounting unit **twice as frequent** as a reward cycle (also called a [signer cycle](glossary.md#signer-cycle)). `current-distribution-cycle` advances by 1 every `(reward-cycle-length / 2)` burn blocks (1,050 on mainnet). `calculate-rewards` runs at each distribution-cycle boundary, and the per-bond target-yield formula divides the annualised target rate by **50** (≈ distribution cycles per year). Distribution cycles are also what `settle-rewards` uses as the granularity for `signer-rewards-per-token-settled-for-cycle` and `signer-unclaimed-rewards-for-cycle`.

### Early exit

Optional path to spend BTC from the timelock before expiry using a **pre-authorized branch** co-signed by the Early Exit signer set; remaining **BTC yield is forfeited** and **paired STX stays locked** without yield for the rest of the bond.

### Early Exit signer set

The early-exit machinery has **two distinct sides** that the contract treats separately:

* **BTC side:** `early-unlock-bytes` is the early-exit subscript stored on each bond ([pox-5.clar:126](https://github.com/stacks-network/stacks-core/blob/4.0.1/stackslib/src/chainstate/stacks/boot/pox-5.clar#L126)) and folded into the `OP_ELSE` branch of the L1 lockup script ([pox-5.clar:3711](https://github.com/stacks-network/stacks-core/blob/4.0.1/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3711-L3731)). It must leave a valid boolean result on the stack for the shared `OP_VERIFY` after `OP_ENDIF`. In practice this is always a single cosigner public key with `OP_CHECKSIG` — one key managed by a redundant, KMS-backed early-exit signing service, not an on-chain multisig script. The contract itself permits either that or an M-of-N `CHECKMULTISIG` template, since it stores `early-unlock-bytes` as an opaque buffer and never inspects its shape; no deployed bond uses the multisig form. The cosigner signature alone is not sufficient: `staker-unlock-bytes` runs unconditionally after `OP_ENDIF`, so an early-exit spend also requires the staker's own signature plus the staker's 32-byte commitment preimage.
* **L2 side:** the early-exit announcement ([pox-5.clar:1196](https://github.com/stacks-network/stacks-core/blob/4.0.1/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1196-L1257)) is gated on the staker themselves: `contract-caller`, `tx-sender`, and the `staker` argument must all match. No separate admin or signer principal is stored on the bond. After the staker's BTC is spent off-cycle through the `OP_ELSE` branch, the staker announces the exit on L2 so the contract zeros their shares; their locked STX stays locked through the normal bond period.

### Endowment (Stacks Endowment)

Program operator for PoX-5: publishes parameters, maintains whitelists, grants pool envelopes, and stages multisig updates described in launch tooling (calculator, monitoring, waterfall engine).

### Enrollment period (PoX-5)

Roughly monthly window (**4,200** blocks in LS table) when a new bonding period opens under Endowment parameters.

### Forfeiture (early exit)

Explicit product penalty: user gives up **remaining Tranche 1 BTC yield** after exit; paired STX remains locked at **zero yield** until **Day 175** / period rules complete.

### Governance weight

Voting weight on SIPs; **pure function of locked STX**—BTC does not govern.

### Hard fork (activation)

Consensus upgrade that activates PoX-5, releases PoX-4 locks, and sequences **first bond Day 0**; may include minimum committed STX thresholds in governance drafts.

### Indexer / API

Off-chain data surface the app reads for period state, positions, payouts, and pauses.

### L1 and L2 (commitment layers)

**L1** is Bitcoin: timelocked BTC UTXO, early-exit script path, optional L1 BTC rewards. **L2** is Stacks: PoX-5 contract lock, sBTC default rewards, and **order**: L1 confirms **before** L2 in enrollment.

### Liquid staking (future)

sBTC-based pooling and LST directions described as future work once protocol bonds underpin TVL; not the v1 institutional app scope.

### Lockup script / P2WSH lockup output

The Bitcoin output the contract expects to see for each L1 lockup. The witness script has two spending paths: an `OP_IF` branch that only becomes spendable once the committed unlock height (CLTV) is reached, releasing the funds to the staker; and an `OP_ELSE` branch that lets the early-exit signer set release the funds sooner. The witness script is wrapped as a standard **P2WSH** output. The committed unlock height must fall within the bond's allowed window (at or above the bond's minimum L1 unlock height, and below the ceiling Bitcoin treats as a timestamp rather than a height). During `register-for-bond`, the contract reconstructs the expected output script for that height and requires the SPV-supplied output's script to match exactly. See also [BTC SPV proof](glossary.md#btc-spv-proof).

### Miner bids

BTC miners transfer BTC to compete for Stacks blocks; those transfers fund the **reward pool** participants share under PoX rules.

### Nakamoto consensus / SIP-021

Stacks block validation regime where **signers** attest blocks; signing weight ties to stacked STX.

### Native BTC Protocol Bond

Institutional path: self-custodial BTC timelock plus STX lock, no pool intermediary.

### Paired BTC and paired STX

The two legs of a protocol bond. **Paired BTC** earns Tranche 1 target yield when eligible. **Paired STX** meets ratio and signing needs but **earns no yield** while paired.

### Parameter calculator

Program tool (with required **security review** before launch) that turns model inputs into staged multisig transactions publishing on-chain parameters.

### PoX, PoX-4, PoX-5, PoX-6

**PoX** is Proof-of-Transfer, the Stacks consensus mechanism in which miners spend BTC to compete for block production rights and that BTC flows to stakers/stackers. **PoX-4** is pre-upgrade stacking. **PoX-5** is Endowment-mediated bootstrap Bitcoin Staking — it reallocates **who** is eligible for that BTC flow while preserving miner bidding. **PoX-6** targets permissionless auction and fuller on-chain economics.

### Prepare phase / prepare window

Last **100 blocks** of each **signer cycle** in the time-interval table; also used in product copy as the deadline to change signer or reward settings before the next prepare phase.

### Protocol bond

Six-ish month dual commitment: **BTC timelock on L1** plus **STX lock on L2**, cryptographically linked, targeting Tranche 1 yield on the BTC leg under waterfall rules.

### P2WSH / CLTV (L1 timelock script)

Bitcoin script pattern (**pay-to-witness-script-hash**) with **check-lock-time-verify** for covenant-style timelocks; launch scope cites P2WSH + CLTV for partner SDK timelock library.

### Ratio requirement (minimum STX vs BTC)

Minimum STX that must be paired with a BTC commitment. The pricing inputs are per-bond parameters the admin supplies when setting up a bond, and [`min-ustx-for-sats-amount`](https://github.com/stacks-network/stacks-core/blob/4.0.1/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3089) rejects a registration that falls short of the floor. The white paper frames the floor as a fraction of BTC value (initial **5%** example) derived from miner-bid-implied pricing; on-chain the values are set administratively.

### Re-lock phase

Final stretch of a bonding period where **L1 has expired** but **STX can remain locked**, giving time to construct the **next** L1 timelock. On mainnet the L1 timelock's minimum unlock height sits about **1,050 blocks** (half a reward cycle) before the bond's L2 end height. Each L1 lockup output commits its own unlock height, which the contract accepts only at or above that minimum, so a staker may lock for longer if they choose. Bitcoin treats high locktime values as timestamps rather than heights, so the committed height must also stay below Bitcoin's locktime threshold. The "\~1,400 blocks (\~10 days)" product framing does not match the contract math; treat the contract value as authoritative.

### Reserve fund (Tranche 3)

Third waterfall stop: absorbs part of **cycle excess** and backstops Tranche 1 in stress; may hold **BTC and USD sleeves** in the paper's design. In PoX-5, the contract accrues into `reserve-balance` automatically each cycle (the `RESERVE_RATIO` cut of distribution); draws from the reserve are consensus-gated — the only draw path, `transfer-from-reserve`, is never called from within the contract and can only be invoked by the node as part of consensus (via the SIP process).

### Reward address

Where cycle rewards are sent; partners can update it with other position params **before** the next prepare phase per UX notes.

### Reward asset election

Choice between default **sBTC (auto-bridge)** and explicit **L1 BTC opt-out** in product flows.

### Reward eligibility weight

One of three "weights" in the paper; Bitcoin Staking **only** changes how **BTC yield eligibility** works—**signing** and **governance** weights remain STX-only.

### sBTC

BTC representation on Stacks used for default **auto-bridged** rewards and for **pool** bond commitments; distinct from **self-custodial L1 BTC** in the native bond path.

### sBTC Protocol Bond (via pool)

Community-tranche path where **whitelisted pools** lock **STX + sBTC** against a negotiated **envelope**. On-chain the pool contract itself is the PoX-5 staker (one membership); `claim-rewards` pays the pool's **signer-manager**, and member-level accounting and onward distribution live entirely inside the pool contract — PoX-5 has no pool, envelope, or pro-rata mechanism of its own.

### sBTC signer set

Operational signer group handling **auto-bridge** and **L1 BTC opt-out** payout paths; also referenced for **miner payout address** updates post-fork.

### Self-custodial BTC yield

Yield framing where native **BTC** never sits with a lending counterparty under protocol design—timelocks keep BTC under participant keys on L1.

### Signing weight

Signer authority in Nakamoto consensus proportional to **STX** locked toward that signer; **BTC does not** increase signing weight.

### Signer cycle

Another name for a [reward cycle](glossary.md#cycle-boundary): one reward phase plus its trailing [prepare phase](glossary.md#prepare-phase-prepare-window). PoX-5 docs use "signer cycle" when the emphasis is on signer set updates rather than reward accounting.

### Stacks principal

Stacks address identifier tying **wallet**, **whitelist row**, and **L1 script metadata** (principal embedded in timelock unlock path per white-paper script sketch).

### Stacks signer

Validator participant in **Nakamoto consensus**; stackers delegate **STX** to a signer (or run their own). Authority scales with **signing weight**, not BTC locked.

### SIP (Stacks Improvement Proposal)

Governance process for protocol changes; Nakamoto consensus references **SIP-021**, and reserve or emission schedules may be revised via SIP.

### Stacking vs staking

Legacy user verb **stacking** (PoX-4 marketing) vs proposed **staking** language reflecting dual-asset bonds—docs sometimes use both during transition.

### Static STX:BTC ratio

Per-period pairing requirement **fixed for PoX-5** simplicity (vs algorithmic ratio later); published **\~7 days before Day 0**.

### STX-only staking (Tranche 2 path)

**No** BTC commitment: locks STX on \~signer-cycle cadence, earns **residual** after the protocol bond tranche; **50K STX** minimum solo in product notes; residual paid pro rata.

### Target yield

Pre-clearing anchor for sizing and messaging; active terms also have **clearing yield** from auction mechanics in decentralized design.

### Uniform-price clearing

Auction pricing rule where **every accepted bid pays the same clearing yield** (the marginal accepted bid), not each bidder's own bid—standard in the white paper's sealed-bid design.

### UTXO matching

Stacks nodes/indexers observe Bitcoin **timelocked UTXOs** and match them to **L2 registrations** so bonds become enforceable and attributable.

### Waterfall (yield distribution)

Priority ordering of **miner revenue** across the **protocol bond tranche**, the **STX-only staking tranche**, and the **reserve fund tranche**; stabilizes BTC-side APY at the expense of more variable STX-only returns.

### Waterfall tranches

Three stops, in priority order. The **protocol bond tranche** (Tranche 1) pays paired BTC obligations first. The **STX-only staking tranche** (Tranche 2) pays STX-only residual from cycle excess. The **reserve fund tranche** (Tranche 3) takes the remainder. Outside this page, write the tranche's name rather than its number to avoid confusion.

### Weekly rewards

PoX-5 distribution cadence: rewards described as **weekly pulls** honoring the pause flag and routing sBTC/L1 per election.

### Whitelist and whitelist row

Access control for **institutional** native bond participation: app loads a **row** keyed by **Stacks principal** after wallet connect.

### Whitelisted signer list

Curated Stacks signers institutional partners may select during enrollment or updates (must stay on list).

### Yield-bearing asset (BTC)

In protocol bonds, **BTC** is the leg that earns Tranche **target yield**; **STX** supplies capacity and signing alignment but **does not** earn bond stacking yield while paired.
