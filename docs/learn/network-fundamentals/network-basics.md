# Tokens

<div data-with-frame="true"><figure><img src="../.gitbook/assets/image (19).png" alt=""><figcaption></figcaption></figure></div>

## Tokens

Stacks (STX) tokens are the native tokens on the Stacks network. The smallest fraction is one micro-STX: 1,000,000 micro-STX make one Stacks (STX).

STX amounts should be stored as integers (8 bytes long), and represent the amount of micro-STX.

### Why Does Stacks Need a Token?

This brings us to a central philosophical conversation in the world of crypto and Bitcoin, whether or not blockchains need tokens.

Let's start by looking at the fundamental reason why tokens exist: to fund the maintenance and forward progress of a blockchain.

Bitcoin is a token. It is a cryptocurrency that is used to incentivize miners to add new blocks to the chain. In Bitcoin's case, mining rewards are set on a predefined schedule, and once those mining rewards run out, the chain will need to survive on transaction fees alone.

The purpose of a blockchain is to have a permanent historical record of every transaction that has ever occurred on the chain. Blockchains are basically ledgers. The token aspect is used as an incentive mechanism to secure and maintain the chain.

This is why networks like Lightning and other P2P networks don't need tokens, they don't need to maintain a historical record. Channel-based solutions like Lightning rely on users opening 2-of-2 multisigs with each other. Once those channels are closed, the state disappears. When we are talking about a system that is supposed to maintain a global financial system, it is important for the maintenance of that system to be incentivized correctly.

Let's look at this concept in the context of Stacks and its goals. Stacks seeks to provide smart contract functionality to Bitcoin, to serve as the programming rails for building a decentralized economy on top of Bitcoin.

Many Bitcoin community members are skeptical of new tokens and rightly so. There are countless projects out there that force the use of a token on their project and in many cases a token is actually not needed. The Stacks project was started by Bitcoin builders who have a long history of building apps & protocols on Bitcoin L1 without any token (e.g., BNS launched in 2015 on Bitcoin L1 which was one of the largest protocols using OP\_RETURN on Bitcoin L1). So why did a bunch of Bitcoin builders decide to have a separate token for Stacks L2? Great question! Let's dig into the details.

The Stacks token (STX) is primarily meant to be used for two things:

{% stepper %}
{% step %}
**Incentives for Stacks L2 miners**

Newly minted STX are used to incentivize decentralized block production on Stacks L2.
{% endstep %}

{% step %}
**Incentives for peg-out signers**

Signers participating in peg-out operations receive incentives in STX to economically align them with protocol rules.
{% endstep %}
{% endstepper %}

The only way to remove the token is to build Stacks as a federated network like Liquid. In a federation the pre-selected group of companies control the mining and block production and a pre-selected group of companies need to be trusted for peg-out transactions.

Stacks developers wanted to design an open and permissionless system. The only way to have a decentralized mining process is through incentives. As mentioned above, this is how Bitcoin works as well, where newly minted BTC are used as incentives to mine new blocks and anyone in the world can decide to become a miner. Anyone with BTC can mine the Stacks L2 chain, it is open and permissionless.

Similarly, the way sBTC is designed is that the group of signers is open and permissionless (unlike a federation). These signers have economic incentives to correctly follow the protocol for peg-out requests. In a federation, users need to blindly trust the pre-set federation members to get their BTC out of the federation and back on Bitcoin L1. Stacks developers wanted to have an open, permissionless, and decentralized way to move BTC from Bitcoin L1 to Stacks L2 and back. This is made possible through economic incentives i.e., need for a token.

Other than these two reasons, STX is also used to pay gas fees for transactions. However, once the upcoming sBTC peg is live most of the economy of Stacks L2 is expected to follow a Bitcoin standard and work using BTC as the economic unit. It is expected that users will mostly interact just with Bitcoin and use BTC in wallets and apps (gas fees can be paid with BTC using atomic swaps in the background). It is important to note that BTC cannot be used for mining incentives on Stacks L2 because the only way to incentivize decentralized block production is through newly minted assets by the protocol (similar to how Bitcoin works itself) i.e., need for a token.

## Fees

Fees are used to incentivize miners to confirm transactions on the Stacks blockchain. The fee is calculated based on the estimate fee rate and the size of the raw transaction in bytes. The fee rate is a market determined variable. For the testnet, it is set to 1 micro-STX.

## Nonces

Every account carries a [nonce property](https://en.wikipedia.org/wiki/Cryptographic_nonce) that indicates the number of transactions processed for the given account. Nonces are one-time codes, starting at `0` for new accounts, and incremented by 1 on every transaction.

Nonces are added to all transactions and help identify them in order to ensure transactions are processed in order and to avoid duplicated processing.

{% hint style="info" %}
The consensus mechanism also ensures that transactions aren't "replayed" in two ways. First, nodes query its unspent transaction outputs (UTXOs) in order to satisfy their spending conditions in a new transaction. Second, messages sent between nodes review sequence numbers.
{% endhint %}

When a new token transfer transaction is constructed, the most recent nonce of the account needs to be fetched and set.

### How nonce gaps are detected and resolved

Stacks transactions must be executed **strictly in nonce order**. When a transaction is submitted with a nonce higher than expected, the network does **not** reject it outright—instead, it tracks the gap and waits for the missing nonces to arrive.

Below is a conceptual walkthrough, with visual responses from the API, of how the system behaves when nonces are submitted out of order.

{% stepper %}
{% step %}
#### Initial state (no pending transactions)

```json
{
  last_mempool_tx_nonce: null,
  last_executed_tx_nonce: 241,
  possible_next_nonce: 242,
  detected_missing_nonces: [],
  detected_mempool_nonces: []
}
```

**Interpretation**

* All transactions up to nonce `241` have executed
* The network expects nonce `242` next
* No transactions are currently waiting in the mempool
* No nonce gaps exist
{% endstep %}

{% step %}
#### Submitting a future nonce (`245`)

```json
{
  last_mempool_tx_nonce: 245,
  last_executed_tx_nonce: 241,
  possible_next_nonce: 246,
  detected_missing_nonces: [244, 243, 242],
  detected_mempool_nonces: []
}
```

**Interpretation**

* A transaction with nonce `245` is now in the mempool
* Nonces `242`, `243`, and `244` are missing
* Execution cannot proceed until those nonces are submitted
* `possible_next_nonce` reflects the highest observed nonce + 1
{% endstep %}

{% step %}
#### Submitting a partial gap (`243`)

```json
{
  last_mempool_tx_nonce: 245,
  last_executed_tx_nonce: 241,
  possible_next_nonce: 246,
  detected_missing_nonces: [244, 242],
  detected_mempool_nonces: [243]
}
```

**Interpretation**

* Nonce `243` is now present in the mempool
* Nonces `242` and `244` are still missing
* Execution is still blocked
* The API distinguishes between:
  * `detected_mempool_nonces` → present but unexecuted
  * `detected_missing_nonces` → required but not yet seen
{% endstep %}

{% step %}
#### Filling more gaps (`244`)

```json
{
  last_mempool_tx_nonce: 245,
  last_executed_tx_nonce: 241,
  possible_next_nonce: 246,
  detected_missing_nonces: [242],
  detected_mempool_nonces: [243, 244]
}
```

**Interpretation**

* Nonces `243` and `244` are both waiting in the mempool
* Nonce `242` is still missing
* Execution remains paused at `241`
{% endstep %}

{% step %}
#### All required nonces present (`242`)

```json
{
  last_mempool_tx_nonce: 245,
  last_executed_tx_nonce: 241,
  possible_next_nonce: 246,
  detected_missing_nonces: [],
  detected_mempool_nonces: [242, 243, 244]
}
```

**Interpretation**

* All required nonces (`242–245`) are now available
* No gaps remain
* The network can execute transactions sequentially
{% endstep %}

{% step %}
#### After execution completes

```json
{
  last_mempool_tx_nonce: null,
  last_executed_tx_nonce: 245,
  possible_next_nonce: 246,
  detected_missing_nonces: [],
  detected_mempool_nonces: []
}
```

**Interpretation**

* All pending transactions have executed
* The account nonce has advanced to `245`
* The next valid nonce is now `246`
* The mempool state is clean again
{% endstep %}
{% endstepper %}

##
