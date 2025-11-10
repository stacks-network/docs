---
description: Understand the complete structure and configuration of a Clarinet project.
---

# Project Structure

A Clarinet project follows a carefully designed structure that separates contracts, tests, and configuration. Understanding this structure helps you organize code effectively and configure tools for an efficient development workflow.

## Core project layout

Every Clarinet project contains these essential directories and files:

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

Each component serves a specific purpose in your development workflow. The sections below explain how they work together to create a complete development environment.

## The project manifest

### Clarinet.toml

The **Clarinet.toml** file is the heart of your project. It defines project metadata and tracks all contracts:

```toml
[project]
name = "counter"
description = "A counter smart contract"

[contracts.traits]
path = "contracts/traits.clar"
clarity_version = 4
epoch = "latest"

[contracts.counter]
path = "contracts/counter.clar"
clarity_version = 4
epoch = "latest"
```

The manifest handles several critical functions:

* **Contract registration**: Every contract must be listed here
* **Stacks epoch and Clarity version**: Specifies Clarity version and epoch for each contract
* **Boot sequence**: Lists contracts to deploy on `clarinet devnet start`

### Epoch configuration

You can specify the epoch in two ways:

```toml
# Use a specific epoch version
epoch = 3.1
```

```toml
# Use the latest available epoch (default)
epoch = "latest"
```

Using `"latest"` ensures your contracts always use the newest Clarity features and optimizations available in your version of Clarinet.

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

| Package                       | Purpose                                                 |
| ----------------------------- | ------------------------------------------------------- |
| `@stacks/clarinet-sdk`        | WebAssembly-compiled Clarinet for Node.js               |
| `@stacks/transactions`        | Clarity value manipulation in TypeScript                |
| `vitest`                      | Modern testing framework with native TypeScript support |
| `vitest-environment-clarinet` | Simnet bootstrapping for tests                          |

### Vitest configuration

The **`vitest.config.ts`** (or `.js`) configures the testing framework.
Make sure to import `defineConfig` from `vitest/config` (and not for `vite`). 

This configuration will work with Vitest v4 and higher

```ts
import { defineConfig } from "vitest/config";
import {
  vitestSetupFilePath,
  getClarinetVitestsArgv,
} from "@stacks/clarinet-sdk/vitest";

/*
  In this file, Vitest is configured so that it works seamlessly with Clarinet and the Simnet.

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

This configuration enables:

* **Clarinet environment**: Automatic `simnet` setup for each test
* **Single fork mode**: Efficient test execution with proper isolation
* **Coverage tracking**: Generate reports in multiple formats
* **Custom setup**: Add project-specific test utilities

<details>

<summary>If you use Vitest 3 or lower and don't want to upgrade now, you can use this config</summary>

```ts
import { defineConfig } from "vitest/config";
import {
  vitestSetupFilePath,
  getClarinetVitestsArgv,
} from "@stacks/clarinet-sdk/vitest";

/*
  In this file, Vitest is configured so that it works seamlessly with Clarinet and the Simnet.

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

Properly setting the `include` property ensures TypeScript picks up the helpers defined in the Clarinet SDK package along with your tests.

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

If you're encountering import errors in your tests, update your TypeScript configuration to use Vite's bundler resolution:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true
  }
}
```

This configuration ensures TypeScript understands Vite's module resolution strategy and allows importing `.ts` files directly.

</details>
