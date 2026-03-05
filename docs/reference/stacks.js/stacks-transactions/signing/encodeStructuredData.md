# encodeStructuredData

Encodes a structured data message and domain into a SIP-018 encoded hex string. This is the data that gets hashed and signed by `signStructuredData`.

***

### Usage

```ts
import { encodeStructuredData, Cl } from '@stacks/transactions';

const encoded = encodeStructuredData({
  message: Cl.tuple({
    amount: Cl.uint(1000),
  }),
  domain: Cl.tuple({
    name: Cl.stringAscii('my-app'),
    version: Cl.stringAscii('1.0.0'),
    'chain-id': Cl.uint(1),
  }),
});
// hex string: SIP018 prefix + domain hash + message hash
```

#### Notes

- The result is prefixed with the SIP-018 prefix bytes (`SIP018` in ASCII).
- The domain must be a valid tuple with `name`, `version`, and `chain-id` keys.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/structuredDataSignature.ts#L32)**

***

### Signature

```ts
function encodeStructuredData(opts: {
  message: ClarityValue;
  domain: ClarityValue;
}): string;
```

***

### Returns

`string`

A hex-encoded string containing the SIP-018 prefix, domain hash, and message hash.

***

### Parameters

#### opts.message (required)

* **Type**: `ClarityValue`

The structured data message.

#### opts.domain (required)

* **Type**: `ClarityValue`

The domain tuple with `name`, `version`, and `chain-id` keys.
