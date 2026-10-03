# fetchBondMembership

Calls the pox-5 `get-bond-membership` read-only and returns the staker's protocol bond membership, or `undefined` if the staker has no membership or its bond has ended.

***

### Usage

```ts
import { fetchBondMembership } from '@stacks/bitcoin-staking';

const membership = await fetchBondMembership({
  address: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
  network: 'mainnet',
});

if (membership) {
  membership.bondIndex;
  membership.amountSats; // sats, as a bigint
  membership.isL1Lock; // true for a Bitcoin L1 lockup, false for sBTC
}
```

#### Notes

* Reads the `protocol-bond-memberships` map through [`get-bond-membership`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3065-L3079). The contract returns `none` when no entry exists, and also once the current reward cycle reaches the bond's first reward cycle plus 12 (`BOND_LENGTH_CYCLES`). Both cases resolve to `undefined`.
* A membership for a bond that has not started yet is returned.
* To read the entry after the bond ends, use [fetchProtocolBondMemberships](fetchprotocolbondmemberships.md), which reads the map directly. `unstake-sbtc` also reads the map directly ([L1267-L1269](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1267-L1269)), without this expiry filter.
* After `announce-l1-early-exit`, the entry is still returned with `amountSats` set to `0n` ([L1235-L1237](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1235-L1237)).
* Throws an `Error` if the node returns a non-2xx status (the message starts with `Error calling read-only function.`) or answers `okay: false` (the message is the node's `cause`).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L154-L179)

***

### Signature

```ts
function fetchBondMembership(
  opts: { address: string } & NetworkClientParam
): Promise<BondMembership | undefined>;
```

`opts` is a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md) plus `address`.

***

### Returns

`Promise<BondMembership | undefined>`

Resolves to a [BondMembership](../types/bondmembership.md), or `undefined` when the contract returns `none`.

***

### Parameters

#### opts.address (required)

* **Type**: `string`

Stacks address of the staker. A contract principal (`<address>.<contract-name>`) is also accepted.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
