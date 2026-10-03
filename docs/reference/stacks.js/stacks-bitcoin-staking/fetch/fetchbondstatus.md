# fetchBondStatus

Returns a protocol bond's status, such as `'open'` or `'locked'`, at the current Bitcoin block height. It fetches the PoX info and the bond's setup state if you do not pass them, then calls [bondStatus](../cycles/bondstatus.md).

***

### Usage

```ts
import { fetchBondStatus, fetchPoxInfo, fetchProtocolBond } from '@stacks/bitcoin-staking';

// Fetches /v2/pox and get-protocol-bond for you
const status = await fetchBondStatus({ bondIndex: 1, network: 'mainnet' });

// Reuses values you already hold, with no extra requests
const poxInfo = await fetchPoxInfo({ network: 'mainnet' });
const bond = await fetchProtocolBond({ bondIndex: 1, network: 'mainnet' });
const sameStatus = await fetchBondStatus({
  bondIndex: 1,
  poxInfo,
  isBondSetup: bond !== undefined,
});
```

#### Notes

* The source marks this `@experimental`.
* Without `opts.poxInfo` it calls [fetchPoxInfo](fetchpoxinfo.md). Without `opts.isBondSetup` it calls [fetchProtocolBond](fetchprotocolbond.md), which reads the pox-5 [`get-protocol-bond`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3322-L3324) read-only. The two requests run in parallel.
* The status is computed at `poxInfo.currentBurnchainBlockHeight`. A `poxInfo` you fetched earlier gives the status at that earlier height.
* Errors from either fetch propagate unchanged.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L358-L388)

***

### Signature

```ts
function fetchBondStatus(
  opts: {
    bondIndex: number;
    poxInfo?: PoxInfo;
    isBondSetup?: boolean;
  } & NetworkClientParam
): Promise<BondStatusName>;
```

`opts` is a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md) plus the fields below.

***

### Returns

`Promise<BondStatusName>`

Resolves to a [BondStatusName](../cycles/bondstatusname.md).

***

### Parameters

#### opts.bondIndex (required)

* **Type**: `number`

Index of the protocol bond.

#### opts.poxInfo (optional)

* **Type**: `PoxInfo`

A [PoxInfo](../types/poxinfo.md) you already hold. Fetched with [fetchPoxInfo](fetchpoxinfo.md) when omitted.

#### opts.isBondSetup (optional)

* **Type**: `boolean`

Whether `setup-bond` has been called for this bond, for example `bond !== undefined` after [fetchProtocolBond](fetchprotocolbond.md). Fetched when omitted.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
