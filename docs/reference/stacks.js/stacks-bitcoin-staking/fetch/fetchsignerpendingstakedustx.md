# fetchSignerPendingStakedUstx

Reads the micro-STX staked to a signer-manager through STX-only staking for one reward cycle. Wraps the pox-5 read-only `get-signer-pending-staked-ustx-per-cycle`, which reads the `signer-pending-staked-ustx-per-cycle` map.

***

### Usage

```ts
import { fetchSignerPendingStakedUstx, fetchPoxInfo, fetchSignerSetFirstItem } from '@stacks/bitcoin-staking';

const { rewardCycleId: rewardCycle } = await fetchPoxInfo({ network: 'mainnet' });
// Any signer-manager in this cycle's signer set
const signerManager = await fetchSignerSetFirstItem({ rewardCycle, network: 'mainnet' });

if (signerManager) {
  const ustx = await fetchSignerPendingStakedUstx({ signerManager, rewardCycle, network: 'mainnet' });
}
```

#### Notes

* Counts STX-only staking only. STX locked with a protocol bond adds 0 here ([add-staker-to-signer-for-cycle](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1683-L1686)).
* The value is tracked whether or not the signer-manager is in the signer set. The signer-manager's reward shares in the STX-only staking tranche ([fetchSignerSharesStakedForCycle](fetchsignersharesstakedforcycle.md)) are set from it only once its total delegation reaches 50,000 STX (`SIGNER_SET_MIN_USTX`, 50,000,000,000 micro-STX) ([SIGNER\_SET\_MIN\_USTX](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L82), [add-staker-to-signer-for-cycle](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1705-L1713)). The contract comment says not to use this value for reward calculations ([signer-pending-staked-ustx-per-cycle](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L203-L215)).
* Returns `0n` when the contract has no entry for the inputs.
* A non-2xx response throws an `Error` whose message starts with `Error calling read-only function.` and includes the status code and URL. If the node reports that the call failed, the `Error` message is the node's `cause`.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L1281-L1301)

***

### Signature

```ts
function fetchSignerPendingStakedUstx(
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
