# BondStatusName

A bond's status at one Bitcoin block height, including bonds that were never set up. Returned by [bondStatus](bondstatus.md) and [fetchBondStatus](../fetch/fetchbondstatus.md).

***

### Usage

```ts
import { type BondStatusName, fetchBondStatus } from '@stacks/bitcoin-staking';

const status: BondStatusName = await fetchBondStatus({ bondIndex: 1, network: 'mainnet' });

if (status === 'eligible') {
  // the bond admin can call setup-bond for this index now
}
```

#### Notes

* The source marks this `@experimental`.
* A set-up bond resolves to a [BondPhaseName](bondphasename.md). A bond without `setup-bond` resolves to `'too-early'`, `'eligible'` or `'missed'`.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/cycles.ts#L328-L340)

***

### Definition

```ts
type BondStatusName = BondPhaseName | 'too-early' | 'eligible' | 'missed';
```

***

### Values

| Value         | Description                                                                                                                                         |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `'open'`      | Set up. Registration window, from two reward cycles before the start height until `prepareCycleLength` blocks before it                             |
| `'locked'`    | Set up. From the final pre-start prepare phase until the bond's `get-bond-l1-unlock-height`                                                         |
| `'unlocked'`  | Set up. From `get-bond-l1-unlock-height` through the end height inclusive                                                                           |
| `'finished'`  | Set up. After the end height                                                                                                                        |
| `'too-early'` | Not set up. The setup window has not opened. `setup-bond` would fail with `ERR_CANNOT_SETUP_BOND_TOO_SOON (u2)`                                     |
| `'eligible'`  | Not set up. Within two reward cycles before the start height, where the bond admin can call `setup-bond`                                            |
| `'missed'`    | Not set up, and the start height has passed. `setup-bond` fails with `ERR_CANNOT_SETUP_BOND_TOO_LATE (u3)` from here on, so this bond can never run |
