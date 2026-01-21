# Module 13: Data Storage - Complex Maps & Tuple Keys

**Author:** @jadonamite
**Difficulty:** Intermediate
**Time:** 20 Minutes

In simple contracts, you map an ID to an Owner (`uint -> principal`).
But in the real world, you often need **Composite Keys** (e.g., "Allow `User A` to spend `User B`'s tokens") or **Structured Values** (storing a user's `balance`, `reputation`, and `username` all in one slot).

Clarity handles this efficiently using **Tuples**. This module teaches you how to define, set, and update complex data structures.

## 1. The Scenario: An "Allowance" System

We want to build a system where an **Owner** authorizes a **Spender** to use a specific amount of tokens. This requires a double-key lookup.

### Defining the Map

We use a **Tuple** `{ ... }` as the key signature.

```clarity
;; 1. The Key Type: { owner: principal, spender: principal }
;; 2. The Value Type: { amount: uint, expires-at: uint }
(define-map allowances 
    { owner: principal, spender: principal } 
    { amount: uint, expires-at: uint }
)

```

## 2. Setting Data (Insertion)

To insert data, you must construct the key tuple and the value tuple on the fly using the curly brace `{}` syntax.

```clarity
(define-public (approve (spender principal) (amount uint))
    (begin
        (map-set allowances
            ;; The Key Tuple
            { owner: tx-sender, spender: spender }
            ;; The Value Tuple
            { amount: amount, expires-at: (+ block-height u100) }
        )
        (ok true)
    )
)

```

## 3. Retrieving Data (Lookup)

Fetching data requires constructing the exact same key tuple structure. Since `map-get?` returns an `(optional (tuple))`, we usually need to unpack it or handle defaults.

```clarity
(define-read-only (get-allowance (owner principal) (spender principal))
    ;; Returns: { amount: uint, expires-at: uint }
    (default-to 
        ;; Default value if no record exists
        { amount: u0, expires-at: u0 } 
        ;; The Lookup
        (map-get? allowances { owner: owner, spender: spender })
    )
)

```

## 4. Updating Partial Data (The Merge Pattern)

**Clarity maps are immutable values.** You cannot write `allowance.amount = 50`.
To update *one* field in a stored tuple, you must:

1. **Get** the old tuple.
2. **Merge** the new field into it.
3. **Set** the map again.

```clarity
(define-public (increase-allowance (spender principal) (added-amount uint))
    (let
        (
            (owner tx-sender)
            ;; 1. GET current state (or default)
            (current-data (default-to 
                { amount: u0, expires-at: u0 }
                (map-get? allowances { owner: owner, spender: spender })
            ))
            (current-amount (get amount current-data))
        )
        ;; 2. & 3. MERGE and SET
        (map-set allowances
            { owner: owner, spender: spender }
            (merge current-data { amount: (+ current-amount added-amount) })
        )
        (ok true)
    )
)

```

**Why `merge`?**
`(merge tupleA tupleB)` creates a new tuple that has all fields from A, overwritten by any matching fields in B. It is safer and cleaner than manually reconstructing the whole tuple.

## 5. Summary Checklist

* [ ] **Key Consistency:** Ensure the key tuple fields (`owner`, `spender`) are always in the same order as defined in `define-map`.
* [ ] **Default Handling:** Always wrap `map-get?` in `default-to` if a "zero state" is valid logic.
* [ ] **Merge:** Use `(merge old-state { new: value })` for partial updates to save gas and reduce code duplication.

---
