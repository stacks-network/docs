# fetchPushCScriptNum

Calls the pox-5 `push-c-script-num` read-only and returns the Bitcoin Script push of the number `n`, the form pox-5 uses for the unlock height in a lockup script.

***

### Usage

```ts
import { bytesToHex } from '@stacks/common';
import { fetchPushCScriptNum } from '@stacks/bitcoin-staking';

bytesToHex(await fetchPushCScriptNum({ n: 16, network: 'mainnet' })); // '60' (OP_16)
bytesToHex(await fetchPushCScriptNum({ n: 1000, network: 'mainnet' })); // '02e803'
```

#### Notes

* Wraps [`push-c-script-num`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3834-L3845). `0` returns `0x00` (`OP_0`), `1` to `16` return the single opcodes `0x51` to `0x60` (`OP_1` to `OP_16`), and larger values return the [fetchSerializeCScriptNum](fetchserializecscriptnum.md) bytes with a length prefix.
* `n` of 2^39 (549,755,813,888) or more makes the contract return `ERR_INVALID_UNLOCK_HEIGHT (u52)`. The SDK then throws an `Error` whose message starts with `push-c-script-num returned (err u52)`, followed by the error's name and description.
* The SDK applies the same encoding locally when it builds a lockup script. Call this to cross-check that encoding against the deployed contract.
* Throws an `Error` if the node returns a non-2xx status (the message starts with `Error calling read-only function.`) or answers `okay: false` (the message is the node's `cause`).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L682-L694)

***

### Signature

```ts
function fetchPushCScriptNum(
  opts: { n: number | bigint } & NetworkClientParam
): Promise<Uint8Array>;
```

`opts` is a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md) plus `n`.

***

### Returns

`Promise<Uint8Array>`

The script bytes that push `n`.

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
