# JsonRpcError

A custom error class for JSON-RPC errors returned by wallet providers. All errors thrown by [`request`](../request/request.md) and [`requestRaw`](../request/requestRaw.md) are instances of `JsonRpcError`.

***

### Usage

```ts
import { request, JsonRpcError } from '@stacks/connect';

try {
  const result = await request('stx_transferStx', {
    recipient: 'SP2...address',
    amount: 1000000n,
  });
} catch (error) {
  if (error instanceof JsonRpcError) {
    console.error(`Error code: ${error.code}`);
    console.error(`Message: ${error.message}`);
    console.error(`Data: ${error.data}`);
  }
}
```

**[Reference Link](https://github.com/stx-labs/connect/blob/main/packages/connect/src/errors.ts#L3)**

***

### Definition

```ts
class JsonRpcError extends Error {
  constructor(
    public message: string,
    public code: number,
    public data?: string,
    public cause?: Error
  );

  static fromResponse(error: JsonRpcResponseError): JsonRpcError;

  toString(): string;
}
```

***

### Properties

#### message

* **Type**: `string`

A human-readable description of the error.

#### code

* **Type**: `number`

A numeric error code identifying the type of error. See [`JsonRpcErrorCode`](JsonRpcErrorCode.md) for predefined codes.

#### data (optional)

* **Type**: `string`

Optional additional data associated with the error.

#### cause (optional)

* **Type**: `Error`

The original error that caused this `JsonRpcError`, if applicable.

***

### Static Methods

#### fromResponse

Creates a `JsonRpcError` from a `JsonRpcResponseError` object returned by a wallet provider.

```ts
static fromResponse(error: JsonRpcResponseError): JsonRpcError
```

```ts
interface JsonRpcResponseError {
  code: number;
  message: string;
  data?: any;
}
```

***

### Instance Methods

#### toString

Returns a formatted string representation of the error.

```ts
toString(): string
// Returns: "JsonRpcError (-32000): User rejected the request"
// With data: "JsonRpcError (-32000): User rejected the request: {\"detail\":\"...\"}"
```

***

### Related

- [`JsonRpcErrorCode`](JsonRpcErrorCode.md) — Predefined numeric error codes.
