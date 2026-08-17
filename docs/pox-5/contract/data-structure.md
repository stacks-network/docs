---
description: Storage model for the PoX-5 Clarity contract.
---

# Data Structure

This page describes the storage model used by `stackslib/src/chainstate/stacks/boot/pox-5.clar`. It is based on contract version `abdffd5d6c707c2ae675ec8e717dbc592c03ea93`.

### Mental Model

[PoX-5](../glossary.md#pox-pox-4-pox-5-pox-6) stores long-lived configuration in data vars, keyed state in maps, and per-cycle staker membership in a small linked-list structure. Most of the accounting maps key on `{ reward-cycle, bond-index: (optional uint) }`, where `none` identifies a [STX-only staking](../glossary.md#stx-only-staking-tranche-2-path) cycle and `(some bond-index)` identifies a [protocol bond](../glossary.md#protocol-bond) cycle.

```
Protocol bond setup
  -> protocol-bonds
  -> protocol-bond-allowances
  -> protocol-bond-memberships
  -> protocol-bonds-total-staked

Signer and staker activity
  -> signers
  -> staker-info
  -> staker-signer-cycle-memberships
  -> signer-delegated-per-cycle
  -> ustx-delegated-per-cycle

Reward calculation
  -> total-shares-staked-for-cycle
  -> signer-shares-staked-for-cycle
  -> staker-shares-staked-for-cycle
  -> rewards-per-token-for-cycle
  -> signer-rewards-per-token-for-cycle
  -> signer-rewards-per-token-settled-for-cycle
  -> signer-unclaimed-rewards-for-cycle
  -> staker-rewards-per-token-settled-for-cycle
  -> staker-unclaimed-rewards-for-cycle
```

### Data Vars

* `bond-admin` is the principal allowed to call `setup-bond` and `set-bond-admin`. Initialized in the source to the burn address `'SP000000000000000000002Q6VF78` so a fresh mainnet deploy has no live admin until rotated. On non-mainnet networks the node rewrites this literal at deploy time via the `pox_5_bond_admin` config (`make_pox_5_body`), so tests and testnets can boot with a usable admin. Rotated on-chain via `set-bond-admin`, which is gated on `contract-caller` matching the current admin.
* `pause-admin` is the principal allowed to permanently pause signer reward claims by calling `pause-rewards`, and to rotate the role via `set-pause-admin`. Like `bond-admin` it is initialized in the source to the burn address `'SP000000000000000000002Q6VF78`, so a fresh mainnet deploy has no live pause-admin until rotated. On non-mainnet networks the node rewrites this literal at deploy time via `make_pox_5_body`, so tests and testnets can boot with a usable pause-admin. Rotated on-chain via `set-pause-admin`, which is gated on `contract-caller` matching the current pause-admin.
* `rewards-paused` is a bool, default `false`. The reward-claim path (`claim-rewards`) asserts `(not (var-get rewards-paused))` and otherwise fails with `ERR_REWARDS_PAUSED (u53)`. `pause-rewards` sets it to `true` and is one-way: there is no unpause function. Rewards keep accruing while paused, so recovery requires a hard fork.
* `pox-prepare-cycle-length` is the [prepare-phase](../glossary.md#prepare-phase-prepare-window) length used by `is-in-prepare-phase` and `get-pox-info`.
* `pox-reward-cycle-length` is the reward-cycle length used for burn-height, reward-cycle, distribution-cycle, and unlock-height conversions.
* `first-burnchain-block-height` anchors burn-height to cycle conversions.
* `configured` enforces one-time burnchain parameter setup.
* `first-pox-5-reward-cycle` records the configured PoX-5 start cycle.
* `first-bond-period-cycle` anchors bond index to reward cycle conversion.
* `last-accounted-rewards-only` tracks reward-only sBTC after reward calculation and claims.
* `last-reward-compute-height` records the last distribution height computed.
* `reserve-balance` accumulates the reserve's sBTC share; `get-rewards` excludes it from new rewards.
* `total-sbtc-staked` is the running total of sBTC currently locked in protocol bonds. Updated by `roll-sbtc` (the net-difference transfer used at registration, rollover, and partial sBTC unstake) and by `unstake-sbtc`. Distinct from per-cycle share accounting.
* `signer-manager-call-active` ([pox-5.clar:390](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L390)) is a reentrancy guard. It is raised to `true` for the duration of any `signer-manager-validate-stake` call so that a signer-manager cannot re-enter PoX-5 from inside `validate-stake!`. Every public entrypoint that touches signer state checks this guard before mutating any state — directly via `validate-no-reentrancy` (e.g. `set-bond-admin`, `set-pause-admin`, `pause-rewards`, `setup-bond`, `register-signer`, `announce-l1-early-exit`, `unstake-sbtc`, `calculate-rewards`, `claim-rewards`, `claim-staker-rewards-for-signer`) or via `signer-manager-validate-stake`'s own inline assert (the four entrypoints that take a `signer-manager-trait` argument: `register-for-bond`, `update-bond-registration`, `stake`, `stake-update`). A reentrant call fails with `ERR_REENTRANT_CALL (u49)`.

### Protocol Bond Maps

* `protocol-bonds` ([pox-5.clar:110](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L110)) maps `bond-index -> { target-rate, stx-value-ratio, min-ustx-ratio, early-unlock-bytes }`. `target-rate` is the bond's APY in basis points; `stx-value-ratio` is uSTX per 100 sats (used for bond priority during reward distribution); `min-ustx-ratio` is the minimum STX collateral ratio in basis points; `early-unlock-bytes` ([pox-5.clar:126](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L126)) is the early-exit subscript of the L1 lockup witness script — a pre-pushed Bitcoin script fragment that guards the `OP_ELSE` branch and **must leave a valid boolean result on the stack** (consumed by the shared `OP_VERIFY` that follows `OP_ENDIF`), e.g. `<pubkey> OP_CHECKSIG` or an M-of-N `CHECKMULTISIG` template.
* `protocol-bond-allowances` ([pox-5.clar:130](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L130)) keys `{ bond-index, staker } -> uint` — the maximum sats a staker may contribute to that bond.
* `protocol-bond-memberships` ([pox-5.clar:139](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L139)) keys `principal -> { bond-index, amount-ustx, signer, is-l1-lock, amount-sats }`. `is-l1-lock` is `true` when the participant locked native BTC on L1 (and must call `announce-l1-early-exit` to exit before the bond ends) and `false` when they locked sBTC on L2 (in which case they call `unstake-sbtc` to withdraw). `amount-sats` is the staker's sBTC contribution in satoshis and is the authoritative source for the staker's per-cycle share within the bond. The map only carries one membership per principal, so a staker can be in at most one active bond at a time.
* `protocol-bonds-total-staked` ([pox-5.clar:151](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L151)) maps `bond-index -> uint` — total sats staked per bond index.
* `protocol-bond-l1-early-exit-announced` ([pox-5.clar:158](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L158)) keys `{ bond-index, staker } -> bool` — set to `true` after the staker successfully calls `announce-l1-early-exit` for that bond period. Queried by `has-announced-l1-early-exit`; prevents a staker from announcing the same early exit twice (`ERR_L1_EARLY_EXIT_ALREADY_ANNOUNCED u50`).

### Signer Maps

* `signers` ([pox-5.clar:186](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L186)) maps signer-manager `principal -> (buff 33)` signer key.
* `signer-key-grants` ([pox-5.clar:166](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L166)) keys `{ signer-key, signer-manager } -> bool` — records signer-key approval for a signer manager.
* `used-signer-key-grants` ([pox-5.clar:174](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L174)) keys `{ signer-key, signer-manager, auth-id } -> bool` — replay protection for signer-key grant signatures.

A signer-manager's signer key is read from `signers` directly; there is no separate per-principal lookup map.

### Staker And Cycle Membership Maps

* `staker-info` ([pox-5.clar:218](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L218)) keys `principal -> { amount-ustx, first-reward-cycle, num-cycles, signer }` for STX-only stakers. `signer` ([pox-5.clar:224](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L224)) is the signer-manager principal the staker is currently delegating to; rotating it goes through `stake-update`.
* `staker-signer-cycle-memberships` ([pox-5.clar:229](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L229)) keys `{ staker, cycle } -> { amount-ustx, signer }` — per-cycle membership for STX-only stakers, used so the contract can rewire memberships when a staker changes signers or unstakes.
* `signer-delegated-per-cycle` ([pox-5.clar:195](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L195)) stores total uSTX delegated to a signer per cycle (across both protocol bonds and STX-only). This is the signer-weight value.
* `signer-pending-staked-ustx-per-cycle` ([pox-5.clar:209](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L209)) stores STX-only delegation that has not yet crossed `SIGNER_SET_MIN_USTX`. Not used for reward calculations.
* `ustx-delegated-per-cycle` ([pox-5.clar:242](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L242)) stores total uSTX delegated across all signers for a cycle.

### Reward Accounting Maps

Reward accounting has two parallel layers: signer-level and a per-staker layer that lets signer managers pay individual stakers out of the signer's claim without recomputing share ratios. Both layers settle before any share-map write on every state-mutating entrypoint. `register-for-bond` and `update-bond-registration` call `settle-rewards` and `settle-staker-rewards` at the top level — the affected signer (and, for rotations, both the old and new signers) is unambiguous from the call arguments. `announce-l1-early-exit` and `unstake-sbtc` settle **per affected cycle** inside `unstake-sats-from-bond-cycle`: each cycle's signer is resolved from `staker-signer-cycle-memberships` before settlement, since `update-bond-registration` may have left a staker with a different signer in the current cycle than in future cycles. STX-only entrypoints (`stake`, `stake-update`, `unstake`) settle inside the per-cycle helpers `add-staker-to-signer-for-cycle` and `remove-staker-from-signer-for-cycle`, once per cycle iteration immediately before that cycle's share-map writes; `add-staker-to-signer-for-cycle` skips the staker-layer settle when the staker holds no shares in the cycle yet (a zero-share settle earns nothing). Settlement always runs signer-then-staker so the staker's RPT snapshot is taken against the freshly-settled signer-level RPT.

All reward maps share the same key shape: `bond-index` is `(some N)` for a protocol bond cycle and `none` for an STX-only cycle.

* `rewards-per-token-for-cycle` ([pox-5.clar:249](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L249)) keys `{ reward-cycle, bond-index } -> uint`. Cumulative rewards per share for a bond cycle (`bond-index: (some N)`) or STX-only reward cycle (`bond-index: none`). Monotonically increasing.
* `total-shares-staked-for-cycle` ([pox-5.clar:259](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L259)) keys `{ reward-cycle, bond-index } -> uint`. Total shares: sats for bonds, uSTX for STX-only cycles.
* `staker-shares-staked-for-cycle` ([pox-5.clar:268](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L268)) keys `{ reward-cycle, bond-index, staker, signer } -> uint`. Lets signer-managers attribute per-cycle payouts back to the stakers behind their share — sats for bond legs, uSTX for STX-only legs.
* `signer-shares-staked-for-cycle` ([pox-5.clar:282](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L282)) keys `{ reward-cycle, bond-index, signer } -> uint`. For STX-only cycles this only counts a signer's shares once they cross `SIGNER_SET_MIN_USTX`; pre-threshold delegation lives in `signer-pending-staked-ustx-per-cycle`.
* `signer-rewards-per-token-settled-for-cycle` ([pox-5.clar:293](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L293)) keys `{ reward-cycle, bond-index, signer } -> uint`. Snapshots `rewards-per-token-for-cycle` at the last time `settle-rewards` ran for that signer; read alongside the current per-token value to compute newly-earned rewards.
* `signer-unclaimed-rewards-for-cycle` ([pox-5.clar:303](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L303)) keys `{ reward-cycle, bond-index, signer } -> uint`. Running earned-but-not-yet-claimed sBTC balance per signer; `settle-rewards` increments it, `claim-rewards` zeroes it after transferring.
* `staker-rewards-per-token-settled-for-cycle` ([pox-5.clar:314](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L314)) keys `{ reward-cycle, bond-index, signer, staker } -> uint`. Per-staker mirror of `signer-rewards-per-token-settled-for-cycle`: snapshots the signer's RPT (read from `signer-rewards-per-token-for-cycle`) at the last time `settle-staker-rewards` ran for that staker under that signer.
* `staker-unclaimed-rewards-for-cycle` ([pox-5.clar:325](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L325)) keys `{ reward-cycle, bond-index, signer, staker } -> uint`. Running earned-but-not-yet-claimed sBTC balance per staker; written by `settle-staker-rewards`, zeroed by `claim-staker-rewards-for-signer` after the signer-manager pays the staker out.
* `signer-rewards-per-token-for-cycle` ([pox-5.clar:335](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L335)) keys `{ signer, reward-cycle, bond-index } -> uint`. The signer's _own_ RPT watermark — only written when that signer has non-zero shares for the cycle. Used as the staker-side RPT reference; gates phantom rewards for below-threshold signers (a signer who never crossed `SIGNER_SET_MIN_USTX` in a cycle with no STX stakers does not get a non-zero entry here, so stakers under that signer cannot accrue a phantom claim).

### Per-cycle Signer Linked List

The contract keeps a linked list of _signers_ (signer-manager principals) per cycle. This gives the contract and indexers an ordered, traversable set without storing an unbounded list in a single value. The list only tracks signers that have crossed `SIGNER_SET_MIN_USTX` for the cycle; STX-only delegation under that threshold is recorded in `signer-pending-staked-ustx-per-cycle` but kept out of the linked list.

```
cycle
  first -> signer A <-> signer B <-> signer C <- last

signer-set-ll-first-for-cycle[cycle] = signer A
signer-set-ll-last-for-cycle[cycle]  = signer C
signer-set-ll-for-cycle[{ cycle, signer B }] = { prev: signer A, next: signer C }
```

* `signer-set-ll-first-for-cycle` stores the first signer principal for each cycle.
* `signer-set-ll-last-for-cycle` stores the last signer principal for each cycle.
* `signer-set-ll-for-cycle` keys `(cycle, signer)` to a node containing optional `prev` and `next` principals.

Adding a signer appends them to the current tail for that cycle and updates the cycle's last pointer. Removing a signer rewires its predecessor and successor and updates first or last pointers when the removed signer was at either end.

Per-staker membership lives separately in `staker-signer-cycle-memberships` and `staker-shares-staked-for-cycle`; the linked list itself only tracks signer-manager principals.

### Trait

* `signer-manager-trait` defines a single callback that signer-manager contracts must implement:
  * `validate-stake!` — asked at staking and bond-registration time whether a `(staker, first-index, num-indexes, amount-ustx, amount-sats, is-bond, signer-calldata)` tuple is acceptable. `amount-sats` is `u0` for STX-only paths and the BTC commitment for bond legs; `is-bond` flags which path the call is on so the signer manager can branch on protocol-bond vs. STX-only. `first-index` is a reward cycle for STX-only flows and a bond index for bond flows; `num-indexes` is the number of cycles (STX-only) or `u1` (bond).

The contract settles per-staker rewards via `settle-staker-rewards` on every flow that mutates a staker's membership, so signer managers do not need to track staker accounting themselves.
