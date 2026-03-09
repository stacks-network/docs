# isClarityType

Type guard function for narrowing a generic `ClarityValue` to a specific Clarity type. Useful for runtime type checking of Clarity values returned from contract calls.

***

### Usage

```ts
import { isClarityType, ClarityType, Cl } from '@stacks/transactions';

const value: ClarityValue = Cl.uint(100);

if (isClarityType(value, ClarityType.UInt)) {
  // TypeScript now knows `value` is UIntCV
  console.log(value.value); // 100n
}

if (isClarityType(value, ClarityType.ResponseOk)) {
  // TypeScript now knows `value` is ResponseOkCV
  console.log(value.value); // inner ClarityValue
}
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/clarity/clarityValue.ts#L195)**

***

### Signature

```ts
function isClarityType<T extends ClarityType>(
  val: ClarityValue,
  type: T
): val is ClarityTypetoValue[T];
```

***

### Returns

`boolean`

`true` if the value's type matches the provided `ClarityType`, with TypeScript type narrowing.

***

### Parameters

#### val (required)

* **Type**: `ClarityValue`

The Clarity value to check.

#### type (required)

* **Type**: `ClarityType`

The Clarity type to compare against.
