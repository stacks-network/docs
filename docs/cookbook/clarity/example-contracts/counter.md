# Counter

{% code title="counter.clar" lineNumbers="true" fullWidth="false" expandable="true" %}
```clarity
;; An on-chain counter that stores a count for each individual

;; Define a map data structure
(define-map counters
  principal
  uint
)

;; Function to retrieve the count for a given individual
(define-read-only (get-count (who principal))
  (default-to u0 (map-get? counters who))
)

;; Function to increment the count for the caller
(define-public (count-up)
  (ok (map-set counters tx-sender (+ (get-count tx-sender) u1)))
)
```
{% endcode %}

## Contract Summary

The Counter contract is a simple on-chain counter that maintains individual count values for each principal address. This minimalist contract demonstrates fundamental Clarity data structures and state management patterns.

**What this contract does:**

* Stores a separate counter value for each user (principal)
* Provides read-only access to retrieve any user's count
* Allows users to increment their own counter by 1
* Initializes counters at 0 for new users automatically

**What developers can learn:**

* How to use `define-map` to create key-value storage in Clarity
* Pattern for per-user state management using principal addresses
* Using `default-to` to handle missing map entries gracefully
* Simple read-only vs public function distinction
* Basic arithmetic operations and map updates with `map-set`
* The `tx-sender` context variable for identifying callers
