# fetchBondAllowance

Reads a staker's entry in the pox-5 `protocol-bond-allowances` map and returns the maximum sats the staker can register in a protocol bond, or `undefined` if the staker is not on that bond's allowlist.

***

### Usage

```ts
import { fetchBondAllowance } from '@stacks/bitcoin-staking';

const maxSats = await fetchBondAllowance({
  bondIndex: 1,
  address: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
  network: 'mainnet',
});

if (maxSats === undefined) {
  // register-for-bond would fail with ERR_NOT_ALLOWLISTED (u11)
}
```

#### Notes

* Reads the [`protocol-bond-allowances`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L130-L137) map through the node's `/v2/map_entry` endpoint, keyed by `{ bond-index, staker }`.
* `register-for-bond` fails with `ERR_NOT_ALLOWLISTED (u11)` when there is no entry ([L693-L699](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L693-L699)), and with `ERR_TOO_MUCH_SATS (u10)` when the registration's sats exceed the allowance ([L744](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L744)). An allowance of `0n` is an entry, so it passes the first check.
* `setup-bond` writes the allowlist once, and no pox-5 function changes it afterward ([L616-L624](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L616-L624)). A registration does not reduce the value.
* A non-2xx response, or a response without `data`, throws an `Error` whose message starts with `Error fetching map entry for map "protocol-bond-allowances"`.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L845-L873)

***

### Signature

```ts
function fetchBondAllowance(
  opts: { bondIndex: number; address: string } & NetworkClientParam
): Promise<bigint | undefined>;
```

`opts` is a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md) plus the fields below.

***

### Returns

`Promise<bigint | undefined>`

The allowance in sats, or `undefined` when the staker has no entry for the bond.

***

### Parameters

#### opts.bondIndex (required)

* **Type**: `number`

Index of the protocol bond.

#### opts.address (required)

* **Type**: `string`

Stacks address of the staker. A contract principal (`<address>.<contract-name>`) is also accepted.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
