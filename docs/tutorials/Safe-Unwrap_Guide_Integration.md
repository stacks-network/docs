# Module 12: Robust Error Handling - Safe Unwrap Patterns

**Author:** @jadonamite
**Difficulty:** Beginner
**Time:** 10 Minutes

In Clarity, `unwrap-panic` is the developer's "I promise this will never happen" button.
**Spoiler:** It *will* happen. And when it does, your user gets a generic "Runtime Error" with no explanation, no error code, and no way for your frontend to handle it gracefully.

This module teaches you to replace "hope-driven development" with structured Error Handling using `unwrap!` and explicit Error Constants.

## 1. The Anti-Pattern: `unwrap-panic`

`unwrap-panic` takes an Option (`some` or `none`). If it is `none`, it immediately aborts the entire transaction.

### ❌ The "Lazy" Implementation

```clarity
;; BAD: Prototyping code that shouldn't reach mainnet
(define-public (transfer-ownership (new-owner principal))
    (let
        (
            ;; If 'map-get?' returns none, the chain halts here.
            ;; The user sees: "Transaction failed" (Generic).
            (current-owner (unwrap-panic (map-get? owners tx-sender)))
        )
        (map-set owners new-owner current-owner)
        (ok true)
    )
)

```

**Why this is bad:**

1. **Debugging Hell:** You don't know *why* it failed. Was the map empty? Was the principal invalid?
2. **Frontend Blindness:** Your UI cannot show a specific "You don't own this item" toast because it just receives a generic abort status.

## 2. The Solution: `unwrap!` with Constants

`unwrap!` works like a bouncer. It says: *"If this value exists, unpack it and keep going. If not, **return this specific error** and exit the function immediately."*

### ✅ The Robust Implementation

**File:** `contracts/safe-unwrap.clar`

```clarity
;; 1. Define Meaningful Constants
;; Use standard HTTP-like codes or a consistent internal logic
(define-constant ERR-NOT-FOUND (err u404))
(define-constant ERR-UNAUTHORIZED (err u401))
(define-constant ERR-ALREADY-EXISTS (err u409))

(define-map owners principal principal)

(define-public (transfer-ownership (new-owner principal))
    (let
        (
            ;; 2. The Safe Unwrap
            ;; Attempt to get the value.
            ;; If 'none', function returns (err u404) immediately.
            ;; If 'some', 'current-owner' becomes the unpacked value.
            (current-owner (unwrap! (map-get? owners tx-sender) ERR-NOT-FOUND))
        )
        ;; 3. Logic continues only if unwrap succeeded
        (map-set owners new-owner current-owner)
        (ok true)
    )
)

```

## 3. Advanced: `unwrap-err!`

Sometimes you want to assert that something **failed**.
*Example:* Registering a username. You want to ensure `(bns-resolve ...)` returns an error (meaning the name is free). If it returns success (name taken), you want to exit.

```clarity
(define-public (register-name (name (string-ascii 20)))
    (begin
        ;; We EXPECT this to fail (return none or err).
        ;; If map-get returns 'some' (name exists), we EXIT with ERR-ALREADY-EXISTS.
        (unwrap-err! (map-get? names name) ERR-ALREADY-EXISTS)
        
        ;; If we are here, the name is free.
        (map-set names name tx-sender)
        (ok true)
    )
)

```

## 4. Cheat Sheet: The Unwrap Family

| Function | Behavior on Success (`some`/`ok`) | Behavior on Failure (`none`/`err`) | Use Case |
| --- | --- | --- | --- |
| `unwrap-panic` | Unpacks value | **CRASHES VM** | Debugging / Unreachable code. |
| `unwrap!` | Unpacks value | Returns **Custom Error** | **Standard production code.** |
| `unwrap-err!` | Returns **Custom Error** | Unpacks Error | Checking for non-existence (e.g., unique constraints). |
| `try!` | Unpacks value | Returns **Original Error** | Propagating errors from other contracts (`contract-call?`). |

## 5. Summary Checklist

* [ ] **No Panics:** Grep your codebase for `unwrap-panic`. Remove them all before mainnet deployment.
* [ ] **Error Constants:** Are your error codes defined at the top of the file?
* [ ] **Frontend Friendly:** Do your error codes mapping to UI messages (e.g., `u404` -> "Item not found")?

