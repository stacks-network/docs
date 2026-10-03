# computeBondUnlockHeight

Computes the minimum L1 unlock height for a paired-BTC bond: half a reward cycle before the bond's term ends. Pure computation from a [PoxInfo](../types/poxinfo.md), mirroring pox-5's `get-bond-l1-unlock-height`.

***

### Usage

```ts
import { computeBondUnlockHeight, fetchPoxInfo } from '@stacks/bitcoin-staking';

const poxInfo = await fetchPoxInfo({ network: 'mainnet' });

const unlockHeight = computeBondUnlockHeight({ bondIndex: 2, poxInfo });
// 994700 on mainnet
```

#### Notes

* The formula is `bondPeriodToBurnHeight(bondIndex + 6) - floor(rewardCycleLength / 2)`, as in [get-bond-l1-unlock-height](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3340-L3346). On mainnet, bond 2's term ends at Bitcoin block 995,750 and its L1 unlock height is 994,700.
* The first bond period's reward cycle comes from the `pox-5` entry in `poxInfo.contractVersions`. Throws an `Error` whose message starts with `pox-5 not activated yet` if that entry is missing, for example when the node omits `contract_versions`.
* `register-for-bond` accepts a lockup whose unlock height is at or above this value and below 500,000,000, and rejects anything else with `ERR_INVALID_UNLOCK_HEIGHT (u52)` ([L2074-L2078](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2074-L2078)).
* [buildRegisterMetadata](buildregistermetadata.md) uses this value as the lockup's unlock height. To read the same value from the chain, use [fetchBondL1UnlockHeight](../fetch/fetchbondl1unlockheight.md).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/script.ts#L459-L481)

***

### Signature

```ts
function computeBondUnlockHeight(opts: { bondIndex: number; poxInfo: PoxInfo }): number;
```

***

### Returns

`number`

The Bitcoin block height at which the lockup's `OP_CHECKLOCKTIMEVERIFY` branch becomes spendable.

***

### Parameters

#### opts.bondIndex (required)

* **Type**: `number`

The bond period index.

#### opts.poxInfo (required)

* **Type**: `PoxInfo`

The result of [fetchPoxInfo](../fetch/fetchpoxinfo.md). Its `firstBurnchainBlockHeight`, `rewardCycleLength` and `contractVersions` are used.
