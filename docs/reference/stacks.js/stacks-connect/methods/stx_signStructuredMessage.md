# stx\_signStructuredMessage

Requests the connected wallet to sign a structured Clarity value message (SIP-018 compliant). This is used for domain-separated, typed data signing.

***

### Usage

```ts
import { request } from '@stacks/connect';
import { Cl } from '@stacks/transactions';

const result = await request('stx_signStructuredMessage', {
  message: Cl.stringAscii('Hello, Stacks!'),
  domain: Cl.tuple({
    name: Cl.stringAscii('My App'),
    version: Cl.stringAscii('1.0.0'),
    'chain-id': Cl.uint(1),
  }),
});

console.log('Signature:', result.signature);
console.log('Public Key:', result.publicKey);
```

#### Notes

- The `message` must be a `ClarityValue` object (constructed using `Cl` helpers from `@stacks/transactions`).
- The `domain` must be a `TupleCV` containing domain separation fields. This follows the SIP-018 standard for structured data signing.
- Clarity values are automatically serialized to hex strings before being sent to the wallet.
- For signing simple plaintext messages, use [`stx_signMessage`](stx_signMessage.md) instead.

**[Reference Link](https://github.com/stx-labs/connect/blob/main/packages/connect/src/methods.ts#L113)**

***

### Signature

```ts
function request(
  'stx_signStructuredMessage',
  params: SignStructuredMessageParams
): Promise<SignMessageResult>
```

***

### Returns

`SignMessageResult`

```ts
interface SignMessageResult {
  signature: string;
  publicKey: string;
}
```

| Property | Type | Description |
| --- | --- | --- |
| `signature` | `string` | The hex-encoded DER signature. |
| `publicKey` | `string` | The hex-encoded public key used for signing. |

***

### Parameters

#### message (required)

* **Type**: `ClarityValue`

The Clarity value to sign. Can be any valid Clarity type (e.g. `Cl.stringAscii(...)`, `Cl.uint(...)`, `Cl.tuple(...)`).

#### domain (required)

* **Type**: `TupleCV`

A Clarity tuple value containing domain separation fields. Standard fields include:

| Field | Type | Description |
| --- | --- | --- |
| `name` | `StringASCII` | The name of the application. |
| `version` | `StringASCII` | The version of the application. |
| `chain-id` | `UInt` | The chain ID (`1` for mainnet, `2147483648` for testnet). |
