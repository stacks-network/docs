# fetchRewardsPaused

Reads the pox-5 `rewards-paused` data-var and returns `true` once the pause admin has called `pause-rewards`.

***

### Usage

```ts
import { fetchRewardsPaused } from '@stacks/bitcoin-staking';

const paused = await fetchRewardsPaused({ network: 'mainnet' }); // false on mainnet when this was written
```

#### Notes

* Reads the [`rewards-paused`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L354) data-var through the node's `/v2/data_var` endpoint. pox-5 has no read-only accessor for it.
* While it is `true`, `claim-rewards` fails with `ERR_REWARDS_PAUSED (u53)` ([L2404](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2404)).
* The pause is one-way. pox-5 has no unpause function, and the contract's comment states that recovery requires a hard fork ([L486-L497](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L486-L497)).
* A non-2xx response throws an `Error` whose message starts with `Error fetching rewards-paused.` and includes the status code and URL.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L347-L356)

***

### Signature

```ts
function fetchRewardsPaused(opts?: NetworkClientParam): Promise<boolean>;
```

`opts` is a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md).

***

### Returns

`Promise<boolean>`

`true` if signer reward claims are paused, `false` otherwise.

***

### Parameters

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
