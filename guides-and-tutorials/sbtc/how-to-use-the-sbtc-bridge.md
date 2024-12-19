# How to Use the sBTC Bridge

The sBTC bridge is a web application allowing you to convert your BTC into sBTC on the Stacks chain.

{% hint style="warning" %}
Ensure that you are using the bridge located at app.stacks.co. This is the only official sBTC bridge.
{% endhint %}

If you aren't familiar with sBTC, be sure to check out the [sBTC Conceptual Guide](../../concepts/sbtc/) to understand how it works.

The bridge has been designed to be as simple as possible to use. In order to utilize sBTC, all you need to do is send a Bitcoin transaction using a supported wallet (like [Leather](https://leather.io/) or [Xverse](https://www.xverse.app/)).

Below you'll find both a video and written walkthrough of using the bridge.

{% hint style="info" %}
Note that only deposits are currently available. Withdrawals will be released in [Phase 2](https://bitcoinl2labs.com/sbtc-rollout), estimated in March 2025.&#x20;
{% endhint %}

### Video Walkthrough



{% embed url="https://youtu.be/XZruuDgTo4k" %}

### Written Walkthrough

There are 5 simple steps to convert your BTC to sBTC.

{% stepper %}
{% step %}
### Connect your wallet

First, you'll need to connect your wallet to the bridge UI. Currently Leather and Xverse are supported, with more on the way.

<figure><img src="../../.gitbook/assets/image (1).png" alt=""><figcaption></figcaption></figure>
{% endstep %}

{% step %}
### Choose the amount to deposit

After your wallet is connected, choose how much BTC you would like to convert to sBTC.

{% hint style="info" %}
There are two transaction fees required to mint your sBTC. The first is set by the user manually when they initiate the deposit transaction within their wallet. The second is a fee used to consolidate the deposit UTXOs into the single signer UTXO. This separate transaction fee happens automatically and is set to a max of 80k sats. This is automatically deducted from your minted sBTC. This is not a signer fee but a regular Bitcoin transaction fee.
{% endhint %}



<figure><img src="../../.gitbook/assets/image (1) (1).png" alt=""><figcaption></figcaption></figure>
{% endstep %}

{% step %}
### Choose the Stacks address to mint to

Next, enter the Stacks address you would like your sBTC minted to.

<figure><img src="../../.gitbook/assets/image (2).png" alt=""><figcaption></figcaption></figure>
{% endstep %}

{% step %}
### Initiate the transaction

After you choose your Stacks address, you'll use your connected wallet to transfer the BTC.

<figure><img src="../../.gitbook/assets/image (3).png" alt=""><figcaption></figcaption></figure>
{% endstep %}

{% step %}
### Receive your sBTC

In the UI, you can monitor the status of your transaction to see when it has been completed, at which point you can see the sBTC in your wallet. It will go through three stages:

* Pending - Your Bitcoin transaction is processing
* Minting - Your Bitcoin transaction has processed and the sBTC signers are minting your sBTC
* Completed - Your sBTC has been minted to your wallet

{% hint style="info" %}
If you accidentally leave the transaction page, you can view the status of your transaction by adding the `txId`, `step`, and `amount` query parameters to the bridge URL, eg. [https://app.stacks.co/?txId=1ca44721135c00a170cbec406733f25d9621e0598c011c78246c2fe173c4c9aa\&step=3\&amount=10000](https://app.stacks.co/?txId=1ca44721135c00a170cbec406733f25d9621e0598c011c78246c2fe173c4c9aa\&step=3\&amount=10000)

The History tab is in progress and will make viewing previous transactions easier.
{% endhint %}

Note that you may need to enable the display of the sBTC token within your wallet by clicking on 'Manage Tokens' and enabling sBTC.

<div align="left"><figure><img src="../../.gitbook/assets/image (21).png" alt="" width="188"><figcaption></figcaption></figure></div>
{% endstep %}
{% endstepper %}

### Reclaiming BTC

If your sBTC mint fails, you can reclaim your sBTC. You can do this via the bridge by visiting the reclaim page at https://app.stacks.co/reclaim?depositTxId=\[TX\_ID\_HERE] and replacing the bracketed text with your transaction ID, eg. [https://app.stacks.co/reclaim?depositTxId=8f37f750b6646f0a217121201967170bd3cfef5f2ebd4f30f359b5e9308470c4](https://app.stacks.co/reclaim?depositTxId=8f37f750b6646f0a217121201967170bd3cfef5f2ebd4f30f359b5e9308470c4)

There is an intermediate step in between depositing BTC and the sBTC signers consolidating it into the single signer UTXO. If the transaction is not picked up by signers, you can reclaim it using this UI. Note there is a 'Lock Time' field on the Reclaim page. That indicates the amount of blocks that must have passed in order to reclaim your BTC.

This initiates a Bitcoin transaction that will transfer your BTC back to you.

<figure><img src="../../.gitbook/assets/image (23).png" alt=""><figcaption></figcaption></figure>
