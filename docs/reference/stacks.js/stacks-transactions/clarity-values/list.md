# Cl.list

Creates a Clarity `list` type from an array of Clarity values. Alias for `listCV`.

***

### Usage

```ts
import { Cl } from '@stacks/transactions';

Cl.list([Cl.int(100), Cl.int(200), Cl.int(300)]);

// Empty list
Cl.list([]);
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/cl.ts#L133)**

***

### Signature

```ts
const list: (values: ClarityValue[]) => ListCV;
```

***

### Returns

`ListCV`

A Clarity list value object.

***

### Parameters

#### values (required)

* **Type**: `ClarityValue[]`

An array of Clarity values. All values should be of the same Clarity type for the list to be valid in Clarity.
