# stx\_transferSip10Ft

Requests the connected wallet to sign and broadcast a SIP-010 fungible token transfer transaction.

***

### Usage

```ts
import { request } from '@stacks/connect';

const result = await request('stx_transferSip10Ft', {
  recipient: 'SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02',
  asset: 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR.token-abc::token-abc',
  amount: 1000n,
  network: 'mainnet',
});

console.log('Transaction ID:', result.txid);
```

#### Notes

- The `asset` must be the fully qualified asset identifier in the format `contract-address.contract-name::asset-name`.
- The `amount` is in the smallest unit of the token (depends on the token's decimals).
- Post conditions are recommended to ensure the expected token transfer occurs.

**[Reference Link](https://github.com/stx-labs/connect/blob/main/packages/connect/src/methods.ts#L73)**

***

### Signature

```ts
function request(
  'stx_transferSip10Ft',
  params: TransferFungibleParams
): Promise<TransactionResult>
```

***

### Returns

`TransactionResult`

```ts
interface TransactionResult {
  txid?: string;
  transaction?: string;
}
```

| Property | Type | Description |
| --- | --- | --- |
| `txid` | `string` (optional) | The transaction ID of the broadcasted transaction. |
| `transaction` | `string` (optional) | The raw signed transaction hex. |

***

### Parameters

#### recipient (required)

* **Type**: `string`

The STX address of the recipient.

#### asset (required)

* **Type**: `string`

The fully qualified asset identifier (e.g. `'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR.token-abc::token-abc'`).

#### amount (required)

* **Type**: `Integer` (`number | bigint | string`)

The amount of tokens to transfer, in the smallest unit.

#### address (optional)

* **Type**: `AddressString`

The recommended sender address to use. Wallets may not implement this for privacy reasons.

#### network (optional)

* **Type**: `NetworkString`

The network to use for the transaction (e.g. `'mainnet'`, `'testnet'`, `'devnet'`).

#### fee (optional)

* **Type**: `Integer` (`number | bigint | string`)

A custom fee for the transaction (in microstacks).

#### nonce (optional)

* **Type**: `Integer` (`number | bigint | string`)

A custom nonce for the transaction.

#### sponsored (optional)

* **Type**: `boolean`

Whether the transaction should be sponsored.

#### postConditions (optional)

* **Type**: `(string | PostCondition)[]`

An array of post conditions to attach to the transaction.

#### postConditionMode (optional)

* **Type**: `PostConditionModeName`

The post condition mode: `'allow'` or `'deny'`.
