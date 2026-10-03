# describePox5Error

Looks up a pox-5 error number and returns its contract constant name and a one-line description. Pure computation over tables in the SDK.

***

### Usage

```ts
import { describePox5Error } from '@stacks/bitcoin-staking';

describePox5Error(7);
// { code: 7, name: 'ERR_BOND_NOT_FOUND', description: 'No bond was found for the supplied bond index.' }

describePox5Error(43n)?.name; // 'ERR_BOND_ALREADY_STARTED'
describePox5Error(6); // undefined: no pox-5 constant uses u6
```

#### Notes

* Accepts `number` or `bigint`. The input goes through `Number()` before the lookup.
* Returns `undefined` for any number that is not a [Pox5ErrorCode](pox5errorcode.md) value.
* Pair it with [parsePox5Error](parsepox5error.md) to describe a failed transaction's `(err uN)`. A number that came from another contract, such as the signer-manager or the sBTC token, returns a pox-5 description that does not apply, if the number is in use in pox-5.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/errors.ts#L239-L249)

***

### Signature

```ts
function describePox5Error(
  code: number | bigint
): { code: number; name: string; description: string } | undefined;
```

***

### Returns

`{ code: number; name: string; description: string } | undefined`

`undefined` for an unknown number, otherwise:

| Field         | Type     | Meaning                                                   |
| ------------- | -------- | --------------------------------------------------------- |
| `code`        | `number` | The error number                                          |
| `name`        | `string` | The contract constant, for example `'ERR_BOND_NOT_FOUND'` |
| `description` | `string` | One-line explanation from the SDK                         |

***

### Parameters

#### code (required)

* **Type**: `number | bigint`

The error number, as from [parsePox5Error](parsepox5error.md) or an [EligibilityResult](../eligibility/eligibilityresult.md) reason.
