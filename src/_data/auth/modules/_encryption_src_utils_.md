**[@stacks/auth](../README.md)**

> [Globals](../globals.md) / "encryption/src/utils"

# Module: "encryption/src/utils"

## Index

### Functions

- [getBase64OutputLength](_encryption_src_utils_.md#getbase64outputlength)

## Functions

### getBase64OutputLength

▸ **getBase64OutputLength**(`inputByteLength`: number): number

_Defined in [packages/encryption/src/utils.ts:18](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/utils.ts#L18)_

Calculate the base64 encoded string length for a given input length.
This is equivalent to the byte length when the string is ASCII or UTF8-8
encoded.

#### Parameters:

| Name              | Type   |
| ----------------- | ------ |
| `inputByteLength` | number |

**Returns:** number
