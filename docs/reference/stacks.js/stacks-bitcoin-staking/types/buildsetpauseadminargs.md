# BuildSetPauseAdminArgs

The call-specific argument of [buildSetPauseAdmin](../build/buildsetpauseadmin.md): the principal to install as the new `pause-admin`, the role that can call `pause-rewards`. The builder takes it intersected with [TxParams](txparams.md) and calls pox-5 [`set-pause-admin`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L470-L484).

***

### Usage

```ts
import { buildSetPauseAdmin, fetchPauseAdmin } from '@stacks/bitcoin-staking';

const currentAdmin = await fetchPauseAdmin({ network: 'mainnet' });

const tx = await buildSetPauseAdmin({
  newAdmin: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR',
  publicKey: currentAdminPublicKey,
  fee: 10_000n,
  nonce,
  network: 'mainnet',
});
```

#### Notes

* Only the current `pause-admin` can call `set-pause-admin`. Any other caller fails with `ERR_UNAUTHORIZED (u1)`. Read the current value with [fetchPauseAdmin](../fetch/fetchpauseadmin.md).
* The new `pause-admin` can call [`pause-rewards`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L489-L497), which permanently stops signer reward claims. The contract has no unpause function.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/types.ts#L216-L219)

***

### Definition

```ts
export interface BuildSetPauseAdminArgs {
  /** Principal to install as the new `pause-admin`. */
  newAdmin: string;
}
```

***

### Properties

| Property   | Type     | Description                                                        |
| ---------- | -------- | ------------------------------------------------------------------ |
| `newAdmin` | `string` | Standard or contract principal to install as the new `pause-admin` |
