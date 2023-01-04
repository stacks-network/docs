---
title: Creating a Fungible Token
description: Clarity and Stacks.js code required to make a FT
---

Much the same as creating an NFT, Clarity also makes creating a fungible token (FT) trivial as well.

The process and code are much the same.

## Trait

Just like with the NFT, it's a good idea to create a trait when you create a fungible token so that different tools and protocols and be confident in building interfaces for those tokens.

Since FTs may be divisible, the [FT official mainnet deployment trait adress](https://explorer.stacks.co/txid/0x99e01721e57adc2c24f7d371b9d302d581dba1d27250c7e25ea5f241af14c387?chain=mainnet) has additional functions.

```clarity
(define-trait sip-010-trait
  (
    ;; Transfer from the caller to a new principal
    (transfer (uint principal principal (optional (buff 34))) (response bool uint))

    ;; the human readable name of the token
    (get-name () (response (string-ascii 32) uint))

    ;; the ticker symbol, or empty if none
    (get-symbol () (response (string-ascii 32) uint))

    ;; the number of decimals used, e.g. 6 would mean 1_000_000 represents 1 token
    (get-decimals () (response uint uint))

    ;; the balance of the passed principal
    (get-balance (principal) (response uint uint))

    ;; the current total supply (which does not need to be a constant)
    (get-total-supply () (response uint uint))

    ;; an optional URI that represents metadata of this token
    (get-token-uri () (response (optional (string-utf8 256)) uint))
  )
)
```

Now let's see how we might implement this in Clarity, just like we would an NFT.

## Clarity Code

```clarity
(impl-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)


(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))

;; No maximum supply!
(define-fungible-token clarity-coin)

(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
    (begin
        (asserts! (is-eq tx-sender sender) err-not-token-owner)
        (try! (ft-transfer? clarity-coin amount sender recipient))
        (match memo to-print (print to-print) 0x)
        (ok true)
    )
)

(define-read-only (get-name)
    (ok "Clarity Coin")
)

(define-read-only (get-symbol)
    (ok "CC")
)

(define-read-only (get-decimals)
    (ok u6)
)

(define-read-only (get-balance (who principal))
    (ok (ft-get-balance clarity-coin who))
)

(define-read-only (get-total-supply)
    (ok (ft-get-supply clarity-coin))
)


(define-read-only (get-token-uri)
    (ok none)
)


(define-public (mint (amount uint) (recipient principal))
    (begin
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        (ft-mint? clarity-coin amount recipient)
    )
)
```
