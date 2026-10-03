# fetchBondAdmin

Reads the pox-5 `bond-admin` data-var and returns the principal that can set up protocol bonds and transfer the role.

***

### Usage

```ts
import { fetchBondAdmin } from '@stacks/bitcoin-staking';

const bondAdmin = await fetchBondAdmin({ network: 'mainnet' });
```

#### Notes

* Reads the [`bond-admin`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L344-L348) data-var through the node's `/v2/data_var` endpoint. pox-5 has no read-only accessor for it.
* `setup-bond` ([L532](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L532)) and `set-bond-admin` ([L460](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L460)) fail with `ERR_UNAUTHORIZED (u1)` unless `contract-caller` equals this principal.
* The value changes when `set-bond-admin` succeeds, so read it rather than caching it. On networks other than mainnet, the node sets the initial value from its configuration before deploying pox-5.
* A non-2xx response throws an `Error` whose message starts with `Error fetching bond-admin.` and includes the status code and URL.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L326-L334)

***

### Signature

```ts
function fetchBondAdmin(opts?: NetworkClientParam): Promise<string>;
```

`opts` is a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md).

***

### Returns

`Promise<string>`

The `bond-admin` principal as a Stacks address string. A contract principal comes back as `<address>.<contract-name>`.

***

### Parameters

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
