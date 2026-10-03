# fetchReverseBuff32

Calls the pox-5 `reverse-buff32` read-only and returns a 32-byte buffer with its byte order reversed. pox-5 uses it to convert hashes between Bitcoin's internal byte order and display order.

***

### Usage

```ts
import { bytesToHex } from '@stacks/common';
import { fetchReverseBuff32 } from '@stacks/bitcoin-staking';

const reversed = await fetchReverseBuff32({
  input: '00112233445566778899aabbccddeeff0102030405060708090a0b0c0d0e0f10',
  network: 'mainnet',
});

bytesToHex(reversed); // '100f0e0d0c0b0a090807060504030201ffeeddccbbaa99887766554433221100'
```

#### Notes

* Wraps [`reverse-buff32`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3645-L3653).
* The input must be exactly 32 bytes. A shorter input makes the contract panic, and a longer one fails the `(buff 32)` argument type. The call throws in both cases.
* Throws an `Error` if the node returns a non-2xx status (the message starts with `Error calling read-only function.`) or answers `okay: false` (the message is the node's `cause`).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L708-L717)

***

### Signature

```ts
function fetchReverseBuff32(
  opts: { input: Uint8Array | string } & NetworkClientParam
): Promise<Uint8Array>;
```

`opts` is a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md) plus `input`.

***

### Returns

`Promise<Uint8Array>`

The 32 input bytes in reverse order.

***

### Parameters

#### opts.input (required)

* **Type**: `Uint8Array | string`

The 32 bytes to reverse, as raw bytes or hex.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
