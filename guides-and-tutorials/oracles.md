# Oracles

## Price‑Feed Oracles on Stacks

Smart contracts written in **Clarity** run in a deterministic sandbox: they can read data in the Stacks and Bitcoin chainstate, but _nothing else_. Whenever your dApp needs the latest **BTC/USD**, **STX/BTC**, or any other market price, you’ll rely on an **oracle** to bring that data on‑chain in a verifiable way.

This page lays out _why_ price‑feed oracles matter on Stacks and link to the specific oracle provider docs for instructions on how to integrate them.

***

### Why you need a price‑feed oracle

Here are some possible scenarios where you might need an oracle.

| On‑chain need                        | Typical Stacks use case                        | What the oracle supplies            |
| ------------------------------------ | ---------------------------------------------- | ----------------------------------- |
| **Liquidations & collateral ratios** | Lending / borrowing protocols, margin trading  | Signed price updated every N blocks |
| **Stablecoin peg maintenance**       | BTC‑backed or exogenous‑collateral stablecoins | Reference BTC/USD (or other) price  |
| **AMM curve calculations**           | DEXs that tune fees or rebalance pools         | Time‑weighted average price (TWAP)  |
| **Derivatives settlement**           | Options, futures, or perpetual swaps           | Final settlement price at expiry    |

> **Rule of thumb:** if your contract’s math depends on a real‑time market price, you need a price‑feed oracle.

### Oracle Providers

There are two oracle providers that Stacks builders are currently using for their data needs: Pyth and DIA.

Pyth is a pull-based oracle and Trust Machines currently maintains the Pyth bridge. You can view docs on how to use Pyth and the associated Clarity contracts on Trust Machine's [GitHub repo for the bridge.](https://github.com/Trust-Machines/stacks-pyth-bridge)

DIA is the other oracle provider Stacks builders frequently use.

There is a documentation guide on how to use DIA oracles with Stacks on [DIA's docs website](https://nexus.diadata.org/how-to-guides/fetch-price-data/chain-specific-guide/stacks).
