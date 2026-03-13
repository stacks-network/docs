# Filter items from a list

{% code fullWidth="false" expandable="true" %}
```clarity
(define-read-only (filter-item (l (list 100 uint)) (remove uint))
  (get newList (fold remove-value l { compareTo: remove, newList: (list) }))
)

(define-private (remove-value (listValue uint) (trackerTuple { compareTo: uint, newList: (list 100 uint) }))
  (merge trackerTuple {newList:
    (if (is-eq listValue (get compareTo trackerTuple))
      (get newList trackerTuple)
      (unwrap-panic (as-max-len? (append (get newList trackerTuple) listValue) u100))
    )
  })
)

;; Example usage
(filter-item (list u1 u2 u3 u2 u4) u2) ;; Returns (u1 u3 u4)
```
{% endcode %}

### Description

Remove specific items from lists using fold in Clarity

### Use Cases

* Removing blacklisted addresses from access lists
* Filtering out completed tasks from todo lists
* Excluding specific tokens from portfolios
* Data cleanup in smart contracts

### Key Concepts

* **Accumulator** - Tracks the value to remove and builds the new list
* **Conditional append** - Only adds items that don't match the filter
* **Type safety** - Maintains list type and maximum length
* This pattern uses `fold` to iterate through a list and build a new list
