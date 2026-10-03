# fetchEligibleUnstakeSbtc

Dry-runs the checks of pox-5 `unstake-sbtc`, which withdraws some or all of an sBTC-backed bond member's sats, and reports every gate that would fail. Run it before [buildUnstakeSbtc](../build/buildunstakesbtc.md).

***

### Usage

```ts
import { fetchEligibleUnstakeSbtc } from '@stacks/bitcoin-staking';

const result = await fetchEligibleUnstakeSbtc({
  staker: 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE',
  signerManager: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.my-signer-manager',
  amountToWithdrawSats: 5_000_000n, // 0.05 sBTC in sats
  network: 'mainnet',
});

if (!result.ok) console.log(result.reasons); // Pox5ErrorCode values
```

#### Notes

* Mirrors the asserts of [`unstake-sbtc`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1261-L1342).
* Reads the raw `protocol-bond-memberships` entry with [fetchProtocolBondMemberships](../fetch/fetchprotocolbondmemberships.md), as the contract does. A membership whose bond term has ended still counts.
* Not checked: the sBTC transfer from pox-5 back to the staker.
* Throws if a read returns a non-2xx response.

| Reason                     | Contract error                          | Added when                                                                                                            |
| -------------------------- | --------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `NotBondParticipant`       | `ERR_NOT_BOND_PARTICIPANT (u34)`        | `staker` has no bond membership entry                                                                                 |
| `InvalidUnstakeSbtcAmount` | `ERR_INVALID_UNSTAKE_SBTC_AMOUNT (u37)` | `amountToWithdrawSats` is more than the membership's `amountSats`                                                     |
| `StakeInPreparePhase`      | `ERR_STAKE_IN_PREPARE_PHASE (u47)`      | The current height is in the prepare phase: the last `prepareCycleLength` Bitcoin blocks of the cycle, 100 on mainnet |
| `InvalidOldSignerManager`  | `ERR_INVALID_OLD_SIGNER_MANAGER (u36)`  | `signerManager` is not the membership's current signer-manager                                                        |
| `CannotUnstakeSbtc`        | `ERR_CANNOT_UNSTAKE_SBTC (u38)`         | The membership is an L1 Bitcoin lockup, not sBTC                                                                      |

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/eligibility.ts#L442-L496)

***

### Signature

```ts
function fetchEligibleUnstakeSbtc(
  opts: {
    staker: string;
    signerManager: string;
    amountToWithdrawSats: IntegerType;
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

Contract ID of the signer-manager the membership is bound to now.

#### opts.amountToWithdrawSats (required)

* **Type**: `IntegerType`

sBTC to withdraw, in sats. Accepts `number`, `string`, `bigint` or `Uint8Array`.

#### opts.poxInfo (optional)

* **Type**: `PoxInfo`

A [PoxInfo](../types/poxinfo.md) you already hold, which saves a request. Fetched with [fetchPoxInfo](../fetch/fetchpoxinfo.md) when omitted. The prepare-phase gate uses its `currentBurnchainBlockHeight`, so pass a recent value.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
