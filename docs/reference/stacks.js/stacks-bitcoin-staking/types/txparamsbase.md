# TxParamsBase

Transaction fields shared by every `build*` function in this package: fee, nonce, network, and optional post conditions. You pass them through [SingleSigTxParams](singlesigtxparams.md) or [MultiSigTxParams](multisigtxparams.md), which both extend `TxParamsBase`.

***

### Usage

```ts
import { buildStake } from '@stacks/bitcoin-staking';
import { Pc, fetchNonce } from '@stacks/transactions';

const tx = await buildStake({
  signerManager: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.my-signer-manager',
  amountUstx,
  numCycles: 6,
  startBurnHt,
  publicKey,
  // TxParamsBase fields
  fee: 10_000n, // micro-STX
  nonce: await fetchNonce({ address: stakerAddress, network: 'mainnet' }),
  network: 'mainnet',
  postConditions: [Pc.principal(stakerAddress).willSendEq(amountUstx).ustxToLock()],
});
```

#### Notes

* Builders attach no post conditions of their own and default to `'deny'` mode. A call that moves an asset, locks STX, or performs a PoX action (`unstake`, `unstake-sbtc`, `update-bond-registration`, `announce-l1-early-exit`) aborts with `abort_by_post_condition` unless you pass matching `postConditions` or set `postConditionMode: 'allow'`.
* Builders neither estimate `fee` nor fetch `nonce`. Read the nonce with [fetchNonce](../../stacks-transactions/network/fetchNonce.md).
* `network` also sets the contract address: builders call `pox-5` on the network's `bootAddress`, `SP000000000000000000002Q6VF78` on mainnet and `ST000000000000000000002AMW42H` on testnet. An unknown network name throws `Unknown network name: <name>`.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/types.ts#L10-L22)

***

### Definition

```ts
export interface TxParamsBase {
  fee: IntegerType;
  nonce: IntegerType;
  network: StacksNetworkName | StacksNetwork;
  /**
   * Post-conditions to attach. Required for calls that move assets from the
   * caller under deny mode, e.g. `register-for-bond` with an sBTC lockup.
   */
  postConditions?: PostCondition[];
  /** Post-condition mode. Defaults to the wire default (`deny`). */
  postConditionMode?: PostConditionModeName;
}
```

***

### Properties

| Property            | Type                                 | Description                                                                                                                                |
| ------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `fee`               | `IntegerType`                        | Transaction fee in micro-STX                                                                                                               |
| `nonce`             | `IntegerType`                        | Nonce of the origin account                                                                                                                |
| `network`           | `StacksNetworkName \| StacksNetwork` | A name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object                      |
| `postConditions`    | `PostCondition[]` (optional)         | [Post conditions](../../stacks-transactions/types/PostCondition.md) to attach to the transaction                                           |
| `postConditionMode` | `PostConditionModeName` (optional)   | `'allow'`, `'deny'` or `'originator'`. See [PostConditionMode](../../stacks-transactions/types/PostConditionMode.md). Defaults to `'deny'` |
