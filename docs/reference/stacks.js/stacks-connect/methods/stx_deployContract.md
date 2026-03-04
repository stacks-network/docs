# stx\_deployContract

Requests the connected wallet to sign and broadcast a Clarity smart contract deployment transaction.

***

### Usage

```ts
import { request } from '@stacks/connect';

const result = await request('stx_deployContract', {
  name: 'my-contract',
  clarityCode: `
    (define-public (say-hello)
      (ok "hello world"))
  `,
  clarityVersion: 3,
  network: 'mainnet',
});

console.log('Transaction ID:', result.txid);
```

#### Notes

- The `name` is the contract name that will be used in the contract identifier (e.g. if your address is `SP2...` and name is `my-contract`, the full identifier becomes `SP2....my-contract`).
- If `clarityVersion` is not specified, wallets typically default to the latest supported Clarity version.

**[Reference Link](https://github.com/stx-labs/connect/blob/main/packages/connect/src/methods.ts#L90)**

***

### Signature

```ts
function request(
  'stx_deployContract',
  params: DeployContractParams
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

#### name (required)

* **Type**: `string`

The name for the deployed contract. This will be part of the contract's fully qualified identifier.

#### clarityCode (required)

* **Type**: `string`

The Clarity source code of the contract to deploy.

#### clarityVersion (optional)

* **Type**: `number | string`

The Clarity language version to use. Current live versions are `1`, `2`, and `3`. Wallets may not support this parameter yet and typically default to the latest version.

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
