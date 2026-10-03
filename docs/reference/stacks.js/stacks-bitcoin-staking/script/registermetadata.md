# RegisterMetadata

Everything a staker can derive for a paired-BTC `register-for-bond` before the funding Bitcoin transaction exists. Returned by [buildRegisterMetadata](buildregistermetadata.md).

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

meta.lockAddress; // fund this address with the sats to lock
meta.unlockHeight; // 994700 for mainnet bond 2
// After the funding transaction confirms:
// buildLockProof({ ...proofInputs, lockScript: meta.lockScript, unlockHeight: meta.unlockHeight })
```

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/script.ts#L483-L516)

***

### Definition

```ts
interface RegisterMetadata {
  lockAddress: string;
  lockScript: Uint8Array;
  outputScript: Uint8Array;
  unlockBytes: Uint8Array;
  unlockHeight: number;
}
```

***

### Properties

| Property       | Type         | Description                                                                                                                                                                                                                                          |
| -------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lockAddress`  | `string`     | P2WSH Bitcoin address to fund with the sats to lock                                                                                                                                                                                                  |
| `lockScript`   | `Uint8Array` | Witness script the address commits to. Pass as `lockScript` to [buildLockProof](../proof/buildlockproof.md) or [buildLockProofFromBlock](../proof/buildlockprooffromblock.md), and to [buildReclaim](../reclaim/buildreclaim.md) to spend the lockup |
| `outputScript` | `Uint8Array` | 34-byte P2WSH `scriptPubKey` the funding output must carry, the P2WSH form of `lockScript`                                                                                                                                                           |
| `unlockBytes`  | `Uint8Array` | Staker subscript, `<pubkey> OP_CHECKSIG`. Pass as `lockup.unlockBytes` to [buildRegisterForBond](../build/buildregisterforbond.md)                                                                                                                   |
| `unlockHeight` | `number`     | Bitcoin block height of the `OP_CHECKLOCKTIMEVERIFY` branch, from [computeBondUnlockHeight](computebondunlockheight.md)                                                                                                                              |
