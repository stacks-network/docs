# Network Basics

<div data-with-frame="true"><figure><img src="../.gitbook/assets/image (19).png" alt=""><figcaption></figcaption></figure></div>

## Tokens

Stacks (STX) tokens are the native tokens on the Stacks network. The smallest fraction is one micro-STX: 1,000,000 micro-STX make one Stacks (STX).

STX amounts should be stored as integers (8 bytes long), and represent the amount of micro-STX.

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
