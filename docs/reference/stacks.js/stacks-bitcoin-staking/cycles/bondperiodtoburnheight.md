# bondPeriodToBurnHeight

Returns a bond's start height: the first Bitcoin block of its first reward cycle. Pure computation that mirrors the pox-5 read-only [`bond-period-to-burn-height`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2895-L2897).

***

### Usage

```ts
import { bondPeriodToBurnHeight, fetchPoxInfo } from '@stacks/bitcoin-staking';

const poxInfo = await fetchPoxInfo({ network: 'mainnet' });

const startHeight = bondPeriodToBurnHeight({ bondIndex: 3, poxInfo });
const blocksUntilStart = startHeight - poxInfo.currentBurnchainBlockHeight;
```

#### Notes

* Computes `rewardCycleToBurnHeight` of `bondPeriodToRewardCycle`, both from `poxInfo`.
* `register-for-bond` fails with `ERR_BOND_ALREADY_STARTED (u43)` from this height on, and `setup-bond` with `ERR_CANNOT_SETUP_BOND_TOO_LATE (u3)`.
* The bond is active above this height and up to `bondPeriodToBurnHeight` of `bondIndex + 6` inclusive. See [isBondActiveAtHeight](isbondactiveatheight.md).
* Throws an `Error` whose message starts with `pox-5 not activated yet` if `poxInfo.contractVersions` has no pox-5 entry.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/cycles.ts#L87-L98)

***

### Signature

```ts
function bondPeriodToBurnHeight(opts: { bondIndex: number; poxInfo: PoxInfo }): number;
```

***

### Returns

`number`

The Bitcoin block height at which the bond starts.

***

### Parameters

#### opts.bondIndex (required)

* **Type**: `number`

The bond index.

#### opts.poxInfo (required)

* **Type**: `PoxInfo`

A [PoxInfo](../types/poxinfo.md), usually from [fetchPoxInfo](../fetch/fetchpoxinfo.md).
