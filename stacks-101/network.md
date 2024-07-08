# Network

### Tokens

Stacks (STX) tokens are the native tokens on the Stacks 2.0 blockchain. The smallest fraction is one micro-STX. 1,000,000 micro-STX make one Stacks (STX).

STX amounts should be stored as integers (8 bytes long), and represent the amount of micro-STX. For display purposes, micro-STX are divided by 1,000,000 (decimal precision of 6).

### Fees

Fees are used to incentivize miners to confirm transactions on the Stacks 2.0 blockchain. The fee is calculated based on the estimate fee rate and the size of the raw transaction in bytes. The fee rate is a market determined variable. For the testnet, it is set to 1 micro-STX.

Fee estimates can obtained through the [`GET /v2/fees/transfer`](https://docs.hiro.so/api#operation/get\_fee\_transfer) endpoint:

```bash
# for mainnet, replace `testnet` with `mainnet`
curl 'https://api.testnet.hiro.so/v2/fees/transfer'
```

The API will respond with the fee rate (as integer):

```json
1
```

[The Stacks Transactions JS library](https://github.com/hirosystems/stacks.js/tree/master/packages/transactions) supports fee estimation for:

* token transfers (`estimateTransfer`)
* contract deploys (`estimateContractDeploy`)
* non read-only contract calls (`estimateContractFunctionCall`)

{% hint style="info" %}
For an implementation using a different language than JavaScript, please review [this reference implementation](https://github.com/hirosystems/stacks.js/blob/master/packages/transactions/src/builders.ts#L97).
{% endhint %}

### Nonces

Every account carries a [nonce property](https://en.wikipedia.org/wiki/Cryptographic\_nonce) that indicates the number of transactions processed for the given account. Nonces are one-time codes, starting at `0` for new accounts, and incremented by 1 on every transaction.

Nonces are added to all transactions and help identify them in order to ensure transactions are processed in order and to avoid duplicated processing.

{% hint style="info" %}
The consensus mechanism also ensures that transactions aren't "replayed" in two ways. First, nodes query its unspent transaction outputs (UTXOs) in order to satisfy their spending conditions in a new transaction. Second, messages sent between nodes review sequence numbers.
{% endhint %}

When a new token transfer transaction is constructed, the most recent nonce of the account needs to fetched and set.

{% hint style="info" %}
The API provides an endpoint to [simplify nonce handling](https://docs.hiro.so/get-started/stacks-blockchain-api#nonce-handling).&#x20;
{% endhint %}

### Confirmations

The Stacks 2.0 network is anchored onto the bitcoin network. This allows transactions on Stacks to inherit the same finality and security of the Bitcoin blockchain.

The time to mine a block, to confirm transactions, will eventually match the expected "block time" of the bitcoin network: 10 minutes.

The block time is hardcoded and will change throughout the implementation phases of the testnet. The current block time can be obtained through the [`GET /extended/v1/info/network_block_times`](https://docs.hiro.so/api#operation/get\_network\_block\_times) endpoint:

```bash
# for mainnet, replace `testnet` with `mainnet`
curl 'https://api.testnet.hiro.so/extended/v1/info/network_block_times'
```

The API will respond with the block time (in seconds):

```js
{
    "testnet": {
        "target_block_time": 120
    },
    "mainnet": {
        "target_block_time": 600
    }
}
```

### Read-only function calls

Smart contracts can expose public function calls. For functions that make state modifications to the blockchain, transactions need to be generated and broadcasted.

However, for read-only function calls, transactions are **not** required. Instead, these calls can be done using the [Stacks Blockchain API](https://docs.hiro.so/get-started/stacks-blockchain-api).

{% hint style="info" %}
Read-only function calls do not require transaction fees
{% endhint %}

A read-only contract call can be done using the [`POST /v2/contracts/call-read/<stx_address>/<contract_name>/<function_name>`](https://docs.hiro.so/api#operation/call\_read\_only\_function) endpoint:

```bash
# for mainnet, replace `testnet` with `mainnet`
curl --location --request POST 'https://api.testnet.hiro.so/v2/contracts/call-read/<stx_address>/<contract_name>/<function_name>' \
--header 'Content-Type: application/json' \
--data-raw '{
  "sender": "<stx_address>.<contract_name>",
  "arguments": [<clarity_value>, ...]
}'
```

Sample response for a successful call:

```js
{
  "okay": true,
  "result": "<clarity_value>"
}
```

{% hint style="info" %}
To set the function call arguments and read the result, Clarity values need to be serialized into a hexadecimal string. The [Stacks Transactions JS](https://github.com/hirosystems/stacks.js/tree/master/packages/transactions) library supports these operations
{% endhint %}

### Querying

Stacks 2.0 network details can be queried using the [Stacks Blockchain API](https://docs.hiro.so/get-started/stacks-blockchain-api).

#### Health check

The [status checker](https://stacks-status.com/) is a service that provides a user interface to quickly review the health of the Stacks 2.0 blockchain.

#### Network info

The network information can be obtained using the [`GET /v2/info`](https://docs.hiro.so/api#operation/get\_core\_api\_info) endpoint:

```bash
# for mainnet, replace `testnet` with `mainnet`
curl 'https://api.testnet.hiro.so/v2/info'
```

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
