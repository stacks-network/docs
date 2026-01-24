
# Module 22: Testing - Time-Dependent Logic (Vesting Schedules)

**Author:** @jadonamite
**Difficulty:** Intermediate
**Time:** 20 Minutes

Vesting contracts are the "Hello World" of time-based logic. They require precise calculations based on block heights. If your math is off by one block, a user might claim tokens too early or get stuck with dust that never unlocks.

In a live network, testing a 2-year vesting schedule is impossible. In Clarinet, it takes milliseconds. This module demonstrates how to write a robust test suite for linear vesting using `simnet.mineEmptyBlocks()` to warp through time.

## 1. The Scenario: Linear Vesting

We need a contract that:

1. Locks a principal's tokens.
2. Unlocks them linearly over `1000` blocks.
3. Allows claiming only *unlocked* amounts.

**Contract:** `contracts/vesting-wallet.clar`

```clarity
(define-constant ERR-NOTHING-TO-CLAIM (err u100))
(define-data-var start-height uint u0)
(define-data-var total-locked uint u10000)
(define-data-var total-claimed uint u0)
(define-constant DURATION u1000)

(define-public (initialize)
    (begin
        ;; Start vesting NOW
        (var-set start-height block-height)
        (ok true)
    )
)

(define-read-only (get-vested-amount)
    (let
        (
            (current-height block-height)
            (start (var-get start-height))
            (delta (if (> current-height start) (- current-height start) u0))
        )
        ;; Logic: Cap at DURATION
        (if (>= delta DURATION)
            (var-get total-locked)
            (/ (* (var-get total-locked) delta) DURATION)
        )
    )
)

(define-public (claim)
    (let
        (
            (vested (get-vested-amount))
            (claimed (var-get total-claimed))
            (claimable (- vested claimed))
        )
        (asserts! (> claimable u0) ERR-NOTHING-TO-CLAIM)
        
        ;; Update state
        (var-set total-claimed (+ claimed claimable))
        
        ;; Transfer (mocked)
        (print { event: "claim", amount: claimable })
        (ok claimable)
    )
)

```

## 2. The Test Suite: Warping Time

We will test three states: **Pre-Vesting** (0%), **Mid-Vesting** (50%), and **Post-Vesting** (100%).

**Test File:** `tests/vesting-wallet.test.ts`

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { Cl } from '@stacks/transactions';

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;

describe('Vesting Logic Tests', () => {

  // Reset check: Ensure contract is initialized
  it('initializes the schedule', () => {
    const res = simnet.callPublicFn('vesting-wallet', 'initialize', [], deployer);
    expect(res.result).toBeOk(Cl.bool(true));
  });

  it('calculates 0% vested at block 0', () => {
    // 1. Initialize
    simnet.callPublicFn('vesting-wallet', 'initialize', [], deployer);

    // 2. Check immediately (No blocks mined)
    const vested = simnet.callReadOnlyFn('vesting-wallet', 'get-vested-amount', [], deployer);
    
    // Expect 0
    expect(vested.result).toBeUint(0);
  });

  it('calculates 50% vested at half duration', () => {
    simnet.callPublicFn('vesting-wallet', 'initialize', [], deployer);

    // 1. TIME WARP: Advance 500 blocks (Duration is 1000)
    simnet.mineEmptyBlocks(500);

    // 2. Check Vested Amount
    const vested = simnet.callReadOnlyFn('vesting-wallet', 'get-vested-amount', [], deployer);
    
    // Expect 5000 (50% of 10,000)
    expect(vested.result).toBeUint(5000);

    // 3. Claim it
    const claim = simnet.callPublicFn('vesting-wallet', 'claim', [], deployer);
    expect(claim.result).toBeOk(Cl.uint(5000));
  });

  it('caps at 100% vested after duration exceeds', () => {
    simnet.callPublicFn('vesting-wallet', 'initialize', [], deployer);

    // 1. TIME WARP: Advance 2000 blocks (Way past 1000 limit)
    simnet.mineEmptyBlocks(2000);

    // 2. Check Vested Amount
    const vested = simnet.callReadOnlyFn('vesting-wallet', 'get-vested-amount', [], deployer);
    
    // Expect 10,000 (Cap)
    expect(vested.result).toBeUint(10000);
  });

  it('prevents double claims', () => {
    simnet.callPublicFn('vesting-wallet', 'initialize', [], deployer);
    
    // Fast forward to end
    simnet.mineEmptyBlocks(1000);

    // Claim 1 (Full amount)
    const claim1 = simnet.callPublicFn('vesting-wallet', 'claim', [], deployer);
    expect(claim1.result).toBeOk(Cl.uint(10000));

    // Claim 2 (Should be empty)
    const claim2 = simnet.callPublicFn('vesting-wallet', 'claim', [], deployer);
    expect(claim2.result).toBeErr(Cl.uint(100)); // ERR-NOTHING-TO-CLAIM
  });
});

```

## 3. Key Testing Concepts

* **`simnet.mineEmptyBlocks(n)`:** This is the magic function. It increments the chain tip. Note that in Unit Tests, this is instantaneous.
* **State Persistence:** In `vitest` `describe` blocks, the chain state *usually* resets between `it` blocks if configured, or persists if you use `beforeAll`. In standard Clarinet setups, each `it` is an isolated run starting from genesis unless you explicitly chain them. *The example above assumes isolation (re-initializing in every test).*

## 4. Summary Checklist

* **Block Math:** Did you verify exact block counts (e.g., `500` vs `501`)?
* **Capping:** Did you test the "Overflow" case where `current > total_duration`?
* **Double Spend:** Did you verify that `total-claimed` correctly reduces the claimable amount?

---

