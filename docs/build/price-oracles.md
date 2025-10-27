# Price Oracles

<figure><img src=".gitbook/assets/image (6).png" alt=""><figcaption><p>source: Hiro</p></figcaption></figure>

## Price‑Feed Oracles on Stacks

Smart contracts written in **Clarity** run in a deterministic sandbox: they can read data in the Stacks and Bitcoin chainstate, but _nothing else_. Whenever your dApp needs the latest **BTC/USD**, **STX/BTC**, or any other market price, you’ll rely on an **oracle** to bring that data on‑chain in a verifiable way.

This page explains why price‑feed oracles matter on Stacks and links to the specific oracle provider docs with instructions on how to integrate them.

***

### Why you need a price‑feed oracle

Here are some possible scenarios where you might need an oracle.

| On‑chain need                        | Typical Stacks use case                        | What the oracle supplies            |
| ------------------------------------ | ---------------------------------------------- | ----------------------------------- |
| **Liquidations & collateral ratios** | Lending / borrowing protocols, margin trading  | Signed price updated every N blocks |
| **Stablecoin peg maintenance**       | BTC‑backed or exogenous‑collateral stablecoins | Reference BTC/USD (or other) price  |
| **AMM curve calculations**           | DEXs that tune fees or rebalance pools         | Time‑weighted average price (TWAP)  |
| **Derivatives settlement**           | Options, futures, or perpetual swaps           | Final settlement price at expiry    |

{% hint style="info" %}
Rule of thumb: if your contract’s math depends on a real‑time market price, you need a price‑feed oracle.
{% endhint %}

### Oracle Providers

There are two oracle providers that Stacks builders commonly use for price data: Pyth and DIA.

**Pyth**

Pyth is a pull-based oracle. Trust Machines currently maintains the Pyth bridge. See the docs and Clarity contracts on Trust Machine's GitHub [repo](https://github.com/Trust-Machines/stacks-pyth-bridge) for the bridge. Check out the step-by-step guide from the Hiro blog:

{% embed url="https://www.hiro.so/blog/using-real-time-price-data-in-clarity" %}

**DIA**

DIA is another oracle provider used by Stacks builders. See DIA's [guide](https://nexus.diadata.org/how-to-guides/fetch-price-data/chain-specific-guide/stacks) for how to use DIA oracles with Stacks. Check out the video tutorial to learn more on how DIA works for Clarity smart contracts:

{% embed url="https://youtu.be/bhWQxHGpv2s?si=dWlBAEAuYtoQj2sC" %}
