# fetchUintToBuffLe

Calls the pox-5 `uint-to-buff-le` read-only and returns `n` as 1 or 2 little-endian bytes. pox-5 uses it for the length prefix in script pushes.

***

### Usage

```ts
import { bytesToHex } from '@stacks/common';
import { fetchUintToBuffLe } from '@stacks/bitcoin-staking';

bytesToHex(await fetchUintToBuffLe({ n: 1, network: 'mainnet' })); // '01'
bytesToHex(await fetchUintToBuffLe({ n: 256, network: 'mainnet' })); // '0001'
```

#### Notes

* Wraps [`uint-to-buff-le`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3747-L3766). Values below 256 return 1 byte; values from 256 to 65,535 return 2 bytes.
* `n` above 65,535 makes the contract panic, and the call throws.
* Throws an `Error` if the node returns a non-2xx status (the message starts with `Error calling read-only function.`) or answers `okay: false` (the message is the node's `cause`).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L696-L706)

***

### Signature

```ts
function fetchUintToBuffLe(
  opts: { n: number | bigint } & NetworkClientParam
): Promise<Uint8Array>;
```

`opts` is a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md) plus `n`.

***

### Returns

`Promise<Uint8Array>`

`n` as 1 or 2 little-endian bytes.

***

### Parameters

#### opts.n (required)

* **Type**: `number | bigint`

Non-negative integer, at most 65,535. Sent as a Clarity `uint`.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
