# fetchTotalSbtcStaked

Calls the pox-5 `get-total-sbtc-staked` read-only and returns the sats of sBTC that pox-5 holds for protocol bonds across all stakers.

***

### Usage

```ts
import { fetchTotalSbtcStaked } from '@stacks/bitcoin-staking';

const totalSats = await fetchTotalSbtcStaked({ network: 'mainnet' }); // sats, as a bigint
```

#### Notes

* Reads the [`total-sbtc-staked`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L386-L387) data-var through [`get-total-sbtc-staked`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3297-L3299).
* Counts sBTC only. Sats locked on Bitcoin L1 are not included: a registration on the L1 path moves no sBTC into pox-5 ([L684-L687](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L684-L687)).
* Changes when sBTC moves in or out of pox-5: the net transfer in `roll-sbtc` ([L1938-L1979](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1938-L1979)), called by `register-for-bond` and `stake`, and the withdrawal in `unstake-sbtc` ([L1317-L1320](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1317-L1320)).
* Throws an `Error` if the node returns a non-2xx status (the message starts with `Error calling read-only function.`) or answers `okay: false` (the message is the node's `cause`).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L474-L491)

***

### Signature

```ts
function fetchTotalSbtcStaked(opts?: NetworkClientParam): Promise<bigint>;
```

`opts` is a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md).

***

### Returns

`Promise<bigint>`

Total sBTC held for protocol bonds, in sats.

***

### Parameters

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
