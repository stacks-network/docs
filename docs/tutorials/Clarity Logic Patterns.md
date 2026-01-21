 Clarity Logic - Refactoring Solidity Loops

**Author:** @jadonamite
**Difficulty:** Intermediate
**Time:** 20 Minutes

If you are coming from Solidity, your muscle memory probably reaches for `for` loops constantly. You use them to sum balances, update arrays, or search for values.

**In Clarity, `for` loops do not exist.**

This isn't a missing feature; it's a security feature. Clarity is **decidable**, meaning we must know exactly how much computation a program will consume before it runs. Infinite loops or unbounded recursion are mathematically impossible here.

Instead of *looping* (imperative), we *transform* and *reduce* (functional). This module teaches you how to rewire your brain from `for (i=0; i<n; i++)` to `map` and `fold`.

## 1. The Paradigm Shift

| Solidity Pattern | Clarity Equivalent | Concept |
| --- | --- | --- |
| `for` loop modifying an array | `map` | **Transform**: Apply function to every item. |
| `for` loop calculating a total | `fold` | **Reduce**: Accumulate a single value from a list. |
| `break` / `continue` | *Not supported* | **Logic Flow**: You must restructure your logic to avoid early exits or filter data first. |

---

## 2. Scenario A: Updating a List (The `map` Pattern)

**The Task:** You have a list of prices and you want to increase them all by 10%.

### ❌ The Solidity Way (Imperative)

You create a mutable array and overwrite indices one by one.

```solidity
// Solidity
function increasePrices(uint[] memory prices) public pure returns (uint[] memory) {
    for (uint i = 0; i < prices.length; i++) {
        prices[i] = prices[i] + (prices[i] / 10);
    }
    return prices;
}

```

### ✅ The Clarity Way (Functional)

You cannot mutate a list in place. Instead, you map a function over the list to produce a *new* list.

**Syntax:** `(map function-name input-list)`

```clarity
;; Clarity

;; 1. Define the helper function for a SINGLE item
(define-read-only (add-ten-percent (price uint))
    (+ price (/ price u10))
)

;; 2. Apply it to the list
(define-read-only (increase-prices (prices (list 10 uint)))
    ;; 'map' applies 'add-ten-percent' to every item in 'prices'
    ;; Returns: (list 10 uint)
    (map add-ten-percent prices)
)

```

**Key Takeaway:** Don't think about "indexes" (`i`). Think about the "operation" you want to apply to one item, then let `map` handle the repetition.

---

## 3. Scenario B: Accumulating State (The `fold` Pattern)

**The Task:** Calculate the total balance of a list of users.

### ❌ The Solidity Way

You create a variable outside the loop and update it inside.

```solidity
// Solidity
function sumBalances(uint[] memory balances) public pure returns (uint) {
    uint total = 0; // State variable
    for (uint i = 0; i < balances.length; i++) {
        total += balances[i];
    }
    return total;
}

```

### ✅ The Clarity Way

State mutation inside a helper function is tricky. Instead, we use `fold`.

**Syntax:** `(fold function-name input-list initial-value)`

`fold` takes an "Accumulator" (the running total) and passes it to the next iteration.

```clarity
;; Clarity

;; 1. Define the reducer
;; Inputs: (current-item, accumulator)
(define-read-only (sum-reducer (balance uint) (running-total uint))
    (+ balance running-total)
)

;; 2. Fold the list
(define-read-only (sum-balances (balances (list 10 uint)))
    ;; Start with u0 (initial-value)
    ;; Walk through the list, adding each item to the running-total
    (fold sum-reducer balances u0)
)

```

**Visualizing `fold`:**

> List: `[10, 20, 30]` | Initial: `0`
> 1. `sum-reducer(10, 0)` -> returns `10`
> 2. `sum-reducer(20, 10)` -> returns `30`
> 3. `sum-reducer(30, 30)` -> returns `60` (Final Result)
> 
> 

---

## 4. Scenario C: Advanced Logic (The Tuple Accumulator)

**The Task:** Find the *highest* bid in a list of bids.

This requires keeping track of the "winner so far." In Solidity, you'd use `if (val > max) max = val`. In Clarity, the "max" is just the value you pass to the next step of the `fold`.

```clarity
;; Clarity

(define-read-only (max-reducer (current-bid uint) (highest-so-far uint))
    (if (> current-bid highest-so-far)
        current-bid      ;; New winner! Pass this to next step
        highest-so-far   ;; Old winner stays. Pass this to next step
    )
)

(define-read-only (find-max-bid (bids (list 10 uint)))
    (fold max-reducer bids u0)
)

```

**Pro Tip:** What if you need to return *two* things? (e.g., The highest bid AND who made it?)
You can fold a **Tuple**.

```clarity
;; Accumulator structure: { max-bid: uint, winner-index: uint }
(define-read-only (complex-reducer (bid uint) (state { max: uint, idx: uint }))
   ;; Logic to compare and return a new tuple...
   state 
)

```

---

## 5. Common Pitfalls

### 1. "How do I break early?"

**You can't.**
If you have a list of 100 items and find the answer at item #2, `fold` will still process items #3 to #100.

* *Mitigation:* Use a "flag" in your accumulator tuple. `(if (get found state) ... skip logic ...)` to make the remaining iterations cheap (no-ops), even if they still technically run.

### 2. List Limits

Every list in Clarity must have a **maximum length** defined at compile time (e.g., `(list 100 uint)`).

* *Why?* To calculate gas fees precisely. You cannot just pass an arbitrary array of length N.

### 3. Complexity Limits

If you `map` over a list of 200 items, and your helper function is expensive (e.g., calls `contract-call?`), you might hit the block execution limit.

* *Fix:* Keep helper functions lean.

---
