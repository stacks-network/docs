# Check for duplicates

{% code fullWidth="false" expandable="true" %}
```clarity
;; Check for duplicate characters in a string
(define-read-only (has-duplicate-chars? (input (string-ascii 200)))
  (is-none (fold dup input (slice? (concat input "|END") u1 (+ (len input) u4))))
)

(define-private (dup (ch (string-ascii 1)) (out (optional (string-ascii 204))))
  (match out out_some 
    (match (index-of? (unwrap-panic (slice? out_some u0 (- (len out_some) u4))) ch) 
      found none 
      (slice? out_some u1 (len out_some))
    )
    out
  )
)

;; Example usage
(has-duplicate-chars? "hello") ;; Returns true (duplicate 'l')
(has-duplicate-chars? "world") ;; Returns false (no duplicates)
```
{% endcode %}

### Description

Detect duplicate characters in strings and duplicate items in lists using Clarity

### Use Cases

* Validating usernames for uniqueness of characters
* Checking NFT trait uniqueness in collections
* Preventing duplicate entries in voting systems
* Ensuring unique identifiers in lists

### Key Concepts

* **Strings** - Uses `fold` with `index-of?` to find repeated characters
* **Lists** - Checks if elements appear again in the remaining list
* **Optimization** - Early exit on first duplicate found
