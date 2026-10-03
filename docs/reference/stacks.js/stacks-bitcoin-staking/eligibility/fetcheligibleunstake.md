# fetchEligibleUnstake

Dry-runs the checks of pox-5 `unstake`, which ends an STX-only stake at the end of the current reward cycle, and reports every gate that would fail. Run it before [buildUnstake](../build/buildunstake.md).

***

### Usage

```ts
import { fetchEligibleUnstake } from '@stacks/bitcoin-staking';

const result = await fetchEligibleUnstake({
  staker: 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE',
  oldSignerManager: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.my-signer-manager',
  network: 'mainnet',
});

if (!result.ok) console.log(result.reasons); // Pox5ErrorCode values
```

#### Notes

* Mirrors the asserts of [`unstake`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1424-L1470). The stake is read with `get-staker-info`, which returns nothing once the lock has expired.
* `unstake` can succeed only during the reward phase of a cycle, which excludes its last `prepareCycleLength` Bitcoin blocks (100 on mainnet). In the prepare phase it fails with `ERR_UNSTAKE_IN_PREPARE_PHASE (u28)`, a different code from the `ERR_STAKE_IN_PREPARE_PHASE (u47)` that staking calls use.
* Throws if a read returns a non-2xx response.

| Reason                    | Contract error                         | Added when                                                   |
| ------------------------- | -------------------------------------- | ------------------------------------------------------------ |
| `NotStaking`              | `ERR_NOT_STAKING (u27)`                | `staker` has no current STX-only stake                       |
| `InvalidOldSignerManager` | `ERR_INVALID_OLD_SIGNER_MANAGER (u36)` | `oldSignerManager` is not the stake's current signer-manager |
| `UnstakeInPreparePhase`   | `ERR_UNSTAKE_IN_PREPARE_PHASE (u28)`   | The current height is in the prepare phase                   |

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/eligibility.ts#L586-L628)

***

### Signature

```ts
function fetchEligibleUnstake(
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

Stacks address that would send the transaction (the contract's `tx-sender`).

#### opts.oldSignerManager (required)

* **Type**: `string`

Contract ID of the signer-manager the stake is bound to now.

#### opts.poxInfo (optional)

* **Type**: `PoxInfo`

A [PoxInfo](../types/poxinfo.md) you already hold, which saves a request. Fetched with [fetchPoxInfo](../fetch/fetchpoxinfo.md) when omitted. The prepare-phase gate uses its `currentBurnchainBlockHeight`, so pass a recent value.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
