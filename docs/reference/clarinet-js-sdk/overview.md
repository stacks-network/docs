---
description: Practical guide to testing smart contracts with the Clarinet JS SDK.
---

# Overview

<figure><img src="../.gitbook/assets/image (1) (1).png" alt=""><figcaption><p>source: <a href="https://www.hiro.so/blog/announcing-the-clarinet-sdk-a-javascript-programming-model-for-easy-smart-contract-testing">Hiro blog</a></p></figcaption></figure>

The Clarinet JS SDK provides a powerful testing framework for Clarity smart contracts. It integrates with Vitest to let you run comprehensive tests against a simulated blockchain environment.

## Initial setup

Create a new Node.js project (or reuse an existing one):

```bash
npm init -y
```

Install the Clarinet JS SDK and its dependencies:

```bash
npm install @hirosystems/clarinet-sdk vitest @stacks/transactions
```

## Project structure

Organize your project so contracts and tests live together:

```
- my-project/
  - contracts/
    - counter.clar
  - tests/
    - counter.test.ts
  - Clarinet.toml
  - package.json
  - tsconfig.json
  - vitest.config.js
```

## Simple test

Create `tests/counter.test.ts` to verify the contract:

{% code title="tests/counter.test.ts" %}
```ts
import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const wallet = accounts.get("wallet_1")!;

describe("counter contract", () => {
  it("increments the count", () => {
    const countUpCall = simnet.callPublicFn("counter", "count-up", [], wallet);
    expect(countUpCall.result).toBeOk(Cl.bool(true));
  });
});
```
{% endcode %}

The `simnet` object is automatically available and exposes a simulated Stacks blockchain.

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
import { vitestSetupFilePath } from "@hirosystems/clarinet-sdk/vitest";

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

## Examples

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
npm test
```

Generate coverage reports:

```bash
npm run test:coverage
```

Coverage output includes cost analysis for your contract functions.

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

##
