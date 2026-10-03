# fetchNewRewards

Reads the sBTC, in sats, that pox-5 has received as rewards since the last `calculate-rewards`. Wraps the pox-5 read-only `get-new-rewards`.

***

### Usage

```ts
import { fetchLastAccountedRewards, fetchNewRewards, fetchRewards } from '@stacks/bitcoin-staking';

const [rewards, lastAccounted, newRewards] = await Promise.all([
  fetchRewards({ network: 'mainnet' }),
  fetchLastAccountedRewards({ network: 'mainnet' }),
  fetchNewRewards({ network: 'mainnet' }),
]);
// At the same chain tip: newRewards === rewards - lastAccounted
```

#### Notes

* `get-new-rewards` returns `get-rewards` minus the `last-accounted-rewards-only` data-var ([get-new-rewards](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2149-L2156)).
* The next `calculate-rewards` distributes this amount ([calculate-rewards](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2165)). The protocol bond tranche is paid first, each bond up to its target yield ([calculate-bond-rewards](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2264-L2272)). The reserve fund tranche takes 15% of the remainder ([`RESERVE_RATIO`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L107), 1,500 basis points), and the STX-only staking tranche gets the rest. When no STX is staked in the cycle, the STX-only staking tranche's part also goes to the reserve fund tranche ([calculate-rewards](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2189-L2208)).
* A non-2xx response throws an `Error` whose message starts with `Error calling read-only function.` and includes the status code and URL. If the node reports that the call failed, the `Error` message is the node's `cause`.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L1193-L1213)

***

### Signature

```ts
function fetchNewRewards(opts?: NetworkClientParam): Promise<bigint>;
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
