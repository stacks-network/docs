# buildRevokeSignerGrant

Builds an unsigned contract call to pox-5 `revoke-signer-grant`, which deletes a signer key's grant for a signer-manager. The transaction must come from the Stacks account of the signer key itself.

***

### Usage

```ts
import { buildRevokeSignerGrant, fetchEligibleRevokeSignerGrant } from '@stacks/bitcoin-staking';
import {
  TransactionSigner,
  broadcastTransaction,
  fetchNonce,
  privateKeyToAddress,
  privateKeyToPublic,
  publicKeyToHex,
} from '@stacks/transactions';

const network = 'mainnet';
const signerPrivateKey = process.env.SIGNER_KEY!;
const signerKey = publicKeyToHex(privateKeyToPublic(signerPrivateKey));
const address = privateKeyToAddress(signerPrivateKey, network); // the signer key's own account
const signerManager = 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.my-signer-manager';

const check = await fetchEligibleRevokeSignerGrant({ signerKey, caller: address, network });
if (!check.ok) throw new Error(`revoke-signer-grant would fail: ${check.reasons}`);

const tx = await buildRevokeSignerGrant({
  signerKey,
  signerManager,
  publicKey: signerKey,
  fee: 10_000n, // micro-STX
  nonce: await fetchNonce({ address, network }),
  network,
});

new TransactionSigner(tx).signOrigin(signerPrivateKey);
const result = await broadcastTransaction({ transaction: tx, network });
```

#### Notes

* pox-5 derives a standard principal from the hash160 of `signerKey`, with the mainnet address version on mainnet and the testnet version elsewhere, and fails with `ERR_UNAUTHORIZED (u1)` unless it equals `contract-caller` ([pox-5.clar L2813-L2860](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2813-L2860)). Build the transaction as a single-sig origin with the signer key, as in the Usage example. [fetchEligibleRevokeSignerGrant](../eligibility/fetcheligiblerevokesignergrant.md) checks the caller.
* Revoking a grant that does not exist succeeds. The contract's result field `existed` is `false` in that case.
* After the revoke, `register-signer` fails for that signer key and signer-manager, and `stake`, `stake-update`, `register-for-bond` and `update-bond-registration` reject new stake for the signer-manager with `ERR_SIGNER_KEY_GRANT_NOT_FOUND (u17)`. The signer-manager's registration stays, so existing positions run to their end.
* No asset moves, so the call needs no post conditions.
* A txid from [broadcastTransaction](../../stacks-transactions/network/broadcastTransaction.md) confirms submission only. The call can still fail on-chain: read the mined transaction's result and pass an `(err uN)` to [parsePox5Error](../errors/parsepox5error.md).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/build.ts#L827-L856)

***

### Signature

```ts
function buildRevokeSignerGrant(args: BuildRevokeSignerKeyTxArgs): Promise<StacksTransactionWire>;
```

`args` is a [BuildRevokeSignerKeyTxArgs](../types/buildrevokesignerkeytxargs.md), which includes [TxParams](../types/txparams.md).

***

### Returns

`Promise<StacksTransactionWire>`

Resolves to an unsigned [StacksTransactionWire](../../stacks-transactions/signing/StacksTransactionWire.md) that calls pox-5 `revoke-signer-grant`. Sign it with [TransactionSigner](../../stacks-transactions/signing/TransactionSigner.md), then send it with [broadcastTransaction](../../stacks-transactions/network/broadcastTransaction.md).

***

### Parameters

#### args.signerKey (required)

* **Type**: `Uint8Array | string`

Compressed secp256k1 public key of the signer, 33 bytes, as bytes or hex. The transaction's sender must be this key's Stacks address.

#### args.signerManager (required)

* **Type**: `string`

Stacks principal of the signer-manager whose grant is revoked.

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
