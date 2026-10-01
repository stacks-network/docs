---
description: >-
  Short answers for members of an sBTC bond pool: which pools exist, what the
  pool contract holds, and what you can check on-chain.
---

# sBTC Pool FAQ

A bond pool lets you join a protocol bond without an allowlist entry of your own. The pool's contract holds the bond membership and joins with the sBTC and STX it gathers. What you put in depends on the pool: some take both sBTC and STX from members, others take only sBTC and supply the STX themselves. For running a pool, see [Bond Pool Operator Guide](bond-pool-operator-guide.md).

## Which pools can I join?

As of October 2026:

| Pool                                                                                                                          | You deposit                                           | You hold                                             | STX for the bond                                  | Bond staker contract                                               |
| ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------ |
| [Stacking DAO stBTC](https://docs.stackingdao.com/stackingdao/the-stacking-dao-app/stbtc-liquid-btc-staking-with-btc-rewards) | sBTC, or BTC that first moves through the sBTC peg-in | stBTC, a liquid token whose value grows against sBTC | Supplied by Stacking DAO from its own STX reserve | `SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.stbtc-staker-bond-1-v2`  |
| [Esbee DAO](https://www.esbee-dao.org/)                                                                                       | sBTC and the STX the bond requires                    | A share of the pool, recorded by the pool contract   | Your own STX, held by the pool's treasury         | `SPFCGF789WX1B737VQYAQ6BG3QYVMJGPDKRKYK00.esbee-dao-bond-staker-1` |

The two differ in more than the STX leg. Stacking DAO's contracts are audited, and stBTC can be used in other Stacks DeFi applications while it earns. Esbee DAO puts the operator's powers behind a vote of the pool's members, and its site states that its contracts are unaudited.

## Who is the staker in pox-5?

The pool's bond staker contract. It calls `register-for-bond` with the pool's totals and holds a single bond membership. pox-5 keeps no record of individual members.

## Who holds my sBTC and STX?

The pool's contracts. pox-5 has no deposit, withdrawal or member-accounting function, so each pool's own code decides how deposits, withdrawals and balances work. Read the pool's contracts or terms before you deposit.

## Can a pool lock native BTC?

No. Pools hold sBTC only. A native BTC bond is held by one staker and needs that staker's own allowlist entry. See [Opening a Bond Position](opening-a-bond-position.md).

## How long is the pool locked?

The pool's bond runs 12 reward cycles, 25,200 Bitcoin blocks, roughly six months, and the STX in it stays locked until the bond ends. When you can take your share out is set by the pool:

* **Stacking DAO stBTC:** redeem stBTC for sBTC after a cooldown, or straight away from idle reserves, if available, for a fee (1% when this was written). The app shows the current route and fee.
* **Esbee DAO:** request an exit and get your principal back at the next roll into a new bond, or take your sBTC out of the bond early with `unstake-sbtc-early`. An early exit forfeits the rest of that bond's rewards, and your STX still waits for the roll.

## Can the pool take sBTC out before the bond ends?

Yes. The pool contract can withdraw part or all of its sBTC with `unstake-sbtc` during the reward phase of any cycle, which excludes its last 100 Bitcoin blocks (the prepare phase), and also after the bond ends. Its STX stays locked for the full term.

## How do rewards reach me?

pox-5 pays rewards as sBTC to the signer-manager the pool registered with, and the pool passes them on by its own rules. With stBTC, rewards raise the value of stBTC against sBTC rather than being paid out. Esbee DAO splits them by the shares each member held in that bond.

## Can the operator change the pool's signer-manager?

Yes, mid-term, with `update-bond-registration`. The pool's locked amounts and term do not change. See [Escape hatches](bond-pool-operator-guide.md#escape-hatches).

## What can I check on-chain?

These reads return the pool's position, not yours. Your share is recorded by the pool's own contracts. Pass the pool's bond staker contract as `poolContract`.

```ts
import { fetchBondAllowance, fetchBondMembership, fetchEarned } from '@stacks/bitcoin-staking';

const network = 'mainnet';

// The pool's allowlisted cap for the bond, in sats
const cap = await fetchBondAllowance({ bondIndex, address: poolContract, network });

// The pool's bond membership: bond index, amounts and signer-manager
const membership = await fetchBondMembership({ address: poolContract, network });

// sBTC sats earned by the pool's signer-manager and not yet claimed, for one reward cycle and bond
const earned = await fetchEarned({ signerManager, rewardCycle, bondIndex, network });
```

The Stacks Blockchain API serves the same positions without the SDK: see [Bitcoin Staking endpoints](https://docs.stacks.co/reference/api/stacks-blockchain-api/bitcoin-staking).
