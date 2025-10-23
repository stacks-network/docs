# Integration Testing

Integration testing connects multiple contracts and workflows to ensure the entire system behaves correctly. The Clarinet JS SDK lets you simulate complex scenarios and interactions across contracts.

## What you'll learn

* Set up integration tests for multi-step workflows
* Test contract interactions and dependencies
* Simulate real-world scenarios
* Verify system-wide state changes

## Set up your project

Create a new Clarinet project and install dependencies:

```bash
clarinet new stx-defi
cd stx-defi
npm install
```

## Create the enhanced contract

We'll use an enhanced DeFi contract that supports both deposits and borrowing. Create the contract:

```bash
clarinet contract new defi
```

Replace `contracts/defi.clar` with this enhanced version:

```clarity
;; Error constants
(define-constant err-overborrow (err u300))

;; Interest rate (10%)
(define-data-var loan-interest-rate uint u10)

;; Total deposits in the contract
(define-data-var total-deposits uint u0)

;; User deposits
(define-map deposits { owner: principal } { amount: uint })

;; User loans
(define-map loans principal { amount: uint, last-interaction-block: uint })

;; Deposit STX into the contract
(define-public (deposit (amount uint))
  (let
    (
      (current-balance (default-to u0 (get amount (map-get? deposits { owner: tx-sender }))))
    )
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
    (map-set deposits { owner: tx-sender } { amount: (+ current-balance amount) })
    (var-set total-deposits (+ (var-get total-deposits) amount))
    (ok true)
  )
)

;; Borrow STX based on deposits (up to 50% of deposit)
(define-public (borrow (amount uint))
  (let
    (
      (user-deposit (default-to u0 (get amount (map-get? deposits { owner: tx-sender }))))
      (allowed-borrow (/ user-deposit u2))
      (current-loan-details (default-to { amount: u0, last-interaction-block: u0 }
                            (map-get? loans tx-sender)))
      (accrued-interest (calculate-accrued-interest
                         (get amount current-loan-details)
                         (get last-interaction-block current-loan-details)))
      (total-due (+ (get amount current-loan-details) (unwrap-panic accrued-interest)))
      (new-loan (+ amount))
    )
    (asserts! (<= new-loan allowed-borrow) err-overborrow)
    (try! (as-contract (stx-transfer? amount tx-sender tx-sender)))
    (map-set loans tx-sender { amount: new-loan, last-interaction-block: block-height })
    (ok true)
  )
)

;; Get user's balance
(define-read-only (get-balance-by-sender)
  (ok (map-get? deposits { owner: tx-sender }))
)

;; Get amount owed including interest
(define-read-only (get-amount-owed)
  (let
    (
      (current-loan-details (default-to { amount: u0, last-interaction-block: u0 }
                            (map-get? loans tx-sender)))
      (accrued-interest (calculate-accrued-interest
                         (get amount current-loan-details)
                         (get last-interaction-block current-loan-details)))
      (total-due (+ (get amount current-loan-details) (unwrap-panic accrued-interest)))
    )
    (ok total-due)
  )
)

;; Calculate interest
(define-private (calculate-accrued-interest (principal uint) (start-block uint))
  (let
    (
      (elapsed-blocks (- block-height start-block))
      (interest (/ (* principal (var-get loan-interest-rate) elapsed-blocks) u10000))
    )
    (asserts! (not (is-eq start-block u0)) (ok u0))
    (ok interest)
  )
)
```

Run `clarinet check` to ensure your contract is valid:

```bash
clarinet check
```

## Write integration tests

Create a test that simulates a complete user workflow - depositing and then borrowing:

```ts
import { describe, it, expect } from 'vitest';
import { Cl } from '@stacks/transactions';

const accounts = simnet.getAccounts();
const wallet1 = accounts.get('wallet_1')!;

describe('stx-defi integration', () => {
  it('allows deposit and borrow workflow', () => {
    // Step 1: User deposits STX
    const depositResult = simnet.callPublicFn(
      'defi',
      'deposit',
      [Cl.uint(1000)],
      wallet1
    );
    expect(depositResult.result).toBeOk(Cl.bool(true));

    // Verify deposit was recorded
    const totalDeposits = simnet.getDataVar('defi', 'total-deposits');
    expect(totalDeposits).toBeUint(1000);

    // Step 2: User borrows against deposit
    const borrowResult = simnet.callPublicFn(
      'defi',
      'borrow',
      [Cl.uint(400)], // Borrowing 40% of deposit
      wallet1
    );
    expect(borrowResult.result).toBeOk(Cl.bool(true));

    // Step 3: Check amount owed
    const { result } = simnet.callReadOnlyFn(
      'defi',
      'get-amount-owed',
      [],
      wallet1
    );
    expect(result).toBeOk(Cl.uint(400)); // No interest yet at same block
  });

  it('prevents over-borrowing', () => {
    // Setup: deposit first
    simnet.callPublicFn('defi', 'deposit', [Cl.uint(1000)], wallet1);

    // Attempt to borrow more than allowed (>50%)
    const borrowResult = simnet.callPublicFn(
      'defi',
      'borrow',
      [Cl.uint(600)],
      wallet1
    );

    // Should fail with err-overborrow
    expect(borrowResult.result).toBeErr(Cl.uint(300));
  });
});
```

Key aspects used in the test:

* callPublicFn - Simulates calling public functions just as on the actual blockchain
* getDataVar - Retrieves the value of contract data variables
* callReadOnlyFn - Calls read-only functions without modifying state
* Custom matchers - toBeOk() and toBeErr() validate Clarity response types

## Try it out

Run your integration tests:

```bash
npm run test
```

## Common issues

| Issue                         | Solution                                               |
| ----------------------------- | ------------------------------------------------------ |
| State pollution between tests | Each test runs in isolation - state doesn't carry over |
| Timing issues                 | Use `simnet.mineEmptyBlocks()` to advance block height |
| Complex assertions            | Break down into smaller, focused tests                 |

##
