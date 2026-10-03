# fetchStakerCustodiedSbtc

Reads the sBTC, in sats, that pox-5 holds for a staker's protocol bond. Wraps the pox-5 read-only `get-staker-custodied-sbtc`, which reads the `protocol-bond-memberships` map.

***

### Usage

```ts
import { fetchStakerCustodiedSbtc } from '@stacks/bitcoin-staking';

async function custodied(staker: string) {
  return fetchStakerCustodiedSbtc({ staker, network: 'mainnet' }); // sats of sBTC, as a bigint
}
```

#### Notes

* Returns the bond membership's `amount-sats`, or `0n` when the bond is an L1 lock or the staker has no membership ([get-staker-custodied-sbtc](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2962-L2975)).
* It reads the map entry without the expiry check that `get-bond-membership` applies ([get-bond-membership](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3066-L3079)), so it still reports the sBTC after the bond's term ends. [fetchProtocolBondMemberships](fetchprotocolbondmemberships.md) reads the same entry.
* `unstake-sbtc` reverts with `ERR_INVALID_UNSTAKE_SBTC_AMOUNT (u37)` when asked for more than this amount ([unstake-sbtc](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1279-L1283)). Read it before [buildUnstakeSbtc](../build/buildunstakesbtc.md).
* A non-2xx response throws an `Error` whose message starts with `Error calling read-only function.` and includes the status code and URL. If the node reports that the call failed, the `Error` message is the node's `cause`.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L1514-L1534)

***

### Signature

```ts
function fetchStakerCustodiedSbtc(
  opts: { staker: string } & NetworkClientParam
): Promise<bigint>;
```

`opts` is a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md) plus `staker`.

***

### Returns

`Promise<bigint>`

Resolves to an amount of sBTC in sats.

***

### Parameters

#### opts.staker (required)

* **Type**: `string`

Stacks address of the staker.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
