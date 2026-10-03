# SignerKeyGrantOptions

The inputs to the SIP-018 message a signer key signs to authorize a signer-manager. Accepted by [buildSignerGrantMessage](../signer/buildsignergrantmessage.md), [computeSignerGrantHash](../signer/computesignergranthash.md), [signSignerGrant](../signer/signsignergrant.md) and [verifySignerGrant](../signer/verifysignergrant.md). The hash they produce matches pox-5 [`get-signer-grant-message-hash`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2865-L2877).

***

### Usage

```ts
import { signSignerGrant, verifySignerGrant } from '@stacks/bitcoin-staking';
import { STACKS_MAINNET } from '@stacks/network';

const grant = {
  signerManager: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.my-signer-manager',
  authId: 1n,
  chainId: STACKS_MAINNET.chainId, // 1
};

const signature = signSignerGrant({ ...grant, privateKey: signerPrivateKey });
const ok = verifySignerGrant({ ...grant, publicKey: signerPublicKey, signature });
```

#### Notes

* `chainId` must be the chain ID of the network where `grant-signer-key` runs. pox-5 builds the domain from its own `chain-id` ([`POX_5_SIGNER_DOMAIN`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L91-L95)), so a signature made for another chain ID does not recover to the signer key and `grant-signer-key` fails with `ERR_INVALID_SIGNATURE_PUBKEY (u14)`.
* [`grant-signer-key`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2743-L2811) records every signer key, signer-manager and `authId` combination it accepts, and rejects a repeat with `ERR_SIGNER_KEY_GRANT_USED (u12)`. Use a new `authId` for each grant.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/types.ts#L221-L234)

***

### Definition

```ts
export interface SignerKeyGrantOptions {
  /** Stacks principal of the signer-manager contract being authorized. */
  signerManager: string;
  /** Replay nonce: must be unique per grant. */
  authId: IntegerType;
  /** Stacks chain id (e.g. `1` for mainnet, `0x80000000` for testnet). */
  chainId: number;
}
```

***

### Properties

| Property        | Type          | Description                                                                                                                                                  |
| --------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `signerManager` | `string`      | Contract principal of the signer-manager being authorized. Encoded as `signer-manager` in the message                                                        |
| `authId`        | `IntegerType` | Replay nonce, encoded as the `uint` `auth-id` in the message                                                                                                 |
| `chainId`       | `number`      | Stacks chain ID: `1` for mainnet, `0x80000000` for testnet. Read it from a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object's `chainId` |
