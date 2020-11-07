**[@blockstack/clarity](../README.md)**

> [Globals](../globals.md) / ["packages/clarity/src/providers/clarityBin/index"](../modules/_packages_clarity_src_providers_claritybin_index_.md) / ExecutionError

# Class: ExecutionError

## Hierarchy

- [Error](_packages_clarity_src_providers_claritybin_index_.executionerror.md#error)

  ↳ **ExecutionError**

## Index

### Constructors

- [constructor](_packages_clarity_src_providers_claritybin_index_.executionerror.md#constructor)

### Properties

- [code](_packages_clarity_src_providers_claritybin_index_.executionerror.md#code)
- [commandOutput](_packages_clarity_src_providers_claritybin_index_.executionerror.md#commandoutput)
- [errorOutput](_packages_clarity_src_providers_claritybin_index_.executionerror.md#erroroutput)
- [message](_packages_clarity_src_providers_claritybin_index_.executionerror.md#message)
- [name](_packages_clarity_src_providers_claritybin_index_.executionerror.md#name)
- [stack](_packages_clarity_src_providers_claritybin_index_.executionerror.md#stack)
- [Error](_packages_clarity_src_providers_claritybin_index_.executionerror.md#error)

## Constructors

### constructor

\+ **new ExecutionError**(`message`: string, `code`: number, `commandOutput`: string, `errorOutput`: string): [ExecutionError](_packages_clarity_src_providers_claritybin_index_.executionerror.md)

_Defined in [packages/clarity/src/providers/clarityBin/index.ts:12](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/providers/clarityBin/index.ts#L12)_

#### Parameters:

| Name            | Type   |
| --------------- | ------ |
| `message`       | string |
| `code`          | number |
| `commandOutput` | string |
| `errorOutput`   | string |

**Returns:** [ExecutionError](_packages_clarity_src_providers_claritybin_index_.executionerror.md)

## Properties

### code

• `Readonly` **code**: number

_Defined in [packages/clarity/src/providers/clarityBin/index.ts:10](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/providers/clarityBin/index.ts#L10)_

---

### commandOutput

• `Readonly` **commandOutput**: string

_Defined in [packages/clarity/src/providers/clarityBin/index.ts:11](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/providers/clarityBin/index.ts#L11)_

---

### errorOutput

• `Readonly` **errorOutput**: string

_Defined in [packages/clarity/src/providers/clarityBin/index.ts:12](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/providers/clarityBin/index.ts#L12)_

---

### message

• **message**: string

_Inherited from [ExecutionError](\_packages_clarity_src_providers_claritybin_index_.executionerror.md).[message](_packages_clarity_src_providers_claritybin_index_.executionerror.md#message)\_

_Defined in packages/clarity/node_modules/typescript/lib/lib.es5.d.ts:974_

---

### name

• **name**: string

_Inherited from [ExecutionError](\_packages_clarity_src_providers_claritybin_index_.executionerror.md).[name](_packages_clarity_src_providers_claritybin_index_.executionerror.md#name)\_

_Defined in packages/clarity/node_modules/typescript/lib/lib.es5.d.ts:973_

---

### stack

• `Optional` **stack**: undefined \| string

_Inherited from [ExecutionError](\_packages_clarity_src_providers_claritybin_index_.executionerror.md).[stack](_packages_clarity_src_providers_claritybin_index_.executionerror.md#stack)\_

_Overrides [ExecutionError](\_packages_clarity_src_providers_claritybin_index_.executionerror.md).[stack](_packages_clarity_src_providers_claritybin_index_.executionerror.md#stack)\_

_Defined in packages/clarity/node_modules/typescript/lib/lib.es5.d.ts:975_

---

### Error

▪ `Static` **Error**: ErrorConstructor

_Defined in packages/clarity/node_modules/typescript/lib/lib.es5.d.ts:984_
