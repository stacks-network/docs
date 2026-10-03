# fetchLastAccountedRewards

Reads the sBTC, in sats, that `calculate-rewards` has distributed to the protocol bond and STX-only staking tranches and that signer-managers have not yet claimed. Wraps the pox-5 read-only `get-last-accounted-rewards-only`, which returns the `last-accounted-rewards-only` data-var.

***

### Usage

```ts
import { fetchLastAccountedRewards } from '@stacks/bitcoin-staking';

const accounted = await fetchLastAccountedRewards({ network: 'mainnet' }); // sats of sBTC, as a bigint
```

#### Notes

* `calculate-rewards` adds the amount it distributes, minus the reserve deposit ([calculate-rewards](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2212-L2215)). `claim-rewards` subtracts the amount it pays ([claim-rewards](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2418-L2420)).
* [fetchRewards](fetchrewards.md) minus this value is [fetchNewRewards](fetchnewrewards.md) ([get-new-rewards](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2149-L2156)).
* The data-var starts at `0` ([last-accounted-rewards-only](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L378)).
* A non-2xx response throws an `Error` whose message starts with `Error calling read-only function.` and includes the status code and URL. If the node reports that the call failed, the `Error` message is the node's `cause`.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L1235-L1254)

***

### Signature

```ts
function fetchLastAccountedRewards(opts?: NetworkClientParam): Promise<bigint>;
```

`opts` is a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md).

***

### Returns

`Promise<bigint>`

Resolves to an amount of sBTC in sats.

***

### Parameters

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
