**[@blockstack/clarity](../README.md)**

> [Globals](../globals.md) / "packages/clarity/src/core/result"

# Module: "packages/clarity/src/core/result"

## Index

### Interfaces

- [ResultInterface](../interfaces/_packages_clarity_src_core_result_.resultinterface.md)

### Type aliases

- [ExtractErr](_packages_clarity_src_core_result_.md#extracterr)
- [ExtractOk](_packages_clarity_src_core_result_.md#extractok)

### Functions

- [extractResult](_packages_clarity_src_core_result_.md#extractresult)
- [getWrappedResult](_packages_clarity_src_core_result_.md#getwrappedresult)
- [matchResult](_packages_clarity_src_core_result_.md#matchresult)
- [unwrapInt](_packages_clarity_src_core_result_.md#unwrapint)
- [unwrapResult](_packages_clarity_src_core_result_.md#unwrapresult)
- [unwrapString](_packages_clarity_src_core_result_.md#unwrapstring)
- [unwrapUInt](_packages_clarity_src_core_result_.md#unwrapuint)

### Object literals

- [Result](_packages_clarity_src_core_result_.md#result)

## Type aliases

### ExtractErr

Ƭ **ExtractErr**\<T>: T _extends_ ResultInterface\<unknown, _infer_ U> ? U : never

_Defined in [packages/clarity/src/core/result.ts:14](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/core/result.ts#L14)_

#### Type parameters:

| Name | Type                                                                                                      |
| ---- | --------------------------------------------------------------------------------------------------------- |
| `T`  | [ResultInterface](../interfaces/_packages_clarity_src_core_result_.resultinterface.md)\<unknown, unknown> |

---

### ExtractOk

Ƭ **ExtractOk**\<T>: T _extends_ ResultInterface\<_infer_ U, unknown> ? U : never

_Defined in [packages/clarity/src/core/result.ts:7](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/core/result.ts#L7)_

#### Type parameters:

| Name | Type                                                                                                      |
| ---- | --------------------------------------------------------------------------------------------------------- |
| `T`  | [ResultInterface](../interfaces/_packages_clarity_src_core_result_.resultinterface.md)\<unknown, unknown> |

## Functions

### extractResult

▸ **extractResult**\<T>(`input`: T): { result: [ExtractOk](_packages_clarity_src_core_result_.md#extractok)\<T> ; success: true } \| { error: [ExtractErr](_packages_clarity_src_core_result_.md#extracterr)\<T> ; success: false }

_Defined in [packages/clarity/src/core/result.ts:44](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/core/result.ts#L44)_

Type guard for objects that define `ResultInterface`.
If `success` is true then the `result` property is marked as defined,
otherwise, the `error` property is marked as defined.

#### Type parameters:

| Name | Type                                                                                                      |
| ---- | --------------------------------------------------------------------------------------------------------- |
| `T`  | [ResultInterface](../interfaces/_packages_clarity_src_core_result_.resultinterface.md)\<unknown, unknown> |

#### Parameters:

| Name    | Type |
| ------- | ---- |
| `input` | T    |

**Returns:** { result: [ExtractOk](_packages_clarity_src_core_result_.md#extractok)\<T> ; success: true } \| { error: [ExtractErr](_packages_clarity_src_core_result_.md#extracterr)\<T> ; success: false }

---

### getWrappedResult

▸ `Const`**getWrappedResult**(`input`: [ResultInterface](../interfaces/_packages_clarity_src_core_result_.resultinterface.md)\<string, unknown>, `r`: RegExp): string

_Defined in [packages/clarity/src/core/result.ts:80](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/core/result.ts#L80)_

#### Parameters:

| Name    | Type                                                                                                     |
| ------- | -------------------------------------------------------------------------------------------------------- |
| `input` | [ResultInterface](../interfaces/_packages_clarity_src_core_result_.resultinterface.md)\<string, unknown> |
| `r`     | RegExp                                                                                                   |

**Returns:** string

---

### matchResult

▸ **matchResult**\<TReturn, T>(`input`: T, `ok`: (val: [ExtractOk](_packages_clarity_src_core_result_.md#extractok)\<T>) => TReturn, `error`: (err: [ExtractErr](_packages_clarity_src_core_result_.md#extracterr)\<T>) => TReturn): TReturn

_Defined in [packages/clarity/src/core/result.ts:26](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/core/result.ts#L26)_

Type guard for objects that define `ResultInterface`.
If `success` is true then the `result` property is marked as defined,
otherwise, the `error` property is marked as defined.

#### Type parameters:

| Name      | Type                                                                                                      |
| --------- | --------------------------------------------------------------------------------------------------------- |
| `TReturn` | -                                                                                                         |
| `T`       | [ResultInterface](../interfaces/_packages_clarity_src_core_result_.resultinterface.md)\<unknown, unknown> |

#### Parameters:

| Name    | Type                                                                                 |
| ------- | ------------------------------------------------------------------------------------ |
| `input` | T                                                                                    |
| `ok`    | (val: [ExtractOk](_packages_clarity_src_core_result_.md#extractok)\<T>) => TReturn   |
| `error` | (err: [ExtractErr](_packages_clarity_src_core_result_.md#extracterr)\<T>) => TReturn |

**Returns:** TReturn

---

### unwrapInt

▸ **unwrapInt**(`input`: [ResultInterface](../interfaces/_packages_clarity_src_core_result_.resultinterface.md)\<string, unknown>): number

_Defined in [packages/clarity/src/core/result.ts:96](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/core/result.ts#L96)_

#### Parameters:

| Name    | Type                                                                                                     |
| ------- | -------------------------------------------------------------------------------------------------------- |
| `input` | [ResultInterface](../interfaces/_packages_clarity_src_core_result_.resultinterface.md)\<string, unknown> |

**Returns:** number

---

### unwrapResult

▸ **unwrapResult**\<T>(`input`: T): [ExtractOk](_packages_clarity_src_core_result_.md#extractok)\<T>

_Defined in [packages/clarity/src/core/result.ts:63](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/core/result.ts#L63)_

Unwraps an object that defines `ResultInterface`.
If `success` is true then the object's `result` value is returned.
Otherwise, an error is thrown with the given object's `error` value.
The type of the `error` value determines what gets thrown:

- If `error` is an instance of an `Error` object then it is directly thrown.
- If `error` is a string then an `Error` will be constructed with the string and thrown.
- If `error` is of neither type then the object is thrown directly (not generally recommended).

#### Type parameters:

| Name | Type                                                                                                      |
| ---- | --------------------------------------------------------------------------------------------------------- |
| `T`  | [ResultInterface](../interfaces/_packages_clarity_src_core_result_.resultinterface.md)\<unknown, unknown> |

#### Parameters:

| Name    | Type |
| ------- | ---- |
| `input` | T    |

**Returns:** [ExtractOk](_packages_clarity_src_core_result_.md#extractok)\<T>

---

### unwrapString

▸ **unwrapString**(`input`: [ResultInterface](../interfaces/_packages_clarity_src_core_result_.resultinterface.md)\<string, unknown>): string

_Defined in [packages/clarity/src/core/result.ts:101](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/core/result.ts#L101)_

#### Parameters:

| Name    | Type                                                                                                     |
| ------- | -------------------------------------------------------------------------------------------------------- |
| `input` | [ResultInterface](../interfaces/_packages_clarity_src_core_result_.resultinterface.md)\<string, unknown> |

**Returns:** string

---

### unwrapUInt

▸ **unwrapUInt**(`input`: [ResultInterface](../interfaces/_packages_clarity_src_core_result_.resultinterface.md)\<string, unknown>): number

_Defined in [packages/clarity/src/core/result.ts:91](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/core/result.ts#L91)_

#### Parameters:

| Name    | Type                                                                                                     |
| ------- | -------------------------------------------------------------------------------------------------------- |
| `input` | [ResultInterface](../interfaces/_packages_clarity_src_core_result_.resultinterface.md)\<string, unknown> |

**Returns:** number

## Object literals

### Result

▪ `Const` **Result**: object

_Defined in [packages/clarity/src/core/result.ts:106](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/core/result.ts#L106)_

#### Properties:

| Name           | Type                                                                 | Value                                                              |
| -------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `extract`      | [extractResult](_packages_clarity_src_core_result_.md#extractresult) | extractResult                                                      |
| `match`        | [matchResult](_packages_clarity_src_core_result_.md#matchresult)     | matchResult                                                        |
| `unwrap`       | [unwrapResult](_packages_clarity_src_core_result_.md#unwrapresult)   | unwrapResult                                                       |
| `unwrapInt`    | [unwrapInt](_packages_clarity_src_core_result_.md#unwrapint)         | [unwrapInt](_packages_clarity_src_core_result_.md#unwrapint)       |
| `unwrapString` | [unwrapString](_packages_clarity_src_core_result_.md#unwrapstring)   | [unwrapString](_packages_clarity_src_core_result_.md#unwrapstring) |
| `unwrapUInt`   | [unwrapUInt](_packages_clarity_src_core_result_.md#unwrapuint)       | [unwrapUInt](_packages_clarity_src_core_result_.md#unwrapuint)     |
