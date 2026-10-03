# buildStakeUpdate

Builds an unsigned contract call to pox-5 `stake-update`, which changes the sender's active STX-only stake. One call can extend the lock, add STX and switch signer-manager.

***

### Usage

```ts
import {
  buildStakeUpdate,
  fetchEligibleStakeUpdate,
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
const current = info.details.signer;

const cyclesToExtend = 3;
const amountIncrease = 500_000n; // 0.5 STX in micro-STX

const check = await fetchEligibleStakeUpdate({
  staker,
  signerManager: current,
  oldSignerManager: current,
  cyclesToExtend,
  amountIncrease,
  network,
});
if (!check.ok) throw new Error(`stake-update would fail: ${check.reasons}`);

const tx = await buildStakeUpdate({
  signerManager: current, // same signer-manager: no switch
  oldSignerManager: current,
  cyclesToExtend,
  amountIncrease,
  publicKey: publicKeyToHex(privateKeyToPublic(privateKey)),
  fee: 10_000n, // micro-STX
  nonce: await fetchNonce({ address: staker, network }),
  network,
  postConditions: [Pc.principal(staker).willSendEq(amountIncrease).ustxToLock()],
});

new TransactionSigner(tx).signOrigin(privateKey);
const result = await broadcastTransaction({ transaction: tx, network });
```

#### Notes

* Changes apply from the next reward cycle. The current cycle keeps the old amount and signer-manager ([pox-5.clar L1088-L1173](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1088-L1173)).
* pox-5 recomputes the remaining lock from the next cycle, `unlock-cycle - current-cycle - 1`, and requires it to be 1 to 96 (`ERR_INVALID_NUM_CYCLES (u20)`). In the stake's final locked cycle that value is 0, so a call that does not extend fails with u20: extend in the same call.
* Send it during the reward phase of any cycle, which excludes its last `prepareCycleLength` Bitcoin blocks (100 on mainnet), the prepare phase. In the prepare phase it fails with `ERR_STAKE_IN_PREPARE_PHASE (u47)`.
* Fails with `ERR_NOT_STAKING (u27)` without an active STX-only stake, and `ERR_INVALID_OLD_SIGNER_MANAGER (u36)` when `oldSignerManager` is not the recorded signer-manager.
* `signerManager` must be registered (`ERR_SIGNER_NOT_FOUND (u23)`) with an active signer key grant (`ERR_SIGNER_KEY_GRANT_NOT_FOUND (u17)`), even when it is unchanged. Its `validate-stake!` can reject the update with its own error code.
* The sender's unlocked balance must cover `amountIncrease` (`ERR_INSUFFICIENT_STX (u8)`). Locked STX does not count here, unlike in `stake`.
* [fetchEligibleStakeUpdate](../eligibility/fetcheligiblestakeupdate.md) dry-runs every check except the signer-manager's `validate-stake!`.
* Attach a staking post condition for `amountIncrease` with `ustxToLock()`, as in the Usage example. Without it, the default `deny` mode aborts a top-up with `abort_by_post_condition`.
* A txid from [broadcastTransaction](../../stacks-transactions/network/broadcastTransaction.md) confirms submission only. The call can still fail on-chain: read the mined transaction's result and pass an `(err uN)` to [parsePox5Error](../errors/parsepox5error.md).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/build.ts#L481-L550)

***

### Signature

```ts
function buildStakeUpdate(
  args: {
    signerManager: string;
    oldSignerManager: string;
    cyclesToExtend?: number;
    amountIncrease?: IntegerType;
    signerCalldata?: Uint8Array | string;
  } & TxParams
): Promise<StacksTransactionWire>;
```

The transaction fields come from [TxParams](../types/txparams.md).

***

### Returns

`Promise<StacksTransactionWire>`

Resolves to an unsigned [StacksTransactionWire](../../stacks-transactions/signing/StacksTransactionWire.md) that calls pox-5 `stake-update`. Sign it with [TransactionSigner](../../stacks-transactions/signing/TransactionSigner.md), then send it with [broadcastTransaction](../../stacks-transactions/network/broadcastTransaction.md).

***

### Parameters

#### args.signerManager (required)

* **Type**: `string`

Contract principal of the signer-manager to use from the next cycle. Pass the current one to keep it.

#### args.oldSignerManager (required)

* **Type**: `string`

Contract principal of the signer-manager recorded for the stake now. [fetchStakerInfo](../fetch/fetchstakerinfo.md) returns it as `details.signer`.

#### args.cyclesToExtend (optional)

* **Type**: `number`

Reward cycles to add to the lock. Defaults to `0`.

#### args.amountIncrease (optional)

* **Type**: `IntegerType`

STX to add to the lock, in micro-STX. Defaults to `0n`.

#### args.signerCalldata (optional)

* **Type**: `Uint8Array | string`

Up to 500 bytes, as bytes or hex, that pox-5 forwards unread to the signer-manager's `validate-stake!`. Omitted, the contract receives `none`. [buildSignerCalldata](../signer/buildsignercalldata.md) encodes an L1 BTC payout election for signer-managers that read that format.

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
