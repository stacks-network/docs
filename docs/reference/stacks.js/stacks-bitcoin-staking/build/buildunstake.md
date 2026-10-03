# buildUnstake

Builds an unsigned contract call to pox-5 `unstake`, which ends the sender's STX-only stake after the current reward cycle. The STX unlocks at the start of the next cycle.

***

### Usage

```ts
import {
  buildUnstake,
  fetchEligibleUnstake,
  fetchStakerInfo,
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

const info = await fetchStakerInfo({ address: staker, network });
if (!info.staked) throw new Error('no active STX-only stake');
const oldSignerManager = info.details.signer;

const check = await fetchEligibleUnstake({ staker, oldSignerManager, network });
if (!check.ok) throw new Error(`unstake would fail: ${check.reasons}`);

const tx = await buildUnstake({
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

* Send it during the reward phase of any cycle, which excludes its last `prepareCycleLength` Bitcoin blocks (100 on mainnet), the prepare phase. In the prepare phase it fails with `ERR_UNSTAKE_IN_PREPARE_PHASE (u28)`, a different code from the `u47` that `stake` and `stake-update` use ([pox-5.clar L1423-L1470](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1423-L1470)). Check with [isInPreparePhase](../cycles/isinpreparephase.md).
* Fails with `ERR_NOT_STAKING (u27)` without an active STX-only stake, and `ERR_INVALID_OLD_SIGNER_MANAGER (u36)` when `oldSignerManager` is not the recorded signer-manager.
* [fetchEligibleUnstake](../eligibility/fetcheligibleunstake.md) dry-runs every check.
* pox-5 keeps the stake's `amount-ustx`, rewrites `num-cycles` so the stake ends with the current reward cycle, and removes the sender from the signer-manager's later cycles. The sender stays in the current cycle.
* `unstake` is a position-altering PoX action for the sender ([pox\_5.rs](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/pox-locking/src/pox_5.rs#L572-L584)). In the default `deny` mode, and in `originator` mode, the node aborts the transaction unless it carries a PoX post condition for the sender, such as `Pc.principal(staker).willPerformPox()` ([node check](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/crates/stacks-transactions/src/lib.rs#L462-L494)). pox-5 `unstake` transfers no asset, so no other post condition is needed.
* A txid from [broadcastTransaction](../../stacks-transactions/network/broadcastTransaction.md) confirms submission only. The call can still fail on-chain: read the mined transaction's result and pass an `(err uN)` to [parsePox5Error](../errors/parsepox5error.md).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/build.ts#L552-L581)

***

### Signature

```ts
function buildUnstake(
  args: {
    oldSignerManager: string;
  } & TxParams
): Promise<StacksTransactionWire>;
```

The transaction fields come from [TxParams](../types/txparams.md).

***

### Returns

`Promise<StacksTransactionWire>`

Resolves to an unsigned [StacksTransactionWire](../../stacks-transactions/signing/StacksTransactionWire.md) that calls pox-5 `unstake`. Sign it with [TransactionSigner](../../stacks-transactions/signing/TransactionSigner.md), then send it with [broadcastTransaction](../../stacks-transactions/network/broadcastTransaction.md).

***

### Parameters

#### args.oldSignerManager (required)

* **Type**: `string`

Contract principal of the signer-manager recorded for the stake. [fetchStakerInfo](../fetch/fetchstakerinfo.md) returns it as `details.signer`.

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
