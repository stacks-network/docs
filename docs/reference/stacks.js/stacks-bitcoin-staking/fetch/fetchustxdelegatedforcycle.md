# fetchUstxDelegatedForCycle

Reads the total micro-STX delegated to all signer-managers for one reward cycle, from protocol bonds and STX-only staking. Wraps the pox-5 read-only `get-ustx-delegated-for-cycle`, which reads the `ustx-delegated-per-cycle` map.

***

### Usage

```ts
import { fetchPoxInfo, fetchUstxDelegatedForCycle } from '@stacks/bitcoin-staking';

const { rewardCycleId } = await fetchPoxInfo({ network: 'mainnet' });
const nextCycleUstx = await fetchUstxDelegatedForCycle({
  rewardCycle: rewardCycleId + 1,
  network: 'mainnet',
});
```

#### Notes

* `get-total-ustx-stacked` returns the same value, so [fetchTotalUstxStacked](fetchtotalustxstacked.md) does too. Its contract comment says the node's chainstate calls it by that name ([get-total-ustx-stacked](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3309-L3313)).
* Returns `0n` when the contract has no entry for the inputs.
* A non-2xx response throws an `Error` whose message starts with `Error calling read-only function.` and includes the status code and URL. If the node reports that the call failed, the `Error` message is the node's `cause`.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L1325-L1345)

***

### Signature

```ts
function fetchUstxDelegatedForCycle(
  opts: { rewardCycle: number } & NetworkClientParam
): Promise<bigint>;
```

`opts` is a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md) plus `rewardCycle`.

***

### Returns

`Promise<bigint>`

Resolves to an amount in micro-STX.

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
