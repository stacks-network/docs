# Convert BTC to STX address

{% code fullWidth="false" expandable="true" %}
```clarity
(define-read-only (btc-to-stx (input (string-ascii 60)))
  (let (
    ;; Decode base58 string to numbers
    (b58-numbers (map unwrap-uint (filter is-some-uint (map b58-to-uint input))))
    ;; Validate all characters are valid base58
    (t1 (asserts! (>= (len b58-numbers) (len input)) ERR_INVALID_CHAR))
    ;; Count leading '1's (zeros in base58)
    (leading-ones-count (default-to (len input) (index-of? (map is-zero b58-numbers) false)))
    ;; Convert to bytes
    (decoded (concat (fold decode-outer to-decode LST) leading-zeros))
    (decoded-hex (fold to-hex-rev decoded 0x))
    ;; Verify checksum
    (actual-checksum (unwrap-panic (slice? (sha256 (sha256 (unwrap-panic (slice? decoded-hex u0 (- decoded-hex-len u4))))) u0 u4)))
    (expected-checksum (unwrap-panic (slice? decoded-hex (- decoded-hex-len u4) decoded-hex-len)))
    (t3 (asserts! (is-eq actual-checksum expected-checksum) ERR_BAD_CHECKSUM))
    ;; Extract version and construct principal
    (version (unwrap-panic (element-at? STX_VER (unwrap! (index-of? BTC_VER (unwrap-panic (element-at? decoded-hex u0))) ERR_INVALID_VERSION))))
    )
    (principal-construct? version (unwrap-panic (as-max-len? (unwrap-panic (slice? decoded-hex u1 (- decoded-hex-len u4))) u20)))
  )
)

;; Example usage
(btc-to-stx "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa") ;; Returns Stacks address
```
{% endcode %}

### Description

Convert Bitcoin addresses to their corresponding Stacks addresses using base58 decoding in Clarity

### Use Cases

* Cross-chain address mapping for Bitcoin-Stacks bridges
* Verifying ownership across both chains
* Converting legacy Bitcoin addresses to Stacks format
* Building cross-chain authentication systems

### Key Concepts

* **Base58 decoding** - Bitcoin addresses use base58 encoding
* **Checksum verification** - Last 4 bytes are a double SHA-256 checksum
* **Version mapping** - Bitcoin version bytes map to Stacks version bytes
* **Principal construction** - Build Stacks principal from decoded data
