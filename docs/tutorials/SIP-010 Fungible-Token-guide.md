# Module 16: Token Standards - Creating a SIP-010 Fungible Token

**Author:** @jadonamite
**Difficulty:** Beginner
**Time:** 20 Minutes

In Ethereum, you have ERC-20. In Stacks, we have **SIP-010**.

SIP-010 is the standard Trait definition for Fungible Tokens. By implementing this trait, your token automatically works with wallets (Hiro/Xverse), DEXs (Alex/Velar), and other DeFi protocols.

This module guides you through creating a standard token with **Dynamic Supply** capabilities (Minting and Burning), secured by permission checks.

## 1. Prerequisites: The Trait Definition

To "be" a SIP-010 token, you must promise to fulfill the standard interface. In a real project, you often import this trait from a mainnet address (e.g., `'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard`), but for local development, we define it manually.

**File:** `contracts/sip-010-trait.clar`

```clarity
(define-trait sip-010-trait
  (
    ;; Transfer from the sender to a new principal
    (transfer (uint principal principal (optional (buf 34))) (response bool uint))

    ;; Human readable name (e.g., "My Token")
    (get-name () (response (string-ascii 32) uint))

    ;; Ticker symbol (e.g., "MTK")
    (get-symbol () (response (string-ascii 32) uint))

    ;; Decimals (usually u6)
    (get-decimals () (response uint uint))

    ;; Balance of a specific principal
    (get-balance (principal) (response uint uint))

    ;; Current total supply
    (get-total-supply () (response uint uint))

    ;; Optional URI for metadata (image, description)
    (get-token-uri () (response (optional (string-utf8 256)) uint))
  )
)

```

## 2. The Implementation

Now we write the actual token contract.

**Key Clarity Native:** `define-fungible-token`.
Clarity has built-in support for tokens. You don't need to manually map balances like in Solidity (`mapping(address => uint)`). Clarity handles the ledger for you.

**File:** `contracts/my-token.clar`

```clarity
;; 1. Assert Compliance
(impl-trait .sip-010-trait.sip-010-trait)

;; 2. Define the Token
;; 'my-token' is the identifier. No max supply defined here (dynamic).
(define-fungible-token my-token)

;; 3. Constants & Error Codes
(define-constant CONTRACT-OWNER tx-sender)
(define-constant ERR-NOT-AUTHORIZED (err u100))

;; 4. SIP-010 Interface Implementation

(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buf 34))))
    (begin
        ;; CHECK: Ensure the caller is the sender OR the sender is the contract caller (if authorized)
        ;; For strict SIP-010, usually we enforce tx-sender == sender
        (asserts! (is-eq tx-sender sender) ERR-NOT-AUTHORIZED)
        
        ;; EFFECT & INTERACTION: The native transfer function
        (try! (ft-transfer? my-token amount sender recipient))
        
        ;; Optional: Emit an event via print for indexers
        (match memo to-print (print to-print) 0x)
        (ok true)
    )
)

(define-read-only (get-name)
    (ok "My Dynamic Token")
)

(define-read-only (get-symbol)
    (ok "MDT")
)

(define-read-only (get-decimals)
    (ok u6) ;; 6 decimals is standard for Stacks
)

(define-read-only (get-balance (who principal))
    (ok (ft-get-balance my-token who))
)

(define-read-only (get-total-supply)
    (ok (ft-get-supply my-token))
)

(define-read-only (get-token-uri)
    (ok (some u"https://my-token.com/metadata.json"))
)

;; 5. Administrative Functions (Mint/Burn)

;; Minting: Creating new tokens out of thin air
;; Security: ONLY the contract owner can do this.
(define-public (mint (amount uint) (recipient principal))
    (begin
        (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
        (ft-mint? my-token amount recipient)
    )
)

;; Burning: Destroying tokens to reduce supply
;; Security: Anyone can burn their OWN tokens.
(define-public (burn (amount uint))
    (begin
        ;; No permissions needed to burn your own money
        (ft-burn? my-token amount tx-sender)
    )
)

```

## 3. Deployment Checklist

When you deploy this to Testnet or Mainnet:

1. **Trait Reference:** If deploying `my-token.clar`, ensure the `impl-trait` line points to a deployed trait contract.
* **Mainnet:** `(impl-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)`
* **Testnet:** `(impl-trait 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.sip-010-trait-ft-standard.sip-010-trait)`


2. **Decimals:** If you choose `u6`, remember that `1 token` = `1,000,000 micro-tokens`. When calling mint, if you want 100 tokens, you must pass `100000000`.
3. **Post-Conditions:** When a frontend calls `transfer`, `mint`, or `burn`, the wallet will prompt the user with a Post-Condition (e.g., "This tx will transfer 50 MDT"). Because we used the native `ft-` functions, Stacks wallets detect this automatically.

## 4. Summary Checklist

* [ ] **Trait Compliance:** Did you implement *all* 7 read-only/public functions required by SIP-010?
* [ ] **Permissioned Minting:** Did you protect the `mint` function with an owner check?
* [ ] **Native Functions:** Are you using `ft-transfer?`, `ft-mint?`, and `ft-burn?` instead of map manipulation?


```
