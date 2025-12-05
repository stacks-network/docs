# usdcx-token

{% code title="usdcx-token.clar" lineNumbers="true" expandable="true" %}
```clarity
;; USDCx token
;;
;; This contract implements the SIP-010 trait for fungible contracts.
;;
;; This contract utilizes a role-based access control system to manage protocol permissions.
;; There are three roles:
;;
;; - `governance`: Allowed to update the protocol contracts and add/remove roles
;; - `mint`: Allowed to mint and burn tokens
;; - `pause`: Allowed to pause and unpause the protocol
;;

(impl-trait 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.sip-010-trait-ft-standard.sip-010-trait)

;; `tx-sender` or `contract-caller` tried to move a token it does not own.
(define-constant ERR_NOT_OWNER (err u4))
;; `contract-caller` tried to use a function it is not authorized to use.
(define-constant ERR_UNAUTHORIZED (err u400))
;; Protocol is paused.
(define-constant ERR_PAUSED (err u401))

(define-fungible-token usdcx-token)

(define-data-var token-name (string-ascii 32) "USDCx")
(define-data-var token-symbol (string-ascii 10) "USDCx")
;; The SIP-16 URI for token metadata
(define-data-var token-uri (optional (string-utf8 256)) (some u"https://ipfs.io/ipfs/bafkreifkhq47bgrlq2z2qgtps65eawgp6xsqkwldz57y2bjpefgo5zvza4"))
(define-constant token-decimals u6)

;; Allowed to update the protocol contracts
(define-constant governance-role 0x00)
;; Allowed to mint and burn tokens
(define-constant mint-role 0x01)
;; Allowed to pause and unpause the protocol
(define-constant pause-role 0x02)

;; Allow protocol to be paused
(define-data-var paused bool false)

;; Mapping of active protocol contracts (by role)
(define-map active-protocol-contracts
  {
    caller: principal,
    role: (buff 1),
  }
  bool
)

;; The contract .usdcx-v1 automatically has the `mint` role
(map-set active-protocol-contracts {
  caller: .usdcx-v1,
  role: mint-role,
}
  true
)
;; Default the contract deployer as having the `governance` role
(map-set active-protocol-contracts {
  caller: tx-sender,
  role: governance-role,
}
  true
)

;; SIP-010 functions

(define-public (transfer
    (amount uint)
    (sender principal)
    (recipient principal)
    (memo (optional (buff 34)))
  )
  (begin
    (asserts! (or (is-eq tx-sender sender) (is-eq contract-caller sender))
      ERR_NOT_OWNER
    )
    (try! (ft-transfer? usdcx-token amount sender recipient))
    (match memo
      to-print (print to-print)
      0x
    )
    (ok true)
  )
)

(define-read-only (get-name)
  (ok (var-get token-name))
)

(define-read-only (get-symbol)
  (ok (var-get token-symbol))
)

(define-read-only (get-decimals)
  (ok token-decimals)
)

(define-read-only (get-balance (who principal))
  (ok (ft-get-balance usdcx-token who))
)

(define-read-only (get-balance-available (who principal))
  (ok (ft-get-balance usdcx-token who))
)

(define-read-only (get-balance-locked (who principal))
  (ok (ft-get-balance usdcx-token who))
)

(define-read-only (get-total-supply)
  (ok (ft-get-supply usdcx-token))
)

(define-read-only (get-token-uri)
  (ok (var-get token-uri))
)

;; Protocol caller validation

;; Checks whether the contract-caller is a protocol contract
(define-read-only (is-protocol-caller
    (contract-flag (buff 1))
    (contract principal)
  )
  (validate-protocol-caller contract-flag contract)
)

;; Validate that a given principal is a protocol contract
(define-read-only (validate-protocol-caller
    (contract-flag (buff 1))
    (contract principal)
  )
  (begin
    ;; Check that the caller has the required role
    (asserts!
      (default-to false
        (map-get? active-protocol-contracts {
          caller: contract,
          role: contract-flag,
        })
      )
      ERR_UNAUTHORIZED
    )
    (ok true)
  )
)

;; Protocol pausing

(define-read-only (is-protocol-paused)
  (var-get paused)
)

;; Validate that protocol is not paused
(define-read-only (validate-protocol-active)
  (ok (asserts! (not (is-protocol-paused)) ERR_PAUSED))
)

;; --- Protocol functions

;; Transfer tokens from one account to another.
;; Only the `mint` role is allowed to call this function.
(define-public (protocol-transfer
    (amount uint)
    (sender principal)
    (recipient principal)
  )
  (begin
    ;; #[filter(amount, sender, recipient)]
    (try! (validate-protocol-active))
    (try! (validate-protocol-caller mint-role contract-caller))
    (ft-transfer? usdcx-token amount sender recipient)
  )
)

;; Mint tokens to an account.
;; Only the `mint` role is allowed to call this function.
(define-public (protocol-mint
    (amount uint)
    (recipient principal)
  )
  (begin
    ;; #[filter(amount, recipient)]
    (try! (validate-protocol-active))
    (try! (validate-protocol-caller mint-role contract-caller))
    (ft-mint? usdcx-token amount recipient)
  )
)

;; Burn tokens from an account.
;; Only the `mint` role is allowed to call this function.
(define-public (protocol-burn
    (amount uint)
    (owner principal)
  )
  (begin
    ;; #[filter(amount, owner)]
    (try! (validate-protocol-active))
    (try! (validate-protocol-caller mint-role contract-caller))
    (ft-burn? usdcx-token amount owner)
  )
)

;; Set the name of the token.
;; Only the `governance` role is allowed to call this function.
(define-public (protocol-set-name (new-name (string-ascii 32)))
  (begin
    ;; #[filter(new-name)]
    (try! (validate-protocol-active))
    (try! (validate-protocol-caller governance-role contract-caller))
    (ok (var-set token-name new-name))
  )
)

;; Set the symbol of the token.
;; Only the `governance` role is allowed to call this function.
(define-public (protocol-set-symbol (new-symbol (string-ascii 10)))
  (begin
    ;; #[filter(new-symbol)]
    (try! (validate-protocol-active))
    (try! (validate-protocol-caller governance-role contract-caller))
    (ok (var-set token-symbol new-symbol))
  )
)

;; Set the SIP-16 URI for token metadata.
;; Only the `governance` role is allowed to call this function.
(define-public (protocol-set-token-uri (new-uri (optional (string-utf8 256))))
  (begin
    ;; #[filter(new-uri)]
    (try! (validate-protocol-active))
    (try! (validate-protocol-caller governance-role contract-caller))
    (ok (var-set token-uri new-uri))
  )
)

;; Helper function to mint tokens to multiple recipients.
;; Only the `mint` role is allowed to call this function.
(define-private (protocol-mint-many-iter (item {
  amount: uint,
  recipient: principal,
}))
  ;; #[allow(unchecked_data)]
  (ft-mint? usdcx-token (get amount item) (get recipient item))
)

;; Mint tokens to multiple recipients.
;; Only the `mint` role is allowed to call this function.
(define-public (protocol-mint-many (recipients (list 200 {
  amount: uint,
  recipient: principal,
})))
  (begin
    ;; #[filter(recipients)]
    (try! (validate-protocol-active))
    (try! (validate-protocol-caller mint-role contract-caller))
    (ok (map protocol-mint-many-iter recipients))
  )
)

;; Set an active protocol caller.
;; Only the `governance` role is allowed to call this function.
(define-public (set-active-protocol-caller
    (caller principal)
    (role (buff 1))
    (enabled bool)
  )
  (begin
    ;; #[filter(caller, role, enabled)]
    (try! (validate-protocol-active))
    (try! (validate-protocol-caller governance-role contract-caller))
    (map-set active-protocol-contracts {
      caller: caller,
      role: role,
    }
      enabled
    )
    (ok true)
  )
)

;; Pause the protocol.
;; Only the `pause` role is allowed to call this function.
(define-public (pause)
  (begin
    (try! (validate-protocol-caller pause-role contract-caller))
    (print {
      topic: "pause",
      paused: true,
      caller: contract-caller,
    })
    (ok (var-set paused true))
  )
)

;; Unpause the protocol.
;; Only the `pause` role is allowed to call this function.
(define-public (unpause)
  (begin
    (try! (validate-protocol-caller pause-role contract-caller))
    (print {
      topic: "pause",
      paused: false,
      caller: contract-caller,
    })
    (ok (var-set paused false))
  )
)

```
{% endcode %}

## **USDCx Contract Summary**

This contract implements **USDCx**, a SIP-010 fungible token on Stacks with a **role-based access control system** and **pause functionality** for protocol safety. It exposes the standard SIP-010 interface for transfers, supply queries, and metadata, while providing protocol-only functions for minting, burning, governance updates, and pausing.

#### **Roles**

The contract defines three privileged roles:

* **Governance (`governance-role`)** – manages protocol configuration, updates token metadata, and assigns roles.
* **Mint (`mint-role`)** – authorized to mint, burn, and perform protocol-level transfers.
* **Pause (`pause-role`)** – authorized to pause and unpause the protocol.

A protocol pause halts state-changing operations for safety. The contract deployer automatically receives the **governance** role. The companion contract `.usdcx-v1` automatically receives the **mint** role.

***

### Function-by-Function Breakdown

### **SIP-010 Standard Functions**

#### **`transfer(amount, sender, recipient, memo)`**

Transfers USDCx between principals, following SIP-010 rules. The function checks that the sender is either `tx-sender` or `contract-caller` (for contracts managing escrow or vaults) and then performs the transfer. An optional memo is logged on-chain.

#### **`get-name()`**, **`get-symbol()`**, **`get-decimals()`**

Standard SIP-010 metadata getters returning token name, symbol, and decimal precision.

#### **`get-balance(who)`**, **`get-balance-available(who)`**, **`get-balance-locked(who)`**

Returns the token balance for the given principal. In this implementation, all three accessor functions return the same SIP-010 balance value.

#### **`get-total-supply()`**

Returns the total USDCx supply minted minus burned.

#### **`get-token-uri()`**

Returns the token metadata URI.

***

### **Protocol Caller Validation**

These functions enforce the contract’s role-based permissions.

#### **`is-protocol-caller(role, contract)`**

Checks whether the specified contract principal holds the required role.

#### **`validate-protocol-caller(role, contract)`**

Ensures the caller has the correct role. If not, returns `ERR_UNAUTHORIZED`.

#### **`is-protocol-paused()`**

Returns whether the protocol is currently paused.

#### **`validate-protocol-active()`**

Asserts that the protocol is not paused, otherwise returns `ERR_PAUSED`.

***

### **Protocol-Only Token Operations**

These functions enable minting/burning/transfers strictly for authorized protocol contracts.

#### **`protocol-transfer(amount, sender, recipient)`**

Performs a protocol-level transfer on behalf of another contract. Only callers with the **mint role** can use it. Fails if the protocol is paused.

#### **`protocol-mint(amount, recipient)`**

Mints new USDCx to a principal. Restricted to the **mint role** and disabled when paused.

#### **`protocol-burn(amount, owner)`**

Burns tokens from a principal’s balance. Also restricted to the **mint role** and disabled when paused.

#### **`protocol-mint-many(recipients)`**

Batch-mints tokens to multiple recipients in a single call. Each item includes `{ amount, recipient }`. Only callable by entities with the **mint role**.

***

### **Governance Functions**

Only the **governance role** may call these functions.

#### **`protocol-set-name(new-name)`**

Updates the token’s SIP-010 name.

#### **`protocol-set-symbol(new-symbol)`**

Updates the token’s SIP-010 ticker symbol.

#### **`protocol-set-token-uri(new-uri)`**

Updates the SIP-016 metadata URI.

#### **`set-active-protocol-caller(caller, role, enabled)`**

Adds or removes a principal from a specific protocol role.\
Used for rotating systems, updating companion contracts, or delegating new responsibility.

***

### **Pause Controls**

These functions allow the protocol to halt operations for safety or maintenance.

#### **`pause()`**

Pauses the contract, disabling minting, burning, and all protocol-only actions. Only callable by the **pause role**.

#### **`unpause()`**

Re-enables the protocol after a pause. Also restricted to the **pause role**.

Both functions emit an on-chain event for transparency.
