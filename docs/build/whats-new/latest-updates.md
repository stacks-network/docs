---
description: Check out the latest Stacks developer updates
---

# Latest Updates

### Start Cookin' with the Cookbook

_January 30, 2026_

The [Cookbook](https://app.gitbook.com/s/uholC0CdufHxYs050O3V/) contains detailed coding snippets known as recipes. Recipes are focused and reusable. They are designed to be referenced, copied, and adapted.

This section provides focused, reusable Clarity and Stacks.js code snippets that solve common problems or demonstrate specific patterns—designed to be referenced, copied, and adapted rather than read end-to-end.

***

### New 'Path To Production' Guide

_January 26, 2026_

Are you a new developer looking for security resources and best practices for when you're ready for testing or deploying? This page provides an outline of checklist items that you can use to further battle-test your contracts. Head to the [**Path To Production**](../get-started/path-to-production.md) guide to see what steps you can take to harden your project before mainnet production.

***

### Catch Dead Code Early with Clarity Linting

_January 14, 2026_

The latest Clarinet [v3.13.0](https://github.com/stx-labs/clarinet/releases/tag/v3.13.0) release includes a built-in Clarity linter to `clarinet check`, enabling dead code analysis and no-op detection, with configurable lint levels and inline overrides. The initial release focuses on identifying unused code and expressions that have no effect on execution. Lint behavior can be customized globally or per rule via `Clarinet.toml`.

<details>

<summary>Details</summary>

Today, Clarinet introduces a built-in **Clarity linter** as part of `clarinet check`, designed to help developers catch common mistakes, eliminate dead code, and improve overall contract quality earlier in the development cycle.

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

In addition, Clarinet includes the **`noop`** lint (contributed by GitHub user [0xalpharush](https://github.com/0xalpharush)), which flags expressions that have no effect, such as: `(is-eq 1)`

#### Suppressing Lints

Some unused code is intentional—for example, private functions used only in tests or bindings whose evaluation has side effects.

To handle these cases, Clarinet supports:

#### Identifier-based suppression

Appending a trailing `_` to an identifier might generate other kinds of warnings but the linter will allow them to be unused, following a convention similar to Rust. (Note: _prefixing_ identifiers with `_` is not yet supported.)

#### Line-level suppression

Individual lints can also be disabled on a per-line basis using Clarity annotations:

```clarity
;; #[allow(lint_name)]
```

#### Configuration

All non-style/non-cosmetic lints are enabled by default at `warning` level. Style lints may be enabled by default at `notice` eventually.

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

#### What’s Next

This release lays the foundation for a broader linting system in Clarinet. Upcoming work includes:

* **Style lints** for consistent and idiomatic Clarity code
* **Performance lints** to surface inefficient patterns
* **Safety lints** to help identify potentially dangerous constructs

If you have ideas for additional lints, feedback can be shared via the [Clarinet GitHub issue](https://github.com/stx-labs/clarinet/issues/2028) or in the community Discord.

Navigate to the Clarinet section on [this](../clarinet/validation-and-analysis.md).

</details>

***

### Completion of dimension-specific tenure extension

_January 12, 2026_

\[[Stacks Core 3.3.0.0.4](https://github.com/stacks-network/stacks-core/releases/tag/3.3.0.0.4)] With dimension-specific tenure extensions, Stacks can extend block limits per dimension (likeruntimeandread\_countbudgets) instead of stopping early. This ensures DeFi protocols can process critical flows during high-volatility periods. Hear Alex Huth talk about this during the latest DevRel office hours [here](https://x.com/StacksDevs/status/2017601390345130421).

***

### Multiple language support for Learn

_January 9, 2026_

The [Learn](https://app.gitbook.com/s/H74xqoobupBWwBsVMJhK/) section now supports Chinese and Spanish, helping more developers access clear explanations of how Stacks works. You can switch languages using the selector in the top-right corner of the Learn pages.

***

### Bridging USDCx developer guide

_January 8, 2026_

Developers can now programmatically integrate the USDCx bridging flow into their app. Deposits are initiated on Ethereum and automatically minted on Stacks, while withdrawals are initiated on Stacks and settled on Ethereum. Check out the guide [here](../more-guides/bridging-usdcx.md) and start enabling stablecoin liquidity across the Stacks DeFi ecosystem.

***

### Multiple network URLs supported in RPC-API playground

_December 29, 2025_

The API playground in the [RPC-API reference](https://app.gitbook.com/s/GVj1Z9vMuEOMe7oH7Wnq/node-operations/rpc-api) now supports testnet and mainnet. Use the interactive API playground to test API calls on mainnet, testnet, devnet, or for your own locally running Stacks node.

***

### Stacks Blockchain API v8.13.6 is live

_December 22, 2025_

\[Hiro] This is a required upgrade for all API users (incl. partners & exchanges): adds support for smart contracts deployed with empty source code.

It's an easy upgrade: no DB migrations, and fully compatible with the current chainstate.

See more in Hiro's release notes [here](https://github.com/hirosystems/stacks-blockchain-api/releases/tag/v8.13.6).

***

### USDCx now live on mainnet

_December 18, 2025_

New docs section dedicated to the launch of USDCx is now live [here](https://app.gitbook.com/s/H74xqoobupBWwBsVMJhK/bridging/usdcx). Learn about its interoperable architecture with Circle's xReserve and discover the Clarity contracts behind the new USDCx token.

***

### Stacks Miners — Please Update ASAP!

_December 12, 2025_

This release activates the new read-count tenure extensions from SIP-034, a highly anticipated upgrade for builders across the ecosystem.

It also includes several important bug fixes, making this an update you don’t want to delay.

<details>

<summary>Details</summary>

For the latest release: [https://github.com/stacks-network/stacks-core/releases/tag/3.3.0.0.2](https://github.com/stacks-network/stacks-core/releases/tag/3.3.0.0.2)

#### Details on what was updated

**Added**

* Fixed an issue where `event.committed` was always equal to `true` in the block replay RPC endpoint
* Added `result_hex` and `post_condition_aborted` to the block replay RPC endpoint
* Added `--epoch <epoch_number>` flag to `clarity-cli` commands to specify the epoch context for evaluation.
* Support read-count tenure extends
* Added `read_count_idle_timeout_secs` config option to set the amount of seconds of idle time must pass before a read-count tenure extend is allowed (defaults to 20 seconds)
* Send a read-count tenure extend timestamp in the block responses
* Approve a block with a read-count tenure extend when the appropriate amount of idle time has passed

**Fixed**

* Correctly produce the receipt for the `costs-4` contract, which was deployed on epoch 3.3 activation. Users who consume node events and want to fill in the missing receipt (e.g. the Hiro API) will need to revert their chainstate to before the 3.3 activation and then resume sync to receive the previously missing event.

</details>

***

### Upgrade to Dual Stacking contracts

_December 10, 2025_

Dual Stacking contracts will be **upgraded on Dec 15**. This upgrade enables more flexible reward parameters and allows users to view their sBTC holdings and corresponding rewards within the Dual Stacking app.

<details>

<summary>Details</summary>

#### tl;dr

* If you enrolled in Dual Stacking you'll be moved over automatically with no action needed.
* If you did not enroll in the web app but were receiving Dual Stacking rewards through a participating app, you need to enroll on the web app.

To check your enrollment status go to [app.stacks.co](https://app.stacks.co/).

The contract will upgrade from `.dual-stacking-v1` to `.dual-stacking-v2_0_2` .

</details>

***

### Deploy in Clarinet using encrypted mnemonics

_December 9, 2025_

`clarinet 3.11.0` contains support for encrypted mnemonics. This feature gives users the option to encrypt the mnemonic seed phrase in their deployment files, so if a user's machine is compromised by a filesystem reading vulnerability, the seed phrase is not leaked to the attacker.

<details>

<summary>Details</summary>

To use this feature, a user must first run `clarinet deployments encrypt`, which will prompt the user for the seed phrase and a password, then print the encrypted mnemonic to the console. The user can then put the resulting ciphertext into their deployment config file using the key `encrypted_mnemonic`. The next time the user runs `clarinet deployments apply`, they will be prompted for the password, and the mnemonic will be decrypted for use in that session.

For example, if your `settings/Mainnet.toml` file looks like this:

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

You would then run:

{% code title="terminal" %}
```
user@host package % clarinet deployments encrypt
Enter mnemonic to encrypt:
twice kind fence tip hidden tilt action fragile skin nothing glory cousin green tomorrow spring wrist shed math olympic multiply hip blue scout claw
Enter password: 

encrypted_mnemonic = "<encrypted_mnemonic>"
```
{% endcode %}

You would then replace the `mnemonic` field in your settings file with the `encrypted_mnemonic` output above:

{% code title="settings/Mainnet.toml" %}
```toml
[accounts.deployer]
encrypted_mnemonic = "47hYHSp4gtoBabz4X8cByJtRbvD3tBemS1zZJTkxYh2LJ7cVAHY6z74Td8bF5Dcsdpv45gDELPwfBP8Mfk64Q8TsBJNU9sf5hWMrTKPtr5h9abSdmxu4m2BewbUCi4o8znn42nAd7yphcb345YCrYLJFqFC7k9LqXvxgbQxUiFpWeyTVJPkGFa3aiQ8G5uhrv7pLCer4kRmXsmXbBvEqwEQLG7eM3TUMzUP79mHqJ1HGe2XWn"
```
{% endcode %}

Then the next time you deploy your package, you will be prompted for the password:

{% code title="terminal" %}
```
user@host package % clarinet deployments apply --mainnet

Enter password to decrypt mnemonic for account deployer: 
```
{% endcode %}

</details>

***

### New Tutorials section

_December 7, 2025_

The new [Tutorials](https://app.gitbook.com/s/skGYu79qDNfITOqDNU3s/) section is now live on the Stacks docs!&#x20;

First up: the beloved [Bitcoin Primer](https://app.gitbook.com/s/skGYu79qDNfITOqDNU3s/bitcoin-primer) by Kenny Rogers.

We’re building a collection of the best full, end-to-end tutorials in the Stacks ecosystem. If you want to contribute a complete end-to-end tutorial related to developing on Stacks, let us know!

***

### Clarity 4 is now LIVE!

_November 18, 2025_

SIP-033 and SIP-034 have officially activated at Bitcoin block 923222 – bringing Clarity 4 live on Stacks, the smart contract layer secured by Bitcoin.

This upgrade introduces Version 4 of the Clarity smart contract language, marking a major step forward for the Stacks ecosystem. For users, it delivers safer, smarter contracts with enhanced built-in protections.

For builders, it unlocks five powerful new functions that make developing secure, flexible, and Bitcoin-native DeFi applications easier than ever.

<details>

<summary>Details</summary>

### What Clarity 4 Means for Bitcoin Builders

#### 1. On-chain Contract Verification

Developers can now fetch the hash of another contract’s code body.

[`contract-hash?`](https://docs.stacks.co/reference/clarity/functions#contract-hash)

This makes it possible for one contract to verify that another follows a specific template before interacting with it – a major step toward safer, more trustless bridges and marketplaces that can support a wider range of assets.

#### 2. Allowing Contracts to Set Post-Conditions

New functions allow contracts to set post-conditions that protect their assets.

[`restrict-assets?`](https://docs.stacks.co/reference/clarity/functions#restrict-assets)

This means a contract can safely call external contracts (such as traits) and automatically roll back any changes if the executed code moves assets beyond what’s allowed.

#### 3. Convert Simple Values into ASCII Strings

Clarity 4 adds a function to convert simple values like booleans or principals into ASCII strings.

[`to-ascii?`](https://docs.stacks.co/reference/clarity/functions#to-ascii)

This makes it easier to generate readable, string-based messages – a useful tool for developers building cross-chain features and integrations.

#### 4. Get the Timestamp of the Current Block

A new keyword lets developers retrieve the timestamp of the current block.

[`stacks-block-time`](https://docs.stacks.co/reference/clarity/keywords#stacks-block-time)

This addition enables time-based logic in smart contracts – an essential capability for building features like yield schedules, lockups, or expiration conditions in DeFi applications.

#### 5. Native Passkey Integration

Clarity 4 introduces a new function enabling on-chain verification of secp256r1 signatures.

[`secp256r1-verify`](https://docs.stacks.co/reference/clarity/functions#secp256r1-verify)

This lays the groundwork for passkey-based authentication, opening the door to features like hardware-secured wallets and biometric transaction signing.

#### 6. Dimension-specific Tenure Extensions

The SIP-033 vote also included technical rider SIP-034, which introduces dimension-specific tenure extensions. Signers can approve resets to one budget dimension (e.g., read-count) without resetting the others, allowing high-throughput workloads even when the cost model is pessimistic.

### Why This Matters for Bitcoin

Clarity 4 strengthens Stacks' position as Bitcoin's liquidity layer by giving developers the tools to build more sophisticated Bitcoin DeFi applications – all secured by Bitcoin through Stacks' Proof of Transfer mechanism.

Whether you're building Bitcoin lending protocols, yield products with sBTC, or the next generation of BTCFi applications, Clarity 4 delivers the security and functionality Bitcoin capital markets demand.

Check out [the full SIP-033](https://github.com/stacksgov/sips/pull/218) & [SIP-034](https://github.com/314159265359879/sips/blob/9b45bf07b6d284c40ea3454b4b1bfcaeb0438683/sips/sip-034/sip-034.md) specifications.

***

#### Additional Resources

* \[[Hiro Youtube](https://youtu.be/oJgacfc7YVk?si=b72bNicdS8NjUpml)] A Dev N' Tell with Brice on new Clarity 4 features

</details>

***

### Clarinet was migrated to Stacks Labs

_November 5, 2025_

You may have noticed that the Clarinet repository now belongs to the stx-labs organization.

With the **3.9.0** release, a few other things have changed:

* The NPM packages are now published under the `@stacks` organization.
* The Clarity VSCode extension is now published under the Stacks Labs organization.

<details>

<summary>Details</summary>

### tl;dr

Checklist:\
✅ Update NPM packages:

* `"@stacks/clarinet-sdk": "^3.10.0"`
* `"vitest-environment-clarinet": "3.0.2"`\
  ✅ Replace all imports of `@hiroystems/clarinet-sdk` to `@stacks/clarinet-sdk`\
  ✅ Optionally, update Vitest to v4 and **update vitest config**

***

### How to migrate?

#### VSCode

In VSCode (or similar variants such as Cursor), you'll have to uninstall the Hiro Systems "Clarity" extension in favor of the new "Clarity - Stacks Labs" extension published by Stacks Labs. The name of the extension will eventually revert to "Clarity" at some point, once the Hiro one is deprecated. You can also see it in the [online marketplace](https://marketplace.visualstudio.com/items?itemName=StacksLabs.clarity-stacks) - feel free to leave a 5 ⭐ review if you enjoy Clarinet!

#### NPM

New Clarinet projects created with 3.9.0 will automatically use the `@stacks/` NPM package.

However, older projects require a few manual updates to be migrated.

#### `package.json`

In your package.json, replace `@hirosystems/clarinet-sdk` with the `@stacks` one, and upgrade `vitest-environement-clarinet` to version 3.0.1. Your dependencies should look like that.

Optionally, you can upgrade to Vitest@4, more on that below

```
  "dependencies": {
    "@stacks/clarinet-sdk": "^3.10.0",
    "@stacks/transactions": "^7.3.0",
    "@types/node": "24.10.0",
    "chokidar-cli": "3.0.0",
    "vitest": "^4.0.7",
    "vitest-environment-clarinet": "3.0.2"
  }
```

#### `tsconfig.json`

In the tsconfig.json, you need to update the `"includes"` config like so, so that is using `@stacks/clarinet-sdk`

```
  "include": ["node_modules/@stacks/clarinet-sdk/vitest-helpers/src", "tests"]
```

#### `vitest.config.ts` (or `.js`)

Your Vitest config has to import `@stacks/clarinet-sdk/vitest`.

Double check that you import `defineConfig` from `"vitest/config"` and not `"vite"`.

```
import { defineConfig } from "vitest/config";
import {
  vitestSetupFilePath,
  getClarinetVitestsArgv,
} from "@stacks/clarinet-sdk/vitest";
```

If you upgraded to Vitest v4, a few other changes are needed in `defineConfig`:

```
...

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

#### Docker image

The Clarinet Docker image has been moved from Docker Hub to GitHub Container Registry (ghcr). It can be used like so:

```
jobs:
  sanity-checks:
    runs-on: ubuntu-latest
    container: ghcr.io/stx-labs/clarinet:latest
    steps:
      - uses: actions/checkout@v4
      - name: Check Clarity contracts check
        run: clarinet check --use-on-disk-deployment-plan
      - name: Check Clarity contracts format
        run: clarinet fmt --check
```

#### Double check

Search for all occurrences of `@hirosystems/clarinet-sdk` in your project; they'll likely need to be updated to `@stacks/clarinet-sdk`.

{% hint style="success" %}
If you're using third-party tools like Rendezvous or Clarigen, they now both support `@stacks/clarinet-sdk`.
{% endhint %}

***

### See it in action

See how the clarity-starter project was updated in this PR:\
[stx-labs/clarity-starter#17](https://github.com/stx-labs/clarity-starter/pull/17)

### Conclusion

We understand that these types of breaking changes can be frustrating. Although it's not ideal, we need it to move forward.

If you experience any issues with the migrations, reach out to us in the `#clarinet` channel on Discord or reply to this discussion.

</details>
