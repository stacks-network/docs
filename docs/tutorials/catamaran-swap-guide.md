# Module 28: Bitcoin Logic - Building a "Catamaran Swap"

**Author:** @jadonamite
**Difficulty:** Expert
**Time:** 40 Minutes

A **Catamaran Swap** is a trustless Atomic Swap between Stacks and Bitcoin. It leverages Stacks' unique "Read-Only" view of the Bitcoin chain.

Unlike traditional Atomic Swaps (HTLCs) where both chains need smart contracts, here **only Stacks needs a contract**.

1. **Stacks Side:** A contract locks STX. It says: *"I will give this STX to anyone who proves they sent 1 BTC to Alice."*
2. **Bitcoin Side:** A standard, dumb Bitcoin transaction. No scripts, no multisig. Just a payment.

This module combines **Module 25** (Proof Verification) and **Module 26** (Parsing) to build a fully functional swap contract.

## 1. The Dependencies

Parsing Bitcoin transactions is complex. We rely on the community-standard `clarity-bitcoin` library to extract values and recipients from raw bytes.

* **Requirement:** In your `Clarinet.toml`, add the `clarity-bitcoin` contract (usually from `friedger` or `arkadiko` on mainnet). For this tutorial, we assume helper functions are available.

## 2. The Architecture

**The Swap Lifecycle:**

1. **Create (Seller):** Seller locks 1000 STX in the contract. They define:
* Price: 0.01 BTC.
* Recipient: Seller's Bitcoin Address (formatted as a script-pubkey).
* Expiry: 100 Bitcoin blocks.


2. **Pay (Buyer):** Buyer sees the offer. Sends 0.01 BTC to the Seller's Bitcoin address on the L1.
3. **Claim (Buyer):** Buyer submits the BTC transaction + Merkle Proof to the Stacks contract.
4. **Settlement:** Contract verifies the proof and the payment details, then releases 1000 STX to the Buyer.

## 3. The Contract Implementation

**File:** `contracts/catamaran-swap.clar`

```clarity
;; 1. Constants & Errors
(define-constant ERR-INVALID-PROOF (err u100))
(define-constant ERR-WRONG-AMOUNT (err u101))
(define-constant ERR-WRONG-RECIPIENT (err u102))
(define-constant ERR-ALREADY-CLAIMED (err u103))
(define-constant ERR-EXPIRED (err u104))
(define-constant ERR-NOT-EXPIRED (err u105))

;; 2. Data Structure
(define-map swaps uint {
    seller: principal,
    buyer: (optional principal), ;; Optional: Can be open to anyone or reserved
    stx-amount: uint,
    btc-amount: uint, ;; In Satoshis
    btc-receiver: (buff 128), ;; The Seller's Bitcoin ScriptPubKey
    expiry: uint, ;; Bitcoin Block Height
    done: bool
})
(define-data-var swap-nonce uint u0)

;; 3. Create Swap (Lock STX)
(define-public (create-swap (stx-amount uint) (btc-amount uint) (btc-receiver (buff 128)) (duration uint))
    (let
        (
            (id (var-get swap-nonce))
            (expiry (+ burn-block-height duration))
        )
        ;; Transfer STX to Escrow
        (try! (stx-transfer? stx-amount tx-sender (as-contract tx-sender)))

        ;; Record Swap
        (map-set swaps id {
            seller: tx-sender,
            buyer: none,
            stx-amount: stx-amount,
            btc-amount: btc-amount,
            btc-receiver: btc-receiver,
            expiry: expiry,
            done: false
        })
        (var-set swap-nonce (+ id u1))
        (ok id)
    )
)

;; 4. Complete Swap (Submit Proof)
;; Input: The raw Bitcoin data proving payment was made
(define-public (complete-swap 
    (swap-id uint)
    (block-height uint)
    (header (buff 80))
    (tx (buff 1024))
    (proof { tx-index: uint, hashes: (list 12 (buff 32)), tree-depth: uint })
    (output-index uint) ;; Which output in the BTC tx pays the seller?
)
    (let
        (
            (swap (unwrap! (map-get? swaps swap-id) (err u404)))
            ;; Parse the Transaction using clarity-bitcoin helper (simplified here)
            (parsed-tx (unwrap! (contract-call? .clarity-bitcoin parse-tx tx) (err u500)))
            (output (unwrap! (element-at (get outs parsed-tx) output-index) (err u500)))
        )
        ;; Check 1: Is the swap active?
        (asserts! (not (get done swap)) ERR-ALREADY-CLAIMED)
        
        ;; Check 2: Verify Proof (Was this tx mined?)
        ;; See Module 25 for the implementation of 'was-tx-mined?' wrapper
        (asserts! (is-ok (contract-call? .btc-verifier verify-btc-tx block-height header tx proof)) ERR-INVALID-PROOF)

        ;; Check 3: Verify Payment Details (Did they pay enough?)
        (asserts! (>= (get value output) (get btc-amount swap)) ERR-WRONG-AMOUNT)

        ;; Check 4: Verify Recipient (Did they pay the Seller?)
        (asserts! (is-eq (get scriptPubKey output) (get btc-receiver swap)) ERR-WRONG-RECIPIENT)

        ;; All Good! Release STX to the Tx Sender (Buyer)
        (map-set swaps swap-id (merge swap { done: true }))
        (as-contract (stx-transfer? (get stx-amount swap) tx-sender (get seller swap)))
    )
)

;; 5. Refund (Expiry)
;; If nobody pays, Seller gets STX back.
(define-public (cancel-swap (swap-id uint))
    (let
        (
            (swap (unwrap! (map-get? swaps swap-id) (err u404)))
        )
        (asserts! (is-eq tx-sender (get seller swap)) (err u401))
        (asserts! (not (get done swap)) ERR-ALREADY-CLAIMED)
        ;; Check Bitcoin Time
        (asserts! (> burn-block-height (get expiry swap)) ERR-NOT-EXPIRED)

        (map-set swaps swap-id (merge swap { done: true }))
        (as-contract (stx-transfer? (get stx-amount swap) tx-sender tx-sender))
    )
)

```

## 4. The Critical Component: `scriptPubKey`

The contract doesn't store "Bitcoin Addresses" (like `bc1q...`). It stores the **ScriptPubKey** (the raw locking script).

* **P2PKH (Legacy):** `OP_DUP OP_HASH160 <PubKeyHash> OP_EQUALVERIFY OP_CHECKSIG`
* **P2WPKH (Segwit):** `OP_0 <20-byte-hash>`

**Frontend Tip:** When creating the swap, your frontend must convert the Seller's Bitcoin Address -> ScriptPubKey Hex and pass that to `create-swap`.

## 5. Security Analysis

### Replay Attacks

What if the Buyer submits the *same* Bitcoin proof for two different swaps?

* **Fix:** The contract should verify that the Bitcoin transaction hasn't been used before.
* **Implementation:** Add `(define-map used-btc-txs (buff 32) bool)`. Store `(sha256 tx)` in this map upon success. Fail if it exists.

### Dust Attacks

What if the Buyer sends 1 satoshi?

* **Fix:** The check `(asserts! (>= (get value output) ...)` prevents this.

### Chain Reorgs

What if the Bitcoin block is orphaned?

* **Fix:** The verification logic should check `get-burn-block-info?` for the *canonical* chain. If the Stacks node switches forks, the old header hash will no longer be valid, and the proof will fail (unless the tx is also in the new fork).

---
