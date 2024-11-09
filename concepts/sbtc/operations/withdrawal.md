# Withdrawal

The sBTC withdrawal operation enables users to convert their sBTC back to BTC. This process involves burning sBTC on the Stacks blockchain and releasing an equivalent amount of BTC on the Bitcoin blockchain.

## Process Overview

<figure><img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXeNx03RFtUIZTzKCbSnakHtStQl69RWZ7TWRYsW4KvIS2HS-93ghvu3s2U-g5PXbdeCvZPZUZv1JL3CdPo3Zkm2ZHHmW8BDJIvMoZMFBf256K0fVH07TEazw7EPu7Wixex-inhIAwIzy4WCHwzoUbzpPph_?key=LMMtMf3zwOdkwel07ZrRiw" alt=""><figcaption></figcaption></figure>

The withdrawal process begins when a user initiates a Clarity contract call. This call triggers a series of events that culminate in the user receiving BTC in their specified Bitcoin address. The process requires six Bitcoin block confirmations to complete. After these confirmations, sBTC Signers create the withdrawal transaction on the Bitcoin network.

## Withdrawal Confirmation

The requirement for six block confirmations serves multiple important purposes. First, it ensures the finality of the Stacks transaction, preventing any potential reversals or conflicts. Second, it mitigates issues that could arise from potential Bitcoin forks by allowing sufficient time for network stability. Lastly, it provides sBTC Signers with ample time to verify and process the withdrawal request accurately.

For more information on deposit and withdrawal confirmation times and why deposits can be so much faster than withdrawals, check out the [Deposit and Withdrawal Times](deposit-withdrawal-times.md) doc.

## Failure Cases

While some withdrawal failures can be identified and resolved before the six confirmations are complete, others may only become apparent after the sBTC Bootstrap Signer attempts to create the withdrawal transaction on the Bitcoin network. This delay in failure detection is due to the complex nature of cross-chain operations and the need for thorough verification at each step.

## Security Considerations

The multi-block confirmation process is a crucial security measure that helps prevent double-spending attempts. By requiring multiple block confirmations, the system ensures that the withdrawal request is valid and final before processing it on the Bitcoin network. Additionally, sBTC Signers verify each withdrawal request before processing it, adding an extra layer of security.

## User Experience

From a user's perspective, the withdrawal process is designed to be straightforward and transparent. Users initiate a withdrawal request through a Stacks wallet or decentralized application (dApp). During this process, they specify the amount of sBTC they wish to withdraw and provide the destination Bitcoin address where they want to receive their BTC. After submitting the request, users must wait for the required six blocks to complete. Once confirmed, the BTC is sent to the specified Bitcoin address.

To enhance user experience and provide clarity throughout the process, the sBTC bridge web application offers a user-friendly interface. This interface allows users to track the status of their withdrawal operations in real-time, providing updates at each stage of the process. This transparency helps users understand the progress of their withdrawal and anticipate when they can expect to receive their BTC.
