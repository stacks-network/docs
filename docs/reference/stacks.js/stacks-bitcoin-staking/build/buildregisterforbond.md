# buildRegisterForBond

Builds an unsigned contract call to pox-5 `register-for-bond`, which enrolls the sender in a protocol bond. The sender locks STX and either proves an L1 BTC lockup or moves sBTC into pox-5.

***

### Usage

```ts
import {
  buildRegisterForBond,
  fetchBond,
  fetchEligibleRegisterForBond,
  fetchPoxInfo,
  minUstxForSatsAmount,
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
const signerManager = 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.my-signer-manager';
const bondIndex = 2;

const poxInfo = await fetchPoxInfo({ network });
const bond = await fetchBond({ bondIndex, network });
if (!bond) throw new Error(`bond ${bondIndex} is not set up`);

const sbtcSats = 100_000_000n; // 1 BTC in sats
const amountUstx = minUstxForSatsAmount({
  sats: sbtcSats,
  stxValueRatio: bond.stxValueRatio,
  minUstxRatioBps: bond.minUstxRatioBps,
});
const lockup = { kind: 'sbtc', sbtcSats } as const;

const check = await fetchEligibleRegisterForBond({
  bondIndex,
  staker,
  amountUstx,
  lockup,
  signerManager,
  poxInfo,
  network,
});
if (!check.ok) throw new Error(`register-for-bond would fail: ${check.reasons}`);

const tx = await buildRegisterForBond({
  bondIndex,
  signerManager,
  amountUstx,
  lockup,
  publicKey: publicKeyToHex(privateKeyToPublic(privateKey)),
  fee: 10_000n, // micro-STX
  nonce: await fetchNonce({ address: staker, network }),
  network,
  postConditions: [
    Pc.principal(staker).willSendEq(amountUstx).ustxToLock(),
    Pc.principal(staker).willSendLte(sbtcSats).ft(poxInfo.sbtcContract, 'sbtc-token'),
  ],
});

new TransactionSigner(tx).signOrigin(privateKey);
const result = await broadcastTransaction({ transaction: tx, network });
```

For an L1 BTC lockup, pass `lockup: { kind: 'btc', outputs, unlockBytes }`, where each entry of `outputs` comes from [buildLockProof](../proof/buildlockproof.md) or [buildLockProofFromBlock](../proof/buildlockprooffromblock.md), and `unlockBytes` is the staker-signature script the lockup was built with in [buildLockScript](../script/buildlockscript.md). Without an sBTC rollover, only the `ustxToLock` post condition applies.

#### Notes

* Send it before the bond starts (`ERR_BOND_ALREADY_STARTED (u43)`) and outside the prepare phase, the last `prepareCycleLength` Bitcoin blocks of a reward cycle, 100 on mainnet (`ERR_STAKE_IN_PREPARE_PHASE (u47)`) ([pox-5.clar L642-L842](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L642-L842)).
* The bond must exist (`ERR_BOND_NOT_FOUND (u7)`). The sender must be on its allowlist (`ERR_NOT_ALLOWLISTED (u11)`) and stake no more sats than their allowance (`ERR_TOO_MUCH_SATS (u10)`).
* `amountUstx` must be at least [minUstxForSatsAmount](../cycles/minustxforsatsamount.md) for the staked sats, and the sender's total STX balance, locked plus unlocked, must cover `amountUstx`. Both fail with `ERR_INSUFFICIENT_STX (u8)`.
* The signer-manager must be registered (`ERR_SIGNER_NOT_FOUND (u23)`) with an active signer key grant (`ERR_SIGNER_KEY_GRANT_NOT_FOUND (u17)`). Its `validate-stake!` can reject the registration with its own error code.
* An STX-only stake still locked in the bond's first reward cycle fails with `ERR_ALREADY_STAKED (u19)`. A bond membership that overlaps the new bond fails with `ERR_ALREADY_REGISTERED (u9)`. Rolling over from an ending bond is allowed only from half a reward cycle before that bond ends (`ERR_ROLLOVER_TOO_EARLY (u48)`, [L3004-L3025](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3004-L3025)).
* [fetchEligibleRegisterForBond](../eligibility/fetcheligibleregisterforbond.md) dry-runs these checks. It does not run the signer-manager's `validate-stake!`, or the L1 merkle proof, lockup script, amount and transaction-parse checks.
* With `kind: 'btc'`, the builder throws before building if `outputs` is empty, has more than 10 entries, or an output has more than 14 `leafHashes`, the contract's list limits. pox-5 then verifies each output against Bitcoin chainstate and fails with `ERR_INVALID_BTC_HEADER (u40)`, `ERR_INVALID_MERKLE_PROOF (u41)`, `ERR_INVALID_LOCKUP_SCRIPT (u42)`, `ERR_INVALID_LOCKUP_AMOUNT (u45)`, `ERR_DUPLICATE_LOCKUP_OUTPOINT (u46)`, or `ERR_INVALID_UNLOCK_HEIGHT (u52)` when `unlockBurnHeight` is below the bond's minimum from `get-bond-l1-unlock-height` or at or above 500,000,000 ([L2031-L2113](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2031-L2113)).
* With `kind: 'sbtc'`, pox-5 transfers from the sender only the difference between `sbtcSats` and the sBTC it already custodies for the sender's current bond, the full `sbtcSats` when there is none ([L1938-L1979](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1938-L1979)). That is why the sBTC post condition is an upper bound.
* The builder attaches no post conditions, and the default `deny` mode aborts the transaction with `abort_by_post_condition` unless post conditions cover every asset movement. Read the sBTC token contract from [fetchPoxInfo](../fetch/fetchpoxinfo.md) instead of hardcoding it.
* On a rollover, pox-5 moves only the difference between the sBTC it custodies for the sender's ending bond and the sBTC the new bond needs (`0` for `kind: 'btc'`) ([L1938-L1979](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1938-L1979)). Read the custodied amount with [fetchStakerCustodiedSbtc](../fetch/fetchstakercustodiedsbtc.md). When it exceeds what the new bond needs, pox-5 refunds the difference from its own principal, so in `deny` mode add `Pc.principal(poxInfo.contractId).willSendEq(refund).ft(poxInfo.sbtcContract, 'sbtc-token')` with `refund` set to that difference.
* A txid from [broadcastTransaction](../../stacks-transactions/network/broadcastTransaction.md) confirms submission only. The call can still fail on-chain: read the mined transaction's result and pass an `(err uN)` to [parsePox5Error](../errors/parsepox5error.md).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/build.ts#L195-L267)

***

### Signature

```ts
function buildRegisterForBond(
  args: {
    bondIndex: number;
    signerManager: string;
    amountUstx: IntegerType;
    lockup: BondLockup;
    signerCalldata?: Uint8Array | string;
  } & TxParams
): Promise<StacksTransactionWire>;
```

The transaction fields come from [TxParams](../types/txparams.md).

***

### Returns

`Promise<StacksTransactionWire>`

Resolves to an unsigned [StacksTransactionWire](../../stacks-transactions/signing/StacksTransactionWire.md) that calls pox-5 `register-for-bond`. Sign it with [TransactionSigner](../../stacks-transactions/signing/TransactionSigner.md), then send it with [broadcastTransaction](../../stacks-transactions/network/broadcastTransaction.md).

***

### Parameters

#### args.bondIndex (required)

* **Type**: `number`

Index of the bond to join.

#### args.signerManager (required)

* **Type**: `string`

Contract principal of the signer-manager, which implements `signer-manager-trait`.

#### args.amountUstx (required)

* **Type**: `IntegerType`

STX to lock for the bond, in micro-STX. The lock runs 12 reward cycles from the bond's first reward cycle.

#### args.lockup (required)

* **Type**: [BondLockup](../types/bondlockup.md)

`{ kind: 'sbtc', sbtcSats }` to stake sBTC, in sats, or `{ kind: 'btc', outputs, unlockBytes }` to prove L1 BTC lockup outputs. The builder encodes the sBTC form as `(err sbtcSats)` and the BTC form as `(ok { outputs, staker-unlock-bytes })`, as pox-5 expects.

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
