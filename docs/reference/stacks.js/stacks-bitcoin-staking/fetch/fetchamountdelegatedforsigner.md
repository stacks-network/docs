# fetchAmountDelegatedForSigner

Reads the total micro-STX delegated to a signer-manager for one reward cycle, from protocol bonds and STX-only staking. Wraps the pox-5 read-only `get-amount-delegated-for-signer`, which reads the `signer-delegated-per-cycle` map.

***

### Usage

```ts
import { fetchAmountDelegatedForSigner, fetchPoxInfo, fetchSignerSetFirstItem } from '@stacks/bitcoin-staking';

const { rewardCycleId: rewardCycle } = await fetchPoxInfo({ network: 'mainnet' });
// Any signer-manager in this cycle's signer set
const signerManager = await fetchSignerSetFirstItem({ rewardCycle, network: 'mainnet' });

if (signerManager) {
  const ustx = await fetchAmountDelegatedForSigner({ signerManager, rewardCycle, network: 'mainnet' });
}
```

#### Notes

* The contract comment says this value should determine signer weight when approving blocks ([signer-delegated-per-cycle](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L191-L201)).
* A signer-manager joins the cycle's signer set when this reaches 50,000 STX (`SIGNER_SET_MIN_USTX`, 50,000,000,000 micro-STX) and leaves it when it falls below ([SIGNER\_SET\_MIN\_USTX](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L82), [add-staker-to-signer-for-cycle](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1705-L1717), [remove-staker-from-signer-for-cycle](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1546-L1551)). [fetchSignerSetContainsForCycle](fetchsignersetcontainsforcycle.md) reads the membership directly.
* Returns `0n` when the contract has no entry for the inputs.
* A non-2xx response throws an `Error` whose message starts with `Error calling read-only function.` and includes the status code and URL. If the node reports that the call failed, the `Error` message is the node's `cause`.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L1303-L1323)

***

### Signature

```ts
function fetchAmountDelegatedForSigner(
  opts: { signerManager: string; rewardCycle: number } & NetworkClientParam
): Promise<bigint>;
```

`opts` is a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md) plus `signerManager` and `rewardCycle`.

***

### Returns

`Promise<bigint>`

Resolves to an amount in micro-STX.

***

### Parameters

#### opts.signerManager (required)

* **Type**: `string`

Contract principal of the signer-manager, in the form `<address>.<contract-name>`. pox-5 keys signer state by this principal.

#### opts.rewardCycle (required)

* **Type**: `number`

Reward cycle to read.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
