# BuildRevokeSignerKeyTxArgs

The arguments of [buildRevokeSignerGrant](../build/buildrevokesignergrant.md): [TxParams](txparams.md) plus the signer key and the signer-manager whose grant to revoke. The builder calls pox-5 [`revoke-signer-grant`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2824-L2860) with them.

***

### Usage

```ts
import { buildRevokeSignerGrant } from '@stacks/bitcoin-staking';

const tx = await buildRevokeSignerGrant({
  signerKey: signerPublicKey,
  signerManager: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.my-signer-manager',
  publicKey: signerPublicKey, // the sender must be the address of signerKey
  fee: 10_000n,
  nonce,
  network: 'mainnet',
});
```

#### Notes

* The sender must be the single-sig Stacks address derived from `signerKey`. Any other caller fails with `ERR_UNAUTHORIZED (u1)`. Set `publicKey` to the signer key and sign with the signer's private key. [fetchEligibleRevokeSignerGrant](../eligibility/fetcheligiblerevokesignergrant.md) checks this read-only.
* Revoking a grant that does not exist succeeds. The result's `existed` field is `false` in that case.
* After a revoke, `stake` and `register-for-bond` to a signer-manager registered with that key fail with `ERR_SIGNER_KEY_GRANT_NOT_FOUND (u17)`, because both re-check the grant with [`verify-signer-key-grant`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2879-L2890). Existing positions stay in place until they expire.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/types.ts#L265-L271)

***

### Definition

```ts
export type BuildRevokeSignerKeyTxArgs = TxParams & {
  /** Compressed secp256k1 public key (33 bytes) of the signer. */
  signerKey: Uint8Array | string;
  /** Stacks principal of the signer-manager whose grant is being revoked. */
  signerManager: string;
};
```

***

### Properties

| Property        | Type                   | Description                                                                                           |
| --------------- | ---------------------- | ----------------------------------------------------------------------------------------------------- |
| `signerKey`     | `Uint8Array \| string` | Signer's compressed secp256k1 public key, 33 bytes, as bytes or hex. Sent as `signer-key` (`buff 33`) |
| `signerManager` | `string`               | Contract principal of the signer-manager whose grant is revoked. Sent as `signer-manager`             |

The transaction fields come from [TxParams](txparams.md).
