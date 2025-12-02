# Sending Transactions

<figure><img src="../../.gitbook/assets/send-transactions.jpg" alt=""><figcaption></figcaption></figure>

Any Stacks app is going to require sending transactions at some point, so how do we do that?

{% hint style="warning" %}
When you send Stacks transactions, don't forget to utilize post-conditions.
{% endhint %}

### Invoking contract call transactions

In our example below, we're going to be showing how to invoke a contract function from the frontend which will prompt a user's wallet to confirm transaction. For this, we'll setup a `stx_callContract` to invoke the `add-message` public function of our contract taken from the [Developer Quickstart](../developer-quickstart.md). This function will accept a string content to be passed into our contract call.

<pre class="language-typescript" data-expandable="true"><code class="lang-typescript">import { request } from '@stacks/connect'
import type { TransactionResult } from '@stacks/connect/dist/types/methods'
import { Cl, Pc } from '@stacks/transactions'
import { useState } from 'react'

function App() {
  // ...
  let [content, setContent] = useState&#x3C;string>('')

  async function addMessage() {
    let postCond_1 = Pc.principal('ST11V9ZN6E6VG72SHMAVM9GDE30VD3VGW5Q1W9WX3')
      .willSendEq(1)
      .ft('ST1F7QA2MDF17S807EPA36TSS8AMEFY4KA9TVGWXT.sbtc-token', 'sbtc-token')
  
<strong>    let result: TransactionResult = await request('stx_callContract', {
</strong>      contract: 'ST11V9ZN6E6VG72SHMAVM9GDE30VD3VGW5Q1W9WX3.stacks-dev-quickstart-message-board',
      functionName: 'add-message',
      functionArgs: [Cl.stringUtf8(content)],
      network: 'testnet',
      postConditions: [postCond_1],
      postConditionMode: 'deny',
      sponsored: false
    })
  
    setContent('')
  }

  return (
    &#x3C;>
      // ...
      &#x3C;span className='input-container'>
        &#x3C;button onClick={addMessage}>add-message&#x3C;/button>
        &#x3C;input type="text" onChange={e => setContent(e.target.value)}/>
      &#x3C;/span>
    &#x3C;/>
  )
}
</code></pre>

Let's breakdown some of the transaction params we specified in our string literal method of `stx_callContract`&#x20;

* `contract` : this requires the full contract principal of the target contract.
* `functionName` : the name of the public function in the contract.
* `functionArgs` : an array of the required function arguments in the same order as coded in the actual function of the Clarity contract. The `Cl` namespace has type converter methods that help with converting your argument into the required Clarity type.
* `network` : the target network the contract is deployed on.
* `postConditions` & `postConditionMode` : [Post-Conditions](../../post-conditions/overview.md) for the frontend are declared to protect user assets. The `Pc` helper from `@stacks/transactions` helps us to declare post-condition statements for any type of asset and equality operator.
* `sponsored` : if the transaction fees will be sponsored or not.

Invoking our `addMessage` function will prompt the user's connected wallet to prompt a transaction confirmation popup. This popup will display all of the relevant information of the transaction as well as the post-condition statements that we've declared.

Invoking a contract function is just one example of sending transactions from the frontend. There is also calling read-only functions, initiating asset transfer transactions, and etc.

### Invoking asset transfer transactions

The `request` object also supports native asset transfers for both STX, fungible tokens, and non-fungible tokens. Here is an example of creating an sBTC transfer transaction on the frontend.

Since sBTC is a SIP-010 fungible token, we'll invoke the `stx_transferSip10Ft` method.

```typescript
import { request } from '@stacks/connect';

let response = await request('stx_transferSip10Ft', {
    asset: 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token',
    amount: 1,
    recipient: 'SP202X1VHZMN5S90T44N7SSQ496PYQD66XCPA7BNK',
    network: 'mainnet',
});
```

***

### Additional Resources

* \[[Learn Stacks.js](/broken/pages/dH5waQhE6Vb7rhcrUG7z)] Head to the Learn Stacks.js section to see more examples&#x20;
