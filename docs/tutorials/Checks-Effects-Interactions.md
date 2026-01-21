The "Checks-Effects-Interactions" Pattern

**Author:** @jadonamite
**File Name:** `contracts/order-book.clar`
**Difficulty:** Intermediate
**Time:** 15 Minutes

In Solidity, the **Checks-Effects-Interactions (CEI)** pattern is a survival requirement to prevent re-entrancy attacks (where a malicious contract calls back into your contract before you update your balance).

**In Clarity, re-entrancy is impossible.** The Stacks VM strictly forbids a contract from calling back into itself, directly or indirectly, in the same transaction.

So, why do we still use CEI?

1. **"Fail Fast" Gas Efficiency:** If a transaction is going to fail, you want it to fail immediately (in the Checks phase) before you pay for expensive state computations.
2. **Readability:** It separates "Validation" logic from "Business" logic.
3. **Logical Safety:** Even without re-entrancy, updating state *after* an external call creates "dirty state" assumptions that make debugging difficult.

## 1. The Pattern Definition

1. **Checks:** Validate inputs, permissions, and conditions. (`asserts!`)
2. **Effects:** Update local state, data variables, and maps. (`var-set`, `map-set`)
3. **Interactions:** Call other contracts or transfer tokens. (`stx-transfer?`, `contract-call?`)

---

## 2. The Anti-Pattern (How NOT to write it)

Imagine an "Order Book" where users buy an item. Here, we mix the logic. This is messy and hard to audit.

**File:** `contracts/bad-order-book.clar`

```clarity
(define-public (buy-item (item-id uint))
    (let
        (
            (price (get-price item-id))
            (buyer tx-sender)
        )
        ;; INTERACTION (Too early!)
        ;; We try to take the money first.
        (unwrap! (stx-transfer? price buyer (as-contract tx-sender)) (err u1))

        ;; CHECK (Too late!)
        ;; Oh wait, is the item actually available?
        ;; If this fails, the transfer above REVERTS (thanks to Clarity),
        ;; but we wasted execution cost processing the transfer logic first.
        (asserts! (is-available item-id) (err u2))

        ;; EFFECT
        (map-set orders item-id buyer)
        (ok true)
    )
)

```

## 3. The Implementation (The CEI Way)

We refactor this to be clean, gas-efficient, and logically sound.

**File:** `contracts/order-book.clar`

```clarity
;; constants
(define-constant ERR-NOT-AVAILABLE (err u100))
(define-constant ERR-TRANSFER-FAILED (err u101))
(define-data-var total-sales uint u0)

(define-public (buy-item (item-id uint))
    (let
        (
            (price (default-to u0 (map-get? item-prices item-id)))
            (buyer tx-sender)
        )
        ;; ---------------------------------------------------
        ;; 1. CHECKS (Validation Phase)
        ;; ---------------------------------------------------
        ;; "Fail Fast": Stop execution immediately if conditions aren't met.
        
        ;; Is the item valid?
        (asserts! (> price u0) (err ERR-NOT-AVAILABLE))
        
        ;; Is the item currently unsold?
        (asserts! (is-none (map-get? orders item-id)) (err ERR-NOT-AVAILABLE))

        ;; ---------------------------------------------------
        ;; 2. EFFECTS (State Update Phase)
        ;; ---------------------------------------------------
        ;; Update internal bookkeeping BEFORE external contact.
        ;; Even though re-entrancy is impossible, this keeps local state
        ;; consistent before we hand control to another contract/token.
        
        (map-set orders item-id buyer)
        (var-set total-sales (+ (var-get total-sales) price))

        ;; ---------------------------------------------------
        ;; 3. INTERACTIONS (External Phase)
        ;; ---------------------------------------------------
        ;; Now that our house is in order, we move the funds.
        ;; If this fails (e.g., user has no money), the whole tx reverts,
        ;; undoing the Effects and Checks automatically.
        
        (match (stx-transfer? price buyer (as-contract tx-sender))
            success (ok true)
            error (err ERR-TRANSFER-FAILED)
        )
    )
)

```

## 4. Why this prevents Logic Errors

### Scenario: The "Double Spend" Illusion

If you swap the order (Effects *after* Interactions) and you are interacting with a malicious Trait, the code becomes confusing to read.

By strictly enforcing **Effects before Interactions**, you guarantee that any external contract looking back at your contract sees the **updated** state.

**Example:**

1. You call `(buy-item)`.
2. `buy-item` sets `(map-set orders item-id buyer)`.
3. `buy-item` calls `(stx-transfer?)`.
4. Imagine `stx-transfer?` triggers a notification to a listing contract.
5. That listing contract calls `(get-owner item-id)` on YOUR contract.
* **With CEI:** It sees the *new* owner (Correct).
* **Without CEI:** It sees the *old* owner (Logic Error), because you haven't done the Effect yet.



## 5. Summary Checklist

* [ ] **Asserts First:** Are all `asserts!` statements at the very top of the `let` block?
* [ ] **Maps Second:** Do you update `map-set` and `var-set` before any `contract-call?`?
* [ ] **Calls Last:** Is the asset transfer or external call the absolute last step of the function?


```
