# buildSetBondAdmin

Builds an unsigned contract call to pox-5 `set-bond-admin`, which hands the `bond-admin` role to a new principal. The `bond-admin` is the only principal that can set up protocol bonds with [buildSetupBond](buildsetupbond.md).

***

### Usage

```ts
import { buildSetBondAdmin, fetchEligibleSetBondAdmin } from '@stacks/bitcoin-staking';
import {
  TransactionSigner,
  broadcastTransaction,
  fetchNonce,
  privateKeyToAddress,
  privateKeyToPublic,
  publicKeyToHex,
} from '@stacks/transactions';

const privateKey = process.env.BOND_ADMIN_KEY!; // key of the current bond-admin
const address = privateKeyToAddress(privateKey, 'mainnet');

const check = await fetchEligibleSetBondAdmin({ caller: address, network: 'mainnet' });
if (!check.ok) throw new Error(`set-bond-admin would fail: ${check.reasons}`);

const tx = await buildSetBondAdmin({
  newAdmin: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR',
  publicKey: publicKeyToHex(privateKeyToPublic(privateKey)),
  fee: 10_000n, // micro-STX
  nonce: await fetchNonce({ address, network: 'mainnet' }),
  network: 'mainnet',
});

new TransactionSigner(tx).signOrigin(privateKey);
const result = await broadcastTransaction({ transaction: tx, network: 'mainnet' });
```

#### Notes

* Only the current `bond-admin` can call it. pox-5 compares `contract-caller` with the `bond-admin` data-var and fails with `ERR_UNAUTHORIZED (u1)` otherwise ([pox-5.clar L451-L467](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L451-L467)). Read the current holder with [fetchBondAdmin](../fetch/fetchbondadmin.md).
* The new admin holds the role as soon as the transaction succeeds and does not have to accept it. If `newAdmin` is wrong, only that principal can rotate the role again.
* No asset moves, so the call needs no post conditions.
* A txid from [broadcastTransaction](../../stacks-transactions/network/broadcastTransaction.md) confirms submission only. The call can still fail on-chain: read the mined transaction's result and pass an `(err uN)` to [parsePox5Error](../errors/parsepox5error.md).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/build.ts#L66-L86)

***

### Signature

```ts
function buildSetBondAdmin(args: BuildSetBondAdminArgs & TxParams): Promise<StacksTransactionWire>;
```

`args` combines [BuildSetBondAdminArgs](../types/buildsetbondadminargs.md) with [TxParams](../types/txparams.md).

***

### Returns

`Promise<StacksTransactionWire>`

Resolves to an unsigned [StacksTransactionWire](../../stacks-transactions/signing/StacksTransactionWire.md) that calls pox-5 `set-bond-admin`. Sign it with [TransactionSigner](../../stacks-transactions/signing/TransactionSigner.md), then send it with [broadcastTransaction](../../stacks-transactions/network/broadcastTransaction.md).

***

### Parameters

#### args.newAdmin (required)

* **Type**: `string`

Stacks principal to install as the new `bond-admin`, standard or contract. To hand the role to a multisig, pass the multisig's address.

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
