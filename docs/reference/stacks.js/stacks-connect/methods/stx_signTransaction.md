# stx\_signTransaction

Requests the connected wallet to sign a pre-built Stacks transaction. Optionally broadcasts the transaction after signing.

***

### Usage

```ts
import { request } from '@stacks/connect';

const result = await request('stx_signTransaction', {
  transaction: '0x0000...raw-transaction-hex',
  broadcast: true,
});

console.log('Transaction ID:', result.txid);
console.log('Signed transaction:', result.transaction);
```

```ts
import { request } from '@stacks/connect';

// Sign without broadcasting (e.g. for sponsored transactions)
const result = await request('stx_signTransaction', {
  transaction: '0x0000...raw-transaction-hex',
  broadcast: false,
});

// The signed raw transaction is returned for manual broadcasting
console.log('Signed transaction hex:', result.transaction);
```

#### Notes

- The `transaction` parameter should be a hex-encoded serialized Stacks transaction.
- This method is useful when you need to construct the transaction yourself (e.g. using `@stacks/transactions`) and only need the wallet for signing.
- When `broadcast` is `false`, the signed transaction hex is returned without broadcasting. This is useful for sponsored transaction workflows.

**[Reference Link](https://github.com/stx-labs/connect/blob/main/packages/connect/src/methods.ts#L97)**

***

### Signature

```ts
function request(
  'stx_signTransaction',
  params: SignTransactionParams
): Promise<SignTransactionResult>
```

***

### Returns

`SignTransactionResult`

```ts
interface SignTransactionResult {
  txid?: string;
  transaction: string;
}
```

| Property | Type | Description |
| --- | --- | --- |
| `txid` | `string` (optional) | The transaction ID, if the transaction was broadcasted. |
| `transaction` | `string` | The signed raw transaction hex. |

***

### Parameters

#### transaction (required)

* **Type**: `string`

The hex-encoded serialized Stacks transaction to be signed by the wallet.

#### broadcast (optional)

* **Type**: `boolean`

Whether the wallet should broadcast the transaction after signing.
