# Deposit

The deposit operation enables users to mint sBTC, anchored to the BTC they have placed in the threshold wallet on the Bitcoin chain. This process can be completed within a single Bitcoin block, streamlining the user experience.

## Process Overview

![deposit diagram](<../../.gitbook/assets/AD_4nXdlY8MKm4IEls6XieRtpunfge6KTNSw2HT_o9iD8FgIL3RCJuzKa781Ft oXNCEn_rIqMqu0_hqD5 GPrF9cT6rFXdnA1BASFoU3Uy6VgR2ARfp 0FnLgrM7GH7hdx Ia2m_DpdonZmlwqTMd1sQe0XqgX4>)

The deposit process begins when a user initiates a specific Bitcoin transaction that has two outputs. The depositor (usually through the application they are using to deposit) then initiates an API call referencing that Bitcoin transaction. This call triggers the Emily API, which relays deposit information to the sBTC Signers. These signers verify and process the deposit. Once verified, an equivalent amount of sBTC is minted on the Stacks blockchain.

{% stepper %}
{% step %}
#### Script output

A script that lets the signers spend the funds.
{% endstep %}

{% step %}
#### Time-locked output

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
