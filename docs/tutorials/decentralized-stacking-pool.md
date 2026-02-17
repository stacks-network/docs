---
id: decentralized-stacking-pool
title: "Building a Decentralized Stacking Pool with pox-4"
description: "A deep-dive, end-to-end tutorial on building a complete pool operator wrapper contract using pox-4, covering delegation flows, signer authorization, aggregation commits, and reward distribution."
slug: /tutorials/stacking/decentralized-pool
---

# Building a Decentralized Stacking Pool with pox-4

**Author:** @jadonamite  
**Difficulty:** Expert  
**Time:** ~90 Minutes

---

## Introduction

Individual Stacking requires meeting a dynamic minimum threshold — a function of the total STX locked across all active stackers divided by the 4,000 available reward slots. This minimum frequently prices out smaller STX holders from participating in PoX directly. A Stacking pool solves this by allowing a **pool operator** to aggregate delegated STX from many individual delegators, collectively meeting or exceeding that threshold and splitting the resulting Bitcoin rewards proportionally.

This tutorial walks you through building a **complete, production-grade pool operator wrapper contract** in Clarity. Rather than just explaining the pox-4 functions in isolation, you will write a real contract that:

- Stores pool configuration on-chain using data variables and maps
- Allows users to delegate through your contract in one transaction
- Gives the pool operator the ability to activate each delegator's position
- Aggregates all delegated STX and commits it to the reward set with a valid signer key signature
- Supports increasing the stacked position as more delegators join mid-cycle
- Handles revocation and expiry cleanly

By the end you will understand not just how to call pox-4, but *why* each step exists and what can go wrong.

---

## Prerequisites

Before starting, you should be comfortable with:

- Writing and testing Clarity smart contracts with [Clarinet](https://docs.hiro.so/clarinet)
- The concept of PoX (Proof of Transfer) and reward cycles
- How Bitcoin addresses map to `pox-addr` tuples in Clarity

You should also have the following infrastructure set up or accessible:

- A **Stacks signer** running and configured with a `stacks_private_key` (see the [Run a Signer guide](https://docs.stacks.co/operate/run-a-signer))
- A dedicated **pool operator STX address** (separate from your signer key — more on why below)
- [Clarinet](https://docs.hiro.so/clarinet) installed locally for testing

> **A Note on Key Separation**  
> The pox-4 contract is designed with a deliberate separation between the *pool operator address* (the STX principal that makes stacking transactions) and the *signer key* (the key used by your signer software). This separation exists because signer keys can be rotated without requiring all delegators to un-stack and re-stack. Pool operator addresses, by contrast, cannot be rotated — every delegator has hardcoded your address in their `delegate-stx` call, so changing it would require every one of them to start over. **Always use two separate keys.**

---

## Part 1: Understanding the Full Delegation Flow

Before writing any contract code, you need to understand the four-step lifecycle that governs delegated stacking in pox-4.

### Step 1 — Delegator calls `delegate-stx`

This call, made by the **user**, grants your pool operator address the *permission* to lock their STX. It does not lock anything yet. It merely records an entry in the pox-4 `delegation-state` map associating the user's principal with yours.

Key parameters the user supplies:

- `amount-ustx` — the maximum uSTX the pool operator is allowed to lock on their behalf  
- `delegate-to` — your pool operator STX address  
- `until-burn-ht` — an optional Bitcoin block height at which the delegation expires automatically (`none` = indefinite)  
- `pox-addr` — an optional Bitcoin address the rewards *must* be sent to; if set, your `delegate-stack-stx` call must use this same address

### Step 2 — Pool operator calls `delegate-stack-stx` (per delegator)

You, as the pool operator, must call this function once for every delegator you want to include. This is what actually stages ("partially stacks") each user's STX. Their tokens are now locked, and the `partial-stacked-by-cycle` map is updated with their contribution.

Key parameters you supply:

- `stacker` — the delegator's STX address  
- `amount-ustx` — how much to lock (cannot exceed what they authorized)  
- `pox-addr` — the Bitcoin address where BTC rewards will go (must match what the delegator set, if they set one)  
- `start-burn-ht` — the current Bitcoin block height plus 1 or 2 (used to target the next reward cycle)  
- `lock-period` — number of cycles to lock for (1–12)

Note that `delegate-stack-stx` sets the stacker's first reward cycle to be the **next** reward cycle from the current one. So if you are in cycle 557 when you call this, delegators will be stacked starting in cycle 558.

### Step 3 — Pool operator calls `stack-aggregation-commit-indexed`

Once the aggregate partially-stacked balance exceeds the current `min_threshold_ustx`, you can commit. This is the critical step that registers your pool in the reward set for the chosen cycle. You **must** call this before the prepare phase begins (the last 100 Bitcoin blocks of the current cycle).

This call requires a valid signer key and signer key signature. These prove that you control the signing infrastructure that will participate in block validation on behalf of the stacked STX. The signature for `agg-commit` must use a `period` of `1` and the `reward-cycle` must match the cycle you are committing to (typically current cycle + 1).

The function returns `(ok uint)` — the reward address index. **Save this value.** You will need it to call `stack-aggregation-increase` later if more delegators join.

### Step 4 — Pool operator calls `stack-aggregation-increase` (optional)

If additional delegators join after you have already committed, you can call this to increase your stacked position for the same reward cycle, using the index from Step 3. A new signer signature is required.

---

## Part 2: Project Setup

Create a new Clarinet project:

```bash
clarinet new stacking-pool
cd stacking-pool
clarinet contract new pool-operator
```

Your project will have the following structure:

```
stacking-pool/
├── Clarinet.toml
├── contracts/
│   └── pool-operator.clar
└── tests/
    └── pool-operator_test.ts
```

---

## Part 3: The Pool Operator Contract

Below is the complete `pool-operator.clar` contract. Each section is explained in detail after the full listing.

**File: `contracts/pool-operator.clar`**

```clarity
;; =========================================================
;; pool-operator.clar
;; A non-custodial stacking pool wrapper for pox-4.
;; =========================================================

;; --- Error Constants ---
;; All custom errors are defined here so callers can identify failures
;; without needing to trace the source contract.
(define-constant ERR-NOT-AUTHORIZED (err u401))
(define-constant ERR-FORBIDDEN (err u403))
(define-constant ERR-POOL-NOT-ACTIVE (err u404))
(define-constant ERR-ALREADY-DELEGATED (err u409))
(define-constant ERR-TOO-EARLY-TO-COMMIT (err u500))
(define-constant ERR-BELOW-MINIMUM (err u501))
(define-constant ERR-DELEGATION-EXPIRED (err u502))
(define-constant ERR-NO-COMMIT-INDEX (err u503))

;; --- Constants ---
;; The mainnet pox-4 contract address. Update to the testnet principal
;; (ST000000000000000000002AMW42H.pox-4) when deploying to testnet.
(define-constant POX-4-CONTRACT 'SP000000000000000000002Q6VF78.pox-4)

;; The pool operator is the tx-sender who deployed this contract.
;; All privileged functions (delegate-stack-stx, commit, increase) are
;; restricted to this principal.
(define-constant POOL-ADMIN tx-sender)

;; --- Data Variables ---
;; Stores the Bitcoin address (as a Clarity pox-addr tuple) used for
;; receiving BTC stacking rewards. Set once at initialization.
(define-data-var pool-pox-address
  { version: (buff 1), hashbytes: (buff 32) }
  { version: 0x04, hashbytes: 0x0000000000000000000000000000000000000000000000000000000000000000 })

;; Tracks whether the pool is accepting new delegations.
(define-data-var pool-active bool false)

;; Stores the reward-set index returned by stack-aggregation-commit-indexed
;; for the current/most recent commit. This is needed for increase calls.
(define-data-var last-reward-set-index (optional uint) none)

;; Tracks how much uSTX has been staged (partially stacked) across all
;; current delegators for accounting purposes.
(define-data-var total-staged-ustx uint u0)

;; --- Maps ---
;; Records all delegators who have used this contract to delegate.
;; Maps a delegator's principal to the amount they authorized.
(define-map delegators principal uint)

;; --- Read-Only Functions ---

(define-read-only (get-pool-pox-address)
  (var-get pool-pox-address))

(define-read-only (is-pool-active)
  (var-get pool-active))

(define-read-only (get-delegator-info (who principal))
  (map-get? delegators who))

(define-read-only (get-total-staged)
  (var-get total-staged-ustx))

(define-read-only (get-last-reward-set-index)
  (var-get last-reward-set-index))

;; Helper: get the current PoX minimum stacking threshold in uSTX.
;; Developers can call this to check whether the pool has enough
;; staged STX to call stack-aggregation-commit-indexed.
(define-read-only (get-stacking-minimum)
  (get min-threshold-ustx (unwrap-panic (contract-call? POX-4-CONTRACT get-pox-info))))

;; --- Admin Functions ---

;; Initialize the pool with the BTC reward address and mark it active.
;; Must be called by the pool admin before any stacking activity.
;; 'btc-version' is the address type byte (e.g., 0x04 for native P2WPKH).
;; 'btc-hashbytes' is the 32-byte hash of the Bitcoin address.
(define-public (initialize-pool
    (btc-version (buff 1))
    (btc-hashbytes (buff 32)))
  (begin
    (asserts! (is-eq tx-sender POOL-ADMIN) ERR-NOT-AUTHORIZED)
    (asserts! (not (var-get pool-active)) ERR-ALREADY-DELEGATED)
    (var-set pool-pox-address { version: btc-version, hashbytes: btc-hashbytes })
    (var-set pool-active true)
    (ok true)))

;; Deactivate the pool to prevent new delegations.
(define-public (deactivate-pool)
  (begin
    (asserts! (is-eq tx-sender POOL-ADMIN) ERR-NOT-AUTHORIZED)
    (var-set pool-active false)
    (ok true)))

;; --- User-Facing Delegation Function ---

;; Users call this function to delegate their STX to the pool.
;; It handles two things in a single transaction:
;;   1. Calls pox-4.delegate-stx so the pool operator can lock their STX.
;;   2. Records the delegator in our local map for accounting.
;;
;; Before calling this, the user must first call:
;;   pox-4.allow-contract-caller (as-contract tx-sender) none
;; to allow this contract to call pox-4 functions on their behalf.
;;
;; Parameters:
;;   amount-ustx   — how much STX to authorize (in uSTX; 1 STX = 1,000,000 uSTX)
;;   until-burn-ht — optional Bitcoin block height at which the delegation expires
(define-public (delegate-to-pool
    (amount-ustx uint)
    (until-burn-ht (optional uint)))
  (begin
    (asserts! (var-get pool-active) ERR-POOL-NOT-ACTIVE)
    ;; Record this delegator locally before calling pox-4, so we track
    ;; them even if the delegation state already exists.
    (map-set delegators tx-sender amount-ustx)
    ;; Delegate to the pool operator. We pass 'none' for pox-addr so the
    ;; pool operator is free to use the shared pool BTC address. If a
    ;; delegator wants to specify their own BTC address, they should call
    ;; pox-4.delegate-stx directly instead of using this wrapper.
    (try! (contract-call? POX-4-CONTRACT delegate-stx
      amount-ustx
      POOL-ADMIN
      until-burn-ht
      none))
    (ok true)))

;; --- Pool Operator: Activate a Delegator's Position ---

;; Called by the pool admin once for each delegator to "partially stack"
;; their STX. This stages the delegator's funds in the pox-4
;; partial-stacked-by-cycle map so they count toward the aggregate commit.
;;
;; Parameters:
;;   stacker       — the delegator's STX principal
;;   amount-ustx   — how much uSTX to lock (must not exceed what they authorized)
;;   start-burn-ht — current BTC block height + 1 or 2 (targets next cycle)
;;   lock-period   — number of reward cycles to lock for (1–12)
(define-public (activate-delegator
    (stacker principal)
    (amount-ustx uint)
    (start-burn-ht uint)
    (lock-period uint))
  (begin
    (asserts! (is-eq tx-sender POOL-ADMIN) ERR-NOT-AUTHORIZED)
    (asserts! (var-get pool-active) ERR-POOL-NOT-ACTIVE)
    ;; Stage this delegator's STX against the pool's BTC reward address.
    ;; The pox-4 contract verifies that 'stacker' has actually delegated
    ;; to tx-sender (POOL-ADMIN) and that 'amount-ustx' does not exceed
    ;; their authorized amount.
    (try! (contract-call? POX-4-CONTRACT delegate-stack-stx
      stacker
      amount-ustx
      (var-get pool-pox-address)
      start-burn-ht
      lock-period))
    ;; Update our running total for bookkeeping.
    (var-set total-staged-ustx (+ (var-get total-staged-ustx) amount-ustx))
    (ok true)))

;; --- Pool Operator: Commit the Aggregate ---

;; Called by the pool admin after enough delegators have been activated
;; to meet the stacking minimum. This registers the pool in the reward
;; set for the specified reward cycle.
;;
;; This function MUST be called before the prepare phase of the target
;; reward cycle (i.e., before the last 100 Bitcoin blocks of the cycle
;; preceding the one you are committing to).
;;
;; The signer-sig and signer-key come from your stacks-signer software.
;; Generate the signature using:
;;   stacks-signer generate-stacking-signature \
;;     --method agg-commit \
;;     --period 1 \
;;     --reward-cycle <cycle> \
;;     --pox-address <your-btc-addr> \
;;     --max-amount <max-ustx> \
;;     --auth-id <random-uint> \
;;     --config ~/stacks-signer/signer-config.toml
;;
;; Parameters:
;;   reward-cycle — the future cycle to commit to (usually current_cycle + 1)
;;   signer-sig   — 65-byte signature from your signer (or none to use set-signer-key-authorization)
;;   signer-key   — 33-byte compressed public key of your signer
;;   max-amount   — must match what was used to generate signer-sig
;;   auth-id      — random uint used to prevent signature replay
(define-public (commit-pool
    (reward-cycle uint)
    (signer-sig (optional (buff 65)))
    (signer-key (buff 33))
    (max-amount uint)
    (auth-id uint))
  (let ((current-min (get-stacking-minimum)))
    (asserts! (is-eq tx-sender POOL-ADMIN) ERR-NOT-AUTHORIZED)
    (asserts! (var-get pool-active) ERR-POOL-NOT-ACTIVE)
    ;; Verify the pool has staged enough STX to be eligible.
    ;; The pox-4 contract also enforces this, but we check early to
    ;; give the operator a clear error before spending gas.
    (asserts! (>= (var-get total-staged-ustx) current-min) ERR-BELOW-MINIMUM)
    ;; Commit the partially-stacked STX to the reward set.
    ;; On success, pox-4 returns the reward-set index for this entry.
    (let ((index (try! (contract-call? POX-4-CONTRACT stack-aggregation-commit-indexed
          (var-get pool-pox-address)
          reward-cycle
          signer-sig
          signer-key
          max-amount
          auth-id))))
      ;; Persist the index so we can call stack-aggregation-increase later.
      (var-set last-reward-set-index (some index))
      (ok index))))

;; --- Pool Operator: Increase the Committed Position ---

;; If additional delegators join after the initial commit, this function
;; increases the total stacked amount for the same reward cycle.
;; You must have already called activate-delegator for each new delegator
;; before calling this.
;;
;; A fresh signer signature is required for each increase call.
;; Generate it the same way as for commit-pool, but use --method agg-increase.
;;
;; Parameters:
;;   reward-cycle-index — the uint returned by commit-pool
;;   reward-cycle       — the same cycle passed to commit-pool
;;   signer-sig         — new 65-byte signature for this increase
;;   signer-key         — 33-byte compressed public key of your signer
;;   max-amount         — must match the new signature's max-amount
;;   auth-id            — new random uint (must differ from prior calls)
(define-public (increase-pool-commit
    (reward-cycle-index uint)
    (reward-cycle uint)
    (signer-sig (optional (buff 65)))
    (signer-key (buff 33))
    (max-amount uint)
    (auth-id uint))
  (begin
    (asserts! (is-eq tx-sender POOL-ADMIN) ERR-NOT-AUTHORIZED)
    (asserts! (var-get pool-active) ERR-POOL-NOT-ACTIVE)
    (try! (contract-call? POX-4-CONTRACT stack-aggregation-increase
      (var-get pool-pox-address)
      reward-cycle
      reward-cycle-index
      signer-sig
      signer-key
      max-amount
      auth-id))
    (ok true)))

;; --- Delegator: Revoke Delegation ---

;; A delegator can call this at any time to revoke their permission.
;; Note: revocation only affects the *delegation state*, not any STX
;; that has already been locked by delegate-stack-stx. Locked STX will
;; unlock automatically at the end of the lock period.
(define-public (revoke-delegation)
  (begin
    (map-delete delegators tx-sender)
    (try! (contract-call? POX-4-CONTRACT revoke-delegate-stx))
    (ok true)))
```

---

## Part 4: Contract Walkthrough — Key Design Decisions

### Error Constants

Notice that every error is declared as a named constant at the top of the contract using `define-constant`. This is the correct pattern in Clarity. The original contribution used an inline `(err u403)` with no declaration or context — that is valid syntax, but it makes the contract impossible to audit or debug because a caller receiving `u403` has no way of knowing what went wrong. Named error constants are self-documenting and directly inspectable in the [Stacks Explorer](https://explorer.hiro.so/).

### `POOL-ADMIN` is set at deployment

The pattern `(define-constant POOL-ADMIN tx-sender)` captures `tx-sender` at the moment the contract is *deployed*, not at call time. This is an important distinction in Clarity: `tx-sender` inside a `define-constant` form is evaluated once during contract deployment, so `POOL-ADMIN` is permanently bound to the deployer's address. Every privileged function then uses `(asserts! (is-eq tx-sender POOL-ADMIN) ERR-NOT-AUTHORIZED)` — valid Clarity syntax, unlike the `tx-sender.pool-admin` field access used in the original contribution, which is not valid.

### Why `allow-contract-caller` is required

The pox-4 contract's `check-caller-allowed` function prevents arbitrary contracts from calling stacking functions on a user's behalf without explicit permission. Users who want to delegate through your wrapper contract must first call:

```clarity
(contract-call? 'SP000000000000000000002Q6VF78.pox-4 allow-contract-caller
  .pool-operator
  none)
```

This grants your contract indefinite permission to call pox-4 on their behalf. Pass a `(some burn-height)` instead of `none` to set an expiry. Without this step, any call from your contract that touches the user's stacking state will fail with `ERR_STACKING_PERMISSION_DENIED`.

### The BTC address `pox-addr` tuple

The `pool-pox-address` data variable stores your pool's Bitcoin reward address as a Clarity tuple `{ version: (buff 1), hashbytes: (buff 32) }`. The `version` byte encodes the Bitcoin address type:

| Value | Address Type |
|---|---|
| `0x00` | P2PKH |
| `0x01` | P2SH |
| `0x02` | P2WPKH (wrapped) |
| `0x03` | P2WSH (wrapped) |
| `0x04` | Native P2WPKH |
| `0x05` | Native P2WSH |
| `0x06` | P2TR (Taproot) |

The `hashbytes` for native SegWit addresses are 32 bytes (even though the underlying hash is 20 bytes, padded to 32). You can derive these values from a Bitcoin library or from the Stacks Explorer's address converter.

### Reward cycle targeting in `activate-delegator`

`delegate-stack-stx` always stages STX for the **next** reward cycle, regardless of `start-burn-ht`. The `start-burn-ht` parameter is validated to ensure it resolves to the next cycle (not the current one or a future one), which is why passing the current BTC block height + 1 or + 2 is the safe choice. When you later call `commit-pool`, the `reward-cycle` argument must match the cycle that `delegate-stack-stx` staged for.

### Signer signature for `agg-commit`

The signer signature for `stack-aggregation-commit-indexed` must be generated with `method = "agg-commit"` and `period = 1`. The `reward-cycle` field in the signature must equal the `reward-cycle` argument you pass to the contract function — unlike solo stacking where the signature uses the current cycle, pool commits use a future cycle directly. A mismatch on any parameter (pox-addr, reward-cycle, max-amount, auth-id) will produce `ERR_INVALID_SIGNATURE_PUBKEY` (error 35).

---

## Part 5: Generating a Signer Key Signature

Your pool cannot commit without a valid signature from your signer. Once your signer is running, use the `stacks-signer` CLI to generate it:

```bash
~/stacks-signer/stacks-signer generate-stacking-signature \
  --method agg-commit \
  --period 1 \
  --reward-cycle 558 \
  --pox-address bc1qyour...btcaddress \
  --max-amount 5000000000000 \
  --auth-id 8472910384 \
  --config ~/stacks-signer/signer-config.toml \
  --json
```

This outputs a JSON object with `signerKey` (your 33-byte compressed public key) and `signerSignature` (the 65-byte signature). These are the values you pass as `signer-key` and `signer-sig` in `commit-pool`.

> **Security:** The `auth-id` is a random integer that prevents replay attacks — once a signature is consumed by a successful contract call, the same `auth-id` cannot be used again for the same `(pox-addr, reward-cycle, signer-key)` combination. Generate a new random `auth-id` for every signature.

> **Key grief attack:** If an operator passes an unauthorized or incorrect signer key, they can grief the entire reward address — all BTC payouts to that PoX address will cease for that cycle. pox-4's `consume-signer-key-authorization` function is the enforcement mechanism that prevents this by requiring the signature to cryptographically prove you control the signer key.

---

## Part 6: End-to-End Deployment Walkthrough

Here is the complete sequence from a fresh deployment to a committed pool.

### 6.1 — Deploy and initialize

```bash
clarinet deploy --network testnet
```

After deployment, call `initialize-pool` with your Bitcoin reward address:

```clarity
(contract-call? .pool-operator initialize-pool
  0x04  ;; Native P2WPKH
  0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890)
```

### 6.2 — Users grant permission to the contract

Each delegator must call this once from their wallet:

```clarity
(contract-call? 'SP000000000000000000002Q6VF78.pox-4 allow-contract-caller
  'SPyourcontractaddress.pool-operator
  none)
```

### 6.3 — Users delegate via the contract

```clarity
(contract-call? 'SPyourcontractaddress.pool-operator delegate-to-pool
  u500000000000  ;; 500,000 STX in uSTX
  none)          ;; no expiry
```

### 6.4 — Pool admin activates each delegator

For each delegator, the pool admin submits:

```clarity
(contract-call? .pool-operator activate-delegator
  'ST1DELEGATORaddress...
  u500000000000    ;; amount to lock
  u100001          ;; current BTC block + 1
  u1)              ;; lock for 1 cycle
```

Check the current `min_threshold_ustx` at any time with:

```clarity
(contract-call? .pool-operator get-stacking-minimum)
```

Or via the Hiro API:

```
GET https://api.hiro.so/v2/pox
```

Look for the `min_threshold_ustx` field in the response.

### 6.5 — Commit the pool

Once total staged STX meets the minimum, generate your signer signature (see Part 5) and call:

```clarity
(contract-call? .pool-operator commit-pool
  u558                              ;; reward cycle
  (some 0xabcd...your65bytesig)     ;; signer signature
  0xabcd...your33bytepubkey         ;; signer public key
  u5000000000000                    ;; max-amount used in signature
  u8472910384)                      ;; auth-id used in signature
```

On success this returns `(ok uint)` where the uint is your reward set index. Save it for potential `increase-pool-commit` calls.

### 6.6 — Increase if needed

If more delegators join before the prepare phase, activate them with `activate-delegator`, then increase the commit:

```clarity
(contract-call? .pool-operator increase-pool-commit
  u3                                ;; reward-set index from commit-pool
  u558                              ;; same reward cycle
  (some 0xnew...65bytesig)          ;; fresh signature
  0xabcd...your33bytepubkey
  u6000000000000                    ;; new max-amount
  u9183746205)                      ;; new auth-id
```

---

## Part 7: Testing with Clarinet

Add the following to `tests/pool-operator_test.ts` to verify the core delegation flow on a local simnet:

```typescript
import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.7.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.170.0/testing/asserts.ts';

Clarinet.test({
  name: "pool admin can initialize the pool",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const admin = accounts.get('deployer')!;

    let block = chain.mineBlock([
      Tx.contractCall('pool-operator', 'initialize-pool', [
        types.buff(Buffer.from('04', 'hex')),
        types.buff(Buffer.alloc(32)),
      ], admin.address),
    ]);

    assertEquals(block.receipts[0].result, '(ok true)');
    assertEquals(block.receipts[0].events.length, 0);
  },
});

Clarinet.test({
  name: "non-admin cannot initialize the pool",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const notAdmin = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      Tx.contractCall('pool-operator', 'initialize-pool', [
        types.buff(Buffer.from('04', 'hex')),
        types.buff(Buffer.alloc(32)),
      ], notAdmin.address),
    ]);

    // Should fail with ERR-NOT-AUTHORIZED (u401)
    assertEquals(block.receipts[0].result, '(err u401)');
  },
});

Clarinet.test({
  name: "user can delegate to pool after initialization",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const admin = accounts.get('deployer')!;
    const delegator = accounts.get('wallet_1')!;

    // Initialize pool first
    chain.mineBlock([
      Tx.contractCall('pool-operator', 'initialize-pool', [
        types.buff(Buffer.from('04', 'hex')),
        types.buff(Buffer.alloc(32)),
      ], admin.address),
    ]);

    // Delegator calls delegate-to-pool
    let block = chain.mineBlock([
      Tx.contractCall('pool-operator', 'delegate-to-pool', [
        types.uint(500_000_000_000),
        types.none(),
      ], delegator.address),
    ]);

    // On simnet pox-4 calls may fail due to missing pox state setup;
    // in integration tests against devnet this should return (ok true).
    console.log(block.receipts[0].result);
  },
});
```

> **Note on simnet limitations:** Clarinet's simnet does not fully simulate pox-4's locking behavior. For end-to-end validation of the full delegation and commit flow, use `clarinet integrate` against a local devnet, or test against the Stacks testnet directly.

---

## Part 8: Reward Distribution

The pox-4 contract sends BTC rewards to the `pox-addr` you specify — your pool's Bitcoin address. How you distribute those rewards to individual delegators is entirely up to you, and there is currently no automated on-chain mechanism for it since PoX rewards are Bitcoin transactions, not Stacks transactions.

Common approaches used in production:

- **Off-chain accounting with on-chain proof:** Record each delegator's contribution in a Clarity map (as this contract does with `delegators`), read those values off-chain, and distribute BTC proportionally via a multi-sig or scripted Bitcoin wallet.
- **Liquid stacking token:** Issue a fungible token (e.g., `stSTX`) proportional to delegated STX. Token holders redeem it for BTC rewards when distributed. This is the approach used by Stacking protocols like StackingDAO.
- **Wrapper contract with on-chain proportion tracking:** Extend this contract with a `reward-distribution` map that tracks each delegator's share as a fraction of `total-staged-ustx`, then use that as the basis for BTC distribution accounting.

Whichever approach you choose, make the mechanism transparent to your delegators before they trust you with their STX.

---

## Summary Checklist

Work through this checklist before going live on mainnet:

- [ ] **Signer running:** Your `stacks-signer` software is configured with the correct `stacks_private_key` and is polling your Stacks node.
- [ ] **Key separation confirmed:** You have a dedicated pool operator STX address separate from your signer key.
- [ ] **Pool initialized:** `initialize-pool` has been called with a valid BTC address tuple.
- [ ] **`allow-contract-caller` documented:** You have clearly instructed delegators to call this before using `delegate-to-pool`.
- [ ] **Stacking minimum checked:** `get-stacking-minimum` or the `/v2/pox` endpoint confirms your staged total exceeds `min_threshold_ustx`.
- [ ] **Reward cycle timing verified:** You are calling `commit-pool` before the prepare phase (last 100 BTC blocks of the current cycle). The target `reward-cycle` matches what was used in `delegate-stack-stx` and in your signer signature.
- [ ] **Signer signature parameters match exactly:** `pox-addr`, `reward-cycle`, `max-amount`, and `auth-id` in the signature are identical to the values passed to `commit-pool`. Any mismatch will cause ERR_INVALID_SIGNATURE_PUBKEY (35).
- [ ] **Reward distribution plan published:** Delegators know how and when they will receive their share of BTC rewards.
- [ ] **Testnet dry-run complete:** The full flow has been validated end-to-end on testnet or devnet before touching mainnet STX.

---

## Further Reading

- [Operate a Stacking Pool — Stacks Docs](https://docs.stacks.co/operate/stacking-stx/operate-a-stacking-pool)
- [pox-4 Contract Source — GitHub](https://github.com/stacks-network/stacks-core/blob/master/stackslib/src/chainstate/stacks/boot/pox-4.clar)
- [pox-4 Contract on Mainnet Explorer](https://explorer.hiro.so/txid/SP000000000000000000002Q6VF78.pox-4?chain=mainnet)
- [Run a Signer — Stacks Docs](https://docs.stacks.co/operate/run-a-signer)
- [Stacking Contract Reference — Stacks Docs](https://docs.stacks.co/reference/clarity/example-contracts/stacking)
- [friedger/clarity-stacking-pools — Production Pool Examples](https://github.com/friedger/clarity-stacking-pools)
- [Hiro /v2/pox API Endpoint](https://api.hiro.so/v2/pox)
