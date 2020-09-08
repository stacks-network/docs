---
title: Transaction generation
description: Guide to Stacks 2.0 transactions
---

## Introduction

Transactions are the fundamental unit of execution in the Stacks blockchain. Each transaction is originated from a standard account, and is retained in the Stacks blockchain history for eternity. This guide helps you understand Stacks 2.0 transactions.

If you want to jump right in and broadcast your first transaction, try this tutorial:

[@page-reference | inline]
| /stacks-blockchain/sending-tokens

-> The information on this page is based on a design proposal. You can find more conceptual details in this document: [SIP 005: Blocks, Transaction, Accounts](https://github.com/blockstack/stacks-blockchain/blob/master/sip/sip-005-blocks-and-transactions.md).

## Lifecycle

Transactions go through phases before being finally confirmed, and available for all, on the Stacks 2.0 network.

![Transaction lifecycle](/images/tx-lifecycle.png)

- **Generate**: Transactions are assembled according to the encoding specification.
- **Verify and sign**: Transactions are verified to confirm if they are well-formed. Required signatures are filled in.
- **Broadcast**: Transactions are send to a node.
- **Register**: A miner receives transactions and adds them to the "mempool", a holding area for all the pending transactions.
- **Process**: Miners review the mempool and select transactions for the next blocked to be mined. Depending on the transaction type, different actions can happen during this step. For example, post-conditions could be verified for a token transfer, new tokens could be minted, or an attempt to call an existing smart contract method could be made.
- **Confirm**: Miners successfully mine blocks with a set of transactions. The transactions inside are successfully propogated to the network.

## Types

The Stacks 2.0 supports a set of different transaction types:

| **Type**          | **Description**                                                                                                   |
| ----------------- | ----------------------------------------------------------------------------------------------------------------- |
| Coinbase          | The first transaction in a new block (an entity holding several transactions). Used to register for block rewards |
| Token transfer    | Asset transfer from a sender to a recipient                                                                       |
| Contract creation | Contract instantiation                                                                                            |
| Contract call     | Contract call for a public, non read-only function                                                                |
| Poison Microblock | Punish leaders who intentionally equivocate about the microblocks they package                                    |

-> A sample of each transaction type can be found in the [Stacks Blockchain API response definition for transactions](https://blockstack.github.io/stacks-blockchain-api/#operation/get_transaction_by_id).

## Post-conditions

Transaction post-conditions are a feature meant to limit the damage smart contract bugs can do in terms of destroying a user's assets whenever a contract is instantiated or a public method of an existing contract is executed. Post-conditions are meant to be added by the user (or by the user's wallet software) at the moment they sign a transaction.

Post-conditions are intended to be used to force a transaction to abort if the transaction would cause a principal to send an asset in a way that is not to the user's liking. For example, a user may append a post-condition saying that upon successful execution, their account's STX balance should have decreased by no more than 1 STX. If this is not the case, then the transaction would abort and the account would only pay the transaction fee of processing it.

### Attributes

Each transaction includes a field that describes zero or more post-conditions that must all be true when the transaction finishes running. A post-conditiona includes the following information:

| **Attribute** | **Description**                                                                           |
| ------------- | ----------------------------------------------------------------------------------------- |
| Principal     | Sender of the transaction, can be a Stacks address or a contract                          |
| Asset name    | Asset to apply conditions to (could be Stacks, fungible, or non-fungible tokens)          |
| Comparator    | Compare operation to be applied (could define "how much" or "whether or not")             |
| Literal       | Integer or boolean value used to compare instances of the asset against via the condition |

### Evaluation modes

The Stacks blockchain supports an `allow` or `deny` mode for evaluating post-conditions:

- Allow: other asset transfers not covered by the post-conditions are permitted
- Deny: no other asset transfers are permitted besides those named in the post-conditions

## Authorization

Transactions can be authorized in two ways: _standard_ and _sponsored_. The authorization determines whether or not the originating account is also the paying account. In a transaction with a standard authorization, the origin and paying accounts are the same. In a transaction with a sponsored authorization, the origin and paying accounts are distinct, and both accounts must sign the transaction for it to be valid (first the origin, then the spender).

**Sponsored transactions** enable developers and/or infrastructure operators to pay for users to call into their smart contracts, even if users do not have the STX to do so.

The signing flow for sponsored transactions would be to have the user first sign the transaction with their origin account with the intent of it being sponsored (i.e. the user must explicitly allow a sponsor to sign), and then have the sponsor sign with their paying account to pay for the user's transaction fee.

## Encoding

A transaction includes the following information. Multiple-byte fields are encoded as big-endian.

| **Type**        | **Description**                                                                                                                                                                                                           |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Version number  | Network version. `0x80` for testnet, `0x0` for mainnet                                                                                                                                                                    |
| Chain ID        | Chain instance ID. `0x80000000` for testnet, `0x00000001` for mainnet                                                                                                                                                     |
| Authorization   | Type of authorization (`0x04` for standard, `0x05` for sponsored) and [spending conditions](https://github.com/blockstack/stacks-blockchain/blob/master/sip/sip-005-blocks-and-transactions.md#transaction-authorization) |
| Post-conditions | List of post-conditions, each including a [type ID and varible-length condition body](https://github.com/blockstack/stacks-blockchain/blob/master/sip/sip-005-blocks-and-transactions.md#transaction-post-conditions-1)   |
| Payload         | Transaction type and variable-length [payload](https://github.com/blockstack/stacks-blockchain/blob/master/sip/sip-005-blocks-and-transactions.md#transaction-payloads-1)                                                 |

## Construction

The easies way to construct well-formed transactions is by [using the Stacks Transactions JS liberary](https://github.com/blockstack/stacks-transactions-js#post-conditions). You can construct the follow transaction types:

- Stacks token transfer
- Smart contract deploy
- Smart contract function call

-> Note that transaction construction requires setting the network the transaction is for. This can be either mainnet or testnet. At the moment of this writing, the only available option is the testnet network. Learn more about it [here](/stacks-blockchain/testnet).

### Stacks Token transfer

```js
import { makeSTXTokenTransfer, StacksTestnet } from '@blockstack/stacks-transactions';
const BigNum = require('bn.js');

const txOptions = {
  recipient: 'SP3FGQ8Z7JY9BWYZ5WM53E0M9NK7WHJF0691NZ159',
  amount: new BigNum(12345),
  senderKey: 'b244296d5907de9864c0b0d51f98a13c52890be0404e83f273144cd5b9960eed01',
  network: new StacksTestnet(),
  memo: 'test memo',
  nonce: new BigNum(0), // set a nonce manually if you don't want builder to fetch from a Stacks node
  fee: new BigNum(200), // set a tx fee if you don't want the builder to estimate
};

const transaction = await makeSTXTokenTransfer(txOptions);
```

### Smart contract deployment

```js
import { makeContractDeploy, StacksTestnet } from '@blockstack/stacks-transactions';
const BigNum = require('bn.js');

const txOptions = {
  contractName: 'contract_name',
  codeBody: fs.readFileSync('/path/to/contract.clar').toString(),
  senderKey: 'b244296d5907de9864c0b0d51f98a13c52890be0404e83f273144cd5b9960eed01',
  network: new StacksTestnet(),
};

const transaction = await makeContractDeploy(txOptions);
```

### Smart contract function call

```js
import { makeContractCall, BufferCV, StacksTestnet } from '@blockstack/stacks-transactions';
const BigNum = require('bn.js');

const txOptions = {
  contractAddress: 'SPBMRFRPPGCDE3F384WCJPK8PQJGZ8K9QKK7F59X',
  contractName: 'contract_name',
  functionName: 'contract_function',
  functionArgs: [bufferCVFromString('foo')],
  senderKey: 'b244296d5907de9864c0b0d51f98a13c52890be0404e83f273144cd5b9960eed01',
  // attempt to fetch this contracts interface and validate the provided functionArgs
  validateWithAbi: true,
  network: new StacksTestnet(),
};

const transaction = await makeContractCall(txOptions);
```

### Setting post-conditions

The Stacks Transactions JS liberary supports construction of post conditions.

Here is an example of the earlier mentioned post condition ("account's STX balance should have decreased by no more than 1 STX"):

```js
const account = 'SP2ZD731ANQZT6J4K3F5N8A40ZXWXC1XFXHVVQFKE';
const comparator = FungibleConditionCode.GreaterEqual;
// assuming the STX balance before the transaction is 12346
const amount = new BigNum(12345);

const standardSTXPostCondition = makeStandardSTXPostCondition(
  account,
  comparator,
  amount
);

const postConditions = [
  makeStandardSTXPostCondition(
    postConditionAddress,
    postConditionCode,
    postConditionAmount
  )
];

const txOptions = {
  ..., // other transaction options
  postConditions: [standardSTXPostCondition]
}

const transaction = await makeContractCall(txOptions);
```

## Serialization

A well-formed transaction construct is encoded in [Recursive Length Prefix ("RLP")](https://eth.wiki/en/fundamentals/rlp). RLP encoding results in a variable-sized byte array.

In order to broadcast transactions to and between nodes on the network, RLP data is represented in hexadecial (also called the **raw format**).

To support an API-friendly and human-readable representation, transactions are serialized into a JSON format.

=> [The Stacks Transactions JS liberary](https://github.com/blockstack/stacks-transactions-js) supports serialization of transactions.

### Raw format

Broadcasting transactions directly to the Stacks Blockchain API or Node RPC API requires the transaction to be serialized and in hexadecimal representation.

```js
// to see the raw serialized tx
const serializedTx = transaction.serialize().toString('hex');

console.log(serializedTx);
```

The method above will return the following string:

```shell
8080000000040015c31b8c1c11c515e244b75806bac48d1399c77500000000000000000000000000000000000127e88a68dce8689fc94ff4c186bf8966f8d544c5129ff84d95a2459b5e8e7c39430388f6c8f85cce8c9ce5e6ec1e157116ca4a67d65ab53768b25d5fb5831939030200000000000516df0ba3e79792be7be5e50a370289accfc8c9e03200000000000f424068656c6c6f20776f726c640000000000000000000000000000000000000000000000
```

### JSON format

When called the Stacks Blockchain API or Node RPC API, transactions returned will be serialized in a JSON format. Here is a token transfer transaction:

```js
{
  "tx_id": "0x19e25515652dad41ef675bd0670964e3d537b80ec19cf6ca6f1dd65d5bc642c6",
  "tx_status": "success",
  "tx_type": "token_transfer",
  "fee_rate": "180",
  "sender_address": "STJTXEJPJPPVDNA9B052NSRRBGQCFNKVS178VGH1",
  "sponsored": false,
  "post_condition_mode": "deny",
  "block_hash": "0x9080f6df3e0be0d6de67569330e547346a44c8ecd30d9d76b5edd1b49e2c22f6",
  "block_height": 3190,
  "burn_block_time": 1594227992,
  "canonical": true,
  "tx_index": 1,
  "token_transfer": {
    "recipient_address": "ST1RZG804V6Y0N4XHQD3ZE2GE3XSCV3VHRKMA3GB0",
    "amount": "10000",
    "memo": "0x00000000000000000000000000000000000000000000000000000000000000000000"
  },
  "events": [
    {
      "event_index": 0,
      "event_type": "stx_asset",
      "asset": {
        "asset_event_type": "transfer",
        "sender": "STJTXEJPJPPVDNA9B052NSRRBGQCFNKVS178VGH1",
        "recipient": "ST1RZG804V6Y0N4XHQD3ZE2GE3XSCV3VHRKMA3GB0",
        "amount": "10000"
      }
    }
  ]
}
```

## Signature and Verification

### Clarity value types

## Broadcast

- what network?

## Querying

Transactions on the Stacks 2.0 network can be queried using the [Stacks Blockchain API](/references/stacks-blockchain). The API exposes two interfaces, a RESTful JSON API and a WebSockets API.

-> Note: The API can be easily consumed using a generated [JS client library](https://blockstack.github.io/stacks-blockchain-api/client/index.html).

### Get recent transactions

### Get mempool transactions

### Get transaction by ID

### Broadcast raw transactions

- How do you filter for a specific type of transactions?
