# sBTC Withdrawal Operation

The withdrawal operation allows users to convert their sBTC back to BTC. This process involves burning sBTC on the Stacks blockchain and releasing the equivalent amount of BTC on the Bitcoin blockchain.

## Process Overview

1. A Clarity contract call initiates the withdrawal process.
2. The withdrawal requires 6 sortitions (Stacks block confirmations) for completion.
3. After confirmation, sBTC Bootstrap Signers create the withdrawal transaction on the Bitcoin network.
4. The user receives BTC in their specified Bitcoin address.

## Withdrawal Confirmation

The requirement for 6 sortitions serves several purposes:

1. It ensures the finality of the Stacks transaction.
2. It prevents issues that could arise from potential Bitcoin forks.
3. It gives sBTC Bootstrap Signers sufficient time to verify and process the withdrawal.

## Failure Cases

Some withdrawal failures can be resolved earlier than 6 sortitions, but others may only fail after the sBTC Bootstrap Signer attempts to create the withdrawal transaction.

## Security Considerations

- The multi-sortition confirmation process helps prevent double-spending attempts.
- sBTC Bootstrap Signers verify the withdrawal request before processing it.
- The dynamic blocklist is consulted to prevent withdrawals to known malicious addresses.

## User Experience

From a user's perspective, the withdrawal process involves:

1. Initiating a withdrawal request through a Stacks wallet or dApp.
2. Specifying the amount of sBTC to withdraw and the destination Bitcoin address.
3. Waiting for the required confirmations (6 sortitions).
4. Receiving BTC in the specified Bitcoin address.

The sBTC bridge web app will provide a user-friendly interface for tracking the status of withdrawal operations.
