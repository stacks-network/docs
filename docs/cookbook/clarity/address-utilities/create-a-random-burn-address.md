# Create a random burn address

{% code fullWidth="false" expandable="true" %}
```clarity
(define-read-only (generate-burn-address (entropy (string-ascii 40)))
  (let (
    ;; Hash the entropy to create address bytes
    (hash-bytes (hash160 (unwrap-panic (to-consensus-buff? entropy))))
    ;; Use version byte for current network
    (version-byte (if is-in-mainnet 0x16 0x1a))
  )
    ;; Construct a valid principal that no one controls
    (principal-construct? version-byte hash-bytes)
  )
)

;; Example: Generate unique burn address
(generate-burn-address "BURN-2024-01-15-PROJECT-XYZ")
;; Returns: (ok SP1FJPSG7V4QMA7D4XVPZ3B2HQ8GY3EK8GC0NGNT3)
```
{% endcode %}

### Description

Generate burn addresses for permanently removing tokens from circulation

### Use Cases

* Token burning mechanisms
* Proof-of-burn implementations
* Creating unspendable addresses for protocol fees
* Deflationary token economics

### Key Concepts

* **No private key** - Generated from arbitrary data, not a key pair
* **Verifiable** - Anyone can verify tokens sent to these addresses
* **Unique** - Different entropy creates different addresses
* **Permanent** - Funds sent are irretrievably lost
