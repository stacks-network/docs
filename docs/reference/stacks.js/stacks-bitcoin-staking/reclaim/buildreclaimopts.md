# BuildReclaimOpts

Options for [buildReclaim](buildreclaim.md): which branch to spend, the lockup UTXO, its witness script, and where the sats go.

***

### Usage

```ts
import { buildReclaim } from '@stacks/bitcoin-staking';
import type { BuildReclaimOpts, RegisterMetadata } from '@stacks/bitcoin-staking';

declare const meta: RegisterMetadata; // stored from buildRegisterMetadata
declare const fundingTxid: string; // transaction that funded meta.lockAddress
declare const sweepAddress: string; // your Bitcoin address

const opts: BuildReclaimOpts = {
  path: 'locktime',
  utxo: {
    txid: fundingTxid,
    vout: 0,
    value: 100_000n, // sats in the lockup output
  },
  network: 'mainnet',
  output: {
    address: sweepAddress,
    feeSats: 1_000n,
  },
  lockScript: meta.lockScript,
};

const tx = buildReclaim(opts);
```

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/reclaim.ts#L107-L134)

***

### Definition

```ts
interface BuildReclaimOpts {
  path: ReclaimPath;
  utxo: Utxo;
  network: StacksNetworkName | StacksNetwork;
  output: { address: string; feeSats: IntegerType };
  lockScript: Uint8Array | string;
}
```

***

### Properties

| Property         | Type                                 | Description                                                                                                                                                                                                                                                           |
| ---------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `path`           | `ReclaimPath`                        | Branch to spend, `'locktime'` or `'early-exit'`. See [ReclaimPath](reclaimpath.md)                                                                                                                                                                                    |
| `utxo`           | `Utxo`                               | The lockup output to spend. See [Utxo](../types/utxo.md). `value` is in sats. If `scriptPubKey` is set, it must equal the P2WSH form of `lockScript`                                                                                                                  |
| `network`        | `StacksNetworkName \| StacksNetwork` | Network whose Bitcoin address encoding `output.address` uses                                                                                                                                                                                                          |
| `output.address` | `string`                             | Bitcoin address that receives the swept sats                                                                                                                                                                                                                          |
| `output.feeSats` | `IntegerType`                        | Fee in sats. The output receives `utxo.value - feeSats`                                                                                                                                                                                                               |
| `lockScript`     | `Uint8Array \| string`               | The lockup witness script, as bytes or hex. Use the stored [RegisterMetadata](../script/registermetadata.md) `lockScript`, or rebuild it with [buildLockScript](../script/buildlockscript.md) from the same inputs. The locktime path reads the unlock height from it |
