---
title: Clarity Values
description: Learn how to deal with Clarity Values in JavaScript
images:
  large: /images/pages/write-smart-contracts.svg
  sm: /images/pages/write-smart-contracts-sm.svg
---

## Introduction

The Clarity language makes use of a strong static [type system](/references/language-clarity#clarity-type-system). This simply means that every function defined in Clarity expects arguments of specific types, and that a failure to provide properly typed arguments will result in your code failing to compile, or your contract call transactions failing prior to execution.

In order to build web applications that interact with Clarity contracts, you will need to learn how to construct and use `ClarityValue` objects. The [@stacks/transactions](https://github.com/blockstack/stacks.js/tree/master/packages/transactions) library makes this easy, as we will demonstrate below.

## Clarity Types

Please see the following page for information on Clarity Types:

[@page-reference | inline]
| /references/language-types

## Constructing Clarity Values and accessing their data

Clarity values can be constructed with functions provided by the [@stacks/transactions](https://github.com/blockstack/stacks.js/tree/master/packages/transactions) library. These functions simply output javascript objects that contain a value and a numerical representation of the Clarity type information. The Clarity types are encoded as follows:

```typescript
export enum ClarityType {
  Int = 0,
  UInt = 1,
  Buffer = 2,
  BoolTrue = 3,
  BoolFalse = 4,
  PrincipalStandard = 5,
  PrincipalContract = 6,
  ResponseOk = 7,
  ResponseErr = 8,
  OptionalNone = 9,
  OptionalSome = 10,
  List = 11,
  Tuple = 12,
  StringASCII = 13,
  StringUTF8 = 14,
}
```

`ClarityValue` objects can be serialized and included in transactions that interact with published Clarity contracts.

Here are examples of how to construct each type of Clarity value, and how to access its data if it has any:

### Booleans

```typescript
const t = trueCV();
// { type: ClarityType.BoolTrue }

const f = falseCV();
// { type: ClarityType.BoolFalse }
```

Boolean Clarity Values don't contain any underlying data. They are simply objects with `type` information.

### Optional Values

```typescript
const nothing: NoneCV = noneCV();
// { type: ClarityType.OptionalNone }

const something: SomeCV = someCV(trueCV());
// { type: ClarityType.OptionalSome, value: { type: 4 } }
```

Optional Clarity Values can either be nothing (an empty type that has no data), or something (a wrapped value).

If you are dealing with a function or contract function that returns an `OptionalCV`, you should always check what type it is before trying to access its value.

```typescript
const maybeVal: OptionalCV = await callReadOnlyFunction(...);

if (maybeVal.type === ClarityType.OptionalSome) {
  console.log(maybeVal.value);
} else if (maybeVal.type === ClarityType.OptionalNone) {
  // deal with `none` value
}
```

### Buffers

```typescript
const buffer = Buffer.from('foo');
const bufCV: BufferCV = bufferCV(buffer);
// { type: ClarityType.Buffer, buffer: <Buffer 66 6f 6f> }
```

### Integers

Clarity supports both integers and unsigned integers.

```typescript
const i: IntCV = intCV(-10);
// { type: ClarityType.Int, value: BN { ... } }

const u: UIntCV = uintCV(10);
// { type: ClarityType.UInt, value: BN { ... } }
```

Clarity value ints store their underlying data as `BigNum` values from the [bn.js](https://github.com/indutny/bn.js/) library.

In order to display/print Clarity (u)int values, use the `cvToString(val)` method.

If you wish to perform arithmetic operations using Clarity (u)int values, you must use methods from the `BigNum` api on their underlying `BigNum` values, and the construct a new Clarity value out of the result. For example:

```typescript
const x = intCV(1);
const y = intCV(2);

x.value.add(y.value);
// 3
```

### Strings

```typescript
const ascii: StringAsciiCV = stringAsciiCV('hello world');
// { type: ClarityType.StringASCII, data: 'hello world' }

const utf8: StringUtf8CV = stringUtf8CV('hello 🌾');
// { type: ClarityType.StringUTF8, data: 'hello 🌾' }
```

Clarity supports both ascii and utf8 strings.

### Principals

```typescript
const address = 'SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B';
const contractName = 'contract-name';

const spCV = standardPrincipalCV(address);
// {
//   type: ClarityType.PrincipalStandard
//   address: {
//       type: StacksMessageType.Address,
//       version: AddressVersion.MainnetSingleSig,
//       hash160: "SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B"
//   }
// }

const cpCV = contractPrincipalCV(address, contractName);
// {
//   type: ClarityType.PrincipalContract,
//   contractName: {
//     type: StacksMessageType.LengthPrefixedString,
//     content: 'contract-name',
//     lengthPrefixBytes: 1,
//     maxLengthBytes: 128,
//   },
//   address: {
//     type: StacksMessageType.Address,
//     version: AddressVersion.MainnetSingleSig,
//     hash160: "SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B"
//   }
// }
```

Both kinds of Clarity principal values contain `type` information and an `address` object. Contract principals also contain a `contractName`.

### Response Values

```typescript
const errCV = responseErrorCV(trueCV());
// { type: ResponseErr, value: { type: ClarityType.BoolTrue } }

const okCV = responseOkCV(falseCV());
// { type: ResponseOk, value: { type: ClarityType.BoolFalse } }
```

Response Clarity Values will either have the type `ClarityType.ResponseOk` or `ClarityType.ResponseErr`. They both contain a Clarity Value. Often this value will be an integer error code if the response is an `Error`.

### Tuples

```typescript
const tupCV = tupleCV({
  a: intCV(1),
  b: trueCV(),
  c: falseCV(),
});
// {
//   type: ClarityType.Tuple,
//   data: {
//     a: { type: ClarityType.Int, value: BN { ... } },
//     b: { type: ClarityType.BoolTrue },
//     c: { type: ClarityType.BoolFalse },
//   }
// }

console.log(tupCV.data['b']);
// { type: ClarityType.BoolTrue }
```

Tuples in Clarity are typed and contain named fields. The tuple above, for example, contains three fields with the names **a**, **b** and **c**, and the types of their values are `Int`, `Boolean` and `Boolean`, respectively.

Clarity tuples are represented in JavaScript as objects and a tuple's data can be accessed by its `data` field, where the underlying JS object is stored.

### Lists

```typescript
const l = listCV([trueCV(), falseCV()]);
// { type: ClarityType.List, list: [{ type: ClarityType.BoolTrue }] }

console.log(l.list[0]);
// { type: ClarityType.BoolTrue }
```

Lists, in Clarity, are homogeneous, meaning they can only contain elements of a singular (Clarity) type. Make sure to avoid constructing lists that have elements of multiple types.

A Clarity lists underlying data can be accessed via its `list` field.

## Using Clarity Values

Now that you know how to construct _and_ deconstruct Clarity values, you can use them to build `contract-call` transactions that call smart contract functions, and you can utilize their responses.

This is covered in depth [here](/understand-stacks/transactions#construction).

## Utilizing Clarity Values from Transaction Responses

`Read-only` Clarity functions can return Clarity values as a response. These `read-only` functions can be accessed easily in JavaScript via the [`callReadOnlyFunction()`](https://github.com/blockstack/stacks.js/tree/master/packages/transactions#calling-read-only-contract-function) function included in `@stacks/transactions`, which returns a `ClarityValue`.

As mentioned above, `ClarityValues` are simply javascript objects containing a value and its associated Clarity type information. These object types are defined [here](https://github.com/blockstack/stacks.js/tree/1f2b5fd8bdf1c2b5866e8171163594d7708a8c7a/packages/transactions/src/clarity/types).

When you are calling a `read-only` contract function, you will always know what type the function will return, since functions in Clarity are strongly typed.

It is common for Clarity functions to return values wrapped in a `Response`, in order to indicate if there was success or an error.

Since every `ClarityValue` has a `type` field, the type of the result of a `read-only` function call can be checked and acted upon like so:

```typescript
const contractAddress = 'ST3KC0MTNW34S1ZXD36JYKFD3JJMWA01M55DSJ4JE';
const contractName = 'kv-store';
const functionName = 'get-value';
const buffer = bufferCVFromString('foo');
const network = new StacksTestnet(); // for mainnet, use `StacksMainnet()`
const senderAddress = 'ST2F4BK4GZH6YFBNHYDDGN4T1RKBA7DA1BJZPJEJJ';

const options = {
  contractAddress,
  contractName,
  functionName,
  functionArgs: [buffer],
  network,
  senderAddress,
};

// make a read-only call to a contract function that
// returns a Response
const result: ResponseCV = await callReadOnlyFunction(options);

if (result.type === ClarityType.ResponseOk) {
  console.log(cvToString(result.value));
} else if (result.type === ClarityType.ResponseErr) {
  throw new Error(`kv-store contract error: ${result.value.data}`);
}
```

### ClarityValues to/from Hex

If you receive a response from a transaction in the form of a `hex` string, you can deserialize it into a Clarity value like so:

```javascript
import { hexToCV } from '@stacks/transactions';

let cv = hexToCV('hex_string');
```

Similarly, you can convert a Clarity value to `hex` string like so:

```javascript
import { cvToHex, trueCV } from '@stacks/transactions';

let trueHex = cvToHex(trueCV());
```

## Debugging Clarity Values

Sometimes you might receive a Clarity value that you were not expecting. Logging the value to your console won't always prove to be useful, unless you have memorized the Clarity value type enum values.

In order to figure out what kind of value you are dealing with, you can use the `cvToString()` function to convert the Clarity value to a more easily readable string.

For example, calling `cvToString()` on a large `tuple` might yield something like:

```
(tuple
  (a -1)
  (b u1)
  (c 0x74657374)
  (d true)
  (e (some true))
  (f none)
  (g SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B)
  (h SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B.test)
  (i (ok true))
  (j (err false))
  (k (list true false))
  (l (tuple (a true) (b false)))
  (m "hello world")
  (n u"hello \u{1234}"))`
```
