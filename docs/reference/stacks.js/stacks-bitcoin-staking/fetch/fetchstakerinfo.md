# fetchStakerInfo

Calls the pox-5 `get-staker-info` read-only and returns the address's current STX-only stake, or `{ staked: false }` if it has none.

***

### Usage

```ts
import { fetchStakerInfo } from '@stacks/bitcoin-staking';

const info = await fetchStakerInfo({
  address: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
  network: 'mainnet',
});

if (info.staked) {
  info.details.amountUstx; // locked micro-STX, as a bigint
  info.details.firstRewardCycle;
  info.details.numCycles;
  info.details.signer; // signer-manager contract the stake is delegated to
}
```

#### Notes

* Reads the `staker-info` map through [`get-staker-info`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3097-L3113). The contract returns `none` both when no entry exists and when the stake has expired (`first-reward-cycle + num-cycles` is at or before the current reward cycle). Both cases resolve to `{ staked: false }`.
* Covers STX-only staking. A protocol bond membership is a separate record: read it with [fetchBondMembership](fetchbondmembership.md). A `register-for-bond` that rolls an STX-only stake into a bond deletes the `staker-info` entry ([L812-L815](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L812-L815)).
* After a successful `unstake`, this still returns `staked: true` until the next reward cycle starts. `unstake` shortens `num-cycles` so the stake ends at that cycle ([L1451-L1456](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1451-L1456)).
* Throws an `Error` if the node returns a non-2xx status (the message starts with `Error calling read-only function.`) or answers `okay: false` (the message is the node's `cause`).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L80-L116)

***

### Signature

```ts
function fetchStakerInfo(
  opts: { address: string } & NetworkClientParam
): Promise<StakerInfo>;
```

`opts` is a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md) plus `address`.

***

### Returns

`Promise<StakerInfo>`

Resolves to a [StakerInfo](../types/stakerinfo.md): `{ staked: false }`, or `{ staked: true, details }` where `details` is a [StakerInfoDetails](../types/stakerinfodetails.md).

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
