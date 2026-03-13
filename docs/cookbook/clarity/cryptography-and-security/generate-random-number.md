# Generate random number

{% code fullWidth="false" expandable="true" %}
```clarity
(define-read-only (generate-random (block-height uint))
  (let (
    ;; Get block header hash
    (block-hash (unwrap! (get-stacks-block-info? id-header-hash block-height) (err u1001)))
    ;; Take a slice of the hash for randomness
    (hash-slice (unwrap-panic (slice? block-hash u16 u32)))
    ;; Convert to uint
    (random-value (buff-to-uint-be (unwrap-panic (as-max-len? hash-slice u16))))
  )
    (ok random-value)
  )
)

;; Generate random number in range
(define-read-only (random-in-range (block-height uint) (min uint) (max uint))
  (let (
    (random (try! (generate-random block-height)))
    (range (- max min))
  )
    (ok (+ min (mod random (+ u1 range))))
  )
)

;; Example: Random between 1-100
(random-in-range block-height u1 u100)
```
{% endcode %}

### Description

Create pseudo-random numbers using block hashes for randomness in smart contracts

### Use Cases

* Lottery and gaming contracts
* Random NFT trait generation
* Fair distribution mechanisms
* Random selection from lists

### Key Concepts

* **Block hashes** - Use historical block data as entropy source
* **Future blocks** - Cannot predict future block hashes
* **Commitment schemes** - Combine with commit-reveal for fairness
* Blockchain randomness is deterministic but unpredictable
