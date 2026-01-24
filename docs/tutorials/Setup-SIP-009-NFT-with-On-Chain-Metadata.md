# Module 17: Token Standards - SIP-009 NFT with On-Chain Data

**Author:** @jadonamite
**Difficulty:** Intermediate
**Time:** 25 Minutes

Most NFTs are just receipts pointing to a JPEG on a server (IPFS or AWS). If that server goes down, your NFT is blank.
**On-Chain NFTs** store their data (attributes, stats, levels) directly in the smart contract's state.

This is critical for **Blockchain Gaming**. If you want a sword to have `Attack: 10`, and you want another contract to calculate damage based on that, the data *must* be on-chain. You cannot read a JSON file from IPFS inside a smart contract.

This module guides you through creating a SIP-009 NFT where the metadata lives in the contract maps.

## 1. Prerequisites: The Trait Definition

Just like SIP-010, SIP-009 is the standard trait for Non-Fungible Tokens.

**File:** `contracts/sip-009-trait.clar`

```clarity
(define-trait sip-009-trait
  (
    ;; ID of the last minted token
    (get-last-token-id () (response uint uint))

    ;; URI for metadata (can be none if fully on-chain)
    (get-token-uri (uint) (response (optional (string-ascii 256)) uint))

    ;; Owner of a specific token
    (get-owner (uint) (response (optional principal) uint))

    ;; Transfer logic
    (transfer (uint principal principal) (response bool uint))
  )
)

```

## 2. The Implementation

We will build a "Game Character" NFT. Each token ID will map to a specific set of stats (Strength, Name).

**File:** `contracts/onchain-nft.clar`

```clarity
;; 1. Assert Compliance
(impl-trait .sip-009-trait.sip-009-trait)

;; 2. Define the NFT
;; 'game-character' is the asset identifier. Keys are 'uint'.
(define-non-fungible-token game-character uint)

;; 3. Storage
(define-constant CONTRACT-OWNER tx-sender)
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-NOT-FOUND (err u404))

(define-data-var last-token-id uint u0)

;; ON-CHAIN METADATA
;; We store the stats directly in the contract state.
;; Other contracts can read this to determine game logic.
(define-map character-stats 
    uint ;; Token ID
    {
        name: (string-ascii 32),
        strength: uint,
        level: uint
    }
)

;; 4. SIP-009 Interface Implementation

(define-read-only (get-last-token-id)
    (ok (var-get last-token-id))
)

(define-read-only (get-token-uri (token-id uint))
    ;; Since data is on-chain, we might not have a URL.
    ;; Or we could return a generic viewer URL: https://game.com/view/{id}
    (ok (some "https://api.mygame.com/metadata/"))
)

(define-read-only (get-owner (token-id uint))
    (ok (nft-get-owner? game-character token-id))
)

(define-public (transfer (token-id uint) (sender principal) (recipient principal))
    (begin
        ;; CHECK: Standard ownership check
        (asserts! (is-eq tx-sender sender) ERR-NOT-AUTHORIZED)
        ;; EFFECT: Native transfer
        (try! (nft-transfer? game-character token-id sender recipient))
        (ok true)
    )
)

;; 5. Minting & Metadata Logic

(define-public (mint (name (string-ascii 32)) (strength uint) (recipient principal))
    (let
        (
            (token-id (+ (var-get last-token-id) u1))
        )
        ;; Permissions
        (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)

        ;; 1. Mint the Core Asset
        (try! (nft-mint? game-character token-id recipient))

        ;; 2. Store the On-Chain Data
        (map-set character-stats token-id {
            name: name,
            strength: strength,
            level: u1 ;; Start at Level 1
        })

        ;; 3. Update Global Counter
        (var-set last-token-id token-id)
        (ok token-id)
    )
)

;; 6. Gaming Logic (The "On-Chain" Benefit)

;; A function to Level Up. This modifies the metadata ON-CHAIN.
;; An IPFS JSON file cannot be updated like this.
(define-public (level-up (token-id uint))
    (let
        (
            (stats (unwrap! (map-get? character-stats token-id) ERR-NOT-FOUND))
            (current-level (get level stats))
        )
        ;; Only owner can level up? Or maybe the Game Engine contract?
        (asserts! (is-eq (some tx-sender) (nft-get-owner? game-character token-id)) ERR-NOT-AUTHORIZED)

        (map-set character-stats token-id 
            (merge stats { level: (+ current-level u1) })
        )
        (ok true)
    )
)

(define-read-only (get-stats (token-id uint))
    (ok (map-get? character-stats token-id))
)

```

## 3. On-Chain vs. IPFS: The Trade-off

| Feature | IPFS / Off-Chain | On-Chain Map |
| --- | --- | --- |
| **Storage Cost** | Cheap (JSON text) | Expensive (Contract State) |
| **Mutability** | Immutable (can't change URL) | Mutable (via `map-set`) |
| **Composability** | **None** (Contracts can't read it) | **High** (Contracts can read logic) |
| **Visuals** | Good for Images/Video | Poor (Text/Numbers only) |

**Best Practice:** Use On-Chain maps for **Game Logic** (Level, Strength, XP) and `get-token-uri` for **Visuals** (Image URL).

## 4. Summary Checklist

* [ ] **Trait Compliance:** Did you implement `transfer`, `get-owner`, `get-last-token-id`, and `get-token-uri`?
* [ ] **Map Structure:** Is your metadata map keyed by `uint` (Token ID)?
* [ ] **Mint Atomicity:** Do you `nft-mint?` AND `map-set` in the same transaction?

---
