---
description: >-
  Clarifying some common questions and sharing external resources for Dual
  Stacking
---

# FAQ

#### General Dual Stacking Questions

<details>

<summary>Why can't other chains do this?</summary>

Other blockchains pay rewards in what they can mint (ETH, SOL, etc.). They have no mechanism to channel real Bitcoin.

Stacks has Proof of Transfer (PoX): Consensus mechanism that channels Bitcoin from miners to network participants. Operational since 2021. Over 4,000 BTC moved through PoX to date. This architectural difference makes Bitcoin earning Bitcoin rewards possible.

</details>

<details>

<summary>How is this different from wrapped BTC?</summary>

Rewards are paid in sBTC, redeemable for Bitcoin at any time and actual Bitcoin through PoX consensus, not platform tokens.

</details>

<details>

<summary>When is this live?</summary>

sBTC has been operational since December 2024. Dual Stacking launches November 2025.

{% hint style="info" %}
Coinciding with the Dual Stacking launch, the existing sBTC Rewards Program will sunset on October 31, 2024.
{% endhint %}

</details>

<details>

<summary>What will happen to the sBTC Rewards Program?</summary>

Coinciding with the Dual Stacking launch, the existing sBTC Rewards Program will sunset on October 31, 2024. But don’t worry, you can earn even more sBTC with Dual Stacking - a new way to stack both STX and sBTC to create stronger alignment between Bitcoin capital and the Stacks network.

**Key Dates to be aware of:**

Oct 30: Dual Stacking launches and you can enroll to start earning&#x20;

Nov 4: sBTC Rewards Program ends and final rewards distributed&#x20;

Nov 5: First Dual Stacking rewards cycle begins

Nov 20 (estimated): First Dual Stacking rewards cycle ends, rewards distributed\


</details>

#### Dual Stacking Rewards

<details>

<summary>What are the minimum requirements?</summary>

The minimum to mint sBTC via the sBTC Bridge app is currently at 0.001 BTC (100,000 sats).

The minimum to enroll in Dual Stacking with your minted sBTC will be 0.0001 sBTC (10,000 sats).

Stacking STX is done normally through stacking pools, so no minimum. The Dual Stacking web app will auto-detect if a user is currently stacking STX.

</details>

<details>

<summary>Can I just stack BTC?</summary>

Yes, if you lock BTC only, you still earn base rewards. No STX required to participate.

</details>

<details>

<summary>Where does the yield come from?</summary>

Stacks is the only blockchain with Proof of Transfer—a consensus mechanism that channels BTC from miners to participants who secure the network by Stacking STX. At launch, Dual Stacking rewards will come from Stacks entities who volunteer their Stacking rewards (earned via Proof of Transfer) to Dual Stacking participants as sBTC.

</details>

<details>

<summary>How often are rewards paid out?</summary>

Rewards are paid out roughly every 2 weeks in line with PoX stacking cycles, with the first cycle beginning on November 5, 2025.

</details>

<details>

<summary>How are rewards calculated?</summary>

A Dual Stacking calculator is available in-app to help estimate your annual rewards based on the ratio of BTC/STX you are stacking. The system uses a square-root reward curve that creates diminishing returns, meaning your first STX paired with BTC has the biggest impact on your rewards, while additional STX continues to help at a decreasing rate. Review the [Dual Stacking Litepaper](https://github.com/stx-labs/papers/blob/main/Dual%20Stacking%20Litepaper.pdf) for more details.

</details>

<details>

<summary>How will this impact my existing Stacking rewards?</summary>

Dual Stacking does not modify PoX consensus, meaning there is no direct change to native Stacking rewards. No action is required to continue natively Stacking. Dual Stacking may indirectly impact stacking rewards by increasing more stacking participation overall.

</details>

#### Concerning Dual Stacking Security

<details>

<summary>What are the trust assumptions?</summary>

Dual Stacking operates as a transparent smart contract on the Stacks network. sBTC bridge operations are secured by a federation of [reputable signers](https://www.stacks.co/sbtc), with a 70% threshold of signer approval required for any transaction. No single entity can move funds unilaterally.

</details>

#### External Resources

* [\[Twitter\]](https://x.com/andrerserrano/status/1977845457226178757) Dual Stacking Litepaper Announcement from Andre Serrano
* [\[Github\]](https://github.com/stx-labs/papers/blob/main/Dual%20Stacking%20Litepaper.pdf) Official Dual Stacking Litepaper
* [\[Stacks Forum\]](https://forum.stacks.org/t/stacks-economic-model-unlocking-bitcoin-capital-long-term-growth/18035#dual-stacking-aligning-btc-and-stx-incentives-3) Initial Dual Stacking Announcement
* [\[Stacks Official\]](https://www.stacks.co/dual-stacking) Dual Stacking landing page on stacks.co
* \[[Stacks Blog](https://www.stacks.co/blog/dual-stacking-launches-on-stacks)] Official blog announcement
* \[[Stacks Twitter](https://x.com/Stacks/status/1983900168954286342)] Official twitter announcement
* \[[Dual Stacking App](https://app.stacks.co/)] Official Dual Stacking App

#### Related Technical Resources

* [\[Explorer\]](https://explorer.hiro.so/txid/SP1HFCRKEJ8BYW4D0E3FAWHFDX8A25PPAA83HWWZ9.dual-stacking-v1?chain=mainnet) `dual-stacking-v1` : Main Dual Stacking Contract
