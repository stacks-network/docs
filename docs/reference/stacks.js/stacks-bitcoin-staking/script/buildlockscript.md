# buildLockScript

Builds the L1 lockup witness script for a paired-BTC bond, byte for byte as pox-5's `construct-lockup-script` builds it. Pure computation: no network call.

***

### Usage

```ts
import {
  buildLockScript,
  buildUnlockScript,
  computeBondUnlockHeight,
  fetchBond,
  fetchPoxInfo,
} from '@stacks/bitcoin-staking';

const bondIndex = 2;
const poxInfo = await fetchPoxInfo({ network: 'mainnet' });
const bond = await fetchBond({ bondIndex, network: 'mainnet' });
if (!bond) throw new Error(`bond ${bondIndex} is not set up`);

const lockScript = buildLockScript({
  stxAddress: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
  unlockHeight: computeBondUnlockHeight({ bondIndex, poxInfo }), // 994700 for mainnet bond 2
  unlockBytes: buildUnlockScript(
    '02a1633cafcc01ebfb6d78e39f687a1f0995c62fc95f51ead10a02ee0be551b5dc'
  ),
  earlyUnlockBytes: bond.earlyUnlockBytes,
});
```

#### Notes

* The script is `OP_IF <unlockHeight> OP_CHECKLOCKTIMEVERIFY OP_ELSE OP_SIZE <32> OP_EQUALVERIFY OP_SHA256 <H> OP_EQUALVERIFY <earlyUnlockBytes> OP_ENDIF OP_VERIFY <unlockBytes>` ([construct-lockup-script](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3711-L3731)). `<H>` is `sha256(sha256(to-consensus-buff? staker))`. The early-exit (`OP_ELSE`) branch reveals its preimage, which [computeRegisterPreimage](computeregisterpreimage.md) computes. `unlockBytes` runs last in both branches.
* `unlockBytes` and `earlyUnlockBytes` are spliced in raw, without a push prefix, so each must be a complete subscript that leaves a boolean on the stack.
* Throws if `unlockBytes` is empty or does not decode as Bitcoin script. `earlyUnlockBytes` goes through [validateEarlyUnlockBytes](validateearlyunlockbytes.md), with the shape check controlled by `opts.validateEarlyUnlockBytes`.
* Throws if `unlockHeight` is 0, negative, or at or above [BITCOIN\_LOCKTIME\_THRESHOLD](bitcoin_locktime_threshold.md). Height 0 encodes as `OP_0`, which leaves an empty value that the shared `OP_VERIFY` reads as false, so the locktime branch could never be spent.
* pox-5 accepts any unlock height at or above the bond's minimum and below 500,000,000. A height below the minimum fails `register-for-bond` with `ERR_INVALID_UNLOCK_HEIGHT (u52)` ([L2074-L2078](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2074-L2078)). [computeBondUnlockHeight](computebondunlockheight.md) returns the minimum.
* Keep the script. [buildReclaim](../reclaim/buildreclaim.md) needs it to spend the lockup, and [buildLockProof](../proof/buildlockproof.md) accepts it as `lockScript`. To fund the lockup, derive the address with [buildLockAddress](buildlockaddress.md), or use [buildRegisterMetadata](buildregistermetadata.md) to get the script, address and output script in one call.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/script.ts#L242-L358)

***

### Signature

```ts
function buildLockScript(opts: {
  stxAddress: string;
  unlockHeight: IntegerType;
  unlockBytes: Uint8Array | string;
  earlyUnlockBytes: Uint8Array | string;
  validateEarlyUnlockBytes?: boolean;
}): Uint8Array;
```

***

### Returns

`Uint8Array`

The witness script. Its P2WSH hash is what the funding output must pay.

***

### Parameters

#### opts.stxAddress (required)

* **Type**: `string`

The staker's Stacks principal, standard or contract. `register-for-bond` rebuilds the script with its transaction sender as the staker, so this must be the address that sends that transaction.

#### opts.unlockHeight (required)

* **Type**: `IntegerType`

The Bitcoin block height at which the `OP_CHECKLOCKTIMEVERIFY` branch becomes spendable. A number, bigint or numeric string.

#### opts.unlockBytes (required)

* **Type**: `Uint8Array | string`

The staker subscript, as bytes or hex. Usually the output of [buildUnlockScript](buildunlockscript.md).

#### opts.earlyUnlockBytes (required)

* **Type**: `Uint8Array | string`

The bond's early-unlock subscript, as bytes or hex. Read it from [fetchBond](../fetch/fetchbond.md).

#### opts.validateEarlyUnlockBytes (optional)

* **Type**: `boolean`

Set to `false` to skip the shape check on `earlyUnlockBytes`. The structural check still runs. Defaults to `true`.
