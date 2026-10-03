# fetchLastRewardComputeHeight

Reads the calculation height stored by the last `calculate-rewards` call: the Bitcoin block before the start of the distribution cycle it ran in. Wraps the pox-5 read-only `get-last-reward-compute-height`, which returns the `last-reward-compute-height` data-var.

***

### Usage

```ts
import {
  currentDistributionCycle,
  distributionCycleToBurnHeight,
  fetchLastRewardComputeHeight,
  fetchPoxInfo,
} from '@stacks/bitcoin-staking';

const poxInfo = await fetchPoxInfo({ network: 'mainnet' });
const lastHeight = await fetchLastRewardComputeHeight({ network: 'mainnet' });

// The height calculate-rewards would use now
const calculationHeight =
  distributionCycleToBurnHeight({ distributionCycle: currentDistributionCycle(poxInfo), poxInfo }) - 1;
const pending = calculationHeight > lastHeight;
```

#### Notes

* `calculate-rewards` reverts with `ERR_DISTRIBUTION_ALREADY_COMPUTED (u30)` unless the current calculation height is greater than this value ([calculate-rewards](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2161-L2174)). It stores the new height on success ([calculate-rewards](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2211)).
* A distribution cycle is half a reward cycle: 1,050 Bitcoin blocks on mainnet ([distribution-cycle-to-burn-height](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2938-L2943)). [distributionCycleToBurnHeight](../cycles/distributioncycletoburnheight.md) and [currentDistributionCycle](../cycles/currentdistributioncycle.md) compute the same values locally.
* The data-var starts at `0` ([last-reward-compute-height](https://github.com/stacks-network/stacks-core/blob/10474cdec9f9c0bdf05841b58cffc89cdad87a9b/stackslib/src/chainstate/stacks/boot/pox-5.clar#L381)).
* A non-2xx response throws an `Error` whose message starts with `Error calling read-only function.` and includes the status code and URL. If the node reports that the call failed, the `Error` message is the node's `cause`.

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/6101c99efe5a9616ce7e16cef68e28fd10676e7e/packages/bitcoin-staking/src/fetch.ts#L1149-L1170)

***

### Signature

```ts
function fetchLastRewardComputeHeight(opts?: NetworkClientParam): Promise<number>;
```

`opts` is a [NetworkClientParam](../../stacks-network/network/NetworkClientParam.md).

***

### Returns

`Promise<number>`

Resolves to a Bitcoin block height as a `number`.

***

### Parameters

#### opts.network (optional)

* **Type**: `StacksNetworkName | StacksNetwork`

The network to query: a name such as `'mainnet'` or `'testnet'`, or a [StacksNetwork](../../stacks-network/network/StacksNetwork.md) object. Defaults to `'mainnet'`.

#### opts.client (optional)

* **Type**: `{ baseUrl?: string; fetch?: FetchFn }`

Overrides the API base URL or the `fetch` function, for example to query your own node. Fields you set replace the network's defaults.
