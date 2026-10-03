# fetchEligibleStakeUpdate

Dry-runs the checks of pox-5 `stake-update`, which changes the signer-manager, extends the lock, or adds micro-STX to an STX-only stake, and reports every gate that would fail. Run it before [buildStakeUpdate](../build/buildstakeupdate.md).

***

### Usage

```ts
import { fetchEligibleStakeUpdate } from '@stacks/bitcoin-staking';

const signerManager = 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.my-signer-manager';

const result = await fetchEligibleStakeUpdate({
  staker: 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE',
  signerManager, // same as oldSignerManager: keep the current signer-manager
  oldSignerManager: signerManager,
  cyclesToExtend: 2,
  amountIncrease: 500_000_000n, // 500 STX in micro-STX
  network: 'mainnet',
});

if (!result.ok) console.log(result.reasons); // Pox5ErrorCode values
```

#### Notes

* Mirrors the asserts of [`stake-update`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1092-L1173). The stake is read with `get-staker-info`, which returns nothing once the lock has expired.
* To keep the current signer-manager, pass the same contract as `signerManager` and `oldSignerManager`. `stake-update` has no same-signer check.
* The new lock period is `firstRewardCycle + numCycles + cyclesToExtend - rewardCycleId - 1`, from the current stake and `poxInfo.rewardCycleId`. A result of 0 or less is reported as `InvalidNumCycles`. On-chain, a negative result is a runtime abort with no error code.
* Not checked: the signer-manager's `validate-stake!` call, which can still reject the update with its own error code.
* Throws if a read returns a non-2xx response.

| Reason                    | Contract error                         | Added when                                                                                                            |
| ------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `NotStaking`              | `ERR_NOT_STAKING (u27)`                | `staker` has no current STX-only stake                                                                                |
| `StakeInPreparePhase`     | `ERR_STAKE_IN_PREPARE_PHASE (u47)`     | The current height is in the prepare phase: the last `prepareCycleLength` Bitcoin blocks of the cycle, 100 on mainnet |
| `InvalidOldSignerManager` | `ERR_INVALID_OLD_SIGNER_MANAGER (u36)` | `oldSignerManager` is not the stake's current signer-manager                                                          |
| `SignerNotFound`          | `ERR_SIGNER_NOT_FOUND (u23)`           | `signerManager` is not registered with pox-5                                                                          |
| `SignerKeyGrantNotFound`  | `ERR_SIGNER_KEY_GRANT_NOT_FOUND (u17)` | `signerManager` is registered, but the grant for its signer key is not active                                         |
| `InvalidNumCycles`        | `ERR_INVALID_NUM_CYCLES (u20)`         | The new lock period is outside 1 to 96 cycles                                                                         |
| `InsufficientStx`         | `ERR_INSUFFICIENT_STX (u8)`            | The staker's unlocked micro-STX are less than `amountIncrease`                                                        |

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/eligibility.ts#L498-L584)

***

### Signature

```ts
function fetchEligibleStakeUpdate(
  opts: {
    staker: string;
    signerManager: string;
    oldSignerManager: string;
    cyclesToExtend?: number;
    amountIncrease?: IntegerType;
    poxInfo?: PoxInfo;
  } & NetworkClientParam
): Promise<EligibilityResult>;
```

`opts` also takes the [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md) fields.

***

### Returns

`Promise<EligibilityResult>`

Resolves to an [EligibilityResult](eligibilityresult.md): `{ ok: true }`, or `{ ok: false, reasons }` with every failing gate from the Notes table.

***

### Parameters

#### opts.staker (required)

* **Type**: `string`

Stacks address that would send the transaction (the contract's `tx-sender`).

#### opts.signerManager (required)

* **Type**: `string`

Contract ID of the signer-manager to bind the stake to.

#### opts.oldSignerManager (required)

* **Type**: `string`

Contract ID of the signer-manager the stake is bound to now.

#### opts.cyclesToExtend (optional)

* **Type**: `number`

Reward cycles to add to the lock. Defaults to `0`.

#### opts.amountIncrease (optional)

* **Type**: `IntegerType`

Micro-STX to add to the lock, taken from the staker's unlocked balance. Defaults to `0`.

#### opts.poxInfo (optional)

* **Type**: `PoxInfo`

A [PoxInfo](../types/poxinfo.md) you already hold, which saves a request. Fetched with [fetchPoxInfo](../fetch/fetchpoxinfo.md) when omitted. The prepare-phase and lock-period gates use its `currentBurnchainBlockHeight` and `rewardCycleId`, so pass a recent value.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
