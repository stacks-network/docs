# Overview

<figure><img src="../.gitbook/assets/stacksjs-learn.png" alt=""><figcaption><p>source: <a href="https://www.hiro.so/blog/taking-a-look-at-recent-stacks-js-improvements">Hiro blog</a></p></figcaption></figure>

## Overview

Stacks.js is a collection of JavaScript libraries that enable you to build web applications on the Stacks blockchain. From wallet authentication to smart contract interactions.

{% hint style="success" %}
For the latest releases and versions of Stacks.js packages, check out its open-source repo [here](https://github.com/stx-labs/stacks.js).
{% endhint %}

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

* `@stacks/api`
* `@stacks/auth`
* `@stacks/encryption`
* `@stacks/network`
* `@stacks/stacking`
* `@stacks/transactions`
* `@stacks/bns`
* `@stacks/common`
* `@stacks/profile`
* `@stacks/storage`
* `@stacks/wallet-sdk`

***

{% hint style="info" %}
Need help building with Stacks.js?

Reach out to us on the **#stacks-js** channel on [Discord](https://stacks.chat/) under the Developer Tools section.
{% endhint %}
