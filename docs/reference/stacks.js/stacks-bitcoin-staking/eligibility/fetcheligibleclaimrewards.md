# fetchEligibleClaimRewards

Dry-runs the checks of pox-5 `claim-rewards`, which pays a signer-manager its settled sBTC rewards for one reward cycle, and reports every gate that would fail. Run it before [buildClaimRewards](../build/buildclaimrewards.md).

***

### Usage

```ts
import { fetchEligibleClaimRewards, fetchPoxInfo } from '@stacks/bitcoin-staking';

const poxInfo = await fetchPoxInfo({ network: 'mainnet' });

const result = await fetchEligibleClaimRewards({
  signerManager: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.my-signer-manager',
  rewardCycle: poxInfo.rewardCycleId,
  bondIndices: [0],
  network: 'mainnet',
});

if (!result.ok) console.log(result.reasons); // Pox5ErrorCode values
```

#### Notes

* Mirrors the asserts of [`claim-rewards`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2387-L2438). The claimable total is the sum of [`get-earned`](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2341-L2354) for the STX-only leg and for each entry in `bondIndices`, all at `rewardCycle`.
* `claim-rewards` pays `contract-caller`, so the signer-manager contract itself must make the call.
* `rewardCycle` is a reward cycle ID, not a distribution cycle index.
* The contract takes at most 6 bond indices (`(list 6 uint)`). This function does not check the list length.
* Not checked: the sBTC transfer from pox-5 to the signer-manager.
* Throws if a read returns a non-2xx response.

| Reason               | Contract error                   | Added when                                                                                  |
| -------------------- | -------------------------------- | ------------------------------------------------------------------------------------------- |
| `RewardsPaused`      | `ERR_REWARDS_PAUSED (u53)`       | The `rewards-paused` data-var is `true`. `pause-rewards` sets it, and no function clears it |
| `NoClaimableRewards` | `ERR_NO_CLAIMABLE_REWARDS (u32)` | The claimable total is 0 sats                                                               |

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/eligibility.ts#L716-L759)

***

### Signature

```ts
function fetchEligibleClaimRewards(
  opts: {
    signerManager: string;
    rewardCycle: number;
    bondIndices: number[];
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

#### opts.signerManager (required)

* **Type**: `string`

Contract ID of the signer-manager that would claim. It becomes the contract's `contract-caller`.

#### opts.rewardCycle (required)

* **Type**: `number`

Reward cycle to claim, for the STX-only leg and for every bond leg in `bondIndices`.

#### opts.bondIndices (required)

* **Type**: `number[]`

Bonds whose legs to claim. Pass `[]` to claim the STX-only leg alone.

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
