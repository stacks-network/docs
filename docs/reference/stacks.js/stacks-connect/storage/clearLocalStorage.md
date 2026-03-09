# clearLocalStorage

Removes all Stacks Connect data from local storage. This clears the cached addresses stored under the `@stacks/connect` key.

***

### Usage

```ts
import { clearLocalStorage } from '@stacks/connect';

clearLocalStorage();
```

#### Notes

- After calling this function, [`isConnected`](../connection/isConnected.md) will return `false` and [`getLocalStorage`](getLocalStorage.md) will return `null`.
- If you want to fully disconnect a user (including clearing the selected wallet provider and session data), use [`disconnect`](../connection/disconnect.md) instead, which calls `clearLocalStorage` internally.
- If removing from local storage fails, a warning is logged to the console and no error is thrown.

**[Reference Link](https://github.com/stx-labs/connect/blob/main/packages/connect/src/storage.ts#L85)**

***

### Signature

```ts
function clearLocalStorage(): void
```

***

### Returns

`void`

This function does not return a value.

***

### Parameters

This function takes no parameters.
