# buildLockAddress

Builds the P2WSH Bitcoin address that a staker funds to lock BTC for a paired-BTC bond. Combines [buildLockScript](buildlockscript.md) with P2WSH address derivation. Pure computation: no network call.

***

### Usage

```ts
import {
  buildLockAddress,
  computeBondUnlockHeight,
  fetchBond,
  fetchPoxInfo,
} from '@stacks/bitcoin-staking';

const bondIndex = 2;
const poxInfo = await fetchPoxInfo({ network: 'mainnet' });
const bond = await fetchBond({ bondIndex, network: 'mainnet' });
if (!bond) throw new Error(`bond ${bondIndex} is not set up`);

const lockAddress = buildLockAddress({
  stxAddress: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
  unlockHeight: computeBondUnlockHeight({ bondIndex, poxInfo }),
  publicKey: '02a1633cafcc01ebfb6d78e39f687a1f0995c62fc95f51ead10a02ee0be551b5dc',
  earlyUnlockBytes: bond.earlyUnlockBytes,
  network: 'mainnet',
});
// a bc1q... P2WSH address
```

#### Notes

* Pass either `publicKey` or `unlockBytes`. With `publicKey`, the staker subscript is built with [buildUnlockScript](buildunlockscript.md). If both are set, `unlockBytes` wins. If neither is set, it throws.
* Throws in the same cases as [buildLockScript](buildlockscript.md), and as [buildUnlockScript](buildunlockscript.md) when `publicKey` is used.
* The address encoding follows `network`: `bc` on `'mainnet'`, `tb` on `'testnet'`, `bcrt` on `'devnet'` and `'mocknet'`. A `StacksNetwork` object that matches none of these throws.
* This returns only the address. To spend the lockup later you need the witness script, so use [buildRegisterMetadata](buildregistermetadata.md), which returns the address, the script and the output script together, or keep the inputs to rebuild the script with [buildLockScript](buildlockscript.md).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/script.ts#L384-L441)

***

### Signature

```ts
function buildLockAddress(opts: {
  stxAddress: string;
  unlockHeight: IntegerType;
  unlockBytes: Uint8Array | string;
  earlyUnlockBytes: Uint8Array | string;
  network: StacksNetworkName | StacksNetwork;
  validateEarlyUnlockBytes?: boolean;
}): string;
function buildLockAddress(opts: {
  stxAddress: string;
  unlockHeight: IntegerType;
  publicKey: Uint8Array | string;
  earlyUnlockBytes: Uint8Array | string;
  network: StacksNetworkName | StacksNetwork;
  validateEarlyUnlockBytes?: boolean;
}): string;
```

***

### Returns

`string`

The bech32 P2WSH address that commits to the lockup script.

***

### Parameters

#### opts.stxAddress (required)

* **Type**: `string`

The staker's Stacks principal, standard or contract. It must be the address that sends `register-for-bond`.

#### opts.unlockHeight (required)

* **Type**: `IntegerType`

The Bitcoin block height at which the `OP_CHECKLOCKTIMEVERIFY` branch becomes spendable. A number, bigint or numeric string.

#### opts.unlockBytes (required in the first overload)

* **Type**: `Uint8Array | string`

The staker subscript, as bytes or hex.

#### opts.publicKey (required in the second overload)

* **Type**: `Uint8Array | string`

The staker's 33-byte compressed public key, as bytes or hex. Used to build `<pubkey> OP_CHECKSIG` as the staker subscript.

#### opts.earlyUnlockBytes (required)

* **Type**: `Uint8Array | string`

The bond's early-unlock subscript, as bytes or hex. Read it from [fetchBond](../fetch/fetchbond.md).

#### opts.network (required)

* **Type**: `StacksNetworkName | StacksNetwork`

The network whose Bitcoin address encoding to use: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object.

#### opts.validateEarlyUnlockBytes (optional)

* **Type**: `boolean`

Set to `false` to skip the shape check on `earlyUnlockBytes`. The structural check still runs. Defaults to `true`.
