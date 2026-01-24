# Module 19: Debugging - Tracing Inter-Contract Failures

**Author:** @jadonamite
**Difficulty:** Intermediate
**Time:** 15 Minutes

The most frustrating moment in Clarity development is receiving a generic error code from a complex transaction.

**Scenario:** You call `(swap-tokens ...)` on a DEX.
**Result:** `(err u10)`.

Is `u10` from the Swap contract? Or did the Token contract return `u1` which the Swap contract converted to `u10`? Or did the Fee contract fail? Without visibility, you are guessing.

This module teaches you how to use the **Clarinet Console Debugger (`::trace`)** to step through the execution stack of inter-contract calls and pinpoint the exact line of failure.

## 1. The Scenario: The "Mystery Failure"

Imagine we have two contracts:

1. `token.clar`: A standard token.
2. `defi.clar`: A contract that tries to transfer that token.

**The Bug:** When we call `deposit`, it fails, but we don't know why.

```clarity
;; defi.clar
(define-public (deposit (amount uint))
    ;; This returns (err u1000) if it fails... generic!
    (unwrap! (contract-call? .token transfer amount tx-sender (as-contract tx-sender)) (err u1000))
)

```

## 2. Enter the Console

Don't just run `clarinet test`. Open the interactive REPL.

```bash
clarinet console

```

## 3. Using `::trace`

In the console, instead of just running the function, prefix it with `::trace`. This tells the Clarity VM to print every evaluation step.

```clarity
;; In the REPL
::trace (contract-call? .defi deposit u500)

```

## 4. Reading the Matrix (The Trace Output)

Clarinet will output a hierarchy of execution. You need to learn to read the indentation.

```text
Processing...
-> (contract-call? .defi deposit u500)
    -> (deposit u500) [defi.clar:5]
        -> (contract-call? .token transfer u500 ...) [defi.clar:8]
            -> (transfer u500 ...) [token.clar:20]
                -> (ft-transfer? ...) [token.clar:22]
                <- (err u1)  ;; <--- HERE IS THE SOURCE!
            <- (err u1)
        <- (err u1000) ;; The error we saw originally
    <- (err u1000)

```

**The Analysis:**

1. We see the call enter `defi.clar`.
2. We see it hop into `token.clar`.
3. We see `ft-transfer?` return `(err u1)`.
4. **Lookup:** In Stacks `ft-transfer?`, error `u1` means **"Insufficient Balance"**.

**Conclusion:** The user (`tx-sender`) didn't have `u500` tokens. The `defi` contract masked this error by wrapping it in `u1000`, but `::trace` revealed the root cause.

## 5. Debugging "Unwrap Panic"

If your code crashes with a Runtime Error, `::trace` is even more vital.

```clarity
;; trace output for a panic
-> (unwrap-panic (map-get? ...))
    -> (map-get? ...)
    <- none
    *** Runtime Error: UnwrapPanic ***

```

The trace shows you exactly *which* `unwrap-panic` triggered. If you have five unwrap calls in one function, the trace context (line numbers) tells you which one failed.

## 6. Advanced: `::get_assets_maps`

Sometimes the logic is fine, but the *state* is wrong. After a trace, run:

```clarity
::get_assets_maps

```

This dumps the current balance of all tokens for all principals in the simulated session. You might realize, "Oh, I minted tokens to Wallet 1, but I'm calling the function as Wallet 2."

## 7. Summary Checklist

* [ ] **Reproduce:** Can you reproduce the error in `clarinet console`?
* [ ] **Trace:** Did you run `::trace (expression)`?
* [ ] **Root Cause:** Did you find the *deepest* indented error return?

