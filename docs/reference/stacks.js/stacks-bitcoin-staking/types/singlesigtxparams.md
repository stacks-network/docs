# SingleSigTxParams

Transaction parameters for a single-signature origin: the [TxParamsBase](txparamsbase.md) fields plus the caller's `publicKey`. It is one side of the [TxParams](txparams.md) union that every `build*` function accepts.

***

### Usage

```ts
import { buildStake } from '@stacks/bitcoin-staking';
import { Pc, TransactionSigner, broadcastTransaction, fetchNonce } from '@stacks/transactions';

const tx = await buildStake({
  signerManager: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.my-signer-manager',
  amountUstx,
  numCycles: 6,
  startBurnHt,
  publicKey, // hex secp256k1 public key of the staker
  fee: 10_000n,
  nonce: await fetchNonce({ address: stakerAddress, network: 'mainnet' }),
  network: 'mainnet',
  postConditions: [Pc.principal(stakerAddress).willSendEq(amountUstx).ustxToLock()],
});

new TransactionSigner(tx).signOrigin(stakerPrivateKey);
const result = await broadcastTransaction({ transaction: tx, network: 'mainnet' });
```

#### Notes

* Builders treat the params as single-sig whenever `publicKey` is defined, and build a P2PKH spending condition from it.
* The builder returns an unsigned transaction. Sign it with the private key for `publicKey`, for example with [TransactionSigner](../../stacks-transactions/signing/TransactionSigner.md).
* A transaction ID from [broadcastTransaction](../../stacks-transactions/network/broadcastTransaction.md) confirms submission, not success. A failed pox-5 assert is mined as `abort_by_response` with an `(err uN)` result, which [parsePox5Error](../errors/parsepox5error.md) reads.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/types.ts#L24-L30)

***

### Definition

```ts
export interface SingleSigTxParams extends TxParamsBase {
  /** Compressed/uncompressed secp256k1 public key of the (single) caller. */
  publicKey: string;
  publicKeys?: never;
  numSignatures?: never;
}
```

***

### Properties

| Property        | Type     | Description                                                                     |
| --------------- | -------- | ------------------------------------------------------------------------------- |
| `publicKey`     | `string` | Hex-encoded secp256k1 public key of the origin, compressed or uncompressed      |
| `publicKeys`    | `never`  | Must be absent. Multisig keys belong in [MultiSigTxParams](multisigtxparams.md) |
| `numSignatures` | `never`  | Must be absent                                                                  |

`fee`, `nonce`, `network`, `postConditions` and `postConditionMode` come from [TxParamsBase](txparamsbase.md).
