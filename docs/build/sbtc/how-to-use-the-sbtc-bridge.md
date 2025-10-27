# How to Use the sBTC Bridge

The sBTC bridge is a web application allowing you to convert your BTC into sBTC on the Stacks chain.

{% hint style="danger" %}
Ensure that you are using the bridge located at [sbtc.stacks.co](https://sbtc.stacks.co/). This is the only official sBTC bridge.
{% endhint %}

If you aren't familiar with sBTC, be sure to check out the [sBTC Conceptual Guide](https://app.gitbook.com/s/H74xqoobupBWwBsVMJhK/sbtc) to understand how it works.

The bridge has been designed to be as simple as possible to use. In order to utilize sBTC, all you need to do is send a Bitcoin transaction using a supported wallet (like [Leather](https://leather.io/) or [Xverse](https://www.xverse.app/)).

Below you'll find both a video and written walkthrough of using the bridge.

### Video Walkthrough

{% embed url="https://youtu.be/XZruuDgTo4k" %}

### Written Walkthrough

There are 5 simple steps to convert your BTC to sBTC.

{% stepper %}
{% step %}
#### Connect your wallet

First, you'll need to connect your wallet to the bridge UI. Currently Leather and Xverse are supported, with more on the way.

<figure><img src="../.gitbook/assets/image (9).png" alt=""><figcaption></figcaption></figure>
{% endstep %}

{% step %}
#### Choose the amount to deposit

After your wallet is connected, choose how much BTC you would like to convert to sBTC.

<figure><img src="../.gitbook/assets/image (10).png" alt=""><figcaption></figcaption></figure>

{% hint style="info" %}
There are two transaction fees required to mint your sBTC. The first is set by the user manually when they initiate the deposit transaction within their wallet. The second is a fee used to consolidate the deposit UTXOs into the single signer UTXO. This separate transaction fee happens automatically and is set to a max of 80k sats. This is automatically deducted from your minted sBTC. This is not a signer fee but a regular Bitcoin transaction fee.
{% endhint %}
{% endstep %}

{% step %}
#### Choose the Stacks address to mint to

Next, enter the Stacks address you would like your sBTC minted to.

<figure><img src="../.gitbook/assets/image (11).png" alt=""><figcaption></figcaption></figure>
{% endstep %}

{% step %}
#### Initiate the transaction

After you choose your Stacks address, you'll use your connected wallet to transfer the BTC.

<figure><img src="../.gitbook/assets/image (12).png" alt=""><figcaption></figcaption></figure>
{% endstep %}

{% step %}
#### Receive your sBTC

In the UI, you can monitor the status of your transaction to see when it has been completed, at which point you can see the sBTC in your wallet. It will go through three stages:

* Pending - Your Bitcoin transaction is processing
* Minting - Your Bitcoin transaction has processed and the sBTC signers are minting your sBTC
* Completed - Your sBTC has been minted to your wallet

Note that you may need to enable the display of the sBTC token within your wallet by clicking on 'Manage Tokens' and enabling sBTC.

<figure><img src="../.gitbook/assets/image (13).png" alt=""><figcaption></figcaption></figure>
{% endstep %}
{% endstepper %}

### Reclaiming BTC

If your sBTC mint fails, you can reclaim your sBTC. You can do this via the bridge by visiting the reclaim page at https://sbtc.stacks.co/\<TX\_ID>/reclaim and replacing the bracketed text with your transaction ID, eg. [https://sbtc.stacks.co/8f37f750b6646f0a217121201967170bd3cfef5f2ebd4f30f359b5e9308470c4/reclaim](https://sbtc.stacks.co/8f37f750b6646f0a217121201967170bd3cfef5f2ebd4f30f359b5e9308470c4/reclaim)

There is an intermediate step in between depositing BTC and the sBTC signers consolidating it into the single signer UTXO. If the transaction is not picked up by signers, you can reclaim it using this UI. Note there is a 'Lock Time' field on the Reclaim page. That indicates the amount of blocks that must have passed in order to reclaim your BTC.

<figure><img src="../.gitbook/assets/image (14).png" alt=""><figcaption></figcaption></figure>

This initiates a Bitcoin transaction that will transfer your BTC back to you.
