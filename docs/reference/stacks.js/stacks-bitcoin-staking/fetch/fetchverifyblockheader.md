# fetchVerifyBlockHeader

Calls the pox-5 `verify-block-header` read-only and returns `true` if an 80-byte Bitcoin block header hashes to the burn block header hash the Stacks node records at a given height.

***

### Usage

```ts
import { fetchVerifyBlockHeader } from '@stacks/bitcoin-staking';

declare const header: string; // 80-byte header hex, e.g. from Bitcoin Core `getblockheader <hash> false`

const ok = await fetchVerifyBlockHeader({
  header,
  burnHeight: 850000,
  network: 'mainnet',
});
```

#### Notes

* Wraps [`verify-block-header`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3662-L3672), which compares the byte-reversed double SHA-256 of the header with `get-burn-block-info? header-hash` at `burnHeight`.
* Returns `false` when the hashes differ and when the node has no header at `burnHeight`.
* `register-for-bond` runs the same check on each L1 lockup output's `header` and `height`, and fails with `ERR_INVALID_BTC_HEADER (u40)` when it returns `false` ([L2089-L2091](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2089-L2091)).
* Read the recorded hash itself with [fetchBurnBlockHeaderHash](fetchburnblockheaderhash.md).
* Throws an `Error` if the node returns a non-2xx status (the message starts with `Error calling read-only function.`) or answers `okay: false` (the message is the node's `cause`).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L777-L798)

***

### Signature

```ts
function fetchVerifyBlockHeader(
  opts: { header: Uint8Array | string; burnHeight: number } & NetworkClientParam
): Promise<boolean>;
```

`opts` is a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md) plus the fields below.

***

### Returns

`Promise<boolean>`

`true` if the header matches the recorded hash at `burnHeight`, `false` otherwise.

***

### Parameters

#### opts.header (required)

* **Type**: `Uint8Array | string`

The 80-byte block header, as raw bytes or hex.

#### opts.burnHeight (required)

* **Type**: `number`

Bitcoin block height the header should be at.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
