---
title: Creating an NFT
description: Clarity and Stacks.js code required to make an NFT
---

Clarity makes creating NFTs incredibly easy. With built-in functions for creating and working with the token, you can have an NFT created in less than 10 minutes of work.

Let's see how.

:::tip
Code for this recipe has been pulled from [this NFT tutorial](https://blog.developerdao.com/building-an-nft-with-stacks-and-clarity) from Developer DAO.
:::

## Trait

The first thing we need when we create an NFT is a trait. A trait is an interface that allows us to create an NFT with a defined set of functions. Its primary purpose is to ensure that NFTs are composable and different tools know how to interact with them.

By implementing a trait that the community agrees on, all protocols and products know how they can interact with an NFT.

The official mainnet trait can be [found on the Stacks Explorer](https://explorer.stacks.co/txid/0x80eb693e5e2a9928094792080b7f6d69d66ea9cc881bc465e8d9c5c621bd4d07?chain=mainnet) and looks like this:

```clarity
(define-trait nft-trait
  (
    ;; Last token ID, limited to uint range
    (get-last-token-id () (response uint uint))

    ;; URI for metadata associated with the token
    (get-token-uri (uint) (response (optional (string-ascii 256)) uint))

     ;; Owner of a given token identifier
    (get-owner (uint) (response (optional principal) uint))

    ;; Transfer from the sender to a new principal
    (transfer (uint principal principal) (response bool uint))
  )
)
```

All we are doing here is defining the function signatures for functions we'll need to implement in out Clarity contract, which we can see a simple version of below.

## Clarity Code

This is the Clarity code we need in order to create an NFT, with one additional function, `mint` that allows us to actually create a new NFT. This `mint` function is not needed to adhere to the trait.

```clarity
(impl-trait 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait)

(define-non-fungible-token amazing-aardvarks uint)

(define-data-var last-token-id uint u0)

(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))

(define-read-only (get-last-token-id)
    (ok (var-get last-token-id))
)

(define-read-only (get-token-uri (token-id uint))
    (ok none)
)

(define-read-only (get-owner (token-id uint))
    (ok (nft-get-owner? amazing-aardvarks token-id))
)

(define-public (transfer (token-id uint) (sender principal) (recipient principal))
    (begin
        (asserts! (is-eq tx-sender sender) err-not-token-owner)
        (nft-transfer? amazing-aardvarks token-id sender recipient)
    )
)

(define-public (mint (recipient principal))
    (let
        (
            (token-id (+ (var-get last-token-id) u1))
        )
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        (try! (nft-mint? amazing-aardvarks token-id recipient))
        (var-set last-token-id token-id)
        (ok token-id)
    )
)
```
