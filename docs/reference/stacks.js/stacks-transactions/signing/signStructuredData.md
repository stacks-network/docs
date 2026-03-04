# signStructuredData

Signs a structured message (ClarityValue) and a domain (ClarityValue) using a private key, following SIP-018.

***

### Usage

```ts
import { signStructuredData, Cl } from '@stacks/transactions';

const signature = signStructuredData({
  message: Cl.tuple({
    amount: Cl.uint(1000),
    recipient: Cl.standardPrincipal('ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5'),
  }),
  domain: Cl.tuple({
    name: Cl.stringAscii('my-app'),
    version: Cl.stringAscii('1.0.0'),
    'chain-id': Cl.uint(1),
  }),
  privateKey: 'b244296d5907de9864c0b0d51f98a13c52890be0404e83f273144004b81874603',
});
```

#### Notes

- Follows the SIP-018 structured data signing standard.
- The domain must be a tuple with at least `name` (StringASCII), `version` (StringASCII), and `chain-id` (UInt) keys.
- Returns a recoverable signature in RSV order.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/structuredDataSignature.ts#L91)**

***

### Signature

```ts
function signStructuredData(opts: {
  message: ClarityValue;
  domain: ClarityValue;
  privateKey: PrivateKey;
}): string;
```

***

### Returns

`string`

A recoverable signature in RSV order as a hex string.

***

### Parameters

#### opts.message (required)

* **Type**: `ClarityValue`

The structured data message to sign.

#### opts.domain (required)

* **Type**: `ClarityValue`

The domain tuple. Must contain `name` (StringASCII), `version` (StringASCII), and `chain-id` (UInt).

#### opts.privateKey (required)

* **Type**: `PrivateKey` (`string | Uint8Array`)

The private key to sign with.
