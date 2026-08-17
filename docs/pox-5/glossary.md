---
description: >-
  Terms for PoX-5 Bitcoin Staking, protocol bonds, the waterfall, and
  staking.stacks.co—aligned with the launch scope, product app note, and
  Waterfall white paper.
---

# Glossary

### Allocation (bond capacity)

How much BTC (and paired STX at the published ratio) a whitelisted partner or pool may commit for a bonding period. The app shows allocation state as **Allocated**, **Pending**, or **Not whitelisted** after wallet connect.

### Andon Cord

An on-chain brake on signer reward claims. `pox-5.clar` carries a `pause-admin` principal (data var, [pox-5.clar:353](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L353)) and a `rewards-paused` boolean ([pox-5.clar:354](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L354), default `false`). The current `pause-admin` is the only principal allowed to call `pause-rewards` ([pox-5.clar:489](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L489)), which sets `rewards-paused` to `true`; the role itself is transferable via `set-pause-admin` ([pox-5.clar:470](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L470)), and both calls are reentrancy-guarded. Once paused, `claim-rewards` ([pox-5.clar:2387](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2387)) fails its `(not (var-get rewards-paused))` assertion with `ERR_REWARDS_PAUSED (u53)`, so signers can no longer pull sBTC out of the contract.

The pause can **stop** claims but cannot **redirect** rewards: amounts keep accruing in-contract while paused. It is **one-way and irreversible** — there is no unpause function — so recovery requires a hard fork.

### announce-l1-early-exit

L2-side public function ([pox-5.clar:1196](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1196)) called by the staker themselves **after** the L1 BTC timelock has been spent off-cycle via the lockup script's `OP_ELSE` branch. The caller's `contract-caller`, `tx-sender`, and the `staker` argument must all match (`ERR_UNAUTHORIZED u1`); the call cannot be forwarded through an intermediary contract. The `old-signer-manager` trait argument must resolve to the staker's currently-recorded signer on the membership (`ERR_INVALID_OLD_SIGNER_MANAGER u36`). Rejected during the prepare phase (`ERR_STAKE_IN_PREPARE_PHASE u47`). It marks the L1-locked bond participant as having exited, zeros their `amount-sats` on the membership, and walks each remaining bond cycle via `unstake-sats-from-bond-cycles` — for each cycle the helper resolves the staker's signer from `staker-signer-cycle-memberships`, settles signer-level and per-staker rewards for that cycle, and decrements the per-cycle share totals. It then debits `protocol-bonds-total-staked` and flips `protocol-bond-l1-early-exit-announced` for `{ bond-index, staker }`. The staker's locked STX remains locked through the bond's normal unlock cycle. Each `{ bond-index, staker }` pair may successfully announce at most once (`ERR_L1_EARLY_EXIT_ALREADY_ANNOUNCED u50`). Only callable for L1-locked memberships — sBTC-locked participants must use [`unstake-sbtc`](glossary.md#unstake-sbtc) instead.

### APY (target)

Annual percentage yield framing for what the program **targets** on paired BTC for a bonding period—not a guaranteed return; realized payouts depend on miner revenue, reserve, and waterfall distribution.

### ATC-C (Assumed Total Commitment with Carryforward)

An MEV-oriented mining mitigation used when reasoning about miner bid data; the white paper cites it as filtering extreme bids when using miner bids as an implied STX/BTC reference.

### Auction (capacity allocation)

Mechanism to ration limited Tranche 1 BTC yield capacity. In the **PoX-6** end state this is permissionless and sealed-bid; in **PoX-5** the Endowment sets capacity and allocations administratively while longer-form docs still describe auction shape for the future.

### Auction window

Roughly the week before a bonding period when parameters are published and (in fully decentralized form) bids are collected.

### Auto-bridge (sBTC)

Default path that routes miner BTC into **sBTC** for reward distribution on L2; participants may opt out to receive L1 BTC instead where supported.

### Available capacity and capacity allocation (PoX-5)

Two principal parameters the Endowment sets manually each bonding period in bootstrap: how much BTC capacity exists and how it is split among partners and pools.

### Bitcoin Staking

Stacks’ evolution of Proof-of-Transfer: participants can earn **BTC-denominated** yield while BTC remains under self-custodial timelocks (native BTC path) or, via pools, as sBTC on L2. Eligibility and tranches differ from PoX-4.

### Bitcoin bond

Shorthand in the white paper for a **protocol bond** whose Bitcoin leg is native BTC (paired with STX).

### Bond period index

Zero-indexed key for each entry in the contract's `protocol-bonds` map (keyed `uint -> { … }`). Bond period **0** is the first; the admin chooses each new `bond-index` directly in `setup-bond`, and `map-insert` rejects a duplicate `bond-index` with `ERR_BOND_ALREADY_SETUP u4`. `register-for-bond` takes an explicit `bond-index` argument naming the bond being joined; `unstake-sbtc`, `announce-l1-early-exit`, and `update-bond-registration` each operate on a single bond — the caller's recorded `protocol-bond-memberships` entry supplies the `bond-index`. The reward entrypoints `calculate-rewards` and `claim-rewards` take an explicit `(list 6 uint)` of bond periods to address several at once. The `(first-index, num-indexes)` pair is the trait-side convention used in `validate-stake!` callbacks (where `first-index` is a bond index for bond flows and a reward cycle for STX-only flows).

### Bonding period

About **six months** of Bitcoin blocks (**25,200** in the time-intervals table), running from **D0** through **D182**, with six such periods staggered and overlapping at steady state.

### Bootstrap phase (PoX-5)

Managed program phase before full on-chain auction and algorithmic parameters: Endowment sets capacity, ratio, allocations, and comms; reserve may accrue in a constrained mode until PoX-6 activates further behaviors.

### Break-even framing

Messaging and models that relate STX downside, pairing ratio, and BTC-side yield so participants can reason about economics; called out for dashboard and investor audiences in launch/comms notes.

### BTC capacity envelope (pool)

The Endowment-negotiated **cap** on how much BTC-equivalent exposure a whitelisted pool can enroll against from the community tranche.

### BTC SPV proof

`register-for-bond` takes a `btc-lockup` argument typed `(response { outputs, staker-unlock-bytes } uint)`. The `ok` branch carries `outputs: (list 10 { header, leaf-hashes, tx-count, tx-index, tx, output-index, height, amount, unlock-burn-height })` plus `staker-unlock-bytes: (buff 683)` for an L1 BTC lockup; the `err` branch carries an sBTC amount in sats for an L2-only lockup. `staker-unlock-bytes` is the staker's signature subscript embedded in the L1 lockup witness script (the same value the locking address was derived from). The contract verifies the Bitcoin block header (`verify-block-header`), the merkle inclusion of the transaction in that block (the Clarity built-in invoked by `verify-merkle-proof`), and that the targeted output's script-pubkey matches the expected [P2WSH lockup output](glossary.md#lockup-script-p2wsh-lockup-output) (`validate-l1-lockup`). The per-output decode is a Clarity built-in invoked by `get-bitcoin-tx-output?`. Each output commits its own `unlock-burn-height`, and `validate-l1-lockup` reconstructs the expected P2WSH script per-output for that height via `construct-lockup-output-script`. The committed height may be any value at or above the bond's minimum L1 unlock height (`get-bond-l1-unlock-height`) and must stay below `BITCOIN_LOCKTIME_THRESHOLD` (`u500000000` — Bitcoin treats locktimes at or above that value as timestamps, not heights); `validate-l1-lockup` asserts `(>= unlock-burn-height minimum-unlock-height)` and `(< unlock-burn-height BITCOIN_LOCKTIME_THRESHOLD)` (both `ERR_INVALID_UNLOCK_HEIGHT u52`), that the decoded output amount equals the caller-supplied `amount` field (`ERR_INVALID_LOCKUP_AMOUNT u45`), and that no outpoint `(txid, output-index)` repeats across the registration's lockup list (`ERR_DUPLICATE_LOCKUP_OUTPOINT u46`, max 10 outpoints).

### Burn address (PoX-4 prepare phase)

During the last part of each PoX-4 cycle, PoX payouts go to a burn address in the prepare phase—a baseline contrast when explaining cadence changes under PoX-5.

### Capacity asset (STX role)

In protocol bonds, **STX** is framed as the asset that gates participation and signing weight while **BTC** is the yield-bearing leg; paired STX in Tranche 1 does not earn stacking yield.

### Clearing yield

Auction outcome: the **highest accepted** yield bid in uniform-price clearing; winners earn that clearing yield. Distinct from **target yield** published ahead of clearing.

### Community tranche (\~10%)

Share of Tranche 1 capacity reserved for retail-facing **whitelisted pool operators** during PoX-5.

### Confirmation phase (L1 lock-up)

Window in which participants must finish **L1 BTC timelocks** after allocation and before **D0**; table rows tie this to PoX-5 rolling issuance.

### Cooldown (removed)

PoX-5 removes the old cooldown rule for many flows: reward address, signer, and similar updates are intended **before the next prepare phase** without missing a cycle.

### Commit–reveal (auction)

Optional sealed-bid mechanism where bids are committed privately then **revealed together** at clearing to reduce **sniping** and last-block gaming in permissionless auction designs.

### Coverage ratio

Health metric: **reward pool per cycle ÷ paired BTC obligations per cycle**; bands (e.g. healthy, stressed) drive issuance and reserve use in the economic model.

### Cycle boundary

Stacks/PoX timing milestone used for signer set transitions, payouts, and UI copy (e.g. STX unlock “at the next cycle boundary” after period rules are satisfied).

### Cycle excess

Miner revenue remaining after **Tranche 1** obligations in a cycle; split per policy between **STX-only** participants (Tranche 2) and the **reserve** (Tranche 3).

### Custodial aggregation

Custody providers aggregating many clients’ positions; bounded in reward design notes by **actually locked STX** and auction economics.

### D0, D172, and D182 (bond timeline)

**D0** is the cutoff when paired BTC (L1) and STX (L2) must be locked to be eligible. **D172** is when the **L1 timelock expires** — the minimum L1 unlock height sits half a reward cycle (1,050 blocks, \~7 days on mainnet) before the bond's L2 end, per `get-bond-l1-unlock-height`. **D182** ends the bonding period on L2; STX unlock follows protocol rules.

### Drawdown priority (paired BTC)

White-paper design term for how a shortfall would be distributed among paired positions if the reserve were exhausted (ordering by STX price at lock time). `pox-5.clar` defines no per-position shortfall ordering: reward accounting is flat per-token ([`rewards-per-token-for-cycle`](contract/data-structure.md)), and the reserve accrues a fixed `RESERVE_RATIO` cut ([pox-5.clar:107](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L107)) into `reserve-balance`.

### Dual-asset commitment

The requirement to link an **L1 BTC timelock** with an **L2 STX lock** (and registration) for protocol bonds.

### Dual stacking (legacy product)

Separate legacy yield product slated to wind down alongside Bitcoin Staking messaging; distinct from **dual-asset** protocol bonds.

### Distribution cycle

A reward-accounting unit **twice as frequent** as a reward cycle. `current-distribution-cycle` advances by 1 every `(reward-cycle-length / 2)` burn blocks (1,050 on mainnet). `calculate-rewards` runs at each distribution-cycle boundary, and the per-bond target-yield formula divides the annualised target rate by **50** (≈ distribution cycles per year). Distribution cycles are also what `settle-rewards` uses as the granularity for `signer-rewards-per-token-settled-for-cycle` and `signer-unclaimed-rewards-for-cycle`.

### Early exit

Optional path to spend BTC from the timelock before expiry using a **pre-authorized branch** co-signed by the Early Exit signer set; remaining **BTC yield is forfeited** and **paired STX stays locked** without yield for the rest of the bond.

### Early Exit signer set

The early-exit machinery has **two distinct sides** that the contract treats separately:

* **BTC side:** `early-unlock-bytes` is the early-exit subscript stored in each `protocol-bonds` entry (`(buff 683)`) and concatenated into the L1 lockup script by `construct-lockup-script` as the `OP_ELSE` branch. It is a pre-pushed Bitcoin script fragment that validates the early-exit key(s) signature and **must leave a valid boolean result on the stack** — consumed by the shared `OP_VERIFY` that follows `OP_ENDIF` — e.g. `<pubkey> OP_CHECKSIG`, or an M-of-N `OP_CHECKMULTISIG` template. This is the predicate that guards the pre-expiry spend path, but it is not sufficient on its own: `staker-unlock-bytes` runs unconditionally after `OP_ENDIF`, so an early-exit spend requires a signature satisfying `early-unlock-bytes` **and** the staker's own signature, plus the staker's 32-byte commitment preimage.
* **L2 side:** `announce-l1-early-exit` is gated on the staker themselves — `contract-caller`, `tx-sender`, and the `staker` argument must all match — not on a separately stored principal. Once BTC has been spent off-cycle via the `OP_ELSE` branch, the staker announces the exit on L2 so the contract zeros their shares.

### Endowment (Stacks Endowment)

Program operator for PoX-5: publishes parameters, maintains whitelists, grants pool envelopes, and stages multisig updates described in launch tooling (calculator, monitoring, waterfall engine).

### Enrollment period (PoX-5)

Roughly monthly window (**4,200** blocks in LS table) when a new bonding period opens under Endowment parameters.

### Forfeiture (early exit)

Explicit product penalty: user gives up **remaining Tranche 1 BTC yield** after exit; paired STX remains locked at **zero yield** until **D172** / period rules complete.

### Governance weight

Voting weight on SIPs; **pure function of locked STX**—BTC does not govern.

### get-earned

Read-only function ([pox-5.clar:2341](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2341)) returning a signer's total currently-earned sBTC for a given `{ reward-cycle, bond-index }` slot, where `bond-index` is `(some N)` for a bond cycle and `none` for STX-only. It computes `unclaimed-rewards + (shares × (rewards-per-token-current − rewards-per-token-settled)) / PRECISION` via `compute-earned-rewards`, combining the already-settled balance in `signer-unclaimed-rewards-for-cycle` with the still-accruing delta against the latest `rewards-per-token`.

### Hard fork (activation)

Consensus upgrade that activates PoX-5, releases PoX-4 locks, and sequences **first bond D0**; may include minimum committed STX thresholds in governance drafts.

### Indexer / API

Off-chain data surface the app reads for period state, positions, payouts, and pauses.

### is-l1-lock

Boolean field on each `protocol-bond-memberships` entry indicating whether the bond participant locked **BTC on L1** (`true`) or **sBTC on L2** (`false`). The flag determines which exit path applies: L1-locked memberships use [`announce-l1-early-exit`](glossary.md#announce-l1-early-exit); L2 sBTC-locked memberships use [`unstake-sbtc`](glossary.md#unstake-sbtc). Bond-cycle accounting is selected by passing `(some bond-index)` to the reward maps' `bond-index` key; STX-only accounting uses `none`.

### L1 and L2 (commitment layers)

**L1** is Bitcoin: timelocked BTC UTXO, early-exit script path, optional L1 BTC rewards. **L2** is Stacks: PoX-5 contract lock, sBTC default rewards, and **order**: L1 confirms **before** L2 in enrollment.

### Liquid staking (future)

sBTC-based pooling and LST directions described as future work once protocol bonds underpin TVL; not the v1 institutional app scope.

### Lockup script / P2WSH lockup output

The Bitcoin output the contract expects to see for each L1 lockup. `construct-lockup-script` builds the witness script: an `OP_IF` (CLTV) / `OP_ELSE` (`early-unlock-bytes` subscript) / `OP_ENDIF` `OP_VERIFY` envelope followed unconditionally by the staker's `staker-unlock-bytes` subscript. `construct-lockup-output-script` wraps that witness script as `0x0020 || sha256(witness-script)` — i.e. a standard **P2WSH** output. `staker-unlock-bytes` and `early-unlock-bytes` are pre-pushed Bitcoin script fragments. `staker-unlock-bytes` runs after `OP_ENDIF` and must leave a truthy result on the stack (e.g. `<pubkey> OP_CHECKSIG`). `early-unlock-bytes` runs inside `OP_ELSE` and must also leave a boolean on the stack (consumed by the shared `OP_VERIFY` after `OP_ENDIF`) — e.g. `<pubkey> OP_CHECKSIG` or an M-of-N `OP_CHECKMULTISIG` template. The `OP_IF` branch's CLTV value is the output's own `unlock-burn-height`, which each L1 lockup commits and which must be at or above the bond's minimum L1 unlock height and below `BITCOIN_LOCKTIME_THRESHOLD` (`u500000000` — Bitcoin treats locktimes at or above that value as timestamps, not heights); both bounds share `ERR_INVALID_UNLOCK_HEIGHT u52`. During `register-for-bond`, `validate-l1-lockup` reconstructs this expected script-pubkey per-output for that height via `construct-lockup-output-script` and requires the SPV-supplied output's script-pubkey to match exactly. See also [BTC SPV proof](glossary.md#btc-spv-proof).

### Miner bids

BTC miners transfer BTC to compete for Stacks blocks; those transfers fund the **reward pool** participants share under PoX rules.

### Nakamoto consensus / SIP-021

Stacks block validation regime where **signers** attest blocks; signing weight ties to stacked STX.

### Native BTC Protocol Bond

Institutional path: self-custodial BTC timelock plus STX lock, no pool intermediary.

### old-signer-manager (argument)

Trait-typed (`<signer-manager-trait>`) argument required by `stake-update`, `unstake`, `update-bond-registration`, and `announce-l1-early-exit` (named `old-signer-manager` in their signatures), and by `unstake-sbtc` (named `signer-manager`). The contract-of the argument must match the staker's currently-recorded `signer` on the relevant membership; a mismatch fails with `ERR_INVALID_OLD_SIGNER_MANAGER` (`u36`). PoX-5 settles per-staker rewards on the old leg via [`settle-staker-rewards`](glossary.md#settle-rewards) before mutating shares so accrued sBTC is captured against the previous signer — the bond-share-mutating functions (`update-bond-registration`, `announce-l1-early-exit`, `unstake-sbtc`) settle directly, and `stake-update` / `unstake` settle per removed cycle through `remove-staker-from-cycles` → `remove-staker-from-signer-for-cycle`.

### Paired BTC and paired STX

The two legs of a protocol bond. **Paired BTC** earns Tranche 1 target yield when eligible. **Paired STX** meets ratio and signing needs but **earns no yield** while paired.

### Parameter calculator

Program tool (with required **security review** before launch) that turns model inputs into staged multisig transactions publishing on-chain parameters.

### PoX, PoX-4, PoX-5, PoX-6

**PoX** is Proof-of-Transfer. **PoX-4** is pre-upgrade stacking. **PoX-5** is Endowment-mediated bootstrap. **PoX-6** targets permissionless auction and fuller on-chain economics.

### Prepare phase / prepare window

Last **100 blocks** of each **signer cycle** in the time-interval table; also used in product copy as the deadline to change signer or reward settings before the next prepare phase.

### Proof-of-Transfer (PoX)

Stacks consensus class where miners spend BTC for block rights and BTC flows to stakers/stackers; Bitcoin Staking reallocates **who** is eligible while preserving miner bidding.

### Protocol bond

Six-ish month dual commitment: **BTC timelock on L1** plus **STX lock on L2**, cryptographically linked, targeting Tranche 1 yield on the BTC leg under waterfall rules.

### P2WSH / CLTV (L1 timelock script)

Bitcoin script pattern (**pay-to-witness-script-hash**) with **check-lock-time-verify** for covenant-style timelocks; launch scope cites P2WSH + CLTV for partner SDK timelock library.

### Ratio requirement (minimum STX vs BTC)

Minimum STX that must be paired with a BTC commitment. In `pox-5.clar` the pricing inputs are **per-bond parameters supplied by the bond-admin in `setup-bond`** — `stx-value-ratio` (an STX:BTC price representation) and `min-ustx-ratio` — and `register-for-bond` enforces the floor via [`min-ustx-for-sats-amount`](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3089) (`ERR_INSUFFICIENT_STX u8`). The white paper frames the floor as a fraction of BTC value (initial **5%** example) derived from miner-bid-implied pricing; on-chain the values are set administratively.

### Re-lock phase

Final stretch of a bonding period where **L1 has expired** but **STX can remain locked**, giving time to construct the **next** L1 timelock. In `pox-5.clar`, `get-bond-l1-unlock-height` subtracts `(reward-cycle-length / 2)` from the bond's L2 end height — on mainnet that is **1,050 blocks** (`2100 / 2`). This is the **minimum** L1 unlock height: each L1 lockup output commits its own `unlock-burn-height`, which `validate-l1-lockup` accepts only at or above this minimum and below `BITCOIN_LOCKTIME_THRESHOLD` (`u500000000`, the point at which Bitcoin reads a locktime as a timestamp rather than a height) — both checks share `ERR_INVALID_UNLOCK_HEIGHT u52` — so a staker may lock for longer, up to that cap. The "\~1,400 blocks (\~10 days)" product framing does not match the contract math; treat the contract value as authoritative.

### Reserve fund (Tranche 3)

Third waterfall stop: absorbs part of **cycle excess** and backstops Tranche 1 in stress; may hold **BTC and USD sleeves** in the paper’s design. In PoX-5, the contract accrues into `reserve-balance` automatically each cycle (the `RESERVE_RATIO` cut of distribution); draws from the reserve are consensus-gated — the only draw path, `transfer-from-reserve`, is never called from within the contract and can only be invoked by the node as part of consensus (via the SIP process).

### Reward address

Where cycle rewards are sent; partners can update it with other position params **before** the next prepare phase per UX notes.

### Reward asset election

Choice between default **sBTC (auto-bridge)** and explicit **L1 BTC opt-out** in product flows.

### Reward eligibility weight

One of three “weights” in the paper; Bitcoin Staking **only** changes how **BTC yield eligibility** works—**signing** and **governance** weights remain STX-only.

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

**2,100 Bitcoin blocks (\~14 days)** PoX time unit: signer set updates, **prepare phase** tail, and cadence anchor used beside the longer **bonding period**.

### Stacks principal

Stacks address identifier tying **wallet**, **whitelist row**, and **L1 script metadata** (principal embedded in timelock unlock path per white-paper script sketch).

### Stacks signer

Validator participant in **Nakamoto consensus**; stackers delegate **STX** to a signer (or run their own). Authority scales with **signing weight**, not BTC locked.

### settle-rewards

Private function ([pox-5.clar:2530](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2530)) called before any state change that touches a signer's bond/cycle shares. It calls [`get-earned`](glossary.md#get-earned) to compute the signer's currently-earned sBTC for a `{ reward-cycle, bond-index }` slot, writes that into `signer-unclaimed-rewards-for-cycle`, and snapshots the latest `rewards-per-token-for-cycle` into `signer-rewards-per-token-settled-for-cycle`. The per-staker counterpart `settle-staker-rewards` ([pox-5.clar:2581](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2581)) settles the staker layer one level down — same shape, against `staker-unclaimed-rewards-for-cycle` and `staker-rewards-per-token-settled-for-cycle`.

### signer-manager trait

Required trait implemented by signer-manager contracts that participants point at via the `signer-manager` argument. One method:

* `validate-stake!` with signature `(staker, first-index, num-indexes, amount-ustx, amount-sats, is-bond, signer-calldata) -> (response bool uint)` — called by PoX-5 before joining (or extending) a staker's position under that signer. `first-index` is a reward cycle for STX-only flows and a bond index for bond flows; `num-indexes` is the number of cycles (STX-only) or `u1` (bond); `amount-sats` is `u0` for STX-only and the BTC commitment for bond legs.

`validate-stake!` is invoked only through the contract's `signer-manager-validate-stake` wrapper, which raises `signer-manager-call-active` for the duration of the call. Any attempt to re-enter PoX-5 from inside the callback fails with `ERR_REENTRANT_CALL` (`u49`). The contract settles per-staker rewards itself via [`settle-staker-rewards`](glossary.md#settle-rewards) on every flow that mutates a staker's membership, so signer managers do not need to track staker accounting themselves.

### SIP (Stacks Improvement Proposal)

Governance process for protocol changes; Nakamoto consensus references **SIP-021**, and reserve or emission schedules may be revised via SIP.

### Stacking vs staking

Legacy user verb **stacking** (PoX-4 marketing) vs proposed **staking** language reflecting dual-asset bonds—docs sometimes use both during transition.

### Static STX:BTC ratio

Per-period pairing requirement **fixed for PoX-5** simplicity (vs algorithmic ratio later); published **\~7 days before D0**.

### STX-only staking (Tranche 2 path)

**No** BTC commitment: locks STX on \~signer-cycle cadence, earns **residual** after Tranche 1; **50K STX** minimum solo in product notes; **T2 residual** pro-rata.

### T1, T2, T3 (waterfall tranches)

**T1** pays paired BTC obligations first; **T2** pays **STX-only** residual from cycle excess; **T3** is the reserve fund.

### Target yield

Pre-clearing anchor for sizing and messaging; active terms also have **clearing yield** from auction mechanics in decentralized design.

### unstake-sbtc

L2-side public function ([pox-5.clar:1261](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1261)) used by **sBTC-locked** bond participants to withdraw some or all of their locked sBTC. Reverts on L1-locked memberships with `ERR_CANNOT_UNSTAKE_SBTC` (`u38`) — those use [`announce-l1-early-exit`](glossary.md#announce-l1-early-exit) instead. Also rejected during the prepare phase (`ERR_STAKE_IN_PREPARE_PHASE u47`). The flow: validate signer matches via [`old-signer-manager`](glossary.md#old-signer-manager-argument), then walk each affected cycle via `unstake-sats-from-bond-cycles`. For each cycle the helper resolves the staker's signer from `staker-signer-cycle-memberships` (since an earlier `update-bond-registration` may have left different signers across the current cycle vs. future cycles), runs [`settle-rewards`](glossary.md#settle-rewards) and `settle-staker-rewards` for that cycle, debits the per-cycle share totals by the withdrawal amount, and writes the staker's new per-cycle share count. Finally the function updates the membership's `amount-sats`, decrements `protocol-bonds-total-staked` and `total-sbtc-staked`, and transfers the sBTC out. Not gated by the [re-lock window](glossary.md#re-lock-phase) — outside the prepare-phase window, sBTC-locked participants can call it any time during the bond, including after the bond is over to recover the locked amount.

### update-bond-registration

Public function ([pox-5.clar:850](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L850)) that lets a bond participant rotate their `signer-manager` mid-bond. Takes the new `signer-manager`, the [`old-signer-manager`](glossary.md#old-signer-manager-argument), and optional `signer-calldata`. Rejects rotation to the same signer with `ERR_UPDATE_BOND_SAME_SIGNER` (`u44`) and rejects calls during the prepare phase with `ERR_STAKE_IN_PREPARE_PHASE` (`u47`). Calls the new manager's `validate-stake!` to authorise the join (under the reentrancy guard), runs `settle-rewards` and `settle-staker-rewards` on both the old and new signers, then migrates the participant's bond-period shares from the old signer to the new signer for each remaining reward cycle of the bond.

### Uniform-price clearing

Auction pricing rule where **every accepted bid pays the same clearing yield** (the marginal accepted bid), not each bidder’s own bid—standard in the white paper’s sealed-bid design.

### UTXO matching

Stacks nodes/indexers observe Bitcoin **timelocked UTXOs** and match them to **L2 registrations** so bonds become enforceable and attributable.

### Waterfall (yield distribution)

Priority ordering of **miner revenue** across **Tranche 1**, **STX-only** residual, and the **reserve**; stabilizes BTC-side APY at the expense of more variable STX-only returns.

### Weekly rewards

PoX-5 distribution cadence: rewards described as **weekly pulls** honoring the pause flag and routing sBTC/L1 per election.

### Whitelist and whitelist row

Access control for **institutional** native bond participation: app loads a **row** keyed by **Stacks principal** after wallet connect.

### Whitelisted signer list

Curated Stacks signers institutional partners may select during enrollment or updates (must stay on list).

### Yield-bearing asset (BTC)

In protocol bonds, **BTC** is the leg that earns Tranche **target yield**; **STX** supplies capacity and signing alignment but **does not** earn bond stacking yield while paired.
