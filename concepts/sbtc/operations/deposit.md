# sBTC Deposit Operation

The deposit operation allows users to convert their BTC to sBTC. This process involves moving BTC from the Bitcoin blockchain to the Stacks blockchain as sBTC.

## Process Overview

1. An API call referencing a Bitcoin transaction initiates the deposit process.
2. The deposit can be completed within a single Bitcoin block.
3. The Deposit API relays deposit information to the sBTC Bootstrap Signers.
4. sBTC Bootstrap Signers verify and process the deposit.
5. Equivalent sBTC is minted on the Stacks blockchain.

## Deposit API

The Deposit API plays a crucial role in the deposit process:

- It relays deposit information to the sBTC Bootstrap Signers.
- It reduces the cost for deposit on rejection.
- It simplifies the sBTC system and makes it easier to service.

## Bitcoin Deposit Requirements

Deposits must meet specific requirements to be considered valid:

1. The deposit must pay to a taproot address.
2. The deposit must be spendable by a consensus threshold of signers.
3. The deposit must fit a specific format that cannot be clawed back in the short term.

## Security Considerations

- The sBTC Bootstrap Signers screen deposits using a dynamic blocklist to prevent malicious activities.
- Multiple confirmations may be required before the deposit is considered final.

## User Experience

From a user's perspective, the deposit process involves:

1. Initiating a BTC transaction to a specified address.
2. Waiting for the transaction to be confirmed on the Bitcoin blockchain.
3. Receiving the equivalent amount of sBTC in their Stacks wallet.

The sBTC bridge web app provides a user-friendly interface for tracking the status of deposit operations.
