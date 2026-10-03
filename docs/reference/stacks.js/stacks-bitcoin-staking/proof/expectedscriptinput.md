# ExpectedScriptInput

How [buildLockProof](buildlockproof.md) and [buildLockProofFromBlock](buildlockprooffromblock.md) find the lockup output in the funding transaction: by its P2WSH `scriptPubKey` (`outputScript`) or by the witness script it commits to (`lockScript`). Provide exactly one.

***

### Usage

```ts
import { buildLockProof } from '@stacks/bitcoin-staking';
import type { EsploraMerkleProof, RegisterMetadata } from '@stacks/bitcoin-staking';

declare const meta: RegisterMetadata; // from buildRegisterMetadata
declare const txHex: string;
declare const header: string;
declare const merkleProof: EsploraMerkleProof;
declare const txCount: number;

const proofInputs = { txHex, header, merkleProof, txCount, unlockHeight: meta.unlockHeight };

// By witness script
const output = buildLockProof({ ...proofInputs, lockScript: meta.lockScript });

// Or by scriptPubKey, with the same result
const same = buildLockProof({ ...proofInputs, outputScript: meta.outputScript });
```

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/proof.ts#L77-L86)

***

### Definition

```ts
type ExpectedScriptInput =
  | { outputScript: Uint8Array | string; lockScript?: never }
  | { lockScript: Uint8Array | string; outputScript?: never };
```

***

### Values

| Value                                    | Description                                                                                                                                                                                                                    |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `{ outputScript: Uint8Array \| string }` | The 34-byte P2WSH `scriptPubKey`, as bytes or hex, for example from [buildLockOutputScript](../script/buildlockoutputscript.md) or [RegisterMetadata](../script/registermetadata.md) `outputScript`                            |
| `{ lockScript: Uint8Array \| string }`   | The witness script, as bytes or hex, for example from [buildLockScript](../script/buildlockscript.md) or [RegisterMetadata](../script/registermetadata.md) `lockScript`. Converted to its P2WSH `scriptPubKey` before matching |
