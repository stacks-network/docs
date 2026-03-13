# Derive principal addresses between networks

{% code fullWidth="false" expandable="true" %}
```clarity
;; Extract hash bytes from an address
(define-read-only (get-address-hash-bytes (address principal))
  (get hash-bytes (unwrap-panic (principal-destruct? address)))
)

;; Convert testnet address to mainnet
(define-read-only (testnet-to-mainnet (testnet-address principal))
  (let (
    ;; Extract the hash bytes from testnet address
    (hash-bytes (get-address-hash-bytes testnet-address))
    ;; Mainnet version byte
    (mainnet-version 0x16)
  )
    ;; Reconstruct with mainnet version
    (principal-construct? mainnet-version hash-bytes)
  )
)

;; Convert mainnet address to testnet
(define-read-only (mainnet-to-testnet (mainnet-address principal))
  (let (
    ;; Extract the hash bytes from mainnet address
    (hash-bytes (get-address-hash-bytes mainnet-address))
    ;; Testnet version byte
    (testnet-version 0x1a)
  )
    ;; Reconstruct with testnet version
    (principal-construct? testnet-version hash-bytes)
  )
)

;; Example usage
(testnet-to-mainnet 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)
;; Returns: (ok SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRCBGD7R)
```
{% endcode %}

### Description

Convert addresses between mainnet and testnet by extracting and reconstructing with different version bytes

### Use Cases

* Cross-network address verification
* Building multi-network dApps
* Address validation tools
* Network migration utilities

### Key Concepts

* **Version byte** - Indicates network and address type
* **Hash bytes** - 20-byte hash of the public key
* **Checksum** - Built into the c32 encoding
* Version bytes: 0x16 (Mainnet SP), 0x17 (Mainnet SM), 0x1a (Testnet ST), 0x1b (Testnet SN)
