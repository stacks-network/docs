# fetchEligibleAnnounceL1EarlyExit

Dry-runs the checks of pox-5 `announce-l1-early-exit`, which an L1 bond member calls after exiting their Bitcoin lockup early, and reports every gate that would fail. Run it before [buildAnnounceL1EarlyExit](../build/buildannouncel1earlyexit.md).

***

### Usage

```ts
import { fetchEligibleAnnounceL1EarlyExit } from '@stacks/bitcoin-staking';

const result = await fetchEligibleAnnounceL1EarlyExit({
  staker: 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE',
  oldSignerManager: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.my-signer-manager',
  network: 'mainnet',
});

if (!result.ok) console.log(result.reasons); // Pox5ErrorCode values
```

#### Notes

* Mirrors the asserts of [`announce-l1-early-exit`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1196-L1257). The membership is read with `get-bond-membership`, which returns nothing once the bond's term has ended.
* Not checked: the contract requires `contract-caller`, `tx-sender` and `staker` to be the same principal, or fails with `ERR_UNAUTHORIZED (u1)`. Send the transaction from the staker's own account, not through another contract.
* Throws if a read returns a non-2xx response.

| Reason                        | Contract error                              | Added when                                                                                                            |
| ----------------------------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `NotBondParticipant`          | `ERR_NOT_BOND_PARTICIPANT (u34)`            | `staker` has no current bond membership                                                                               |
| `StakeInPreparePhase`         | `ERR_STAKE_IN_PREPARE_PHASE (u47)`          | The current height is in the prepare phase: the last `prepareCycleLength` Bitcoin blocks of the cycle, 100 on mainnet |
| `CannotAnnounceL1EarlyUnlock` | `ERR_CANNOT_ANNOUNCE_L1_EARLY_UNLOCK (u35)` | The membership is sBTC-backed. Those members use `unstake-sbtc` instead                                               |
| `InvalidOldSignerManager`     | `ERR_INVALID_OLD_SIGNER_MANAGER (u36)`      | `oldSignerManager` is not the membership's current signer-manager                                                     |
| `L1EarlyExitAlreadyAnnounced` | `ERR_L1_EARLY_EXIT_ALREADY_ANNOUNCED (u50)` | `staker` already announced an early exit for this bond                                                                |

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/eligibility.ts#L380-L440)

***

### Signature

```ts
function fetchEligibleAnnounceL1EarlyExit(
  opts: {
    staker: string;
    oldSignerManager: string;
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

Stacks address of the bond member. It must also send the transaction.

#### opts.oldSignerManager (required)

* **Type**: `string`

Contract ID of the signer-manager the membership is bound to now.

#### opts.poxInfo (optional)

* **Type**: `PoxInfo`

A [PoxInfo](../types/poxinfo.md) you already hold, which saves a request. Fetched with [fetchPoxInfo](../fetch/fetchpoxinfo.md) when omitted. The prepare-phase gate uses its `currentBurnchainBlockHeight`, so pass a recent value.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
