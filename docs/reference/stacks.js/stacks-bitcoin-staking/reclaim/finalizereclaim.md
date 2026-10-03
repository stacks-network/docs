# finalizeReclaim

Assembles the lockup witness for the chosen branch from the signatures already on a reclaim transaction, and returns the transaction ready to broadcast. No network call: broadcasting is left to the caller.

***

### Usage

```ts
import { buildReclaim, finalizeReclaim } from '@stacks/bitcoin-staking';
import type { BuildReclaimOpts } from '@stacks/bitcoin-staking';

declare const opts: BuildReclaimOpts; // path: 'locktime'
declare const stakerBtcPrivateKey: Uint8Array; // key behind the lockup's unlockBytes

const tx = buildReclaim(opts);
tx.signIdx(stakerBtcPrivateKey, 0);

const { txHex, txid } = finalizeReclaim({ path: 'locktime', tx });
// broadcast txHex through your Bitcoin node or indexer
```

#### Notes

* Reads the `partialSig` entries on input 0, left by `tx.signIdx` or by `tx.updateInput(0, { partialSig })`, and matches each public key against the lockup script to tell the staker's signature from the cosigner's.
* The witness stack is `[stakerSig, 0x01, witnessScript]` for `'locktime'` and `[stakerSig, cosignerSig, preimage, <empty>, witnessScript]` for `'early-exit'`.
* Throws an `Error` if input 0 has no witness script, if the script does not have the pox-5 lockup layout, if the staker subscript has other than one public key, or if the staker's signature is missing. On `'early-exit'` it also throws if the early-unlock subscript has other than one public key or the cosigner's signature is missing. Multi-key subscripts are valid in pox-5 but this function cannot assemble their witness.
* `stxAddress` is not checked against the script. A wrong address produces a witness that Bitcoin rejects at the `OP_EQUALVERIFY` after `OP_SHA256`.
* Mutates `tx`: the witness is written to input 0.
* `txid` is computed locally. It identifies the transaction you broadcast and says nothing about whether it was accepted or confirmed.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/reclaim.ts#L263-L284)

***

### Signature

```ts
function finalizeReclaim(opts: FinalizeReclaimOpts): { txHex: string; txid: string };
```

`opts` is a [FinalizeReclaimOpts](finalizereclaimopts.md).

***

### Returns

`{ txHex: string; txid: string }`

| Field   | Type     | Meaning                                                    |
| ------- | -------- | ---------------------------------------------------------- |
| `txHex` | `string` | The finalized transaction, hex-encoded, ready to broadcast |
| `txid`  | `string` | The transaction ID                                         |

***

### Parameters

#### opts.path (required)

* **Type**: `'locktime' | 'early-exit'`

The branch to spend. Use the `path` the transaction was built with in [buildReclaim](buildreclaim.md), which sets the locktime and sequence for that branch.

#### opts.tx (required)

* **Type**: `btc.Transaction`

The signed reclaim transaction from [buildReclaim](buildreclaim.md). `btc` is `@scure/btc-signer`.

#### opts.stxAddress (required for 'early-exit')

* **Type**: `string`

The staker principal the lockup script commits to. Used to compute the preimage with [computeRegisterPreimage](../script/computeregisterpreimage.md).
