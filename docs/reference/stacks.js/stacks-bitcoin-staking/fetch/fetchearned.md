# fetchEarned

Reads the sBTC rewards, in sats, that a signer-manager can claim for one tranche of one reward cycle. Wraps the pox-5 read-only `get-earned`.

***

### Usage

```ts
import { fetchEarned, fetchPoxInfo, fetchSignerSetFirstItem } from '@stacks/bitcoin-staking';

const { rewardCycleId: rewardCycle } = await fetchPoxInfo({ network: 'mainnet' });
// Any signer-manager in this cycle's signer set
const signerManager = await fetchSignerSetFirstItem({ rewardCycle, network: 'mainnet' });

if (signerManager) {
  // STX-only staking tranche. Add bondIndex to read a protocol bond.
  const value = await fetchEarned({ signerManager, rewardCycle, network: 'mainnet' });
}
```

#### Notes

* `get-earned` returns `shares * (rewardsPerToken - rewardsPerTokenSettled) / 10^18 + unclaimed` for the signer-manager's share of the tranche ([get-earned](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2341-L2354), [compute-earned-rewards](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2378-L2385)). `claim-rewards` settles with the same formula, so this is the amount it pays for this tranche at the current chain state ([settle-rewards](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2530-L2574)).
* The amount is sBTC in sats for both tranches. pox-5 pays it to the signer-manager contract in sBTC ([claim-rewards](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2409-L2416)).
* The value grows when `calculate-rewards` raises the tranche's rewards-per-token accumulator. [fetchLastRewardComputeHeight](fetchlastrewardcomputeheight.md) tells you whether the current distribution cycle has been calculated.
* `claim-rewards` sums the STX-only staking tranche and the bonds passed to it, and reverts with `ERR_NO_CLAIMABLE_REWARDS (u32)` when the sum is 0 ([claim-rewards](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2408)). Read this before [buildClaimRewards](../build/buildclaimrewards.md) to skip an empty claim or to bound a post condition. The amount can change between the read and the broadcast.
* The amount belongs to the signer-manager. For one staker's part, use [fetchEarnedStakerRewards](fetchearnedstakerrewards.md).
* Returns `0n` when the contract has no entry for the inputs.
* A non-2xx response throws an `Error` whose message starts with `Error calling read-only function.` and includes the status code and URL. If the node reports that the call failed, the `Error` message is the node's `cause`.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L916-L944)

***

### Signature

```ts
function fetchEarned(
  opts: {
    signerManager: string;
    rewardCycle: number;
    bondIndex?: number;
  } & NetworkClientParam
): Promise<EarnedRewards>;
```

`opts` is a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md) plus `signerManager`, `rewardCycle` and `bondIndex`.

***

### Returns

`Promise<EarnedRewards>`

Resolves to an [EarnedRewards](../types/earnedrewards.md): a `bigint` amount of sBTC in sats.

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
