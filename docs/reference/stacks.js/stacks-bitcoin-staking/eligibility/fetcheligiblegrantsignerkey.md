# fetchEligibleGrantSignerKey

Dry-runs the checks of pox-5 `grant-signer-key`: that the grant has not been used and that the signature recovers to the signer key. The signature check runs locally with [verifySignerGrant](../signer/verifysignergrant.md). Run it before [buildGrantSignerKey](../build/buildgrantsignerkey.md).

***

### Usage

```ts
import { STACKS_MAINNET } from '@stacks/network';
import { privateKeyToPublic } from '@stacks/transactions';
import { fetchEligibleGrantSignerKey, signSignerGrant } from '@stacks/bitcoin-staking';

const signerPrivateKey = process.env.SIGNER_PRIVATE_KEY!; // compressed private key, hex ending in 01
const signerManager = 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.my-signer-manager';
const authId = 1n;

const signerSignature = signSignerGrant({
  signerManager,
  authId,
  chainId: STACKS_MAINNET.chainId,
  privateKey: signerPrivateKey,
});

const result = await fetchEligibleGrantSignerKey({
  signerKey: privateKeyToPublic(signerPrivateKey),
  signerManager,
  authId,
  signerSignature,
  network: 'mainnet',
});
```

#### Notes

* Mirrors the asserts of [`grant-signer-key`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2743-L2811).
* The chain ID in the signed SIP-018 domain comes from `opts.network`, defaulting to `'mainnet'`. A signature made for another chain ID fails the signature gate.
* The contract has two signature errors: `ERR_INVALID_SIGNATURE_RECOVER (u13)` when no key can be recovered, and `ERR_INVALID_SIGNATURE_PUBKEY (u14)` when the recovered key differs from `signerKey`. This function reports both as `InvalidSignaturePubkey`.
* Not checked: `contract-caller` must be `signerManager`, or the call fails with `ERR_UNAUTHORIZED_SIGNER_REGISTRATION (u26)`. The signer-manager contract itself must call `grant-signer-key`.
* Throws if the `used-signer-key-grants` read returns a non-2xx response.

| Reason                   | Contract error                       | Added when                                                        |
| ------------------------ | ------------------------------------ | ----------------------------------------------------------------- |
| `SignerKeyGrantUsed`     | `ERR_SIGNER_KEY_GRANT_USED (u12)`    | The `(signerKey, signerManager, authId)` grant was already used   |
| `InvalidSignaturePubkey` | `ERR_INVALID_SIGNATURE_PUBKEY (u14)` | `signerSignature` is malformed or does not recover to `signerKey` |

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/eligibility.ts#L860-L913)

***

### Signature

```ts
function fetchEligibleGrantSignerKey(
  opts: {
    signerKey: Uint8Array | string;
    signerManager: string;
    authId: IntegerType;
    signerSignature: Uint8Array | string;
  } & NetworkClientParam
): Promise<EligibilityResult>;
```

`opts` also takes the [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md) fields.

***

### Returns

`Promise<EligibilityResult>`

Resolves to an [EligibilityResult](eligibilityresult.md): `{ ok: true }`, or `{ ok: false, reasons }` with every failing gate from the Notes table.

***

### Parameters

#### opts.signerKey (required)

* **Type**: `Uint8Array | string`

Signer public key being granted: 33-byte compressed, as bytes or hex.

#### opts.signerManager (required)

* **Type**: `string`

Contract ID of the signer-manager being authorized.

#### opts.authId (required)

* **Type**: `IntegerType`

Replay nonce signed into the grant. Each `(signerKey, signerManager, authId)` combination can be used once.

#### opts.signerSignature (required)

* **Type**: `Uint8Array | string`

The 65-byte RSV signature over the grant message, as produced by [signSignerGrant](../signer/signsignergrant.md).

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query and take the chain ID from: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
