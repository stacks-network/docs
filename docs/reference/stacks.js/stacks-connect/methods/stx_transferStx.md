# stx\_transferStx

Requests the connected wallet to sign and broadcast an STX token transfer transaction.

***

### Usage

```ts
import { request } from '@stacks/connect';

const result = await request('stx_transferStx', {
  recipient: 'SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02',
  amount: 1000000n, // 1 STX = 1,000,000 microstacks
  memo: 'Payment for services',
  network: 'mainnet',
});

console.log('Transaction ID:', result.txid);
```

#### Notes

- The `amount` is denominated in **microstacks** (1 STX = 1,000,000 microstacks).
- The `amount` accepts `number`, `bigint`, or `string` types. It is automatically serialized before being sent to the wallet.
- Unlike other STX transaction methods, `stx_transferStx` does **not** support `postConditions` or `postConditionMode`.

**[Reference Link](https://github.com/stx-labs/connect/blob/main/packages/connect/src/methods.ts#L66)**

***

### Signature

```ts
function request(
  'stx_transferStx',
  params: TransferStxParams
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

#### amount (required)

* **Type**: `Integer` (`number | bigint | string`)

The amount of microstacks to transfer. 1 STX = 1,000,000 microstacks.

#### memo (optional)

* **Type**: `string`

An optional memo string to include with the transaction (max 34 bytes).

#### address (optional)

* **Type**: `AddressString`

The recommended sender address to use. Wallets may not implement this for privacy reasons.

#### network (optional)

* **Type**: `NetworkString`

The network to use for the transaction (e.g. `'mainnet'`, `'testnet'`, `'devnet'`).

#### fee (optional)

* **Type**: `Integer` (`number | bigint | string`)

A custom fee to use for the transaction (in microstacks).

#### nonce (optional)

* **Type**: `Integer` (`number | bigint | string`)

A custom nonce for the transaction.

#### sponsored (optional)

* **Type**: `boolean`

Whether the transaction should be sponsored. If `true`, the transaction will not be broadcasted by the wallet but instead returned for sponsoring.
