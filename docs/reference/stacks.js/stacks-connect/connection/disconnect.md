# disconnect

Disconnects the currently selected wallet, clears all session data, and removes cached address data from local storage.

***

### Usage

```ts
import { disconnect } from '@stacks/connect';

disconnect();
```

#### Notes

- If the currently selected provider supports a custom `disconnect` method (e.g. WalletConnect), it will be called first.
- The selected provider ID is cleared, so subsequent calls to [`request`](../request/request.md) will prompt wallet selection again.
- All data stored via [`getLocalStorage`](../storage/getLocalStorage.md) is removed.
- The legacy `UserSession` data is also deleted.

**[Reference Link](https://github.com/stx-labs/connect/blob/main/packages/connect/src/storage.ts#L105)**

***

### Signature

```ts
function disconnect(): void
```

***

### Returns

`void`

This function does not return a value.

***

### Parameters

This function takes no parameters.
