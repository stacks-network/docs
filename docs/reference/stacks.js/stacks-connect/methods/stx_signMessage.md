# stx\_signMessage

Requests the connected wallet to sign a plaintext message with the user's Stacks private key.

***

### Usage

```ts
import { request } from '@stacks/connect';

const result = await request('stx_signMessage', {
  message: 'Hello, Stacks!',
});

console.log('Signature:', result.signature);
console.log('Public Key:', result.publicKey);
```

#### Notes

- The wallet displays the message to the user for review before signing.
- The resulting signature can be verified using the returned `publicKey`.
- For signing structured data (SIP-018 compliant), use [`stx_signStructuredMessage`](stx_signStructuredMessage.md) instead.

**[Reference Link](https://github.com/stx-labs/connect/blob/main/packages/connect/src/methods.ts#L102)**

***

### Signature

```ts
function request(
  'stx_signMessage',
  params: SignMessageParams
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

* **Type**: `string`

The plaintext message string to sign.

#### publicKey (optional, experimental)

* **Type**: `string`

A non-standard parameter to specify which public key to use for signing. Its usage is not recommended as it may not be supported by all wallets. This parameter may be removed in future versions.
