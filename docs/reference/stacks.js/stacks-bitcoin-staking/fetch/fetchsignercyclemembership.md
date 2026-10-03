# fetchSignerCycleMembership

Reads which signer-manager a staker is assigned to in one reward cycle, and the micro-STX counted for that assignment. Wraps the pox-5 read-only `get-signer-cycle-membership`, which reads the `staker-signer-cycle-memberships` map.

***

### Usage

```ts
import { fetchPoxInfo, fetchSignerCycleMembership } from '@stacks/bitcoin-staking';

async function signerFor(staker: string) {
  const { rewardCycleId: rewardCycle } = await fetchPoxInfo({ network: 'mainnet' });
  const membership = await fetchSignerCycleMembership({ staker, rewardCycle, network: 'mainnet' });
  return membership?.signer; // signer-manager contract principal, or undefined
}
```

#### Notes

* pox-5 writes an entry for every cycle of a position, for STX-only staking and for protocol bonds: `stake`, `stake-update`, `register-for-bond` and `update-bond-registration` all add it ([add-staker-to-signer-for-cycle](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1739-L1745), called at [L803](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L803-L805), [L907](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L907), [L1056](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1056) and [L1146](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1146)).
* Pass `signer` as `signerManager` to the staker reward reads such as [fetchEarnedStakerRewards](fetchearnedstakerrewards.md).
* Resolves to `undefined` when the staker has no entry for the cycle ([get-signer-cycle-membership](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3134-L3142)).
* A non-2xx response throws an `Error` whose message starts with `Error calling read-only function.` and includes the status code and URL. If the node reports that the call failed, the `Error` message is the node's `cause`.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L1353-L1377)

***

### Signature

```ts
function fetchSignerCycleMembership(
  opts: { staker: string; rewardCycle: number } & NetworkClientParam
): Promise<{ amountUstx: bigint; signer: string } | undefined>;
```

`opts` is a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md) plus `staker` and `rewardCycle`.

***

### Returns

`Promise<{ amountUstx: bigint; signer: string } | undefined>`

Resolves to the membership, or `undefined` when there is none.

| Field        | Type     | Meaning                                                             |
| ------------ | -------- | ------------------------------------------------------------------- |
| `amountUstx` | `bigint` | micro-STX the staker delegated to the signer-manager for this cycle |
| `signer`     | `string` | Contract principal of the signer-manager                            |

***

### Parameters

#### opts.staker (required)

* **Type**: `string`

Stacks address of the staker.

#### opts.rewardCycle (required)

* **Type**: `number`

Reward cycle to read.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
