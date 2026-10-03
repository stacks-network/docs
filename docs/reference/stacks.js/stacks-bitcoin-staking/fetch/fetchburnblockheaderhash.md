# fetchBurnBlockHeaderHash

Calls the pox-5 `get-bc-h-hash` read-only and returns the Bitcoin block header hash the Stacks node records at a burn height, or `undefined` if it has none.

***

### Usage

```ts
import { bytesToHex } from '@stacks/common';
import { fetchBurnBlockHeaderHash, fetchPoxInfo } from '@stacks/bitcoin-staking';

const { currentBurnchainBlockHeight } = await fetchPoxInfo({ network: 'mainnet' });

const hash = await fetchBurnBlockHeaderHash({
  burnHeight: currentBurnchainBlockHeight - 5,
  network: 'mainnet',
});

const hex = hash ? bytesToHex(hash) : undefined;
```

#### Notes

* Wraps [`get-bc-h-hash`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3658-L3660), which returns `get-burn-block-info? header-hash` for the height.
* The hash is in the byte order [fetchVerifyBlockHeader](fetchverifyblockheader.md) compares against: the double SHA-256 of the header, reversed.
* Throws an `Error` if the node returns a non-2xx status (the message starts with `Error calling read-only function.`) or answers `okay: false` (the message is the node's `cause`).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L800-L822)

***

### Signature

```ts
function fetchBurnBlockHeaderHash(
  opts: { burnHeight: number } & NetworkClientParam
): Promise<Uint8Array | undefined>;
```

`opts` is a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md) plus `burnHeight`.

***

### Returns

`Promise<Uint8Array | undefined>`

The 32-byte header hash, or `undefined` when the node has no header at `burnHeight`.

***

### Parameters

#### opts.burnHeight (required)

* **Type**: `number`

Bitcoin block height to look up.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
