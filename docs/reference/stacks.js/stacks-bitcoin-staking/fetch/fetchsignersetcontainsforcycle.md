# fetchSignerSetContainsForCycle

Checks whether a signer-manager is in the signer set for one reward cycle. Wraps the pox-5 read-only `signer-set-contains-for-cycle`, which reads the `signer-set-ll-for-cycle` map.

***

### Usage

```ts
import { fetchPoxInfo, fetchSignerSetContainsForCycle } from '@stacks/bitcoin-staking';

async function inNextSignerSet(signer: string) {
  const { rewardCycleId } = await fetchPoxInfo({ network: 'mainnet' });
  return fetchSignerSetContainsForCycle({ signer, rewardCycle: rewardCycleId + 1, network: 'mainnet' });
}
```

#### Notes

* pox-5 stores each reward cycle's signer set as a doubly linked list of signer-manager principals ([signer-set maps](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3367-L3390)). A signer-manager is appended at the tail when the total STX staked to it for the cycle reaches 50,000 STX (`SIGNER_SET_MIN_USTX`, 50,000,000,000 micro-STX) and is unlinked when that total falls below ([SIGNER\_SET\_MIN\_USTX](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L82), [add-staker-to-signer-for-cycle](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1705-L1717), [remove-staker-from-signer-for-cycle](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1546-L1551)).
* Returns `true` when the signer-manager has a node in the cycle's list ([signer-set-contains-for-cycle](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3436-L3444)).
* A non-2xx response throws an `Error` whose message starts with `Error calling read-only function.` and includes the status code and URL. If the node reports that the call failed, the `Error` message is the node's `cause`.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L1379-L1398)

***

### Signature

```ts
function fetchSignerSetContainsForCycle(
  opts: { signer: string; rewardCycle: number } & NetworkClientParam
): Promise<boolean>;
```

`opts` is a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md) plus `signer` and `rewardCycle`.

***

### Returns

`Promise<boolean>`

Resolves to `true` if the signer-manager is in the cycle's signer set.

***

### Parameters

#### opts.signer (required)

* **Type**: `string`

Contract principal of the signer-manager, in the form `<address>.<contract-name>`.

#### opts.rewardCycle (required)

* **Type**: `number`

Reward cycle to read.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
