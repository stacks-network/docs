# stx\_transferSip9Nft

Requests the connected wallet to sign and broadcast a SIP-009 non-fungible token (NFT) transfer transaction.

***

### Usage

```ts
import { request } from '@stacks/connect';
import { Cl } from '@stacks/transactions';

const result = await request('stx_transferSip9Nft', {
  recipient: 'SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02',
  asset: 'SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02.nft-collection::nft-collection',
  assetId: Cl.uint(42),
  network: 'mainnet',
});

console.log('Transaction ID:', result.txid);
```

#### Notes

- The `asset` must be the fully qualified asset identifier in the format `contract-address.contract-name::asset-name`.
- The `assetId` can be a `ClarityValue` object or a hex-encoded string. Clarity values are automatically serialized.
- Post conditions are recommended to ensure the expected NFT transfer occurs.

**[Reference Link](https://github.com/stx-labs/connect/blob/main/packages/connect/src/methods.ts#L79)**

***

### Signature

```ts
function request(
  'stx_transferSip9Nft',
  params: TransferNonFungibleParams
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

The fully qualified asset identifier (e.g. `'SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02.nft-collection::nft-collection'`).

#### assetId (required)

* **Type**: `string | ClarityValue`

The unique identifier of the NFT to transfer. Can be a `ClarityValue` object (e.g. `Cl.uint(42)`) or a hex-encoded Clarity value string.

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
