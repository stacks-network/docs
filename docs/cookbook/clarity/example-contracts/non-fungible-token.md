# Non-Fungible token

{% code title="non-fungible-token.clar" lineNumbers="true" fullWidth="false" expandable="true" %}
```clarity
;; This contract implements the SIP-009 community-standard Non-Fungible Token trait
(impl-trait 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait)

;; Define the NFT's name
(define-non-fungible-token Your-NFT-Name uint)

;; Keep track of the last minted token ID
(define-data-var last-token-id uint u0)

;; Define constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant COLLECTION_LIMIT u1000) ;; Limit to series of 1000

(define-constant ERR_OWNER_ONLY (err u100))
(define-constant ERR_NOT_TOKEN_OWNER (err u101))
(define-constant ERR_SOLD_OUT (err u300))

(define-data-var base-uri (string-ascii 80) "https://your.api.com/path/to/collection/{id}")

;; SIP-009 function: Get the last minted token ID.
(define-read-only (get-last-token-id)
  (ok (var-get last-token-id))
)

;; SIP-009 function: Get link where token metadata is hosted
(define-read-only (get-token-uri (token-id uint))
  (ok (some (var-get base-uri)))
)

;; SIP-009 function: Get the owner of a given token
(define-read-only (get-owner (token-id uint))
  (ok (nft-get-owner? Your-NFT-Name token-id))
)

;; SIP-009 function: Transfer NFT token to another owner.
(define-public (transfer
    (token-id uint)
    (sender principal)
    (recipient principal)
  )
  (begin
    ;; #[filter(sender)]
    (asserts! (is-eq tx-sender sender) ERR_NOT_TOKEN_OWNER)
    (nft-transfer? Your-NFT-Name token-id sender recipient)
  )
)

;; Mint a new NFT.
(define-public (mint (recipient principal))
  ;; Create the new token ID by incrementing the last minted ID.
  (let ((token-id (+ (var-get last-token-id) u1)))
    ;; Ensure the collection stays within the limit.
    (asserts! (< (var-get last-token-id) COLLECTION_LIMIT) ERR_SOLD_OUT)
    ;; Only the contract owner can mint.
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_OWNER_ONLY)
    ;; Mint the NFT and send it to the given recipient.
    (try! (nft-mint? Your-NFT-Name token-id recipient))
    ;; Update the last minted token ID.
    (var-set last-token-id token-id)
    ;; Return a success status and the newly minted NFT ID.
    (ok token-id)
  )
)
```
{% endcode %}

## Contract Summary

A complete implementation of a SIP-009 compliant non-fungible token (NFT) contract with minting capabilities and collection limits. This contract serves as a foundational template for creating NFT collections on the Stacks blockchain.

**What this contract does:**

* Implements the full SIP-009 NFT standard trait
* Creates a limited NFT collection (1000 tokens maximum)
* Enables the contract owner to mint NFTs to recipients
* Tracks the last minted token ID for sequential minting
* Provides NFT ownership queries and transfers
* Stores metadata URI pointing to off-chain JSON
* Prevents minting beyond the collection limit
* Restricts minting to the contract deployer only
* Ensures only token owners can transfer their NFTs

**What developers can learn:**

* How to implement the SIP-009 non-fungible token trait correctly
* Defining NFTs with `define-non-fungible-token` using uint identifiers
* Built-in Clarity functions for NFT operations (`nft-mint?`, `nft-transfer?`, `nft-get-owner?`)
* Sequential ID generation pattern for minting
* Collection size limits and sold-out prevention
* Owner-only minting access control
* Token ownership verification before transfers
* Metadata URI management for off-chain content
* Using data variables to track minting state
* Returning standardized responses for trait compliance
* Filter annotations for security (`#[filter(sender)]`)
