# BuildSetBondAdminArgs

The call-specific argument of [buildSetBondAdmin](../build/buildsetbondadmin.md): the principal to install as the new `bond-admin`. The builder takes it intersected with [TxParams](txparams.md) and calls pox-5 [`set-bond-admin`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L451-L467).

***

### Usage

```ts
import { buildSetBondAdmin, fetchBondAdmin } from '@stacks/bitcoin-staking';

const currentAdmin = await fetchBondAdmin({ network: 'mainnet' });

const tx = await buildSetBondAdmin({
  newAdmin: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR',
  publicKey: currentAdminPublicKey,
  fee: 10_000n,
  nonce,
  network: 'mainnet',
});
```

#### Notes

* Only the current `bond-admin` can call `set-bond-admin`. Any other caller fails with `ERR_UNAUTHORIZED (u1)`. Read the current value with [fetchBondAdmin](../fetch/fetchbondadmin.md).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/types.ts#L211-L214)

***

### Definition

```ts
export interface BuildSetBondAdminArgs {
  /** Principal to install as the new `bond-admin`. */
  newAdmin: string;
}
```

***

### Properties

| Property   | Type     | Description                                                       |
| ---------- | -------- | ----------------------------------------------------------------- |
| `newAdmin` | `string` | Standard or contract principal to install as the new `bond-admin` |
