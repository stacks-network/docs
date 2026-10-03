# fetchSignerGrantMessageHash

Reads the SIP-018 message hash that a signer key signs to grant a signer-manager. Wraps the pox-5 read-only `get-signer-grant-message-hash`.

***

### Usage

```ts
import { bytesToHex } from '@stacks/common';
import { STACKS_MAINNET } from '@stacks/network';
import { computeSignerGrantHash, fetchSignerGrantMessageHash } from '@stacks/bitcoin-staking';

async function hashesMatch(signerManager: string, authId: number) {
  const onChain = await fetchSignerGrantMessageHash({ signerManager, authId, network: 'mainnet' });
  const local = computeSignerGrantHash({ signerManager, authId, chainId: STACKS_MAINNET.chainId });
  return bytesToHex(local) === onChain;
}
```

#### Notes

* Hashes the SIP-018 prefix, the domain `{ name: "pox-5-signer", version: "1.0.0", chain-id }` and the message `{ topic: "grant-authorization", signer-manager, auth-id }` ([get-signer-grant-message-hash](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2865-L2877), [POX\_5\_SIGNER\_DOMAIN](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L91-L95)).
* `grant-signer-key` recovers the signer key from a signature over this hash ([grant-signer-key](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2766-L2778)). [computeSignerGrantHash](../signer/computesignergranthash.md) computes the same hash locally.
* The result is 32 bytes as lowercase hex without a `0x` prefix.
* A non-2xx response throws an `Error` whose message starts with `Error calling read-only function.` and includes the status code and URL. If the node reports that the call failed, the `Error` message is the node's `cause`.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L1695-L1719)

***

### Signature

```ts
function fetchSignerGrantMessageHash(
  opts: { signerManager: string; authId: IntegerType } & NetworkClientParam
): Promise<string>;
```

`opts` is a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md) plus `signerManager` and `authId`.

***

### Returns

`Promise<string>`

Resolves to the 32-byte hash as hex.

***

### Parameters

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
