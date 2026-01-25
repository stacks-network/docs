# Module 25: Bitcoin Logic - Verifying Transaction Inclusion (`was-tx-mined?`)

**Author:** @jadonamite
**Difficulty:** Expert
**Time:** 30 Minutes

This is the "Holy Grail" of Stacks: **Read-Only Bitcoin access.**
You can write a smart contract that releases funds on Stacks *only if* someone sends 1 BTC to a specific address on the Bitcoin network.

To do this, we don't "query" Bitcoin (smart contracts can't query APIs). Instead, the user submits the **Bitcoin Transaction** and a **Merkle Proof** to the contract. The contract then uses `was-tx-mined?` to mathematically verify that:

1. The transaction exists.
2. It is included in a specific Bitcoin block.

## 1. The Inputs

To verify a transaction, your Clarity function needs three heavy pieces of data, usually fetched from a backend or wallet:

1. **Header:** The raw 80-byte Bitcoin Block Header.
2. **Tx:** The raw Bitcoin transaction bytes.
3. **Proof:** The Merkle path (sibling hashes) connecting the Tx to the Header's Merkle Root.

## 2. The Implementation

**File:** `contracts/btc-verifier.clar`

```clarity
(define-constant ERR-INVALID-HEADER (err u100))
(define-constant ERR-PROOF-FAILED (err u101))
(define-constant ERR-BLOCK-NOT-FOUND (err u404))

;; 1. Validate the Header
;; We trust the header ONLY if the Stacks node recognizes it as a real burn block.
(define-read-only (is-header-valid (header (buff 80)) (height uint))
    (let
        (
            ;; Calculate the hash of the raw header bytes
            (header-hash (sha256 (sha256 header)))
            ;; Ask the Stacks node: "What was the Bitcoin block hash at this height?"
            (canonical-hash (get-burn-block-info? header-hash height))
        )
        ;; If they match, this is a real Bitcoin block.
        (is-eq (some header-hash) canonical-hash)
    )
)

;; 2. The Verification Function
(define-public (verify-btc-tx 
    (height uint) 
    (header (buff 80)) 
    (tx (buff 1024)) 
    (proof { tx-index: uint, hashes: (list 12 (buff 32)), tree-depth: uint })
)
    (begin
        ;; Step A: Ensure the Header is legitimate
        (asserts! (is-header-valid header height) ERR-INVALID-HEADER)

        ;; Step B: Cryptographic Verification
        ;; "Does this transaction + proof calculate up to the Merkle Root in this header?"
        (match (was-tx-mined? header tx proof)
            result 
                (if result
                    (ok true)  ;; Verified!
                    (err ERR-PROOF-FAILED) ;; Math didn't check out
                )
            error (err error) ;; Malformed inputs
        )
    )
)

```

## 3. Parsing the Transaction (Segwit/Legacy)

Verifying the transaction exists is step one. Step two is parsing it to see **who sent what**.
Clarity has `(get-block-info? ...)` but typically you need to parse the raw `tx` buffer manually or use a helper library (like `clarity-bitcoin`) to extract:

* `out-script` (Who received the BTC?)
* `out-value` (How many sats?)

*Note: Parsing raw Bitcoin transactions in Clarity is complex and usually done via imported traits/libraries, but `was-tx-mined?` is the foundation.*

## 4. Where do I get the Proof?

You cannot generate this inside Clarity. Your **Frontend** must fetch it.

* **Hiro API:** `/extended/v1/burnchain/blocks/{height}/transactions/{tx_id}/proof` (This endpoint provides the exact struct needed for `was-tx-mined?`).
* **Electrum:** Can generate Merkle proofs manually.

## 5. Summary Checklist

* [ ] **Header Validation:** Did you verify the `header` against `get-burn-block-info?`? 
* **Proof Structure:** Does the proof tuple structure match the Clarity signature exactly (`tx-index`, `hashes`, `tree-depth`)?
* **Block Height:** Are you passing the Bitcoin block height, not the Stacks block height?

