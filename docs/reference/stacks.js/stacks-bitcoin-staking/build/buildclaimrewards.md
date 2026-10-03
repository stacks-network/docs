# buildClaimRewards

Builds an unsigned contract call to pox-5 `claim-rewards`, which pays a signer its settled sBTC rewards for one reward cycle: the STX-only leg plus one leg per listed bond.

{% hint style="warning" %}
Sent from a wallet, this transaction fails with `ERR_NO_CLAIMABLE_REWARDS (u32)`. pox-5 pays rewards to `contract-caller`, which has to be the signer-manager contract itself. See Notes.
{% endhint %}

***

### Usage

```ts
import {
  buildClaimRewards,
  burnHeightToRewardCycle,
  currentDistributionCycle,
  distributionCycleToBurnHeight,
  fetchPoxInfo,
} from '@stacks/bitcoin-staking';
import {
  fetchNonce,
  privateKeyToAddress,
  privateKeyToPublic,
  publicKeyToHex,
} from '@stacks/transactions';

const network = 'mainnet';
const privateKey = process.env.SENDER_KEY!;
const address = privateKeyToAddress(privateKey, network);
const poxInfo = await fetchPoxInfo({ network });

// The reward cycle that the last calculate-rewards settled.
const rewardCycle = burnHeightToRewardCycle({
  burnHeight:
    distributionCycleToBurnHeight({ distributionCycle: currentDistributionCycle(poxInfo), poxInfo }) - 1,
  poxInfo,
});

// contract-caller must be the signer-manager: see Notes.
const tx = await buildClaimRewards({
  rewardCycle,
  bondIndices: [0, 1],
  publicKey: publicKeyToHex(privateKeyToPublic(privateKey)),
  fee: 10_000n, // micro-STX
  nonce: await fetchNonce({ address, network }),
  network,
  postConditionMode: 'allow',
});
```

#### Notes

* pox-5 treats `contract-caller` as the signer and pays the rewards to it ([pox-5.clar L2387-L2438](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2387-L2438)). Signers are signer-manager contracts: pox-5 registers `contract-of signer-manager` ([L945-L973](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L945-L973)). This builder calls pox-5 directly, so `contract-caller` is the transaction's origin account, which holds no signer shares, and the call fails with `ERR_NO_CLAIMABLE_REWARDS (u32)`. A signer-manager claims by calling `claim-rewards` from its own contract code.
* `rewardCycle` counts reward cycles, like `poxInfo.rewardCycleId` and the `rewardCycle` of [fetchEarned](../fetch/fetchearned.md). Distribution cycles are half as long, so convert one before passing it, as the Usage example does with [burnHeightToRewardCycle](../cycles/burnheighttorewardcycle.md).
* Fails with `ERR_REWARDS_PAUSED (u53)` after `pause-rewards` ([fetchRewardsPaused](../fetch/fetchrewardspaused.md)), and with `ERR_NO_CLAIMABLE_REWARDS (u32)` when every leg is zero ([fetchEarned](../fetch/fetchearned.md) per leg). [fetchEligibleClaimRewards](../eligibility/fetcheligibleclaimrewards.md) checks both.
* `bondIndices` takes at most 6 entries; the builder does not check the count.
* pox-5 sends the total, an amount it computes at execution, from its own principal to the signer. The package README sets `postConditionMode: 'allow'` for this builder, because a fixed bound that comes in low aborts the claim with `abort_by_post_condition`.
* A txid from [broadcastTransaction](../../stacks-transactions/network/broadcastTransaction.md) confirms submission only. The call can still fail on-chain: read the mined transaction's result and pass an `(err uN)` to [parsePox5Error](../errors/parsepox5error.md).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/build.ts#L681-L729)

***

### Signature

```ts
function buildClaimRewards(
  args: {
    rewardCycle: number;
    bondIndices: number[];
  } & TxParams
): Promise<StacksTransactionWire>;
```

The transaction fields come from [TxParams](../types/txparams.md).

***

### Returns

`Promise<StacksTransactionWire>`

Resolves to an unsigned [StacksTransactionWire](../../stacks-transactions/signing/StacksTransactionWire.md) that calls pox-5 `claim-rewards`. Sign it with [TransactionSigner](../../stacks-transactions/signing/TransactionSigner.md), then send it with [broadcastTransaction](../../stacks-transactions/network/broadcastTransaction.md).

***

### Parameters

#### args.rewardCycle (required)

* **Type**: `number`

Reward cycle to claim. The STX-only leg and every bond leg are read for this cycle.

#### args.bondIndices (required)

* **Type**: `number[]`

Bonds whose legs to claim, at most 6. Pass `[]` to claim only the STX-only leg.

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
