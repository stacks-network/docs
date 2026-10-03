# fetchTotalUstxStacked

Calls the pox-5 `get-total-ustx-stacked` read-only and returns the micro-STX delegated in a reward cycle, from protocol bonds and STX-only staking combined.

***

### Usage

```ts
import { fetchPoxInfo, fetchTotalUstxStacked } from '@stacks/bitcoin-staking';

const { rewardCycleId } = await fetchPoxInfo({ network: 'mainnet' });

const totalUstx = await fetchTotalUstxStacked({ rewardCycle: rewardCycleId, network: 'mainnet' }); // micro-STX, as a bigint
```

#### Notes

* [`get-total-ustx-stacked`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3309-L3313) returns `get-ustx-delegated-for-cycle`, which reads the [`ustx-delegated-per-cycle`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L240-L245) map. Returns `0n` when there is no entry. [fetchUstxDelegatedForCycle](fetchustxdelegatedforcycle.md) reads the same value.
* The total includes every staker added to a signer-manager for the cycle, whether or not that signer-manager reached the signer set minimum ([L1769-L1772](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1769-L1772)). For the micro-STX that STX-only staking rewards are divided by, use [fetchTotalSharesStakedForCycle](fetchtotalsharesstakedforcycle.md).
* Throws an `Error` if the node returns a non-2xx status (the message starts with `Error calling read-only function.`) or answers `okay: false` (the message is the node's `cause`).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L824-L843)

***

### Signature

```ts
function fetchTotalUstxStacked(
  opts: { rewardCycle: number } & NetworkClientParam
): Promise<bigint>;
```

`opts` is a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md) plus `rewardCycle`.

***

### Returns

`Promise<bigint>`

Total micro-STX delegated for the cycle.

***

### Parameters

#### opts.rewardCycle (required)

* **Type**: `number`

Reward cycle to read.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
