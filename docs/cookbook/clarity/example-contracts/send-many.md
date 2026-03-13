# Send Many

{% code title=".send-many" lineNumbers="true" fullWidth="false" expandable="true" %}
```clarity
(define-private (send-stx (recipient { to: principal, ustx: uint }))
  (stx-transfer? (get ustx recipient) tx-sender (get to recipient)))
(define-private (check-err (result (response bool uint))
                           (prior (response bool uint)))
  (match prior ok-value result
               err-value (err err-value)))
(define-public (send-many (recipients (list 200 { to: principal, ustx: uint })))
  (fold check-err
    (map send-stx recipients)
    (ok true)))
```
{% endcode %}

{% hint style="info" %}
Deployed contract page found [here](https://explorer.hiro.so/txid/0x59665b756dc0fa9efb3fca9e05a28f572c9b14ca894c115fd3e7d81a563e14f8).
{% endhint %}

## Contract Summary

The Send Many contract enables efficient batch STX transfers to multiple recipients in a single transaction. This is a simple yet powerful utility contract that demonstrates functional programming patterns in Clarity.

**What this contract does:**

* Accepts a list of up to 200 recipients with their respective STX amounts
* Transfers STX from the transaction sender to each recipient in the list
* Uses functional programming (map and fold) to process transfers efficiently
* Implements error handling to ensure all transfers succeed or the entire batch fails
* Reduces transaction costs by batching multiple transfers into one transaction

**What developers can learn:**

* How to use Clarity's `map` function to apply operations across a list
* How to use `fold` for accumulating results and propagating errors
* Pattern for implementing "all-or-nothing" batch operations
* Working with tuple types and list structures in Clarity
* Efficient error handling in functional programming style

***

## Function-by-Function Breakdown

### Transfer Operations

#### **`send-stx`**

A private helper function that performs a single STX transfer. It extracts the recipient address and amount from the tuple and calls `stx-transfer?` to send STX from the transaction sender to the specified recipient.

#### **`send-many`**

The main public function that accepts a list of recipients and their amounts. It uses `map` to apply `send-stx` to each recipient, then uses `fold` with `check-err` to ensure all transfers succeed or the entire transaction fails.

### Error Handling

#### **`check-err`**

A fold reducer function that propagates errors through the list of transfer results. If any previous transfer failed (`prior` is an error), it returns that error immediately, ensuring the entire batch operation fails if any single transfer fails.

***

## Key Concepts

### Batch Processing Pattern

The contract demonstrates an elegant pattern for batch operations in Clarity. By combining `map` and `fold`, it can process multiple transfers efficiently while maintaining atomic behavior (all succeed or all fail).

### Functional Programming in Clarity

This contract showcases Clarity's functional programming capabilities:

* **map**: Transforms each recipient tuple into a transfer operation
* **fold**: Reduces the list of results into a single success/failure response
* **Higher-order functions**: Functions that accept other functions as parameters

### Error Propagation with Fold

The `check-err` function implements a critical pattern for error handling in batch operations. It uses `match` to inspect the previous result (`prior`), and if it's an error, propagates it forward regardless of the current result. This ensures the first error encountered stops the entire operation.

### List Size Limits

The contract accepts up to 200 recipients in a single batch. This limit balances efficiency with Clarity's computational constraints, preventing transactions from exceeding block limits while still enabling significant batch processing.
