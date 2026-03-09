# ClarityType

Enum representing all Clarity value type identifiers. Used for runtime type checking and serialization.

***

### Usage

```ts
import { ClarityType, isClarityType } from '@stacks/transactions';

// Type guard
if (isClarityType(value, ClarityType.UInt)) {
  console.log(value.value); // bigint
}

// Direct comparison
if (value.type === ClarityType.BoolTrue) {
  console.log('It is true');
}
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/clarity/constants.ts)**

***

### Definition

```ts
enum ClarityType {
  Int = 'int',
  UInt = 'uint',
  Buffer = 'buffer',
  BoolTrue = 'true',
  BoolFalse = 'false',
  PrincipalStandard = 'principal-standard',
  PrincipalContract = 'principal-contract',
  ResponseOk = 'ok',
  ResponseErr = 'err',
  OptionalNone = 'none',
  OptionalSome = 'some',
  List = 'list',
  Tuple = 'tuple',
  StringASCII = 'string-ascii',
  StringUTF8 = 'string-utf8',
}
```

***

### Values

| Value | String | Description |
| --- | --- | --- |
| `Int` | `'int'` | Signed 128-bit integer |
| `UInt` | `'uint'` | Unsigned 128-bit integer |
| `Buffer` | `'buffer'` | Byte buffer |
| `BoolTrue` | `'true'` | Boolean true |
| `BoolFalse` | `'false'` | Boolean false |
| `PrincipalStandard` | `'principal-standard'` | Standard principal (address) |
| `PrincipalContract` | `'principal-contract'` | Contract principal (address.contract-name) |
| `ResponseOk` | `'ok'` | OK response |
| `ResponseErr` | `'err'` | Error response |
| `OptionalNone` | `'none'` | Optional none |
| `OptionalSome` | `'some'` | Optional some (wraps a value) |
| `List` | `'list'` | List of values |
| `Tuple` | `'tuple'` | Tuple (key-value map) |
| `StringASCII` | `'string-ascii'` | ASCII string |
| `StringUTF8` | `'string-utf8'` | UTF-8 string |
