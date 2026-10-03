# buildStake

Builds an unsigned contract call to pox-5 `stake`, which locks the sender's STX in the STX-only staking tranche under a signer-manager. The lock starts at the next reward cycle and lasts `numCycles` reward cycles.

***

### Usage

```ts
import { buildStake, fetchEligibleStake, fetchPoxInfo } from '@stacks/bitcoin-staking';
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
const amountUstx = 1_000_000_000n; // 1,000 STX in micro-STX
const numCycles = 6;

const poxInfo = await fetchPoxInfo({ network });
const startBurnHt = poxInfo.currentBurnchainBlockHeight;

const check = await fetchEligibleStake({
  staker,
  signerManager,
  amountUstx,
  numCycles,
  startBurnHt,
  poxInfo,
  network,
});
if (!check.ok) throw new Error(`stake would fail: ${check.reasons}`);

const tx = await buildStake({
  signerManager,
  amountUstx,
  numCycles,
  startBurnHt,
  publicKey: publicKeyToHex(privateKeyToPublic(privateKey)),
  fee: 10_000n, // micro-STX
  nonce: await fetchNonce({ address: staker, network }),
  network,
  postConditions: [Pc.principal(staker).willSendEq(amountUstx).ustxToLock()],
});

new TransactionSigner(tx).signOrigin(privateKey);
const result = await broadcastTransaction({ transaction: tx, network });
```

#### Notes

* Send it during the reward phase of any cycle, which excludes its last `prepareCycleLength` Bitcoin blocks (100 on mainnet), the prepare phase. In the prepare phase it fails with `ERR_STAKE_IN_PREPARE_PHASE (u47)` ([pox-5.clar L976-L1086](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L976-L1086)).
* `startBurnHt` must be a Bitcoin block height in the current reward cycle: pox-5 requires the cycle after it to be the next reward cycle and fails with `ERR_INVALID_START_BURN_HEIGHT (u24)` otherwise. A transaction that confirms in a later cycle than `startBurnHt` fails the same way.
* `numCycles` must be 1 to 96 (`ERR_INVALID_NUM_CYCLES (u20)`, [L3315-L3320](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3315-L3320)).
* The signer-manager must be registered (`ERR_SIGNER_NOT_FOUND (u23)`) with an active signer key grant (`ERR_SIGNER_KEY_GRANT_NOT_FOUND (u17)`). Its `validate-stake!` can reject the stake with its own error code.
* An active STX-only stake fails with `ERR_ALREADY_STAKED (u19)`: change it with [buildStakeUpdate](buildstakeupdate.md). A bond membership whose 12-cycle term has not ended by the next reward cycle fails with the same code. Rolling over from an ending bond is allowed only from half a reward cycle before that bond ends (`ERR_ROLLOVER_TOO_EARLY (u48)`).
* The sender's total STX balance, locked plus unlocked, must cover `amountUstx` (`ERR_INSUFFICIENT_STX (u8)`).
* [fetchEligibleStake](../eligibility/fetcheligiblestake.md) dry-runs every check except the signer-manager's `validate-stake!`.
* pox-5 never calls `stx-transfer?`: the node applies the lock. Attach a staking post condition for `amountUstx` with `ustxToLock()`, as in the Usage example. Without it, the default `deny` mode aborts the transaction with `abort_by_post_condition`.
* A rollover from an sBTC-backed bond refunds all sBTC that pox-5 custodies for that bond, from pox-5's principal (`poxInfo.contractId`) to the sender ([L1051-L1054](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1051-L1054)). Read the amount with [fetchStakerCustodiedSbtc](../fetch/fetchstakercustodiedsbtc.md) and, in `deny` mode, add `Pc.principal(poxInfo.contractId).willSendEq(custodied).ft(poxInfo.sbtcContract, 'sbtc-token')` for it.
* A txid from [broadcastTransaction](../../stacks-transactions/network/broadcastTransaction.md) confirms submission only. The call can still fail on-chain: read the mined transaction's result and pass an `(err uN)` to [parsePox5Error](../errors/parsepox5error.md).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/build.ts#L433-L479)

***

### Signature

```ts
function buildStake(
  args: {
    signerManager: string;
    amountUstx: IntegerType;
    numCycles: number;
    startBurnHt: number;
    signerCalldata?: Uint8Array | string;
  } & TxParams
): Promise<StacksTransactionWire>;
```

The transaction fields come from [TxParams](../types/txparams.md).

***

### Returns

`Promise<StacksTransactionWire>`

Resolves to an unsigned [StacksTransactionWire](../../stacks-transactions/signing/StacksTransactionWire.md) that calls pox-5 `stake`. Sign it with [TransactionSigner](../../stacks-transactions/signing/TransactionSigner.md), then send it with [broadcastTransaction](../../stacks-transactions/network/broadcastTransaction.md).

***

### Parameters

#### args.signerManager (required)

* **Type**: `string`

Contract principal of the signer-manager, which implements `signer-manager-trait`.

#### args.amountUstx (required)

* **Type**: `IntegerType`

STX to lock, in micro-STX.

#### args.numCycles (required)

* **Type**: `number`

Reward cycles to lock for, 1 to 96.

#### args.startBurnHt (required)

* **Type**: `number`

A Bitcoin block height in the current reward cycle. pox-5 uses it as a replay guard. `poxInfo.currentBurnchainBlockHeight` from [fetchPoxInfo](../fetch/fetchpoxinfo.md) works.

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
