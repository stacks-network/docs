# buildLockOutputScript

Builds the 34-byte P2WSH `scriptPubKey` that a lockup funding output must carry, as pox-5's `construct-lockup-output-script` builds it. Pure computation: no network call.

***

### Usage

```ts
import {
  buildLockOutputScript,
  buildUnlockScript,
  computeBondUnlockHeight,
  fetchBond,
  fetchPoxInfo,
} from '@stacks/bitcoin-staking';

const bondIndex = 2;
const poxInfo = await fetchPoxInfo({ network: 'mainnet' });
const bond = await fetchBond({ bondIndex, network: 'mainnet' });
if (!bond) throw new Error(`bond ${bondIndex} is not set up`);

const outputScript = buildLockOutputScript({
  stxAddress: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
  unlockHeight: computeBondUnlockHeight({ bondIndex, poxInfo }),
  unlockBytes: buildUnlockScript(
    '02a1633cafcc01ebfb6d78e39f687a1f0995c62fc95f51ead10a02ee0be551b5dc'
  ),
  earlyUnlockBytes: bond.earlyUnlockBytes,
});
// 0x00 0x20 followed by sha256(lockScript)
```

#### Notes

* Calls [buildLockScript](buildlockscript.md) and wraps the result as `0x0020 || sha256(script)`, so it throws in the same cases.
* `register-for-bond` derives the same value and rejects an output whose `scriptPubKey` differs with `ERR_INVALID_LOCKUP_SCRIPT (u42)` ([L2080-L2081](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2080-L2081), [construct-lockup-output-script](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3734-L3745)).
* The options type does not declare `validateEarlyUnlockBytes`, so a typed call runs the shape check on `earlyUnlockBytes` from [validateEarlyUnlockBytes](validateearlyunlockbytes.md). For a bond whose early-unlock subscript fails that check, build the script with [buildLockScript](buildlockscript.md) and pass it to [buildLockProof](../proof/buildlockproof.md) as `lockScript`.
* Use the result as `outputScript` in [buildLockProof](../proof/buildlockproof.md) or [buildLockProofFromBlock](../proof/buildlockprooffromblock.md).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/script.ts#L370-L382)

***

### Signature

```ts
function buildLockOutputScript(opts: {
  stxAddress: string;
  unlockHeight: IntegerType;
  unlockBytes: Uint8Array | string;
  earlyUnlockBytes: Uint8Array | string;
}): Uint8Array;
```

***

### Returns

`Uint8Array`

The 34-byte P2WSH `scriptPubKey`.

***

### Parameters

#### opts.stxAddress (required)

* **Type**: `string`

The staker's Stacks principal, standard or contract. It must be the address that sends `register-for-bond`.

#### opts.unlockHeight (required)

* **Type**: `IntegerType`

The Bitcoin block height at which the `OP_CHECKLOCKTIMEVERIFY` branch becomes spendable. A number, bigint or numeric string.

#### opts.unlockBytes (required)

* **Type**: `Uint8Array | string`

The staker subscript, as bytes or hex. Usually the output of [buildUnlockScript](buildunlockscript.md).

#### opts.earlyUnlockBytes (required)

* **Type**: `Uint8Array | string`

The bond's early-unlock subscript, as bytes or hex. Read it from [fetchBond](../fetch/fetchbond.md).
