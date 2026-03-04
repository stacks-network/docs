# stx\_callContract

Requests the connected wallet to sign and broadcast a Clarity smart contract function call.

***

### Usage

```ts
import { request } from '@stacks/connect';
import { Cl } from '@stacks/transactions';

const result = await request('stx_callContract', {
  contract: 'SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02.my-contract',
  functionName: 'transfer',
  functionArgs: [
    Cl.uint(100),
    Cl.standardPrincipal('SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02'),
    Cl.standardPrincipal('SP1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE'),
  ],
  network: 'mainnet',
});

console.log('Transaction ID:', result.txid);
```

```ts
import { request } from '@stacks/connect';

// Using hex-encoded function args
const result = await request('stx_callContract', {
  contract: 'SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02.my-contract',
  functionName: 'get-balance',
  functionArgs: [],
  postConditionMode: 'allow',
});
```

#### Notes

- The `functionArgs` array can contain either `ClarityValue` objects (from `@stacks/transactions`) or hex-encoded strings. Clarity values are automatically serialized before being sent to the wallet.
- Post conditions can be provided as JSON objects or hex-encoded strings.

**[Reference Link](https://github.com/stx-labs/connect/blob/main/packages/connect/src/methods.ts#L83)**

***

### Signature

```ts
function request(
  'stx_callContract',
  params: CallContractParams
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

#### contract (required)

* **Type**: `ContractIdString`

The fully qualified contract identifier in the format `address.contract-name` (e.g. `'SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02.my-contract'`).

#### functionName (required)

* **Type**: `string`

The name of the public or read-only function to call.

#### functionArgs (optional)

* **Type**: `string[] | ClarityValue[]`

An array of function arguments. These can be `ClarityValue` objects (constructed using `Cl` helpers from `@stacks/transactions`) or hex-encoded Clarity value strings.

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

An array of post conditions to attach to the transaction. Each entry can be a hex-encoded string or a JSON `PostCondition` object.

#### postConditionMode (optional)

* **Type**: `PostConditionModeName`

The post condition mode: `'allow'` or `'deny'`. Defaults to `'deny'` in most wallets.
