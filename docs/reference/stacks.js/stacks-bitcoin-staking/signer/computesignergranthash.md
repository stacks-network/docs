# computeSignerGrantHash

Computes the 32-byte hash that a signer key signs for a signer-key grant. It equals pox-5 `get-signer-grant-message-hash` for the same signer-manager, `authId` and chain.

***

### Usage

```ts
import { computeSignerGrantHash } from '@stacks/bitcoin-staking';
import { bytesToHex } from '@stacks/common';

const hash = computeSignerGrantHash({
  signerManager: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.my-signer-manager',
  authId: 1n,
  chainId: 1,
});

bytesToHex(hash); // '33b15ac6e3b6a588de6e4e6860d88802e17decabf8ef0c3efc03f8d250fb47e5'
```

#### Notes

* The hash is `sha256("SIP018" || sha256(domain) || sha256(message))` over the Clarity-serialized tuples from [buildSignerGrantMessage](buildsignergrantmessage.md), as in pox-5 ([pox-5.clar L2865-L2877](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2865-L2877)).
* Compare it with the node's result from [fetchSignerGrantMessageHash](../fetch/fetchsignergrantmessagehash.md), which calls the read-only function.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/signer.ts#L55-L62)

***

### Signature

```ts
function computeSignerGrantHash(opts: SignerKeyGrantOptions): Uint8Array;
```

`opts` is a [SignerKeyGrantOptions](../types/signerkeygrantoptions.md).

***

### Returns

`Uint8Array`

The 32-byte SHA-256 hash.

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
