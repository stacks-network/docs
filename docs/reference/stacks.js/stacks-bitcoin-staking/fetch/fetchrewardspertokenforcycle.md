# fetchRewardsPerTokenForCycle

Reads the contract-wide rewards-per-token accumulator for one tranche of one reward cycle. Wraps the pox-5 read-only `get-rewards-per-token-for-cycle`, which reads the `rewards-per-token-for-cycle` map.

***

### Usage

```ts
import { fetchPoxInfo, fetchRewardsPerTokenForCycle } from '@stacks/bitcoin-staking';

const { rewardCycleId: rewardCycle } = await fetchPoxInfo({ network: 'mainnet' });

// STX-only staking tranche. Add bondIndex to read a protocol bond.
const rpt = await fetchRewardsPerTokenForCycle({ rewardCycle, network: 'mainnet' });
```

#### Notes

* Only `calculate-rewards` raises it: for the STX-only staking tranche ([calculate-rewards](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2216-L2221)) and for each bond it pays ([calculate-bond-rewards](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2304-L2309)). It never decreases ([rewards-per-token-for-cycle](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L247-L255)).
* The value is scaled by 10^18 ([`PRECISION`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L103)): sats of sBTC per share, times 10^18. A share is one sat in the protocol bond tranche and one micro-STX in the STX-only staking tranche.
* A signer-manager's snapshots of this value are [fetchSignerRewardsPerTokenSettled](fetchsignerrewardspertokensettled.md) and [fetchSignerRewardsPerTokenForCycle](fetchsignerrewardspertokenforcycle.md).
* Returns `0n` when the contract has no entry for the inputs.
* A non-2xx response throws an `Error` whose message starts with `Error calling read-only function.` and includes the status code and URL. If the node reports that the call failed, the `Error` message is the node's `cause`.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L1256-L1279)

***

### Signature

```ts
function fetchRewardsPerTokenForCycle(
  opts: { rewardCycle: number; bondIndex?: number } & NetworkClientParam
): Promise<bigint>;
```

`opts` is a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md) plus `rewardCycle` and `bondIndex`.

***

### Returns

`Promise<bigint>`

Resolves to the accumulator value, scaled by 10^18.

***

### Parameters

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
