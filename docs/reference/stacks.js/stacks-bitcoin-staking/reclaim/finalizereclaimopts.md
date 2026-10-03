# FinalizeReclaimOpts

Options for [finalizeReclaim](finalizereclaim.md), discriminated on `path`. The early-exit path also needs the staker's Stacks address to rebuild the preimage its witness reveals.

***

### Usage

```ts
import type { FinalizeReclaimOpts } from '@stacks/bitcoin-staking';
import type { Transaction } from '@scure/btc-signer';

declare const tx: Transaction; // signed, from buildReclaim

const locktime: FinalizeReclaimOpts = { path: 'locktime', tx };

const earlyExit: FinalizeReclaimOpts = {
  path: 'early-exit',
  tx,
  stxAddress: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
};
```

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/reclaim.ts#L253-L261)

***

### Definition

```ts
type FinalizeReclaimOpts =
  | {
      path: 'early-exit';
      tx: btc.Transaction;
      stxAddress: string;
    }
  | { path: 'locktime'; tx: btc.Transaction };
```

`btc` is `@scure/btc-signer`.

***

### Values

| Value                                    | Description                                                                                                                                                                                                                                                              |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `{ path: 'locktime'; tx }`               | Spends the `OP_IF` branch. `tx` must carry the staker's signature on input 0                                                                                                                                                                                             |
| `{ path: 'early-exit'; tx; stxAddress }` | Spends the `OP_ELSE` branch. `tx` must carry the staker's and the cosigner's signatures on input 0. `stxAddress` is the staker principal the lockup script commits to, used to compute the preimage with [computeRegisterPreimage](../script/computeregisterpreimage.md) |
