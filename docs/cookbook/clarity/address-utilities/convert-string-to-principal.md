# Convert string to principal

{% code fullWidth="false" expandable="true" %}
```clarity
(define-read-only (string-to-principal? (input (string-ascii 82)))
  (let (
    ;; Find the dot separator for contract addresses
    (dot (default-to (len input) (index-of? input ".")))
    ;; Extract address part (skip first char which is version)
    (addr (unwrap! (slice? input u1 dot) ERR_INVALID_LENGTH))
    ;; Decode c32 characters to numbers
    (addressc32 (map unwrap-panic-uint (filter is-some-uint (map c32-index addr))))
    ;; Validate all characters are valid c32
    (isValidChars (asserts! (is-eq (len addr) (len addressc32)) ERR_INVALID_CHAR))
    ;; Extract version and decode address data
    (version (unwrap-panic (element-at? addressc32 u0)))
    (decoded (decode-address addressc32))
    ;; Verify checksum
    (checksum (verify-checksum decoded version))
    )
    ;; Construct principal with or without contract name
    (match (slice? input (+ u1 dot) (len input)) contract
      (principal-construct? (to-byte version) (get-address-bytes decoded) contract)
      (principal-construct? (to-byte version) (get-address-bytes decoded))
    )
  )
)

;; Example usage
(string-to-principal? "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7")
;; Returns (some SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7)

(string-to-principal? "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7.my-contract")
;; Returns (some SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7.my-contract)
```
{% endcode %}

### Description

Parse string addresses into principal types using c32 decoding in Clarity

### Use Cases

* Parsing user input addresses in contracts
* Converting stored string addresses to principals
* Validating address formats before use
* Building dynamic contract calls with string inputs

### Key Concepts

* **c32 alphabet** - `0123456789ABCDEFGHJKMNPQRSTVWXYZ` (no I, L, O, U)
* **Checksum** - Last 4 bytes verify address integrity
* **Version byte** - First character indicates address type
* **Contract addresses** - Include `.contract-name` suffix
