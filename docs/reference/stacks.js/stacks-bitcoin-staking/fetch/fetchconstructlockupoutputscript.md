# fetchConstructLockupOutputScript

Calls the pox-5 `construct-lockup-output-script` read-only and returns the 34-byte P2WSH `scriptPubKey` that an L1 lockup output must pay to. Use it to check an output script built locally with [buildLockOutputScript](../script/buildlockoutputscript.md) before you fund it.

***

### Usage

```ts
import { bytesToHex } from '@stacks/common';
import {
  buildLockOutputScript,
  buildUnlockScript,
  fetchBond,
  fetchBondL1UnlockHeight,
  fetchConstructLockupOutputScript,
} from '@stacks/bitcoin-staking';

const bond = await fetchBond({ bondIndex: 1, network: 'mainnet' });
if (!bond) throw new Error('bond 1 is not set up');

const params = {
  stxAddress: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
  unlockHeight: await fetchBondL1UnlockHeight({ bondIndex: 1, network: 'mainnet' }),
  unlockBytes: buildUnlockScript('0316e35d38b52d4886e40065e4952a49535ce914e02294be58e252d1998f129b19'), // staker's compressed public key
  earlyUnlockBytes: bond.earlyUnlockBytes,
};

const onchain = await fetchConstructLockupOutputScript({ ...params, network: 'mainnet' });
const local = buildLockOutputScript(params);

if (bytesToHex(onchain) !== bytesToHex(local)) {
  throw new Error('Local output script does not match pox-5. Do not fund it.');
}
```

#### Notes

* Wraps [`construct-lockup-output-script`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3733-L3745), which returns `0x0020` followed by the SHA-256 of the script from [fetchConstructLockupScript](fetchconstructlockupscript.md).
* `register-for-bond` calls the same read-only for every L1 lockup output and fails with `ERR_INVALID_LOCKUP_SCRIPT (u42)` if the output's script differs ([L2061-L2064](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2061-L2064), [L2080-L2082](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2080-L2082)).
* An `unlockHeight` of 2^39 (549,755,813,888) or more makes the contract return `ERR_INVALID_UNLOCK_HEIGHT (u52)`. The SDK then throws an `Error` whose message starts with `construct-lockup-output-script returned (err u52)`, followed by the error's name and description.
* This read-only does not check the bond's minimum unlock height or the 500,000,000 locktime threshold. `register-for-bond` does ([L2074-L2079](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2074-L2079)), so check the height against [fetchBondL1UnlockHeight](fetchbondl1unlockheight.md) as well.
* Throws an `Error` if the node returns a non-2xx status (the message starts with `Error calling read-only function.`) or answers `okay: false` (the message is the node's `cause`).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L588-L601)

***

### Signature

```ts
function fetchConstructLockupOutputScript(
  opts: ConstructLockupParams & NetworkClientParam
): Promise<Uint8Array>;
```

`opts` is a [ConstructLockupParams](constructlockupparams.md) plus a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md).

***

### Returns

`Promise<Uint8Array>`

The 34-byte P2WSH `scriptPubKey`.

***

### Parameters

#### opts.stxAddress (required)

* **Type**: `string`

Stacks address of the staker. A contract principal is also accepted.

#### opts.unlockHeight (required)

* **Type**: `IntegerType`

Bitcoin block height for the `OP_CHECKLOCKTIMEVERIFY` branch. Must be below 2^39.

#### opts.unlockBytes (required)

* **Type**: `Uint8Array | string`

Staker-signature subscript, as raw bytes or hex, at most 683 bytes. [buildUnlockScript](../script/buildunlockscript.md) builds the single-key form.

#### opts.earlyUnlockBytes (required)

* **Type**: `Uint8Array | string`

The bond's early-unlock subscript, `earlyUnlockBytes` from [fetchBond](fetchbond.md), as raw bytes or hex, at most 683 bytes.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
