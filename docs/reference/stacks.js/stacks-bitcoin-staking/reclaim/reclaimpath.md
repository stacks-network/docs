# ReclaimPath

The two ways to spend a P2WSH bond lockup back out. Set as `path` in [BuildReclaimOpts](buildreclaimopts.md) and [FinalizeReclaimOpts](finalizereclaimopts.md).

***

### Usage

```ts
import type { ReclaimPath } from '@stacks/bitcoin-staking';

const path: ReclaimPath = 'locktime';
```

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/reclaim.ts#L10-L19)

***

### Definition

```ts
type ReclaimPath = 'locktime' | 'early-exit';
```

***

### Values

| Value          | Description                                                                                                                                                                                                               |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `'locktime'`   | The `OP_IF` branch of the lockup script. Needs the staker's signature, and the transaction's `nLockTime` must reach the unlock height the script commits to through `OP_CHECKLOCKTIMEVERIFY`                              |
| `'early-exit'` | The `OP_ELSE` branch. Needs a signature for the bond's early-unlock subscript, the staker's signature, and the 32-byte preimage from [computeRegisterPreimage](../script/computeregisterpreimage.md). No locktime applies |
