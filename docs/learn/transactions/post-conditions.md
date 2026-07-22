# Post Conditions

<div data-with-frame="true"><figure><img src="../.gitbook/assets/image (29).png" alt=""><figcaption></figcaption></figure></div>

{% hint style="info" %}
**Builder Resources**

* For a deeper dive on post-conditions usage, [here](https://app.gitbook.com/s/Zz9BLmTU9oydDpL3qiUh/post-conditions/overview).
* For post-conditions' technical specification outlined in SIP-005, [here](https://github.com/stacksgov/sips/blob/main/sips/sip-005/sip-005-blocks-and-transactions.md#transaction-post-conditions).&#x20;
* For Originator mode and the MAY SEND NFT condition outlined in SIP-040, [here](https://github.com/stacksgov/sips/blob/main/sips/sip-040/sip-040-post-conds.md).
* For the staking and PoX post-conditions outlined in SIP-045, [here](https://github.com/stacksgov/sips/blob/main/sips/sip-045/sip-045-pox-5-bitcoin-staking.md).
{% endhint %}

#### **The Big Picture**

* Post-conditions are constraints _you attach to a transaction_ that define exactly what assets (STX, SIP-010 tokens, NFTs) are allowed to move and how much — and, starting with SIP-045, what staking and PoX actions are allowed to occur.
* If the underlying smart contract execution would violate your declared limits, the entire transaction aborts.
* Even if a smart contract contains unexpected logic, it cannot move assets beyond what your post-conditions permit.
* Post-conditions are constructed on the client-side usually by the client-side developer. They are part of the signed transaction. Contracts cannot modify them.
* Wallets will parse the signed transaction and display the declared post-conditions to the user before broadcasting.

***

### What are post-conditions? <a href="#what-are-post-conditions" id="what-are-post-conditions"></a>

Post-conditions are assertions about an on-chain transaction that must be met; otherwise, the transaction will abort during execution. In other words, post-conditions act as a safety net, allowing you to specify what state changes can occur in a transaction.

**At times, the client-side developer is not the same person who wrote the underlying smart contract and may not be deeply familiar with its internal logic, nested external contract calls, or edge cases.** This logic helps limit the amount of damage that can be done to a user and their assets, whether due to a bug or malicious behavior.

Put simply, post conditions are a set of conditions that must be met before a user's transaction will execute. The primary goal behind post conditions is to limit the amount of damage that can be done to a user's assets due to a bug, intentional or otherwise.

Post conditions are an additional safety feature built into the Stacks protocol itself that help to protect end users. Rather than being a feature of Clarity smart contracts, they are implemented on the client side and meant to be an additional failsafe against malicious contracts.

They are sent as part of the transaction when the user initiates it, meaning we need to implement post-conditions on the frontend. Whenever you are transferring an asset (fungible or non-fungible) from one address to another, you should take advantage of post conditions.

Post-conditions originally covered only asset transfers — STX, fungible tokens, and NFTs. Starting with Stacks epoch 4.0, [SIP-045](https://github.com/stacksgov/sips/blob/main/sips/sip-045/sip-045-pox-5-bitcoin-staking.md) extends them to staking: a staking post-condition constrains how much STX a principal locks (or modifies) when staking, and a PoX post-condition constrains whether a principal performs other PoX actions such as unstaking. This means a user can also be protected from a contract unexpectedly changing their staking position, not just from unexpected transfers.

***

> #### _Post-conditions act as a safety net, allowing you to specify what state changes can and should occur during the execution of a transaction._
