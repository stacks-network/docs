# buildUnstakeSbtc

Builds an unsigned contract call to pox-5 `unstake-sbtc`, which withdraws some or all of the sender's sBTC from an sBTC-backed protocol bond membership. pox-5 transfers the withdrawn sBTC to the sender.

***

### Usage

```ts
import { buildUnstakeSbtc, fetchEligibleUnstakeSbtc, fetchPoxInfo } from '@stacks/bitcoin-staking';
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
const signerManager = 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.my-signer-manager';
const amountToWithdrawSats = 50_000_000n; // 0.5 BTC in sats

const poxInfo = await fetchPoxInfo({ network });

const check = await fetchEligibleUnstakeSbtc({
  staker,
  signerManager,
  amountToWithdrawSats,
  poxInfo,
  network,
});
if (!check.ok) throw new Error(`unstake-sbtc would fail: ${check.reasons}`);

const tx = await buildUnstakeSbtc({
  signerManager,
  amountToWithdrawSats,
  publicKey: publicKeyToHex(privateKeyToPublic(privateKey)),
  fee: 10_000n, // micro-STX
  nonce: await fetchNonce({ address: staker, network }),
  network,
  postConditions: [
    Pc.principal(staker).willPerformPox(),
    Pc.principal(poxInfo.contractId)
      .willSendEq(amountToWithdrawSats)
      .ft(poxInfo.sbtcContract, 'sbtc-token'),
  ],
});

new TransactionSigner(tx).signOrigin(privateKey);
const result = await broadcastTransaction({ transaction: tx, network });
```

#### Notes

* Fails with `ERR_NOT_BOND_PARTICIPANT (u34)` when the sender has no bond membership record. pox-5 reads the record directly, so a membership whose bond has ended still qualifies ([pox-5.clar L1259-L1342](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1259-L1342)).
* Fails with `ERR_INVALID_UNSTAKE_SBTC_AMOUNT (u37)` when `amountToWithdrawSats` exceeds the membership's current sats, `ERR_INVALID_OLD_SIGNER_MANAGER (u36)` when `signerManager` is not the bound signer-manager, and `ERR_CANNOT_UNSTAKE_SBTC (u38)` for a membership backed by an L1 lockup. An L1 staker uses [buildAnnounceL1EarlyExit](buildannouncel1earlyexit.md) instead.
* Send it outside the prepare phase, the last `prepareCycleLength` Bitcoin blocks of a reward cycle, 100 on mainnet (`ERR_STAKE_IN_PREPARE_PHASE (u47)`).
* [fetchEligibleUnstakeSbtc](../eligibility/fetcheligibleunstakesbtc.md) dry-runs every check.
* pox-5 settles rewards, then removes the withdrawn sats from the bond's shares from the current reward cycle, or the bond's first reward cycle if it has not started, through the end of the bond. The membership's locked STX is unchanged.
* `unstake-sbtc` is a position-altering PoX action for the sender ([pox\_5.rs](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/pox-locking/src/pox_5.rs#L572-L584)). In the default `deny` mode, and in `originator` mode, the node aborts the transaction unless it carries a PoX post condition for the sender, such as `Pc.principal(staker).willPerformPox()` ([node check](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/crates/stacks-transactions/src/lib.rs#L462-L494)).
* pox-5 sends the sBTC from its own principal, so the asset post condition is on `poxInfo.contractId`, for exactly `amountToWithdrawSats`. Without it, the default `deny` mode aborts the transaction with `abort_by_post_condition`. Read both contract IDs from [fetchPoxInfo](../fetch/fetchpoxinfo.md).
* A txid from [broadcastTransaction](../../stacks-transactions/network/broadcastTransaction.md) confirms submission only. The call can still fail on-chain: read the mined transaction's result and pass an `(err uN)` to [parsePox5Error](../errors/parsepox5error.md).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/build.ts#L396-L431)

***

### Signature

```ts
function buildUnstakeSbtc(
  args: {
    signerManager: string;
    amountToWithdrawSats: IntegerType;
  } & TxParams
): Promise<StacksTransactionWire>;
```

The transaction fields come from [TxParams](../types/txparams.md).

***

### Returns

`Promise<StacksTransactionWire>`

Resolves to an unsigned [StacksTransactionWire](../../stacks-transactions/signing/StacksTransactionWire.md) that calls pox-5 `unstake-sbtc`. Sign it with [TransactionSigner](../../stacks-transactions/signing/TransactionSigner.md), then send it with [broadcastTransaction](../../stacks-transactions/network/broadcastTransaction.md).

***

### Parameters

#### args.signerManager (required)

* **Type**: `string`

Contract principal of the signer-manager the membership is bound to.

#### args.amountToWithdrawSats (required)

* **Type**: `IntegerType`

sBTC to withdraw, in sats. At most the membership's current sats.

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
