# MultiSigTxParams

Transaction parameters for an M-of-N multisig origin, such as a `bond-admin` held by a 2-of-3 multisig: the [TxParamsBase](txparamsbase.md) fields plus `UnsignedMultiSigOptions` from `@stacks/transactions`. It is one side of the [TxParams](txparams.md) union that every `build*` function accepts.

***

### Usage

```ts
import { buildSetBondAdmin } from '@stacks/bitcoin-staking';
import { TransactionSigner } from '@stacks/transactions';

const tx = await buildSetBondAdmin({
  newAdmin: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR',
  publicKeys: [pubKeyA, pubKeyB, pubKeyC],
  numSignatures: 2,
  fee: 10_000n,
  nonce,
  network: 'mainnet',
});

// Fields follow the order of publicKeys: sign with two keys, append the third.
const signer = new TransactionSigner(tx);
signer.signOrigin(privKeyA);
signer.signOrigin(privKeyB);
signer.appendOrigin(pubKeyC);
```

#### Notes

* Builders default `useNonSequentialMultiSig` to `true`, so the transaction uses the non-sequential multisig hashmode. Pass `useNonSequentialMultiSig: false` for the sequential one. `makeUnsignedContractCall` called directly does the reverse and uses the sequential hashmode unless the option is set.
* Without `address`, the public keys are used in the order given. With `address`, the given order is kept if it derives that address, the sorted order is used if that derives it instead, and otherwise the builder throws `Failed to find matching multi-sig address given public-keys.`
* The returned transaction is unsigned. Sign it with `numSignatures` keys through [TransactionSigner](../../stacks-transactions/signing/TransactionSigner.md) `signOrigin`, and add each remaining public key with `appendOrigin`.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/types.ts#L32-L40)

***

### Definition

```ts
export type MultiSigTxParams = TxParamsBase & UnsignedMultiSigOptions & { publicKey?: never };
```

***

### Properties

| Property                   | Type                 | Description                                                                                                               |
| -------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `publicKeys`               | `PublicKey[]`        | All N public keys of the multisig, hex string or bytes each                                                               |
| `numSignatures`            | `number`             | Signatures required, M in M-of-N                                                                                          |
| `address`                  | `string` (optional)  | Multisig Stacks address. When set, it decides the key order                                                               |
| `useNonSequentialMultiSig` | `boolean` (optional) | Multisig hashmode. Builders in this package default it to `true`. `@stacks/transactions` marks the option `@experimental` |
| `publicKey`                | `never`              | Must be absent. A defined `publicKey` makes the builder treat the params as [SingleSigTxParams](singlesigtxparams.md)     |

`fee`, `nonce`, `network`, `postConditions` and `postConditionMode` come from [TxParamsBase](txparamsbase.md).
