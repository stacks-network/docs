# sBTC Deposit Operation

The deposit operation enables users to mint sBTC, anchored to the BTC they have placed in the threshold wallet on the Bitcoin chain. This process can be completed within a single Bitcoin block, streamlining the user experience.

## Process Overview

The deposit process begins when a user initiates an API call referencing a Bitcoin transaction. This call triggers the Deposit API, which plays a crucial role by relaying deposit information to the sBTC Bootstrap Signers. These signers are responsible for verifying and processing the deposit. Once verified, an equivalent amount of sBTC is minted on the Stacks blockchain.

The Deposit API serves multiple purposes beyond relaying information. It reduces costs associated with deposit rejections and simplifies the overall sBTC system, making it easier to service and maintain.

## Bitcoin Deposit Requirements

For a deposit to be considered valid, it must adhere to specific requirements. The deposit must be made to a taproot address and be spendable by a consensus threshold of signers. Additionally, the deposit must follow a specific format that prevents short-term clawbacks, ensuring the security and integrity of the system.

## Security Measures

To maintain the security of the sBTC system, the sBTC Bootstrap Signers employ a dynamic blocklist to screen deposits and prevent malicious activities. Depending on the circumstances, multiple confirmations may be required before a deposit is considered final, adding an extra layer of security to the process.

## User Experience

From a user's perspective, the deposit process is straightforward. Users initiate a BTC transaction to a specified address and then wait for the transaction to be confirmed on the Bitcoin blockchain. Once confirmed, they receive the equivalent amount of sBTC in their Stacks wallet.

To enhance the user experience, a sBTC bridge web application is currently in development which will provide an intuitive interface for users to track the status of their deposit operations. This allows users to stay informed throughout the process, from initiation to completion.
