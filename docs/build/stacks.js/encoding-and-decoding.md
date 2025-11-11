# Encoding & Decoding

Convert between Clarity values and JavaScript types.

## Overview

Stacks uses Clarity values (CVs) to represent data in smart contracts. When building applications, you'll need to encode JavaScript values into CVs for contract calls and decode CVs back to JavaScript for display. This guide covers all CV types and conversion patterns.

## Basic type conversions

### Integers

Convert between JavaScript numbers and Clarity integers:

{% code title="integers.ts" %}
```ts
import { 
  intCV, 
  uintCV, 
  cvToValue,
  cvToJSON 
} from '@stacks/transactions';

// Encoding
const positiveInt = uintCV(42);        // u42
const negativeInt = intCV(-100);       // -100
const largeUint = uintCV(1000000);     // u1000000

// Decoding
const jsValue = cvToValue(positiveInt); // 42
const jsonValue = cvToJSON(positiveInt); // { type: 'uint', value: '42' }

// Working with BigInt for large numbers
const bigNumber = uintCV(BigInt('123456789012345678901234567890'));
const decoded = cvToValue(bigNumber); // '123456789012345678901234567890'
```
{% endcode %}

### Booleans

Simple true/false values:

{% code title="booleans.ts" %}
```ts
import { trueCV, falseCV, boolCV } from '@stacks/transactions';

// Encoding
const clarityTrue = trueCV();          // true
const clarityFalse = falseCV();        // false
const fromBoolean = boolCV(true);      // true

// Decoding
const jsBoolean = cvToValue(clarityTrue); // true
```
{% endcode %}

### Strings

Handle ASCII and UTF-8 strings:

{% code title="strings.ts" %}
```ts
import { 
  stringAsciiCV, 
  stringUtf8CV,
  cvToString 
} from '@stacks/transactions';

// ASCII strings (limited character set)
const asciiString = stringAsciiCV('Hello World');
const asciiDecoded = cvToValue(asciiString); // 'Hello World'

// UTF-8 strings (full Unicode support)
const utf8String = stringUtf8CV('Hello 世界! 🌍');
const utf8Decoded = cvToValue(utf8String); // 'Hello 世界! 🌍'

// Direct string extraction
const directString = cvToString(utf8String); // 'Hello 世界! 🌍'
```
{% endcode %}

### Principals

Encode Stacks addresses and contract principals:

{% code title="principals.ts" %}
```ts
import { 
  standardPrincipalCV,
  contractPrincipalCV,
  cvToValue 
} from '@stacks/transactions';

// Standard principal (user address)
const userPrincipal = standardPrincipalCV('SP2J6Y09JMFWWZCT4VJX0BA5W7A9HZP5EX96Y6VZY');

// Contract principal
const contractPrincipal = contractPrincipalCV(
  'SP2J6Y09JMFWWZCT4VJX0BA5W7A9HZP5EX96Y6VZY',
  'my-contract'
);

// Decoding
const address = cvToValue(userPrincipal); 
// 'SP2J6Y09JMFWWZCT4VJX0BA5W7A9HZP5EX96Y6VZY'

const contract = cvToValue(contractPrincipal); 
// 'SP2J6Y09JMFWWZCT4VJX0BA5W7A9HZP5EX96Y6VZY.my-contract'
```
{% endcode %}

## Complex type handling

### Buffers

Work with binary data:

{% code title="buffers.ts" %}
```ts
import { 
  bufferCV,
  bufferCVFromString,
  cvToValue 
} from '@stacks/transactions';

// From hex string
const hexBuffer = bufferCV(Buffer.from('deadbeef', 'hex'));

// From UTF-8 string
const stringBuffer = bufferCVFromString('Hello Buffer');

// From byte array
const byteBuffer = bufferCV(new Uint8Array([1, 2, 3, 4]));

// Decoding returns hex string
const decoded = cvToValue(hexBuffer); // '0xdeadbeef'

// Get raw buffer
const rawBuffer = hexBuffer.buffer; // Buffer instance
```
{% endcode %}

### Optional values

Handle Clarity's optional type:

{% code title="optional.ts" %}
```ts
import { 
  someCV, 
  noneCV,
  cvToValue 
} from '@stacks/transactions';

// Some value (contains a value)
const someValue = someCV(uintCV(42));         // (some u42)
const someString = someCV(stringUtf8CV('hi')); // (some u"hi")

// None value (no value)
const noneValue = noneCV();                    // none

// Decoding
const decodedSome = cvToValue(someValue);  // 42
const decodedNone = cvToValue(noneValue);  // null

// Check optional type
if (someValue.type === ClarityType.OptionalSome) {
  const innerValue = cvToValue(someValue.value);
}
```
{% endcode %}

### Response values

Handle contract response types:

{% code title="response.ts" %}
```ts
import { 
  responseOkCV, 
  responseErrorCV,
  cvToValue 
} from '@stacks/transactions';

// Success response
const okResponse = responseOkCV(uintCV(100));      // (ok u100)
const okString = responseOkCV(stringUtf8CV('Success')); // (ok u"Success")

// Error response
const errorResponse = responseErrorCV(uintCV(404)); // (err u404)
const errorMsg = responseErrorCV(stringUtf8CV('Not found')); // (err u"Not found")

// Decoding and checking
const result = okResponse;
if (result.type === ClarityType.ResponseOk) {
  console.log('Success:', cvToValue(result.value));
} else {
  console.log('Error:', cvToValue(result.value));
}
```
{% endcode %}

### Tuples

Create and decode structured data:

{% code title="tuple.ts" %}
```ts
import { 
  tupleCV,
  cvToValue,
  cvToJSON 
} from '@stacks/transactions';

// Create tuple
const userInfo = tupleCV({
  id: uintCV(1),
  name: stringUtf8CV('Alice'),
  balance: uintCV(1000000),
  active: trueCV(),
  metadata: tupleCV({
    created: uintCV(Date.now()),
    tags: listCV([stringAsciiCV('user'), stringAsciiCV('premium')])
  })
});

// Decode to JavaScript object
const decoded = cvToValue(userInfo);
// {
//   id: 1,
//   name: 'Alice',
//   balance: 1000000,
//   active: true,
//   metadata: {
//     created: 1234567890,
//     tags: ['user', 'premium']
//   }
// }

// Access tuple fields
const nameCV = userInfo.data.name;
const name = cvToValue(nameCV); // 'Alice'
```
{% endcode %}

### Lists

Work with arrays of values:

{% code title="lists.ts" %}
```ts
import { 
  listCV,
  cvToValue 
} from '@stacks/transactions';

// List of same type
const numbers = listCV([uintCV(1), uintCV(2), uintCV(3)]);
const strings = listCV([
  stringUtf8CV('apple'),
  stringUtf8CV('banana'),
  stringUtf8CV('cherry')
]);

// List of tuples (common pattern)
const users = listCV([
  tupleCV({ id: uintCV(1), name: stringUtf8CV('Alice') }),
  tupleCV({ id: uintCV(2), name: stringUtf8CV('Bob') }),
]);

// Decoding
const decodedNumbers = cvToValue(numbers); // [1, 2, 3]
const decodedUsers = cvToValue(users); 
// [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]

// Iterate over list
numbers.list.forEach((cv, index) => {
  console.log(`Item ${index}:`, cvToValue(cv));
});
```
{% endcode %}

## Advanced encoding patterns

### Dynamic type encoding

Build encoders for runtime values:

{% code title="dynamic-encoder.ts" %}
```ts
function encodeValue(value: any): ClarityValue {
  if (typeof value === 'number') {
    return value >= 0 ? uintCV(value) : intCV(value);
  } else if (typeof value === 'string') {
    // Check if valid ASCII
    if (/^[\x00-\x7F]*$/.test(value)) {
      return stringAsciiCV(value);
    }
    return stringUtf8CV(value);
  } else if (typeof value === 'boolean') {
    return boolCV(value);
  } else if (value === null || value === undefined) {
    return noneCV();
  } else if (Array.isArray(value)) {
    return listCV(value.map(encodeValue));
  } else if (typeof value === 'object') {
    const tupleData: { [key: string]: ClarityValue } = {};
    for (const [key, val] of Object.entries(value)) {
      tupleData[key] = encodeValue(val);
    }
    return tupleCV(tupleData);
  }
  
  throw new Error(`Cannot encode value: ${value}`);
}

// Usage
const encoded = encodeValue({
  name: 'Alice',
  age: 30,
  tags: ['user', 'admin'],
  active: true
});
```
{% endcode %}

### Type-safe decoding

Create decoders with type validation:

{% code title="decode-user.ts" %}
```ts
interface UserData {
  id: number;
  name: string;
  balance: number;
  active: boolean;
}

function decodeUser(cv: ClarityValue): UserData {
  if (cv.type !== ClarityType.Tuple) {
    throw new Error('Expected tuple');
  }
  
  const data = cv.data;
  
  // Validate and extract each field
  if (!data.id || data.id.type !== ClarityType.UInt) {
    throw new Error('Invalid id field');
  }
  
  if (!data.name || (
    data.name.type !== ClarityType.StringASCII && 
    data.name.type !== ClarityType.StringUTF8
  )) {
    throw new Error('Invalid name field');
  }
  
  return {
    id: Number(cvToValue(data.id)),
    name: cvToString(data.name),
    balance: Number(cvToValue(data.balance)),
    active: cvToValue(data.active) as boolean,
  };
}
```
{% endcode %}

### Batch encoding utilities

Encode multiple values efficiently:

{% code title="clarity-encoder.ts" %}
```ts
class ClarityEncoder {
  static encodeArray<T>(
    items: T[],
    encoder: (item: T) => ClarityValue
  ): ClarityValue {
    return listCV(items.map(encoder));
  }
  
  static encodeTuple<T extends Record<string, any>>(
    obj: T,
    schema: { [K in keyof T]: (value: T[K]) => ClarityValue }
  ): TupleCV {
    const tupleData: { [key: string]: ClarityValue } = {};
    
    for (const [key, encoder] of Object.entries(schema)) {
      tupleData[key] = encoder(obj[key as keyof T]);
    }
    
    return tupleCV(tupleData);
  }
  
  static encodeOptional<T>(
    value: T | null | undefined,
    encoder: (value: T) => ClarityValue
  ): OptionalCV {
    if (value === null || value === undefined) {
      return noneCV();
    }
    return someCV(encoder(value));
  }
}

// Usage
const users = [
  { id: 1, name: 'Alice', balance: 1000 },
  { id: 2, name: 'Bob', balance: 2000 },
];

const encoded = ClarityEncoder.encodeArray(users, user =>
  ClarityEncoder.encodeTuple(user, {
    id: (id) => uintCV(id),
    name: (name) => stringUtf8CV(name),
    balance: (balance) => uintCV(balance),
  })
);
```
{% endcode %}

## Serialization and deserialization

Work with serialized Clarity values:

{% code title="serialization.ts" %}
```ts
import { 
  serializeCV,
  deserializeCV,
  cvToHex,
  hexToCV 
} from '@stacks/transactions';

// Serialize to buffer
const cv = tupleCV({ amount: uintCV(1000), memo: stringUtf8CV('Payment') });
const serialized = serializeCV(cv); // Buffer

// Convert to hex for storage/transport
const hex = cvToHex(cv); // '0x0c00000002046d656d6f...'

// Deserialize from hex
const deserialized = hexToCV(hex);
const value = cvToValue(deserialized); // { amount: 1000, memo: 'Payment' }

// Work with raw buffers
const buffer = Buffer.from(hex, 'hex');
const fromBuffer = deserializeCV(buffer);
```
{% endcode %}

## Common conversion patterns

### Contract call arguments

Prepare arguments for contract calls:

{% code title="prepare-args.ts" %}
```ts
function prepareTransferArgs(
  recipient: string,
  amount: number,
  memo?: string
): ClarityValue[] {
  const args = [
    standardPrincipalCV(recipient),
    uintCV(amount),
  ];
  
  if (memo) {
    args.push(someCV(stringUtf8CV(memo)));
  } else {
    args.push(noneCV());
  }
  
  return args;
}

// Usage in contract call
const functionArgs = prepareTransferArgs(
  'SP2J6Y09JMFWWZCT4VJX0BA5W7A9HZP5EX96Y6VZY',
  1000000,
  'Monthly payment'
);
```
{% endcode %}

### Response handling

Process contract responses:

{% code title="handle-response.ts" %}
```ts
function handleContractResponse(response: ClarityValue): {
  success: boolean;
  data: any;
  error?: string;
} {
  if (response.type === ClarityType.ResponseOk) {
    return {
      success: true,
      data: cvToValue(response.value),
    };
  } else if (response.type === ClarityType.ResponseErr) {
    const errorValue = cvToValue(response.value);
    return {
      success: false,
      data: null,
      error: typeof errorValue === 'string' ? errorValue : `Error: ${errorValue}`,
    };
  }
  
  throw new Error('Invalid response type');
}
```
{% endcode %}

## Best practices

{% hint style="info" %}
* Validate types: Always check CV types before decoding
* Handle edge cases: Consider null, undefined, and empty values
* Use appropriate string types: ASCII for simple text, UTF-8 for international
* Preserve precision: Use BigInt for large numbers
* Type narrowing: Use TypeScript type guards for safety
{% endhint %}

## Common mistakes

<details>

<summary>String type confusion</summary>

```ts
// Bad: Using ASCII for Unicode
const bad = stringAsciiCV('Hello 世界'); // Will throw error

// Good: Use UTF-8 for Unicode
const good = stringUtf8CV('Hello 世界');
```

</details>

<details>

<summary>Number overflow</summary>

```ts
// Bad: JavaScript number too large
const bad = uintCV(Number.MAX_SAFE_INTEGER + 1); // Precision loss

// Good: Use BigInt
const good = uintCV(BigInt('9007199254740992'));
```

</details>
