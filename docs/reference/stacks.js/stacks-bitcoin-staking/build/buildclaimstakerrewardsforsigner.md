# buildClaimStakerRewardsForSigner

Builds an unsigned contract call to pox-5 `claim-staker-rewards-for-signer`, which settles one staker's unclaimed rewards for one leg and resets them to zero. It moves no sBTC: the signer-manager pays the staker using the amount the call returns.

{% hint style="warning" %}
Sent from a wallet, this transaction settles the wallet's own position, not a staker's position under a signer-manager. pox-5 uses `contract-caller` as the signer-manager. See Notes.
{% endhint %}

***

### Usage

```ts
import { buildClaimStakerRewardsForSigner, fetchPoxInfo } from '@stacks/bitcoin-staking';
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

// contract-caller is the signer identity: see Notes.
const tx = await buildClaimStakerRewardsForSigner({
  staker: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR',
  rewardCycle: poxInfo.rewardCycleId - 1,
  bondIndex: 1, // omit for the STX-only leg
  publicKey: publicKeyToHex(privateKeyToPublic(privateKey)),
  fee: 10_000n, // micro-STX
  nonce: await fetchNonce({ address, network }),
  network,
});
```

#### Notes

* pox-5 does not check the caller. It uses `contract-caller` as the signer, and every map it reads and writes is keyed on that principal ([pox-5.clar L2440-L2470](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2440-L2470)). This builder calls pox-5 directly, so the signer is the transaction's origin account. A wallet call settles the wallet's own empty position: it returns an `earned` of `u0` and changes nothing a signer-manager relies on.
* The contract returns `(ok { earned, rewards-per-token })`, where `earned` is the staker's settled reward in sBTC sats. Preview it with [fetchEarnedStakerRewards](../fetch/fetchearnedstakerrewards.md).
* `pause-rewards` does not block this call. Only `claim-rewards` checks the pause flag.
* No asset moves, so the call needs no post conditions.
* A txid from [broadcastTransaction](../../stacks-transactions/network/broadcastTransaction.md) confirms submission only. The call can still fail on-chain: read the mined transaction's result and pass an `(err uN)` to [parsePox5Error](../errors/parsepox5error.md).

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/build.ts#L731-L777)

***

### Signature

```ts
function buildClaimStakerRewardsForSigner(
  args: {
    staker: string;
    rewardCycle: number;
    bondIndex?: number;
  } & TxParams
): Promise<StacksTransactionWire>;
```

The transaction fields come from [TxParams](../types/txparams.md).

***

### Returns

`Promise<StacksTransactionWire>`

Resolves to an unsigned [StacksTransactionWire](../../stacks-transactions/signing/StacksTransactionWire.md) that calls pox-5 `claim-staker-rewards-for-signer`. Sign it with [TransactionSigner](../../stacks-transactions/signing/TransactionSigner.md), then send it with [broadcastTransaction](../../stacks-transactions/network/broadcastTransaction.md).

***

### Parameters

#### args.staker (required)

* **Type**: `string`

Stacks principal of the staker whose rewards are settled.

#### args.rewardCycle (required)

* **Type**: `number`

Reward cycle of the leg.

#### args.bondIndex (optional)

* **Type**: `number`

Bond index of a protocol bond leg. Omit it for the STX-only leg; the builder then passes `none`.

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
