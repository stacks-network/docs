# Helper function to restrict contract calls

{% code fullWidth="false" expandable="true" %}
```clarity
;; Check if caller is a standard principal (user wallet)
(define-private (is-standard-principal-call)
  (is-none (get name (unwrap! (principal-destruct? contract-caller) false)))
)

;; Public function restricted to direct user calls
(define-public (user-only-function (amount uint))
  (begin
    (asserts! (is-standard-principal-call) (err u401))
    ;; Function logic here
    (ok true)
  )
)
```
{% endcode %}

### Description

Implement access control to ensure functions can only be called by users, not other contracts

### Use Cases

* Preventing contract-to-contract reentrancy attacks
* Ensuring human-initiated transactions for governance
* Restricting token minting to direct user actions
* Protecting admin functions from automated calls

### Key Concepts

* **Standard principals** - User wallets (SP/ST addresses)
* **Contract principals** - Deployed contracts (address.contract-name)
* **contract-caller** - The immediate caller of the current function
* **tx-sender** - The original transaction initiator
