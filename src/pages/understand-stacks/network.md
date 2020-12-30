---
title: Network
description: Guide to the Stacks 2.0 network
icon: TestnetIcon
images:
  large: /images/pages/testnet.svg
  sm: /images/pages/testnet-sm.svg
---

## Tokens

Stacks (STX) tokens are the native tokens on the Stacks 2.0 blockchain. The smallest fraction is one micro-STX. 1,000,000 micro-STX make one Stacks (STX).

STX amounts should be stored as integers (8 bytes long), and represent the amount of micro-STX. For display purposes, micro-STX are divided by 1,000,000 (decimal precision of 6).

## Fees

Fees are used to incentivize miners to confirm transactions on the Stacks 2.0 blockchain. The fee is calculated based on the estimate fee rate and the size of the [raw transaction](http://localhost:3000/understand-stacks/transactions#serialization) in bytes. The fee rate is a market determined variable. For the [testnet](/understand-stacks/testnet), it is set to 1 micro-STX.

Fee estimates can obtained through the [`GET /v2/fees/transfer`](https://blockstack.github.io/stacks-blockchain-api/#operation/get_fee_transfer) endpoint:

```bash
curl 'https://stacks-node-api.blockstack.org/v2/fees/transfer'
```

The API will respond with the fee rate (as integer):

```json
1
```

[The Stacks Transactions JS library](https://github.com/blockstack/stacks.js/tree/master/packages/transactions) supports fee estimation for:

- token transfers (`estimateTransfer`)
- contract deploys (`estimateContractDeploy`)
- non read-only contract calls (`estimateContractFunctionCall`)

-> For an implementation using a different language than JavaScript, please review [this reference implementation](https://github.com/blockstack/stacks.js/blob/master/packages/transactions/src/builders.ts#L97).

## Nonces

Every account carries a [nonce property](https://en.wikipedia.org/wiki/Cryptographic_nonce) that indicates the number of transactions processed for the given account. Nonces are one-time codes and are incremented by 1 on every transaction.

Nonces are added to all transactions and help identify them in order to ensure transactions are processed in order and to avoid duplicated processing.

-> The consensus mechanism also ensures that transactions aren't "replayed" in two ways. First, nodes query its unspent transaction outputs (UTXOs) in order to satisfy their spending conditions in a new transaction. Second, messages sent between nodes review sequence numbers.

When a new [token transfer transaction](/understand-stacks/transactions#stacks-token-transfer) is constructed, the most recent nonce of the account needs to fetched and set.

## Confirmations

The Stacks 2.0 network is anchored onto the bitcoin network. This allows transactions on Stacks to inherit the same finality and security of the Bitcoin blockchain.

The time to mine a block, to confirm transactions, will eventually match the expected "block time" of the bitcoin network: 10 minutes.

The block time is hardcoded and will change throughout the implementation phases of the [testnet](/understand-stacks/testnet). The current block time can be obtained through the [`GET /extended/v1/info/network_block_times`](https://blockstack.github.io/stacks-blockchain-api/#operation/get_network_block_times) endpoint:

```bash
curl 'https://stacks-node-api.blockstack.org/extended/v1/info/network_block_times'
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

## Read-only function calls

Smart contracts can expose public function calls. For functions that make state modifications to the blockchain, transactions need to be generated and broadcasted.

However, for read-only function calls, transactions are **not** required. Instead, these calls can be done using the [Stacks Blockchain API](/understand-stacks/stacks-blockchain-api).

-> Read-only function calls do not require transaction fees

A read-only contract call can be done using the [`POST /v2/contracts/call-read/<stx_address>/<contract_name>/<function_name>`](https://blockstack.github.io/stacks-blockchain-api/#operation/call_read_only_function) endpoint:

```bash
curl --location --request POST 'https://stacks-node-api.blockstack.org/v2/contracts/call-read/<stx_address>/<contract_name>/<function_name>' \
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

-> To set the function call arguments and read the result, [Clarity values](http://localhost:3000/understand-stacks/transactions#clarity-value-types) need to be serialized into a hexadecimal string. The [Stacks Transactions JS](https://github.com/blockstack/stacks.js/tree/master/packages/transactions) library supports these operations

## Querying

Stacks 2.0 network details can be queried using the [Stacks Blockchain API](/understand-stacks/stacks-blockchain-api) and the [status checker](http://status.test-blockstack.com/).

### Health check

The [status checker](http://status.test-blockstack.com/) is a service that provides a user interface to quickly review the health of the Stacks 2.0 blockchain (including uptime and block rate).

The status checker can also be queried programmatically:

```bash
curl 'http://status.test-blockstack.com/json'
```

Sample response:

```js
{
    "masterNodePings":[{"timestamp":1599861000,"value":1}, ...],
    "sidecarPings":[{"timestamp":1599861000,"value":1}, ...],
    "calculatingBlockRate":false,
    "averageBlockRate":18.38961038961039,
    "blockRateDuration":6.416666666666667,
    "blockRateUnits":"blocks/hr",
    "blockRateStatus":0,
    "showLastHourAverage":true,
    "lastHourAverageBlockRate":16.8,
    "lastHourBlockRateStatus":0,
    "lastStacksChainTipHeight":"916",
    "lastStacksChainTipHeightTime":"1599861000",
    "lastBurnBlockHeight":"1946",
    "blockProgressStatus":0,
    "lastChainReset":"1599663900",
    "exitAtBlock":"5340",
    "estimatedTimeUntilReset":"4d 17h 8m",
    "seededFaucetTx":{"txid":"22415022359fcd419873e1d451fefd5be74f368f2857626a996efe0127680979","broadcasted":"1599858480","status":"success"},"
    seededTokenTransferTx":{"txid":"2250569c4d26d1da163ad1b940a27cde9db73d1b523f3fb50b13b7068f85903e","broadcasted":"1599858960","status":"success"},
    "seededContractDeployTx":{"txid":"65d85019231035bf3c549a8cb71ad46c3ac231bfb7269eee3bfff2dd9a60a606","broadcasted":"1599859680","status":"success"},"
    seededContractCallTx":{"txid":"e9d3e85b850c2d7ab3dc60fa48021e60a70e076519906a0c9e82ee52aab63e4c","broadcasted":"1599860160","status":"success"},
    "reseedAbortError":null,
    "reseedingStep":"0"
}
```

The easiest way of identifying the health is by looking at the `blockRateStatus` property:

| **Block Rate Value** | **Status**                                                                                                                                                                                   |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `0`                  | Online. All checks are successful                                                                                                                                                            |
| `1`                  | Slow. The network produces new blocks at slower rate as expected. Transaction confirmation times will likely take longer than the [set block time](/understand-stacks/network#confirmations) |
| `2`                  | Degraded. The network seems not to be fully operational                                                                                                                                      |

### Network info

The network information can be obtained using the [`GET /v2/info`](https://blockstack.github.io/stacks-blockchain-api/#operation/get_core_api_info) endpoint:

```bash
curl 'https://stacks-node-api.blockstack.org/v2/info'
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
