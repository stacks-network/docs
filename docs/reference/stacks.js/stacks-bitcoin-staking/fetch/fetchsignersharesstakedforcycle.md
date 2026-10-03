# fetchSignerSharesStakedForCycle

Calls the pox-5 `get-signer-shares-staked-for-cycle` read-only and returns the total shares staked with one signer-manager in one reward cycle: sats for a protocol bond, micro-STX for STX-only staking.

***

### Usage

```ts
import { fetchPoxInfo, fetchSignerSharesStakedForCycle } from '@stacks/bitcoin-staking';

const { rewardCycleId } = await fetchPoxInfo({ network: 'mainnet' });
const signerManager = 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.my-signer-manager'; // your signer-manager

// STX-only staking: micro-STX
const ustx = await fetchSignerSharesStakedForCycle({ signerManager, rewardCycle: rewardCycleId });

// Protocol bond 1: sats
const sats = await fetchSignerSharesStakedForCycle({
  signerManager,
  rewardCycle: rewardCycleId,
  bondIndex: 1,
});
```

#### Notes

* Reads the [`signer-shares-staked-for-cycle`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L278-L289) map through [`get-signer-shares-staked-for-cycle`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3172-L3184). Returns `0n` when there is no entry.
* With `bondIndex` the value is sats; without it the value is micro-STX. The SDK sends `bondIndex` as `(some u<bondIndex>)`, or `none` when you omit it.
* The micro-STX figure counts STX-only staking only, not STX locked in protocol bonds. pox-5 writes it only while the signer-manager has at least 50,000,000,000 micro-STX (50,000 STX, `SIGNER_SET_MIN_USTX`) delegated in that cycle ([L1705-L1713](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1705-L1713)) and resets it to `0` when the delegation drops below that ([L1546-L1558](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1546-L1558)).
* For one staker's part of this total, use [fetchStakerSharesStakedForCycle](fetchstakersharesstakedforcycle.md).
* Throws an `Error` if the node returns a non-2xx status (the message starts with `Error calling read-only function.`) or answers `okay: false` (the message is the node's `cause`).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L880-L908)

***

### Signature

```ts
function fetchSignerSharesStakedForCycle(
  opts: {
    signerManager: string;
    rewardCycle: number;
    bondIndex?: number;
  } & NetworkClientParam
): Promise<bigint>;
```

`opts` is a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md) plus the fields below.

***

### Returns

`Promise<bigint>`

The signer-manager's shares for the cycle: sats when `bondIndex` is set, micro-STX when it is omitted.

***

### Parameters

#### opts.signerManager (required)

* **Type**: `string`

Contract principal of the signer-manager.

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
