# isInPreparePhase

Returns whether a Bitcoin block height falls in the prepare phase of its reward cycle: the last `prepareCycleLength` blocks, 100 on mainnet. Pure computation that mirrors the pox-5 read-only [`is-in-prepare-phase`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2945-L2950).

***

### Usage

```ts
import { fetchPoxInfo, isInPreparePhase } from '@stacks/bitcoin-staking';

const poxInfo = await fetchPoxInfo({ network: 'mainnet' });

if (isInPreparePhase({ burnHeight: poxInfo.currentBurnchainBlockHeight, poxInfo })) {
  // wait for the next reward cycle before staking or unstaking
}
```

#### Notes

* True when `burnHeight >= rewardCycleToBurnHeight(cycle + 1) - prepareCycleLength`, where `cycle` is the reward cycle of `burnHeight`.
* The contract read-only takes a cycle and tests the chain tip. This function takes any height, which also lets you check a future height.
* `stake`, `stake-update`, `register-for-bond`, `update-bond-registration`, `announce-l1-early-exit` and `unstake-sbtc` fail in the prepare phase with `ERR_STAKE_IN_PREPARE_PHASE (u47)` through [`verify-not-prepare-phase`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2956-L2960). `unstake` fails with `ERR_UNSTAKE_IN_PREPARE_PHASE (u28)`. All of them can succeed only during the reward phase of a cycle.
* Returns `false` for a height below `poxInfo.firstBurnchainBlockHeight` instead of throwing.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/cycles.ts#L169-L183)

***

### Signature

```ts
function isInPreparePhase(opts: { burnHeight: number; poxInfo: PoxInfo }): boolean;
```

***

### Returns

`boolean`

`true` if `burnHeight` is in a prepare phase.

***

### Parameters

#### opts.burnHeight (required)

* **Type**: `number`

The Bitcoin block height to test, usually `poxInfo.currentBurnchainBlockHeight`.

#### opts.poxInfo (required)

* **Type**: `PoxInfo`

A [PoxInfo](../types/poxinfo.md), usually from [fetchPoxInfo](../fetch/fetchpoxinfo.md).
