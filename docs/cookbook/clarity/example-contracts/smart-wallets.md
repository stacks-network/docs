# Smart Wallets

By [@friedger](https://github.com/friedger/Smart-Wallet)

{% code title="smart-wallet-with-rules.clar" lineNumbers="true" fullWidth="false" expandable="true" %}
```clarity
;; title: smart-wallet-with-rules
;; version:
;; summary:
;; description:
(use-trait extension-trait .extension-trait.extension-trait)
(use-trait rule-set-trait .rule-set-trait.rule-set-trait)

(use-trait sip-010-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)
(use-trait sip-009-trait 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait)

(define-constant err-unauthorised (err u401))
(define-constant err-forbidden (err u403))

(define-map rule-sets
  principal
  bool
)

(define-data-var security-level uint u1)

(define-read-only (is-admin-calling)
  (ok (asserts! (default-to false (map-get? admins contract-caller)) err-unauthorised))
)

(define-private (is-allowed-stx
    (rules <rule-set-trait>)
    (amount uint)
    (recipient principal)
    (memo (optional (buff 34)))
  )
  (contract-call? rules is-allowed-stx amount recipient memo)
)

(define-private (is-allowed-extension
    (rules <rule-set-trait>)
    (extension <extension-trait>)
    (payload (buff 2048))
  )
  (contract-call? rules is-allowed-extension extension payload)
)

(define-private (is-allowed-sip010
    (sip010 <sip-010-trait>)
    (amount uint)
    (recipient principal)
    (memo (optional (buff 34)))
  )
  (ok (asserts! true err-unauthorised))
)

(define-private (is-allowed-sip009
    (sip009 <sip-009-trait>)
    (amount uint)
    (recipient principal)
  )
  (ok (asserts! true err-unauthorised))
)
;;
;; activity tracker
;;
(define-constant activity-period (if is-in-mainnet
  (* u70 u24 u3600 u1000)
  u1000
))

;; 10 weeks or 1 second
(define-data-var last-tx-time uint u0)
(define-read-only (get-time)
  (unwrap-panic (get-stacks-block-info? time (- stacks-block-height u1)))
)
(define-read-only (is-inactive)
  (> (get-time) (+ activity-period (var-get last-tx-time)))
)

;;
;; calls with context switching
;;
(define-public (stx-transfer
    (amount uint)
    (recipient principal)
    (memo (optional (buff 34)))
  )
  (begin
    (try! (is-allowed-stx (current-rules) amount recipient memo))
    (var-set last-tx-time (get-time))
    (as-contract (match memo
      to-print (stx-transfer-memo? amount tx-sender recipient to-print)
      (stx-transfer? amount tx-sender recipient)
    ))
  )
)

(define-public (extension-call
    (extension <extension-trait>)
    (payload (buff 2048))
  )
  (begin
    (try! (is-allowed-extension (current-rules) extension payload))
    (as-contract (contract-call? extension call payload))
  )
)

;;
;; calls without context switching
;;

(define-public (sip010-transfer
    (amount uint)
    (recipient principal)
    (memo (optional (buff 34)))
    (sip010 <sip-010-trait>)
  )
  (begin
    (try! (is-allowed-sip010 sip010 amount recipient memo))
    (contract-call? sip010 transfer amount (as-contract tx-sender) recipient memo)
  )
)

(define-public (sip009-transfer
    (nft-id uint)
    (recipient principal)
    (sip009 <sip-009-trait>)
  )
  (begin
    (try! (is-allowed-sip009 sip009 nft-id recipient))
    (contract-call? sip009 transfer nft-id (as-contract tx-sender) recipient)
  )
)

;;
;; admin functions
;;
(define-map admins
  principal
  bool
)

(define-public (enable-admin
    (admin principal)
    (enabled bool)
  )
  (begin
    (try! (is-admin-calling))
    (asserts! (not (is-eq admin contract-caller)) err-forbidden)
    (ok (map-set admins admin enabled))
  )
)

(define-public (set-security-level (new-level uint))
  (begin
    (try! (is-admin-calling))
    (ok (var-set security-level new-level))
  )
)

(define-read-only (current-rules)
  (let ((level (var-get security-level)))
    (if (is-eq level u0)
      (to-trait .no-rules)
      (if (is-eq level u1)
        (to-trait .standard-rules)
        (to-trait .emergency-rules)
      )
    )
  )
)

(define-read-only (to-trait (trait <rule-set-trait>))
  trait
)

;; init
(set-security-level u1)
(map-set admins .inactive-observer true) 
(map-set admins tx-sender true) ;; send 1000 ustx to the smart wallet(stx-transfer? u1000 tx-sender (as-contract tx-sender))
```
{% endcode %}

## Contract Summary

There's many different implementations of a smart contract wallet available for developers to build with depending on their user's needs. The specific implementation showcased here is the Smart Wallet with Rules contract, which is a sophisticated wallet abstraction that enables programmable spending rules and multi-admin governance. Built by [@friedger](https://github.com/friedger/Smart-Wallet), this contract demonstrates advanced patterns for creating customizable wallet logic with security levels, activity monitoring, and extension capabilities.

**Key Features:**

* **Rule-Based Access Control** - Configurable security levels (no rules, standard rules, emergency rules) that govern STX transfers and extension calls
* **Multi-Admin Support** - Multiple principals can be designated as admins with the ability to manage other admins and security settings
* **Activity Monitoring** - Tracks last transaction time to detect wallet inactivity (10 weeks on mainnet, 1 second on testnet)
* **Extension System** - Modular architecture allowing custom extension contracts to add new functionality
* **Token Support** - Built-in support for SIP-010 fungible tokens and SIP-009 NFT transfers

**What Developers Can Learn:**

* How to implement customizable access control with rule-set traits
* Multi-admin patterns with self-protection (admins cannot disable themselves)
* Activity tracking using block timestamps for inactivity detection
* Extension pattern for modular smart contract functionality
* Dynamic trait selection based on security levels

***

{% embed url="https://youtu.be/fDqtBph2Aqs?si=P3cotRpDYG8EeaUQ" %}

***

## Function-by-Function Breakdown

### STX Transfer Functions

#### **`stx-transfer (amount uint) (recipient principal) (memo (optional (buff 34)))`**

Transfers STX from the smart wallet to a recipient, first checking with the current rule-set if the transfer is allowed. Updates the last transaction time for activity tracking and uses `as-contract` to transfer from the wallet's balance.

### Extension System Functions

#### **`extension-call (extension <extension-trait>) (payload (buff 2048))`**

Calls an external extension contract with arbitrary payload data, after checking with the current rule-set if the extension call is allowed. Enables modular functionality to be added to the wallet.

### SIP-010 Token Functions

#### **`sip010-transfer (amount uint) (recipient principal) (memo (optional (buff 34))) (sip010 <sip-010-trait>)`**

Transfers SIP-010 fungible tokens from the smart wallet to a recipient. Currently has placeholder validation logic that always allows transfers.

### SIP-009 NFT Functions

#### **`sip009-transfer (nft-id uint) (recipient principal) (sip009 <sip-009-trait>)`**

Transfers SIP-009 NFTs from the smart wallet to a recipient. Currently has placeholder validation logic that always allows transfers.

### Admin Management Functions

#### **`enable-admin (admin principal) (enabled bool)`**

Adds or removes admin privileges for a principal. Only callable by existing admins, and includes self-protection to prevent admins from disabling themselves.

#### **`set-security-level (new-level uint)`**

Changes the wallet's security level (0 = no rules, 1 = standard rules, 2+ = emergency rules). Only callable by admins, this determines which rule-set governs wallet operations.

### Rule Validation Functions (Private)

#### **`is-allowed-stx (rules <rule-set-trait>) (amount uint) (recipient principal) (memo (optional (buff 34)))`**

Private function that delegates STX transfer validation to the current rule-set contract.

#### **`is-allowed-extension (rules <rule-set-trait>) (extension <extension-trait>) (payload (buff 2048))`**

Private function that delegates extension call validation to the current rule-set contract.

#### **`is-allowed-sip010 (sip010 <sip-010-trait>) (amount uint) (recipient principal) (memo (optional (buff 34)))`**

Private function for SIP-010 transfer validation. Currently always returns true.

#### **`is-allowed-sip009 (sip009 <sip-009-trait>) (amount uint) (recipient principal)`**

Private function for SIP-009 transfer validation. Currently always returns true.

### Access Control & Utility Functions

#### **`is-admin-calling`**

Read-only function that verifies if the contract caller is an authorized admin. Returns an error if not authorized.

#### **`current-rules`**

Read-only function that returns the appropriate rule-set trait based on the current security level (0 = no-rules, 1 = standard-rules, 2+ = emergency-rules).

#### **`to-trait (trait <rule-set-trait>)`**

Helper function that converts a rule-set contract to a trait for use in validation functions.

### Activity Tracking Functions

#### **`get-time`**

Read-only function that retrieves the timestamp of the previous Stacks block.

#### **`is-inactive`**

Read-only function that checks if the wallet has been inactive for longer than the activity period (10 weeks on mainnet, 1 second on testnet).

### Traits Used

#### **`extension-trait`**

Custom trait that defines the interface for wallet extension contracts that can add modular functionality.

#### **`rule-set-trait`**

Custom trait that defines the interface for rule-set contracts that govern wallet operations.

#### **`sip-010-trait`**

Standard SIP-010 fungible token trait for token transfers.

#### **`sip-009-trait`**

Standard SIP-009 NFT trait for NFT transfers.

***

## Key Concepts

### Programmable Security Levels

The wallet implements a three-tier security system through the `security-level` variable. Level 0 applies no restrictions, level 1 uses standard rules, and level 2+ activates emergency rules. This allows the wallet to dynamically adjust security posture based on threat conditions.

### Rule-Set Trait Pattern

The contract uses a trait-based architecture for validation logic, allowing different rule contracts to be swapped based on security level. The `current-rules` function dynamically selects which rule-set to use, enabling flexible and upgradeable access control without modifying the core wallet contract.

### Multi-Admin Governance

The contract supports multiple administrators through a `admins` map. The `enable-admin` function includes a self-protection mechanism (`(asserts! (not (is-eq admin contract-caller)) err-forbidden)`) preventing admins from accidentally or maliciously removing their own access.

### Activity-Based Inactivity Detection

The contract tracks the timestamp of the last transaction in `last-tx-time` and compares it against an activity period (10 weeks on mainnet). The `is-inactive` function can be used by external contracts (like the `inactive-observer` admin) to detect dormant wallets and potentially trigger recovery mechanisms.

### Extension Modularity

The extension system allows new functionality to be added without modifying the core wallet. Extensions receive a 2048-byte payload and can execute arbitrary logic while being subject to rule-set validation. This enables features like scheduled payments, multi-sig requirements, or DeFi integrations.
