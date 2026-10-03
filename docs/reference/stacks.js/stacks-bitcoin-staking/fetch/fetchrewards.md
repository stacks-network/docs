# fetchRewards

Reads the sBTC, in sats, that pox-5 holds as rewards: its sBTC balance minus staked sBTC and the reserve balance. Wraps the pox-5 read-only `get-rewards`.

***

### Usage

```ts
import { fetchRewards } from '@stacks/bitcoin-staking';

const rewards = await fetchRewards({ network: 'mainnet' }); // sats of sBTC, as a bigint
```

#### Notes

* `get-rewards` returns the contract's sBTC balance minus `total-sbtc-staked` and `reserve-balance` ([get-rewards](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2135-L2145)).
* It covers rewards already distributed to tranches and not yet claimed ([fetchLastAccountedRewards](fetchlastaccountedrewards.md)) and rewards received since the last `calculate-rewards` ([fetchNewRewards](fetchnewrewards.md)).
* A non-2xx response throws an `Error` whose message starts with `Error calling read-only function.` and includes the status code and URL. If the node reports that the call failed, the `Error` message is the node's `cause`.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L1172-L1191)

***

### Signature

```ts
function fetchRewards(opts?: NetworkClientParam): Promise<bigint>;
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
