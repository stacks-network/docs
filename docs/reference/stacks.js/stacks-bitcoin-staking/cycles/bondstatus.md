# bondStatus

Classifies a bond at `poxInfo.currentBurnchainBlockHeight`, including bonds that were never set up. Pure computation: you supply whether `setup-bond` has run. [fetchBondStatus](../fetch/fetchbondstatus.md) is the variant that fetches it.

***

### Usage

```ts
import { bondStatus, fetchPoxInfo, fetchProtocolBond } from '@stacks/bitcoin-staking';

const poxInfo = await fetchPoxInfo({ network: 'mainnet' });
const bondIndex = 0;

const bond = await fetchProtocolBond({ bondIndex, network: 'mainnet' });
const status = bondStatus({ bondIndex, poxInfo, isBondSetup: bond !== undefined });
```

#### Notes

* With `start` = [bondPeriodToBurnHeight](bondperiodtoburnheight.md), `end` = `start + 12 * rewardCycleLength` and `height` = `poxInfo.currentBurnchainBlockHeight`:

| `isBondSetup` | Condition                                     | Result        |
| ------------- | --------------------------------------------- | ------------- |
| `false`       | `height < start - 2 * rewardCycleLength`      | `'too-early'` |
| `false`       | `height < start`                              | `'eligible'`  |
| `false`       | otherwise                                     | `'missed'`    |
| `true`        | `height < start - prepareCycleLength`         | `'open'`      |
| `true`        | `height < end - floor(rewardCycleLength / 2)` | `'locked'`    |
| `true`        | `height <= end`                               | `'unlocked'`  |
| `true`        | otherwise                                     | `'finished'`  |

* Set-up results match the ranges from [bondPhaseRanges](bondphaseranges.md), except that `'finished'` has no upper bound.
* `'open'` means bond timing allows registration. The prepare phase of the cycle two before the start falls inside it, and `register-for-bond` fails there with `ERR_STAKE_IN_PREPARE_PHASE (u47)`. Check with [isInPreparePhase](isinpreparephase.md).
* Throws an `Error` whose message starts with `pox-5 not activated yet` if `poxInfo.contractVersions` has no pox-5 entry.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/cycles.ts#L342-L389)

***

### Signature

```ts
function bondStatus(opts: {
  bondIndex: number;
  poxInfo: PoxInfo;
  isBondSetup: boolean;
}): BondStatusName;
```

***

### Returns

`BondStatusName`

A [BondStatusName](bondstatusname.md).

***

### Parameters

#### opts.bondIndex (required)

* **Type**: `number`

The bond index.

#### opts.poxInfo (required)

* **Type**: `PoxInfo`

A [PoxInfo](../types/poxinfo.md), usually from [fetchPoxInfo](../fetch/fetchpoxinfo.md). The status is computed at its `currentBurnchainBlockHeight`.

#### opts.isBondSetup (required)

* **Type**: `boolean`

Whether `setup-bond` has run for this bond: `true` when [fetchProtocolBond](../fetch/fetchprotocolbond.md) returns a bond, `false` when it returns `undefined`.
