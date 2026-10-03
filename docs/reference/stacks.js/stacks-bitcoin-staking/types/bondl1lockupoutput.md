# BondL1LockupOutput

The SPV proof for one L1 BTC lockup output, in the tuple shape pox-5 `register-for-bond` expects. [buildLockProof](../proof/buildlockproof.md) and [buildLockProofFromBlock](../proof/buildlockprooffromblock.md) return it, and a [BondLockup](bondlockup.md) with `kind: 'btc'` carries a list of them to [buildRegisterForBond](../build/buildregisterforbond.md).

***

### Usage

```ts
import { buildLockProof, buildRegisterForBond } from '@stacks/bitcoin-staking';

const output = buildLockProof({
  txHex: await (await fetch(`${esplora}/tx/${txid}/hex`)).text(),
  header: await (await fetch(`${esplora}/block/${blockHash}/header`)).text(),
  merkleProof: await (await fetch(`${esplora}/tx/${txid}/merkle-proof`)).json(),
  txCount: (await (await fetch(`${esplora}/block/${blockHash}`)).json()).tx_count,
  unlockHeight: meta.unlockHeight,
  lockScript: meta.lockScript, // from buildRegisterMetadata
});

const tx = await buildRegisterForBond({
  bondIndex: 2,
  signerManager: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.my-signer-manager',
  amountUstx,
  lockup: { kind: 'btc', outputs: [output], unlockBytes: meta.unlockBytes },
  publicKey,
  fee: 10_000n,
  nonce,
  network: 'mainnet',
});
```

#### Notes

* Build the tuple with `buildLockProof` or `buildLockProofFromBlock` where you can. They strip the witness from `tx` and reverse the sibling hashes, the two steps that otherwise fail the merkle check.
* [buildRegisterForBond](../build/buildregisterforbond.md) throws before building if `outputs` is empty, has more than 10 entries, or an entry has more than 14 `leafHashes`.
* pox-5 checks each output in [`validate-l1-lockup`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2031-L2113), in the order of this table, and the first failure aborts `register-for-bond`:

| Failing condition                                                                                                                                                                                                                                           | Error                                 |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| `unlockBurnHeight` is below [`get-bond-l1-unlock-height`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3342-L3346) for the bond, or at or above 500,000,000 | `ERR_INVALID_UNLOCK_HEIGHT (u52)`     |
| The output's script differs from the P2WSH script re-derived from the staker, `unlockBurnHeight`, the lockup's `unlockBytes` and the bond's `earlyUnlockBytes`                                                                                              | `ERR_INVALID_LOCKUP_SCRIPT (u42)`     |
| `amount` differs from the output's value                                                                                                                                                                                                                    | `ERR_INVALID_LOCKUP_AMOUNT (u45)`     |
| The same txid and output index appear twice in `outputs`                                                                                                                                                                                                    | `ERR_DUPLICATE_LOCKUP_OUTPOINT (u46)` |
| `header` does not hash to the Bitcoin block hash at `height`                                                                                                                                                                                                | `ERR_INVALID_BTC_HEADER (u40)`        |
| The merkle path does not fold to the header's merkle root                                                                                                                                                                                                   | `ERR_INVALID_MERKLE_PROOF (u41)`      |

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/types.ts#L279-L333)

***

### Definition

```ts
export interface BondL1LockupOutput {
  /** BTC block height containing the tx. */
  height: number;
  /**
   * Raw BTC tx bytes (buff 100000). MUST be the legacy / non-segwit
   * serialization, i.e. the bytes that hash (double-sha256) to the txid,
   * not the witness-extended `wtxid` serialization. Pre-segwit clients and
   * the `tx` field of the Bitcoin RPC `getrawtransaction` (with verbose=0)
   * both produce the correct form.
   */
  tx: Uint8Array | string;
  /** Index of the relevant output within the tx. */
  outputIndex: number;
  /** 80-byte BTC block header (buff 80). */
  header: Uint8Array | string;
  /**
   * Sibling hashes along the merkle path from leaf to root, ordered
   * bottom-up (closest sibling first). Each hash is the raw 32-byte
   * little-endian (internal) form, NOT the reversed display form.
   *
   * Up to 14 entries (the contract's `(list 14 (buff 32))` cap, which
   * accommodates blocks of up to 2^14 = 16,384 transactions).
   *
   * The verifier folds the path by repeatedly hashing
   * `double-sha256(left || right)`, choosing left/right at each level based
   * on the bit of `txIndex` at that level (LSB first). A correctly
   * constructed path reproduces the block's merkle root from the leaf txid.
   */
  leafHashes: (Uint8Array | string)[];
  /** Total transaction count in the block. */
  txCount: number;
  /** Position of the tx in the block (0-indexed). */
  txIndex: number;
  /** Sats: must match the parsed output amount. */
  amount: bigint;
  /**
   * BTC absolute CLTV height the output's lockup script commits to: the
   * `unlockHeight` passed to {@link buildLockOutputScript}. The contract
   * re-derives the expected P2WSH script from this height and rejects the
   * output unless it is at or above the bond's minimum unlock height and below
   * 500,000,000 (`ERR_INVALID_UNLOCK_HEIGHT`), the latter being the point where
   * Bitcoin would treat a CLTV value as a Unix timestamp instead of a height.
   */
  unlockBurnHeight: number;
}
```

***

### Properties

| Property           | Type                       | Description                                                                                                         |
| ------------------ | -------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `height`           | `number`                   | Bitcoin block height of the block containing the transaction. Sent as `height`                                      |
| `tx`               | `Uint8Array \| string`     | Raw transaction in legacy serialization, without witness data, as bytes or hex. Sent as `tx` (`buff 100000`)        |
| `outputIndex`      | `number`                   | Index of the lockup output in the transaction. Sent as `output-index`                                               |
| `header`           | `Uint8Array \| string`     | 80-byte block header, as bytes or hex. Sent as `header` (`buff 80`)                                                 |
| `leafHashes`       | `(Uint8Array \| string)[]` | Merkle siblings from leaf to root, 32 bytes each in internal little-endian order. At most 14. Sent as `leaf-hashes` |
| `txCount`          | `number`                   | Number of transactions in the block. Sent as `tx-count`                                                             |
| `txIndex`          | `number`                   | Zero-based position of the transaction in the block. Sent as `tx-index`                                             |
| `amount`           | `bigint`                   | Output value in sats. Sent as `amount`                                                                              |
| `unlockBurnHeight` | `number`                   | Bitcoin block height the lockup script's `OP_CHECKLOCKTIMEVERIFY` commits to. Sent as `unlock-burn-height`          |
