# signPsbt

Requests the connected wallet to sign a Partially Signed Bitcoin Transaction (PSBT).

***

### Usage

```ts
import { request } from '@stacks/connect';

const result = await request('signPsbt', {
  psbt: 'cHNidP8BAH0...base64-encoded-psbt',
  signInputs: [
    {
      index: 0,
      address: 'bc1q...address',
    },
  ],
  broadcast: true,
  network: 'mainnet',
});

console.log('Signed PSBT:', result.psbt);
console.log('Transaction ID:', result.txid);
```

```ts
import { request } from '@stacks/connect';

// Sign specific inputs by index only
const result = await request('signPsbt', {
  psbt: 'cHNidP8BAH0...base64-encoded-psbt',
  signInputs: [0, 2],
  broadcast: false,
});

console.log('Signed PSBT (base64):', result.psbt);
```

```ts
import { request } from '@stacks/connect';

// With sighash options
const result = await request('signPsbt', {
  psbt: 'cHNidP8BAH0...base64-encoded-psbt',
  signInputs: [
    {
      index: 0,
      address: 'bc1q...address',
      allowedSighash: ['ALL'],
    },
  ],
  allowedSighash: ['ALL', 'ANYONECANPAY'],
});
```

#### Notes

- The `psbt` must be a **base64-encoded** PSBT string.
- The `signInputs` parameter supports two formats: an array of input indices (`number[]`), or an array of `SignInputsByAddress` objects for more granular control.
- Provider overrides automatically transform the `signInputs` format and PSBT encoding to match each wallet's expected schema (e.g. Xverse uses a record-based format, Leather uses hex encoding).
- When `broadcast` is `true`, the wallet broadcasts the transaction after signing and returns the `txid`.

**[Reference Link](https://github.com/stx-labs/connect/blob/main/packages/connect/src/methods.ts#L196)**

***

### Signature

```ts
function request(
  'signPsbt',
  params: SignPsbtParams
): Promise<SignPsbtResult>
```

***

### Returns

`SignPsbtResult`

```ts
interface SignPsbtResult {
  txid?: string;
  psbt: string;
}
```

| Property | Type | Description |
| --- | --- | --- |
| `txid` | `string` (optional) | The transaction ID, if the PSBT was broadcasted. |
| `psbt` | `string` | The signed PSBT (base64-encoded). |

***

### Parameters

#### psbt (required)

* **Type**: `string`

The base64-encoded PSBT to be signed.

#### signInputs (optional)

* **Type**: `number[] | SignInputsByAddress[]`

Specifies which inputs to sign. Can be:

- An array of input indices (`number[]`): signs the inputs at those positions.
- An array of `SignInputsByAddress` objects for more control:

```ts
interface SignInputsByAddress {
  index: number;
  address: string;
  publicKey?: string;
  allowedSighash?: Sighash[];
}
```

| Property | Type | Description |
| --- | --- | --- |
| `index` | `number` | The input index to sign. |
| `address` | `string` | The address that owns this input. |
| `publicKey` | `string` (optional) | The public key for signing. |
| `allowedSighash` | `Sighash[]` (optional) | Allowed signature hash types for this input. |

#### broadcast (optional)

* **Type**: `boolean`

Whether the wallet should broadcast the transaction after signing.

#### network (optional)

* **Type**: `NetworkString`

The network to use (e.g. `'mainnet'`, `'testnet'`).

#### allowedSighash (optional, experimental)

* **Type**: `Sighash[]`

```ts
type Sighash = 'ALL' | 'NONE' | 'SINGLE' | 'ANYONECANPAY';
```

Global allowed signature hash types. This may be renamed in the future as wallets adopt SIPs/WBIPs.
