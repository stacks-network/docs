# buildLockProof

Turns indexer responses for a confirmed lockup funding transaction into the [BondL1LockupOutput](../types/bondl1lockupoutput.md) that `register-for-bond` takes for one L1 lockup output. Pure computation: the caller fetches the inputs, this makes no network call.

***

### Usage

```ts
import { buildLockProof } from '@stacks/bitcoin-staking';
import type { RegisterMetadata } from '@stacks/bitcoin-staking';

declare const esplora: string; // base URL of an Esplora-compatible API
declare const txid: string; // funding transaction ID
declare const blockHash: string; // block that confirmed it
declare const meta: RegisterMetadata; // from buildRegisterMetadata

const get = (path: string) => fetch(`${esplora}${path}`);

const output = buildLockProof({
  txHex: await (await get(`/tx/${txid}/hex`)).text(),
  header: await (await get(`/block/${blockHash}/header`)).text(),
  merkleProof: await (await get(`/tx/${txid}/merkle-proof`)).json(),
  txCount: (await (await get(`/block/${blockHash}`)).json()).tx_count,
  unlockHeight: meta.unlockHeight,
  lockScript: meta.lockScript,
});
// pass to buildRegisterForBond as lockup: { kind: 'btc', outputs: [output], unlockBytes: meta.unlockBytes }
```

#### Notes

* The witness is stripped from `txHex`, so the stored `tx` is the legacy serialization that hashes to the txid. Segwit serialization from `GET /tx/:txid/hex` is accepted.
* Each `merkleProof.merkle` hash is reversed from display order to the internal little-endian order pox-5 folds over.
* The lockup output is found by comparing each output's `scriptPubKey` with the expected P2WSH script (see [ExpectedScriptInput](expectedscriptinput.md)), the same equality `register-for-bond` asserts. `amount` is read from that output, in sats. It throws if no output matches, if several match and `outputIndex` is not set, or if `outputIndex` names an output that does not match.
* Before returning, it checks the proof: `header` is 80 bytes, `pos` is within `txCount`, the branch has exactly `ceil(log2(txCount))` siblings of 32 bytes each and at most 14, and the branch folds from the txid to the header's merkle root. It also throws if the legacy transaction is over 100,000 bytes, the size pox-5 accepts.
* It does not check the following, which `register-for-bond` checks on chain in `validate-l1-lockup` ([L2031-L2113](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2031-L2113)):
  * `unlockHeight` below the bond's minimum fails with `ERR_INVALID_UNLOCK_HEIGHT (u52)`.
  * `unlockHeight` different from the height the script commits to fails with `ERR_INVALID_LOCKUP_SCRIPT (u42)` because pox-5 rebuilds the expected script from it.
  * A header that is not the Bitcoin block at `merkleProof.block_height` fails with `ERR_INVALID_BTC_HEADER (u40)`.
* `register-for-bond` takes up to 10 lockup outputs. When one transaction pays the lockup script more than once, call this once per output with `outputIndex` set. pox-5 rejects the same outpoint twice with `ERR_DUPLICATE_LOCKUP_OUTPOINT (u46)`.
* Without an Esplora `/merkle-proof` endpoint, use [buildLockProofFromBlock](buildlockprooffromblock.md).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/proof.ts#L191-L319)

***

### Signature

```ts
function buildLockProof(
  input: {
    txHex: string;
    header: Uint8Array | string;
    merkleProof: EsploraMerkleProof;
    txCount: number;
    unlockHeight: IntegerType;
    outputIndex?: number;
  } & ExpectedScriptInput
): BondL1LockupOutput;
```

***

### Returns

`BondL1LockupOutput`

A [BondL1LockupOutput](../types/bondl1lockupoutput.md) with `tx`, `header` and `leafHashes` as bytes, `amount` as a `bigint` in sats, and `unlockBurnHeight` set from `unlockHeight`.

***

### Parameters

#### input.txHex (required)

* **Type**: `string`

The raw funding transaction as hex, from `GET /tx/:txid/hex`. Segwit serialization is accepted.

#### input.header (required)

* **Type**: `Uint8Array | string`

The 80-byte header of the block that confirmed the transaction, as bytes or hex, from `GET /block/:hash/header`.

#### input.merkleProof (required)

* **Type**: `EsploraMerkleProof`

The indexer's merkle proof, from `GET /tx/:txid/merkle-proof`. See [EsploraMerkleProof](esploramerkleproof.md).

#### input.txCount (required)

* **Type**: `number`

The number of transactions in the block, the `tx_count` field of `GET /block/:hash`.

#### input.unlockHeight (required)

* **Type**: `IntegerType`

The unlock height the lockup script commits to, the same value used to build it.

#### input.outputIndex (optional)

* **Type**: `number`

Which output to prove when the transaction pays the lockup script more than once. Omit when exactly one output matches.

#### input.outputScript or input.lockScript (required, exactly one)

* **Type**: `Uint8Array | string`

The P2WSH `scriptPubKey` or the witness script of the lockup. See [ExpectedScriptInput](expectedscriptinput.md).
