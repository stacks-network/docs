# broadcastTransaction

Broadcasts a serialized transaction to a Stacks node, which will validate and forward it to the network.

***

### Usage

```ts
import {
  makeSTXTokenTransfer,
  broadcastTransaction,
} from '@stacks/transactions';

const transaction = await makeSTXTokenTransfer({
  recipient: 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5',
  amount: 1000000n,
  senderKey: 'b244296d5907de9864c0b0d51f98a13c52890be0404e83f273144004b81874603',
  network: 'testnet',
});

const result = await broadcastTransaction({
  transaction,
  network: 'testnet',
});

if ('txid' in result) {
  console.log('Success:', result.txid);
} else {
  console.log('Rejected:', result.reason);
}
```

#### Notes

- Returns a `TxBroadcastResult` which is either a success (contains `txid`) or a rejection (contains `reason`).
- You can provide an optional `attachment` for contract deploys or other uses.
- The network is inferred from the transaction if not specified.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/fetch.ts#L36)**

***

### Signature

```ts
function broadcastTransaction(opts: {
  transaction: StacksTransactionWire;
  attachment?: Uint8Array | string;
} & NetworkClientParam): Promise<TxBroadcastResult>;
```

***

### Returns

`Promise<TxBroadcastResult>`

```ts
type TxBroadcastResult = TxBroadcastResultOk | TxBroadcastResultRejected;

type TxBroadcastResultOk = { txid: string };

type TxBroadcastResultRejected = {
  error: string;
  reason: string;
  txid: string;
  // Additional reason_data depending on rejection type
};
```

***

### Parameters

#### opts.transaction (required)

* **Type**: `StacksTransactionWire`

The signed transaction to broadcast.

#### opts.attachment (optional)

* **Type**: `Uint8Array | string`

An optional attachment in bytes or as a hex string.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to broadcast to. Inferred from the transaction if not provided.

#### opts.client (optional)

* **Type**: `NetworkClient`

Custom client configuration (base URL, fetch function) for the API call.
