# buildCalculateRewards

Builds an unsigned contract call to pox-5 `calculate-rewards`, which splits the sBTC rewards pox-5 received since the last calculation between the protocol bond tranche, the reserve fund tranche and the STX-only staking tranche. Anyone can send it.

***

### Usage

```ts
import {
  buildCalculateRewards,
  fetchBond,
  fetchEligibleCalculateRewards,
} from '@stacks/bitcoin-staking';
import {
  TransactionSigner,
  broadcastTransaction,
  fetchNonce,
  privateKeyToAddress,
  privateKeyToPublic,
  publicKeyToHex,
} from '@stacks/transactions';

const network = 'mainnet';
const privateKey = process.env.SENDER_KEY!;
const address = privateKeyToAddress(privateKey, network);

// Every bond active at the calculation height, highest stxValueRatio first,
// lower bond index first on a tie.
const candidates = [0, 1, 2]; // bond indices that may still be active
const bonds = await Promise.all(
  candidates.map(async bondIndex => ({ bondIndex, bond: await fetchBond({ bondIndex, network }) }))
);
const bondIndices = bonds
  .filter(b => b.bond !== undefined)
  .sort((a, b) =>
    a.bond!.stxValueRatio === b.bond!.stxValueRatio
      ? a.bondIndex - b.bondIndex
      : Number(b.bond!.stxValueRatio - a.bond!.stxValueRatio)
  )
  .map(b => b.bondIndex);

const check = await fetchEligibleCalculateRewards({ bondIndices, network });
if (!check.ok) throw new Error(`calculate-rewards would fail: ${check.reasons}`);

const tx = await buildCalculateRewards({
  bondIndices,
  publicKey: publicKeyToHex(privateKeyToPublic(privateKey)),
  fee: 10_000n, // micro-STX
  nonce: await fetchNonce({ address, network }),
  network,
});

new TransactionSigner(tx).signOrigin(privateKey);
const result = await broadcastTransaction({ transaction: tx, network });
```

#### Notes

* Succeeds at most once per distribution cycle, half a reward cycle (1,050 Bitcoin blocks on mainnet). pox-5 settles up to the calculation height, the block before the current distribution cycle began, and fails with `ERR_DISTRIBUTION_ALREADY_COMPUTED (u30)` if that height is already settled ([pox-5.clar L2158-L2240](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2158-L2240)).
* `bondIndices` must include every bond active at the calculation height (`ERR_ACTIVE_BOND_NOT_INCLUDED (u33)`, [L2616-L2676](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2616-L2676)). Each listed bond must exist (`ERR_BOND_NOT_FOUND (u7)`) and be active (`ERR_BOND_NOT_ACTIVE (u31)`). A bond is active after its start height, up to and including the height 12 reward cycles later ([L3027-L3041](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3027-L3041)).
* Order `bondIndices` by descending `stxValueRatio`, and by ascending bond index on a tie (`ERR_INVALID_BOND_PERIOD_ORDERING (u29)`, [L2284-L2299](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2284-L2299)). pox-5 accepts at most 6 entries; the builder does not check the count.
* This package has no helper that lists the active bonds. Read candidates with [fetchBond](../fetch/fetchbond.md), and dry-run the list with [fetchEligibleCalculateRewards](../eligibility/fetcheligiblecalculaterewards.md).
* In list order, each bond receives up to its target for the period, `totalSats * targetRateBps / 10000 / 50`, out of the new rewards ([L2264-L2272](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2264-L2272)). 15% of what remains (`RESERVE_RATIO`, 1,500 basis points) goes to the reserve, and the rest to STX-only stakers of the reward cycle that contains the calculation height. With no STX staked in that cycle, their share also goes to the reserve. See [Rewards and tranches](https://docs.stacks.co/learn/bitcoin-staking/rewards-and-tranches).
* The call updates pox-5's bookkeeping and moves no asset, so it needs no post conditions.
* A txid from [broadcastTransaction](../../stacks-transactions/network/broadcastTransaction.md) confirms submission only. The call can still fail on-chain: read the mined transaction's result and pass an `(err uN)` to [parsePox5Error](../errors/parsepox5error.md).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/build.ts#L583-L622)

***

### Signature

```ts
function buildCalculateRewards(
  args: {
    bondIndices: number[];
  } & TxParams
): Promise<StacksTransactionWire>;
```

The transaction fields come from [TxParams](../types/txparams.md).

***

### Returns

`Promise<StacksTransactionWire>`

Resolves to an unsigned [StacksTransactionWire](../../stacks-transactions/signing/StacksTransactionWire.md) that calls pox-5 `calculate-rewards`. Sign it with [TransactionSigner](../../stacks-transactions/signing/TransactionSigner.md), then send it with [broadcastTransaction](../../stacks-transactions/network/broadcastTransaction.md).

***

### Parameters

#### args.bondIndices (required)

* **Type**: `number[]`

Every bond active at the calculation height, at most 6, sorted by descending `stxValueRatio` and ascending bond index on a tie.

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
