# Withdrawal

The sBTC withdrawal operation enables users to convert their sBTC back to BTC. This process involves burning sBTC on the Stacks blockchain and releasing an equivalent amount of BTC on the Bitcoin blockchain.

## Process Overview

<figure><img src="../../.gitbook/assets/image (26).png" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXeNx03RFtUIZTzKCbSnakHtStQl69RWZ7TWRYsW4KvIS2HS-93ghvu3s2U-g5PXbdeCvV_PZUZv1JL3CdPo3Zkm2ZHHmW8BDJIvMoZMFBf256K0fVH07TEazw7EPu7Wixex-inhIAwIzy4WCHwzoUbzpPph_?key=LMMtMf3zwOdkwel07ZrRiw" alt=""><figcaption></figcaption></figure>

{% stepper %}
{% step %}
### Initiate withdrawal

A user initiates a Clarity contract call (via a Stacks wallet or dApp) specifying:

* the amount of sBTC to withdraw
* the destination Bitcoin address
{% endstep %}

{% step %}
### Stacks transaction finality

The Stacks transaction must reach finality. The protocol requires six Bitcoin block confirmations before proceeding to the next step.
{% endstep %}

{% step %}
### Signer verification and BTC release

After confirmations, sBTC Signers verify the withdrawal request and create the withdrawal transaction on the Bitcoin network, releasing the equivalent BTC to the specified Bitcoin address.
{% endstep %}
{% endstepper %}

The withdrawal process requires six Bitcoin block confirmations to complete. After these confirmations, sBTC Signers create the withdrawal transaction on the Bitcoin network.

## Withdrawal Confirmation

The six-block confirmation requirement serves multiple purposes:

* Ensures finality of the Stacks transaction and prevents potential reversals or conflicts.
* Mitigates issues from potential Bitcoin forks by allowing time for network stability.
* Gives sBTC Signers sufficient time to verify and process the withdrawal request accurately.

For more information on deposit and withdrawal confirmation times and why deposits can be faster than withdrawals, see the [Deposit and Withdrawal Times](https://app.gitbook.com/u/ZrQItu6D9bMKmf1HfsLTnGc05WZ2) doc.

## Failure Cases

Some withdrawal failures can be identified and resolved before the six confirmations are complete. Other failures may only become apparent after the sBTC Bootstrap Signer attempts to create the withdrawal transaction on the Bitcoin network. These delays stem from the complexity of cross-chain operations and the need for thorough verification at each step.

<details>

<summary>More about failure detection timing</summary>

Because cross-chain operations involve verification on both Stacks and Bitcoin, certain issues (for example: insufficient signer consensus, malformed Bitcoin transaction construction, or Bitcoin network conditions) may only be detectable when the signer attempts to broadcast the Bitcoin transaction. This can cause failure detection to occur after confirmations on Stacks are already complete.

</details>

## Security Considerations

{% hint style="info" %}
The multi-block confirmation process is a critical security measure to help prevent double-spending attempts. Requiring multiple block confirmations ensures the withdrawal request is valid and final before processing on the Bitcoin network. Additionally, sBTC Signers perform verification of each withdrawal request prior to creating the Bitcoin transaction, providing an extra security layer.
{% endhint %}

## User Experience

From a user's perspective:

* Initiate a withdrawal through a Stacks wallet or dApp.
* Specify the sBTC amount and destination Bitcoin address.
* Wait for the required six Bitcoin blocks to confirm.
* Once confirmations complete and signers process the request, BTC is sent to the specified Bitcoin address.

The sBTC bridge web application offers a user-friendly interface that lets users track the status of their withdrawal operations in real time, providing updates at each stage so users can understand progress and estimate when they will receive BTC.
