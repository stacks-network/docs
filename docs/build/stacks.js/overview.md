# Overview

<div data-with-frame="true"><figure><img src="../.gitbook/assets/stacksjs-learn.png" alt=""><figcaption></figcaption></figure></div>

{% hint style="success" %}
For the latest releases and versions of Stacks.js packages, check out its open-source repo [here](https://github.com/stx-labs/stacks.js).
{% endhint %}

## Overview

Stacks.js is a comprehensive collection of JavaScript libraries designed to empower developers in creating sophisticated web applications on the Stacks network. These libraries facilitate a wide range of functionalities, from seamless wallet authentication to robust interactions with smart contracts. By leveraging Stacks.js, developers can efficiently build decentralized applications (dApps) that harness the full potential of the Stacks ecosystem.

## Key features

* **Transaction construction** - Build and broadcast all transaction types with type-safe APIs
* **Smart contract interaction** - Deploy contracts and call functions with automatic encoding
* **Wallet integration** - Connect to Leather, Xverse, and other Stacks wallets seamlessly
* **Post-conditions** - Protect users with built-in asset transfer validations

## Installation

Stacks.js is separated into focused packages published under the `@stacks` scope. Install only what you need:

{% tabs %}
{% tab title="Transactions" %}
{% code title="terminal" %}
```bash
npm install @stacks/transactions
```
{% endcode %}
{% endtab %}

{% tab title="Wallet Connections" %}
{% code title="terminal" %}
```bash
npm install @stacks/connect
```
{% endcode %}
{% endtab %}

{% tab title="Network Config" %}
{% code title="terminal" %}
```bash
npm install @stacks/network
```
{% endcode %}
{% endtab %}

{% tab title="Common Utils" %}
{% code title="terminal" %}
```bash
npm install @stacks/common
```
{% endcode %}
{% endtab %}
{% endtabs %}

Other available packages include:

| Package | Description |
| ------- | ----------- |
| `@stacks/auth` | Authentication and identity management for Stacks applications |
| `@stacks/encryption` | Encryption utilities for secure data handling |
| `@stacks/network` | Network configuration for mainnet, testnet, and devnet |
| `@stacks/stacking` | Stacking (PoX) operations and delegation management |
| `@stacks/transactions` | Transaction building, signing, and broadcasting |
| `@stacks/bns` | Bitcoin Name System (BNS) name registration and lookup |
| `@stacks/common` | Shared utilities and types across Stacks.js packages |
| `@stacks/wallet-sdk` | HD wallet generation and account derivation |

***

## Quick Example

Here's a simple example of reading data from a smart contract:

```typescript
import { fetchCallReadOnlyFunction } from '@stacks/transactions';
import { STACKS_MAINNET } from '@stacks/network';

const result = await fetchCallReadOnlyFunction({
  contractAddress: 'SP2C1WREHGM75C7TGFAEJPFKTFTEGZKF6F9D4RK2D',
  contractName: 'my-contract',
  functionName: 'get-counter',
  functionArgs: [],
  network: STACKS_MAINNET,
  senderAddress: 'SP2C1WREHGM75C7TGFAEJPFKTFTEGZKF6F9D4RK2D',
});

console.log(result);
```

***

{% hint style="info" %}
Need help building with Stacks.js?

Reach out to us on the **#stacks-js** channel on [Discord](https://stacks.chat/) under the Developer Tools section.
{% endhint %}

***

### Additional Resources

* \[[stacks.js.org](https://stacks.js.org/)] For a complete exhaustive list of definitions on types, methods, classes, & etc.
