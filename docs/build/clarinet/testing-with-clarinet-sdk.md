---
description: Practical guide to testing smart contracts with the Clarinet JS SDK.
---

# Unit Testing

<div data-with-frame="true"><figure><img src="../.gitbook/assets/clarinet-js-sdk.png" alt=""><figcaption></figcaption></figure></div>

Unit testing verifies that individual contract functions behave as expected. The Clarinet JS SDK pairs with Vitest to help you catch bugs early in development. The Clarinet JS SDK provides a powerful testing framework for Clarity smart contracts. It integrates with Vitest to let you run comprehensive tests against a simulated blockchain environment. This library will expose many of Clarinet’s features to the JavaScript ecosystem, including “simnet[^1]”.

{% hint style="success" %}
For the latest releases and versions of `@stacks/clarinet-sdk`, check out its npm page [here](https://www.npmjs.com/package/@stacks/clarinet-sdk).

* For the [SDK](https://app.gitbook.com/s/GVj1Z9vMuEOMe7oH7Wnq/clarinet-js-sdk/sdk-reference) references of all available methods and definitions.
* For the [Browser SDK](https://app.gitbook.com/s/GVj1Z9vMuEOMe7oH7Wnq/clarinet-js-sdk/browser-sdk-reference) reference, which is a browser build of the Clarinet SDK lets you interact with simnet directly from web experiences.
{% endhint %}

## What you'll learn

* Set up a Clarinet project for unit testing
* Write tests for public and read-only functions
* Handle error conditions and edge cases
* Run tests and generate coverage reports

{% stepper %}
{% step %}
**Set up your project**

Create a new Clarinet project and install dependencies:

```bash
clarinet new stx-defi
cd stx-defi
npm install
```
{% endstep %}

{% step %}
**Create the contract**

Generate a contract stub:

```bash
clarinet contract new defi
```

Replace `contracts/defi.clar` with the following implementation:

{% code title="defi.clar" expandable="true" %}
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
{% endcode %}

Validate the contract:

```bash
clarinet check
```
{% endstep %}

{% step %}
**Write your unit test**

Create `tests/defi.test.ts` with a basic happy-path test:

{% hint style="warning" %}
Be sure you're on the latest version of `@stacks/clarinet-sdk`
{% endhint %}

{% code title="tests/defi.test.ts" expandable="true" %}
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
{% endcode %}

The `simnet` object is automatically available and exposes a simulated Stacks blockchain.

{% hint style="info" %}
Key calls:

* `simnet.callPublicFn` – executes public functions
* `expect(...).toBeOk()` – asserts a Clarity `ok` response
* `simnet.getDataVar` – reads a contract data variable
* `Cl.*` helpers – build Clarity values in JavaScript
{% endhint %}
{% endstep %}

{% step %}
**Try it out**

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
**Generate coverage reports**

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

## Configuration options

### Clarinet configuration

Define your contracts in `Clarinet.toml`:

```toml
[project]
name = "my-project"

[contracts.counter]
path = "contracts/counter.clar"
```

### TypeScript setup

Configure TypeScript for the SDK:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "types": ["vitest/globals"]
  },
  "include": ["tests/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Vitest configuration

Set up Vitest so the SDK can bootstrap the testing environment:

```js
import { defineConfig } from "vitest/config";
import { vitestSetupFilePath } from "@stacks/clarinet-sdk/vitest";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    setupFiles: [vitestSetupFilePath],
  },
});
```

{% hint style="info" %}
Include `vitestSetupFilePath` in `setupFiles` so the SDK can prepare the `simnet` instance before tests run.
{% endhint %}

### Package scripts

Add convenient test scripts to `package.json`:

```json
"scripts": {
  "test": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage"
}
```

## Common patterns

### Testing read-only functions

Use `callReadOnlyFn` for functions that do not modify state:

```ts
const getCountCall = simnet.callReadOnlyFn(
  "counter",
  "get-count",
  [Cl.principal(wallet)],
  wallet
);
expect(getCountCall.result).toBeUint(1);
```

### Testing public functions with parameters

Pass parameters with the appropriate Clarity helpers:

```ts
const depositCall = simnet.callPublicFn(
  "defi",
  "deposit",
  [Cl.uint(1000)],
  wallet
);
expect(depositCall.result).toBeOk(Cl.bool(true));
```

### Accessing contract state

Inspect data variables and maps directly:

```ts
const totalDeposits = simnet.getDataVar("defi", "total-deposits");
expect(totalDeposits).toBeUint(1000);

const balance = simnet.getMapEntry("defi", "balances", Cl.principal(wallet));
expect(balance).toBeUint(1000);
```

## Other Examples

### Testing contract deployment

Ensure the contract was deployed:

```ts
it("ensures the contract is deployed", () => {
  const contractSource = simnet.getContractSource("counter");
  expect(contractSource).toBeDefined();
});
```

### Testing error conditions

Verify error handling logic:

```ts
it("fails when borrowing too much", () => {
  const borrowCall = simnet.callPublicFn(
    "defi",
    "borrow",
    [Cl.uint(10000)], // Amount exceeds allowed
    wallet
  );
  expect(borrowCall.result).toBeErr(Cl.uint(300)); // err-overborrow
});
```

### Testing with multiple accounts

Simulate cross-account interactions:

```ts
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

// Wallet 1 deposits
simnet.callPublicFn("defi", "deposit", [Cl.uint(1000)], wallet1);

// Wallet 2 tries to withdraw wallet 1's funds (should fail)
const withdrawCall = simnet.callPublicFn(
  "defi",
  "withdraw",
  [Cl.uint(1000)],
  wallet2
);
expect(withdrawCall.result).toBeErr(Cl.uint(401)); // err-unauthorized
```

## Running tests

Execute the full suite:

```bash
npm run test
```

Generate coverage reports:

```bash
npm run test:report
```

This command produces:

* `lcov.info` – code coverage data
* `costs-reports.json` – gas cost analysis

View the HTML report (macOS example):

```bash
brew install lcov
genhtml lcov.info --branch-coverage -o coverage
open coverage/index.html
```

## Advanced usage

### Using the SDK in existing projects

If your project has a custom structure, keep contracts and tests together and point the SDK to the manifest:

```
- my-app/
  - blockchain/
    - contracts/
      - token.clar
    - tests/
      - token.test.ts
    - Clarinet.toml
  - frontend/
    - App.tsx
  - package.json
  - vitest.config.js
```

Update `vitest.config.js` to reference the correct manifest path:

```js
export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    setupFiles: [vitestSetupFilePath],
    env: {
      CLARINET_MANIFEST_PATH: "./blockchain/Clarinet.toml"
    }
  },
});
```

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

## Common issues

| Issue                         | Solution                                                              |
| ----------------------------- | --------------------------------------------------------------------- |
| `toBeOk is not a function`    | Ensure the Clarinet SDK matchers are loaded via `vitestSetupFilePath` |
| `Contract not found`          | Re-run `clarinet check` to compile and register contracts             |
| Type errors                   | Use the `Cl` helpers to construct Clarity values                      |
| State pollution between tests | Each test runs in isolation - state doesn't carry over                |
| Timing issues                 | Use `simnet.mineEmptyBlocks()` to advance block height                |
| Complex assertions            | Break down into smaller, focused tests                                |

***

### Additional Resources

* \[[Hiro Blog](https://www.hiro.so/blog/announcing-the-clarinet-sdk-a-javascript-programming-model-for-easy-smart-contract-testing)] Announcing the Clarinet SDK: a JavaScript Programming Model For Easy Smart Contract Testing&#x20;

[^1]: Simnet allows developers to interact with a virtual and light Stacks network, embedding the same Clarity VM as the one used in production on Stacks mainnet. With this new JavaScript SDK, it is now possible to control the simnet from Node.js in a standard and familiar way.
