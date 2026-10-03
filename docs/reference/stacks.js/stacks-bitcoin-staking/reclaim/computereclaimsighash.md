# computeReclaimSighash

Computes the BIP-143 `SIGHASH_ALL` digest for input 0 of a reclaim transaction, for signers that sign a bare digest. Pure computation: no network call.

***

### Usage

```ts
import { buildReclaim, computeReclaimSighash, finalizeReclaim } from '@stacks/bitcoin-staking';
import type { BuildReclaimOpts } from '@stacks/bitcoin-staking';

declare const opts: BuildReclaimOpts; // path: 'early-exit'
declare const stxAddress: string; // staker the lockup script commits to
declare const stakerPublicKey: Uint8Array;
declare const cosignerPublicKey: Uint8Array; // key in the bond's early-unlock subscript
// Each returns a DER signature with a trailing SIGHASH_ALL byte (0x01)
declare function stakerSign(digest: Uint8Array): Promise<Uint8Array>;
declare function cosignerSign(digest: Uint8Array): Promise<Uint8Array>;

const tx = buildReclaim(opts);
const sighash = computeReclaimSighash(tx);

tx.updateInput(0, {
  partialSig: [
    [stakerPublicKey, await stakerSign(sighash)],
    [cosignerPublicKey, await cosignerSign(sighash)],
  ],
});

const { txHex } = finalizeReclaim({ path: 'early-exit', tx, stxAddress });
```

#### Notes

* Typical digest signers are an HSM, a KMS or an MPC service. The staker and the cosigner can also exchange the early-exit digest out of band. With an in-process key, `tx.signIdx(privateKey, 0)` computes the digest itself. Hardware and browser wallets take the PSBT from `tx.toPSBT()` instead.
* Reads the witness script and input amount from the transaction, where [buildReclaim](buildreclaim.md) sets them and a PSBT round trip keeps them. A transaction parsed from raw hex carries neither, so pass them in `opts`. Throws an `Error` if either is missing.
* The signature commits to the outputs. Recompute the digest after changing any output or the fee.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/reclaim.ts#L203-L232)

***

### Signature

```ts
function computeReclaimSighash(
  tx: btc.Transaction,
  opts?: { witnessScript?: Uint8Array | string; amountSats?: IntegerType }
): Uint8Array;
```

`btc` is `@scure/btc-signer`.

***

### Returns

`Uint8Array`

The 32-byte digest to sign.

***

### Parameters

#### tx (required)

* **Type**: `btc.Transaction`

The reclaim transaction, usually from [buildReclaim](buildreclaim.md).

#### opts.witnessScript (optional)

* **Type**: `Uint8Array | string`

The lockup witness script, as bytes or hex. Overrides the one on input 0.

#### opts.amountSats (optional)

* **Type**: `IntegerType`

The value of the lockup output being spent, in sats. Overrides the amount on input 0.
