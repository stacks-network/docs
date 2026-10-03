# fetchConstructLockupScript

Calls the pox-5 `construct-lockup-script` read-only and returns the L1 lockup witness script the contract builds for a staker, unlock height and pair of unlock subscripts. Use it to check a script built locally with [buildLockScript](../script/buildlockscript.md) before you fund it.

***

### Usage

```ts
import { bytesToHex } from '@stacks/common';
import {
  buildLockScript,
  buildUnlockScript,
  fetchBond,
  fetchBondL1UnlockHeight,
  fetchConstructLockupScript,
} from '@stacks/bitcoin-staking';

const bond = await fetchBond({ bondIndex: 1, network: 'mainnet' });
if (!bond) throw new Error('bond 1 is not set up');

const params = {
  stxAddress: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
  unlockHeight: await fetchBondL1UnlockHeight({ bondIndex: 1, network: 'mainnet' }),
  unlockBytes: buildUnlockScript('0316e35d38b52d4886e40065e4952a49535ce914e02294be58e252d1998f129b19'), // staker's compressed public key
  earlyUnlockBytes: bond.earlyUnlockBytes,
};

const onchain = await fetchConstructLockupScript({ ...params, network: 'mainnet' });
const local = buildLockScript(params);

if (bytesToHex(onchain) !== bytesToHex(local)) {
  throw new Error('Local lockup script does not match pox-5. Do not fund it.');
}
```

#### Notes

* Wraps [`construct-lockup-script`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3682-L3731). The script is `OP_IF <unlockHeight> OP_CHECKLOCKTIMEVERIFY OP_ELSE OP_SIZE <32> OP_EQUALVERIFY OP_SHA256 <H> OP_EQUALVERIFY <earlyUnlockBytes> OP_ENDIF OP_VERIFY <unlockBytes>`, where `<H>` is `sha256(sha256(to-consensus-buff? staker))`.
* `register-for-bond` rebuilds this script for every L1 lockup output and fails with `ERR_INVALID_LOCKUP_SCRIPT (u42)` if the output does not pay to it ([L2061-L2064](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2061-L2064), [L2080-L2082](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2080-L2082)).
* An `unlockHeight` of 2^39 (549,755,813,888) or more makes the contract return `ERR_INVALID_UNLOCK_HEIGHT (u52)`. The SDK then throws an `Error` whose message starts with `construct-lockup-script returned (err u52)`, followed by the error's name and description.
* This read-only does not check the bond's minimum unlock height or the 500,000,000 locktime threshold. `register-for-bond` does ([L2074-L2079](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2074-L2079)), so check the height against [fetchBondL1UnlockHeight](fetchbondl1unlockheight.md) as well.
* For the 34-byte P2WSH output script, use [fetchConstructLockupOutputScript](fetchconstructlockupoutputscript.md).
* Throws an `Error` if the node returns a non-2xx status (the message starts with `Error calling read-only function.`) or answers `okay: false` (the message is the node's `cause`).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L572-L586)

***

### Signature

```ts
function fetchConstructLockupScript(
  opts: ConstructLockupParams & NetworkClientParam
): Promise<Uint8Array>;
```

`opts` is a [ConstructLockupParams](constructlockupparams.md) plus a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md).

***

### Returns

`Promise<Uint8Array>`

The raw witness script bytes.

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
