# signSignerGrant

Signs a signer-key grant with the signer's private key. Returns the signature that [buildGrantSignerKey](../build/buildgrantsignerkey.md) takes as `signerSignature`.

***

### Usage

```ts
import { signSignerGrant, verifySignerGrant } from '@stacks/bitcoin-staking';
import { STACKS_MAINNET } from '@stacks/network';
import { privateKeyToPublic, publicKeyToHex } from '@stacks/transactions';

const privateKey = process.env.SIGNER_KEY!;
const grant = {
  signerManager: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.my-signer-manager',
  authId: 1n,
  chainId: STACKS_MAINNET.chainId,
};

const signature = signSignerGrant({ ...grant, privateKey });

const valid = verifySignerGrant({
  ...grant,
  publicKey: publicKeyToHex(privateKeyToPublic(privateKey)),
  signature,
});
```

#### Notes

* Returns a 65-byte recoverable signature in RSV order, hex-encoded (130 characters), over the hash from [computeSignerGrantHash](computesignergranthash.md).
* pox-5 recovers the public key from the signature and compares it with the 33-byte `signer-key` in `grant-signer-key` ([pox-5.clar L2766-L2778](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2766-L2778)). Sign with the private key of that compressed public key.
* The hash includes the chain ID, so a grant signed for testnet fails on mainnet with `ERR_INVALID_SIGNATURE_PUBKEY (u14)`.
* Each signer key, signer-manager and `authId` combination can be granted once. Check an `authId` with [fetchSignerKeyGrantUsed](../fetch/fetchsignerkeygrantused.md).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/signer.ts#L64-L73)

***

### Signature

```ts
function signSignerGrant(opts: SignerKeyGrantOptions & { privateKey: PrivateKey }): string;
```

`opts` extends [SignerKeyGrantOptions](../types/signerkeygrantoptions.md) with `privateKey`.

***

### Returns

`string`

Hex-encoded 65-byte RSV signature.

***

### Parameters

#### opts.signerManager (required)

* **Type**: `string`

Stacks principal of the signer-manager being authorized.

#### opts.authId (required)

* **Type**: `IntegerType`

Replay nonce of the grant.

#### opts.chainId (required)

* **Type**: `number`

Chain ID of the network the grant is for: `1` on mainnet, `0x80000000` on testnet.

#### opts.privateKey (required)

* **Type**: `PrivateKey`

Private key of the signer key, as hex or bytes.
