# Fungible Token

{% code title="fungible-token.clar" lineNumbers="true" fullWidth="false" expandable="true" %}
```clarity
;; This contract implements the SIP-010 community-standard Fungible Token trait.
(impl-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

;; Define the FT, with no maximum supply
(define-fungible-token clarity-coin)

;; Define errors
(define-constant ERR_OWNER_ONLY (err u100))
(define-constant ERR_NOT_TOKEN_OWNER (err u101))

;; Define constants for contract
(define-constant CONTRACT_OWNER tx-sender)
(define-constant TOKEN_URI u"https://hiro.so") ;; utf-8 string with token metadata host
(define-constant TOKEN_NAME "Clarity Coin")
(define-constant TOKEN_SYMBOL "CC")
(define-constant TOKEN_DECIMALS u6) ;; 6 units displayed past decimal, e.g. 1.000_000 = 1 token

;; SIP-010 function: Get the token balance of a specified principal
(define-read-only (get-balance (who principal))
  (ok (ft-get-balance clarity-coin who))
)

;; SIP-010 function: Returns the total supply of fungible token
(define-read-only (get-total-supply)
  (ok (ft-get-supply clarity-coin))
)

;; SIP-010 function: Returns the human-readable token name
(define-read-only (get-name)
  (ok TOKEN_NAME)
)

;; SIP-010 function: Returns the symbol or "ticker" for this token
(define-read-only (get-symbol)
  (ok TOKEN_SYMBOL)
)

;; SIP-010 function: Returns number of decimals to display
(define-read-only (get-decimals)
  (ok TOKEN_DECIMALS)
)

;; SIP-010 function: Returns the URI containing token metadata
(define-read-only (get-token-uri)
  (ok (some TOKEN_URI))
)

;; Mint new tokens and send them to a recipient.
;; Only the contract deployer can perform this operation.
(define-public (mint
    (amount uint)
    (recipient principal)
  )
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_OWNER_ONLY)
    (ft-mint? clarity-coin amount recipient)
  )
)

;; SIP-010 function: Transfers tokens to a recipient
;; Sender must be the same as the caller to prevent principals from transferring tokens they do not own.
(define-public (transfer
    (amount uint)
    (sender principal)
    (recipient principal)
    (memo (optional (buff 34)))
  )
  (begin
    ;; #[filter(amount, recipient)]
    (asserts! (or (is-eq tx-sender sender) (is-eq contract-caller sender))
      ERR_NOT_TOKEN_OWNER
    )
    (try! (ft-transfer? clarity-coin amount sender recipient))
    (match memo
      to-print (print to-print)
      0x
    )
    (ok true)
  )
)
```
{% endcode %}

## Contract Summary

A complete implementation of a SIP-010 compliant fungible token called "Clarity Coin" with standard transfer, balance query, and minting capabilities. This contract serves as a template for creating custom fungible tokens on the Stacks blockchain.

**What this contract does:**

* Implements the full SIP-010 fungible token standard trait
* Creates a fungible token with no maximum supply
* Provides standard token metadata (name, symbol, decimals, URI)
* Enables token transfers between principals with optional memo field
* Allows the contract owner to mint new tokens
* Tracks balances and total supply automatically
* Uses 6 decimal places for token precision (micro-units)

**What developers can learn:**

* How to implement the SIP-010 fungible token trait correctly
* Defining and working with fungible tokens using `define-fungible-token`
* Built-in Clarity functions for token operations (`ft-mint?`, `ft-transfer?`, `ft-get-balance`, `ft-get-supply`)
* Owner-only access control patterns for privileged operations
* Handling optional parameters (memo field) with `match`
* Token decimal precision and display conventions
* Preventing unauthorized transfers with sender validation
* Returning standardized responses that comply with trait requirements
* Using constants for immutable contract configuration
* Filter annotations for security analysis (`#[filter]`)
