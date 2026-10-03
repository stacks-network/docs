# fetchStakerSharesStakedForCycle

Calls the pox-5 `get-staker-shares-staked-for-cycle` read-only and returns the shares one staker has with one signer-manager in one reward cycle: sats for a protocol bond, micro-STX for STX-only staking.

***

### Usage

```ts
import { fetchPoxInfo, fetchStakerSharesStakedForCycle } from '@stacks/bitcoin-staking';

const { rewardCycleId } = await fetchPoxInfo({ network: 'mainnet' });
const staker = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';
const signer = 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.my-signer-manager'; // the staker's signer-manager

// STX-only staking: micro-STX
const ustx = await fetchStakerSharesStakedForCycle({ staker, signer, rewardCycle: rewardCycleId });

// Protocol bond 1: sats
const sats = await fetchStakerSharesStakedForCycle({
  staker,
  signer,
  rewardCycle: rewardCycleId,
  bondIndex: 1,
});
```

#### Notes

* Reads the [`staker-shares-staked-for-cycle`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L267-L276) map through [`get-staker-shares-staked-for-cycle`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3186-L3201). Returns `0n` when there is no entry.
* With `bondIndex` the value is sats; without it the value is micro-STX. The SDK sends `bondIndex` as `(some u<bondIndex>)`, or `none` when you omit it.
* For STX locked in a protocol bond, the contract writes `0` to the micro-STX leg ([L1683-L1686](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1683-L1686), [L1761-L1768](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1761-L1768)).
* Throws an `Error` if the node returns a non-2xx status (the message starts with `Error calling read-only function.`) or answers `okay: false` (the message is the node's `cause`).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L206-L241)

***

### Signature

```ts
function fetchStakerSharesStakedForCycle(
  opts: {
    staker: string;
    signer: string;
    rewardCycle: number;
    bondIndex?: number;
  } & NetworkClientParam
): Promise<bigint>;
```

`opts` is a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md) plus the fields below.

***

### Returns

`Promise<bigint>`

The staker's shares for that signer-manager and cycle: sats when `bondIndex` is set, micro-STX when it is omitted.

***

### Parameters

#### opts.staker (required)

* **Type**: `string`

Stacks address of the staker.

#### opts.signer (required)

* **Type**: `string`

Contract principal of the signer-manager the staker is delegated to.

#### opts.rewardCycle (required)

* **Type**: `number`

Reward cycle to read.

#### opts.bondIndex (optional)

* **Type**: `number`

Protocol bond index. Set it to read the bond's sats shares; omit it to read micro-STX shares from STX-only staking.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
