# EligibilityResult

The result of every `fetchEligible*` preflight: `{ ok: true }` when no checked gate would fail, or `{ ok: false, reasons }` with the pox-5 error code of each gate that would. Returned by [fetchEligibleRegisterForBond](fetcheligibleregisterforbond.md), [fetchEligibleStake](fetcheligiblestake.md) and the other `fetchEligible*` functions.

***

### Usage

```ts
import { describePox5Error, fetchEligibleUnstake } from '@stacks/bitcoin-staking';

const result = await fetchEligibleUnstake({
  staker: 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE',
  oldSignerManager: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.my-signer-manager',
  network: 'mainnet',
});

if (!result.ok) {
  for (const code of result.reasons) {
    console.log(code, describePox5Error(code)?.name); // e.g. 27 'ERR_NOT_STAKING'
  }
}
```

#### Notes

* `reasons` always has at least one entry when `ok` is `false`. The type is a non-empty tuple.
* Treat `reasons` as a set. The contract aborts at the first failing assert in its own order, so the code a transaction fails with need not be `reasons[0]`.
* `{ ok: true }` covers only the gates the function checks, at the Bitcoin block height it read. Each function's page lists the gates it does not check, such as the signer-manager's `validate-stake!` call. A transaction can still fail if chain state changes before it is mined.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/eligibility.ts#L43-L55)

***

### Definition

```ts
type EligibilityResult =
  | { ok: true }
  | { ok: false; reasons: [Pox5ErrorCode, ...Pox5ErrorCode[]] };
```

***

### Values

| Value                                                         | Description                                                                                                                                           |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `{ ok: true }`                                                | No checked gate would fail                                                                                                                            |
| `{ ok: false; reasons: [Pox5ErrorCode, ...Pox5ErrorCode[]] }` | At least one checked gate would fail. Each entry is a [Pox5ErrorCode](../errors/pox5errorcode.md): the number the contract would return as `(err uN)` |
