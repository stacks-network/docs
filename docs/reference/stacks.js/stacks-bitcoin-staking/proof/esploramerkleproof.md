# EsploraMerkleProof

The merkle-proof response from an Esplora-compatible indexer (`GET /tx/:txid/merkle-proof`, as served by Blockstream and mempool.space). [buildLockProof](buildlockproof.md) takes it as `merkleProof`.

***

### Usage

```ts
import type { EsploraMerkleProof } from '@stacks/bitcoin-staking';

declare const esplora: string; // base URL of an Esplora-compatible API
declare const txid: string; // funding transaction ID

const merkleProof: EsploraMerkleProof = await (
  await fetch(`${esplora}/tx/${txid}/merkle-proof`)
).json();
```

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/proof.ts#L62-L75)

***

### Definition

```ts
interface EsploraMerkleProof {
  /** BTC block height containing the tx. */
  block_height: number;
  /** Sibling hashes (display/big-endian hex) along the path leaf -> root, bottom-up. */
  merkle: string[];
  /** 0-indexed position of the tx within the block. */
  pos: number;
}
```

***

### Properties

| Property       | Type       | Description                                                                                                                                                                            |
| -------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `block_height` | `number`   | Bitcoin block height containing the transaction. Becomes `height` in the lockup output                                                                                                 |
| `merkle`       | `string[]` | Sibling hashes from leaf to root, bottom-up, as display-order (big-endian) hex. [buildLockProof](buildlockproof.md) reverses each to the internal little-endian order pox-5 folds over |
| `pos`          | `number`   | Zero-based position of the transaction in the block. Becomes `txIndex` in the lockup output                                                                                            |
