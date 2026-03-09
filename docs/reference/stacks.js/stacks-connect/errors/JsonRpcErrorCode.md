# JsonRpcErrorCode

An enum of numeric error codes for JSON-RPC errors. These codes are used in the `code` property of [`JsonRpcError`](JsonRpcError.md) to identify the type of error.

***

### Usage

```ts
import { JsonRpcError, JsonRpcErrorCode } from '@stacks/connect';

try {
  const result = await request('stx_transferStx', {
    recipient: 'SP2...address',
    amount: 1000000n,
  });
} catch (error) {
  if (error instanceof JsonRpcError) {
    switch (error.code) {
      case JsonRpcErrorCode.UserRejection:
        console.log('User rejected the request');
        break;
      case JsonRpcErrorCode.UserCanceled:
        console.log('User canceled the request');
        break;
      case JsonRpcErrorCode.MethodNotFound:
        console.log('Method not supported by wallet');
        break;
      default:
        console.error('Unexpected error:', error.message);
    }
  }
}
```

**[Reference Link](https://github.com/stx-labs/connect/blob/main/packages/connect/src/errors.ts#L33)**

***

### Definition

```ts
enum JsonRpcErrorCode {
  // Standard JSON-RPC errors
  ParseError = -32700,
  InvalidRequest = -32600,
  MethodNotFound = -32601,
  InvalidParams = -32602,
  InternalError = -32603,

  // Implementation-defined wallet errors (-32099 to -32000)
  UserRejection = -32000,
  MethodAddressMismatch = -32001,
  MethodAccessDenied = -32002,

  // Custom errors (outside JSON-RPC range)
  UnknownError = -31000,
  UserCanceled = -31001,
}
```

***

### Standard JSON-RPC Errors

These follow the [JSON-RPC 2.0 specification](https://www.jsonrpc.org/specification#error_object). Error codes from `-32768` to `-32000` are reserved.

| Code | Name | Description |
| --- | --- | --- |
| `-32700` | `ParseError` | Invalid JSON received by the server while parsing. |
| `-32600` | `InvalidRequest` | Invalid JSON-RPC request object. |
| `-32601` | `MethodNotFound` | The requested method is not found or not available. |
| `-32602` | `InvalidParams` | Invalid method parameters. |
| `-32603` | `InternalError` | Internal JSON-RPC error. |

***

### Implementation-Defined Wallet Errors

These are wallet-specific errors within the range `-32099` to `-32000`.

| Code | Name | Description |
| --- | --- | --- |
| `-32000` | `UserRejection` | The user rejected the request in their wallet. |
| `-32001` | `MethodAddressMismatch` | Address mismatch for the requested method. |
| `-32002` | `MethodAccessDenied` | Access denied for the requested method. |

***

### Custom Errors

These are custom error codes outside the standard JSON-RPC error range. They may not originate from the wallet itself.

| Code | Name | Description |
| --- | --- | --- |
| `-31000` | `UnknownError` | An unknown external error. Does not originate from the wallet. |
| `-31001` | `UserCanceled` | The user canceled the request (e.g. closed the wallet selection modal). May not originate from the wallet. |
