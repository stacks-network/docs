# Creating a Bitcoin Transaction

For usage with the `clarity-bitcoin-lib` contract or if you just want to learn how to invoke a bitcoin transaction from your wallet on the front end, check out this guide.

Using Stacks Connect and with a Stacks-supported wallet, you can initiate a simple Bitcoin transaction from a frontend app in a few lines of code. With this Bitcoin transaction, you can then use to verify it's inclusion in a Bitcoin block through Clarity.

{% hint style="info" %}
Check out the [Stacks Connect](/broken/pages/JLRpUuDHPMxXaInZ9Vll) guides for more info on setup and wallet connection.
{% endhint %}

{% stepper %}
{% step %}
#### Initiate a Bitcoin transaction

Use the `request("sendTransfer", ...)` method to initiate a bitcoin transaction. Provide the recipient address and the amount in satoshis.

```typescript
import { request } from '@stacks/connect';

const result = await request('sendTransfer', {
    recipients: [
      {
        address: "<recipient-address>",
        amount: 100_000,
      },
    ],
  })

let txid = result.txid;
```
{% endstep %}

{% step %}
#### Cache the \`txid\`

As you'll see in the next section, in order to verify a transaction was mined in Clarity, you'll use the returned `txid` to fetch its transaction metadata. The transaction metadata can be fetched from a Bitcoin explorer or from some custom helper libraries built by the community. So it's important to cache or store the `txid` for your app.
{% endstep %}
{% endstepper %}
