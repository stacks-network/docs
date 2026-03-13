# Megapont Ape Club NFT

By [@MegapontNFT](https://x.com/MegapontNFT)

{% code title=".megapont-ape-club-nft" lineNumbers="true" fullWidth="false" expandable="true" %}
```clarity
;; use the SIP090 interface (testnet)
;;live (impl-trait 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait)
;;test (impl-trait 'ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.nft-trait.nft-trait)
(impl-trait .nft-trait.nft-trait)
(use-trait commission-trait .commission-trait.commission)

(define-non-fungible-token Megapont-Ape-Club uint)

;; Storage
(define-map token-count principal uint)
(define-map market uint {price: uint, commission: principal})

;; Define Constants
(define-constant CONTRACT-OWNER tx-sender)
(define-constant ERR-SOLD-OUT (err u300))
(define-constant ERR-WRONG-COMMISSION (err u301))
(define-constant ERR-NOT-AUTHORIZED (err u401))
(define-constant ERR-NOT-FOUND (err u404))
(define-constant ERR-METADATA-FROZEN (err u505))
(define-constant ERR-MINT-ALREADY-SET (err u506))
(define-constant ERR-LISTING (err u507))
(define-constant APE-LIMIT u2500)

;; Withdraw wallets
;; Megapont 1 47.5%
(define-constant WALLET_1 'SP39E0V32MC31C5XMZEN1TQ3B0PW2RQSJB8TKQEV9)
;; Megapont 2 45%
(define-constant WALLET_2 'SP1C39PEYB976REP9B19QMFDJHHF27A63WANDGTX4)
;; Megapont 3 5%
(define-constant WALLET_3 'SP11QRBEVACSP2MAYB1FE64PZGXXRWE4R3HY5E68H)
;; Security Audit 2.5%
(define-constant WALLET_4 'SP2J56JG0SMAVW0DXXJ7W18W2CQHD1FE83FZCFV26)

;; Define Variables
(define-data-var last-id uint u0)
(define-data-var mintpass-sale-active bool false)
(define-data-var metadata-frozen bool false)
(define-data-var base-uri (string-ascii 80) "ipfs://Qmad43sssgNbG9TpC6NfeiTi9X6f9vPYuzgW2S19BEi49m/{id}")
(define-constant contract-uri "ipfs://QmSeXmYpkaxvH3xv8ikwDodJZjp9pqxooVvqLHq3Gvg6So")
(define-constant proof-hash "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855")
(define-map mint-address bool principal)

;; Token count for account
(define-read-only (get-balance (account principal))
  (default-to u0
    (map-get? token-count account)))

(define-private (trnsfr (id uint) (sender principal) (recipient principal))
  (match (nft-transfer? Megapont-Ape-Club id sender recipient)
        success
          (let
            ((sender-balance (get-balance sender))
            (recipient-balance (get-balance recipient)))
              (map-set token-count
                    sender
                    (- sender-balance u1))
              (map-set token-count
                    recipient
                    (+ recipient-balance u1))
              (ok success))
        error (err error)))

;; SIP009: Transfer token to a specified principal
(define-public (transfer (id uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) ERR-NOT-AUTHORIZED)
    (asserts! (is-none (map-get? market id)) ERR-LISTING)
    (trnsfr id sender recipient)))

;; SIP009: Get the owner of the specified token ID
(define-read-only (get-owner (id uint))
  ;; Make sure to replace Megapont-Ape-Club
  (ok (nft-get-owner? Megapont-Ape-Club id)))

;; SIP009: Get the last token ID
(define-read-only (get-last-token-id)
  (ok (var-get last-id)))

;; SIP009: Get the token URI. You can set it to any other URI
(define-read-only (get-token-uri (id uint))
  (ok (some (var-get base-uri))))

(define-read-only (get-contract-uri)
  (ok contract-uri))

;; Mint new NFT
;; can only be called from the Mint
(define-public (mint (new-owner principal))
    (let ((next-id (+ u1 (var-get last-id))))
      (asserts! (called-from-mint) ERR-NOT-AUTHORIZED)
      (asserts! (< (var-get last-id) APE-LIMIT) ERR-SOLD-OUT)
      (match (nft-mint? Megapont-Ape-Club next-id new-owner)
        success
        (let
        ((current-balance (get-balance new-owner)))
          (begin
            (try! (stx-transfer? u23750000 tx-sender WALLET_1))
            (try! (stx-transfer? u22500000 tx-sender WALLET_2))
            (try! (stx-transfer?  u2500000 tx-sender WALLET_3))
            (try! (stx-transfer?  u1250000 tx-sender WALLET_4))
            (var-set last-id next-id)
            (map-set token-count
              new-owner
              (+ current-balance u1)
            )
            (ok true)))
        error (err (* error u10000)))))

(define-private (is-sender-owner (id uint))
  (let ((owner (unwrap! (nft-get-owner? Megapont-Ape-Club id) false)))
    (or (is-eq tx-sender owner) (is-eq contract-caller owner))))

(define-read-only (get-listing-in-ustx (id uint))
  (map-get? market id))

(define-public (list-in-ustx (id uint) (price uint) (comm <commission-trait>))
  (let ((listing  {price: price, commission: (contract-of comm)}))
    (asserts! (is-sender-owner id) ERR-NOT-AUTHORIZED)
    (map-set market id listing)
    (print (merge listing {a: "list-in-ustx", id: id}))
    (ok true)))

(define-public (unlist-in-ustx (id uint))
  (begin
    (asserts! (is-sender-owner id) ERR-NOT-AUTHORIZED)
    (map-delete market id)
    (print {a: "unlist-in-ustx", id: id})
    (ok true)))

(define-public (buy-in-ustx (id uint) (comm <commission-trait>))
  (let ((owner (unwrap! (nft-get-owner? Megapont-Ape-Club id) ERR-NOT-FOUND))
      (listing (unwrap! (map-get? market id) ERR-LISTING))
      (price (get price listing)))
    (asserts! (is-eq (contract-of comm) (get commission listing)) ERR-WRONG-COMMISSION)
    (try! (stx-transfer? price tx-sender owner))
    (try! (contract-call? comm pay id price))
    (try! (trnsfr id owner tx-sender))
    (map-delete market id)
    (print {a: "buy-in-ustx", id: id})
    (ok true)))

;; Set base uri
(define-public (set-base-uri (new-base-uri (string-ascii 80)))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    (asserts! (not (var-get metadata-frozen)) ERR-METADATA-FROZEN)
    (var-set base-uri new-base-uri)
    (ok true)))

;; Freeze metadata
(define-public (freeze-metadata)
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    (var-set metadata-frozen true)
    (ok true)))

;; Manage the Mint
(define-private (called-from-mint)
  (let ((the-mint
          (unwrap! (map-get? mint-address true)
                    false)))
    (is-eq contract-caller the-mint)))

;; can only be called once
(define-public (set-mint-address)
  (let ((the-mint (map-get? mint-address true)))
    (asserts! (and (is-none the-mint)
              (map-insert mint-address true tx-sender))
                ERR-MINT-ALREADY-SET)
    (ok tx-sender)))

```
{% endcode %}

{% hint style="info" %}
Deployed contract page found [here](https://explorer.stacks.so/txid/SP3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH335.megapont-ape-club-nft).
{% endhint %}

## Contract Summary

The Megapont Ape Club NFT contract is a production-ready SIP-009 compliant NFT implementation featuring a 2,500-piece limited collection with built-in marketplace functionality. This contract serves as an excellent reference for developers looking to build feature-complete NFT projects on Stacks.

**Key Features:**

* **SIP-009 Standard Compliance** - Implements the official Stacks NFT trait for full ecosystem compatibility
* **Built-in Marketplace** - List, unlist, and buy NFTs directly through the contract without external marketplaces
* **Multi-Wallet Revenue Split** - Automatic distribution of mint proceeds to 4 wallets with custom percentages
* **Mintpass System** - Controlled minting through a separate mint contract for presale/whitelist functionality
* **Metadata Management** - Configurable base URI with optional metadata freeze for permanence
* **Commission System** - Flexible commission trait integration for marketplace fees

**What Developers Can Learn:**

* How to implement SIP-009 NFT standard with marketplace features
* Revenue splitting patterns for team/partner payouts
* Access control patterns using contract-caller verification
* Safe NFT transfer mechanisms with balance tracking
* Marketplace listing/delisting patterns with commission handling

***

{% embed url="https://youtu.be/xwbXNgSvMkk?si=vL6DJbj5ybCNJQfV" %}

***

## Function-by-Function Breakdown

### SIP-009 Standard Functions

#### **`transfer (id uint) (sender principal) (recipient principal)`**

Transfers an NFT from sender to recipient, enforcing that the transaction sender must be the token owner and the NFT is not currently listed on the marketplace.

#### **`get-owner (id uint)`**

Returns the principal that owns the specified NFT ID.

#### **`get-last-token-id`**

Returns the ID of the most recently minted NFT, useful for tracking total supply.

#### **`get-token-uri (id uint)`**

Returns the base metadata URI for the NFT collection.

#### **`get-contract-uri`**

Returns the contract-level metadata URI containing collection information.

### Minting Functions

#### **`mint (new-owner principal)`**

Mints a new NFT to the specified owner, automatically distributing the 50 STX mint price across 4 wallets. Can only be called by the authorized mint contract.

#### **`set-mint-address`**

One-time function to set which contract is authorized to call the mint function. Once set, it cannot be changed.

#### **`called-from-mint`**

Private helper function that verifies the caller is the authorized mint contract.

### Marketplace Functions

#### **`list-in-ustx (id uint) (price uint) (comm <commission-trait>)`**

Lists an NFT for sale at the specified price in micro-STX, associating it with a commission contract. Only the NFT owner can list.

#### **`unlist-in-ustx (id uint)`**

Removes an NFT from marketplace listings. Only the NFT owner can unlist.

#### **`buy-in-ustx (id uint) (comm <commission-trait>)`**

Purchases a listed NFT, transferring STX to the seller, paying commission, and transferring the NFT to the buyer.

#### **`get-listing-in-ustx (id uint)`**

Returns the listing details (price and commission contract) for a given NFT ID if it's listed.

### Balance & Ownership Helpers

#### **`get-balance (account principal)`**

Returns the number of NFTs owned by a given principal.

#### **`trnsfr (id uint) (sender principal) (recipient principal)`**

Private helper function that handles the actual NFT transfer and updates balance mappings.

#### **`is-sender-owner (id uint)`**

Private helper that verifies if the transaction sender or contract caller owns the specified NFT.

### Admin/Metadata Functions

#### **`set-base-uri (new-base-uri (string-ascii 80))`**

Allows the contract owner to update the base metadata URI, but only if metadata hasn't been frozen.

#### **`freeze-metadata`**

Permanently freezes the metadata URI, preventing any future changes. This is irreversible.

### Traits Used

#### **`nft-trait`**

SIP-009 NFT standard trait for ecosystem compatibility

#### **`commission-trait`**

Custom trait for handling marketplace commission payments

***

## Key Concepts

### Multi-Wallet Revenue Distribution

The mint function automatically splits the 50 STX mint price across 4 wallets with predefined percentages (47.5%, 45%, 5%, 2.5%). This pattern is useful for team splits, royalties, and service fees.

### Mintpass Architecture

The contract uses a two-contract pattern where minting is delegated to a separate "mint" contract. This allows for flexible presale mechanics, whitelist management, and phased releases without modifying the core NFT contract.

### Balance Tracking Pattern

Unlike basic NFT implementations, this contract maintains a `token-count` map to track how many NFTs each principal owns. This enables efficient balance queries without iterating through all NFTs.

### Marketplace Integration

The built-in marketplace uses a commission trait pattern, allowing the contract to work with different commission structures. When listing an NFT, the owner specifies both price and commission contract, ensuring commission rules are locked at listing time.
