# Build a Decentralized Kickstarter

{% hint style="info" %}
This guide is migrated from the [Hiro documentation](https://docs.hiro.so/en/resources/guides/build-a-decentralized-kickstarter).
{% endhint %}

{% hint style="warning" %}
**Upstream content mismatch:** The Hiro source file for this guide (`build-a-decentralized-kickstarter.mdx`) has the title "Build a decentralized Kickstarter" and description "Learn how to create a crowdfunding app, enabling creators to fund their projects without a third party," but its body content is identical to the NFT marketplace guide. This appears to be an error in the upstream Hiro documentation. The content below is migrated faithfully as-is from the Hiro source.
{% endhint %}

In this guide, you will learn how to create an NFT marketplace that allows users to list NFTs for sale. Users can specify the following details for their listings:
- The NFT token to sell.
- Listing expiry in block height.
- The payment asset, either STX or a SIP010 fungible token.
- The NFT price in the chosen payment asset.
- An optional intended taker. If set, only that principal will be able to fulfil the listing.

This marketplace leverages the following Clarity traits:
- `nft-trait` for handling NFTs.
- `ft-trait` for handling fungible tokens.

Over the course of this guide, you will learn how to:
1. Define and handle errors.
2. Create and manage NFT listings.
3. Whitelist asset contracts.
4. Fulfil NFT purchases.

---

## Define and handle errors

First, define constants for various errors that may occur during listing, cancelling, or fulfilling NFT transactions. This helps in maintaining clean and readable code.

```clarity
;; Define listing errors
(define-constant ERR_EXPIRY_IN_PAST (err u1000))
(define-constant ERR_PRICE_ZERO (err u1001))

;; Define cancelling and fulfilling errors
(define-constant ERR_UNKNOWN_LISTING (err u2000))
(define-constant ERR_UNAUTHORISED (err u2001))
(define-constant ERR_LISTING_EXPIRED (err u2002))
(define-constant ERR_NFT_ASSET_MISMATCH (err u2003))
(define-constant ERR_PAYMENT_ASSET_MISMATCH (err u2004))
(define-constant ERR_MAKER_TAKER_EQUAL (err u2005))
(define-constant ERR_UNINTENDED_TAKER (err u2006))
(define-constant ERR_ASSET_CONTRACT_NOT_WHITELISTED (err u2007))
(define-constant ERR_PAYMENT_CONTRACT_NOT_WHITELISTED (err u2008))
```

## Create and manage NFT listings

### Define data structures

Create a map data structure for the asset listings and a data variable for unique IDs.

```clarity
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
    payment-asset-contract: (optional principal)
  }
)

;; Used for unique IDs for each listing
(define-data-var listing-nonce uint u0)
```

### List an asset

Create a public function to list an asset along with its contract. This function verifies the contract, checks expiry and price, and transfers the NFT ownership to the marketplace.

```clarity
(define-public (list-asset
  (nft-asset-contract <nft-trait>)
  (nft-asset {
    taker: (optional principal),
    token-id: uint,
    expiry: uint,
    price: uint,
    payment-asset-contract: (optional principal)
  })
)
  (let ((listing-id (var-get listing-nonce)))
    ;; Verify that the contract of this asset is whitelisted
    (asserts! (is-whitelisted (contract-of nft-asset-contract)) ERR_ASSET_CONTRACT_NOT_WHITELISTED)
    ;; Verify that the asset is not expired
    (asserts! (> (get expiry nft-asset) block-height) ERR_EXPIRY_IN_PAST)
    ;; Verify that the asset price is greater than zero
    (asserts! (> (get price nft-asset) u0) ERR_PRICE_ZERO)
    ;; Verify that the contract of the payment is whitelisted
    (asserts! (match (get payment-asset-contract nft-asset)
      payment-asset
      (is-whitelisted payment-asset)
      true
    ) ERR_PAYMENT_CONTRACT_NOT_WHITELISTED)
    ;; Transfer the NFT ownership to this contract's principal
    (try! (transfer-nft
      nft-asset-contract
      (get token-id nft-asset)
      tx-sender
      (as-contract tx-sender)
    ))
    ;; List the NFT in the listings map
    (map-set listings listing-id (merge
      { maker: tx-sender, nft-asset-contract: (contract-of nft-asset-contract) }
      nft-asset
    ))
    ;; Increment the nonce to use for the next unique listing ID
    (var-set listing-nonce (+ listing-id u1))
    ;; Return the created listing ID
    (ok listing-id)
  )
)
```

### Retrieve an asset

Create a read-only function to retrieve an asset, or listing, by its ID.

```clarity
(define-read-only (get-listing (listing-id uint))
  (map-get? listings listing-id)
)
```

### Cancel a listing

Create a public function to cancel a listing. Only the NFT's creator can cancel the listing, and it must use the same asset contract that the NFT uses.

```clarity
(define-public (cancel-listing (listing-id uint) (nft-asset-contract <nft-trait>))
  (let (
    (listing (unwrap! (map-get? listings listing-id) ERR_UNKNOWN_LISTING))
    (maker (get maker listing))
  )
    ;; Verify that the caller of the function is the creator of the NFT to be cancelled
    (asserts! (is-eq maker tx-sender) ERR_UNAUTHORISED)
    ;; Verify that the asset contract to use is the same one that the NFT uses
    (asserts! (is-eq
      (get nft-asset-contract listing)
      (contract-of nft-asset-contract)
    ) ERR_NFT_ASSET_MISMATCH)
    ;; Delete the listing
    (map-delete listings listing-id)
    ;; Transfer the NFT from this contract's principal back to the creator's principal
    (as-contract (transfer-nft nft-asset-contract (get token-id listing) tx-sender maker))
  )
)
```

## Whitelist asset contracts

### Whitelist contracts

The marketplace requires any contracts used for assets or payments to be whitelisted by the contract owner. Create a map to store whitelisted asset contracts and a function to check if a contract is whitelisted.

```clarity
(define-map whitelisted-asset-contracts principal bool)

(define-read-only (is-whitelisted (asset-contract principal))
  (default-to false (map-get? whitelisted-asset-contracts asset-contract))
)
```

### Set whitelisted contracts

Only the contract owner can whitelist an asset contract. Create a public function to set whitelisted asset contracts.

```clarity
(define-public (set-whitelisted (asset-contract principal) (whitelisted bool))
  (begin
    (asserts! (is-eq contract-owner tx-sender) ERR_UNAUTHORISED)
    (ok (map-set whitelisted-asset-contracts asset-contract whitelisted))
  )
)
```

## Fulfill NFT purchases

### Fulfill listing with STX

Create a public function to purchase a listing using STX as payment.

```clarity
(define-public (fulfil-listing-stx (listing-id uint) (nft-asset-contract <nft-trait>))
  (let (
    ;; Verify the given listing ID exists
    (listing (unwrap! (map-get? listings listing-id) ERR_UNKNOWN_LISTING))
    ;; Set the NFT's taker to the purchaser (caller of the function)
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
```

### Fulfill listing with SIP-010

Create a public function to purchase a listing using another fungible token that follows the SIP-010 standard as payment.

```clarity
(define-public (fulfil-listing-ft
  (listing-id uint)
  (nft-asset-contract <nft-trait>)
  (payment-asset-contract <ft-trait>)
)
  (let (
    ;; Verify the given listing ID exists
    (listing (unwrap! (map-get? listings listing-id) ERR_UNKNOWN_LISTING))
    ;; Set the NFT's taker to the purchaser (caller of the function)
    (taker tx-sender)
  )
    ;; Validate that the purchase can be fulfilled
    (try! (assert-can-fulfil
      (contract-of nft-asset-contract)
      (some (contract-of payment-asset-contract))
      listing
    ))
    ;; Transfer the NFT to the purchaser (caller of the function)
    (try! (as-contract (transfer-nft nft-asset-contract (get token-id listing) tx-sender taker)))
    ;; Transfer the tokens as payment from the purchaser to the creator of the NFT
    (try! (transfer-ft payment-asset-contract (get price listing) taker (get maker listing)))
    ;; Remove the NFT from the marketplace listings
    (map-delete listings listing-id)
    ;; Return the listing ID that was just purchased
    (ok listing-id)
  )
)
```

### Validate purchase can be fulfilled

Create a private function to validate that a purchase can be fulfilled. This function checks the listing's expiry, the NFT's contract, and the payment's contract.

```clarity
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
    payment-asset-contract: (optional principal)
  })
)
  (begin
    ;; Verify that the buyer is not the same as the NFT creator
    (asserts! (not (is-eq (get maker listing) tx-sender)) ERR_MAKER_TAKER_EQUAL)
    ;; Verify the buyer has been set in the listing metadata as its `taker`
    (asserts!
      (match (get taker listing) intended-taker (is-eq intended-taker tx-sender) true)
      ERR_UNINTENDED_TAKER
    )
    ;; Verify the listing for purchase is not expired
    (asserts! (< block-height (get expiry listing)) ERR_LISTING_EXPIRED)
    ;; Verify the asset contract used to purchase the NFT is the same as the one set on the NFT
    (asserts! (is-eq (get nft-asset-contract listing) nft-asset-contract) ERR_NFT_ASSET_MISMATCH)
    ;; Verify the payment contract used to purchase the NFT is the same as the one set on the NFT
    (asserts!
      (is-eq (get payment-asset-contract listing) payment-asset-contract)
      ERR_PAYMENT_ASSET_MISMATCH
    )
    (ok true)
  )
)
```
