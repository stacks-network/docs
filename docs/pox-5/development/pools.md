---
description: >-
  sBTC pool participation — member deposits, operator registration, and
  pool-side monitoring.
---

# Pools

The [community tranche](../glossary.md#community-tranche-10) in PoX-5 is **sBTC-only via a pool**. Native-BTC bonds are individual-only. Each PoX-5 staker can hold at most one paired-bond membership, so the **pool contract** itself is the staker on PoX-5 — not the members behind it.

Members deposit STX + sBTC into the pool's contract; the pool itself then calls `register-for-bond` once with the aggregated totals. All member-level accounting lives inside the pool contract; PoX-5 only sees the pool.

### Member deposits (off-pox-5)

The member-facing deposit flow is **pool-defined**, not part of `pox-5`. The SDK only exposes the read-only pieces a member needs to inspect the pool before committing.

```ts
import { fetchBondAllowance } from '@stacks/bitcoin-staking';
import { fetchCallReadOnlyFunction } from '@stacks/transactions';

const network = 'mainnet';
const poolContract = 'SP000…COMMUNITY-POOL.v1';
const bondIndex = 0; // the community-tranche bond

// 1. Sanity-check that the pool itself is allowlisted on the bond.
const poolAllowance = await fetchBondAllowance({
  bondIndex,
  address: poolContract,
  network,
});
if (poolAllowance === 0n) throw new Error('pool not allowlisted');

// 2. Pool-defined deposit. Shape varies by operator — example uses a
//    hypothetical `(deposit (amount-ustx uint) (amount-sats uint))`;
//    `callPoolFunction` stands in for your contract-call plumbing
//    (e.g. `makeContractCall` + `broadcastTransaction` from @stacks/transactions).
await callPoolFunction({
  contract: poolContract,
  function: 'deposit',
  args: [memberUstx, memberSbtcSats],
  sender: member,
  network,
});
```

After the pool registers, member positions are tracked via pool-defined read-only functions, not via PoX-5:

```ts
const myPosition = await fetchCallReadOnlyFunction({
  contractAddress: poolContract.split('.')[0],
  contractName: poolContract.split('.')[1],
  functionName: 'get-position',
  functionArgs: [/* member principal */],
  senderAddress: member.stxAddress,
  network,
});
// → pool-defined: { sharesUstx, sharesSats, claimableSbtc, … }
```

Reward distribution is the pool's responsibility — PoX-5 pays the pool's signer-manager, and the pool splits onward to members.

### Pool operator registers for the bond

From PoX-5's perspective the pool contract is the staker. It aggregates STX + sBTC from members and calls `register-for-bond` on their behalf. The outer transaction below triggers the pool's own register function, which then registers with PoX-5 as the pool.

```ts
import { fetchBondAllowance } from '@stacks/bitcoin-staking';

const network = 'mainnet';
const poolContract = 'SP000…COMMUNITY-POOL.v1';

// Sanity: the pool's allowance covers the aggregated commitment.
const allowance = await fetchBondAllowance({
  bondIndex: pool.bondIndex,
  address: poolContract,
  network,
});
const totalSats = pool.aggregatedMemberSats;
if (totalSats > allowance) throw new Error('exceeds pool allocation');

// → broadcast the pool-defined `register` tx that calls into `as-contract`.
```

Prerequisites (established by the Endowment ahead of time):

* The pool contract must already be the **registered signer-manager** for its signer key.
* The pool contract must be on the bond's **allowlist** with a sufficient `max-sats` cap.

The pool is bonded for the full 12-cycle period as a single PoX-5 membership; member-level accounting lives entirely inside the pool. For BTC-capacity (native-BTC) bonds there is no pool path in PoX-5 — individual whitelisted partners self-enroll.

### Operator monitor view

After the pool registers, the operator wants a single read-only snapshot of how their bond is performing on PoX-5: total sats committed, share of the bond, total sBTC earned to date, and the still-unclaimed slice.

Three on-chain reads compose the picture:

* `get-signer-unclaimed-rewards-for-cycle` — running pending sBTC for `{ reward-cycle, bond-index, signer }` (with `bond-index: (some N)` for a bond cycle) ([pox-5.clar:3217](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3217)).
* `get-signer-rewards-per-token-settled-for-cycle` — last-settled `rewards-per-token` snapshot for the same key ([pox-5.clar:3203](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L3203)).
* `get-earned` — convenience wrapper that returns `pending + (shares × (rpt-current − rpt-settled)) / PRECISION` as the total still-claimable ([pox-5.clar:2341](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2341)).

```ts
import {
  fetchEarned,
  fetchPoxInfo,
  fetchSignerSharesStakedForCycle,
  fetchSignerUnclaimedRewards,
  fetchSignerRewardsPerTokenSettled,
  fetchTotalSharesStakedForCycle,
} from '@stacks/bitcoin-staking';

const network = 'mainnet';
const signerManager = 'SP000…COMMUNITY-POOL.v1';
const bondIndex = 7;

// bond legs are keyed per reward cycle
const pox = await fetchPoxInfo({ network });
const rewardCycle = pox.rewardCycleId;

const [bondTotal, mySharesBond, earnedTotal, unclaimed, rptSettled] = await Promise.all([
  fetchTotalSharesStakedForCycle({ rewardCycle, bondIndex, network }),
  fetchSignerSharesStakedForCycle({ signerManager, rewardCycle, bondIndex, network }),
  fetchEarned({ signerManager, rewardCycle, bondIndex, network }),
  fetchSignerUnclaimedRewards({ signerManager, rewardCycle, bondIndex, network }),
  fetchSignerRewardsPerTokenSettled({ signerManager, rewardCycle, bondIndex, network }),
]);

const dashboard = {
  bondTotalSats: bondTotal,
  mySatsInBond: mySharesBond,
  myShareBps: bondTotal === 0n ? 0 : Number((mySharesBond * 10_000n) / bondTotal),
  earnedTotal,            // pending + unsettled, in sBTC sats
  unclaimedSettled: unclaimed,
  rptSettled,             // last rewards-per-token snapshot for this signer
};
```

`earnedTotal` is what the pool's next `claim-rewards` call will pull. `myShareBps` is informational — pool-internal member weights drive the actual onward distribution.

#### Pool-operator escape hatches

* **`update-bond-registration`** ([pox-5.clar:850](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L850)) — bond participants can rotate to a new signer-manager mid-bond. Pool operators offering bond-side service should make sure their UI exposes this. Reverts with `ERR_UPDATE_BOND_SAME_SIGNER (u44)` if the new signer equals the current.
* **`unstake-sbtc`** ([pox-5.clar:1261](https://github.com/stacks-network/stacks-core/blob/pox-wf-integration/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1261)) — sBTC-locked bond participants can withdraw their locked sBTC at any time outside the prepare phase (full or partial); calls landing during the prepare phase revert with `ERR_STAKE_IN_PREPARE_PHASE (u47)`. There is no bond-deadline restriction here, unlike L1-locked participants whose BTC depends on the CLTV. The position keeps its accounting; only the sBTC balance shrinks.

For drill-down into a specific member's contribution to the pool's bond stake:

```ts
import { fetchStakerSharesStakedForCycle } from '@stacks/bitcoin-staking';

// bond legs are keyed per reward cycle
const memberShare = await fetchStakerSharesStakedForCycle({
  staker: poolContract,        // the on-chain staker IS the pool
  signer: signerManager,        // pool's signer-manager
  rewardCycle,
  bondIndex,
  network,
});
```

For pools the staker is always the pool contract itself, so this read returns the pool's full sats — member splits live off-pox-5.
