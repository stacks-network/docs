# Module 2: Smart Contract Engineering

**Focus:** Writing secure Clarity code and mastering the Test-Driven Development (TDD) cycle with Clarinet.

We have our infrastructure running. Now, we write the logic. We will build a **"Time-Locked Vault"** contract. This is a classic "Hello World" for DeFi that demonstrates:

1. **Custody:** Holding funds in a contract.
2. **Time:** Using `block-height` (crucial in Nakamoto's faster block times).
3. **Access Control:** Ensuring only the owner can withdraw.
4. **Post-Conditions:** Preparing for the frontend integration.

---

## 1. Scaffolding the Contract

In your terminal, inside your project root:

```bash
clarinet contract new time-locked-vault

```

This creates:

* `contracts/time-locked-vault.clar` (The logic)
* `tests/time-locked-vault.test.ts` (The test suite)

## 2. The Clarity Implementation

Open `contracts/time-locked-vault.clar`. We will implement a vault where a user can deposit STX that are locked until a specific block height.

**Key Clarity Concept:** *Read-only* vs. *Public* functions.

* `define-public`: Callable from outside, changes state, returns `(ok ...)` or `(err ...)`.
* `define-read-only`: helper functions, free to call, does not change state.

```clarity
;; time-locked-vault.clar

;; 1. Constants & Error Codes
;; Good practice: Define explicit error codes for frontend debugging
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-ALREADY-LOCKED (err u101))
(define-constant ERR-NO-VALUE (err u102))
(define-constant ERR-UNLOCK-HEIGHT-NOT-REACHED (err u103))
(define-constant ERR-EMPTY-VAULT (err u104))

;; 2. Data Variables
;; Store the vault owner, unlock height, and total vault balance
(define-data-var vault-owner principal tx-sender)
(define-data-var unlock-height uint u0)

;; 3. Read-Only Functions
(define-read-only (get-vault-info)
    (ok {
        owner: (var-get vault-owner),
        unlock-height: (var-get unlock-height),
        balance: (stx-get-balance (as-contract tx-sender))
    })
)

(define-read-only (get-unlock-height)
    (ok (var-get unlock-height))
)

;; 4. Public Functions

;; lock: Users deposit STX and set a lock duration
;; @param amount: uint - Amount of uSTX to lock
;; @param duration: uint - Number of blocks to lock
(define-public (lock (amount uint) (duration uint))
    (let
        (
            (current-balance (stx-get-balance (as-contract tx-sender)))
            (caller tx-sender)
        )
        ;; Assertions
        ;; 1. Ensure the vault is currently empty (simple use case)
        (asserts! (is-eq current-balance u0) ERR-ALREADY-LOCKED)
        ;; 2. Ensure amount is positive
        (asserts! (> amount u0) ERR-NO-VALUE)
        
        ;; Update State
        (var-set vault-owner caller)
        (var-set unlock-height (+ block-height duration))
        
        ;; Transfer STX from Caller to Contract
        ;; NOTE: This requires a Post-Condition on the frontend!
        (stx-transfer? amount caller (as-contract tx-sender))
    )
)

;; claim: Owner withdraws funds after unlock height
(define-public (claim)
    (let
        (
            (caller tx-sender)
            (current-balance (stx-get-balance (as-contract tx-sender)))
        )
        ;; Assertions
        ;; 1. Only the owner can claim
        (asserts! (is-eq caller (var-get vault-owner)) ERR-NOT-AUTHORIZED)
        ;; 2. Is the time up?
        (asserts! (>= block-height (var-get unlock-height)) ERR-UNLOCK-HEIGHT-NOT-REACHED)
        ;; 3. Is there money?
        (asserts! (> current-balance u0) ERR-EMPTY-VAULT)

        ;; Transfer STX from Contract to Owner
        (as-contract (stx-transfer? current-balance tx-sender caller))
    )
)

```

## 3. Unit Testing with Clarinet SDK

In Stacks, we don't just "hope it works." We write TypeScript tests that simulate the chain.

Open `tests/time-locked-vault.test.ts`.

**Key Testing Concept:** `chain.mineBlock()` allows us to fast-forward time, which is impossible on a real testnet but essential for testing time-locks.

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { Cl } from '@stacks/transactions';

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;

describe('Time Locked Vault', () => {
  
  it('allows a user to lock STX', () => {
    // Call the 'lock' function
    const lockResponse = simnet.callPublicFn(
      'time-locked-vault',
      'lock',
      [
        Cl.uint(1000), // amount
        Cl.uint(50)    // duration (blocks)
      ],
      wallet1 // caller
    );

    // Assert: The call should return (ok true)
    expect(lockResponse.result).toBeOk(Cl.bool(true));

    // Assert: STX transfer event occurred
    expect(lockResponse.events).toHaveLength(1);
    const transferEvent = lockResponse.events[0].data as any;
    expect(transferEvent.amount).toBe("1000");
    expect(transferEvent.sender).toBe(wallet1);
  });

  it('prevents early withdrawal', () => {
    // 1. Setup: Lock funds first
    simnet.callPublicFn(
      'time-locked-vault', 
      'lock', 
      [Cl.uint(1000), Cl.uint(50)], 
      wallet1
    );

    // 2. Attempt: Claim immediately (Chain is at block 1)
    const claimResponse = simnet.callPublicFn(
      'time-locked-vault',
      'claim',
      [],
      wallet1
    );

    // Assert: Should fail with ERR-UNLOCK-HEIGHT-NOT-REACHED (u103)
    expect(claimResponse.result).toBeErr(Cl.uint(103));
  });

  it('allows withdrawal after time passes', () => {
    // 1. Setup: Lock funds
    simnet.callPublicFn(
      'time-locked-vault', 
      'lock', 
      [Cl.uint(1000), Cl.uint(50)], 
      wallet1
    );

    // 2. Action: Mine 51 empty blocks to pass the duration
    simnet.mineEmptyBlocks(51);

    // 3. Attempt: Claim
    const claimResponse = simnet.callPublicFn(
      'time-locked-vault',
      'claim',
      [],
      wallet1
    );

    // Assert: Success
    expect(claimResponse.result).toBeOk(Cl.bool(true));
  });
});

```

Run your tests:

```bash
clarinet test

```

## 4. Deployment (Devnet)

Now that tests pass, let's deploy to the `stacks-persistent-devnet` we built in Module 1.

1. Ensure your Docker devnet is running.
2. Deploy using the generated deployment plan.

```bash
clarinet deployment apply --devnet

```

If successful, Clarinet will output the transaction ID and the contract address (usually `ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.time-locked-vault`).

---

