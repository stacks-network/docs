# parsePox5Error

Extracts the `N` from an `(err uN)` contract result. Accepts a Clarity value, such as a read-only call's response, or the `repr` string the Stacks API reports for a transaction result. Pure computation.

***

### Usage

```ts
import { Cl } from '@stacks/transactions';
import { describePox5Error, parsePox5Error } from '@stacks/bitcoin-staking';

parsePox5Error('(err u7)'); // 7
parsePox5Error(Cl.error(Cl.uint(40))); // 40
parsePox5Error('(ok true)'); // undefined

const code = parsePox5Error('(err u24)');
const info = code !== undefined ? describePox5Error(code) : undefined;
info?.name; // 'ERR_INVALID_START_BURN_HEIGHT'
```

#### Notes

* A string must match `(err u<digits>)` after trimming whitespace. A Clarity value must be a `ResponseErr` wrapping a `uint`. Anything else returns `undefined`, including `ok` results and `null` or `undefined` input.
* Any `(err uN)` parses, whichever contract produced it. A pox-5 call can fail with the signer-manager's own error from `validate-stake!`, which `register-for-bond`, `update-bond-registration`, `stake` and `stake-update` return through `try!`, or with the sBTC token's error when `register-for-bond` pulls sBTC from the staker. Read the number as a [Pox5ErrorCode](pox5errorcode.md) only when the error came from pox-5 itself.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/errors.ts#L196-L237)

***

### Signature

```ts
function parsePox5Error(result: ClarityValue | string | undefined): number | undefined;
```

***

### Returns

`number | undefined`

The error number, or `undefined` if `result` is not an `(err uN)`.

***

### Parameters

#### result (required)

* **Type**: `ClarityValue | string | undefined`

A [ClarityValue](../../stacks-transactions/types/ClarityValue.md) response, or the result's `repr` string. `undefined` is accepted and returns `undefined`.
