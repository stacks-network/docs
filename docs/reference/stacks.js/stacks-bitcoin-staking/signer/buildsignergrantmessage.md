# buildSignerGrantMessage

Builds the SIP-018 message and domain that a signer key signs to authorize a signer-manager. Pure computation that mirrors what pox-5 `get-signer-grant-message-hash` hashes.

***

### Usage

```ts
import { buildSignerGrantMessage } from '@stacks/bitcoin-staking';
import { STACKS_MAINNET } from '@stacks/network';
import { signStructuredData } from '@stacks/transactions';

const { message, domain } = buildSignerGrantMessage({
  signerManager: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.my-signer-manager',
  authId: 1n,
  chainId: STACKS_MAINNET.chainId,
});

// The same signature signSignerGrant returns for these inputs.
const signature = signStructuredData({ message, domain, privateKey: process.env.SIGNER_KEY! });
```

#### Notes

* `message` is the tuple `{ topic: "grant-authorization", signer-manager, auth-id }` and `domain` is `{ name: "pox-5-signer", version: "1.0.0", chain-id }`, the values pox-5 hashes ([pox-5.clar L2862-L2877](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2862-L2877), [L90-L95](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L90-L95)).
* pox-5 fills `chain-id` from the chain it runs on, so `chainId` must be that network's chain ID: `1` on mainnet, `0x80000000` on testnet.
* Use it with a signer that takes SIP-018 structured data. With the private key at hand, [signSignerGrant](signsignergrant.md) signs in one call, and [computeSignerGrantHash](computesignergranthash.md) returns the 32-byte hash.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/signer.ts#L22-L53)

***

### Signature

```ts
function buildSignerGrantMessage(opts: SignerKeyGrantOptions): {
  message: ClarityValue;
  domain: ClarityValue;
};
```

`opts` is a [SignerKeyGrantOptions](../types/signerkeygrantoptions.md).

***

### Returns

`{ message: ClarityValue; domain: ClarityValue }`

| Field     | Type                                                            | Meaning                                            |
| --------- | --------------------------------------------------------------- | -------------------------------------------------- |
| `message` | [ClarityValue](../../stacks-transactions/types/ClarityValue.md) | Tuple with `topic`, `signer-manager` and `auth-id` |
| `domain`  | [ClarityValue](../../stacks-transactions/types/ClarityValue.md) | Tuple with `name`, `version` and `chain-id`        |

***

### Parameters

#### opts.signerManager (required)

* **Type**: `string`

Stacks principal of the signer-manager being authorized.

#### opts.authId (required)

* **Type**: `IntegerType`

Replay nonce. pox-5 accepts each signer key, signer-manager and `authId` combination once.

#### opts.chainId (required)

* **Type**: `number`

Chain ID of the network the grant is for, for example `STACKS_MAINNET.chainId`.
