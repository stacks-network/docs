# ParsedBlockHeader

The fields of an 80-byte Bitcoin block header, as decoded by pox-5. [fetchParseBlockHeader](fetchparseblockheader.md) returns it.

***

### Usage

```ts
import { bytesToHex } from '@stacks/common';
import { type ParsedBlockHeader, fetchParseBlockHeader } from '@stacks/bitcoin-staking';

// The Bitcoin genesis block header
const header: ParsedBlockHeader = await fetchParseBlockHeader({
  header:
    '0100000000000000000000000000000000000000000000000000000000000000000000003ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4a29ab5f49ffff001d1dac2b7c',
  network: 'mainnet',
});

bytesToHex(header.merkleRoot); // '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b'
header.timestamp; // 1231006505
```

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L732-L742)

***

### Definition

```ts
interface ParsedBlockHeader {
  version: number;
  /** Previous-block hash, big-endian (display order). */
  parent: Uint8Array;
  /** Merkle root, big-endian (display order). */
  merkleRoot: Uint8Array;
  timestamp: number;
  nbits: number;
  nonce: number;
}
```

***

### Properties

| Property     | Type         | Description                                                               |
| ------------ | ------------ | ------------------------------------------------------------------------- |
| `version`    | `number`     | Block version                                                             |
| `parent`     | `Uint8Array` | Previous block hash, 32 bytes, in display order                           |
| `merkleRoot` | `Uint8Array` | Merkle root of the block's transactions, 32 bytes, in display order       |
| `timestamp`  | `number`     | Block time, Unix epoch seconds                                            |
| `nbits`      | `number`     | Difficulty target in compact form, for example `486604799` (`0x1d00ffff`) |
| `nonce`      | `number`     | Proof-of-work nonce                                                       |
