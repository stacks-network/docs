---
description: Understanding the economics behind Dual Stacking.
---

# Economic Model

<div data-with-frame="true"><figure><img src="../.gitbook/assets/dual-stacking-model-diagram.png" alt=""><figcaption></figcaption></figure></div>

Dual Stacking introduces an economic model in which BTC-denominated rewards scale with the participant’s ratio of sBTC to stacked STX as well as sBTC deployed in DeFi. This creates a direct link between Bitcoin capital and the growth of the Stacks ecosystem.

All participants receive a baseline BTC-denominated reward on the sBTC enrolled in Dual Stacking. They have the option of earning additional rewards by stacking STX as well as deploying sBTC into DeFi.

For Stacking STX, Bitcoin rewards grow based on an individuals STX-to-sBTC ratio relative to other participants, up to 10× the base yield. The system uses a square-root curve, meaning the first stacked STX has the greatest impact, with smaller boosts as more STX is stacked. The DeFi boost is straightforward, you automatically earn 10x multiple for any amount of sBTC deployed in DeFi.

At the same time, an individual's stacked STX continues earning standard [stacking](../block-production/stacking.md) rewards.

{% hint style="info" %}
The following Reward Function Parameters section is taken directly from the [Dual Stacking litepaper](https://github.com/stx-labs/papers/blob/main/Dual%20Stacking%20Litepaper.pdf).
{% endhint %}

#### Reward Function Parameters

* **Rewards Boost Multiplier** – Defines the maximum multiple of base reward attainable by users\
  with the highest STX/BTC ratio. For example, with a 10× multiplier, a user earning 0.5%\
  base reward could reach 5% if staking the maximum effective ratio of STX to BTC.
* **Reward Function Curve** – Defines how rewards scale across intermediate STX/BTC\
  ratios. A square-root curve introduces diminishing returns, encouraging broad\
  participation rather than concentration of rewards among large holders.
* **Max Reference STX/BTC Ratio** – Set to the BTC-weighted 95th percentile of STX/BTC\
  ratios among users. That is, the value above which only 5% of total locked BTC has a\
  higher STX/BTC ratio. Under this approach, for a user to unilaterally set the max\
  reference STX/BTC ratio, the user would need both 5% of the total BTC locked and have\
  the highest STX/BTC ratio for those BTC. This design minimizes manipulation by\
  preventing outliers from disproportionately setting the maximum yield threshold.

To describe the reward function more precisely, we’ll define some terms:

* 𝑌 − 𝑇𝑜𝑡𝑎𝑙 𝐵𝑇𝐶 𝑑𝑖𝑠𝑡𝑟𝑖𝑏𝑢𝑡𝑒𝑑 𝑎𝑠 𝑟𝑒𝑤𝑎𝑟𝑑𝑠 𝑡𝑜 𝑑𝑢𝑎𝑙 𝑠𝑡𝑎𝑐𝑘𝑖𝑛𝑔 𝑑𝑢𝑟𝑖𝑛𝑔 𝑎 𝑆𝑡𝑎𝑐𝑘𝑖𝑛𝑔 𝑐𝑦𝑐𝑙𝑒
* 𝐵<sub>𝑖</sub> − 𝐴𝑚𝑜𝑢𝑛𝑡 𝑜𝑓 𝐵𝑇𝐶 𝑡ℎ𝑒 𝑖𝑡ℎ 𝑢𝑠𝑒𝑟 𝑙𝑜𝑐𝑘𝑠 𝑖𝑛 𝑎 𝑆𝑡𝑎𝑐𝑘𝑖𝑛𝑔 𝑐𝑦𝑐𝑙𝑒
* 𝑆<sub>𝑖</sub> − 𝐴𝑚𝑜𝑢𝑛𝑡 𝑜𝑓 𝑆𝑇𝑋 𝑡ℎ𝑒 𝑖𝑡ℎ 𝑢𝑠𝑒𝑟 𝑙𝑜𝑐𝑘𝑠 𝑖𝑛 𝑎 𝑆𝑡𝑎𝑐𝑘𝑖𝑛𝑔 𝑐𝑦𝑐𝑙𝑒
* 𝑑<sub>𝑖</sub> = 𝑆<sub>𝑖</sub> _/_ 𝐵<sub>𝑖</sub> − 𝐴𝑚𝑜𝑢𝑛𝑡 𝑜𝑓 𝑆𝑇𝑋 𝑝𝑒𝑟 𝐵𝑇𝐶 𝑡ℎ𝑒 𝑖𝑡ℎ 𝑢𝑠𝑒𝑟 𝑙𝑜𝑐𝑘𝑠 𝑖𝑛 𝑎 𝑆𝑡𝑎𝑐𝑘𝑖𝑛𝑔 𝑐𝑦𝑐𝑙𝑒
* 𝐷 − 𝑀𝑎𝑥 𝑟𝑒𝑓𝑒𝑟𝑒𝑛𝑐𝑒 𝑑<sub>𝑖</sub> , 𝑤ℎ𝑖𝑐ℎ 𝑖𝑠 𝑠𝑒𝑡 𝑡𝑜 𝑡ℎ𝑒 95𝑡ℎ 𝑝𝑒𝑟𝑐𝑒𝑛𝑡𝑖𝑙𝑒 𝑜𝑓 𝐵𝑇𝐶𝑤𝑒𝑖𝑔ℎ𝑡𝑒𝑑 𝑑<sub>𝑖</sub>
* 𝑀 − 𝑟𝑒𝑤𝑎𝑟𝑑𝑠 𝑏𝑜𝑜𝑠𝑡 𝑚𝑢𝑙𝑡𝑖𝑝𝑙𝑖𝑒𝑟 𝑚𝑖𝑛𝑢𝑠 𝑜𝑛𝑒

The first step in our reward function is to determine a normalized ratio, 𝑟<sub>𝑖</sub> , for all users:

$$
𝑟_𝑖 = 𝑚𝑖𝑛(\frac{𝑑_𝑖}{𝐷}, 1)
$$

With the normalized ratio, we can then determine normalized weights, _w_<sub>𝑖</sub> , for all users:

$$
𝑤_𝑖 = 𝐵_𝑖\cdot(1 + 𝑀\cdot \sqrt{𝑟_𝑖})
$$

Ultimately, the rewards for each user, _y_<sub>𝑖</sub> , would be:

$$
𝑦_𝑖 = 𝑌 \cdot \frac{𝑤_𝑖}{\sum𝑤_𝑗}
$$

The generalized shape of the reward function is shown in the graph below. The two lines, one\
dark orange and one light orange, show the shape of the yield curves for the expected rewards on\
one’s sBTC holdings only as a result of dual stacking rewards, and the shape of the yield curve\
for one’s combined sBTC and STX as a result of the combination of dual stacking rewards on\
one’s sBTC and the standard stacking rewards for one’s STX.

<div data-with-frame="true"><figure><img src="../.gitbook/assets/image (15).png" alt=""><figcaption><p>Staking STX alongside BTC amplifies rewards based on a yield curve, up to 10x.</p></figcaption></figure></div>

***

For more detail on the Reward Function parameters and models, refer to the [Dual Stacking litepaper](https://github.com/stx-labs/papers/blob/main/Dual%20Stacking%20Litepaper.pdf).
