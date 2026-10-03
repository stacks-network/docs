# fetchEligibleStake

Dry-runs the checks of pox-5 `stake`, the STX-only entry point, and reports every gate that would fail. Nothing is built or broadcast. Run it before [buildStake](../build/buildstake.md).

***

### Usage

```ts
import { fetchEligibleStake, fetchPoxInfo } from '@stacks/bitcoin-staking';

const poxInfo = await fetchPoxInfo({ network: 'mainnet' });

const result = await fetchEligibleStake({
  staker: 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE',
  signerManager: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.my-signer-manager',
  amountUstx: 100_000_000_000n, // 100,000 STX in micro-STX
  numCycles: 6,
  startBurnHt: poxInfo.currentBurnchainBlockHeight,
  poxInfo,
  network: 'mainnet',
});

if (!result.ok) console.log(result.reasons); // Pox5ErrorCode values
```

#### Notes

* Mirrors the asserts of [`stake`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L976-L1086). The stake would start at reward cycle `poxInfo.rewardCycleId + 1`.
* `startBurnHt` must fall in the current reward cycle. A height below `poxInfo.firstBurnchainBlockHeight` is reported as `InvalidStartBurnHeight`. On-chain, such a height is a runtime abort with no error code.
* Existing bond memberships are read with `get-bond-membership`, which returns nothing once the bond's term has ended.
* Not checked: the signer-manager's `validate-stake!` call, which can still reject the stake with its own error code.
* Throws if a read returns a non-2xx response.

| Reason                   | Contract error                         | Added when                                                                                                             |
| ------------------------ | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `StakeInPreparePhase`    | `ERR_STAKE_IN_PREPARE_PHASE (u47)`     | The current height is in the prepare phase: the last `prepareCycleLength` Bitcoin blocks of the cycle, 100 on mainnet  |
| `SignerNotFound`         | `ERR_SIGNER_NOT_FOUND (u23)`           | `signerManager` is not registered with pox-5                                                                           |
| `SignerKeyGrantNotFound` | `ERR_SIGNER_KEY_GRANT_NOT_FOUND (u17)` | `signerManager` is registered, but the grant for its signer key is not active                                          |
| `InvalidStartBurnHeight` | `ERR_INVALID_START_BURN_HEIGHT (u24)`  | `startBurnHt` is not in reward cycle `poxInfo.rewardCycleId`                                                           |
| `InvalidNumCycles`       | `ERR_INVALID_NUM_CYCLES (u20)`         | `numCycles` is outside 1 to 96                                                                                         |
| `AlreadyStaked`          | `ERR_ALREADY_STAKED (u19)`             | `staker` has a current STX-only stake, or a bond membership that overlaps the next reward cycle                        |
| `RolloverTooEarly`       | `ERR_ROLLOVER_TOO_EARLY (u48)`         | `staker` has a non-overlapping bond membership and the current height is below that bond's `get-bond-l1-unlock-height` |
| `InsufficientStx`        | `ERR_INSUFFICIENT_STX (u8)`            | The staker's unlocked plus locked micro-STX are less than `amountUstx`                                                 |

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/eligibility.ts#L761-L858)

***

### Signature

```ts
function fetchEligibleStake(
  opts: {
    staker: string;
    signerManager: string;
    amountUstx: IntegerType;
    numCycles: number;
    startBurnHt: number;
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

#### opts.amountUstx (required)

* **Type**: `IntegerType`

Micro-STX to lock. Accepts `number`, `string`, `bigint` or `Uint8Array`.

#### opts.numCycles (required)

* **Type**: `number`

Lock period in reward cycles, 1 to 96.

#### opts.startBurnHt (required)

* **Type**: `number`

A Bitcoin block height in the current reward cycle. `poxInfo.currentBurnchainBlockHeight` meets this until the cycle ends.

#### opts.poxInfo (optional)

* **Type**: `PoxInfo`

A [PoxInfo](../types/poxinfo.md) you already hold, which saves a request. Fetched with [fetchPoxInfo](../fetch/fetchpoxinfo.md) when omitted. The gates use its `currentBurnchainBlockHeight` and `rewardCycleId`, so pass a recent value.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
