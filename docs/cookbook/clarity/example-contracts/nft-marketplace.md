# NFT Marketplace

{% code title="nft-marketplace" lineNumbers="true" fullWidth="false" expandable="true" %}
```clarity
;; A tiny NFT marketplace that allows users to list NFT for sale. They can specify the following:
;; - The NFT token to sell.
;; - Listing expiry in block height.
;; - The payment asset, either STX or a SIP010 fungible token.
;; - The NFT price in said payment asset.
;; - An optional intended taker. If set, only that principal will be able to fulfil the listing.
;;
;; Source: https://github.com/clarity-lang/book/tree/main/projects/tiny-market

(use-trait nft-trait 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait)
(use-trait ft-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

(define-constant contract-owner tx-sender)

;; listing errors
(define-constant ERR_EXPIRY_IN_PAST (err u1000))
(define-constant ERR_PRICE_ZERO (err u1001))

;; cancelling and fulfiling errors
(define-constant ERR_UNKNOWN_LISTING (err u2000))
(define-constant ERR_UNAUTHORISED (err u2001))
(define-constant ERR_LISTING_EXPIRED (err u2002))
(define-constant ERR_NFT_ASSET_MISMATCH (err u2003))
(define-constant ERR_PAYMENT_ASSET_MISMATCH (err u2004))
(define-constant ERR_MAKER_TAKER_EQUAL (err u2005))
(define-constant ERR_UNINTENDED_TAKER (err u2006))
(define-constant ERR_ASSET_CONTRACT_NOT_WHITELISTED (err u2007))
(define-constant ERR_PAYMENT_CONTRACT_NOT_WHITELISTED (err u2008))

;; Define a map data structure for the asset listings
(define-map listings
  uint
  {
    maker: principal,
    taker: (optional principal),
    token-id: uint,
    nft-asset-contract: principal,
    expiry: uint,
    price: uint,
    payment-asset-contract: (optional principal),
  }
)

;; Used for unique IDs for each listing
(define-data-var listing-nonce uint u0)

;; This marketplace requires any contracts used for assets or payments to be whitelisted
;; by the contract owner of this (marketplace) contract.
(define-map whitelisted-asset-contracts
  principal
  bool
)

;; Function that checks if the given contract has been whitelisted.
(define-read-only (is-whitelisted (asset-contract principal))
  (default-to false (map-get? whitelisted-asset-contracts asset-contract))
)

;; Only the contract owner of this (marketplace) contract can whitelist an asset contract.
(define-public (set-whitelisted
    (asset-contract principal)
    (whitelisted bool)
  )
  (begin
    (asserts! (is-eq contract-owner tx-sender) ERR_UNAUTHORISED)
    (ok (map-set whitelisted-asset-contracts asset-contract whitelisted))
  )
)

;; Internal function to transfer an NFT asset from a sender to a given recipient.
(define-private (transfer-nft
    (token-contract <nft-trait>)
    (token-id uint)
    (sender principal)
    (recipient principal)
  )
  (contract-call? token-contract transfer token-id sender recipient)
)

;; Internal function to transfer fungible tokens from a sender to a given recipient.
(define-private (transfer-ft
    (token-contract <ft-trait>)
    (amount uint)
    (sender principal)
    (recipient principal)
  )
  (contract-call? token-contract transfer amount sender recipient none)
)

;; Public function to list an asset along with its contract
(define-public (list-asset
    (nft-asset-contract <nft-trait>)
    (nft-asset {
      taker: (optional principal),
      token-id: uint,
      expiry: uint,
      price: uint,
      payment-asset-contract: (optional principal),
    })
  )
  (let ((listing-id (var-get listing-nonce)))
    ;; Verify that the contract of this asset is whitelisted
    (asserts! (is-whitelisted (contract-of nft-asset-contract))
      ERR_ASSET_CONTRACT_NOT_WHITELISTED
    )
    ;; Verify that the asset is not expired
    (asserts! (> (get expiry nft-asset) burn-block-height) ERR_EXPIRY_IN_PAST)
    ;; Verify that the asset price is greater than zero
    (asserts! (> (get price nft-asset) u0) ERR_PRICE_ZERO)
    ;; Verify that the contract of the payment is whitelisted
    (asserts!
      (match (get payment-asset-contract nft-asset)
        payment-asset (is-whitelisted payment-asset)
        true
      )
      ERR_PAYMENT_CONTRACT_NOT_WHITELISTED
    )
    ;; Transfer the NFT ownership to this contract's principal
    (try! (transfer-nft nft-asset-contract (get token-id nft-asset) tx-sender
      (as-contract tx-sender)
    ))
    ;; List the NFT in the listings map
    (map-set listings listing-id
      (merge {
        maker: tx-sender,
        nft-asset-contract: (contract-of nft-asset-contract),
      }
        nft-asset
      ))
    ;; Increment the nonce to use for the next unique listing ID
    (var-set listing-nonce (+ listing-id u1))
    ;; Return the created listing ID
    (ok listing-id)
  )
)

;; Public read-only function to retrieve a listing by its ID
(define-read-only (get-listing (listing-id uint))
  (map-get? listings listing-id)
)

;; Public function to cancel a listing using an asset contract.
;; This function can only be called by the NFT's creator, and must use the same asset contract that
;; the NFT uses.
(define-public (cancel-listing
    (listing-id uint)
    (nft-asset-contract <nft-trait>)
  )
  (let (
      (listing (unwrap! (map-get? listings listing-id) ERR_UNKNOWN_LISTING))
      (maker (get maker listing))
    )
    ;; Verify that the caller of the function is the creator of the NFT to be cancelled
    (asserts! (is-eq maker tx-sender) ERR_UNAUTHORISED)
    ;; Verify that the asset contract to use is the same one that the NFT uses
    (asserts!
      (is-eq (get nft-asset-contract listing) (contract-of nft-asset-contract))
      ERR_NFT_ASSET_MISMATCH
    )
    ;; Delete the listing
    (map-delete listings listing-id)
    ;; Transfer the NFT from this contract's principal back to the creator's principal
    (as-contract (transfer-nft nft-asset-contract (get token-id listing) tx-sender maker))
  )
)

;; Private function to validate that a purchase can be fulfilled
(define-private (assert-can-fulfil
    (nft-asset-contract principal)
    (payment-asset-contract (optional principal))
    (listing {
      maker: principal,
      taker: (optional principal),
      token-id: uint,
      nft-asset-contract: principal,
      expiry: uint,
      price: uint,
      payment-asset-contract: (optional principal),
    })
  )
  (begin
    ;; Verify that the buyer is not the same as the NFT creator
    (asserts! (not (is-eq (get maker listing) tx-sender)) ERR_MAKER_TAKER_EQUAL)
    ;; Verify the buyer has been set in the listing metadata as its `taker`
    (asserts!
      (match (get taker listing)
        intended-taker (is-eq intended-taker tx-sender)
        true
      )
      ERR_UNINTENDED_TAKER
    )
    ;; Verify the listing for purchase is not expired
    (asserts! (< burn-block-height (get expiry listing)) ERR_LISTING_EXPIRED)
    ;; Verify the asset contract used to purchase the NFT is the same as the one set on the NFT
    (asserts! (is-eq (get nft-asset-contract listing) nft-asset-contract)
      ERR_NFT_ASSET_MISMATCH
    )
    ;; Verify the payment contract used to purchase the NFT is the same as the one set on the NFT
    (asserts! (is-eq (get payment-asset-contract listing) payment-asset-contract)
      ERR_PAYMENT_ASSET_MISMATCH
    )
    (ok true)
  )
)

;; Public function to purchase a listing using STX as payment
(define-public (fulfil-listing-stx
    (listing-id uint)
    (nft-asset-contract <nft-trait>)
  )
  (let (
      ;; Verify the given listing ID exists
      (listing (unwrap! (map-get? listings listing-id) ERR_UNKNOWN_LISTING))
      ;; Set the NFT's taker to the purchaser (caller of the_function)
      (taker tx-sender)
    )
    ;; Validate that the purchase can be fulfilled
    (try! (assert-can-fulfil (contract-of nft-asset-contract) none listing))
    ;; Transfer the NFT to the purchaser (caller of the function)
    (try! (as-contract (transfer-nft nft-asset-contract (get token-id listing) tx-sender taker)))
    ;; Transfer the STX payment from the purchaser to the creator of the NFT
    (try! (stx-transfer? (get price listing) taker (get maker listing)))
    ;; Remove the NFT from the marketplace listings
    (map-delete listings listing-id)
    ;; Return the listing ID that was just purchased
    (ok listing-id)
  )
)

;; Public function to purchase a listing using another fungible token as payment
(define-public (fulfil-listing-ft
    (listing-id uint)
    (nft-asset-contract <nft-trait>)
    (payment-asset-contract <ft-trait>)
  )
  (let (
      ;; Verify the given listing ID exists
      (listing (unwrap! (map-get? listings listing-id) ERR_UNKNOWN_LISTING))
      ;; Set the NFT's taker to the purchaser (caller of the_function)
      (taker tx-sender)
    )
    ;; Validate that the purchase can be fulfilled
    (try! (assert-can-fulfil (contract-of nft-asset-contract)
      (some (contract-of payment-asset-contract)) listing
    ))
    ;; Transfer the NFT to the purchaser (caller of the function)
    (try! (as-contract (transfer-nft nft-asset-contract (get token-id listing) tx-sender taker)))
    ;; Transfer the tokens as payment from the purchaser to the creator of the NFT
    (try! (transfer-ft payment-asset-contract (get price listing) taker
      (get maker listing)
    ))
    ;; Remove the NFT from the marketplace listings
    (map-delete listings listing-id)
    ;; Return the listing ID that was just purchased
    (ok listing-id)
  )
)
```
{% endcode %}

## Contract Summary

A tiny NFT marketplace contract that enables users to list, buy, and sell NFTs with flexible payment options. This contract demonstrates trait-based programming and comprehensive marketplace mechanics including expiry, whitelisting, and optional buyer targeting.

**What this contract does:**

* Allows NFT owners to list their tokens for sale with customizable terms
* Supports both STX and SIP-010 fungible token payments
* Implements listing expiry based on block height
* Enables optional buyer restriction (private sales to specific principals)
* Requires contract whitelisting for both NFT and payment assets
* Escrows NFTs in the marketplace contract until sale or cancellation
* Allows sellers to cancel active listings and reclaim their NFTs
* Validates all listing parameters before accepting offers
* Assigns unique IDs to each listing for tracking

**What developers can learn:**

* Using Clarity traits (`<nft-trait>` and `<ft-trait>`) for generic contract interactions
* Implementing marketplace escrow patterns with NFT custody
* Contract whitelisting pattern for security and quality control
* Time-based expiry using block heights
* Optional parameters with `(optional principal)` for flexible configurations
* Comprehensive input validation and error handling
* Using `contract-of` to verify trait implementations
* Pattern matching with `match` for optional values
* Private helper functions for validation and transfers
* Nonce-based unique ID generation with data variables
* As-contract context switching for escrowed asset transfers
