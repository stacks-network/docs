# AccountStatus

An account's STX balance, locked amount, nonce and `unlockHeight`, from the node's `/v2/accounts/<address>` endpoint. Returned by [fetchAccountStatus](../fetch/fetchaccountstatus.md).

***

### Usage

```ts
import { fetchAccountStatus } from '@stacks/bitcoin-staking';

const account = await fetchAccountStatus({ address: stakerAddress, network: 'mainnet' });

const totalUstx = account.balance + account.locked; // micro-STX
const isLocked = account.unlockHeight !== 0;
```

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/types.ts#L147-L161)

***

### Definition

```ts
export interface AccountStatus {
  /** Liquid micro-STX balance. */
  balance: bigint;
  /** Locked (stacked) micro-STX. */
  locked: bigint;
  /** Account nonce. */
  nonce: bigint;
  /** Burn height at which the locked STX unlocks. */
  unlockHeight: number;
}
```

***

### Properties

| Property       | Type     | From `/v2/accounts` | Description                                                                                                                                                                                                                                                |
| -------------- | -------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `balance`      | `bigint` | `balance`           | Liquid micro-STX. [fetchEligibleStake](../eligibility/fetcheligiblestake.md) and [fetchEligibleRegisterForBond](../eligibility/fetcheligibleregisterforbond.md) check `balance + locked` against the amount to lock, as `stake` and `register-for-bond` do |
| `locked`       | `bigint` | `locked`            | Locked micro-STX                                                                                                                                                                                                                                           |
| `nonce`        | `bigint` | `nonce`             | Account nonce                                                                                                                                                                                                                                              |
| `unlockHeight` | `number` | `unlock_height`     | Bitcoin block height at which the locked STX unlocks. `0` when no lock is active                                                                                                                                                                           |
