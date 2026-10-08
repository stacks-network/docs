# ClarityVersion

Enum specifying the version of Clarity used to deploy a smart contract.

***

### Usage

```ts
import { ClarityVersion, makeContractDeploy } from '@stacks/transactions';

const transaction = await makeContractDeploy({
  // ...
  clarityVersion: ClarityVersion.Clarity6,
});
```

#### Notes

* `makeContractDeploy` and `makeUnsignedContractDeploy` default `clarityVersion` to `ClarityVersion.Clarity4` in 7.6.0. Set `clarityVersion` explicitly to deploy under Clarity 5 or Clarity 6.
* A contract that uses a Clarity 6 function, or the `with-staking` and `with-pox` allowances, must be deployed with `ClarityVersion.Clarity6`. `with-stacking` remains valid in Clarity 4 and 5 contracts.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/transactions/src/constants.ts#L50-L62)

***

### Definition

```ts
enum ClarityVersion {
  Clarity1 = 1,
  Clarity2 = 2,
  Clarity3 = 3,
  Clarity4 = 4,
  Clarity5 = 5,
  Clarity6 = 6,
}
```

***

### Values

| Value      | Number | Description                                                                                                                                                                                                                                                                                                                                        |
| ---------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Clarity1` | `1`    | Original Clarity version                                                                                                                                                                                                                                                                                                                           |
| `Clarity2` | `2`    | Clarity 2 with additional features                                                                                                                                                                                                                                                                                                                 |
| `Clarity3` | `3`    | Clarity 3 (Nakamoto)                                                                                                                                                                                                                                                                                                                               |
| `Clarity4` | `4`    | Clarity 4                                                                                                                                                                                                                                                                                                                                          |
| `Clarity5` | `5`    | Clarity 5, enabled with Stacks epoch 3.4                                                                                                                                                                                                                                                                                                           |
| `Clarity6` | `6`    | Clarity 6, enabled with Stacks epoch 4.0 (SIP-044). Adds `ed25519-verify`, `secp256k1-decompress?`, `get-bitcoin-tx-output?` and `verify-merkle-proof`, makes `concat` variadic, and replaces the `with-stacking` allowance with `with-staking` and `with-pox`. Details on [Epoch 4.0 Consensus Changes](../../../epoch-4-0-consensus-changes.md). |

***

### Availability

| Member     | Available from                                 |
| ---------- | ---------------------------------------------- |
| `Clarity4` | `@stacks/transactions` 7.3.0                   |
| `Clarity5` | `@stacks/transactions` 7.4.0, Stacks epoch 3.4 |
| `Clarity6` | `@stacks/transactions` 7.5.0, Stacks epoch 4.0 |
