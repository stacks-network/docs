# ConstructLockupParams

The inputs to the L1 lockup script: the staker's address, the CLTV unlock height, and the two unlock subscripts. [fetchConstructLockupScript](fetchconstructlockupscript.md) and [fetchConstructLockupOutputScript](fetchconstructlockupoutputscript.md) accept it, together with a network and client.

***

### Usage

```ts
import {
  type ConstructLockupParams,
  buildUnlockScript,
  fetchBond,
  fetchBondL1UnlockHeight,
  fetchConstructLockupOutputScript,
} from '@stacks/bitcoin-staking';

const bond = await fetchBond({ bondIndex: 1, network: 'mainnet' });
if (!bond) throw new Error('bond 1 is not set up');

const params: ConstructLockupParams = {
  stxAddress: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
  unlockHeight: await fetchBondL1UnlockHeight({ bondIndex: 1, network: 'mainnet' }),
  unlockBytes: buildUnlockScript('0316e35d38b52d4886e40065e4952a49535ce914e02294be58e252d1998f129b19'), // staker's compressed public key
  earlyUnlockBytes: bond.earlyUnlockBytes,
};

const outputScript = await fetchConstructLockupOutputScript({ ...params, network: 'mainnet' });
```

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L516-L524)

***

### Definition

```ts
interface ConstructLockupParams {
  stxAddress: string;
  unlockHeight: IntegerType;
  /** Staker-signature subscript (the `staker-unlock-bytes` contract arg). */
  unlockBytes: Uint8Array | string;
  /** Per-bond early-unlock subscript (from {@link fetchBond}). */
  earlyUnlockBytes: Uint8Array | string;
}
```

***

### Properties

| Property           | Type                   | Description                                                                                                                         |
| ------------------ | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `stxAddress`       | `string`               | Stacks address of the staker, sent as the `staker` argument. A contract principal is also accepted                                  |
| `unlockHeight`     | `IntegerType`          | Bitcoin block height for the script's `OP_CHECKLOCKTIMEVERIFY` branch, sent as `unlock-burn-height`. Must be below 2^39             |
| `unlockBytes`      | `Uint8Array \| string` | Staker-signature subscript, sent as `staker-unlock-bytes`. Raw bytes or hex, at most 683 bytes                                      |
| `earlyUnlockBytes` | `Uint8Array \| string` | The bond's early-unlock subscript from [fetchBond](fetchbond.md), sent as `early-unlock-bytes`. Raw bytes or hex, at most 683 bytes |
