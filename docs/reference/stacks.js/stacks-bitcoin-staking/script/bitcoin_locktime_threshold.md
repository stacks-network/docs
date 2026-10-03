# BITCOIN\_LOCKTIME\_THRESHOLD

The `CHECKLOCKTIMEVERIFY` value at which Bitcoin reads a locktime as a Unix timestamp instead of a block height (BIP-65). pox-5 rejects an L1 lockup whose unlock height is at or above it.

***

### Usage

```ts
import { BITCOIN_LOCKTIME_THRESHOLD } from '@stacks/bitcoin-staking';

const unlockHeight = 994_700n; // L1 unlock height of mainnet bond 2

if (unlockHeight >= BITCOIN_LOCKTIME_THRESHOLD) {
  throw new Error('Bitcoin would read this unlock height as a timestamp');
}
```

#### Notes

* The value is a `bigint`: 500,000,000.
* Mirrors the pox-5 constant `BITCOIN_LOCKTIME_THRESHOLD` ([L87-L88](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L87-L88)). `register-for-bond` rejects a lockup output whose `unlock-burn-height` is at or above it with `ERR_INVALID_UNLOCK_HEIGHT (u52)` ([L2077-L2078](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2077-L2078)).
* [buildLockScript](buildlockscript.md), and every helper that calls it, throws before building a script for an `unlockHeight` at or above this value.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/script.ts#L90-L96)

***

### Definition

```ts
const BITCOIN_LOCKTIME_THRESHOLD = 500000000n;
```
