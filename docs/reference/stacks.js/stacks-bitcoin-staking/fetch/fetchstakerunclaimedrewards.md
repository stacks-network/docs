# fetchStakerUnclaimedRewards

Reads the sBTC rewards, in sats, settled for a staker within a signer-manager's share of one tranche and not yet recorded as claimed. Wraps the pox-5 read-only `get-staker-unclaimed-rewards-for-cycle`, which reads the `staker-unclaimed-rewards-for-cycle` map.

***

### Usage

```ts
import { fetchStakerUnclaimedRewards, fetchPoxInfo, fetchSignerCycleMembership } from '@stacks/bitcoin-staking';

async function read(staker: string) {
  const { rewardCycleId: rewardCycle } = await fetchPoxInfo({ network: 'mainnet' });
  const membership = await fetchSignerCycleMembership({ staker, rewardCycle, network: 'mainnet' });
  if (!membership) return 0n;

  // STX-only staking tranche. Add bondIndex to read a protocol bond.
  return fetchStakerUnclaimedRewards({
    signerManager: membership.signer,
    rewardCycle,
    staker,
    network: 'mainnet',
  });
}
```

#### Notes

* `settle-staker-rewards` writes the staker's full earned amount here ([settle-staker-rewards](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2593-L2600)). `claim-staker-rewards-for-signer`, called by the signer-manager, resets it to 0 ([claim-staker-rewards-for-signer](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2452-L2459)).
* Rewards accrued since the last settlement are excluded. [fetchEarnedStakerRewards](fetchearnedstakerrewards.md) returns both parts.
* Returns `0n` when the contract has no entry for the inputs.
* A non-2xx response throws an `Error` whose message starts with `Error calling read-only function.` and includes the status code and URL. If the node reports that the call failed, the `Error` message is the node's `cause`.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L1107-L1138)

***

### Signature

```ts
function fetchStakerUnclaimedRewards(
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

Resolves to the staker's settled, unclaimed amount of sBTC in sats.

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
