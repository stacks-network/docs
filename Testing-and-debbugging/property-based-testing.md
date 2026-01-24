# Module 21: Testing - Property-Based Testing (Fuzzing)

**Author:** @jadonamite
**Difficulty:** Advanced
**Time:** 20 Minutes

Unit tests are great, but they suffer from **"The Happy Path Bias."** You verify that `10 + 10 = 20`, but you forget to check what happens when the input is `MAX_UINT` or `0`.

**Property-Based Testing (Fuzzing)** flips the script. Instead of writing specific examples, you define **Invariants**—truths that must *always* be valid regardless of the input. Then, you use a tool to blast your contract with thousands of random inputs to try and break those truths.

In the Clarinet JS SDK, we can use the library **`fast-check`** to implement this.

## 1. The Setup

First, install the fuzzing library in your project.

```bash
npm install fast-check --save-dev

```

## 2. The Scenario: "Conservation of Funds"

We have a contract that splits a payment equally among 3 recipients.
**The Invariant:** `Total Sent = (Received * 3) + Remainder`.
If this equation ever fails, money has been created or destroyed (a critical bug).

**Contract:** `contracts/splitter.clar`

```clarity
(define-public (split-transfer (total-amount uint) (user-a principal) (user-b principal) (user-c principal))
    (let
        (
            (share (/ total-amount u3))
            (sender tx-sender)
        )
        ;; Transfer to A, B, C
        (try! (stx-transfer? share sender user-a))
        (try! (stx-transfer? share sender user-b))
        (try! (stx-transfer? share sender user-c))
        
        ;; Remainder stays with sender automatically? 
        ;; No, the logic is: Sender Balance decreases by (share * 3).
        (ok true)
    )
)

```

## 3. The Property-Based Test

We will write a test that generates random `uint` values (from 0 to huge numbers) and random principals, running the logic 100 times per test run.

**Test File:** `tests/splitter.fuzz.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { Cl } from '@stacks/transactions';
import fc from 'fast-check'; // Import the fuzzer

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallets = [
  accounts.get("wallet_1")!,
  accounts.get("wallet_2")!,
  accounts.get("wallet_3")!
];

describe('Splitter Fuzz Tests', () => {

  it('preserves conservation of mass for any amount', () => {
    // Define the Property: 
    // "For any random amount and random users, the math holds up."
    fc.assert(
      fc.property(
        // 1. Generators: Create random inputs
        fc.nat({ max: 1000000000 }), // Random uint up to 1B
        fc.integer({ min: 0, max: 2 }), // Random index for user A
        fc.integer({ min: 0, max: 2 }), // Random index for user B
        fc.integer({ min: 0, max: 2 }), // Random index for user C
        
        (amount, idxA, idxB, idxC) => {
          // Setup Principals
          const userA = wallets[idxA];
          const userB = wallets[idxB];
          const userC = wallets[idxC];
          
          // 2. Execution
          // We must ensure the sender has enough funds first!
          // In Simnet, deployer usually has infinite/high funds.
          const res = simnet.callPublicFn(
            'splitter',
            'split-transfer',
            [
              Cl.uint(amount),
              Cl.standardPrincipal(userA),
              Cl.standardPrincipal(userB),
              Cl.standardPrincipal(userC)
            ],
            deployer
          );

          // 3. Verification
          // We expect SUCCESS for valid transfers
          expect(res.result).toBeOk(Cl.bool(true));

          // Calculate Shares Logic in JS (The Oracle)
          const share = Math.floor(amount / 3);
          const totalTransferred = share * 3;
          const remainder = amount - totalTransferred;

          // Check Events: Did exactly 3 transfers happen?
          const events = res.events;
          expect(events.length).toBe(3);
          
          // Check Amounts: Each transfer MUST be exactly 'share'
          events.forEach(event => {
             expect(event.data.amount).toBe(share.toString());
          });
          
          // The Invariant: Did we accidentally send the remainder? 
          // If the sum of events > totalTransferred, we have a bug.
          const sumEvents = events.reduce((acc, e) => acc + parseInt(e.data.amount), 0);
          expect(sumEvents).toBe(totalTransferred);
        }
      ),
      { numRuns: 100 } // How many times to fuzz?
    );
  });
});

```

## 4. Why this matters?

If we had written this manually, we might have tested `amount = 300` (easy, `100` each).
But the Fuzzer might try `amount = 1`.

* `share = 1 / 3 = 0`.
* `totalTransferred = 0`.
* Events: `0 STX` sent.
* Does the contract allow 0 STX transfers? Yes.
* Does the logic break? No, but now we *know* it behaves correctly for small remainders.

If the fuzzer tries `amount = MAX_UINT`, we verify we don't hit an overflow panic (though Clarity protects against overflow by default, your logic might not).

## 5. Summary Checklist

* [ ] **Invariants Defined:** Did you identify a mathematical truth (e.g., `Input = Output`)?
* [ ] **Generator Constraints:** Did you limit the random inputs to realistic bounds (e.g., `nat` instead of `integer` to avoid negatives)?
* [ ] **Iterations:** Is `numRuns` high enough to catch edge cases (default is usually 100)?

