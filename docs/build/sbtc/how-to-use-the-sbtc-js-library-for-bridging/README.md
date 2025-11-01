---
description: >-
  A Javascript/Typescript package for integrating your own peg-in/out bridging
  flow.
---

# How to Use the sBTC JS Library for Bridging

Currently, the official [sBTC Bridge app](https://sbtc.stacks.co/) provides users the interface for pegging BTC into sBTC, and vice versa. Building your own sBTC bridging app would consist of working with the construction of bitcoin P2TR transactions, handling user UTXOs, broadcasting transactions, notifying the sBTC Signers' of incoming transactions, and etc. You could check out the complexity of that in the sBTC Bridge app's open-source repo [here](https://github.com/stacks-sbtc/sbtc-bridge). But thankfully there is a library for all of that.

The [`sbtc`](https://www.npmjs.com/package/sbtc) npm library was built to abstract away the complexities of the bridging process of sBTC.

{% hint style="info" %}
Check out the `sbtc` reference [section](https://app.gitbook.com/s/GVj1Z9vMuEOMe7oH7Wnq/stacks.js-references/sbtc) for definitions, configurations, and more examples.
{% endhint %}

#### **Architecture**

* **Bitcoin:** The original funds are sourced from Bitcoin. A depositor sends these funds to a group of signers, which manage a (rotating) multisignature address formatted for sBTC transactions.
* **sBTC API (Emily):** This API is responsible for tracking deposits and notifying the signers about pending deposits.
* **Stacks:** The network where sBTC is minted. Once the deposit is confirmed, the signers mint the corresponding amount of sBTC to the depositor's specified address on the Stacks network.

#### This guide will provide a walkthrough of using the `sbtc` library for:

* **Depositing**: pegging BTC into sBTC
* **Withdrawing**: pegging sBTC into BTC
