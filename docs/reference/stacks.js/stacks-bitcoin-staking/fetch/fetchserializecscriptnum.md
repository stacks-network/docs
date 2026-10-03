# fetchSerializeCScriptNum

Calls the pox-5 `serialize-c-script-num` read-only and returns the minimal little-endian Bitcoin Script number encoding (CScriptNum) of `n`, without a push opcode.

***

### Usage

```ts
import { bytesToHex } from '@stacks/common';
import { fetchSerializeCScriptNum } from '@stacks/bitcoin-staking';

const encoded = await fetchSerializeCScriptNum({ n: 1000, network: 'mainnet' });

bytesToHex(encoded); // 'e803'
```

#### Notes

* Wraps [`serialize-c-script-num`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3788-L3832). The result is 0 to 5 bytes: `0` encodes as an empty buffer, and a `0x00` byte is appended when the top byte's high bit is set.
* `n` of 2^39 (549,755,813,888) or more makes the contract return `ERR_INVALID_UNLOCK_HEIGHT (u52)`. The SDK then throws an `Error` whose message starts with `serialize-c-script-num returned (err u52)`, followed by the error's name and description.
* For the encoding with its push opcode, as it appears in a lockup script, use [fetchPushCScriptNum](fetchpushcscriptnum.md).
* The SDK applies the same encoding locally when it builds a lockup script. Call this to cross-check that encoding against the deployed contract.
* Throws an `Error` if the node returns a non-2xx status (the message starts with `Error calling read-only function.`) or answers `okay: false` (the message is the node's `cause`).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L668-L680)

***

### Signature

```ts
function fetchSerializeCScriptNum(
  opts: { n: number | bigint } & NetworkClientParam
): Promise<Uint8Array>;
```

`opts` is a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md) plus `n`.

***

### Returns

`Promise<Uint8Array>`

The CScriptNum bytes, 0 to 5 bytes long.

***

### Parameters

#### opts.n (required)

* **Type**: `number | bigint`

Non-negative integer to encode, below 2^39. Sent as a Clarity `uint`.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
