# fetchEarnedStakerRewards

Reads one staker's earned sBTC rewards, in sats, within a signer-manager's share of one tranche of one reward cycle. Wraps the pox-5 read-only `get-earned-staker-rewards`.

***

### Usage

```ts
import {
  fetchBondMembership,
  fetchEarnedStakerRewards,
  fetchPoxInfo,
  fetchSignerCycleMembership,
} from '@stacks/bitcoin-staking';

async function stakerEarned(staker: string) {
  const { rewardCycleId: rewardCycle } = await fetchPoxInfo({ network: 'mainnet' });
  const membership = await fetchSignerCycleMembership({ staker, rewardCycle, network: 'mainnet' });
  if (!membership) return 0n;

  const bond = await fetchBondMembership({ address: staker, network: 'mainnet' });
  return fetchEarnedStakerRewards({
    signerManager: membership.signer,
    rewardCycle,
    bondIndex: bond?.bondIndex, // undefined reads the STX-only staking tranche
    staker,
    network: 'mainnet',
  });
}
```

#### Notes

* `get-earned-staker-rewards` returns `stakerShares * (signerRewardsPerToken - stakerSettled) / 10^18 + stakerUnclaimed` ([get-earned-staker-rewards](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2358-L2373)). The inputs are [fetchStakerSharesStakedForCycle](fetchstakersharesstakedforcycle.md), [fetchSignerRewardsPerTokenForCycle](fetchsignerrewardspertokenforcycle.md), [fetchStakerRewardsPerTokenSettled](fetchstakerrewardspertokensettled.md) and [fetchStakerUnclaimedRewards](fetchstakerunclaimedrewards.md).
* The staker's rewards accrue against the signer-manager's recorded rewards-per-token, so they grow only when the signer-manager's tranche is settled, for example by `claim-rewards`.
* pox-5 transfers no sBTC to stakers. `claim-rewards` pays the signer-manager contract ([claim-rewards](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2409-L2416)), and `claim-staker-rewards-for-signer`, called by the signer-manager, records the staker's claim by resetting the staker's unclaimed counter ([claim-staker-rewards-for-signer](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2444-L2470)). How a signer-manager pays its stakers depends on its contract.
* The amount is sBTC in sats for both tranches.
* Returns `0n` when the contract has no entry for the inputs.
* A non-2xx response throws an `Error` whose message starts with `Error calling read-only function.` and includes the status code and URL. If the node reports that the call failed, the `Error` message is the node's `cause`.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L1041-L1071)

***

### Signature

```ts
function fetchEarnedStakerRewards(
  opts: {
    signerManager: string;
    rewardCycle: number;
    bondIndex?: number;
    staker: string;
  } & NetworkClientParam
): Promise<bigint>;
```

`opts` is a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md) plus `signerManager`, `rewardCycle`, `bondIndex` and `staker`.

***

### Returns

`Promise<bigint>`

Resolves to the staker's earned amount of sBTC in sats.

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

#### opts.staker (required)

* **Type**: `string`

Stacks address of the staker.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
