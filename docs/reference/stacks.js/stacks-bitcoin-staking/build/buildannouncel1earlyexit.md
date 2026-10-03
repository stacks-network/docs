# buildAnnounceL1EarlyExit

Builds an unsigned contract call to pox-5 `announce-l1-early-exit`, which tells pox-5 that a staker has left their L1 BTC lockup early. pox-5 stops counting the staker's BTC for the rest of the bond; their STX stays locked.

***

### Usage

```ts
import {
  buildAnnounceL1EarlyExit,
  fetchBondMembership,
  fetchEligibleAnnounceL1EarlyExit,
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

const membership = await fetchBondMembership({ address: staker, network });
if (!membership?.isL1Lock) throw new Error('no active L1 bond membership');
const oldSignerManager = membership.signer;

const check = await fetchEligibleAnnounceL1EarlyExit({ staker, oldSignerManager, network });
if (!check.ok) throw new Error(`announce-l1-early-exit would fail: ${check.reasons}`);

const tx = await buildAnnounceL1EarlyExit({
  staker,
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

* The staker must send it. pox-5 requires `contract-caller`, `tx-sender` and `staker` to be the same principal, so a call forwarded through another contract also fails with `ERR_UNAUTHORIZED (u1)` ([pox-5.clar L1175-L1257](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1175-L1257)).
* Only for a membership backed by an L1 lockup (`isL1Lock`): an sBTC-backed membership fails with `ERR_CANNOT_ANNOUNCE_L1_EARLY_UNLOCK (u35)` and withdraws with [buildUnstakeSbtc](buildunstakesbtc.md) instead.
* Also fails with `ERR_NOT_BOND_PARTICIPANT (u34)` when the staker has no bond membership or its bond has ended, `ERR_STAKE_IN_PREPARE_PHASE (u47)` in the last `prepareCycleLength` Bitcoin blocks of a reward cycle (100 on mainnet), and `ERR_INVALID_OLD_SIGNER_MANAGER (u36)` when `oldSignerManager` is not the bound signer-manager.
* A second announcement for the same bond fails with `ERR_L1_EARLY_EXIT_ALREADY_ANNOUNCED (u50)`. Check with [fetchHasAnnouncedL1EarlyExit](../fetch/fetchhasannouncedl1earlyexit.md).
* [fetchEligibleAnnounceL1EarlyExit](../eligibility/fetcheligibleannouncel1earlyexit.md) dry-runs every check except the caller check.
* On success, pox-5 settles the staker's rewards, then sets their bond shares to zero from the current reward cycle, or the bond's first reward cycle if it has not started, through the end of the bond, reduces the bond totals by the same sats, and sets the membership's `amount-sats` to 0. The locked STX is untouched and unlocks on the bond's normal schedule.
* `announce-l1-early-exit` is a position-altering PoX action for the sender ([pox\_5.rs](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/pox-locking/src/pox_5.rs#L572-L584)). In the default `deny` mode, and in `originator` mode, the node aborts the transaction unless it carries a PoX post condition for the sender, such as `Pc.principal(staker).willPerformPox()` ([node check](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/crates/stacks-transactions/src/lib.rs#L462-L494)). No Stacks asset moves, so no other post condition is needed.
* A txid from [broadcastTransaction](../../stacks-transactions/network/broadcastTransaction.md) confirms submission only. The call can still fail on-chain: read the mined transaction's result and pass an `(err uN)` to [parsePox5Error](../errors/parsepox5error.md).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/build.ts#L356-L394)

***

### Signature

```ts
function buildAnnounceL1EarlyExit(
  args: {
    staker: string;
    oldSignerManager: string;
  } & TxParams
): Promise<StacksTransactionWire>;
```

The transaction fields come from [TxParams](../types/txparams.md).

***

### Returns

`Promise<StacksTransactionWire>`

Resolves to an unsigned [StacksTransactionWire](../../stacks-transactions/signing/StacksTransactionWire.md) that calls pox-5 `announce-l1-early-exit`. Sign it with [TransactionSigner](../../stacks-transactions/signing/TransactionSigner.md), then send it with [broadcastTransaction](../../stacks-transactions/network/broadcastTransaction.md).

***

### Parameters

#### args.staker (required)

* **Type**: `string`

Stacks address of the staker. It must be the address that signs the transaction.

#### args.oldSignerManager (required)

* **Type**: `string`

Contract principal of the signer-manager the membership is bound to. [fetchBondMembership](../fetch/fetchbondmembership.md) returns it as `signer`.

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
