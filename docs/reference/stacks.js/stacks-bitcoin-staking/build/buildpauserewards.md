# buildPauseRewards

Builds an unsigned contract call to pox-5 `pause-rewards`, which permanently stops signers from claiming rewards.

***

### Usage

```ts
import { buildPauseRewards, fetchRewardsPaused } from '@stacks/bitcoin-staking';
import {
  TransactionSigner,
  broadcastTransaction,
  fetchNonce,
  privateKeyToAddress,
  privateKeyToPublic,
  publicKeyToHex,
} from '@stacks/transactions';

const privateKey = process.env.PAUSE_ADMIN_KEY!; // key of the current pause-admin
const address = privateKeyToAddress(privateKey, 'mainnet');

if (!(await fetchRewardsPaused({ network: 'mainnet' }))) {
  const tx = await buildPauseRewards({
    publicKey: publicKeyToHex(privateKeyToPublic(privateKey)),
    fee: 10_000n, // micro-STX
    nonce: await fetchNonce({ address, network: 'mainnet' }),
    network: 'mainnet',
  });

  new TransactionSigner(tx).signOrigin(privateKey);
  const result = await broadcastTransaction({ transaction: tx, network: 'mainnet' });
}
```

#### Notes

* Only the current `pause-admin` can call it. pox-5 compares `contract-caller` with the `pause-admin` data-var and fails with `ERR_UNAUTHORIZED (u1)` otherwise ([pox-5.clar L486-L497](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L486-L497)). Read the current holder with [fetchPauseAdmin](../fetch/fetchpauseadmin.md).
* Nothing in pox-5 sets `rewards-paused` back to `false`. The contract's comment states that rewards keep accumulating in the contract and that recovery requires a hard fork.
* After the pause, every `claim-rewards` call fails with `ERR_REWARDS_PAUSED (u53)` ([L2404](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2404)). `claim-rewards` is the only function that reads the flag, so `calculate-rewards` and `claim-staker-rewards-for-signer` keep running. Read the flag with [fetchRewardsPaused](../fetch/fetchrewardspaused.md).
* No asset moves, so the call needs no post conditions.
* A txid from [broadcastTransaction](../../stacks-transactions/network/broadcastTransaction.md) confirms submission only. The call can still fail on-chain: read the mined transaction's result and pass an `(err uN)` to [parsePox5Error](../errors/parsepox5error.md).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/build.ts#L111-L129)

***

### Signature

```ts
function buildPauseRewards(args: TxParams): Promise<StacksTransactionWire>;
```

`args` is a [TxParams](../types/txparams.md).

***

### Returns

`Promise<StacksTransactionWire>`

Resolves to an unsigned [StacksTransactionWire](../../stacks-transactions/signing/StacksTransactionWire.md) that calls pox-5 `pause-rewards`. Sign it with [TransactionSigner](../../stacks-transactions/signing/TransactionSigner.md), then send it with [broadcastTransaction](../../stacks-transactions/network/broadcastTransaction.md).

***

### Parameters

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
