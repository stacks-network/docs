# Module 18: DeFi Patterns - The Marketplace Trait (Escrow Listings)

**Author:** @jadonamite
**Difficulty:** Advanced
**Time:** 20 Minutes

In Ethereum (ERC-721), you have `setApprovalForAll`. You keep the NFT in your wallet, and OpenSea pulls it when sold.
In Stacks (SIP-009), the standard does **not** include an approval mechanism. `transfer` enforces `tx-sender == sender`.

This means a Marketplace contract cannot pull an NFT from your wallet unless you built custom logic into the NFT beforehand.

Therefore, the standard "Safe Listing" pattern in Stacks is **Escrow**:

1. **List:** User transfers NFT -> Marketplace Contract.
2. **Buy:** Marketplace transfers NFT -> Buyer (and STX -> Seller).
3. **Cancel:** Marketplace transfers NFT -> Seller.

This module defines a **Marketplace Trait** to standardize this interaction, ensuring any marketplace you integrate with follows the same safety rules.

## 1. Defining the Marketplace Trait

We want a standard interface so wallets and dashboards know how to list items.

**File:** `contracts/marketplace-trait.clar`

```clarity
(use-trait sip-009-trait .sip-009-trait.sip-009-trait)

(define-trait marketplace-trait
    (
        ;; List an item for sale
        ;; Input: (nft-contract, token-id, price)
        ;; Result: Returns listing ID or true
        (list-asset (<sip-009-trait> uint uint) (response uint uint))

        ;; Cancel a listing (Must return item to owner)
        ;; Input: (listing-id, nft-contract)
        (cancel-listing (uint <sip-009-trait>) (response bool uint))

        ;; Buy an item
        ;; Input: (listing-id, nft-contract)
        (buy-asset (uint <sip-009-trait>) (response bool uint))
    )
)

```

## 2. Implementing the Marketplace (Escrow Logic)

Now we build a marketplace that implements this trait. It acts as a trusted escrow vault.

**File:** `contracts/nft-marketplace.clar`

```clarity
(impl-trait .marketplace-trait.marketplace-trait)
(use-trait sip-009-trait .sip-009-trait.sip-009-trait)

(define-constant ERR-NOT-FOUND (err u404))
(define-constant ERR-WRONG-OWNER (err u401))
(define-constant ERR-PAYMENT-FAILED (err u402))

;; Data Storage
;; Map Listing ID -> { Seller, Price, Token-ID }
(define-map listings 
    uint 
    {
        seller: principal,
        price: uint,
        token-id: uint,
        nft-contract: principal
    }
)

(define-data-var listing-nonce uint u0)

;; 1. LIST ASSET (Escrow In)
(define-public (list-asset (nft-contract <sip-009-trait>) (token-id uint) (price uint))
    (let
        (
            (listing-id (var-get listing-nonce))
            (sender tx-sender)
        )
        ;; Verify ownership/custody is handled by the transfer call below.
        ;; If the user doesn't own it, transfer fails.
        
        ;; 1. ESCROW: Transfer NFT from User -> Marketplace (as-contract tx-sender)
        (try! (contract-call? nft-contract transfer token-id sender (as-contract tx-sender)))

        ;; 2. Store Listing Details
        (map-set listings listing-id {
            seller: sender,
            price: price,
            token-id: token-id,
            nft-contract: (contract-of nft-contract)
        })

        ;; 3. Increment ID
        (var-set listing-nonce (+ listing-id u1))
        (ok listing-id)
    )
)

;; 2. CANCEL LISTING (Escrow Out - Return)
(define-public (cancel-listing (listing-id uint) (nft-contract <sip-009-trait>))
    (let
        (
            (listing (unwrap! (map-get? listings listing-id) ERR-NOT-FOUND))
            (seller (get seller listing))
            (token-id (get token-id listing))
        )
        ;; Security: Only the seller can cancel
        (asserts! (is-eq tx-sender seller) ERR-WRONG-OWNER)
        
        ;; Security: Ensure the contract passed matches the listing
        (asserts! (is-eq (contract-of nft-contract) (get nft-contract listing)) ERR-WRONG-OWNER)

        ;; 1. RETURN: Transfer NFT from Marketplace -> Seller
        (try! (as-contract (contract-call? nft-contract transfer token-id tx-sender seller)))

        ;; 2. Delete Listing
        (map-delete listings listing-id)
        (ok true)
    )
)

;; 3. BUY ASSET (Escrow Out - Sale)
(define-public (buy-asset (listing-id uint) (nft-contract <sip-009-trait>))
    (let
        (
            (listing (unwrap! (map-get? listings listing-id) ERR-NOT-FOUND))
            (price (get price listing))
            (seller (get seller listing))
            (token-id (get token-id listing))
            (buyer tx-sender)
        )
        ;; Security: Contract match
        (asserts! (is-eq (contract-of nft-contract) ---

## PR Submission

**Target Repository:** `stacks-network/stacks-docs`

**PR Title Format:**
`docs(tutorial): DeFi - Marketplace Trait & Escrow Patterns`

**PR Description Template:**

```markdown
## Description
This PR adds **Module 18: DeFi Patterns** by @jadonamite. It details the implementation of a SIP-009 compliant NFT Marketplace using the Escrow pattern.

## Content Overview
- **The Protocol Gap:** Why SIP-009 requires escrow (vs ERC-721 approvals).
- **Trait Definition:** Standardizing `list`, `buy`, and `cancel` functions.
- **Escrow Logic:** Securely holding and releasing assets via `as-contract`.

## Checklist
- [x] Tested with standard SIP-009 tokens.
- [x] Security checks for `cancel-listing` ownership verified.
- [x] Formatting follows the repository's style guide.

## Related Issues
Closes # (If applicable)

```(get nft-contract listing)) ERR-WRONG-OWNER)

        ;; 1. PAY: Transfer STX from Buyer -> Seller
        (try! (stx-transfer? price buyer seller))

        ;; 2. DELIVER: Transfer NFT from Marketplace -> Buyer
        (try! (as-contract (contract-call? nft-contract transfer token-id tx-sender buyer)))

        ;; 3. Cleanup
        (map-delete listings listing-id)
        (ok true)
    )
)

```

## 3. Why Escrow? (The `transfer` Problem)

Why didn't we just leave the NFT in the user's wallet?

If we tried to write `buy-asset` without escrow:

1. Marketplace calls `(contract-call? nft transfer ...)`
2. Inside NFT contract: `tx-sender` is **Buyer**. `sender` (owner) is **Seller**.
3. Standard SIP-009 Assert: `(asserts! (is-eq tx-sender sender) ...)`
4. **Result:** `Buyer != Seller`. Transaction Fails.

Escrow solves this by making the **Marketplace** the owner. When `buy-asset` runs, the Marketplace (Contract) calls transfer. `tx-sender` becomes the Marketplace (via `as-contract`). `sender` is the Marketplace. `(is-eq Marketplace Marketplace)` -> **Success**.

## 4. Summary Checklist

* [ ] **Trait Interface:** Does your marketplace implement `list`, `cancel`, and `buy`?
* [ ] **Contract Principal:** Do you use `(contract-of <trait>)` to verify the asset being sold matches the asset in storage?
* [ ] **As-Contract:** Are you using `as-contract` when the marketplace needs to move the NFT out of escrow?

