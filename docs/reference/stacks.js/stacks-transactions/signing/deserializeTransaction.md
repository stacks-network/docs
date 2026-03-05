# deserializeTransaction

Deserializes a transaction from a hex string or byte array back into a `StacksTransactionWire` object.

***

### Usage

```ts
import { deserializeTransaction } from '@stacks/transactions';

const hex = '8080000000040066...'; // serialized transaction hex
const transaction = deserializeTransaction(hex);

console.log(transaction.txid());
console.log(transaction.auth);
console.log(transaction.payload);
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/transaction.ts#L324)**

***

### Signature

```ts
function deserializeTransaction(tx: string | Uint8Array): StacksTransactionWire;
```

***

### Returns

`StacksTransactionWire`

The deserialized transaction object.

***

### Parameters

#### tx (required)

* **Type**: `string | Uint8Array`

The serialized transaction as a hex string or byte array.
