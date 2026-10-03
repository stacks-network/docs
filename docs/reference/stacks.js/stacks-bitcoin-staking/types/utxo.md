# Utxo

A confirmed Bitcoin output in the Esplora and mempool.space shape (`txid`, `vout`, `value`). [BuildReclaimOpts](../reclaim/buildreclaimopts.md) takes it as `utxo`, the L1 lockup output that [buildReclaim](../reclaim/buildreclaim.md) spends.

***

### Usage

```ts
import { buildReclaim } from '@stacks/bitcoin-staking';

const tx = buildReclaim({
  path: 'locktime',
  utxo: {
    txid, // display (big-endian) hex, as shown by explorers
    vout: 0,
    value: 100_000_000n, // sats
  },
  network: 'mainnet',
  output: { address: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4', feeSats: 2_000n },
  lockScript: meta.lockScript, // from buildRegisterMetadata
});
```

#### Notes

* If you pass `scriptPubKey`, `buildReclaim` compares it with the P2WSH script derived from `lockScript` and on a mismatch throws an `Error` whose message starts with `buildReclaim: utxo.scriptPubKey does not match the lockScript`. Omit it and the derived script is used.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/types.ts#L344-L359)

***

### Definition

```ts
export interface Utxo {
  /** Funding transaction id (display / big-endian hex). */
  txid: string;
  /** Output index within the funding transaction. */
  vout: number;
  /** Output value, in sats. */
  value: IntegerType;
  /** Output `scriptPubKey` bytes, if known. Optional: re-derived when omitted. */
  scriptPubKey?: Uint8Array;
}
```

***

### Properties

| Property       | Type                    | Description                                               |
| -------------- | ----------------------- | --------------------------------------------------------- |
| `txid`         | `string`                | Funding transaction ID, display (big-endian) hex          |
| `vout`         | `number`                | Output index in the funding transaction                   |
| `value`        | `IntegerType`           | Output value in sats                                      |
| `scriptPubKey` | `Uint8Array` (optional) | Output script, used as a cross-check against `lockScript` |
