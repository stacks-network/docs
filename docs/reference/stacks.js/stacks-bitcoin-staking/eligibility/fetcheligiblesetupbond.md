# fetchEligibleSetupBond

Dry-runs the checks of pox-5 `setup-bond` against current chain state and reports every gate that would fail: caller, setup window, unused bond index, and duplicate stakers in the allowlist. Run it before [buildSetupBond](../build/buildsetupbond.md).

***

### Usage

```ts
import { fetchEligibleSetupBond } from '@stacks/bitcoin-staking';

const result = await fetchEligibleSetupBond({
  bondIndex: 0,
  allowlist: [{ staker: 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE', maxSats: 100_000_000n }],
  caller: 'SP72DMR3MJKS7RVBY33JVV7EEJSQ1PYDVKDP10FX', // initial mainnet bond-admin in the pox-5 source
  network: 'mainnet',
});

if (!result.ok) console.log(result.reasons); // Pox5ErrorCode values
```

#### Notes

* Mirrors the asserts of [`setup-bond`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L515-L598) and its allowlist fold [`add-staker-to-bond`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L600-L634).
* The setup window opens two reward cycles before the bond's start height (4,200 Bitcoin blocks on mainnet) and closes at the start height. The timing gates use `poxInfo.currentBurnchainBlockHeight`, so a result can change by the time the transaction is mined.
* Only `allowlist[].staker` is inspected, not `maxSats`.
* Throws if a read returns a non-2xx response, or if `poxInfo.contractVersions` has no pox-5 entry.

| Reason                   | Contract error                        | Added when                                               |
| ------------------------ | ------------------------------------- | -------------------------------------------------------- |
| `Unauthorized`           | `ERR_UNAUTHORIZED (u1)`               | `caller` is not the current `bond-admin`                 |
| `CannotSetupBondTooSoon` | `ERR_CANNOT_SETUP_BOND_TOO_SOON (u2)` | The setup window has not opened                          |
| `CannotSetupBondTooLate` | `ERR_CANNOT_SETUP_BOND_TOO_LATE (u3)` | The current height is at or past the bond's start height |
| `BondAlreadySetup`       | `ERR_BOND_ALREADY_SETUP (u4)`         | A bond already exists at `bondIndex`                     |
| `StakerAlreadyAdded`     | `ERR_STAKER_ALREADY_ADDED (u5)`       | The same `staker` appears more than once in `allowlist`  |

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/eligibility.ts#L257-L313)

***

### Signature

```ts
function fetchEligibleSetupBond(
  opts: {
    bondIndex: number;
    allowlist: { staker: string; maxSats: IntegerType }[];
    caller: string;
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

#### opts.bondIndex (required)

* **Type**: `number`

The bond to set up. Its start height is [bondPeriodToBurnHeight](../cycles/bondperiodtoburnheight.md) for this index.

#### opts.allowlist (required)

* **Type**: `{ staker: string; maxSats: IntegerType }[]`

The allowlist you would pass to `buildSetupBond`. Each `maxSats` is in sats.

#### opts.caller (required)

* **Type**: `string`

The principal that would send the transaction (the contract's `contract-caller`).

#### opts.poxInfo (optional)

* **Type**: `PoxInfo`

A [PoxInfo](../types/poxinfo.md) you already hold, which saves a request. Fetched with [fetchPoxInfo](../fetch/fetchpoxinfo.md) when omitted. The timing gates use its `currentBurnchainBlockHeight`, so pass a recent value.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
