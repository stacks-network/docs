# fetchProtocolBond

Calls the pox-5 `get-protocol-bond` read-only and returns a protocol bond's configuration, or `undefined` if `setup-bond` has not been called for that index.

***

### Usage

```ts
import { fetchProtocolBond } from '@stacks/bitcoin-staking';

const bond = await fetchProtocolBond({ bondIndex: 1, network: 'mainnet' });
const isBondSetup = bond !== undefined;
```

#### Notes

* [`get-protocol-bond`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3322-L3324) returns `(map-get? protocol-bonds bond-index)`, so the result matches [fetchBond](fetchbond.md), which reads the map directly.
* [fetchBondStatus](fetchbondstatus.md) calls this function to decide `isBondSetup` when you do not pass it.
* Throws an `Error` if the node returns a non-2xx status (the message starts with `Error calling read-only function.`) or answers `okay: false` (the message is the node's `cause`).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L273-L298)

***

### Signature

```ts
function fetchProtocolBond(
  opts: { bondIndex: number } & NetworkClientParam
): Promise<Bond | undefined>;
```

`opts` is a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md) plus `bondIndex`.

***

### Returns

`Promise<Bond | undefined>`

Resolves to a [Bond](../types/bond.md), or `undefined` when the contract returns `none`.

***

### Parameters

#### opts.bondIndex (required)

* **Type**: `number`

Index of the protocol bond.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
