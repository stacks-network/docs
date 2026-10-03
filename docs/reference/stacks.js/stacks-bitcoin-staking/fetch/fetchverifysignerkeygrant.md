# fetchVerifySignerKeyGrant

Checks whether an active grant authorizes a signer key for a signer-manager. Wraps the pox-5 read-only `verify-signer-key-grant`, which reads the `signer-key-grants` map.

***

### Usage

```ts
import { fetchSignerInfo, fetchVerifySignerKeyGrant } from '@stacks/bitcoin-staking';

async function grantActive(signerManager: string) {
  const info = await fetchSignerInfo({ signerManager, network: 'mainnet' });
  if (!info) return false;
  return fetchVerifySignerKeyGrant({ signerKey: info.signerKey, signerManager, network: 'mainnet' });
}
```

#### Notes

* Returns `true` when the grant exists and `false` when the contract returns `ERR_SIGNER_KEY_GRANT_NOT_FOUND (u17)`, its only error ([verify-signer-key-grant](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2879-L2890)). Any other error code throws an `Error` whose message starts with `verify-signer-key-grant returned (err u`.
* `grant-signer-key` creates the grant ([grant-signer-key](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2791-L2796)) and `revoke-signer-grant` deletes it ([revoke-signer-grant](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2854-L2857)). `register-signer` requires it ([register-signer](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L957)). Per the contract comment, every new-stake entry point checks it again, so a revoked grant stops the signer-manager from accepting new stake ([revoke-signer-grant](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2816-L2821)).
* A non-2xx response throws an `Error` whose message starts with `Error calling read-only function.` and includes the status code and URL. If the node reports that the call failed, the `Error` message is the node's `cause`.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L1623-L1662)

***

### Signature

```ts
function fetchVerifySignerKeyGrant(
  opts: {
    signerKey: Uint8Array | string;
    signerManager: string;
  } & NetworkClientParam
): Promise<boolean>;
```

`opts` is a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md) plus `signerKey` and `signerManager`.

***

### Returns

`Promise<boolean>`

Resolves to `true` if the grant is active.

***

### Parameters

#### opts.signerKey (required)

* **Type**: `Uint8Array | string`

Compressed secp256k1 public key, 33 bytes, as bytes or hex.

#### opts.signerManager (required)

* **Type**: `string`

Contract principal of the signer-manager, in the form `<address>.<contract-name>`. pox-5 keys signer state by this principal.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
