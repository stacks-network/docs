# fetchProtocolBondMemberships

Reads a staker's entry in the pox-5 `protocol-bond-memberships` map directly, including an entry whose bond has ended.

***

### Usage

```ts
import { fetchProtocolBondMemberships } from '@stacks/bitcoin-staking';

const entry = await fetchProtocolBondMemberships({
  address: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
  network: 'mainnet',
});

if (entry) {
  entry.bondIndex;
  entry.amountSats; // sats, as a bigint
}
```

#### Notes

* Reads the [`protocol-bond-memberships`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L139-L148) map through the node's `/v2/map_entry` endpoint, with no expiry filter. This is the same read `unstake-sbtc` makes ([L1267-L1269](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1267-L1269)).
* [fetchBondMembership](fetchbondmembership.md) goes through `get-bond-membership` instead, which returns `none` once the bond's 12 reward cycles have passed.
* The entry stays after the bond ends. A later `register-for-bond` overwrites it, and a `stake` that rolls the bond into STX-only staking deletes it ([L1071](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1071)).
* A non-2xx response, or a response without `data`, throws an `Error` whose message starts with `Error fetching map entry for map "protocol-bond-memberships"`.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L181-L204)

***

### Signature

```ts
function fetchProtocolBondMemberships(
  opts: { address: string } & NetworkClientParam
): Promise<BondMembership | undefined>;
```

`opts` is a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md) plus `address`.

***

### Returns

`Promise<BondMembership | undefined>`

Resolves to a [BondMembership](../types/bondmembership.md), or `undefined` when the map has no entry for the address.

***

### Parameters

#### opts.address (required)

* **Type**: `string`

Stacks address of the staker, the map key. A contract principal (`<address>.<contract-name>`) is also accepted.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
