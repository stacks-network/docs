# fetchFeeEstimate

Estimates the transaction fee by trying `fetchFeeEstimateTransaction` first and falling back to `fetchFeeEstimateTransfer` if the node cannot provide an estimate (e.g. for a new contract call it has not seen before).

***

### Usage

```ts
import {
  makeUnsignedSTXTokenTransfer,
  fetchFeeEstimate,
} from '@stacks/transactions';

const transaction = await makeUnsignedSTXTokenTransfer({
  recipient: 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5',
  amount: 1000000n,
  publicKey: '034f355bdcb7cc0af728ef3cceb9615d90684bb5b2ca5f859ab0f0b704075871aa',
  network: 'testnet',
  fee: 0, // placeholder — we'll estimate
  nonce: 0n,
});

const estimatedFee = await fetchFeeEstimate({
  transaction,
  network: 'testnet',
});
transaction.setFee(estimatedFee);
```

#### Notes

- The builder functions call this automatically when `fee` is not provided.
- Returns the middle (median) estimation from the three-tier response.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/fetch.ts#L228)**

***

### Signature

```ts
function fetchFeeEstimate(opts: {
  transaction: StacksTransactionWire;
} & NetworkClientParam): Promise<bigint | number>;
```

***

### Returns

`Promise<bigint | number>`

A promise that resolves to the estimated fee in microSTX.

***

### Parameters

#### opts.transaction (required)

* **Type**: `StacksTransactionWire`

The transaction to estimate fees for.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query. Inferred from the transaction if not provided.

#### opts.client (optional)

* **Type**: `NetworkClient`

Custom client configuration for the API call.
