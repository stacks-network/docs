# fetchSignerSetNextItem

Reads the signer-manager after a given one in a reward cycle's signer set. Wraps the pox-5 read-only `get-signer-set-next-item-for-cycle`, which reads the `signer-set-ll-for-cycle` map.

***

### Usage

```ts
import { fetchPoxInfo, fetchSignerSetFirstItem, fetchSignerSetNextItem } from '@stacks/bitcoin-staking';

const { rewardCycleId: rewardCycle } = await fetchPoxInfo({ network: 'mainnet' });

const signers: string[] = [];
let signer = await fetchSignerSetFirstItem({ rewardCycle, network: 'mainnet' });
while (signer) {
  signers.push(signer);
  signer = await fetchSignerSetNextItem({ signer, rewardCycle, network: 'mainnet' });
}
```

#### Notes

* pox-5 stores each reward cycle's signer set as a doubly linked list of signer-manager principals ([signer-set maps](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3367-L3390)). A signer-manager is appended at the tail when its total delegation for the cycle reaches 50,000 STX (`SIGNER_SET_MIN_USTX`, 50,000,000,000 micro-STX) and is unlinked when it falls below ([SIGNER\_SET\_MIN\_USTX](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L82), [add-staker-to-signer-for-cycle](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1705-L1717), [remove-staker-from-signer-for-cycle](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1546-L1551)).
* Resolves to `undefined` at the tail of the list and when `signer` is not in the set ([get-signer-set-next-item-for-cycle](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3410-L3421)). Use [fetchSignerSetContainsForCycle](fetchsignersetcontainsforcycle.md) to tell the two apart.
* A non-2xx response throws an `Error` whose message starts with `Error calling read-only function.` and includes the status code and URL. If the node reports that the call failed, the `Error` message is the node's `cause`.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L1453-L1467)

***

### Signature

```ts
function fetchSignerSetNextItem(
  opts: { signer: string; rewardCycle: number } & NetworkClientParam
): Promise<string | undefined>;
```

`opts` is a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md) plus `signer` and `rewardCycle`.

***

### Returns

`Promise<string | undefined>`

Resolves to the contract principal of the next signer-manager, or `undefined`.

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
