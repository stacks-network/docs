---
title: Clarity Values Guide
description: Learn how to deal with Clarity Values in JavaScript.
tags:
  - tutorial
---

## Introduction
The Clarity language makes use of a strong static [type system](https://docs.blockstack.org/references/language-clarity#clarity-type-system). This simply means that every function defined in Clarity expects arguments of specific types, and that a failure to provide properly typed arguments will result in your code failing to compile, or your `contract-call` transaction failing prior to execution.

In order to build web applications that interact with Clarity contracts, we must include type information as a part of our function calls. The [@stacks/transactions](https://github.com/blockstack/stacks.js/tree/master/packages/transactions) library makes this easy, as we will demonstrate below.

## Clarity Types
Values in Clarity can have the following types:

- `(tuple (key-name-0 key-type-0) (key-name-1 key-type-1) ...)` - a typed tuple with named fields.
- `(list max-len entry-type)` - a list of maximum length max-len, with entries of type entry-type
- `(response ok-type err-type)` - object used by public functions to commit their changes or abort. May be returned or used by other functions as well, however, only public functions have the commit/abort behavior.
- `(optional some-type)` - an option type for objects that can either be (some value) or none
- `(buff max-len)` - byte buffer or maximum length max-len.
- `(string-ascii max-len)` - ASCII string of maximum length max-len
- `(string-utf8 max-len)` - UTF-8 string of maximum length max-len
- `principal` - object representing a principal (whether a contract principal or standard principal).
- `bool` - boolean value (true or false)
- `int` - signed 128-bit integer
- `uint` - unsigned 128-bit integer

## Constructing Clarity Values
Clarity values can be constructed with functions provided by the **@stacks/transactions** library. These function simply output javascript objects that contain a value and a numerical representation of the Clarity type information. These Clarity value objects can then be easily serialized into `contract-call` transactions for interacting with Clarity contracts.

Here are examples of how to construct each type of Clarity value:

### Booleans
```javascript
const t = trueCV();
const f = falseCV();
```
### Optional Values
```javascript
const nothing = noneCV();
const something = someCV(t);
```

### Buffers
```javascript
const buffer = Buffer.from('foo');
const bufCV = bufferCV(buffer);
```

### Integers
```javascript
const i = intCV(-10);
const u = uintCV(10);
```

### Strings
```javascript
const ascii = stringAsciiCV('hello world');
const utf8 = stringUtf8CV('hello 🌾');
```

### Principals
```javascript
const address = 'SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B';
const contractName = 'contract-name';

const spCV = standardPrincipalCV(address);
const cpCV = contractPrincipalCV(address, contractName);
```

### Response Values
```javascript
const errCV = responseErrorCV(trueCV());
const okCV = responseOkCV(falseCV());
```

### Tuples
```javascript
const tupCV = tupleCV({
  'a': intCV(1),
  'b': trueCV(),
  'c': falseCV()
})
```

### Lists
```javascript
const l = listCV([trueCV(), falseCV()])
```

## Using Clarity Values
Now that you know how to construct Clarity values, you can use them to build `contract-call` transactions that call smart contract functions.

Here's an example of how this is done:

```javascript
import {
  makeContractCall,
  uintCV,
  stringAsciiCV,
  StacksMainnet,
  broadcastTransaction
} from '@stacks/transactions';

const network = new StacksMainnet();

const txOptions = {
  contractAddress: 'SPBMRFRPPGCDE3F384WCJPK8PQJGZ8K9QKK7F59X',
  contractName: 'contract_name',
  functionName: 'contract_function',
  functionArgs: [uintCV(10), stringAsciiCV('test')],
  senderKey: 'b244296d5907de9864c0b0d51f98a13c52890be0404e83f273144cd5b9960eed01',
  validateWithAbi: true,
  network,
};

const transaction = await makeContractCall(txOptions);

broadcastTransaction(transaction, network);
```

## Utilizing Clarity Values from Transaction Responses
If you successfully submit a `contract-call` transaction that calls a Clarity function, you may receive a resulting Clarity value in response.

If using the transaction library's `callReadOnlyFunction()` method, the result will be a `ClarityValue`. As mentioned above, `ClarityValues` are simply javascript objects containing a value and its associated Clarity type information. These object types are defined [here](https://github.com/blockstack/stacks.js/tree/1f2b5fd8bdf1c2b5866e8171163594d7708a8c7a/packages/transactions/src/clarity/types).

### Deserializing Clarity Values from Hex
If you receive a response from a transaction in the form of a Hex string, you can deserialize it into a Clarity value like so:

```javascript
import { hexToCV } from '@stacks/transactions';

let cv = hexToCV('hex_string');
```

## Debugging with Clarity Values
Sometimes you might receive as a response a Clarity value that you were not expecting. Logging the value to your console won't always prove to be useful, unless you have memorized the Clarity value type encodings. In order to figure out what kind of value you are dealing with, you can use the `cvToString()` function to convert the Clarity value to a more easily readable string.

For example, calling `cvToString()` on a `tuple` might yield something like:

```
(tuple (key "value"))
```
