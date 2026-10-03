# fetchEligibleCalculateRewards

Dry-runs the checks of pox-5 `calculate-rewards`, which splits the sBTC rewards received since the last calculation between the protocol bond tranche, the reserve fund tranche and the STX-only staking tranche, and reports every gate that would fail. Run it before [buildCalculateRewards](../build/buildcalculaterewards.md).

***

### Usage

```ts
import {
  type Bond,
  fetchEligibleCalculateRewards,
  fetchPoxInfo,
  fetchProtocolBond,
} from '@stacks/bitcoin-staking';

const network = 'mainnet';
const poxInfo = await fetchPoxInfo({ network });

// Order by descending stxValueRatio, ties by ascending bondIndex
const bonds = (await Promise.all([0, 1].map(bondIndex => fetchProtocolBond({ bondIndex, network }))))
  .filter((bond): bond is Bond => bond !== undefined)
  .sort((a, b) =>
    a.stxValueRatio === b.stxValueRatio
      ? a.bondIndex - b.bondIndex
      : a.stxValueRatio > b.stxValueRatio ? -1 : 1
  );

const result = await fetchEligibleCalculateRewards({
  bondIndices: bonds.map(bond => bond.bondIndex),
  poxInfo,
  network,
});
```

#### Notes

* Mirrors the asserts of [`calculate-rewards`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2158-L2240), [`assert-all-active-bonds-included`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2616-L2637) and [`calculate-bond-rewards`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2242-L2337).
* The calculation height is the last Bitcoin block of the previous distribution cycle: [distributionCycleToBurnHeight](../cycles/distributioncycletoburnheight.md) of [currentDistributionCycle](../cycles/currentdistributioncycle.md), minus 1. Bond activity is judged at that height with [isBondActiveAtHeight](../cycles/isbondactiveatheight.md), plus a check that the bond exists.
* The active bonds that must be listed are searched among the latest six bond indices at the calculation height, as the contract does.
* The contract takes at most 6 bond indices (`(list 6 uint)`). This function does not check the list length.
* Throws an `Error` whose message starts with `fetchEligibleCalculateRewards: distribution cycle 0` while the chain is in distribution cycle 0, before any read other than `fetchPoxInfo`. There the contract aborts at runtime with no error code.
* Throws if a read returns a non-2xx response, or if `poxInfo.contractVersions` has no pox-5 entry.

| Reason                        | Contract error                            | Added when                                                                                                                     |
| ----------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `DistributionAlreadyComputed` | `ERR_DISTRIBUTION_ALREADY_COMPUTED (u30)` | The calculation height is at or below `get-last-reward-compute-height`                                                         |
| `ActiveBondNotIncluded`       | `ERR_ACTIVE_BOND_NOT_INCLUDED (u33)`      | A bond active at the calculation height is missing from `bondIndices`                                                          |
| `BondNotFound`                | `ERR_BOND_NOT_FOUND (u7)`                 | A listed bond index has no bond set up                                                                                         |
| `InvalidBondPeriodOrdering`   | `ERR_INVALID_BOND_PERIOD_ORDERING (u29)`  | `bondIndices` is not in descending `stxValueRatio` order, with ties in ascending bond index. A repeated index fails this check |
| `BondNotActive`               | `ERR_BOND_NOT_ACTIVE (u31)`               | A listed bond exists but is not active at the calculation height                                                               |

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/eligibility.ts#L630-L714)

***

### Signature

```ts
function fetchEligibleCalculateRewards(
  opts: {
    bondIndices: number[];
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

#### opts.bondIndices (required)

* **Type**: `number[]`

Bonds to settle, in the order you would pass them to `buildCalculateRewards`: descending `stxValueRatio`, ties by ascending bond index. Must include every bond active at the calculation height.

#### opts.poxInfo (optional)

* **Type**: `PoxInfo`

A [PoxInfo](../types/poxinfo.md) you already hold, which saves a request. Fetched with [fetchPoxInfo](../fetch/fetchpoxinfo.md) when omitted. The calculation height comes from its `currentBurnchainBlockHeight`, so pass a recent value.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
