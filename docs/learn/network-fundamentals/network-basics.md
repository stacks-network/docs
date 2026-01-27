# Network Basics

<div data-with-frame="true"><figure><img src="../.gitbook/assets/image (19).png" alt=""><figcaption></figcaption></figure></div>

## Tokens

Stacks (STX) tokens are the native tokens on the Stacks blockchain. The smallest fraction is one micro-STX. 1,000,000 micro-STX make one Stacks (STX).

STX amounts should be stored as integers (8 bytes long), and represent the amount of micro-STX.

## Fees

Fees are used to incentivize miners to confirm transactions on the Stacks blockchain. The fee is calculated based on the estimate fee rate and the size of the raw transaction in bytes. The fee rate is a market determined variable. For the testnet, it is set to 1 micro-STX.

Fee estimates can obtained through the [`GET /v2/fees/transfer`](https://docs.hiro.so/api#operation/get_fee_transfer) endpoint of the API.

{% hint style="info" %}
Note that this example uses an external tool, [Hiro's Stacks API](https://www.hiro.so/stacks-api). You can also use the native [Stacks API ](https://app.gitbook.com/u/ZrQItu6D9bMKmf1HfsLTnGc05WZ2)if you would rather run your own node or connect to one.
{% endhint %}

{% code title="terminal" %}
```bash
# for mainnet, replace `testnet` with `mainnet`
curl 'https://api.testnet.hiro.so/v2/fees/transfer'
```
{% endcode %}

The API will respond with the fee rate (as integer):

```json
1
```

[The Stacks Transactions JS library](https://github.com/stx-labs/stacks.js/tree/master/packages/transactions) supports fee estimation for:

* token transfers (`estimateTransfer`)
* contract deploys (`estimateContractDeploy`)
* non read-only contract calls (`estimateContractFunctionCall`)

{% hint style="info" %}
For an implementation using a different language than JavaScript, please review [this reference implementation](https://github.com/stx-labs/stacks.js/blob/master/packages/transactions/src/builders.ts#L97).
{% endhint %}

## Nonces

Every account carries a [nonce property](https://en.wikipedia.org/wiki/Cryptographic_nonce) that indicates the number of transactions processed for the given account. Nonces are one-time codes, starting at `0` for new accounts, and incremented by 1 on every transaction.

Nonces are added to all transactions and help identify them in order to ensure transactions are processed in order and to avoid duplicated processing.

{% hint style="info" %}
The consensus mechanism also ensures that transactions aren't "replayed" in two ways. First, nodes query its unspent transaction outputs (UTXOs) in order to satisfy their spending conditions in a new transaction. Second, messages sent between nodes review sequence numbers.
{% endhint %}

When a new token transfer transaction is constructed, the most recent nonce of the account needs to be fetched and set.

{% hint style="info" %}
The API provides an endpoint to [simplify nonce handling](https://docs.hiro.so/get-started/stacks-blockchain-api#nonce-handling).
{% endhint %}

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

## Querying

Stacks network details can be queried using the [Stacks Blockchain API](https://docs.hiro.so/get-started/stacks-blockchain-api).

#### Health check

The [status checker](https://status.stacks.org/) is a service that provides a user interface to quickly review the health of the Stacks blockchain.

#### Network info

The network information can be obtained using the [`GET /v2/info`](https://docs.hiro.so/api#operation/get_core_api_info) endpoint:

{% code title="curl (testnet)" %}
```bash
# for mainnet, replace `testnet` with `mainnet`
curl 'https://api.testnet.hiro.so/v2/info'
```
{% endcode %}

Sample response:

```js
{
    "peer_version": 385875968,
    "burn_consensus": "826401d65cf3671210a3fb135d827d549c0b4d37",
    "burn_block_height": 1972,
    "stable_burn_consensus": "e27ea23f199076bc41a729d76a813e125b725f64",
    "stable_burn_block_height": 1971,
    "server_version": "blockstack-core 0.0.1 => 23.0.0.0 (master:bdd042242+, release build, linux [x86_64]",
    "network_id": 2147483648,
    "parent_network_id": 3669344250,
    "stacks_tip_height": 933,
    "stacks_tip": "1f601823fbcc5b6b2215b2ff59d2818fba61ee4a3cea426d8bc3dbb268005d8f",
    "stacks_tip_burn_block": "54c56a9685545c45accf42b5dcb2787c97eda8185a1c794daf9b5a59d4807abc",
    "unanchored_tip": "71948ee211dac3b241eb65d881637f649d0d49ac08ee4a41c29217d3026d7aae",
    "exit_at_block_height": 28160
}
```
