# fetchEligibleRevokeSignerGrant

Dry-runs the only check of pox-5 `revoke-signer-grant`: that the caller is the Stacks address of the signer key. Computed locally with no network request. Run it before [buildRevokeSignerGrant](../build/buildrevokesignergrant.md).

***

### Usage

```ts
import { privateKeyToPublic } from '@stacks/transactions';
import { fetchEligibleRevokeSignerGrant } from '@stacks/bitcoin-staking';

const signerPrivateKey = process.env.SIGNER_PRIVATE_KEY!; // compressed private key, hex ending in 01

const result = await fetchEligibleRevokeSignerGrant({
  signerKey: privateKeyToPublic(signerPrivateKey),
  caller: 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE',
  network: 'mainnet',
});

if (!result.ok) console.log(result.reasons); // [1]: Pox5ErrorCode.Unauthorized
```

#### Notes

* Mirrors [`revoke-signer-grant`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2824-L2860), which requires `contract-caller` to equal the single-signature address built from `hash160(signerKey)` and otherwise fails with `ERR_UNAUTHORIZED (u1)`.
* The expected address uses the address version of `opts.network`, defaulting to `'mainnet'`. The contract uses the mainnet version on mainnet and the testnet version elsewhere.
* Revoking a grant that does not exist succeeds. The contract result reports `existed: false`.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/eligibility.ts#L915-L934)

***

### Signature

```ts
function fetchEligibleRevokeSignerGrant(
  opts: {
    signerKey: Uint8Array | string;
    caller: string;
  } & NetworkClientParam
): Promise<EligibilityResult>;
```

`opts` also takes the [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md) fields.

***

### Returns

`Promise<EligibilityResult>`

Resolves to an [EligibilityResult](eligibilityresult.md): `{ ok: true }` if `caller` is the signer key's address, otherwise `{ ok: false, reasons: [Pox5ErrorCode.Unauthorized] }`.

***

### Parameters

#### opts.signerKey (required)

* **Type**: `Uint8Array | string`

Signer public key whose grant would be revoked: 33-byte compressed, as bytes or hex.

#### opts.caller (required)

* **Type**: `string`

The principal that would send the transaction (the contract's `contract-caller`).

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network whose address version builds the expected address: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Accepted for a uniform signature. This function makes no request, so it has no effect.
