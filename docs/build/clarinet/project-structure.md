---
description: Understand the complete structure and configuration of a Clarinet project.
---

# Project Structure

A Clarinet project uses a structure that separates contracts, tests, and configuration. Understanding this structure helps you organize code and configure your development tools.

## Core project layout

Every Clarinet project contains these directories and files:

```
- my-project/
  - .vscode/
  - contracts/
    - main.clar
    - trait.clar
  - deployments/
  - settings/
    - Devnet.toml
    - Mainnet.toml
    - Testnet.toml
  - tests/
    - main.test.ts
  - .gitignore
  - Clarinet.toml
  - package.json
  - tsconfig.json
  - vitest.config.js
```

## The project manifest

### Clarinet.toml

The **Clarinet.toml** file defines project metadata and tracks all contracts:

```toml
[project]
name = "counter"
description = "A counter smart contract"

[contracts.traits]
path = "contracts/traits.clar"
clarity_version = 6
epoch = "latest"

[contracts.counter]
path = "contracts/counter.clar"
clarity_version = 6
epoch = "latest"
```

`clarinet contract new` writes these two keys for you. Clarinet v3.24.1 accepts `clarity_version` values 1 through 6.

The manifest handles:

* **Contract registration**: Every contract must be listed here
* **Stacks epoch and Clarity version**: Specifies Clarity version and epoch for each contract
* **Boot sequence**: Lists contracts to deploy on `clarinet devnet start`

### Epoch configuration

Set the epoch per contract, either to a specific version or to the current mainnet epoch:

```toml
# A specific epoch. Accepted: 2.0, 2.05, 2.1, 2.2, 2.3, 2.4, 2.5, 3.0, 3.1, 3.2, 3.3, 3.4, 4.0
epoch = 4.0
```

```toml
# The epoch running on mainnet, as pinned by your Clarinet release (default for new contracts)
epoch = "latest"
```

`"latest"` means the epoch active on mainnet, which Clarinet v3.24.1 pins to 4.0. It is not the newest epoch the Clarity VM knows about, so a contract marked `"latest"` deploys with the features mainnet has today.

The two keys depend on each other:

* `epoch` set, `clarity_version` omitted: Clarinet uses the default Clarity version for that epoch. Epoch 4.0 defaults to Clarity 6.
* Both omitted: Clarinet falls back to epoch 2.05 and Clarity 1, which rejects most current syntax. Set both.
* `clarity_version` newer than the epoch supports: `clarinet check` stops with `Clarity 6 can not be used with 3.4` (the message names your values).

A contract that calls `pox-5` or implements its `signer-manager-trait` needs `epoch = 4.0` or `"latest"`, because `pox-5` does not exist in earlier epochs; any `clarity_version` up to 6 compiles in that epoch. Pick Clarity 6 when the contract uses what Clarity 6 added: the `with-staking` and `with-pox` allowances for `restrict-assets?` and `as-contract?`, `get-bitcoin-tx-output?`, `verify-merkle-proof`, `ed25519-verify`, `secp256k1-decompress?`, or variadic `concat`. In Clarity 4 and 5 contracts the allowance keeps its old spelling, `with-stacking`; the `renamed_builtin` lint in `clarinet check` flags it once the contract's `clarity_version` is 6.

## Testing infrastructure

### Package configuration

The **package.json** defines your testing environment and dependencies:

```json
{
  "name": "counter-tests",
  "version": "1.0.0",
  "description": "Run unit tests on this project.",
  "type": "module",
  "private": true,
  "scripts": {
    "test": "vitest run",
    "test:report": "vitest run -- --coverage --costs",
    "test:watch": "chokidar \"tests/**/*.ts\" \"contracts/**/*.clar\" -c \"npm run test:report\""
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@stacks/clarinet-sdk": "^3.9.1",
    "@stacks/transactions": "^7.2.0",
    "@types/node": "^24.4.0",
    "chokidar-cli": "^3.0.0",
    "vitest": "^4.0.7",
    "vitest-environment-clarinet": "^3.0.0"
  }
}
```

| Package                       | Purpose                                          |
| ----------------------------- | ------------------------------------------------ |
| `@stacks/clarinet-sdk`        | WebAssembly-compiled Clarinet for Node.js        |
| `@stacks/transactions`        | Clarity value manipulation in TypeScript         |
| `vitest`                      | Testing framework with native TypeScript support |
| `vitest-environment-clarinet` | Simnet bootstrapping for tests                   |

### Vitest configuration

The **`vitest.config.ts`** (or `.js`) configures the testing framework. Import `defineConfig` from `vitest/config`, not from `vite`. This configuration works with Vitest v4 and later.

{% code expandable="true" %}
```typescript
import { defineConfig } from "vitest/config";
import {
  vitestSetupFilePath,
  getClarinetVitestsArgv,
} from "@stacks/clarinet-sdk/vitest";

/*
  In this file, Vitest is configured so that it works with Clarinet and the Simnet.
  The `vitest-environment-clarinet` will initialise the clarinet-sdk
  and make the `simnet` object available globally in the test files.
  `vitestSetupFilePath` points to a file in the `@stacks/clarinet-sdk` package that does two things:
    - run `before` hooks to initialize the simnet and `after` hooks to collect costs and coverage reports.
    - load custom vitest matchers to work with Clarity values (such as `expect(...).toBeUint()`)
  The `getClarinetVitestsArgv()` will parse options passed to the command `vitest run --`
    - vitest run -- --manifest ./Clarinet.toml  # pass a custom path
    - vitest run -- --coverage --costs          # collect coverage and cost reports
*/

export default defineConfig({
  test: {
    // use vitest-environment-clarinet
    environment: "clarinet",
    pool: "forks",
    // clarinet handles test isolation by resetting the simnet between tests
    isolate: false,
    maxWorkers: 1,
    setupFiles: [
      vitestSetupFilePath,
      // custom setup files can be added here
    ],
    environmentOptions: {
      clarinet: {
        ...getClarinetVitestsArgv(),
        // add or override options
      },
    },
  },
});
```
{% endcode %}

This configuration sets up:

* **Clarinet environment**: Automatic `simnet` setup for each test
* **Single fork mode**: Efficient test execution with proper isolation
* **Coverage tracking**: Generate reports in multiple formats
* **Custom setup**: Add project-specific test utilities

<details>

<summary>For Vitest v3 and earlier, use the configuration below.</summary>

```typescript
import { defineConfig } from "vitest/config";
import {
  vitestSetupFilePath,
  getClarinetVitestsArgv,
} from "@stacks/clarinet-sdk/vitest";

/*
  In this file, Vitest is configured so that it works with Clarinet and the Simnet.
  The `vitest-environment-clarinet` will initialise the clarinet-sdk
  and make the `simnet` object available globally in the test files.
  `vitestSetupFilePath` points to a file in the `@hirosystems/clarinet-sdk` package that does two things:
    - run `before` hooks to initialize the simnet and `after` hooks to collect costs and coverage reports.
    - load custom vitest matchers to work with Clarity values (such as `expect(...).toBeUint()`)
  The `getClarinetVitestsArgv()` will parse options passed to the command `vitest run --`
    - vitest run -- --manifest ./Clarinet.toml  # pass a custom path
    - vitest run -- --coverage --costs          # collect coverage and cost reports
*/

export default defineConfig({
  test: {
    // use vitest-environment-clarinet
    environment: "clarinet",
    pool: "forks",
    poolOptions: {
      forks: { singleFork: true },
    },
    setupFiles: [
      vitestSetupFilePath,
      // custom setup files can be added here
    ],
    environmentOptions: {
      clarinet: {
        ...getClarinetVitestsArgv(),
        // add or override options
      },
    },
  },
});
```

</details>

### TypeScript configuration

The **tsconfig.json** provides TypeScript support:

{% code expandable="true" %}
```json
{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ESNext"],
    "skipLibCheck": true,

    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,

    "strict": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": [
    "node_modules/@stacks/clarinet-sdk/vitest-helpers/src",
    "tests"
  ]
}
```
{% endcode %}

Setting the `include` property as shown makes TypeScript pick up the helpers defined in the Clarinet SDK package along with your tests.

## Network configurations

### Environment settings

Each network has its own configuration file in the **settings** directory:

```toml
[network]
name = "devnet"
deployment_fee_rate = 10

[accounts.deployer]
mnemonic = "twice kind fence tip hidden..."
balance = 100_000_000_000_000

[accounts.wallet_1]
mnemonic = "sell invite acquire kitten..."
balance = 10_000_000_000_000
```

These settings control:

* **Network ports**: API, RPC, and explorer endpoints
* **Account configuration**: Test wallets with STX balances
* **Chain parameters**: Network-specific blockchain settings

{% hint style="warning" %}
Never commit mainnet private keys or mnemonics. Use environment variables for production credentials.
{% endhint %}

## Common issues

<details>

<summary>Imports failing in tests</summary>

If you get import errors in your tests, update your TypeScript configuration to use Vite's bundler resolution:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true
  }
}
```

With this configuration, TypeScript uses Vite's module resolution strategy and allows importing `.ts` files directly.

</details>
