---
description: Optimize Clarity smart contracts to minimize execution costs and improve performance.
---

# Gas Optimization

Optimize Clarity smart contracts to minimize execution costs and improve performance.

{% hint style="info" %}
While Stacks transaction costs are significantly lower than Ethereum, efficient gas management ensures a better user experience and enables higher throughput for complex operations like DeFi or NFT mints.
{% endhint %}

## Clarity Cost Model

Clarity uses a runtime cost model where operations are measured across five components:

1.  **Read Count**: Number of storage reads.
2.  **Write Count**: Number of storage writes.
3.  **Read Length**: Bytes read from storage.
4.  **Write Length**: Bytes written to storage.
5.  **Runtime**: CPU execution cycles.

Modern Clarity development relies on minimizing storage interactions, as these are the most expensive operations.

---

## Storage Operations

Storage access (reads and writes) is the primary driver of transaction costs. Caching and batching are the most effective strategies to reduce these costs.

### Cache Storage Reads

Avoid calling `var-get` or `map-get?` multiple times for the same value in a single execution. Cache the value in a `let` binding instead.

{% code title="caching.clar" %}
```clarity
;; ❌ Bad: Multiple reads
(define-public (calculate-fee (amount uint))
  (ok (* (/ amount (var-get fee-denominator)) (var-get fee-numerator))))

;; ✅ Good: Single read cached in let binding
(define-public (calculate-fee (amount uint))
  (let (
    (denominator (var-get fee-denominator))
    (numerator (var-get fee-numerator))
  )
    (ok (* (/ amount denominator) numerator))))
```
{% endcode %}

### Batch Storage Writes

Consolidate related data into tuples to minimize industrial map writes.

{% code title="batching.clar" %}
```clarity
;; ❌ Bad: Separate map updates
(define-public (update-user (balance uint) (score uint))
  (begin
    (map-set user-balances tx-sender balance)
    (map-set user-scores tx-sender score)
    (ok true)))

;; ✅ Good: Single map with tuple
(define-public (update-user (balance uint) (score uint))
  (ok (map-set user-data tx-sender { balance: balance, score: score })))
```
{% endcode %}

---

## Efficient Logic

Writing computationally efficient code reduces the `runtime` cost component and prevents reaching execution limits.

### Early Returns

Use `asserts!` for validation at the beginning of functions to fail fast and avoid unnecessary computation.

{% code title="validation.clar" %}
```clarity
;; ✅ Good: Fail fast with asserts!
(define-public (transfer (amount uint) (recipient principal))
  (begin
    (asserts! (> amount u0) (err u0))
    (asserts! (not (is-eq tx-sender recipient)) (err u1))
    ;; logic execution
    (ok true)))
```
{% endcode %}

### Right-Size Data Types

Smaller data types reduce read/write lengths. Use `buff` instead of `string-utf8` for identifiers or fixed-length hex data.

{% hint style="tip" %}
A `uint` is always 128-bit. If storing small flags or enumerations, consider using `buff` or `bool` to save storage space.
{% endhint %}

---

## Loops and Iterations

Clarity uses functional patterns like `fold`, `map`, and `filter` for iteration. These should be used cautiously.

- **Minimize Pass Counts**: If you need to transform and then aggregate a list, combine the operations into a single `fold` with a complex accumulator rather than calling `map` then `fold`.
- **Bound List Sizes**: Always define a reasonable maximum size for lists to prevent hitting runtime cost limits on large inputs.

---

## Read-Only Functions

Use `define-read-only` for any operation that does not modify state.

{% hint style="info" %}
Read-only functions are "free" when called via API/RPC as they don't require an on-chain transaction.
{% endhint %}

For complex frontend data needs, create a read-only "view" function that batches multiple data points into a single tuple return, reducing the number of network requests.

---

## Measuring Costs

Use [Clarinet](../clarinet/testing-with-clarinet-sdk.md) to analyze the gas consumption of your functions before deployment.

```bash
# Run tests with cost analysis
clarinet test --costs
```

This command provides a detailed breakdown of read/write operations and runtime cycles for every transaction in your test suite.
