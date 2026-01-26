---
description: Security resources and best practices before & after production.
---

# Path to Production

<div data-with-frame="true"><figure><img src="../.gitbook/assets/production-checklist.png" alt=""><figcaption></figcaption></figure></div>

## Overview

Whether you build in traditional software or Web3, you never want to see a bug. You want users to interact with that code as it’s intended to function. You want their assets to be safe. You want their personal information to be private. Matter of fact, you want your assets and information to be secure too. That’s why the concept of production-hardening code exists.&#x20;

Let’s talk about best practices and some steps you can take to harden your project before mainnet production.

<details>

<summary>What are security issues specific to web3?</summary>

Blockchains are immutable, so any mistakes or vulnerabilities you deploy are permanently on-chain for all to see. Oops. This is even more true on Stacks because Clarity contracts are not compiled and are human-readable on-chain.

Alongside immutability, there are a few other security issues specific to Web3 that are worth mentioning here:

* **Decentralization**: Web3 applications operate in a decentralized environment, meaning there is no central authority to mediate disputes, recover lost funds, or fix bugs.
* **Public code**: Smart contract code is public. While in the long run, public, open source code makes for a more resilient system, it comes with attack vectors such as unchecked external contract calls, reentrancy attacks, unguarded state modifications, integer overflows/underflows, and more.
* **Economic incentives**: Smart contracts often handle real assets, in the form of digital tokens and NFTs, and the public can see those assets, introducing a higher level of risk. Mistakes in code can lead to significant financial loss.
* **Blockchain networks**: Different networks operate under different consensus algorithms that require additional consideration for security.
* **Private Key Management**: Unlike centralized systems where credentials can be reset, losing a private key in Web3 often means losing access to funds permanently.
* **Contract dependencies**: Your code may depend on other smart contracts, such as an oracle or a bridge, which can introduce third-party risk to your project.

</details>

***

## Pre-Production Ready Checklist

To ensure your app or smart contract is production-ready, we pulled together a simple checklist that you can use during your development.

{% stepper %}
{% step %}
### Specific Clarity/Stacks.js best practices

* [**Post-conditions**](/broken/pages/0KPrPPKItMGZZL2u4tiF): Post conditions are an additional safety feature built into the Stacks chain itself that help to protect end users. Rather than being a function of Clarity smart contracts, they are implemented on the client side and meant to be an additional failsafe against malicious contracts.
* [**Usage of `tx-sender` vs `contract-caller`**](https://www.setzeus.com/public-blog-post/clarity-carefully-tx-sender) : The usage of `tx-sender` versus another Clarity keyword, `contract-caller` , is always a tricky concept because it determines who actually initiated the transaction versus who invoked the current function. Both of them can have certain implications on security based on the context of your code.
* Write meaningful error codes to improve error handling
* Adopt a modular contract design approach

<details>

<summary>Other Clarity/Stacks.js security resources</summary>

* [Certik](https://www.certik.com/resources/blog/clarity-best-practices-and-checklist): Clarity: Best Practices and Checklists
* [Halborn](https://www.halborn.com/blog/post/understanding-clarity-the-future-of-secure-smart-contracts): Understanding Clarity: The Future of Secure Smart Contracts
* [Beosin](https://www.beosin.com/resources/stacks-and-its-clarity-contract-security): Stacks and its Clarity Contract Security
* [Jude Nelson](https://stacks.org/bringing-clarity-to-8-dangerous-smart-contract-vulnerabilities/): Bringing ‘Clarity’ to 8 Dangerous Smart Contract Vulnerabilities

</details>
{% endstep %}

{% step %}
### Plan for Fail-Safes and Emergency Upgrades

While contracts are immutable once deployed, you can deploy new versions of your contracts to upgrade your app. Make sure you have a deployment plan in place, so you can deploy a hot fix in the event you need to.

* [**ExecutorDAO framework**](https://github.com/MarvinJanssen/executor-dao): Adopt best practices for Clarity modularity that allows for contract upgradeability, strict access control, extensions, emergency proposals, and more.
{% endstep %}

{% step %}
### Implement comprehensive testing tools

* [**Unit tests**](../clarinet/testing-with-clarinet-sdk.md)
* [**Fuzzing**](/broken/pages/h06OJd7RHqUk2Dq7DHwJ)
* [**Devnet**](../clarinet/local-blockchain-development.md)
{% endstep %}

{% step %}
### Private Key Management

You’d be surprised how many hacks stem from simple security breaches. Make sure you securely manage your private keys related to your project. That includes things like always using hardware wallets, regularly rotate keys, enforce access controls for who on your team can use keys, and consider implementing a multi-sig for your treasury or other sensitive operations.
{% endstep %}

{% step %}
### Testing on Testnet

Testing contracts and applications on the Stacks testnet before deploying to the mainnet is crucial for ensuring the reliability and security of your project. Furthermore, the testnet provides an invaluable opportunity for gathering user feedback and stress-testing the application under various conditions, thereby enhancing overall confidence in the code before live deployment.

* [**Deploying to testnet**](../clarinet/contract-deployment.md)
* [**Testnet faucets**](https://platform.hiro.so/faucet): The Platform offers testnet faucets of STX and sBTC
{% endstep %}

{% step %}
### Simulate mainnet tests

If your contract relies heavily on already deployed external contracts or other forms of mainnet data, simulate your contracts as if it was already on mainnet. Instead of generating mock data locally (a time-intensive process that introduces its own risks and challenges), you can now rely on data that you’re confident will match what you’ll find on mainnet—because that’s exactly where the data now comes from.

* [**Mainnet Execution Simulation**](../clarinet/mainnet-execution-simulation.md): Leverage mainnet data in simnet/unit tests with Clarinet.
* [**stxer**](https://stxer.xyz/)**:** A community built simulation UI tool.
{% endstep %}

{% step %}
### Crowdsource community testing/review

To effectively crowdsource community beta testing for your application in Stacks, engage with various online platforms where Stacks developers and users congregate. Utilize places such as the Stacks community Forum or Discord channels to reach out to potential testers. Leverage social media platforms and GitHub repositories to announce the beta testing phase, inviting users to contribute feedback. Offer incentives such as exclusive early access features or branded merchandise to motivate participation and gather diverse insights that can enhance the robustness of your app.

* [**Stacks Discord**](https://discord.gg/stacks): Connect with other developers and our team
* [**Stacks Forum**](https://forum.stacks.org/): Ask questions and share projects
* [**Stacks Twitter**](https://x.com/StacksDevs)**:** Follow us on Twitter and ask us questions there
{% endstep %}

{% step %}
### Formal audits

Paying for formal smart contract auditors is an essential investment for ensuring the security and reliability of your blockchain application. By engaging reputable audit firms, you can gain a comprehensive understanding of potential risks and strategies to mitigate them, thus enhancing the trustworthiness of your application.

* [**List of professional auditors**](https://www.stacks.co/explore/ecosystem?category=Auditors#tools)
{% endstep %}
{% endstepper %}

***

## Post-Production Ready Checklist

{% stepper %}
{% step %}
### **Adopt Lean DevOps Strategies**

To ensure a smooth deployment process, adopt lean DevOps strategies, which include continuous integration and continuous delivery (CI/CD) pipelines. As discussed in[ Lean DevOps Strategies for Your Web3 Project](https://www.hiro.so/blog/lean-devops-strategies-for-your-web3-project), leveraging tools like GitHub Actions and GitLab CI/CD can help automate your deployment pipelines while ensuring code quality and consistency.
{% endstep %}

{% step %}
### Monitor contract activity

* [**Chainhooks**](https://docs.hiro.so/en/tools/chainhooks): Chainhooks is a webhook service for the Stacks blockchain that lets you register event streams and define precise filters to capture on-chain data as it happens.
{% endstep %}

{% step %}
### Regularly Update Dependencies

Always keep your dependencies up to date, especially for any libraries and frameworks you’ve used in your development. This can help reduce any vulnerabilities originating from those third-party packages.
{% endstep %}

{% step %}
### Stay up to date with @StacksDevs

Follow us on [Twitter](https://x.com/StacksDevs) and [Youtube](https://www.youtube.com/@stacks-developers) for the latest developer updates.
{% endstep %}
{% endstepper %}
