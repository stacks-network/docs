# fetchSignerInfo

Reads the signer key registered for a signer-manager. Wraps the pox-5 read-only `get-signer-info`, which reads the `signers` map.

***

### Usage

```ts
import { fetchPoxInfo, fetchSignerInfo, fetchSignerSetFirstItem } from '@stacks/bitcoin-staking';

const { rewardCycleId: rewardCycle } = await fetchPoxInfo({ network: 'mainnet' });
const signerManager = await fetchSignerSetFirstItem({ rewardCycle, network: 'mainnet' });

if (signerManager) {
  const info = await fetchSignerInfo({ signerManager, network: 'mainnet' });
  info?.signerKey; // 33-byte compressed public key, hex
}
```

#### Notes

* `register-signer` writes the entry. Only the signer-manager contract can call it, and the key needs an active signer key grant ([register-signer](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L946-L973)).
* The stored value is a 33-byte compressed public key ([signers](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L183-L189)). `signerKey` is lowercase hex without a `0x` prefix.
* `revoke-signer-grant` leaves this entry in place ([revoke-signer-grant](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2813-L2822)). Use [fetchVerifySignerKeyGrant](fetchverifysignerkeygrant.md) to check that the grant is still active.
* A non-2xx response throws an `Error` whose message starts with `Error calling read-only function.` and includes the status code and URL. If the node reports that the call failed, the `Error` message is the node's `cause`.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L1595-L1621)

***

### Signature

```ts
function fetchSignerInfo(
  opts: { signerManager: string } & NetworkClientParam
): Promise<{ signerKey: string } | undefined>;
```

`opts` is a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md) plus `signerManager`.

***

### Returns

`Promise<{ signerKey: string } | undefined>`

Resolves to the registered key, or `undefined` when the signer-manager has not registered.

| Field       | Type     | Meaning                                                    |
| ----------- | -------- | ---------------------------------------------------------- |
| `signerKey` | `string` | Compressed secp256k1 public key, 33 bytes as lowercase hex |

***

### Parameters

#### opts.signerManager (required)

* **Type**: `string`

Contract principal of the signer-manager, in the form `<address>.<contract-name>`. pox-5 keys signer state by this principal.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
