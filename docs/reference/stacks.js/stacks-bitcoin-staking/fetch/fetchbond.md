# fetchBond

Reads a protocol bond's configuration from the pox-5 `protocol-bonds` map, or returns `undefined` if `setup-bond` has not been called for that index.

***

### Usage

```ts
import { fetchBond } from '@stacks/bitcoin-staking';

const bond = await fetchBond({ bondIndex: 1, network: 'mainnet' });

if (bond) {
  bond.targetRateBps; // target rate in basis points
  bond.earlyUnlockBytes; // hex, pass to buildLockScript or fetchConstructLockupScript
}
```

#### Notes

* Reads the [`protocol-bonds`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L109-L128) map through the node's `/v2/map_entry` endpoint. [fetchProtocolBond](fetchprotocolbond.md) returns the same data through the `get-protocol-bond` read-only.
* The result has no start height or first reward cycle. Both follow from `bondIndex` and the PoX parameters: compute them with [bondPeriodToBurnHeight](../cycles/bondperiodtoburnheight.md) and [bondPeriodToRewardCycle](../cycles/bondperiodtorewardcycle.md).
* `earlyUnlockBytes` is the bond's early-unlock subscript as a hex string without a `0x` prefix. It is one of the inputs to the L1 lockup script: see [buildLockScript](../script/buildlockscript.md).
* A non-2xx response, or a response without `data`, throws an `Error` whose message starts with `Error fetching map entry for map "protocol-bonds"`.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L243-L271)

***

### Signature

```ts
function fetchBond(
  opts: { bondIndex: number } & NetworkClientParam
): Promise<Bond | undefined>;
```

`opts` is a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md) plus `bondIndex`.

***

### Returns

`Promise<Bond | undefined>`

Resolves to a [Bond](../types/bond.md), or `undefined` when the map has no entry for `bondIndex`.

***

### Parameters

#### opts.bondIndex (required)

* **Type**: `number`

Index of the protocol bond, the map key.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
