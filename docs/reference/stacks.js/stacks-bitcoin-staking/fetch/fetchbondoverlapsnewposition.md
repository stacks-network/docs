# fetchBondOverlapsNewPosition

Checks whether a staker's existing bond membership overlaps a new position that starts at a given reward cycle. Wraps the pox-5 read-only `bond-overlaps-new-position?`.

***

### Usage

```ts
import {
  fetchBondOverlapsNewPosition,
  fetchPoxInfo,
  fetchProtocolBondMemberships,
} from '@stacks/bitcoin-staking';

async function bondBlocksStakeNextCycle(staker: string) {
  const { rewardCycleId } = await fetchPoxInfo({ network: 'mainnet' });
  const membership = await fetchProtocolBondMemberships({ address: staker, network: 'mainnet' });
  return fetchBondOverlapsNewPosition({
    membership,
    newFirstRewardCycle: rewardCycleId + 1, // stake starts at the next cycle
    network: 'mainnet',
  });
}
```

#### Notes

* Returns `true` when the bond's first reward cycle plus 12 (`BOND_LENGTH_CYCLES`) is greater than `newFirstRewardCycle`, and `false` when `membership` is `undefined` ([bond-overlaps-new-position?](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2983-L3002)). Only `membership.bondIndex` affects the result.
* `register-for-bond` reverts with `ERR_ALREADY_REGISTERED (u9)` on overlap ([register-for-bond](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L767-L770)), and `stake` reverts with `ERR_ALREADY_STAKED (u19)` ([stake](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1033-L1036)). `stake` starts at the next reward cycle ([stake](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L986)).
* Both functions pass the raw `protocol-bond-memberships` entry ([L679](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L679), [L993](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L993)), which [fetchProtocolBondMemberships](fetchprotocolbondmemberships.md) returns.
* A non-2xx response throws an `Error` whose message starts with `Error calling read-only function.` and includes the status code and URL. If the node reports that the call failed, the `Error` message is the node's `cause`.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L1536-L1570)

***

### Signature

```ts
function fetchBondOverlapsNewPosition(
  opts: {
    membership: BondMembership | undefined;
    newFirstRewardCycle: number;
  } & NetworkClientParam
): Promise<boolean>;
```

`opts` is a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md) plus `membership` and `newFirstRewardCycle`.

***

### Returns

`Promise<boolean>`

Resolves to `true` if the membership overlaps the new position.

***

### Parameters

#### opts.membership (required)

* **Type**: `BondMembership | undefined`

The staker's existing [BondMembership](../types/bondmembership.md), or `undefined` for none.

#### opts.newFirstRewardCycle (required)

* **Type**: `number`

First reward cycle of the new position.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
