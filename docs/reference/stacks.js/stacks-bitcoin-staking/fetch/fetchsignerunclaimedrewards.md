# fetchSignerUnclaimedRewards

Reads the sBTC rewards, in sats, that pox-5 has settled for a signer-manager in one tranche of one reward cycle and that the signer-manager has not claimed. Wraps the pox-5 read-only `get-signer-unclaimed-rewards-for-cycle`, which reads the `signer-unclaimed-rewards-for-cycle` map.

***

### Usage

```ts
import { fetchSignerUnclaimedRewards, fetchPoxInfo, fetchSignerSetFirstItem } from '@stacks/bitcoin-staking';

const { rewardCycleId: rewardCycle } = await fetchPoxInfo({ network: 'mainnet' });
// Any signer-manager in this cycle's signer set
const signerManager = await fetchSignerSetFirstItem({ rewardCycle, network: 'mainnet' });

if (signerManager) {
  // STX-only staking tranche. Add bondIndex to read a protocol bond.
  const value = await fetchSignerUnclaimedRewards({ signerManager, rewardCycle, network: 'mainnet' });
}
```

#### Notes

* `settle-rewards` writes the signer-manager's full earned amount here and moves its settled snapshot forward ([settle-rewards](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2530-L2574)). pox-5 settles a tranche before it changes the signer-manager's shares, for example when a staker joins or leaves ([add-staker-to-signer-for-cycle](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1663-L1784), [remove-staker-from-signer-for-cycle](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1504-L1618)).
* `claim-rewards` settles the tranche and then resets this value to 0 ([update-claimable-rewards](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2476-L2493)).
* Rewards accrued since the last settlement are excluded. [fetchEarned](fetchearned.md) returns both parts.
* Returns `0n` when the contract has no entry for the inputs.
* A non-2xx response throws an `Error` whose message starts with `Error calling read-only function.` and includes the status code and URL. If the node reports that the call failed, the `Error` message is the node's `cause`.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L946-L976)

***

### Signature

```ts
function fetchSignerUnclaimedRewards(
  opts: {
    signerManager: string;
    rewardCycle: number;
    bondIndex?: number;
  } & NetworkClientParam
): Promise<bigint>;
```

`opts` is a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md) plus `signerManager`, `rewardCycle` and `bondIndex`.

***

### Returns

`Promise<bigint>`

Resolves to the settled, unclaimed amount of sBTC in sats.

***

### Parameters

#### opts.signerManager (required)

* **Type**: `string`

Contract principal of the signer-manager, in the form `<address>.<contract-name>`. pox-5 keys signer state by this principal.

#### opts.rewardCycle (required)

* **Type**: `number`

Reward cycle to read.

#### opts.bondIndex (optional)

* **Type**: `number`

Protocol bond index. Set it to read that bond in the protocol bond tranche. Omit it to read the STX-only staking tranche.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
