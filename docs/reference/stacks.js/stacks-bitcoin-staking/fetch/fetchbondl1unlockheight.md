# fetchBondL1UnlockHeight

Calls the pox-5 `get-bond-l1-unlock-height` read-only and returns the minimum Bitcoin block height that a protocol bond's L1 lockup script may use as its CLTV unlock height.

***

### Usage

```ts
import { fetchBondL1UnlockHeight } from '@stacks/bitcoin-staking';

const unlockHeight = await fetchBondL1UnlockHeight({ bondIndex: 1, network: 'mainnet' }); // bigint
```

#### Notes

* [`get-bond-l1-unlock-height`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3340-L3346) computes the burn height at which the bond's 12 reward cycles end, minus half a reward cycle length (1,050 Bitcoin blocks on mainnet). It reads no map, so it returns a height for a bond index that has not been set up.
* `register-for-bond` fails with `ERR_INVALID_UNLOCK_HEIGHT (u52)` for an L1 lockup output whose unlock height is below this value, or at or above 500,000,000 ([L2074-L2079](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2074-L2079)).
* [computeBondUnlockHeight](../script/computebondunlockheight.md) computes the same height locally from a [PoxInfo](../types/poxinfo.md), with no request, and returns a `number`.
* Throws an `Error` if the node returns a non-2xx status (the message starts with `Error calling read-only function.`) or answers `okay: false` (the message is the node's `cause`).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L493-L514)

***

### Signature

```ts
function fetchBondL1UnlockHeight(
  opts: { bondIndex: number } & NetworkClientParam
): Promise<bigint>;
```

`opts` is a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md) plus `bondIndex`.

***

### Returns

`Promise<bigint>`

The minimum L1 unlock height for the bond, as a Bitcoin block height.

***

### Parameters

#### opts.bondIndex (required)

* **Type**: `number`

Index of the protocol bond.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
