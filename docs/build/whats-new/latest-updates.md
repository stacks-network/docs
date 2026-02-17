---
description: Check out the latest Stacks developer updates
---

# Latest Updates

### Deprecation notices for Hiro's Chainhooks v1 & L1 APIs

_February 6th, 2026_

**[Hiro] Chainhooks V2 is now available.** This is a significant upgrade with enhanced capability, better performance, and improved reliability. Hiro is **deprecating their hosted Chainhooks v1 on March 9th, 2026**, so if you're using Chainhooks via the Hiro Platform, upgrade immediately. Self-hosted Chainhook instances are not affected by this deprecation.

**L1 Bitcoin APIs shutting down March 9th, 2026.** Hiro is also deprecating their Ordinals, BRC-20, Runes, and Bitcoin Indexer APIs. They've partnered with Xverse to provide a smooth migration path, and have published a detailed migration guide to help with the transition.

<details>

<summary>Resources</summary>

* Chainhooks v2 announcement [blog post](https://www.hiro.so/blog/chainhooks-v2-is-now-generally-available)
* Hiro's L1 metaprotocol APIs deprecation [blog post](https://www.hiro.so/blog/upcoming-deprecation-of-ordinals-runes-and-brc-20-apis)

</details>

***

### Start Cookin' with the Cookbook

_January 30, 2026_

The [Cookbook](https://app.gitbook.com/s/uholC0CdufHxYs050O3V/) contains detailed coding snippets known as recipes. These recipes are focused, reusable code patterns designed to be referenced, copied, and adapted to solve common problems and demonstrate specific patterns in Clarity and Stacks.js development.

Rather than reading end-to-end, use the Cookbook as a reference resource when you need to implement specific functionality.

***

### New 'Path To Production' Guide

_January 26, 2026_

New developers can now access comprehensive security resources and best practices for testing and deployment. This guide provides a checklist of items to battle-test your contracts before going live. 

Head to the [**Path To Production**](../get-started/path-to-production.md) guide to learn what steps you can take to harden your project before mainnet deployment.

***

### Catch Dead Code Early with Clarity Linting

_January 14, 2026_

Clarinet [v3.13.0](https://github.com/stx-labs/clarinet/releases/tag/v3.13.0) now includes a built-in Clarity linter as part of `clarinet check`, enabling dead code analysis and no-op detection with configurable lint levels and inline overrides.

The initial release focuses on identifying unused code and expressions that have no effect on execution. Lint behavior can be customized globally or per rule via `Clarinet.toml`.

<details>

<summary>Details</summary>

Clarinet now includes a built-in **Clarity linter** as part of `clarinet check`, designed to help developers catch common mistakes, eliminate dead code, and improve overall contract quality earlier in the development cycle.

This first release focuses on **dead code analysis**, surfacing declarations and expressions that have no effect on contract execution and are often sources of bugs, confusion, or unnecessary complexity.

#### Dead Code Analysis (Available Today)

The initial lint set includes **seven configurable lints**, each targeting a specific class of unused code:

| Identifier          | Description                                                                    |
| ------------------- | ------------------------------------------------------------------------------ |
| `unused_const`      | Detects unused `define-constant` declarations                                  |
| `unused_data_var`   | Detects `define-data-var` values that are never written to                     |
| `unused_map`        | Detects `define-map` declarations that are never accessed                      |
| `unused_private_fn` | Detects private functions that are never called                                |
| `unused_token`      | Detects fungible and non-fungible tokens that are never minted                 |
| `unused_trait`      | Detects traits imported via `use-trait` that are never used as parameter types |
| `unused_binding`    | Detects unused function arguments and `let` bindings                           |

Additionally, Clarinet includes the **`noop`** lint (contributed by GitHub user [0xalpharush](https://github.com/0xalpharush)), which flags expressions that have no effect, such as: `(is-eq 1)`

#### Suppressing Lints

Some unused code is intentional—for example, private functions used only in tests or bindings whose evaluation has side effects.

To handle these cases, Clarinet supports:

**Identifier-based suppression**

Appending a trailing `_` to an identifier allows it to be unused, following a convention similar to Rust. (Note: _prefixing_ identifiers with `_` is not yet supported.)

**Line-level suppression**

Individual lints can be disabled on a per-line basis using Clarity annotations:

```clarity
;; #[allow(lint_name)]
```

#### Configuration

All non-style/non-cosmetic lints are enabled by default at `warning` level. Style lints may eventually be enabled by default at `notice` level.

**Configure individual lints**

```toml
[repl.analysis.lints]
noop = true # Defaults to "warning"
unused_const = "warning"
unused_data_var = "error"
unused_map = false
```

**Configure lint groups**

```toml
[repl.analysis.lint_groups]
all = true       # Sets default level to "warning" for all lints
style = "notice" # Cosmetic lints generate notices only
unused = "error" # Enforces removal of unused code
```

#### What's Next

This release lays the foundation for a broader linting system in Clarinet. Upcoming work includes:

* **Style lints** for consistent and idiomatic Clarity code
* **Performance lints** to surface inefficient patterns
* **Safety lints** to help identify potentially dangerous constructs

Share feedback via the [Clarinet GitHub issue](https://github.com/stx-labs/clarinet/issues/2028) or in the community Discord.

Learn more in the Clarinet section on [validation and analysis](../clarinet/validation-and-analysis.md).

</details>

***

### Completion of Dimension-Specific Tenure Extension

_January 12, 2026_

**[Stacks Core 3.3.0.0.4](https://github.com/stacks-network/stacks-core/releases/tag/3.3.0.0.4)** With dimension-specific tenure extensions, Stacks can extend block limits per dimension (like `runtime` and `read_count` budgets) instead of stopping early. This ensures DeFi protocols can process critical flows during high-volatility periods. 

Watch Alex Huth discuss this feature during the latest DevRel office hours [here](https://x.com/StacksDevs/status/2017601390345130421).

***

### Multiple Language Support for Learn

_January 9, 2026_

The [Learn](https://app.gitbook.com/s/H74xqoobupBWwBsVMJhK/) section now supports Chinese and Spanish, helping more developers access clear explanations of how Stacks works. Switch languages using the selector in the top-right corner of the Learn pages.

***

### Bridging USDCx Developer Guide

_January 8, 2026_

Developers can now programmatically integrate the USDCx bridging flow into their applications. Deposits are initiated on Ethereum and automatically minted on Stacks, while withdrawals are initiated on Stacks and settled on Ethereum. 

Check out the guide [here](../more-guides/bridging-usdcx.md) to start enabling stablecoin liquidity across the Stacks DeFi ecosystem.

***

### Multiple Network URLs Supported in RPC-API Playground

_December 29, 2025_

The API playground in the [RPC-API reference](https://app.gitbook.com/s/GVj1Z9vMuEOMe7oH7Wnq/node-operations/rpc-api) now supports testnet and mainnet. Use the interactive playground to test API calls on mainnet, testnet, devnet, or your own locally running Stacks node.

***

### Stacks Blockchain API v8.13.6 is Live

_December 22, 2025_

**[Hiro]** This is a required upgrade for all API users (including partners and exchanges): adds support for smart contracts deployed with empty source code.

This is an easy upgrade with no database migrations and full compatibility with the current chainstate.

See more in Hiro's release notes [here](https://github.com/hirosystems/stacks-blockchain-api/releases/tag/v8.13.6).

***

### USDCx Now Live on Mainnet

_December 18, 2025_

A new documentation section dedicated to the launch of USDCx is now live [here](https://app.gitbook.com/s/H74xqoobupBWwBsVMJhK/bridging/usdcx). Learn about its interoperable architecture with Circle's xReserve and discover the Clarity contracts behind the new USDCx token.

***

### Stacks Miners — Please Update ASAP!

_December 12, 2025_

This release activates the new read-count tenure extensions from SIP-034, a highly anticipated upgrade for builders across the ecosystem.

It also includes several important bug fixes, making this a critical update.

<details>

<summary>Details</summary>

Latest release: [Stacks Core 3.3.0.0.2](https://github.com/stacks-network/stacks-core/releases/tag/3.3.0.0.2)

#### What Was Updated

**Added**

* Fixed an issue where `event.committed` was always equal to `true` in the block replay RPC endpoint
* Added `result_hex` and `post_condition_aborted` to the block replay RPC endpoint
* Added `--epoch <epoch_number>` flag to `clarity-cli` commands to specify the epoch context for evaluation
* Support for read-count tenure extends
* Added `read_count_idle_timeout_secs` config option to set the amount of idle time (in seconds) that must pass before a read-count tenure extend is allowed (defaults to 20 seconds)
* Send a read-count tenure extend timestamp in block responses
* Approve a block with a read-count tenure extend when the appropriate amount of idle time has passed

**Fixed**

* Correctly produce the receipt for the `costs-4` contract, which was deployed on epoch 3.3 activation. Users who consume node events and want to fill in the missing receipt (e.g., the Hiro API) will need to revert their chainstate to before the 3.3 activation and then resume sync to receive the previously missing event.

</details>

***

### Upgrade to Dual Stacking Contracts

_December 10, 2025_

Dual Stacking contracts were **upgraded on December 15, 2025**. This upgrade enables more flexible reward parameters and allows users to view their sBTC holdings and corresponding rewards within the Dual Stacking app.

<details>

<summary>Details</summary>

#### Summary

* If you enrolled in Dual Stacking, you were moved over automatically with no action needed.
* If you did not enroll in the web app but were receiving Dual Stacking rewards through a participating app, you needed to enroll on the web app.

To check your enrollment status, visit [app.stacks.co](https://app.stacks.co/).

The contract upgraded from `.dual-stacking-v1` to `.dual-stacking-v2_0_2`.

</details>

***

### Deploy in Clarinet Using Encrypted Mnemonics

_December 9, 2025_

Clarinet 3.11.0 includes support for encrypted mnemonics. This feature gives users the option to encrypt the mnemonic seed phrase in their deployment files. If a user's machine is compromised by a filesystem reading vulnerability, the seed phrase is not leaked to the attacker.

<details>

<summary>Details</summary>

To use this feature, first run `clarinet deployments encrypt`, which will prompt for the seed phrase and a password, then print the encrypted mnemonic to the console. You can then put the resulting ciphertext into your deployment config file using the key `encrypted_mnemonic`. The next time you run `clarinet deployments apply`, you will be prompted for the password, and the mnemonic will be decrypted for use in that session.

**Example**

If your `settings/Mainnet.toml` file looks like this:

{% code title="settings/Mainnet.toml" %}
```toml
[network]
name = "mainnet"
stacks_node_rpc_address = "https://api.hiro.so"
deployment_fee_rate = 10

[accounts.deployer]
mnemonic = "twice kind fence tip hidden tilt action fragile skin nothing glory cousin green tomorrow spring wrist shed math olympic multiply hip blue scout claw"
```
{% endcode %}

Run the encryption command:

{% code title="terminal" %}
```
user@host package % clarinet deployments encrypt
Enter mnemonic to encrypt:
twice kind fence tip hidden tilt action fragile skin nothing glory cousin green tomorrow spring wrist shed math olympic multiply hip blue scout claw
Enter password: 

encrypted_mnemonic = "<encrypted_mnemonic>"
```
{% endcode %}

Replace the `mnemonic` field in your settings file with the `encrypted_mnemonic` output:

{% code title="settings/Mainnet.toml" %}
```toml
[accounts.deployer]
encrypted_mnemonic = "47hYHSp4gtoBabz4X8cByJtRbvD3tBemS1zZJTkxYh2LJ7cVAHY6z74Td8bF5Dcsdpv45gDELPwfBP8Mfk64Q8TsBJNU9sf5hWMrTKPtr5h9abSdmxu4m2BewbUCi4o8znn42nAd7yphcb345YCrYLJFqFC7k9LqXvxgbQxUiFpWeyTVJPkGFa3aiQ8G5uhrv7pLCer4kRmXsmXbBvEqwEQLG7eM3TUMzUP79mHqJ1HGe2XWn"
```
{% endcode %}

The next time you deploy, you will be prompted for the password:

{% code title="terminal" %}
```
user@host package % clarinet deployments apply --mainnet

Enter password to decrypt mnemonic for account deployer: 
```
{% endcode %}

</details>

***

### New Tutorials Section

_December 7, 2025_

The new [Tutorials](https://app.gitbook.com/s/skGYu79qDNfITOqDNU3s/) section is now live on the Stacks docs!

First up: the beloved [Bitcoin Primer](https://app.gitbook.com/s/skGYu79qDNfITOqDNU3s/bitcoin-primer) by Kenny Rogers.

We're building a collection of the best full, end-to-end tutorials in the Stacks ecosystem. If you want to contribute a complete tutorial related to developing on Stacks, let us know!

***

### Clarity 4 is Now LIVE!

_November 18, 2025_

SIP-033 and SIP-034 officially activated at Bitcoin block 923222 – bringing Clarity 4 live on Stacks, the smart contract layer secured by Bitcoin.

This upgrade introduces Version 4 of the Clarity smart contract language, marking a major advancement for the Stacks ecosystem. For users, it delivers safer, smarter contracts with enhanced built-in protections. For builders, it unlocks five powerful new functions that make developing secure, flexible, and Bitcoin-native DeFi applications easier than ever.

<details>

<summary>Details</summary>

### What Clarity 4 Means for Bitcoin Builders

#### 1. On-Chain Contract Verification

Developers can now fetch the hash of another contract's code body using [`contract-hash?`](https://docs.stacks.co/reference/clarity/functions#contract-hash).

This makes it possible for one contract to verify that another follows a specific template before interacting with it – a major step toward safer, more trustless bridges and marketplaces that can support a wider range of assets.

#### 2. Allowing Contracts to Set Post-Conditions

New functions allow contracts to set post-conditions that protect their assets using [`restrict-assets?`](https://docs.stacks.co/reference/clarity/functions#restrict-assets).

This means a contract can safely call external contracts (such as traits) and automatically roll back any changes if the executed code moves assets beyond what's allowed.

#### 3. Convert Simple Values into ASCII Strings

Clarity 4 adds [`to-ascii?`](https://docs.stacks.co/reference/clarity/functions#to-ascii) to convert simple values like booleans or principals into ASCII strings.

This makes it easier to generate readable, string-based messages – a useful tool for developers building cross-chain features and integrations.

#### 4. Get the Timestamp of the Current Block

A new keyword [`stacks-block-time`](https://docs.stacks.co/reference/clarity/keywords#stacks-block-time) lets developers retrieve the timestamp of the current block.

This addition enables time-based logic in smart contracts – an essential capability for building features like yield schedules, lockups, or expiration conditions in DeFi applications.

#### 5. Native Passkey Integration

Clarity 4 introduces [`secp256r1-verify`](https://docs.stacks.co/reference/clarity/functions#secp256r1-verify) enabling on-chain verification of secp256r1 signatures.

This lays the groundwork for passkey-based authentication, opening the door to features like hardware-secured wallets and biometric transaction signing.

#### 6. Dimension-Specific Tenure Extensions

The SIP-033 vote also included technical rider SIP-034, which introduces dimension-specific tenure extensions. Signers can approve resets to one budget dimension (e.g., read-count) without resetting the others, allowing high-throughput workloads even when the cost model is pessimistic.

### Why This Matters for Bitcoin

Clarity 4 strengthens Stacks' position as Bitcoin's liquidity layer by giving developers the tools to build more sophisticated Bitcoin DeFi applications – all secured by Bitcoin through Stacks' Proof of Transfer mechanism.

Whether you're building Bitcoin lending protocols, yield products with sBTC, or the next generation of BTCFi applications, Clarity 4 delivers the security and functionality Bitcoin capital markets demand.

#### Additional Resources

* [SIP-033 specification](https://github.com/stacksgov/sips/pull/218)
* [SIP-034 specification](https://github.com/314159265359879/sips/blob/9b45bf07b6d284c40ea3454b4b1bfcaeb0438683/sips/sip-034/sip-034.md)
* [Hiro Youtube: Dev N' Tell with Brice on new Clarity 4 features](https://youtu.be/oJgacfc7YVk?si=b72bNicdS8NjUpml)

</details>

***

### Clarinet Migrated to Stacks Labs

_November 5, 2025_

The Clarinet repository now belongs to the stx-labs organization.

With the **3.9.0** release, several changes were introduced:

* NPM packages are now published under the `@stacks` organization
* The Clarity VSCode extension is now published under the Stacks Labs organization

<details>

<summary>Migration Guide</summary>

### Migration Checklist

✅ Update NPM packages:
* `"@stacks/clarinet-sdk": "^3.10.0"`
* `"vitest-environment-clarinet": "3.0.2"`

✅ Replace all imports of `@hiroystems/clarinet-sdk` with `@stacks/clarinet-sdk`

✅ Optionally, update Vitest to v4 and **update vitest config**

***

### How to Migrate

#### VSCode

In VSCode (or variants such as Cursor), uninstall the Hiro Systems "Clarity" extension in favor of the new "Clarity - Stacks Labs" extension published by Stacks Labs. The name will eventually revert to "Clarity" once the Hiro extension is deprecated. 

View the extension in the [online marketplace](https://marketplace.visualstudio.com/items?itemName=StacksLabs.clarity-stacks).

#### NPM

New Clarinet projects created with 3.9.0 automatically use the `@stacks/` NPM package. Older projects require manual updates.

**`package.json`**

Replace `@hirosystems/clarinet-sdk` with the `@stacks` version, and upgrade `vitest-environment-clarinet` to version 3.0.1 or later:

```json
"dependencies": {
  "@stacks/clarinet-sdk": "^3.10.0",
  "@stacks/transactions": "^7.3.0",
  "@types/node": "24.10.0",
  "chokidar-cli": "3.0.0",
  "vitest": "^4.0.7",
  "vitest-environment-clarinet": "3.0.2"
}
```

**`tsconfig.json`**

Update the `"includes"` config to use `@stacks/clarinet-sdk`:

```json
"include": ["node_modules/@stacks/clarinet-sdk/vitest-helpers/src", "tests"]
```

**`vitest.config.ts` (or `.js`)**

Import from `@stacks/clarinet-sdk/vitest` and ensure `defineConfig` is imported from `"vitest/config"` (not `"vite"`):

```javascript
import { defineConfig } from "vitest/config";
import {
  vitestSetupFilePath,
  getClarinetVitestsArgv,
} from "@stacks/clarinet-sdk/vitest";
```

If you upgraded to Vitest v4, additional changes are needed in `defineConfig`:

```javascript
export default defineConfig({
  test: {
    environment: "clarinet",
    pool: "forks",
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

#### Docker Image

The Clarinet Docker image has been moved from Docker Hub to GitHub Container Registry (ghcr):

```yaml
jobs:
  sanity-checks:
    runs-on: ubuntu-latest
    container: ghcr.io/stx-labs/clarinet:latest
    steps:
      - uses: actions/checkout@v4
      - name: Check Clarity contracts
        run: clarinet check --use-on-disk-deployment-plan
      - name: Check Clarity contracts format
        run: clarinet fmt --check
```

#### Verification

Search for all occurrences of `@hirosystems/clarinet-sdk` in your project and update them to `@stacks/clarinet-sdk`.

{% hint style="success" %}
Third-party tools like Rendezvous and Clarigen now both support `@stacks/clarinet-sdk`.
{% endhint %}

***

### Example Migration

See how the clarity-starter project was updated: [stx-labs/clarity-starter#17](https://github.com/stx-labs/clarity-starter/pull/17)

### Support

If you experience any issues with the migration, reach out in the `#clarinet` channel on Discord or reply to the relevant discussion thread.

</details>
