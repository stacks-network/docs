# Module 14: Optimization - Managing Runtime Execution Costs

**Author:** @jadonamite
**Difficulty:** Advanced
**Time:** 15 Minutes

In Stacks, "Gas" is not the only limit. The blockchain enforces strict quotas on:

1. **Runtime:** The CPU time required to compute the transaction.
2. **Read Count:** How many times you fetch data from the disk.
3. **Write Count:** How many times you modify the disk.

If you hit *any* of these limits, your transaction fails with an "Execution Limit Exceeded" error, even if you paid a high transaction fee. This module teaches you how to write "Lean Clarity" to stay safely within these bounds.

## 1. The "Read Once, Use Many" Pattern

The most common inefficiency is fetching the same variable multiple times in a single function. Every `var-get` or `map-get` hits the database.

### ❌ The Expensive Way (Multiple Reads)

```clarity
(define-data-var tax-rate uint u10)

(define-public (calculate-fees (amount uint))
    (begin
        ;; Read #1
        (print (var-get tax-rate))
        ;; Read #2
        (asserts! (> (var-get tax-rate) u0) (err u1))
        ;; Read #3
        (ok (/ (* amount (var-get tax-rate)) u100))
    )
)

```

### ✅ The Optimized Way (Local Caching)

Use `let` to read the value **once** from the DB into memory, then reference the local variable.

```clarity
(define-public (calculate-fees (amount uint))
    (let
        (
            ;; ONE Read operation
            (rate (var-get tax-rate))
        )
        ;; All subsequent uses are effectively free (memory access)
        (print rate)
        (asserts! (> rate u0) (err u1))
        (ok (/ (* amount rate) u100))
    )
)

```

## 2. The "Accumulate in Memory" Pattern (Write Reduction)

Writes are the most expensive operation on the chain.
Imagine you want to sum a list of numbers and update a "Total Volume" tracker.

### ❌ The Expensive Way (Write inside Loop)

If you update a data-var inside a `fold` or recursive call, you trigger a DB write for *every item* in the list.

```clarity
;; 10 items = 10 DB Writes
(define-private (add-and-save (amount uint) (ignored uint))
    (begin
        (var-set total-volume (+ (var-get total-volume) amount))
        u0
    )
)

```

### ✅ The Optimized Way (Write Once)

Calculate the result purely in memory using `fold`, then perform a **single** write at the end.

```clarity
(define-public (batch-add (amounts (list 10 uint)))
    (let
        (
            ;; 1. Read Old Total (1 Read)
            (current-total (var-get total-volume))
            
            ;; 2. Calculate New Sum in Memory (0 Reads/Writes)
            (batch-sum (fold + amounts u0))
        )
        ;; 3. Write New Total (1 Write)
        (var-set total-volume (+ current-total batch-sum))
        (ok true)
    )
)

```

**Impact:** For a list of 10 items, we reduced costs from **10 Writes** to **1 Write**.

## 3. Short-Circuiting Logic

Clarity evaluates `and` / `or` conditions sequentially. You can save runtime by placing the cheapest checks first.

**Rule:** Place "Computationally Free" checks (e.g., `tx-sender` checks) *before* "Expensive" checks (e.g., `map-get` or `contract-call`).

```clarity
;; ❌ BAD: We pay for the map-get even if the sender is wrong
(asserts! (and (is-some (map-get? big-map id)) (is-eq tx-sender owner)) (err u1))

;; ✅ GOOD: We fail fast on the cheap check first. The map-get never runs.
(asserts! (and (is-eq tx-sender owner) (is-some (map-get? big-map id))) (err u1))

```

## 4. Summary Checklist

* [ ] **Let Bindings:** Did you move repeated `var-get` calls into a `let` block?
* [ ] **Loop Hygiene:** Are you avoiding `var-set` or `map-set` inside `fold` functions?
* [ ] **Fail Fast:** Are your `asserts!` ordered from cheapest to most expensive?

---
