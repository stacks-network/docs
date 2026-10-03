# buildReclaim

Builds the unsigned Bitcoin transaction that spends a P2WSH bond lockup to an address you choose, as a `@scure/btc-signer` `Transaction`. Pure computation: no network call.

***

### Usage

```ts
import { buildReclaim, finalizeReclaim } from '@stacks/bitcoin-staking';
import type { RegisterMetadata } from '@stacks/bitcoin-staking';

declare const meta: RegisterMetadata; // stored from buildRegisterMetadata
declare const fundingTxid: string; // transaction that funded meta.lockAddress
declare const sweepAddress: string; // your Bitcoin address
declare const stakerBtcPrivateKey: Uint8Array; // key behind the lockup's unlockBytes

const tx = buildReclaim({
  path: 'locktime',
  utxo: { txid: fundingTxid, vout: 0, value: 100_000n },
  network: 'mainnet',
  output: { address: sweepAddress, feeSats: 1_000n },
  lockScript: meta.lockScript,
});

tx.signIdx(stakerBtcPrivateKey, 0);
const { txHex, txid } = finalizeReclaim({ path: 'locktime', tx });
// broadcast txHex through your Bitcoin node or indexer
```

#### Notes

* The transaction has one input and one output. The input spends `utxo` with `witnessUtxo` and `witnessScript` set, so `tx.toPSBT()` gives a complete PSBT. The output pays `utxo.value - feeSats` sats to `output.address`.
* `'locktime'` sets the transaction `lockTime` to the unlock height read from `lockScript` and the input sequence to `0xfffffffe`. `'early-exit'` sets `lockTime` to 0 and the sequence to `0xffffffff`.
* Throws an `Error` if:
  * `lockScript` does not have the pox-5 lockup layout from [buildLockScript](../script/buildlockscript.md).
  * `feeSats` is negative, or is at or above `utxo.value`.
  * The swept amount is below 546 sats, the dust limit this function applies.
  * `utxo.scriptPubKey` is set and differs from the P2WSH form of `lockScript`.
  * `path` is `'locktime'` and `lockScript` encodes no unlock height.
* You can change outputs or the fee on the returned transaction before signing. The `SIGHASH_ALL` signature commits to them.
* With an in-process key, sign with `tx.signIdx(privateKey, 0)`. For a signer that signs a bare digest, compute it with [computeReclaimSighash](computereclaimsighash.md) and attach the result with `tx.updateInput(0, { partialSig })`. Then call [finalizeReclaim](finalizereclaim.md).
* The bond exit process is covered in [Ending or changing a bond position](https://docs.stacks.co/operate/protocol-bonds/ending-or-changing-a-bond-position).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/reclaim.ts#L136-L201)

***

### Signature

```ts
function buildReclaim(opts: BuildReclaimOpts): btc.Transaction;
```

`btc` is `@scure/btc-signer`. `opts` is a [BuildReclaimOpts](buildreclaimopts.md).

***

### Returns

`btc.Transaction`

The unsigned reclaim transaction, a `Transaction` from `@scure/btc-signer`.

***

### Parameters

#### opts.path (required)

* **Type**: `ReclaimPath`

The branch to spend, `'locktime'` or `'early-exit'`. See [ReclaimPath](reclaimpath.md).

#### opts.utxo (required)

* **Type**: `Utxo`

The lockup output to spend. `value` is in sats. See [Utxo](../types/utxo.md).

#### opts.network (required)

* **Type**: `StacksNetworkName | StacksNetwork`

The network whose Bitcoin address encoding `output.address` uses: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object.

#### opts.output (required)

* **Type**: `{ address: string; feeSats: IntegerType }`

The Bitcoin address that receives the sats, and the fee in sats.

#### opts.lockScript (required)

* **Type**: `Uint8Array | string`

The lockup witness script, as bytes or hex: the stored [RegisterMetadata](../script/registermetadata.md) `lockScript`, or a rebuild with [buildLockScript](../script/buildlockscript.md) from the same inputs.
