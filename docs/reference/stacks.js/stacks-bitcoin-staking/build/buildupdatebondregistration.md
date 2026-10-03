# buildUpdateBondRegistration

Builds an unsigned contract call to pox-5 `update-bond-registration`, which moves the sender's protocol bond membership to a different signer-manager. The bond, the locked STX and the BTC side stay as they are.

***

### Usage

```ts
import {
  buildUpdateBondRegistration,
  fetchBondMembership,
  fetchEligibleUpdateBondRegistration,
} from '@stacks/bitcoin-staking';
import {
  Pc,
  TransactionSigner,
  broadcastTransaction,
  fetchNonce,
  privateKeyToAddress,
  privateKeyToPublic,
  publicKeyToHex,
} from '@stacks/transactions';

const network = 'mainnet';
const privateKey = process.env.STAKER_KEY!;
const staker = privateKeyToAddress(privateKey, network);
const signerManager = 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.new-signer-manager';

const membership = await fetchBondMembership({ address: staker, network });
if (!membership) throw new Error('no active bond membership');
const oldSignerManager = membership.signer;

const check = await fetchEligibleUpdateBondRegistration({
  staker,
  signerManager,
  oldSignerManager,
  network,
});
if (!check.ok) throw new Error(`update-bond-registration would fail: ${check.reasons}`);

const tx = await buildUpdateBondRegistration({
  signerManager,
  oldSignerManager,
  publicKey: publicKeyToHex(privateKeyToPublic(privateKey)),
  fee: 10_000n, // micro-STX
  nonce: await fetchNonce({ address: staker, network }),
  network,
  postConditions: [Pc.principal(staker).willPerformPox()],
});

new TransactionSigner(tx).signOrigin(privateKey);
const result = await broadcastTransaction({ transaction: tx, network });
```

#### Notes

* The new signer-manager takes over from the next reward cycle, or from the bond's first reward cycle if the bond has not started. The current cycle stays with the old signer-manager. pox-5 settles rewards for both signer-managers before it moves the membership ([pox-5.clar L844-L943](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L844-L943)).
* Fails with `ERR_NOT_BOND_PARTICIPANT (u34)` when the sender has no bond membership or its bond has ended, and with `ERR_STAKE_IN_PREPARE_PHASE (u47)` in the last `prepareCycleLength` Bitcoin blocks of a reward cycle, 100 on mainnet.
* `oldSignerManager` must be the signer-manager the membership is bound to (`ERR_INVALID_OLD_SIGNER_MANAGER (u36)`), and `signerManager` must differ from it (`ERR_UPDATE_BOND_SAME_SIGNER (u44)`).
* The new signer-manager must be registered (`ERR_SIGNER_NOT_FOUND (u23)`) with an active signer key grant (`ERR_SIGNER_KEY_GRANT_NOT_FOUND (u17)`). Its `validate-stake!` can reject the move with its own error code.
* [fetchEligibleUpdateBondRegistration](../eligibility/fetcheligibleupdatebondregistration.md) dry-runs every check except the new signer-manager's `validate-stake!`.
* `update-bond-registration` is a position-altering PoX action for the sender ([pox\_5.rs](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/pox-locking/src/pox_5.rs#L572-L584)). In the default `deny` mode, and in `originator` mode, the node aborts the transaction unless it carries a PoX post condition for the sender, such as `Pc.principal(staker).willPerformPox()` ([node check](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/crates/stacks-transactions/src/lib.rs#L462-L494)). No asset moves, so no other post condition is needed.
* A txid from [broadcastTransaction](../../stacks-transactions/network/broadcastTransaction.md) confirms submission only. The call can still fail on-chain: read the mined transaction's result and pass an `(err uN)` to [parsePox5Error](../errors/parsepox5error.md).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/build.ts#L313-L354)

***

### Signature

```ts
function buildUpdateBondRegistration(
  args: {
    signerManager: string;
    oldSignerManager: string;
    signerCalldata?: Uint8Array | string;
  } & TxParams
): Promise<StacksTransactionWire>;
```

The transaction fields come from [TxParams](../types/txparams.md).

***

### Returns

`Promise<StacksTransactionWire>`

Resolves to an unsigned [StacksTransactionWire](../../stacks-transactions/signing/StacksTransactionWire.md) that calls pox-5 `update-bond-registration`. Sign it with [TransactionSigner](../../stacks-transactions/signing/TransactionSigner.md), then send it with [broadcastTransaction](../../stacks-transactions/network/broadcastTransaction.md).

***

### Parameters

#### args.signerManager (required)

* **Type**: `string`

Contract principal of the new signer-manager.

#### args.oldSignerManager (required)

* **Type**: `string`

Contract principal of the signer-manager the membership is bound to now. [fetchBondMembership](../fetch/fetchbondmembership.md) returns it as `signer`.

#### args.signerCalldata (optional)

* **Type**: `Uint8Array | string`

Up to 500 bytes, as bytes or hex, that pox-5 forwards unread to the new signer-manager's `validate-stake!`. Omitted, the contract receives `none`. [buildSignerCalldata](../signer/buildsignercalldata.md) encodes an L1 BTC payout election for signer-managers that read that format.

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
