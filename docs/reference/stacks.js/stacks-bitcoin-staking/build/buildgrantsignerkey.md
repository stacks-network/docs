# buildGrantSignerKey

Builds an unsigned contract call to pox-5 `grant-signer-key`, which records that a signer key authorizes a signer-manager to register it. The authorization is a SIP-018 signature from the signer key over the signer-manager and an `authId`.

{% hint style="warning" %}
Sent from a wallet, this transaction fails with `ERR_UNAUTHORIZED_SIGNER_REGISTRATION (u26)` for a signer-manager contract. pox-5 requires `contract-caller` to be the signer-manager. See Notes.
{% endhint %}

***

### Usage

```ts
import {
  buildGrantSignerKey,
  fetchEligibleGrantSignerKey,
  signSignerGrant,
} from '@stacks/bitcoin-staking';
import { STACKS_MAINNET } from '@stacks/network';
import {
  fetchNonce,
  privateKeyToAddress,
  privateKeyToPublic,
  publicKeyToHex,
} from '@stacks/transactions';

const network = 'mainnet';
const signerPrivateKey = process.env.SIGNER_KEY!;
const signerKey = publicKeyToHex(privateKeyToPublic(signerPrivateKey));
const signerManager = 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.my-signer-manager';
const authId = 1n;

const signerSignature = signSignerGrant({
  signerManager,
  authId,
  chainId: STACKS_MAINNET.chainId,
  privateKey: signerPrivateKey,
});

const check = await fetchEligibleGrantSignerKey({ signerKey, signerManager, authId, signerSignature, network });
if (!check.ok) throw new Error(`grant-signer-key would fail: ${check.reasons}`);

// contract-caller must equal signerManager: see Notes.
const senderKey = process.env.SENDER_KEY!;
const tx = await buildGrantSignerKey({
  signerKey,
  signerManager,
  authId,
  signerSignature,
  publicKey: publicKeyToHex(privateKeyToPublic(senderKey)),
  fee: 10_000n, // micro-STX
  nonce: await fetchNonce({ address: privateKeyToAddress(senderKey, network), network }),
  network,
});
```

#### Notes

* pox-5 requires `contract-caller` to equal `signerManager` and fails with `ERR_UNAUTHORIZED_SIGNER_REGISTRATION (u26)` otherwise ([pox-5.clar L2743-L2811](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2743-L2811)). This builder calls pox-5 directly, so `contract-caller` is the transaction's origin account. With a signer-manager contract as `signerManager`, the call fails with u26: the signer-manager contract has to submit the grant itself. [signSignerGrant](../signer/signsignergrant.md) and [verifySignerGrant](../signer/verifysignergrant.md) produce and check the signature it forwards. See [Deploy a signer-manager contract](https://docs.stacks.co/operate/deploy-a-signer-manager-contract).
* Each `(signerKey, signerManager, authId)` can be granted once (`ERR_SIGNER_KEY_GRANT_USED (u12)`). Check with [fetchSignerKeyGrantUsed](../fetch/fetchsignerkeygrantused.md).
* pox-5 recovers a public key from `signerSignature` over the grant hash and compares it with `signerKey`. An unrecoverable signature fails with `ERR_INVALID_SIGNATURE_RECOVER (u13)`, a different key with `ERR_INVALID_SIGNATURE_PUBKEY (u14)`. The hash includes the chain ID pox-5 runs on, so sign with the target network's `chainId`.
* [fetchEligibleGrantSignerKey](../eligibility/fetcheligiblegrantsignerkey.md) dry-runs the replay and signature checks. It does not run the caller check.
* On success, pox-5 marks the `authId` used and sets the grant for `(signerKey, signerManager)`. `register-signer` and every staking entry point require that grant. Remove it with [buildRevokeSignerGrant](buildrevokesignergrant.md).
* No asset moves, so the call needs no post conditions.
* A txid from [broadcastTransaction](../../stacks-transactions/network/broadcastTransaction.md) confirms submission only. The call can still fail on-chain: read the mined transaction's result and pass an `(err uN)` to [parsePox5Error](../errors/parsepox5error.md).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/build.ts#L779-L825)

***

### Signature

```ts
function buildGrantSignerKey(args: BuildGrantSignerKeyTxArgs): Promise<StacksTransactionWire>;
```

`args` is a [BuildGrantSignerKeyTxArgs](../types/buildgrantsignerkeytxargs.md), which includes [TxParams](../types/txparams.md).

***

### Returns

`Promise<StacksTransactionWire>`

Resolves to an unsigned [StacksTransactionWire](../../stacks-transactions/signing/StacksTransactionWire.md) that calls pox-5 `grant-signer-key`. Sign it with [TransactionSigner](../../stacks-transactions/signing/TransactionSigner.md), then send it with [broadcastTransaction](../../stacks-transactions/network/broadcastTransaction.md).

***

### Parameters

#### args.signerKey (required)

* **Type**: `Uint8Array | string`

Compressed secp256k1 public key of the signer, 33 bytes, as bytes or hex.

#### args.signerManager (required)

* **Type**: `string`

Stacks principal of the signer-manager being authorized.

#### args.authId (required)

* **Type**: `IntegerType`

Replay nonce. It must be the value the signer signed.

#### args.signerSignature (required)

* **Type**: `Uint8Array | string`

65-byte recoverable signature in RSV order, as bytes or hex, from [signSignerGrant](../signer/signsignergrant.md).

#### args.fee (required)

* **Type**: `IntegerType`

Transaction fee in micro-STX.

#### args.nonce (required)

* **Type**: `IntegerType`

Nonce of the origin account. Read it with [fetchNonce](../../stacks-transactions/network/fetchNonce.md).

#### args.network (required)

* **Type**: `StacksNetworkName | StacksNetwork`

A name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Sets the contract address (the network's boot address, `SP000000000000000000002Q6VF78` on mainnet) and the transaction version and chain ID.

#### args.publicKey (required for a single-sig origin)

* **Type**: `string`

Hex public key of the account that signs the transaction.

#### args.publicKeys and args.numSignatures (required for a multisig origin)

* **Type**: `PublicKey[]` and `number`

Pass these instead of `publicKey` to build for an M-of-N multisig origin. This package defaults `useNonSequentialMultiSig` to `true`; pass `false` for the sequential hash mode. Pass `address` to check the key order against the multisig address.

#### args.postConditions (optional)

* **Type**: `PostCondition[]`

[Post conditions](../../stacks-transactions/types/PostCondition.md) to attach. The builder adds none.

#### args.postConditionMode (optional)

* **Type**: `PostConditionModeName`

`'allow'`, `'deny'` or `'originator'`. Defaults to `'deny'`.
