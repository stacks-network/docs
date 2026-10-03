# fetchSignerKeyGrantUsed

Checks whether a signer-key grant with a given auth ID has already been consumed. Reads the pox-5 `used-signer-key-grants` map directly through the node's `/v2/map_entry` endpoint.

***

### Usage

```ts
import { fetchSignerKeyGrantUsed } from '@stacks/bitcoin-staking';

async function authIdUsed(signerKey: string, signerManager: string, authId: number) {
  return fetchSignerKeyGrantUsed({ signerKey, signerManager, authId, network: 'mainnet' });
}
```

#### Notes

* `grant-signer-key` records each `(signer-key, signer-manager, auth-id)` triple and reverts with `ERR_SIGNER_KEY_GRANT_USED (u12)` when the triple is already recorded ([grant-signer-key](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2757-L2789)). Check it before [buildGrantSignerKey](../build/buildgrantsignerkey.md) and pick an unused `authId`.
* `revoke-signer-grant` deletes only the `signer-key-grants` entry ([revoke-signer-grant](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2854-L2857)), so an auth ID stays used after a revocation.
* A non-2xx response, or a response without data, throws an `Error` whose message starts with `Error fetching map entry for map "used-signer-key-grants"`.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L1664-L1693)

***

### Signature

```ts
function fetchSignerKeyGrantUsed(
  opts: {
    signerKey: Uint8Array | string;
    signerManager: string;
    authId: IntegerType;
  } & NetworkClientParam
): Promise<boolean>;
```

`opts` is a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md) plus `signerKey`, `signerManager` and `authId`.

***

### Returns

`Promise<boolean>`

Resolves to `true` if the triple has been used.

***

### Parameters

#### opts.signerKey (required)

* **Type**: `Uint8Array | string`

Compressed secp256k1 public key, 33 bytes, as bytes or hex.

#### opts.signerManager (required)

* **Type**: `string`

Contract principal of the signer-manager, in the form `<address>.<contract-name>`. pox-5 keys signer state by this principal.

#### opts.authId (required)

* **Type**: `IntegerType`

Auth ID of the grant.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
