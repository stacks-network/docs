# Module 11: Security - `contract-caller` vs `tx-sender`

**Author:** @jadonamite
**File Name:** `contracts/secure-vault.clar`
**Difficulty:** Intermediate
**Time:** 15 Minutes

One of the most dangerous and common pitfalls for new Clarity developers is misunderstanding the difference between `tx-sender` and `contract-caller`.

If you use `tx-sender` for authorization checks without understanding its scope, you open your contract to **Phishing / Man-in-the-Middle attacks**. A malicious contract can trick a user into signing a transaction that unwittingly executes a function in *your* contract.

This module explains the "Unsafe Delegate" vulnerability and how to fix it using strict `contract-caller` checks.

## 1. The Definitions

* **`tx-sender`**: The principal who **signed** the original transaction. This value *propagates* through every contract call in the chain.
* *Analogy:* The person who signed the check.


* **`contract-caller`**: The principal who invoked the **current** function. This changes with every hop.
* *Analogy:* The person handing the check to the teller.



## 2. The Vulnerability: The "Confused Deputy"

Imagine a Vault contract that holds a user's funds.

### ❌ The Vulnerable Code (`contracts/vulnerable-vault.clar`)

```clarity
(define-data-var vault-owner principal tx-sender)

(define-public (withdraw (amount uint))
    ;; BAD AUTH CHECK
    ;; We only check if the original signer is the owner.
    (if (is-eq tx-sender (var-get vault-owner))
        (as-contract (stx-transfer? amount tx-sender (var-get vault-owner)))
        (err u100)
    )
)

```

### The Attack Scenario

1. **Attacker** deploys a malicious contract: `Malicious-Game`.
```clarity
(define-public (play-game)
    ;; Secretly calls the vault withdraw function
    (contract-call? .vulnerable-vault withdraw u1000000)
)

```


2. **User (Victim)** sees a shiny "Play Game" button on a website.
3. **User** signs a transaction calling `Malicious-Game`.
4. **Execution Flow:**
* `Malicious-Game` calls `vulnerable-vault`.
* Inside `vulnerable-vault`:
* `tx-sender` is **User** (The Victim).
* `vault-owner` is **User**.
* Check: `(is-eq tx-sender vault-owner)` -> **TRUE**.




5. **Result:** The Vault sends the money. The user has been phished.

## 3. The Fix: Enforcing Direct Access

To prevent this, we must ensure that the User is calling the Vault *directly*, not through a middleman.

### ✅ The Secure Code (`contracts/secure-vault.clar`)

```clarity
(define-data-var vault-owner principal tx-sender)

(define-public (withdraw (amount uint))
    (begin
        ;; SECURE AUTH CHECK
        ;; 1. Check if the signer is the owner
        (asserts! (is-eq tx-sender (var-get vault-owner)) (err u100))
        
        ;; 2. CRITICAL: Check if the immediate caller is ALSO the signer
        ;; This ensures no contract sits in the middle.
        (asserts! (is-eq contract-caller tx-sender) (err u101))

        (as-contract (stx-transfer? amount tx-sender (var-get vault-owner)))
    )
)

```

**Why this works:**
In the attack scenario:

* `tx-sender` = User
* `contract-caller` = `Malicious-Game`
* Check: `(is-eq contract-caller tx-sender)` -> `(is-eq Malicious-Game User)` -> **FALSE**.
* The transaction fails.

## 4. Advanced: safe-traits (Whitelisting)

Sometimes you *want* other contracts to call your function (e.g., a legitimate Swap router). In this case, you cannot strictly enforce `contract-caller == tx-sender`.

Instead, you allowlist the authorized `contract-caller`.

```clarity
(define-map authorized-callers principal bool)

(define-public (withdraw-via-router (amount uint))
    (begin
        ;; Allow if DIRECT call OR if caller is APPROVED
        (asserts! 
            (or 
                (is-eq contract-caller tx-sender)
                (default-to false (map-get? authorized-callers contract-caller))
            )
            (err u103)
        )
        ;; ... logic ...
    )
)

```

## 5. Summary Checklist

* [ ] **Direct User Actions:** Always use `(asserts! (is-eq contract-caller tx-sender) ...)` for sensitive functions (withdrawals, admin changes).
* [ ] **Contract Integrations:** If you expect contract interop, use a whitelist or `trait` verification, never blind trust in `tx-sender`.
* [ ] **Post-Conditions:** Remember that Post-Conditions (on the frontend) are the final safety net, but the Contract logic must be secure independently.

---
