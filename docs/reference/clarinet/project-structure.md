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
clarity_version = 3
epoch = "latest"

[contracts.counter]
path = "contracts/counter.clar"
clarity_version = 3
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
    "@hirosystems/clarinet-sdk": "^3.0.2",
    "@stacks/transactions": "^7.0.6",
    "@types/node": "^24.0.14",
    "chokidar-cli": "^3.0.0",
    "vitest": "^3.1.3",
    "vitest-environment-clarinet": "^2.3.0"
  }
}
```

| Package                       | Purpose                                                 |
| ----------------------------- | ------------------------------------------------------- |
| `@hirosystems/clarinet-sdk`   | WebAssembly-compiled Clarinet for Node.js               |
| `@stacks/transactions`        | Clarity value manipulation in TypeScript                |
| `vitest`                      | Modern testing framework with native TypeScript support |
| `vitest-environment-clarinet` | Simnet bootstrapping for tests                          |

### Vitest configuration

The **vitest.config.js** configures the testing framework:

```js
/// <reference types="vitest" />
import { defineConfig } from "vite";
import { vitestSetupFilePath, getClarinetVitestsArgv } from "@hirosystems/clarinet-sdk/vitest";

export default defineConfig({
  test: {
    environment: "clarinet", // use vitest-environment-clarinet
    pool: "forks",
    poolOptions: {
      threads: { singleThread: true },
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

This configuration enables:

* **Clarinet environment**: Automatic `simnet` setup for each test
* **Single fork mode**: Efficient test execution with proper isolation
* **Coverage tracking**: Generate reports in multiple formats
* **Custom setup**: Add project-specific test utilities

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
    "node_modules/@hirosystems/clarinet-sdk/vitest-helpers/src",
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

<details>

<summary>Mismatched versions</summary>

All contracts in your project should use the same Clarity version and epoch to avoid compatibility issues:

```toml
[contracts.token]
clarity_version = 3
epoch = "latest"

[contracts.pool]
clarity_version = 3
epoch = "latest"
```

Mismatched versions can cause deployment failures and unexpected behavior. Always upgrade all contracts together when moving to a new Clarity version.

</details>
