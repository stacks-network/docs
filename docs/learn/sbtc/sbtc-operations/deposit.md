---
description: Converting BTC to sBTC.
---

# Deposit

The deposit operation enables users to mint sBTC, anchored to the BTC they have placed in the threshold wallet on the Bitcoin chain. This process can be completed within a single Bitcoin block, streamlining the user experience.

## Process Overview

<div data-with-frame="true"><img src="../../.gitbook/assets/Stacks_graphic - 64.png" alt="deposit diagram"></div>

The deposit process begins when a user initiates a specific Bitcoin transaction that has two outputs. The depositor (usually through the application they are using to deposit) then initiates an API call referencing that Bitcoin transaction. This call triggers the Emily API, which relays deposit information to the sBTC Signers. These signers verify and process the deposit. Once verified, an equivalent amount of sBTC is minted on the Stacks blockchain.

{% stepper %}
{% step %}
**Script output**

A script that lets the signers spend the funds.
{% endstep %}

{% step %}
**Time-locked output**

A time lock that allows the depositor to reclaim the funds if necessary.
{% endstep %}
{% endstepper %}

The deposit is usually completed within a single Bitcoin block, but is guaranteed to be completed within 3. For more information on deposit and withdrawal confirmation times and why deposits can be so fast, check out the [Deposit and Withdrawal Times](deposit-vs-withdrawal-times.md) doc.

## Bitcoin Deposit Requirements

For a deposit to be considered valid, it must adhere to specific requirements:

* The deposit must be made to a taproot address.
* The output must be spendable by a consensus threshold of signers.
* The deposit must follow a format that prevents short-term clawbacks, ensuring the security and integrity of the system.

## User Experience

From a user's perspective, the deposit process is straightforward:

1. Initiate a BTC transaction to the specified address.
2. Wait for the transaction to be confirmed on the Bitcoin blockchain.
3. Receive the equivalent amount of sBTC in the Stacks wallet once the deposit is verified and processed.

To enhance the user experience, an sBTC bridge web application is currently in development which will provide an intuitive interface for users to track the status of their deposit operations, allowing users to stay informed throughout the process from initiation to completion.
