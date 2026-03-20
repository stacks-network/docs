---
description: Build an NFT marketplace in Clarity with listing, cancellation, and fulfillment flows.
---

# Build an NFT Marketplace

This guide walks through a marketplace contract that lets users list NFTs for sale, cancel listings, and fulfill purchases with either STX or a SIP-010 token.

## What you'll build

- Error handling for listing and purchase flows
- Persistent listing storage
- Asset whitelisting
- Purchase fulfillment with STX or fungible tokens

## Define error constants

```clarity
(define-constant ERR_EXPIRY_IN_PAST (err u1000))
(define-constant ERR_PRICE_ZERO (err u1001))
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

## Create listing storage

```clarity
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

(define-data-var listing-nonce uint u0)
```

## List an asset

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
    (asserts! (is-whitelisted (contract-of nft-asset-contract)) ERR_ASSET_CONTRACT_NOT_WHITELISTED)
    (asserts! (> (get expiry nft-asset) block-height) ERR_EXPIRY_IN_PAST)
    (asserts! (> (get price nft-asset) u0) ERR_PRICE_ZERO)
    (asserts! (match (get payment-asset-contract nft-asset)
      payment-asset
      (is-whitelisted payment-asset)
      true
    ) ERR_PAYMENT_CONTRACT_NOT_WHITELISTED)
    (try! (transfer-nft
      nft-asset-contract
      (get token-id nft-asset)
      tx-sender
      (as-contract tx-sender)
    ))
    (map-set listings listing-id (merge
      { maker: tx-sender, nft-asset-contract: (contract-of nft-asset-contract) }
      nft-asset
    ))
    (var-set listing-nonce (+ listing-id u1))
    (ok listing-id)
  )
)
```

## Read and cancel listings

```clarity
(define-read-only (get-listing (listing-id uint))
  (map-get? listings listing-id)
)
```

```clarity
(define-public (cancel-listing (listing-id uint) (nft-asset-contract <nft-trait>))
  (let (
    (listing (unwrap! (map-get? listings listing-id) ERR_UNKNOWN_LISTING))
    (maker (get maker listing))
  )
    (asserts! (is-eq maker tx-sender) ERR_UNAUTHORISED)
    (asserts! (is-eq
      (get nft-asset-contract listing)
      (contract-of nft-asset-contract)
    ) ERR_NFT_ASSET_MISMATCH)
    (map-delete listings listing-id)
    (as-contract (transfer-nft nft-asset-contract (get token-id listing) tx-sender maker))
  )
)
```

## Whitelist asset contracts

```clarity
(define-map whitelisted-asset-contracts principal bool)

(define-read-only (is-whitelisted (asset-contract principal))
  (default-to false (map-get? whitelisted-asset-contracts asset-contract))
)

(define-public (set-whitelisted (asset-contract principal) (whitelisted bool))
  (begin
    (asserts! (is-eq contract-owner tx-sender) ERR_UNAUTHORISED)
    (ok (map-set whitelisted-asset-contracts asset-contract whitelisted))
  )
)
```

## Fulfill purchases

### With STX

```clarity
(define-public (fulfil-listing-stx (listing-id uint) (nft-asset-contract <nft-trait>))
  (let (
    (listing (unwrap! (map-get? listings listing-id) ERR_UNKNOWN_LISTING))
    (taker tx-sender)
  )
    (try! (assert-can-fulfil (contract-of nft-asset-contract) none listing))
    (try! (as-contract (transfer-nft nft-asset-contract (get token-id listing) tx-sender taker)))
    (try! (stx-transfer? (get price listing) taker (get maker listing)))
    (map-delete listings listing-id)
    (ok listing-id)
  )
)
```

### With SIP-010 tokens

```clarity
(define-public (fulfil-listing-ft
  (listing-id uint)
  (nft-asset-contract <nft-trait>)
  (payment-asset-contract <ft-trait>)
)
  (let (
    (listing (unwrap! (map-get? listings listing-id) ERR_UNKNOWN_LISTING))
    (taker tx-sender)
  )
    (try! (assert-can-fulfil
      (contract-of nft-asset-contract)
      (some (contract-of payment-asset-contract))
      listing
    ))
    (try! (as-contract (transfer-nft nft-asset-contract (get token-id listing) tx-sender taker)))
    (try! (transfer-ft payment-asset-contract (get price listing) taker (get maker listing)))
    (map-delete listings listing-id)
    (ok listing-id)
  )
)
```
