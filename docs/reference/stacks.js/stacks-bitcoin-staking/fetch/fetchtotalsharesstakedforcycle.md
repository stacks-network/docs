# fetchTotalSharesStakedForCycle

Calls the pox-5 `get-total-shares-staked-for-cycle` read-only and returns the total shares in one reward cycle: sats for a protocol bond, micro-STX for STX-only staking.

***

### Usage

```ts
import { fetchPoxInfo, fetchTotalSharesStakedForCycle } from '@stacks/bitcoin-staking';

const { rewardCycleId } = await fetchPoxInfo({ network: 'mainnet' });

// STX-only staking: micro-STX
const ustx = await fetchTotalSharesStakedForCycle({ rewardCycle: rewardCycleId });

// Protocol bond 1: sats
const sats = await fetchTotalSharesStakedForCycle({ rewardCycle: rewardCycleId, bondIndex: 1 });
```

#### Notes

* Reads the [`total-shares-staked-for-cycle`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L257-L265) map through [`get-total-shares-staked-for-cycle`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3160-L3170). Returns `0n` when there is no entry.
* With `bondIndex` the value is sats; without it the value is micro-STX. The SDK sends `bondIndex` as `(some u<bondIndex>)`, or `none` when you omit it.
* This is the denominator pox-5 divides each cycle's rewards by, for the STX-only staking tranche ([L2192-L2200](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2192-L2200)) and for each protocol bond ([L2262](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2262), [L2276-L2279](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2276-L2279)).
* `register-for-bond`, `stake` and `stake-update` add to it; `unstake`, `unstake-sbtc` and `announce-l1-early-exit` subtract from it. For a per-bond figure that `register-for-bond` records, see [fetchTotalSbtcStakedForBond](fetchtotalsbtcstakedforbond.md).
* The micro-STX figure excludes STX locked in protocol bonds. It counts STX-only staking only for signer-managers with at least 50,000,000,000 micro-STX (50,000 STX, `SIGNER_SET_MIN_USTX`) delegated in that cycle ([L1705-L1732](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1705-L1732)). For all micro-STX delegated in a cycle, use [fetchTotalUstxStacked](fetchtotalustxstacked.md).
* Throws an `Error` if the node returns a non-2xx status (the message starts with `Error calling read-only function.`) or answers `okay: false` (the message is the node's `cause`).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L439-L472)

***

### Signature

```ts
function fetchTotalSharesStakedForCycle(
  opts: { rewardCycle: number; bondIndex?: number } & NetworkClientParam
): Promise<bigint>;
```

`opts` is a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md) plus the fields below.

***

### Returns

`Promise<bigint>`

Total shares for the cycle: sats when `bondIndex` is set, micro-STX when it is omitted.

***

### Parameters

#### opts.rewardCycle (required)

* **Type**: `number`

Reward cycle to read.

#### opts.bondIndex (optional)

* **Type**: `number`

Protocol bond index. Set it to read the bond's sats total; omit it to read the micro-STX total for STX-only staking.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
