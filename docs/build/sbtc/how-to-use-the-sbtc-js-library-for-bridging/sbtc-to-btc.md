# Withdrawing: Pegging sBTC into BTC

This guides shows how you can integrate the withdrawal (peg-out) flow from your front-end app to allow users to peg sBTC back into BTC on the Bitcoin network. For more information about sBTC and an explainer of its architecture, check out the general sBTC section [here](https://app.gitbook.com/s/H74xqoobupBWwBsVMJhK/sbtc) in the Learn category.

### Breakdown of the withdrawal (peg-in) flow

* **Validate and deconstruct bitcoin address**
  * Validate user's inputted bitcoin address, to be used to receive BTC, is a valid bitcoin address.
  * Deconstruct the bitcoin address to identify its version type and hashbytes.
* **Construct a Stacks contract call:**
  * Determine amount to withdraw and a reasonable max fee.
  * Construct a contract call to invoke `initiate-withdrawal-request` of `.sbtc-withdrawal` contract.
  * Broadcast the transaction to the Stacks network.
* **Processing by Signers:** (_no action required_)
  * The signers retrieve and verify the withdrawal transaction from the Stacks network.
  * Once verified, the signers burn the sBTC and sends the equivalent amount of BTC back to the user.
* **Receive BTC (Bitcoin):** (_no action required_)
  * The returned BTC is sent to the depositor's designated bitcoin address, completing the withdrawal process.

{% hint style="info" %}
At the moment, the `sbtc` library does not have any direct helper methods, but as you'll see in the guide, it's relatively straightforward to do it without any abstraction methods.
{% endhint %}

In this guide you'll touch on some of the steps above but its much less complex than the deposit flow. Putting together the peg-out process from sBTC into BTC will simply involve the following steps:

1. Validating the withdrawal bitcoin address
2. Contract call to `initiate-withdrawal-request`&#x20;
3. Confirm BTC withdrawal

{% hint style="info" %}
This guide assumes you have a front-end bootstrapped with the Stacks Connect library for wallet interactions. Head to the guides for Stacks Connect before continuing with this guide.
{% endhint %}

{% stepper %}
{% step %}
### Validating the withdrawal bitcoin address

Validating a Bitcoin address before using it in code is essential to prevent errors and potential financial losses from incorrect or malicious addresses. It ensures compliance with types like P2PKH, P2SH, or P2TR, and adherence to network protocols. Without proper validation, there's a higher risk of failed transactions and security vulnerabilities, jeopardizing user funds and application reliability.

After validating, you'll want to deconstruct the bitcoin address to identify its version type and hashbytes. The version type is pertaining to the bitcoin address type and how they map to its corresponding Clarity value.

We'll use the `getAddressInfo` method from the [`bitcoin-address-validation`](https://github.com/ruigomeseu/bitcoin-address-validation) library to help us deconstruct the receiving bitcoin address.

<pre class="language-typescript"><code class="lang-typescript">import { AddressType, getAddressInfo } from "bitcoin-address-validation";
import * as bitcoin from "bitcoinjs-lib";

function deconstructBtcAdd(address: string) {
    const typeMapping = {
    [AddressType.p2pkh]: "0x00",
    [AddressType.p2sh]: "0x01",
    [AddressType.p2wpkh]: "0x04",
    [AddressType.p2wsh]: "0x05",
    [AddressType.p2tr]: "0x06",
  };

<strong>  const <a data-footnote-ref href="#user-content-fn-1">addressInfo</a> = getAddressInfo(address);
</strong>  
  const { bech32 } = addressInfo;
  let hashbytes: Uint8Array;
  if (bech32) {
    hashbytes = bitcoin.address.fromBech32(address).data;
  } else {
    hashbytes = bitcoin.address.fromBase58Check(address).hash;
  }

  const type = typeMapping[addressInfo.type];
  if (!type) {
    throw new Error(`Unsupported address type: ${addressInfo.type}`);
  }
  
  return {
    <a data-footnote-ref href="#user-content-fn-2">type</a>,
    <a data-footnote-ref href="#user-content-fn-3">hash</a>bytes,
  };
}
</code></pre>

In the next step, the returned `type` and `hashbytes` are to be passed in as a tuple param of a contract call. The constraints and meaning of the `type` and `hashbytes` param are summarized as:

```
;; version == 0x00 and (len hashbytes) == 20 => P2PKH
;; version == 0x01 and (len hashbytes) == 20 => P2SH
;; version == 0x02 and (len hashbytes) == 20 => P2SH-P2WPKH
;; version == 0x03 and (len hashbytes) == 20 => P2SH-P2WSH
;; version == 0x04 and (len hashbytes) == 20 => P2WPKH
;; version == 0x05 and (len hashbytes) == 32 => P2WSH
;; version == 0x06 and (len hashbytes) == 32 => P2TR
```
{% endstep %}

{% step %}
### Contract call to `initiate-withdrawal-request`&#x20;

The function `initiate-withdrawal-request` of the [`.sbtc-withdrawal`](https://explorer.hiro.so/txid/SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-withdrawal?chain=mainnet) contract locks up `amount` + `max-fee` from the sender's account. When the withdrawal request is accepted, the signers will then send BTC `amount` of sats to the recipient and spend the fee `amount` to bitcoin miners (where fee less than or equal to max-fee). If actual fee is less than `max-fee`, then the difference will be minted back to the user when `accept-withdrawal-request` is invoked by the Signers.

The network used, for the bitcoin address, is inherited from the network of the underlying transaction itself (basically, if on Stacks mainnet the Signers will send to mainnet Bitcoin addresses and similarly on Stacks testnet, to Bitcoin testnet addresses).

<pre class="language-typescript"><code class="lang-typescript">import { request } from '@stacks/connect';
import { Cl, Pc } from '@stacks/transactions';

let { type, hashbytes } = deconstructBtcAdd(&#x3C;btcAddress>)

let amount = 100000
let recipient = {
  version: Cl.bufferFromHex(type),
  hashbytes: Cl.buffer(hashbytes)
}
let maxFee = 3000

let postCond_1 = Pc.principal(&#x3C;stxAddress>)
  .willSendEq(amount + maxFee)
  .ft('SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token', 'sbtc-token')

let result = await request('stx_callContract', {
<strong>  contract: 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-withdrawal',
</strong><strong>  functionName: 'initiate-withdrawal-request',
</strong>  functionArgs: [Cl.uint(amount), Cl.tuple(recipient), Cl.uint(maxFee)],
  postConditions: [postCond_1],
  postConditionMode: 'deny',
  network: "mainnet",
})

console.log(result)
// {
//    "transaction": "0000000001040049ff5845af0c7efefca31b764229c84e8968e8bc000000000000009f0000000000000bb800015772b7ea414879826e90da34f9030ad6f8b6fb3f7c07d766906d7d9f9a65752147961e3de57d8fcaa1dfd6d92e0d085af3491efdfe2ec78d9a403c258f5c092e0301000000000214f6decc7cfff2a413bd7cd4f53c25ad7fd1899acc0f736274632d7769746864726177616c1b696e6974696174652d7769746864726177616c2d726571756573740000000301000000000000000000000000000186a00c0000000209686173686279746573020000001457873a539bfb7c071f8cd91805068d546a4941950776657273696f6e0200000001010100000000000000000000000000000bb8",
//    "txid": "cd73c7c3023d4f271981d85cb1c29446a5513dcfc182963ee2d1cfee06b9a4ad"
// }
</code></pre>
{% endstep %}

{% step %}
### Confirm BTC withdrawal

The Stacks contract call transaction will be confirmed by the Stacks network within seconds. But the actual BTC withdrawal confirmation is longer than the deposit confirmation. Usually around 6 Bitcoin block confirmations are needed.&#x20;

After confirming the Stacks transaction, confirm that the user has received the withdrawn BTC back into their designated bitcoin address by polling the Emily API endpoint below:

```
https://sbtc-emily.com/withdrawal/sender/<stacks-sender>
```

This will return the status of all withdrawals from the specified sender:

<pre data-title="example return response"><code>{
  "nextToken": null,
  "withdrawals": [
    {
      "requestId": 748,
      "stacksBlockHash": "e19bea7a651136ed5a156e69d5952e86a3792f78df2bb20c8c5ab2009fd5617e",
      "stacksBlockHeight": 4461632,
      "recipient": "0020a6abc068c9783dea16451549cebb174ee82618f9999b53334b2397e02c8a106f",
      "sender": "SP14ZYP25NW67XZQWMCDQCGH9S178JT78QJYE6K37",
      "amount": 110000,
      "lastUpdateHeight": 4462339,
      "lastUpdateBlockHash": "32b2834eb507ec9484ea1bbce97cb2dc241c8ab18bd443181aa5b0c178546bed",
<strong>      "status": "confirmed",
</strong>      "txid": "a355cd64374446e1d0de7096a7c1583bb4564fb6a997650bd9af26605805bfa0"
    },
  ]
}
</code></pre>

So in total there are 2 on-chain transactions that make up the entire withdrawal (peg-out) flow:

1. \[Stacks] Initial sBTC withdrawal request by the user ([example](https://explorer.hiro.so/txid/0x4f4000a0ca61ea10e31bc7950672f57612880b6de3a61463bb98e29ca6bb6491?chain=mainnet))
2. \[Bitcoin] Returned BTC transaction by the Signers ([example](https://mempool.space/tx/4ec2396bebb79d11be6dae3ae133cb0501d05af4ff368425fe19740d050b74dc))
{% endstep %}
{% endstepper %}

And that's all to it. You've successfully allowed your app to handle incoming sBTC to be pegged out back into BTC.

***

### \[Additional Insights]&#x20;

### What are the different bitcoin address types?

Bitcoin addresses come in several types, each serving specific purposes and providing different functionalities. Each address type has evolved to enhance security, scalability, and functionality of Bitcoin transactions in response to the network's growing needs.

Check out the dedicated Hiro blog post to learn more about the why and how different bitcoin addresses are constructed:

{% embed url="https://www.hiro.so/blog/understanding-the-differences-between-bitcoin-address-formats-when-developing-your-app" %}

### Why does the withdrawal (peg-out) take longer to provide a bitcoin txid from the Emily API?

The current flow right now goes like this:

1. The user creates a withdrawal request via a contract call on Stacks. In this example, let's say the withdrawal transaction is confirmed in a Stacks block anchored to a Bitcoin block at height N.
2. The Signers and Emily get the event from the contract call above. Emily marks the withdrawal as pending.
3. The Signers wait until that Bitcoin block is final enough, which is at Bitcoin block N+6. When that Bitcoin block arrives they create and broadcast a sweep transaction fulfilling the withdrawal request. Then the Signers tell Emily that they have accepted the withdrawal request.
4. Usually the sweep transaction is included in the next block, so it's confirmed at block N+7.
5. The Signers issue the contract call finalizing the withdrawal on Stacks, and Emily finds out about the transaction fulfilling the withdrawal.

Here are some useful notes about the above process: \
When the Signers tell Emily that the withdrawal has been accepted, they don't tell her about the bitcoin transaction that it's accepted in. This is intentional, because the final transaction fulfilling the withdrawal is not known until it is confirmed. It could also be the case that the Signers attempt to fulfill the withdrawal request but end up never fulfilling it. As in, the Signers could create a transaction fulfilling the withdrawal request, where they broadcast it to the Bitcoin network, but that transaction is never confirmed and never will be. Moreover, this situation is not too unlikely; it can happen when fees spike relative to the user's max fee. The current approach sidesteps all of that UX complexity and prudently informs Emily about the transaction ID after it is known to be confirmed. Moreover, some wallets can tell you if there is a payment made out to you by just examining the Bitcoin mempool.&#x20;

[^1]: ```
    type AddressInfo = {
      bech32: boolean;
      network: Network;
      address: string;
      type: AddressType;
    }
    ```

[^2]: type: string

[^3]: type: Uint8Array
