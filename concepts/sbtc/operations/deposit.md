# Deposit

The deposit operation enables users to mint sBTC, anchored to the BTC they have placed in the threshold wallet on the Bitcoin chain. This process can be completed within a single Bitcoin block, streamlining the user experience.

## Process Overview

<figure><img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXdlY8MKm4IEls6XieRtpunfge6KTNSw2HT_o9iD8FgIL3RCJuzKa781Ft-oXNCEn_rIqMqu0_hqD5-GPrF9cT6rFXdnA1BASFoU3Uy6VgR2ARfp-0FnLgrM7GH7hdx-Ia2m_DpdonZmlwqTMd1sQe0XqgX4?key=LMMtMf3zwOdkwel07ZrRiw" alt=""><figcaption></figcaption></figure>

The deposit process begins when a user initiates specific Bitcoin transaction that has two outputs:

1. Script that lets the signers spend it
2. Time lock to allow the depositor to reclaim

Next, the depositor (usually through the application they are using to deposit) initiates an API call referencing that Bitcoin transaction. This call triggers the Emily API, which plays a crucial role by relaying deposit information to the sBTC Signers. These signers are responsible for verifying and processing the deposit. Once verified, an equivalent amount of sBTC is minted on the Stacks blockchain.

The deposit is usually completed within a single Bitcoin block, but is guaranteed to be completed within 3. For more information on deposit and withdrawal confirmation times and why deposits can be so fast, check out the [Deposit and Withdrawal Times](deposit-withdrawal-times.md) doc.

## Bitcoin Deposit Requirements

For a deposit to be considered valid, it must adhere to specific requirements. The deposit must be made to a taproot address and be spendable by a consensus threshold of signers. Additionally, the deposit must follow a specific format that prevents short-term clawbacks, ensuring the security and integrity of the system.

## User Experience

From a user's perspective, the deposit process is straightforward. Users initiate a BTC transaction to a specified address and then wait for the transaction to be confirmed on the Bitcoin blockchain. Once confirmed, they receive the equivalent amount of sBTC in their Stacks wallet.

To enhance the user experience, a sBTC bridge web application is currently in development which will provide an intuitive interface for users to track the status of their deposit operations. This allows users to stay informed throughout the process, from initiation to completion.
