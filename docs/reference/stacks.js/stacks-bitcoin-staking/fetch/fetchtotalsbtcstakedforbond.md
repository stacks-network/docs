# fetchTotalSbtcStakedForBond

Calls the pox-5 `get-total-sbtc-staked-for-bond` read-only and returns the total sats recorded for a protocol bond.

***

### Usage

```ts
import { fetchTotalSbtcStakedForBond } from '@stacks/bitcoin-staking';

const totalSats = await fetchTotalSbtcStakedForBond({ bondIndex: 1, network: 'mainnet' }); // sats, as a bigint
```

#### Notes

* Reads the [`protocol-bonds-total-staked`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L150-L154) map through [`get-total-sbtc-staked-for-bond`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3144-L3146). Returns `0n` when there is no entry.
* The total counts sats from Bitcoin L1 lockups and from sBTC alike: `register-for-bond` adds the registration's sats whichever path the staker used ([L673-L676](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L673-L676)).
* `register-for-bond` sets the value to the bond's first-cycle share total plus the new registration's sats ([L704-L706](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L704-L706), [L793-L795](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L793-L795)). `announce-l1-early-exit` ([L1238-L1240](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1238-L1240)) and `unstake-sbtc` ([L1312-L1315](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1312-L1315)) subtract the sats they release.
* For the bond's share total in a specific reward cycle, the figure pox-5 uses when it computes rewards, call [fetchTotalSharesStakedForCycle](fetchtotalsharesstakedforcycle.md) with `bondIndex`.
* Throws an `Error` if the node returns a non-2xx status (the message starts with `Error calling read-only function.`) or answers `okay: false` (the message is the node's `cause`).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L406-L437)

***

### Signature

```ts
function fetchTotalSbtcStakedForBond(
  opts: { bondIndex: number } & NetworkClientParam
): Promise<bigint>;
```

`opts` is a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md) plus `bondIndex`.

***

### Returns

`Promise<bigint>`

Total sats recorded for the bond.

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
