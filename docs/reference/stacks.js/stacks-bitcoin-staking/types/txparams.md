# TxParams

The transaction parameters every `build*` function in this package takes alongside its own arguments: either [SingleSigTxParams](singlesigtxparams.md) or [MultiSigTxParams](multisigtxparams.md). Builders pass them to `makeUnsignedContractCall` and return an unsigned [StacksTransactionWire](../../stacks-transactions/signing/StacksTransactionWire.md) that calls `pox-5`.

***

### Usage

```ts
import { buildUpdateBondRegistration } from '@stacks/bitcoin-staking';

const args = {
  signerManager: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.new-signer-manager',
  oldSignerManager: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.old-signer-manager',
};

// Single-sig origin
const tx = await buildUpdateBondRegistration({
  ...args,
  publicKey,
  fee: 10_000n,
  nonce,
  network: 'mainnet',
});

// 2-of-3 multisig origin
const multisigTx = await buildUpdateBondRegistration({
  ...args,
  publicKeys: [pubKeyA, pubKeyB, pubKeyC],
  numSignatures: 2,
  fee: 10_000n,
  nonce,
  network: 'mainnet',
});
```

#### Notes

* Builders take the single-sig path when `publicKey` is defined and the multisig path otherwise.
* The transaction is unsigned. Sign it, then broadcast it with [broadcastTransaction](../../stacks-transactions/network/broadcastTransaction.md). A transaction ID confirms submission, not success: a failed pox-5 assert is mined as `abort_by_response` with an `(err uN)` result, which [parsePox5Error](../errors/parsepox5error.md) and [describePox5Error](../errors/describepox5error.md) decode.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/types.ts#L42-L48)

***

### Definition

```ts
export type TxParams = SingleSigTxParams | MultiSigTxParams;
```

***

### Values

| Value                                     | Description                                                            |
| ----------------------------------------- | ---------------------------------------------------------------------- |
| [SingleSigTxParams](singlesigtxparams.md) | Single-signature origin, identified by `publicKey`                     |
| [MultiSigTxParams](multisigtxparams.md)   | M-of-N multisig origin, identified by `publicKeys` and `numSignatures` |
