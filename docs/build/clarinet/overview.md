---
description: >-
  Clarinet is everything you need to write, test, and deploy Clarity smart
  contracts on Stacks.
---

# Overview

Clarinet is a development framework and Clarity runtime packaged as a command line tool, designed to facilitate smart contract understanding, development, testing and deployment. It contains a suite of tools for building, testing, and deploying Clarity smart contracts for the Stacks blockchain.

Clarinet is the fastest way to build, test, and deploy smart contracts on the Stacks blockchain. It gives you a local devnet, REPL, testing framework, and debugging tools to ship high-quality Clarity code with confidence.

{% hint style="success" %}
For the latest releases and versions of Clarinet, check out the open-source repo [here](https://github.com/stx-labs/clarinet).
{% endhint %}

<div data-with-frame="true"><figure><img src="../.gitbook/assets/clarinet-diagram.png" alt=""><figcaption></figcaption></figure></div>

## Key features

* [**Leverage a powerful CLI**](https://app.gitbook.com/s/GVj1Z9vMuEOMe7oH7Wnq/clarinet/cli-reference) - Create new projects, manage your smart contracts and their dependencies using clarinet requirements, and interact with your code through the built-in REPL.
* [**Write unit tests with the SDK**](testing-with-clarinet-sdk.md) - Use the Clarinet SDK to write unit tests in a familiar JS environment and validate contract behavior.
* [**Run a private blockchain environment**](local-blockchain-development.md) - Spin up a local devnet with nodes, miners, and APIs so you can test and integrate your code.
* [**VSCode extension**](integrations/clarity-vscode-extension.md) - Linter, step by step debugger, helps writing smart contracts (autocompletion, documentation etc).

## Installation

{% tabs %}
{% tab title="Homebrew" %}
```bash
brew install clarinet
```
{% endtab %}

{% tab title="Winget" %}
```bash
winget install clarinet
```
{% endtab %}

{% tab title="Source" %}
```bash
sudo apt install build-essential pkg-config libssl-dev
git clone https://github.com/stx-labs/clarinet
cd clarinet
cargo clarinet-install
```
{% endtab %}

{% tab title="Binary" %}
```bash
wget -nv https://github.com/stx-labs/clarinet/releases/latest/download/clarinet-linux-x64-glibc.tar.gz -O clarinet-linux-x64.tar.gz
tar -xf clarinet-linux-x64.tar.gz
chmod +x ./clarinet
mv ./clarinet /usr/local/bin
```
{% endtab %}
{% endtabs %}

## Networks

Clarinet supports different network types to cater to various development and testing needs.

| Network   | Description                                                                 | Use case                                                           |
| --------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `simnet`  | Optimized for fast feedback loops, introspection, and portability.          | Ideal for initial development and unit-testing.                    |
| `devnet`  | Local Stacks and Bitcoin nodes running on Docker for faster feedback loops. | Use for integration tests or local frontend development.           |
| `testnet` | A pre-production network that offers a realistic environment for testing.   | Ideal for final testing before deploying to Mainnet.               |
| `mainnet` | The production network where real transactions occur.                       | Use when you're ready to deploy your smart contract to production. |

For a deeper understanding of when to use these networks, check out the dedicated blog post by Hiro [here](https://www.hiro.so/blog/devnet-vs-testnet-vs-mainnet-what-do-they-mean-for-web3-developers).

***

### Additional Resources

* \[[Hiro Blog](https://www.hiro.so/blog/clarinet-roadmap-looking-to-the-future)] The Humble Beginning of Clarinet

***

{% hint style="info" %}
Help: Need help building with Clarinet?

Reach out to us on the **#clarinet** channel on [Discord](https://stacks.chat/) under the Developer Tools section.
{% endhint %}
