---
description: Check out the latest Stacks developer updates
---

# Latest Updates

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
