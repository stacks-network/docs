# fetchPushScriptBytes

Calls the pox-5 `push-script-bytes` read-only and returns the input bytes prefixed with the Bitcoin Script push opcode that pox-5 uses when it builds a lockup script.

***

### Usage

```ts
import { bytesToHex } from '@stacks/common';
import { fetchPushScriptBytes } from '@stacks/bitcoin-staking';

const pushed = await fetchPushScriptBytes({
  bytes: '02a1633cafcc01ebfb6d78e39f687a1f0995c62fc95f51ead10a02ee0be551b5dc',
  network: 'mainnet',
});

bytesToHex(pushed); // '2102a1633cafcc01ebfb6d78e39f687a1f0995c62fc95f51ead10a02ee0be551b5dc'
```

#### Notes

* Wraps [`push-script-bytes`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3768-L3786). The prefix depends on the input length: under 76 bytes, a single length byte; under 256 bytes, `0x4c` (`OP_PUSHDATA1`) and a 1-byte length; otherwise `0x4d` (`OP_PUSHDATA2`) and a 2-byte little-endian length.
* The input is at most 1,024 bytes, the contract's `(buff 1024)` argument type.
* The SDK applies the same encoding locally when it builds a lockup script. Call this to cross-check that encoding against the deployed contract.
* Throws an `Error` if the node returns a non-2xx status (the message starts with `Error calling read-only function.`) or answers `okay: false` (the message is the node's `cause`).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L656-L666)

***

### Signature

```ts
function fetchPushScriptBytes(
  opts: { bytes: Uint8Array | string } & NetworkClientParam
): Promise<Uint8Array>;
```

`opts` is a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md) plus `bytes`.

***

### Returns

`Promise<Uint8Array>`

The push opcode and length prefix, followed by the input bytes.

***

### Parameters

#### opts.bytes (required)

* **Type**: `Uint8Array | string`

The data to push, as raw bytes or hex. At most 1,024 bytes.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
