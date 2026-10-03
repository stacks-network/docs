# computeRegisterPreimage

Computes the 32-byte preimage that an early-exit spend of a lockup must reveal: `sha256` of the staker's Clarity consensus serialization. Pure computation: no network call.

***

### Usage

```ts
import { computeRegisterPreimage } from '@stacks/bitcoin-staking';

const preimage = computeRegisterPreimage('SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7');
// 32 bytes: sha256(to-consensus-buff? staker)
```

#### Notes

* The lockup script commits to the staker by the double hash `sha256(sha256(to-consensus-buff? staker))` ([construct-lockup-script](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3711-L3731)). The `OP_ELSE` (early-exit) branch checks that the revealed witness item is 32 bytes and hashes to that commitment, so it needs this single-hash value. The `OP_IF` (locktime) branch does not use it.
* [finalizeReclaim](../reclaim/finalizereclaim.md) calls this for the early-exit path. You need it directly only to assemble the witness yourself.
* Standard and contract principals are both accepted, serialized the same way pox-5 serializes them. Throws if `stxAddress` does not decode as a Stacks address.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/script.ts#L148-L160)

***

### Signature

```ts
function computeRegisterPreimage(stxAddress: string): Uint8Array;
```

***

### Returns

`Uint8Array`

The 32-byte preimage.

***

### Parameters

#### stxAddress (required)

* **Type**: `string`

The staker's Stacks principal, standard or contract. It must be the principal the lockup script was built for.
