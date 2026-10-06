# buildLockProofFromBlock

Builds the [BondL1LockupOutput](../types/bondl1lockupoutput.md) for a lockup funding transaction from the block's ordered txid list, for callers without an Esplora `/merkle-proof` endpoint, such as those reading bitcoind directly. Computes the merkle branch, then calls [buildLockProof](buildlockproof.md). Pure computation: no network call.

***

### Usage

```ts
import { buildLockProofFromBlock } from '@stacks/bitcoin-staking';
import type { RegisterMetadata } from '@stacks/bitcoin-staking';

declare function rpc(method: string, params: unknown[]): Promise<any>; // your bitcoind RPC client
declare const txid: string; // funding transaction ID
declare const blockHash: string; // block that confirmed it
declare const meta: RegisterMetadata; // from buildRegisterMetadata

const block = await rpc('getblock', [blockHash, 1]);

const output = buildLockProofFromBlock({
  txHex: (await rpc('gettransaction', [txid, null, true])).hex,
  header: await rpc('getblockheader', [blockHash, false]),
  blockHeight: block.height,
  txids: block.tx,
  unlockHeight: meta.unlockHeight,
  lockScript: meta.lockScript,
});
```

#### Notes

* The transaction's position is found by hashing `txHex`, witness stripped, to its txid and looking it up in `txids`. Throws an `Error` whose message starts with `buildLockProofFromBlock: txid` if it is not there.
* `txCount` is `txids.length`. The merkle branch is computed from `txids` with standard Bitcoin construction: an odd row duplicates its last node.
* Output matching, witness stripping, the proof checks and their errors are those of [buildLockProof](buildlockproof.md).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/proof.ts#L357-L436)

***

### Signature

```ts
function buildLockProofFromBlock(
  input: {
    txHex: string;
    header: Uint8Array | string;
    blockHeight: number;
    txids: string[];
    unlockHeight: IntegerType;
    outputIndex?: number;
  } & ExpectedScriptInput
): BondL1LockupOutput;
```

***

### Returns

`BondL1LockupOutput`

A [BondL1LockupOutput](../types/bondl1lockupoutput.md), as returned by [buildLockProof](buildlockproof.md).

***

### Parameters

#### input.txHex (required)

* **Type**: `string`

The raw funding transaction as hex. Segwit serialization is accepted.

#### input.header (required)

* **Type**: `Uint8Array | string`

The 80-byte header of the block that confirmed the transaction, as bytes or hex.

#### input.blockHeight (required)

* **Type**: `number`

The height of that block. pox-5 checks the header against the Bitcoin block at this height.

#### input.txids (required)

* **Type**: `string[]`

The block's txids in block order, as display-order (big-endian) hex: the `tx` array of `getblock` with verbosity 1.

#### input.unlockHeight (required)

* **Type**: `IntegerType`

The unlock height the lockup script commits to, the same value used to build it.

#### input.outputIndex (optional)

* **Type**: `number`

Which output to prove when the transaction pays the lockup script more than once. Omit when exactly one output matches.

#### input.outputScript or input.lockScript (required, exactly one)

* **Type**: `Uint8Array | string`

The P2WSH `scriptPubKey` or the witness script of the lockup. See [ExpectedScriptInput](expectedscriptinput.md).
