# Unit Testing

Unit testing verifies that individual contract functions behave as expected. The Clarinet JS SDK pairs with Vitest to help you catch bugs early in development.

## What you'll learn

* Set up a Clarinet project for unit testing
* Write tests for public and read-only functions
* Handle error conditions and edge cases
* Run tests and generate coverage reports

{% stepper %}
{% step %}
#### Set up your project

Create a new Clarinet project and install dependencies:

```bash
clarinet new stx-defi
cd stx-defi
npm install
```
{% endstep %}

{% step %}
#### Create the contract

Generate a contract stub:

```bash
clarinet contract new defi
```

Replace `contracts/defi.clar` with the following implementation:

```clarity
;; Holds the total amount of deposits in the contract
(define-data-var total-deposits uint u0)

;; Maps a user's principal address to their deposited amount
(define-map deposits { owner: principal } { amount: uint })

;; Public function for users to deposit STX into the contract
(define-public (deposit (amount uint))
  (let
    (
      ;; Fetch the current balance or default to 0 if none exists
      (current-balance (default-to u0 (get amount (map-get? deposits { owner: tx-sender }))))
    )
    ;; Transfer the STX from sender to contract
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
    ;; Update the user's deposit amount in the map
    (map-set deposits { owner: tx-sender } { amount: (+ current-balance amount) })
    ;; Update the total deposits variable
    (var-set total-deposits (+ (var-get total-deposits) amount))
    ;; Return success
    (ok true)
  )
)

;; Read-only function to get the balance by tx-sender
(define-read-only (get-balance-by-sender)
  (ok (map-get? deposits { owner: tx-sender }))
)
```

Validate the contract:

```bash
clarinet check
```
{% endstep %}

{% step %}
#### Write your unit test

Create `tests/defi.test.ts` with a basic happy-path test:

```ts
import { describe, it, expect } from 'vitest';
import { Cl } from '@stacks/transactions';

const accounts = simnet.getAccounts();
const wallet1 = accounts.get('wallet_1')!;

describe('stx-defi', () => {
  it('allows users to deposit STX', () => {
    // Define the amount to deposit
    const amount = 1000;

    // Call the deposit function
    const deposit = simnet.callPublicFn('defi', 'deposit', [Cl.uint(amount)], wallet1);

    // Assert the deposit was successful
    expect(deposit.result).toBeOk(Cl.bool(true));

    // Verify the contract's total deposits
    const totalDeposits = simnet.getDataVar('defi', 'total-deposits');
    expect(totalDeposits).toBeUint(amount);

    // Check the user's balance
    const balance = simnet.callReadOnlyFn('defi', 'get-balance-by-sender', [], wallet1);
    expect(balance.result).toBeOk(
      Cl.some(
        Cl.tuple({
          amount: Cl.uint(amount),
        })
      )
    );
  });
});
```

{% hint style="info" %}
Key calls:

* `simnet.callPublicFn` – executes public functions
* `expect(...).toBeOk()` – asserts a Clarity `ok` response
* `simnet.getDataVar` – reads a contract data variable
* `Cl.*` helpers – build Clarity values in JavaScript
{% endhint %}
{% endstep %}

{% step %}
#### Try it out

Run the tests:

```bash
$ npm run test
 PASS  tests/defi.test.ts
  stx-defi
    allows users to deposit STX (5 ms)

Test Files  1 passed (1)
     Tests  1 passed (1)
```
{% endstep %}

{% step %}
#### Generate coverage reports

```bash
npm run test:report
```

This command produces:

* `lcov.info` – code coverage data
* `costs-reports.json` – gas cost analysis

View the HTML report (macOS example):

```bash
$ brew install lcov
$ genhtml lcov.info --branch-coverage -o coverage
$ open coverage/index.html
```
{% endstep %}
{% endstepper %}

## Common issues

| Issue                      | Solution                                                              |
| -------------------------- | --------------------------------------------------------------------- |
| `toBeOk is not a function` | Ensure the Clarinet SDK matchers are loaded via `vitestSetupFilePath` |
| `Contract not found`       | Re-run `clarinet check` to compile and register contracts             |
| Type errors                | Use the `Cl` helpers to construct Clarity values                      |

## Advanced testing patterns

Test error conditions:

```ts
it('fails when depositing zero', () => {
  const deposit = simnet.callPublicFn('defi', 'deposit', [Cl.uint(0)], wallet1);
  expect(deposit.result).toBeErr(Cl.uint(100)); // err-invalid-amount
});
```

Test with multiple accounts:

```ts
const wallet2 = accounts.get('wallet_2')!;

it('tracks deposits from multiple users', () => {
  simnet.callPublicFn('defi', 'deposit', [Cl.uint(1000)], wallet1);
  simnet.callPublicFn('defi', 'deposit', [Cl.uint(2000)], wallet2);

  const total = simnet.getDataVar('defi', 'total-deposits');
  expect(total).toBeUint(3000);
});
```

##
