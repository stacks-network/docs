---
description: Learn how post-conditions protect users from unexpected transaction outcomes.
---

# Overview

<div data-with-frame="true"><figure><img src="../.gitbook/assets/post-conditions-cover.png" alt=""><figcaption></figcaption></figure></div>

#### The Big Picture

* Post-conditions are constraints _you attach to a transaction_ that define exactly what assets (STX, SIP-010 tokens, NFTs) are allowed to move and how much.
* If the underlying smart contract execution would violate your declared limits, the entire transaction aborts.
* Even if a smart contract contains unexpected logic, it cannot move assets beyond what your post-conditions permit.
* Post-conditions are constructed on the client-side usually by the client-side developer. They are part of the signed transaction. Contracts cannot modify them.
* Wallets will parse the signed transaction and display the declared post-conditions to the user before broadcasting.

***

## What are post-conditions?

Post-conditions are assertions about an on-chain transaction that must be met; otherwise, the transaction will abort during execution. In other words, post-conditions act as a safety net, allowing you to specify what state changes can occur in a transaction.&#x20;

**At times, the client-side developer is not the same person who wrote the underlying smart contract and may not be deeply familiar with its internal logic, nested external contract calls, or edge cases.** This logic helps limit the amount of damage that can be done to a user and their assets, whether due to a bug or malicious behavior.

Put simply, post conditions are a set of conditions that must be met before a user's transaction will execute. The primary goal behind post conditions is to limit the amount of damage that can be done to a user's assets due to a bug, intentional or otherwise.

Post conditions are an additional safety feature built into the Stacks protocol itself that help to protect end users. Rather than being a feature of Clarity smart contracts, they are implemented on the client side and meant to be an additional failsafe against malicious contracts.

They are sent as part of the transaction when the user initiates it, meaning we need to implement post-conditions on the frontend. Whenever you are transferring an asset (fungible or non-fungible) from one address to another, you should take advantage of post conditions.

***

## Concrete Example

Let’s lock this in with a straightforward example.

{% stepper %}
{% step %}
### Frontend dev implements this donation script

A frontend dev is building a frontend app to allow users to donate STX by calling a particular Clarity contract. This Clarity contract has not been audited, for example. So out of caution, the frontend dev will declare post-condition statements to be passed into the construction of the transaction payload.

{% hint style="warning" %}
Remember, we are assuming the frontend developer is not the same person who wrote the underlying smart contract and may not be deeply familiar with its internal logic, nested external contract calls, or edge cases.
{% endhint %}

{% code title="Front-end application code with stacks.js" expandable="true" %}
```typescript
import { Cl, Pc } from "@stacks/transactions"
import { userData } from "./WalletContext"
import { request } from "@stacks/connect"

// --snip--

let userPrincipal = userData.stxAddress

let postCondition1 = Pc
    // This principal specified here
    .principal(`${userPrincipal}`)
    // will send exactly equal to the specified amount
    .willSendEq(`${donationAmount}`)
    // of STX in the transaction.
    .ustx()

await request("stx_callContract", {
    contractAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
    contractName: "donation",
    functionName: "donate",
    functionArgs: [Cl.uint(donationAmount)],
    // An array of post-condition statements to pass in.
    postConditions: [postCondition1],
    // Deny all other possible transfers to happen, if there are then abort.
    postConditionMode: "deny",
    network: "testnet",
})
```
{% endcode %}
{% endstep %}

{% step %}
### User sees this on the frontend

On the left side of the image, the user sees an input field to specify how much in STX they want to donate. The 'Donate' button allows them to construct the transaction and prompt their wallet to popup a confirmation modal.

On the right side of the image, wallets parse the passed transaction payload and displays the declared post-condition statements to the user before broadcasting. This allows the user to know what asset transfers to expect will occur during the execution of the transaction.

The user specified a donation amount of 5 STX, and the user should expect to only transfer exactly 5 STX during the transaction execution.

<div data-with-frame="true"><figure><img src="../.gitbook/assets/pc-example-1.png" alt=""><figcaption></figcaption></figure></div>
{% endstep %}

{% step %}
### What the contract function `donate` looks like

This is what the actual contract function of `donate` looks like. We are assuming that the frontend developer and the user is blindly aware of what this contract is _actually_ doing.

We can see that the contract will maliciously ignore the `amount` argument and instead transfer 100 STX out of the sender's wallet.

<pre class="language-clarity" data-title="The Clarity contract function being called from the transaction"><code class="lang-clarity">;; --snip--

(define-public (donate (amount uint))
  (begin
<strong>    (try! (stx-transfer? (+ amount u100000000) tx-sender (as-contract tx-sender)))
</strong>    (ok (map-set Donors tx-sender (+ (get-donation-amount tx-sender) amount)))
  )
)

;; --snip--
</code></pre>
{% endstep %}

{% step %}
### End result

The Stacks protocol will evaluate the proposed runtime result of the transaction with the declared post-condtions and determine if they match. In this example, the user expected to transfer out exactly 5 STX, but the contract wanted to transfer 100 STX. This discrepancy is evaluated to result in the transaction aborting and failing.

<div data-with-frame="true"><figure><img src="../.gitbook/assets/pc-example-2.png" alt=""><figcaption></figcaption></figure></div>
{% endstep %}
{% endstepper %}

***

## The post-condition stack

Post-conditions are enforced by the Stacks protocol itself but do not exist in the smart contracts themselves. Instead, they are programmatically constructed in your front-end application code using Stacks.js, specifically by passing them in as options to the transaction payload construction.

By having post-conditions in the frontend code, Stacks-enabled wallets, such as Leather and Xverse, are able to display the post-conditions in a human-readable format for the user when confirming their transactions. Once a user confirms the transaction, the post-conditions get carried along with the transaction payload where eventually the Stacks protocol will evaluate them together.&#x20;

<div data-with-frame="true"><figure><img src="../.gitbook/assets/post-condition-stack.png" alt=""><figcaption><p><em>A visualization of the “post-conditions stack" and the entities involved</em></p></figcaption></figure></div>

If there were no post-conditions in the front-end application code, a user’s wallet will display an abstract warning message, where it would be up to the user to decide whether they want to blindly proceed with the transaction or not. And whatever the underlying contract code wants to do, it will do without any post-condition restrictions. So if a contract tries to send your STX tokens to a drainer wallet, it will without you knowing.&#x20;

Even with post-conditions set up on the frontend code, a user is still blind to the underlying Clarity smart contract code, but at least they know what to _expect_ will happen in the transaction. And if that expectation is not met, the transaction will abort and fail.

***

## Using the `Pc` helper

The `Pc` helper provides a fluent API for creating post-condition statements with better type safety and readability.

```ts
import { Pc } from '@stacks/transactions';

// STX transfer post-condition
const stxCondition = Pc
  .principal('STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6')
  .willSendGte(1000)
  .ustx();

// Fungible token post-condition
const ftCondition = Pc
  .principal('STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6')
  .willSendEq(50)
  .ft('SP3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH335.my-token', 'my-token');

// NFT post-condition
const nftCondition = Pc
  .principal('STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6')
  .willSendAsset()
  .nft('SP3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH335.my-nft::my-asset', Cl.uint(1));
```

### Manual creation

Create post-conditions manually using type definitions when building conditions dynamically.

```ts
import {
  StxPostCondition,
  FungiblePostCondition,
  NonFungiblePostCondition
} from '@stacks/transactions';

// STX post-condition
const stxPostCondition: StxPostCondition = {
  type: 'stx-postcondition',
  address: 'SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B',
  condition: 'gte', // 'eq' | 'gt' | 'gte' | 'lt' | 'lte'
  amount: '100',
};
```

Available condition types:

* `eq`: Exactly equal to amount
* `gt`: Greater than amount
* `gte`: Greater than or equal to amount
* `lt`: Less than amount
* `lte`: Less than or equal to amount

#### Fungible tokens

```ts
const ftPostCondition: FungiblePostCondition = {
  type: 'ft-postcondition',
  address: 'SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B',
  condition: 'eq',
  amount: '100',
  asset: 'SP3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH335.my-ft-token::my-token',
};
```

#### Non-fungible tokens

```ts
const nftPostCondition: NonFungiblePostCondition = {
  type: 'nft-postcondition',
  address: 'SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B',
  condition: 'sent', // 'sent' | 'not-sent'
  asset: 'SP3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH335.my-nft::my-asset',
  assetId: Cl.uint(602),
};
```

***

## Post-Condition Modes

Control how unspecified, unexpected, or unforeseen asset transfers are handled with post-condition mode.

<div data-with-frame="true"><figure><img src="../.gitbook/assets/post-condition-decision-flowchart.png" alt=""><figcaption></figcaption></figure></div>

#### **Deny Mode**

Deny mode is the default for post-conditions. Deny is a more-strict setting for post-conditions, and it says that any other asset transfers that do not meet the criteria of the post-condition are denied. In deny mode, any transaction that does not meet the post-condition criteria will fail.

```ts
import { PostConditionMode } from '@stacks/transactions';

const tx = await makeContractCall({
  // ...
  postConditionMode: PostConditionMode.Deny,
  postConditions: [
    // your conditions
  ],
});
```

This setting is useful when you want to limit any transfer events to a specific set of criteria. This setting is ultimately what makes post-conditions powerful, hence the reason why this is defaulted as `deny` if you don’t or forget to pass in a `postConditionMode` option.

{% hint style="warning" %}
Post-condition mode\
Always use `Deny` mode unless you have a specific reason to allow additional transfers. This provides maximum security for users.
{% endhint %}

#### Allow mode

Allow mode is a less-strict setting, in which it “allows” any transaction to execute as long as it meets the criteria of the specified post-conditions. In other words, this `allow` mode enables additional transactions to occur as long as the post-condition is met in that process. This setting is useful when you want to allow other unknown or dynamic transfers to happen. But usually you wouldn’t want to have this happen as this can open up unintended consequences for the user.

## How post-conditions appear to the user

Since post-conditions are declared on your frontend code, they also need to be visually displayed to users. Stacks-supported wallets handle that by displaying post-conditions on the transaction confirmation modals that popup when a user needs to confirm/approve a transaction.

<div data-with-frame="true"><figure><img src="../.gitbook/assets/post-condition-modes.png" alt=""><figcaption><p>How post-conditions appear in wallets under different post-condition modes</p></figcaption></figure></div>

***

## Things to be aware of

While powerful, post-conditions have some limitations you should keep in mind. **Post-conditions only track who&#x20;**_**sends**_**&#x20;an asset, and how much.** They do not monitor who owns any set of assets when the transaction finishes, nor do they monitor the sequence of owners an asset might have during transaction execution.

Alongside those limitations, it should be obvious, but it’s worth explicitly stating that post-conditions are not a catch-all. Just because you implement post-conditions doesn’t mean your contract or next transaction are guaranteed to be safe. Bugs can still occur, and you still need to build with security in mind. Debugging and extensive tests are still your best friend.

***

### Additional Resources

* \[[Hiro Blog](https://www.hiro.so/blog/a-developers-guide-to-post-conditions)] A Developer’s Guide to Post-Conditions
* \[[dev.to](https://dev.to/stacks/understanding-stacks-post-conditions-e65)] Understanding Stacks Post Conditions
* \[[Hiro YT](https://youtu.be/xXgQB8NfdEY?si=aEY_wrLybfWPMJTt)] ELI5: Post-Condtions on Stacks
* \[[Hiro YT](https://youtu.be/wagcE_IXfME?si=kDqxzPAQ-XsA478l)] Understanding Post-Conditions in a Stacks Blockchain Transaction
* \[[StacksGov](https://github.com/stacksgov/sips/blob/main/sips/sip-005/sip-005-blocks-and-transactions.md#transaction-post-conditions)] Post-conditions section in SIP-005
