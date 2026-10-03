# buildSetupBond

Builds an unsigned contract call to pox-5 `setup-bond`, which creates a protocol bond with its yield target, STX pairing terms, early-exit script and allowlist. Only the `bond-admin` can call it.

***

### Usage

```ts
import { buildSetupBond, fetchEligibleSetupBond, validateEarlyUnlockBytes } from '@stacks/bitcoin-staking';
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

// <push 33 bytes> <early-exit public key> OP_CHECKSIG
const earlyExitKey = '0316e35d38b52d4886e40065e4952a49535ce914e02294be58e252d1998f129b19';
const earlyUnlockBytes = validateEarlyUnlockBytes(`21${earlyExitKey}ac`);

const allowlist = [
  { staker: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR', maxSats: 100_000_000n }, // 1 BTC in sats
  { staker: 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE', maxSats: 100_000_000n },
];

const check = await fetchEligibleSetupBond({ bondIndex: 0, allowlist, caller: address, network: 'mainnet' });
if (!check.ok) throw new Error(`setup-bond would fail: ${check.reasons}`);

const tx = await buildSetupBond({
  bondIndex: 0,
  targetRateBps: 500, // 5% target APY
  stxValueRatio: 1_000_000n, // micro-STX per 100 sats
  minUstxRatioBps: 8_000,
  earlyUnlockBytes,
  allowlist,
  publicKey: publicKeyToHex(privateKeyToPublic(privateKey)),
  fee: 10_000n, // micro-STX
  nonce: await fetchNonce({ address, network: 'mainnet' }),
  network: 'mainnet',
});

new TransactionSigner(tx).signOrigin(privateKey);
const result = await broadcastTransaction({ transaction: tx, network: 'mainnet' });
```

#### Notes

* Only the current `bond-admin` can call it: `ERR_UNAUTHORIZED (u1)` otherwise ([pox-5.clar L515-L598](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L515-L598)).
* The call must confirm in the two reward cycles before the bond's start height: no earlier than start height minus `2 * rewardCycleLength` (`ERR_CANNOT_SETUP_BOND_TOO_SOON (u2)`), and before the start height (`ERR_CANNOT_SETUP_BOND_TOO_LATE (u3)`). On mainnet that window is the 4,200 Bitcoin blocks before the bond starts. Compute the start height with [bondPeriodToBurnHeight](../cycles/bondperiodtoburnheight.md).
* Each bond index can be set up once (`ERR_BOND_ALREADY_SETUP (u4)`). A staker listed twice fails the call with `ERR_STAKER_ALREADY_ADDED (u5)` ([L600-L634](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L600-L634)). pox-5 accepts at most 1,000 allowlist entries; the builder does not check the count.
* Dry-run the caller, timing, bond index and duplicate checks with [fetchEligibleSetupBond](../eligibility/fetcheligiblesetupbond.md).
* `maxSats` caps what each staker can stake in [buildRegisterForBond](buildregisterforbond.md) (`ERR_TOO_MUCH_SATS (u10)`). For `sats` staked, a staker must lock at least `stxValueRatio * sats / 100 * minUstxRatioBps / 10000` micro-STX, with integer division at each step ([L3089-L3095](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3089-L3095)). [minUstxForSatsAmount](../cycles/minustxforsatsamount.md) computes the same value.
* Neither the builder nor pox-5 inspects `earlyUnlockBytes`. pox-5 stores them and builds every staker's L1 lockup script with them, so check them with [validateEarlyUnlockBytes](../script/validateearlyunlockbytes.md) first.
* No asset moves, so the call needs no post conditions.
* A txid from [broadcastTransaction](../../stacks-transactions/network/broadcastTransaction.md) confirms submission only. The call can still fail on-chain: read the mined transaction's result and pass an `(err uN)` to [parsePox5Error](../errors/parsepox5error.md).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/build.ts#L131-L193)

***

### Signature

```ts
function buildSetupBond(
  args: {
    bondIndex: number;
    targetRateBps: IntegerType;
    stxValueRatio: IntegerType;
    minUstxRatioBps: IntegerType;
    earlyUnlockBytes: Uint8Array | string;
    allowlist: { staker: string; maxSats: IntegerType }[];
  } & TxParams
): Promise<StacksTransactionWire>;
```

The transaction fields come from [TxParams](../types/txparams.md).

***

### Returns

`Promise<StacksTransactionWire>`

Resolves to an unsigned [StacksTransactionWire](../../stacks-transactions/signing/StacksTransactionWire.md) that calls pox-5 `setup-bond`. Sign it with [TransactionSigner](../../stacks-transactions/signing/TransactionSigner.md), then send it with [broadcastTransaction](../../stacks-transactions/network/broadcastTransaction.md).

***

### Parameters

#### args.bondIndex (required)

* **Type**: `number`

Index of the bond to create. Bond `n` starts at reward cycle `first-bond-period-cycle + 2n` ([L2899-L2902](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2899-L2902)).

#### args.targetRateBps (required)

* **Type**: `IntegerType`

Target yield (APY) in basis points. `500` is 5%.

#### args.stxValueRatio (required)

* **Type**: `IntegerType`

STX:BTC price for the bond, in micro-STX per 100 sats.

#### args.minUstxRatioBps (required)

* **Type**: `IntegerType`

Share of the BTC side's STX value, in basis points, that a staker must lock in STX. See the formula in Notes.

#### args.earlyUnlockBytes (required)

* **Type**: `Uint8Array | string`

Bitcoin script fragment for the early-exit (`OP_ELSE`) branch of each L1 lockup script, as bytes or hex, at most 683 bytes. It must leave a result on the stack for the script's shared `OP_VERIFY`. The SDK documents a single-key `<pubkey> OP_CHECKSIG` template.

#### args.allowlist (required)

* **Type**: `{ staker: string; maxSats: IntegerType }[]`

Stakers allowed to register for the bond, each with the most sats they can stake.

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
