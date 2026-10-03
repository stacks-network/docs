# fetchReserveBalance

Reads the sBTC, in sats, held for the reserve fund tranche. Wraps the pox-5 read-only `get-reserve-balance`, which returns the `reserve-balance` data-var.

***

### Usage

```ts
import { fetchReserveBalance } from '@stacks/bitcoin-staking';

const reserve = await fetchReserveBalance({ network: 'mainnet' }); // sats of sBTC, as a bigint
```

#### Notes

* Each `calculate-rewards` adds 15% ([`RESERVE_RATIO`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L107), 1,500 basis points) of the rewards left after the protocol bond tranche. When no STX is staked in the cycle, it also adds the STX-only staking tranche's part ([calculate-rewards](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2189-L2210)).
* Only `transfer-from-reserve` lowers it. That function is private and nothing in pox-5 calls it. Its comment says only the node can call it, as part of consensus through the SIP process ([transfer-from-reserve](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2692-L2713)).
* [fetchRewards](fetchrewards.md) excludes this amount.
* A non-2xx response throws an `Error` whose message starts with `Error calling read-only function.` and includes the status code and URL. If the node reports that the call failed, the `Error` message is the node's `cause`.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L1215-L1233)

***

### Signature

```ts
function fetchReserveBalance(opts?: NetworkClientParam): Promise<bigint>;
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
