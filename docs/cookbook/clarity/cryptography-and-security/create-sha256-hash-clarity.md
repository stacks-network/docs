# Create sha256 hash clarity

{% code fullWidth="false" expandable="true" %}
```clarity
(define-read-only (create-sha256-hash (data (buff 4096)))
  (sha256 (unwrap-panic (to-consensus-buff? data)))
)

;; Example usage
(define-read-only (hash-message (message (string-utf8 200)))
  (create-sha256-hash (unwrap-panic (to-consensus-buff? message)))
)

;; Hash a simple string
(print (hash-message u"Hello World"))
```
{% endcode %}

### Description

Generate SHA-256 hashes from buffer data in Clarity smart contracts

### Use Cases

* Creating unique identifiers from data
* Verifying data integrity in contracts
* Implementing commit-reveal schemes
* Building merkle trees for proofs

### Key Concepts

* Takes a buffer as input (max 1MB)
* Returns a 32-byte buffer hash
* Uses `to-consensus-buff?` to ensure consistent encoding
* Produces the same hash as off-chain implementations
