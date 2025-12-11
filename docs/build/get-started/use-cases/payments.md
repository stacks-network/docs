---
description: Use cases of payments on Stacks
---

# Payments

Enable fast, Bitcoin-settled transactions using assets like sBTC and STX, with developer tooling support and easy wallet integrations. Stacks brings the liquidity, speed, and logic of modern payments to Bitcoin — fast digital transfers, smarter payment rules, and the UX digital payments deserve.

Here are the payment use cases developers are building with today:

### sBTC Pay

sBTC Pay provides a payment gateway with APIs and webhooks for developers to instantly integrate a simple sBTC payment system in their app. A complete _**"Stripe for sBTC"**_ payment gateway that enables businesses to easily accept Bitcoin payments via sBTC on Stacks blockchain.

**Implementation highlight:**\
sBTC Pay comes with a few integration methods developers can start using right away. The React component from its `@sbtc-gateway/react` library provides UI components for readily usable sBTC payments.

{% code title="@sbtc-gateway/react" %}
```typescript
import { SBTCProvider, PaymentButton } from '@sbtc-gateway/react';

function App() {
  return (
    <SBTCProvider apiKey="sk_test_...">
      <PaymentButton
        amount={100000}
        description="Product purchase"
        onSuccess={(paymentIntent) => console.log('Success!', paymentIntent)}
      />
    </SBTCProvider>
  );
}
```
{% endcode %}

<details>

<summary>Check out more from sBTC Pay</summary>

* [Official website](https://sbtcpay.org/)
* [Demo video](https://x.com/kai_builder/status/1962151430535700891)
* [Winner of the Stacks Builder Competition](https://x.com/kai_builder/status/1967806436387459388)
* [Github repo](https://github.com/STX-CITY/sbtc-pay)

</details>

***

### Bolt Wallet

Bolt wallet not only enables sBTC as transaction fees, but also boasts lightning bolt speed for payments on Stacks while guaranteeing transaction confirmation. This is made possible by Stacks' sponsor transaction feature and optimistic confirmations.

**Implementation highlight:**\
The code snippet below demonstrates how to transfer sBTC between Stacks wallets while paying the fee in sBTC instead of STX using Bolt Protocol's sponsorship feature.

{% code title="https://github.com/ronoel/bolt-protocol/blob/main/cookbook/transfer-stacks-to-stacks.md" expandable="true" %}
```typescript
import { STACKS_TESTNET } from "@stacks/network";
import { bytesToHex } from "@stacks/common";
import {
    Cl,
    FungiblePostCondition,
    makeContractCall,
    PostConditionMode,
    SignedContractCallOptions,
} from "@stacks/transactions";

async function transferStacksToStacks() {
    // Amount and fee in satoshis
    const amount = 100000000; // 1 sBTC
    const fee = 10;          // 10 satoshis minimum fee

    // Post condition to ensure exact amount+fee is spent
    const ftPostCondition: FungiblePostCondition = {
        type: 'ft-postcondition',
        address: "<sender-wallet-address>",    // Replace with actual sender address
        condition: 'eq',
        amount: amount + fee,
        asset: 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token::sbtc-token'
    };

    // Transaction options
    const txOptions: SignedContractCallOptions = {
        sponsored: true,  // Enable sponsorship
        senderKey: "<sender-key>",  // Replace with sender's private key
        network: STACKS_TESTNET,
        contractAddress: "SP3QZNX3CGT6V7PE1PBK17FCRK1TP1AT02ZHQCMVJ",
        contractName: "boltproto-sbtc-v1",
        functionName: "transfer-stacks-to-stacks",
        functionArgs: [
            Cl.uint(amount),
            Cl.principal("<recipient-address>"),  // Replace with recipient address
            Cl.none(),  // No memo
            Cl.uint(fee)
        ],
        postConditionMode: PostConditionMode.Deny,
        postConditions: [ftPostCondition],
    };

    // Create and serialize the transaction
    const transaction = await makeContractCall(txOptions);
    const serializedTx = bytesToHex(transaction.serializeBytes());

    // Submit to Bolt Protocol API
    const response = await fetch('https://boltproto.org/api/v1/transaction/sbtc-token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ serializedTx })
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Transaction submitted:', data.txid);
    return data;
}
```
{% endcode %}

<details>

<summary>Check out more from Bolt wallet</summary>

* [Official website for Bolt](https://boltproto.org/)
* [Hiro Dev N' Tell with Ronoel.btc showcasing Bolt wallet in action](https://youtu.be/iuNQ88VoRiU?si=xR7hf5N0VJQlz1rm)
* [Bolt Protocol](https://x.com/boltprotobtc)
* [Github repo](https://github.com/ronoel/bolt-protocol)

</details>
