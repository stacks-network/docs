---
description: >-
  Learn how to test your Clarity smart contracts thoroughly using Rendezvous 
  property-based testing.
---

# Quickstart Tutorial

This tutorial walks you through testing a DeFi lending contract with Rendezvous. You’ll see how Rendezvous uncovers subtle vulnerabilities that traditional unit tests might miss, and learn how to design property-based tests that help expose real bugs.

## What You'll Learn

You will test a simplified DeFi lending contract that allows users to deposit STX and borrow against those deposits. This contract hides a subtle bug that passes all example-based tests, but fails when running Rendezvous property-based testing.

You’ll learn to:

- Write property-based tests directly in Clarity
- Catch real vulnerabilities using randomized, stateful test runs
- Replay and fix failing test sequences deterministically

> Note: This example is adapted from the [stx-defi](https://github.com/hirosystems/clarity-examples/blob/ccd9ecf0bf136d7f28ef116706ed2936f6d8781a/examples/stx-defi/contracts/stx-defi.clar) contract in the [hirosystems/clarity-examples](https://github.com/hirosystems/clarity-examples) repository.

## Prerequisites

Before you begin, make sure you have:

- Node.js (version >= 20)
- Clarinet installed ([installation guide](https://github.com/stx-labs/clarinet))

## Step 1: Create a New Clarinet Project

Open your terminal and create a new Clarinet project:

```bash
clarinet new rendezvous-tutorial
cd rendezvous-tutorial
```

This creates a new directory with the basic Clarinet structure:

```
rendezvous-tutorial/
├── Clarinet.toml
├── contracts/
├── settings/
│   └── Devnet.toml
└── tests/
```

## Step 2: Add Rendezvous

Add Rendezvous to your project:

```bash
npm install @stacks/rendezvous
```

Verify the installation:

```bash
npx rv --help
```

## Step 3: Add the Lending Contract

Add a new contract to the Clarinet project:

```bash
clarinet contract new stx-defi
```

Open `contracts/stx-defi.clar` and add this Clarity code:

```clarity
;; stx-defi.clar
;; A simplified DeFi lending protocol.

(define-map deposits
  { owner: principal }
  { amount: uint }
)

(define-map loans
  principal
  { amount: uint }
)

(define-constant err-overborrow (err u300))

(define-public (deposit (amount uint))
  (let
    (
      (current-balance
        (default-to u0 (get amount (map-get? deposits { owner: tx-sender })))
      )
    )
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
    (map-set deposits
      { owner: tx-sender }
      { amount: (+ current-balance amount) }
    )
    (ok true)
  )
)

(define-public (borrow (amount uint))
  (let
    (
      (user-deposit
        (default-to u0 (get amount (map-get? deposits { owner: tx-sender })))
      )
      (allowed-borrow (/ user-deposit u2))
      (current-loan
        (default-to u0 (get amount (map-get? loans tx-sender)))
      )
      (new-loan (+ amount))
    )
    (asserts! (<= new-loan allowed-borrow) err-overborrow)
    (let
      ((recipient tx-sender))
      (try! (as-contract (stx-transfer? amount tx-sender recipient)))
    )
    (map-set loans tx-sender { amount: new-loan })
    (ok true)
  )
)

(define-read-only (get-loan-amount)
  (ok (default-to u0 (get amount (map-get? loans tx-sender))))
)
```

**What this contract does:**

- Users can `deposit` STX into the protocol
- Users can `borrow` up to 50% of their deposit value
- The contract tracks deposits and loans for each user

## Step 4: Write Some Unit Tests

Let's first write some example-based unit tests.

Open `tests/stx-defi.test.ts` and add these example-based unit tests:

```typescript
describe("stx-defi unit tests", () => {
  it("can deposit", () => {
    const amountToDeposit = 1000;

    const { result } = simnet.callPublicFn(
      "stx-defi",
      "deposit",
      [Cl.uint(amountToDeposit)],
      address1
    );

    expect(result).toBeOk(Cl.bool(true));
  });

  it("can borrow half of deposit", () => {
    const amountToDeposit = 1000;
    const amountToBorrow = 500;

    const { result: depositResult } = simnet.callPublicFn(
      "stx-defi",
      "deposit",
      [Cl.uint(amountToDeposit)],
      address1
    );
    expect(depositResult).toBeOk(Cl.bool(true));

    const { result } = simnet.callPublicFn(
      "stx-defi",
      "borrow",
      [Cl.uint(amountToBorrow)],
      address1
    );

    expect(result).toBeOk(Cl.bool(true));
  });

  it("loan amount is correct", () => {
    const amountToDeposit = 1000;
    const amountToBorrow = 500;

    simnet.callPublicFn(
      "stx-defi",
      "deposit",
      [Cl.uint(amountToDeposit)],
      address1
    );

    simnet.callPublicFn(
      "stx-defi",
      "borrow",
      [Cl.uint(amountToBorrow)],
      address1
    );

    const { result } = simnet.callReadOnlyFn(
      "stx-defi",
      "get-loan-amount",
      [],
      address1
    );

    expect(result).toBeOk(Cl.uint(amountToBorrow));
  });

  it("cannot borrow more than half of deposit", () => {
    const amountToDeposit = 1000;
    const amountToBorrow = 501;

    simnet.callPublicFn(
      "stx-defi",
      "deposit",
      [Cl.uint(amountToDeposit)],
      address1
    );

    const { result } = simnet.callPublicFn(
      "stx-defi",
      "borrow",
      [Cl.uint(amountToBorrow)],
      address1
    );

    // err-overborrow
    expect(result).toBeErr(Cl.uint(300));
  });
});
```

Install dependencies and run the tests:

```bash
npm install
npm test
```

**Looking good!** ✅ (or so it seems...)

The main functions and state of the contract are now covered by tests. Line coverage is probably high as well. Looks great, right? But here's the thing: example-based tests only verify the examples you thought of. Let's see if the contract holds up under **Rendezvous property-based testing**.

## Step 5: Add Rendezvous Property-Based Tests

Rendezvous lets you test a broader range of inputs, not just specific examples. Let's see how to write your first property-based test and why it matters.

### Add an Ice-Breaker Test

Before writing any meaningful properties, it's a good idea to check that Rendezvous can run. Add a simple "always-true" test, annotated with `#[env(simnet)]`, to the end of `contracts/stx-defi.clar`:

```clarity
;; #[env(simnet)]
(define-private (test-always-true)
  (ok true)
)
```

Check if Rendezvous can execute the test:

```bash
npx rv . stx-defi test
```

Expected output:

```
$ npx rv . stx-defi test
Using manifest path: Clarinet.toml
Target contract: stx-defi

Starting property testing type for the stx-defi contract...

₿        1 Ӿ        3   deployer [PASS] stx-defi test-always-true  (ok true)
₿        1 Ӿ        4   wallet_5 [PASS] stx-defi test-always-true  (ok true)
₿       11 Ӿ       15   wallet_1 [PASS] stx-defi test-always-true  (ok true)
₿      690 Ӿ      695   wallet_1 [PASS] stx-defi test-always-true  (ok true)
...
₿    12348 Ӿ    12447   wallet_3 [PASS] stx-defi test-always-true  (ok true)
₿    12348 Ӿ    12448   wallet_3 [PASS] stx-defi test-always-true  (ok true)
₿    12357 Ӿ    12458   wallet_5 [PASS] stx-defi test-always-true  (ok true)

OK, properties passed after 100 runs.


EXECUTION STATISTICS

│ PROPERTY TEST CALLS
│
├─ + PASSED
│    └─ test-always-true: x100
│
├─ ! DISCARDED
│    └─ test-always-true: x0
│
└─ - FAILED
     └─ test-always-true: x0

LEGEND:

  PASSED    properties verified for given inputs
  DISCARDED skipped due to invalid preconditions
  FAILED    property violations or unexpected behavior
```

If you see similar output, your setup works. You're ready to write a **real property-based test**.

### Define a Borrowing Property

You want to test that **borrowing always updates the loan amount correctly**. Add this to the end of `contracts/stx-defi.clar`:

```clarity
;; #[env(simnet)]
;; Property: Borrowing should always update the loan amount correctly.
;; The new loan amount should equal the old loan amount plus the borrowed
;; amount.
(define-private (test-borrow (amount uint))
  (let (
      ;; Record the loan amount before performing any action that would end up
      ;; changing the internal state of the smart contract. Query the loans map
      ;; for the selected tx-sender and store the result in the initial-loan
      ;; local variable.
      (initial-loan (default-to u0 (get amount (map-get? loans tx-sender))))
    )
    ;; Since the initial-loan is recorded before the borrow call, you can now
    ;; call the borrow function to allow checking the effects after the call.
    (try! (borrow amount))
    ;; Verify the property: updated loan = initial loan + borrowed amount
    (asserts!
      (is-eq (default-to u0 (get amount (map-get? loans tx-sender)))
        (+ initial-loan amount)
      )
      (err u999) ;; any error code to identify the test failure.
    )
    (ok true)
  )
)
```

> At this stage, **the test will likely fail**. This is an important learning moment: Rendezvous runs your tests in a **stateful, randomized environment** that simulates real contract interactions.

### How Rendezvous Executes Property Tests

Rendezvous:

1. Deploys the contract with all `#[env(simnet)]`-annotated test functions included.
2. Detects all private `test-*` functions automatically.
3. Generates a random sequence to call each test.
4. Produces random argument values for each function parameter.
5. Randomly selects senders from settings/Devnet.toml.
6. Randomly advances Bitcoin and Stacks block heights during testing.
7. Accumulates state across test calls instead of resetting each time.
8. Discards test cases where preconditions fail, returning (ok false).

This design allows you to test your contract in **realistic, varied scenarios** that a simple/example-based unit test could never reach.

### Why the First Test Fails

The test likely failed because the `borrow` call failed—the contract wasn't in a suitable state. Rendezvous allows you to discard test cases when preconditions aren't met (wrong state, invalid arguments, caller, height, etc.). In our case, `borrow` will fail for one of these reasons:

- no deposits were made
- the generated amount argument is non-positive (u0)
- the generated amount argument is more than the allowed borrow value

To fix this, you need to **simulate deposits** and add **discard logic**.

Let's address them one by one.

### Handle Preconditions

**First, you need deposits.** You can create a helper function that Rendezvous will pick up during property-based testing runs. Add this to `contracts/stx-defi.clar`:

```clarity
;; #[env(simnet)]
;; This is a helper function that will eventually be picked up during
;; property-based-testing runs. It allows creating deposits in the smart
;; contract so other tests can check properties requiring a deposit.
(define-private (test-deposit-helper (amount uint))
  (let (
      ;; Call the deposit function and ignore the result.
      (deposit-result (deposit amount))
    )
    (ok true)
  )
)
```

**Next, add discard logic to the borrow test.** A test is discarded when it returns `(ok false)`. Replace the previous `test-borrow` with this version that checks for invalid preconditions (the three cases listed above) and returns `(ok false)` to discard those cases:

```clarity
;; #[env(simnet)]
;; Property: Borrowing should always update the loan amount correctly.
;; The new loan amount should equal the old loan amount plus the borrowed
;; amount.
(define-private (test-borrow (amount uint))
  (if (or
      ;; If amount is 0, the STX transfer performed in the borrow operation
      ;; would fail, resulting in a false negative.
      (is-eq amount u0)
      ;; If the amount to borrow would exceed the allowed limit defined in the
      ;; borrow function, the borrow operation would fail, resulting in a false
      ;; negative.
      (> (+ (default-to u0 (get amount (map-get? loans tx-sender))) amount)
        (/ (default-to u0 (get amount (map-get? deposits { owner: tx-sender })))
          u2
        ))
    )
    ;; Discard the test if preconditions aren't met.
    (ok false)
    ;; Run the test.
    (let ((initial-loan (default-to u0 (get amount (map-get? loans tx-sender)))))
      (unwrap! (borrow amount) (err "Borrow call failed"))
      (let ((updated-loan (default-to u0 (get amount (map-get? loans tx-sender)))))
        ;; Verify the property: new loan = old loan + borrowed amount
        (asserts! (is-eq updated-loan (+ initial-loan amount))
          (err "Loan amount not updated correctly")
        )
        (ok true)
      )
    )
  )
)
```

The test discards invalid cases: when `amount` is `u0`, or when the new total loan would exceed half the deposit (which also covers cases with no deposits).

> Now the test only runs when valid preconditions are met.

### Run Rendezvous and Catch the Bug

Start a new property-based testing run:

```bash
npx rv . stx-defi test
```

Rendezvous will probably catch the bug in the very first run, showing output like this:

```
$ npx rv . stx-defi test
Using manifest path: Clarinet.toml
Target contract: stx-defi

Starting property testing type for the stx-defi contract...

₿        1 Ӿ        3   wallet_7 [PASS] stx-defi test-deposit-helper 2 (ok true)
₿     1001 Ӿ     1004   wallet_7 [WARN] stx-defi test-borrow 2015589496 (ok false)
₿     1001 Ӿ     1005   wallet_8 [PASS] stx-defi test-deposit-helper 2147483636 (ok true)
₿     1898 Ӿ     1903   wallet_6 [WARN] stx-defi test-borrow 1984339073 (ok false)
₿     1898 Ӿ     1904   deployer [PASS] stx-defi test-deposit-helper 195930186 (ok true)
₿     1898 Ӿ     1905   wallet_2 [PASS] stx-defi test-deposit-helper 13 (ok true)
...
₿     3464 Ӿ     3485   deployer [PASS] stx-defi test-borrow 28 (ok true)
₿     3468 Ӿ     3490   wallet_1 [WARN] stx-defi test-borrow 25 (ok false)
₿     3468 Ӿ     3491   wallet_8 [FAIL] stx-defi test-borrow 11 (err "Loan amount not updated correctly")
₿     3468 Ӿ     3492   wallet_1 [PASS] stx-defi test-deposit-helper 1653600941 (ok true)
₿     4058 Ӿ     4083   wallet_8 [PASS] stx-defi test-deposit-helper 1653600941 (ok true)
₿     4058 Ӿ     4084   wallet_8 [WARN] stx-defi test-borrow 1653600941 (ok false)
₿     4058 Ӿ     4085   wallet_8 [WARN] stx-defi test-borrow 0 (ok false)
₿     4058 Ӿ     4086   wallet_8 [FAIL] stx-defi test-borrow 6 (err "Loan amount not updated correctly")
₿     4058 Ӿ     4087   wallet_8 [FAIL] stx-defi test-borrow 3 (err "Loan amount not updated correctly")
₿     4058 Ӿ     4088   wallet_8 [FAIL] stx-defi test-borrow 2 (err "Loan amount not updated correctly")
₿     4058 Ӿ     4089   wallet_8 [FAIL] stx-defi test-borrow 1 (err "Loan amount not updated correctly")
₿     4058 Ӿ     4090   wallet_8 [WARN] stx-defi test-borrow 0 (ok false)
₿     4058 Ӿ     4091   wallet_8 [FAIL] stx-defi test-borrow 1 (err "Loan amount not updated correctly")
₿     4058 Ӿ     4092   wallet_8 [WARN] stx-defi test-borrow 0 (ok false)
₿     4058 Ӿ     4093   wallet_8 [FAIL] stx-defi test-borrow 1 (err "Loan amount not updated correctly")

Error: Property failed after 22 tests.
Seed : 1880056597

Counterexample:
- Test Contract : stx-defi
- Test Function : test-borrow (private)
- Arguments     : [1]
- Caller        : wallet_8
- Outputs       : {"type":{"response":{"ok":"bool","error":{"string-ascii":{"length":33}}}}}

What happened? Rendezvous went on a rampage and found a weak spot:

The test function "test-borrow" returned:

(err "Loan amount not updated correctly")

EXECUTION STATISTICS

│ PROPERTY TEST CALLS
│
├─ + PASSED
│    ├─ test-borrow: x2
│    └─ test-deposit-helper: x13
│
├─ ! DISCARDED
│    ├─ test-borrow: x12
│    └─ test-deposit-helper: x0
│
└─ - FAILED
     ├─ test-borrow: x7
     └─ test-deposit-helper: x0

LEGEND:

  PASSED    properties verified for given inputs
  DISCARDED skipped due to invalid preconditions
  FAILED    property violations or unexpected behavior

! FAILED tests indicate that your function properties don't hold for all inputs. Review the counterexamples above for debugging.
```

The output shows a failure: `(err "Loan amount not updated correctly")`. The contract isn't tracking loan amounts correctly.

> **Note:** The output includes a seed (`1880056597`) you can use to reproduce this exact sequence.

You can also stop at the first failure:

```bash
npx rv . stx-defi test --bail
```

## Step 6: Identify and Fix the Borrow Bug

After taking a closer look at the lending contract, the bug is in this line of the `borrow` function:

```clarity
(new-loan (+ amount))
```

Change the line to correctly accumulate loans:

```clarity
(new-loan (+ current-loan amount))
```

### Re-run Rendezvous with the Same Seed

Re-run with the same seed, to find out if you completely fixed the bug for that random sequence of events:

```clarity
npx rv . stx-defi test --seed=1880056597
```

Output:

```
$ npx rv . stx-defi test --seed=1880056597
Using manifest path: Clarinet.toml
Target contract: stx-defi
Using seed: 1880056597

Starting property testing type for the stx-defi contract...

₿        1 Ӿ        3   wallet_7 [PASS] stx-defi test-deposit-helper 2 (ok true)
₿     1001 Ӿ     1004   wallet_7 [WARN] stx-defi test-borrow 2015589496 (ok false)
₿     1001 Ӿ     1005   wallet_8 [PASS] stx-defi test-deposit-helper 2147483636 (ok true)
₿     1898 Ӿ     1903   wallet_6 [WARN] stx-defi test-borrow 1984339073 (ok false)
₿     1898 Ӿ     1904   deployer [PASS] stx-defi test-deposit-helper 195930186 (ok true)
₿     1898 Ӿ     1905   wallet_2 [PASS] stx-defi test-deposit-helper 13 (ok true)
...
₿    17291 Ӿ    17388   wallet_4 [PASS] stx-defi test-borrow 708340522 (ok true)
₿    17291 Ӿ    17389   wallet_4 [PASS] stx-defi test-deposit-helper 589199221 (ok true)
₿    17565 Ӿ    17664   wallet_2 [PASS] stx-defi test-deposit-helper 2147483627 (ok true)
₿    18559 Ӿ    18659   wallet_8 [PASS] stx-defi test-borrow 1622181282 (ok true)
₿    18559 Ӿ    18660   wallet_3 [PASS] stx-defi test-deposit-helper 2147483630 (ok true)

OK, properties passed after 100 runs.
```

> The bug is fixed! The contract now correctly tracks cumulative loans.

### Run Multiple Random Sequences

Test additional random sequences (each run generates a new random sequence):

```bash
npx rv . stx-defi test
```

Run more tests to increase confidence (default is 100 runs):

```bash
npx rv . stx-defi test --runs=1000
```

**Rendezvous caught the bug and you successfully fixed it!** 🎯

## Step 7: Understand the Bug

**What was the bug?**

Rendezvous discovered that when a user borrows multiple times, only the most recent borrow amount is recorded.

The bug means the contract doesn't track cumulative borrows correctly. When a user borrows multiple times, only the most recent borrow amount is recorded, not the total. The existing loan amount (`current-loan`) is completely ignored!

**Why did example-based unit tests miss this?**

The unit tests passed because they only tested single borrow scenarios. Look back at the unit test:

```typescript
it("loan amount is correct after single borrow", () => {
  // Only ONE borrow call - bug not triggered!
  simnet.callPublicFn(
    "stx-defi",
    "borrow",
    [Cl.uint(amountToBorrow)],
    address1
  );
  // ...
});
```

When there's only one borrow, `(+ amount)` and `(+ current-loan amount)` produce the same result because the initial loan is `u0`.

**Rendezvous caught the bug by:**

1. Randomly generating test sequences
2. Calling `borrow` multiple times with different amounts
3. Verifying the property holds for ALL sequences

This is the power of using Rendezvous!

## What You Learned

You've successfully:

✅ Created a simple DeFi lending contract

✅ Wrote traditional unit tests that passed but missed a critical bug

✅ Wrote your first Rendezvous property-based test

✅ Discovered how Rendezvous catches bugs through random stateful testing

✅ Fixed the bug and verified the fix

✅ Understood the difference between stateless example-based and stateful property-based testing

## The Key Insight

**Example-based tests check specific examples. Property-based tests check a much broader range of inputs.**

Example-based tests ask:

- "Does this work for input A?"
- "Does this work for input B?"

Property-based tests ask:

- "Does this ALWAYS work?"
- "Can I find ANY input that breaks this?"

Rendezvous explores your contract's state space automatically, finding edge cases you might never think to test manually.

## Real-World Impact

This bug in a production DeFi protocol would allow users to:

1. Deposit 1000 STX
2. Borrow 500 STX (maximum allowed)
3. Borrow another 500 STX (should fail, but succeeds due to bug)
4. Total borrowed: 1000 STX with only 500 STX recorded
5. User only needs to repay 500 STX despite borrowing 1000 STX

This would drain the protocol's funds — a critical vulnerability caught by Rendezvous in seconds.

## Example Implementation

You can see a complete step-by-step implementation of this tutorial with commit-by-commit progress in the [rendezvous-tutorial repository](https://github.com/BowTiedRadone/rendezvous-tutorial) ([view commits](https://github.com/BowTiedRadone/rendezvous-tutorial/commits/master/)).

## Next Steps

Now that you understand the power of Rendezvous, explore:

- **More examples**: Study other smart contracts in the [Examples Chapter](https://stx-labs.github.io/rendezvous/chapter_8.html) of the [Rendezvous Docs](https://stx-labs.github.io/rendezvous/)
- **Your own contracts**: Apply Rendezvous to your projects and find bugs before they reach production

---

## Get Involved

**Found this tutorial useful?** Star the [Rendezvous repository on GitHub](https://github.com/stx-labs/rendezvous) to show your support!

Have questions, found a bug, or want to contribute? We'd love to hear from you:

- **Open an issue** on [GitHub](https://github.com/stx-labs/rendezvous/issues)
- **Reach out** with questions or feedback
- **Share your findings** — contribute examples of bugs you've caught to show others how powerful advanced testing techniques can be
