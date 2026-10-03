# fetchHasAnnouncedL1EarlyExit

Checks whether a staker has announced an L1 early exit for a protocol bond. Wraps the pox-5 read-only `has-announced-l1-early-exit`, which reads the `protocol-bond-l1-early-exit-announced` map.

***

### Usage

```ts
import { fetchBondMembership, fetchHasAnnouncedL1EarlyExit } from '@stacks/bitcoin-staking';

async function hasAnnounced(staker: string) {
  const bond = await fetchBondMembership({ address: staker, network: 'mainnet' });
  if (!bond) return false;
  return fetchHasAnnouncedL1EarlyExit({ bondIndex: bond.bondIndex, staker, network: 'mainnet' });
}
```

#### Notes

* `announce-l1-early-exit` sets the flag ([announce-l1-early-exit](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1241-L1246)) and reverts with `ERR_L1_EARLY_EXIT_ALREADY_ANNOUNCED (u50)` when it is already set ([announce-l1-early-exit](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1226-L1228)). Check it before [buildAnnounceL1EarlyExit](../build/buildannouncel1earlyexit.md).
* No pox-5 function clears the flag.
* Returns `false` when the contract has no entry ([has-announced-l1-early-exit](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3328-L3338)).
* A non-2xx response throws an `Error` whose message starts with `Error calling read-only function.` and includes the status code and URL. If the node reports that the call failed, the `Error` message is the node's `cause`.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L1572-L1593)

***

### Signature

```ts
function fetchHasAnnouncedL1EarlyExit(
  opts: { bondIndex: number; staker: string } & NetworkClientParam
): Promise<boolean>;
```

`opts` is a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md) plus `bondIndex` and `staker`.

***

### Returns

`Promise<boolean>`

Resolves to `true` if the staker has announced an L1 early exit for the bond.

***

### Parameters

#### opts.bondIndex (required)

* **Type**: `number`

Protocol bond index.

#### opts.staker (required)

* **Type**: `string`

Stacks address of the staker.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
