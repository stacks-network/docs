# fetchEligibleSetBondAdmin

Dry-runs the only check of pox-5 `set-bond-admin`: that the caller is the current bond admin. Reads the admin with [fetchBondAdmin](../fetch/fetchbondadmin.md) and compares. Run it before [buildSetBondAdmin](../build/buildsetbondadmin.md).

***

### Usage

```ts
import { fetchEligibleSetBondAdmin } from '@stacks/bitcoin-staking';

const result = await fetchEligibleSetBondAdmin({
  caller: 'SP72DMR3MJKS7RVBY33JVV7EEJSQ1PYDVKDP10FX', // initial mainnet bond-admin in the pox-5 source
  network: 'mainnet',
});

if (!result.ok) console.log(result.reasons); // [1]: Pox5ErrorCode.Unauthorized
```

#### Notes

* Mirrors [`set-bond-admin`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L451-L467), which asserts `contract-caller` equals the `bond-admin` data-var and otherwise fails with `ERR_UNAUTHORIZED (u1)`.
* The comparison is an exact string match against the current `bond-admin` principal.
* Throws if the `/v2/data_var` read returns a non-2xx response.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/eligibility.ts#L238-L255)

***

### Signature

```ts
function fetchEligibleSetBondAdmin(
  opts: {
    caller: string;
  } & NetworkClientParam
): Promise<EligibilityResult>;
```

`opts` also takes the [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md) fields.

***

### Returns

`Promise<EligibilityResult>`

Resolves to an [EligibilityResult](eligibilityresult.md): `{ ok: true }` if `caller` is the current bond admin, otherwise `{ ok: false, reasons: [Pox5ErrorCode.Unauthorized] }`.

***

### Parameters

#### opts.caller (required)

* **Type**: `string`

The principal that would send the transaction (the contract's `contract-caller`).

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
