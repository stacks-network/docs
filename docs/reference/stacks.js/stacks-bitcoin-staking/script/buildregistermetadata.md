# buildRegisterMetadata

Derives the lockup address, witness script, output script, staker subscript and unlock height for a paired-BTC `register-for-bond` in one call. Combines [computeBondUnlockHeight](computebondunlockheight.md), [buildUnlockScript](buildunlockscript.md) and [buildLockScript](buildlockscript.md). Pure computation: no network call.

***

### Usage

```ts
import { buildRegisterMetadata, fetchBond, fetchPoxInfo } from '@stacks/bitcoin-staking';

const bondIndex = 2;
const poxInfo = await fetchPoxInfo({ network: 'mainnet' });
const bond = await fetchBond({ bondIndex, network: 'mainnet' });
if (!bond) throw new Error(`bond ${bondIndex} is not set up`);

const meta = buildRegisterMetadata({
  bondIndex,
  poxInfo,
  bitcoinPublicKey: '02a1633cafcc01ebfb6d78e39f687a1f0995c62fc95f51ead10a02ee0be551b5dc',
  stxAddress: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
  earlyUnlockBytes: bond.earlyUnlockBytes,
  network: 'mainnet',
});

meta.lockAddress; // send the sats to lock here
meta.unlockHeight; // 994700 for mainnet bond 2
```

#### Notes

* The unlock height is the bond's minimum, from [computeBondUnlockHeight](computebondunlockheight.md). To commit to a later height, build the pieces with [buildUnlockScript](buildunlockscript.md), [buildLockScript](buildlockscript.md) and [buildLockAddress](buildlockaddress.md).
* Throws in the same cases as [computeBondUnlockHeight](computebondunlockheight.md), [buildUnlockScript](buildunlockscript.md) and [buildLockScript](buildlockscript.md).
* After the funding transaction confirms, pass `meta.lockScript` and `meta.unlockHeight` to [buildLockProof](../proof/buildlockproof.md) or [buildLockProofFromBlock](../proof/buildlockprooffromblock.md), then pass the proof and `meta.unlockBytes` to [buildRegisterForBond](../build/buildregisterforbond.md) as `lockup: { kind: 'btc', outputs: [proof], unlockBytes: meta.unlockBytes }`.
* Store `meta.lockScript`. [buildReclaim](../reclaim/buildreclaim.md) needs it to spend the lockup.
* The address encoding follows `network`: `bc` on `'mainnet'`, `tb` on `'testnet'`, `bcrt` on `'devnet'` and `'mocknet'`.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/script.ts#L518-L585)

***

### Signature

```ts
function buildRegisterMetadata(opts: {
  bondIndex: number;
  poxInfo: PoxInfo;
  bitcoinPublicKey: Uint8Array | string;
  stxAddress: string;
  earlyUnlockBytes: Uint8Array | string;
  network: StacksNetworkName | StacksNetwork;
  validateEarlyUnlockBytes?: boolean;
}): RegisterMetadata;
```

***

### Returns

`RegisterMetadata`

A [RegisterMetadata](registermetadata.md).

***

### Parameters

#### opts.bondIndex (required)

* **Type**: `number`

The bond period index to register for.

#### opts.poxInfo (required)

* **Type**: `PoxInfo`

The result of [fetchPoxInfo](../fetch/fetchpoxinfo.md), used to compute the unlock height.

#### opts.bitcoinPublicKey (required)

* **Type**: `Uint8Array | string`

The staker's 33-byte compressed public key, as bytes or hex. It signs the reclaim of the lockup.

#### opts.stxAddress (required)

* **Type**: `string`

The staker's Stacks principal, standard or contract. It must be the address that sends `register-for-bond`.

#### opts.earlyUnlockBytes (required)

* **Type**: `Uint8Array | string`

The bond's early-unlock subscript, as bytes or hex. Read it from [fetchBond](../fetch/fetchbond.md).

#### opts.network (required)

* **Type**: `StacksNetworkName | StacksNetwork`

The network whose Bitcoin address encoding to use: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object.

#### opts.validateEarlyUnlockBytes (optional)

* **Type**: `boolean`

Set to `false` to skip the shape check on `earlyUnlockBytes`. The structural check still runs. Defaults to `true`.
