# sendTransfer

Requests the connected wallet to sign and broadcast a Bitcoin transfer transaction.

***

### Usage

```ts
import { request } from '@stacks/connect';

const result = await request('sendTransfer', {
  recipients: [
    {
      address: 'bc1q...address',
      amount: 100_000n, // amount in sats
    },
  ],
  network: 'mainnet',
});

console.log('Transaction ID:', result.txid);
```

```ts
import { request } from '@stacks/connect';

// Multiple recipients
const result = await request('sendTransfer', {
  recipients: [
    {
      address: 'bc1q...address1',
      amount: 50_000n,
    },
    {
      address: 'bc1q...address2',
      amount: 25_000n,
    },
  ],
});
```

#### Notes

- The `amount` is in **satoshis** (1 BTC = 100,000,000 sats).
- Multiple recipients can be specified in a single transaction.
- The `amount` type is automatically normalized by provider overrides: Xverse expects `number`, Leather expects `string`.

**[Reference Link](https://github.com/stx-labs/connect/blob/main/packages/connect/src/methods.ts#L133)**

***

### Signature

```ts
function request(
  'sendTransfer',
  params: SendTransferParams
): Promise<TxidResult>
```

***

### Returns

`TxidResult`

```ts
interface TxidResult {
  txid: string;
}
```

| Property | Type | Description |
| --- | --- | --- |
| `txid` | `string` | The transaction ID of the broadcasted Bitcoin transaction. |

***

### Parameters

#### recipients (required)

* **Type**: `{ address: string; amount: Integer }[]`

An array of recipient objects. Each recipient specifies:

| Property | Type | Description |
| --- | --- | --- |
| `address` | `string` | The Bitcoin address of the recipient. |
| `amount` | `Integer` | The amount in satoshis (`number`, `bigint`, or `string`). |

#### network (optional)

* **Type**: `NetworkString`

The network to use for the transaction (e.g. `'mainnet'`, `'testnet'`).
