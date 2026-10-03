# fetchPoxInfo

Reads the node's `/v2/pox` endpoint and returns the PoX parameters, the current and next cycle, and the sBTC contracts that pox-5 pays rewards through.

***

### Usage

```ts
import { fetchPoxInfo } from '@stacks/bitcoin-staking';

const poxInfo = await fetchPoxInfo({ network: 'mainnet' });

poxInfo.contractId; // 'SP000000000000000000002Q6VF78.pox-5'
poxInfo.rewardCycleLength; // 2100
poxInfo.sbtcContract; // 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token'
```

#### Notes

* Read `sbtcContract` here instead of hardcoding it. It is fixed on mainnet; on other networks it comes from the node's configuration and can differ from node to node. The sBTC post conditions for `buildRegisterForBond` and `buildUnstakeSbtc` need it.
* `sbtcRegistryContract` is the contract the node reads each cycle's reward recipient from. No pox-5 call moves an asset through it, so post conditions never reference it.
* Without `opts.client`, the request goes to the network's default API: `https://api.mainnet.hiro.so` for `'mainnet'`, `https://api.testnet.hiro.so` for `'testnet'`.
* A non-2xx response throws an `Error` whose message starts with `Error fetching pox info.` and includes the status code and URL.
* The result carries a subset of the node's response. `min_amount_ustx`, `epochs`, `current_epoch` and the next cycle's phase heights are dropped. Request `/v2/pox` directly if you need them.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L40-L78)

***

### Signature

```ts
function fetchPoxInfo(opts?: NetworkClientParam): Promise<PoxInfo>;
```

`opts` is a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md).

***

### Returns

`Promise<PoxInfo>`

Resolves to a [PoxInfo](../types/poxinfo.md): the node's `/v2/pox` response, renamed to camelCase, with micro-STX totals converted to `bigint`.

***

### Parameters

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
