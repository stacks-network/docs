# fetchFeeEstimateTransaction

Estimates the total transaction fee in microSTX for a Stacks transaction. Queries the node's `/v2/fees/transaction` endpoint with the serialized payload.

***

### Usage

```ts
import { fetchFeeEstimateTransaction, bytesToHex, serializePayloadBytes } from '@stacks/transactions';

const [low, medium, high] = await fetchFeeEstimateTransaction({
  payload: '0x00...', // hex-encoded serialized transaction payload
  estimatedLength: 350, // optional estimated byte length
  network: 'testnet',
});

console.log(medium.fee); // e.g. 3000
```

#### Notes

- Returns three fee estimations (low, medium, high).
- Throws `NoEstimateAvailableError` if the node has not seen this type of contract call before.
- Use `fetchFeeEstimate` for automatic fallback behavior.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/fetch.ts#L176)**

***

### Signature

```ts
function fetchFeeEstimateTransaction(opts: {
  payload: string;
  estimatedLength?: number;
} & NetworkClientParam): Promise<[FeeEstimation, FeeEstimation, FeeEstimation]>;
```

***

### Returns

`Promise<[FeeEstimation, FeeEstimation, FeeEstimation]>`

```ts
interface FeeEstimation {
  fee: number;
  fee_rate: number;
}
```

A tuple of three fee estimations: `[low, medium, high]`.

***

### Parameters

#### opts.payload (required)

* **Type**: `string`

The hex-encoded serialized transaction payload.

#### opts.estimatedLength (optional)

* **Type**: `number`

Optional estimated final length (in bytes) of the transaction, including post-conditions and signatures.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `NetworkClient`

Custom client configuration for the API call.
