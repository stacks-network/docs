# ClarityValue

Union type representing any Clarity value. This is the base type used throughout `@stacks/transactions` for Clarity data.

***

### Usage

```ts
import { ClarityValue, Cl, ClarityType } from '@stacks/transactions';

// Create Clarity values with Cl helpers
const value: ClarityValue = Cl.uint(100);
const tupleValue: ClarityValue = Cl.tuple({ amount: Cl.uint(100), sender: Cl.principal('ST...') });

// Type narrow with ClarityType
if (value.type === ClarityType.UInt) {
  console.log(value.value); // bigint
}
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/clarity/clarityValue.ts)**

***

### Definition

```ts
type ClarityValue =
  | BooleanCV
  | IntCV
  | UIntCV
  | BufferCV
  | OptionalCV
  | ResponseCV
  | StandardPrincipalCV
  | ContractPrincipalCV
  | ListCV
  | TupleCV
  | StringAsciiCV
  | StringUtf8CV;
```

***

### Notes

- Every `ClarityValue` has a `.type` field set to a `ClarityType` enum value.
- Use `Cl.*` helper functions to create Clarity values rather than constructing raw objects.
- Use `cvToJSON`, `cvToValue`, `cvToString`, or `cvToHex` to convert Clarity values into other formats.
- Use `hexToCV` to deserialize a hex string back into a `ClarityValue`.

***

### Sub-types

| Type | ClarityType | Payload |
| --- | --- | --- |
| `BooleanCV` | `BoolTrue` / `BoolFalse` | (none) |
| `IntCV` | `Int` | `value: bigint` |
| `UIntCV` | `UInt` | `value: bigint` |
| `BufferCV` | `Buffer` | `value: Uint8Array` |
| `OptionalCV` | `OptionalSome` / `OptionalNone` | `value?: ClarityValue` |
| `ResponseCV` | `ResponseOk` / `ResponseErr` | `value: ClarityValue` |
| `StandardPrincipalCV` | `PrincipalStandard` | `value: string` |
| `ContractPrincipalCV` | `PrincipalContract` | `value: string` |
| `ListCV` | `List` | `value: ClarityValue[]` |
| `TupleCV` | `Tuple` | `value: Record<string, ClarityValue>` |
| `StringAsciiCV` | `StringASCII` | `value: string` |
| `StringUtf8CV` | `StringUTF8` | `value: string` |
