# sBTC Builder Quickstart

<figure><img src="../../.gitbook/assets/Frame 316126251.jpg" alt=""><figcaption><p>source: Hiro</p></figcaption></figure>

Get up and running with sBTC in 30 minutes or less. This guide covers the essentials for working with sBTC as a SIP-010 token in your smart contracts.

### What is sBTC?

sBTC is Bitcoin on Stacks. It's a SIP-010 fungible token that maintains a 1:1 peg with Bitcoin, enabling you to use Bitcoin in smart contracts and DeFi applications on the Stacks blockchain.

Key points:

* **1:1 Bitcoin peg**: 1 sBTC always equals 1 BTC
* **SIP-010 token**: Works like any other fungible token on Stacks
* **Programmable**: Use Bitcoin in smart contracts, DeFi protocols, and dApps

### Quick Setup

#### Prerequisites

In order to get the most from this quickstart, you should familiarize yourself with Clarity, Clarinet, Stacks.js, and the Hiro Platform. These are the fundamental building blocks of building Stacks applications.

* [Stacks Developer Quickstart](https://app.gitbook.com/o/hoh4mQXTl8NvI3cETroY/s/Zz9BLmTU9oydDpL3qiUh/) - For a quick holistic introduction to the Stacks development process, tools, and fundamentals
* [Clarity Crash Course](../../get-started/clarity-crash-course.md) - For a quick introduction to Clarity
* [Clarinet Docs](https://docs.hiro.so/tools/clarinet)
* [Stacks.js Docs](https://docs.hiro.so/reference/stacks.js)

Choose your preferred development environment:

#### Hiro Platform (Recommended)

The fastest way to start building with sBTC is using the Hiro Platform's hosted devnet. The Platform integrates with your GitHub account. You can either import an existing project from GitHub or start with a Platform template and have it synced with your GitHub account.

After you create the project in the Platform, you can clone it locally and work with the Platform's cloud devnet by connecting your API key as described in the template's README files. This will allow you to work on your code locally but let Platform handle the complexities of actually running the devnet.

{% stepper %}
{% step %}
#### Create an account

Create an account at:\
https://platform.hiro.so
{% endstep %}

{% step %}
#### Create or import a project

* Select a template or import your own project from GitHub. There are several templates available to use as a starting point. Some have only smart contracts and some are full-stack dapp templates. Starting with one of these ensures you are building with best practices.
* Navigate to your project dashboard
{% endstep %}

{% step %}
#### Start devnet

* Click the "Devnet" tab
* Click "Start Devnet"
* Wait for status to show "Active"
{% endstep %}

{% step %}
#### Connect your wallet

* Your devnet wallets are automatically funded with STX and sBTC
* Use the provided wallet addresses within the templates
* The platform templates are automatically connected to Devnet, and there are instructions in the READMEs of the templates for how to connect your frontend to your Devnet instance
{% endstep %}
{% endstepper %}

#### Local with Clarinet

If you would prefer to have your devnet running locally instead of in the Platform cloud, you can run one yourself.

{% stepper %}
{% step %}
#### Install Clarinet (version 3.x)

```bash
brew install clarinet
```
{% endstep %}

{% step %}
#### Create a new project

```bash
clarinet new my-sbtc-project
cd my-sbtc-project
```
{% endstep %}

{% step %}
#### Add sBTC requirements

```bash
clarinet requirements add SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-deposit
```

This automatically includes the sBTC token contract in your Clarinet context so you can reference it within your contracts.
{% endstep %}

{% step %}
#### Start devnet

```bash
clarinet devnet start
```

With either of these options, your Devnet wallets are automatically funded with sBTC. You just need to include the sBTC contract in your contract requirements as shown above.
{% endstep %}
{% endstepper %}

### Working with sBTC in Smart Contracts

sBTC follows the SIP-010 standard, making it easy to integrate into your contracts.

The primary function you'll be using is the `transfer` function. That's because sBTC exists as a 1:1 Bitcoin peg via a SIP-010 token. Minting is handled by the protocol, the main function of writing smart contracts that use sBTC is to move it around, which means using the `transfer` function.

Here's a very basic example of how to transfer sBTC within your contract.

#### Basic Transfer Example

Create a new contract that accepts sBTC payments. You can do this within the Clarinet project folder with `clarinet contract new sbtc-payment`.

{% code title="contracts/sbtc-payment.clar" %}
```clarity
;; contracts/sbtc-payment.clar

;; Define the sBTC token contract reference
(define-constant sbtc-token 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token)

;; Error codes
(define-constant err-insufficient-balance (err u100))
(define-constant err-transfer-failed (err u101))

;; Accept sBTC payment
(define-public (pay-with-sbtc (amount uint) (recipient principal))
  (contract-call? sbtc-token transfer
    amount
    tx-sender
    recipient
    none))
```
{% endcode %}

You can test out this contract by either using the UI within the Platform to call the functions directly if you have devnet running or by opening the console with `clarinet console`.

Once you do that you'll see that your devnet accounts have automatically been funded with sBTC.

<figure><img src="../../.gitbook/assets/image (6).png" alt=""><figcaption></figcaption></figure>

Once you are ready to deploy to testnet, you can do so by editing your deployment plan as outlined in [this guide](https://docs.hiro.so/tools/clarinet/sbtc-integration).

### Conclusion

You can build pretty much anything you want using this simple foundation, as all of the complexity of sBTC is handled behind the scenes by the protocol.

What's needed now is for builders to take this foundation and build interesting, useful things with it. sBTC unlocks a lot of additional functionality for Bitcoin that previously would have only been possible with either custodied solutions or slow, complex solutions with poor UX.

If you are interested, you can read more about how sBTC works in the [sBTC Concept Guide](https://app.gitbook.com/s/H74xqoobupBWwBsVMJhK/sbtc).
