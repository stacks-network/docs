# fetchSignerRewardsPerTokenSettled

Reads the rewards-per-token value at which a signer-manager's share of one tranche was last settled. Wraps the pox-5 read-only `get-signer-rewards-per-token-settled-for-cycle`, which reads the `signer-rewards-per-token-settled-for-cycle` map.

***

### Usage

```ts
import {
  fetchPoxInfo,
  fetchRewardsPerTokenForCycle,
  fetchSignerRewardsPerTokenSettled,
  fetchSignerSetFirstItem,
  fetchSignerSharesStakedForCycle,
  fetchSignerUnclaimedRewards,
} from '@stacks/bitcoin-staking';

const { rewardCycleId: rewardCycle } = await fetchPoxInfo({ network: 'mainnet' });
const signerManager = await fetchSignerSetFirstItem({ rewardCycle, network: 'mainnet' });

if (signerManager) {
  // STX-only staking tranche. Add bondIndex to read a protocol bond.
  const q = { signerManager, rewardCycle, network: 'mainnet' as const };
  const [shares, rpt, settled, unclaimed] = await Promise.all([
    fetchSignerSharesStakedForCycle(q),
    fetchRewardsPerTokenForCycle({ rewardCycle, network: 'mainnet' }),
    fetchSignerRewardsPerTokenSettled(q),
    fetchSignerUnclaimedRewards(q),
  ]);
  // Same formula as get-earned
  const earned = (shares * (rpt - settled)) / 10n ** 18n + unclaimed;
}
```

#### Notes

* `settle-rewards` sets it to the tranche's current [fetchRewardsPerTokenForCycle](fetchrewardspertokenforcycle.md) value ([settle-rewards](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2552-L2558)).
* Rewards accrued since the last settlement are `shares * (rewardsPerToken - settled) / 10^18`, the first term of the `get-earned` formula ([compute-earned-rewards](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2378-L2385)).
* The value is scaled by 10^18 ([`PRECISION`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L103)): sats of sBTC per share, times 10^18. A share is one sat in the protocol bond tranche and one micro-STX in the STX-only staking tranche.
* Returns `0n` when the contract has no entry for the inputs.
* A non-2xx response throws an `Error` whose message starts with `Error calling read-only function.` and includes the status code and URL. If the node reports that the call failed, the `Error` message is the node's `cause`.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L978-L1008)

***

### Signature

```ts
function fetchSignerRewardsPerTokenSettled(
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

Resolves to the settled rewards-per-token value, scaled by 10^18.

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
