**[@stacks/auth](../README.md)**

> [Globals](../globals.md) / "common/src/utils"

# Module: "common/src/utils"

## Index

### Interfaces

- [GetGlobalObjectOptions](../interfaces/_common_src_utils_.getglobalobjectoptions.md)

### Functions

- [getAPIUsageErrorMessage](_common_src_utils_.md#getapiusageerrormessage)
- [getBase64OutputLength](_common_src_utils_.md#getbase64outputlength)

## Functions

### getAPIUsageErrorMessage

▸ **getAPIUsageErrorMessage**(`scopeObject`: unknown, `apiName`: string, `usageDesc?`: undefined \| string): string

_Defined in [packages/common/src/utils.ts:216](https://github.com/blockstack/blockstack.js/blob/26419086/packages/common/src/utils.ts#L216)_

#### Parameters:

| Name          | Type                |
| ------------- | ------------------- |
| `scopeObject` | unknown             |
| `apiName`     | string              |
| `usageDesc?`  | undefined \| string |

**Returns:** string

---

### getBase64OutputLength

▸ **getBase64OutputLength**(`inputByteLength`: number): number

_Defined in [packages/common/src/utils.ts:63](https://github.com/blockstack/blockstack.js/blob/26419086/packages/common/src/utils.ts#L63)_

Calculate the base64 encoded string length for a given input length.
This is equivalent to the byte length when the string is ASCII or UTF8-8
encoded.

#### Parameters:

| Name              | Type   |
| ----------------- | ------ |
| `inputByteLength` | number |

**Returns:** number
