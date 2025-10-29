---
description: Understanding the economics behind Dual Stacking.
---

# Economic Model

<figure><img src="../.gitbook/assets/image (2).png" alt=""><figcaption><p>Users stake BTC, STX, or both to earn BTC-denominated rewards (via sBTC and BTC).</p></figcaption></figure>

{% hint style="info" %}
The following is taken directly from the [Dual Stacking litepaper](https://github.com/stx-labs/papers/blob/main/Dual%20Stacking%20Litepaper.pdf).
{% endhint %}

Dual Stacking introduces an economic model in which BTC yield scales with the participant’s\
ratio of sBTC to stacked STX. This creates a direct link between Bitcoin capital and the growth\
of the Stacks ecosystem.\
\
A reward function governs yield distribution. All participants receive a baseline BTC yield on\
their sBTC, while additional yield is unlocked in proportion to the amount of STX stacked\
alongside it.\
\
This reward function describes rewards for the sBTC held and not the STX held. STX continues\
to earn normal stacking rewards in addition to any dual stacking rewards a user’s sBTC might\
receive under the described reward function.

#### Reward Function Parameters

* **Yield Boost Multiplier** – Defines the maximum multiple of base yield attainable by users\
  with the highest STX/BTC ratio. For example, with a 10× multiplier, a user earning 0.5%\
  base yield could reach 5% if staking the maximum effective ratio of STX to BTC.
* **Reward Function Curve** – Defines how rewards scale across intermediate STX/BTC\
  ratios. A square-root curve introduces diminishing returns, encouraging broad\
  participation rather than concentration of yield among large holders.
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
* 𝑀 − 𝑌𝑖𝑒𝑙𝑑 𝑏𝑜𝑜𝑠𝑡 𝑚𝑢𝑙𝑡𝑖𝑝𝑙𝑖𝑒𝑟 𝑚𝑖𝑛𝑢𝑠 𝑜𝑛𝑒

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
dark orange and one light orange, show the shape of the yield curves for the expected yield on\
one’s sBTC holdings only as a result of dual stacking rewards, and the shape of the yield curve\
for one’s combined sBTC and STX as a result of the combination of dual stacking rewards on\
one’s sBTC and the standard stacking rewards for one’s STX.

<div data-with-frame="true"><figure><img src="../.gitbook/assets/image (5).png" alt=""><figcaption><p>Staking STX alongside BTC amplifies rewards based on a yield curve, up to 10x.</p></figcaption></figure></div>

#### Example Outcomes

To illustrate the dynamics of the model, we simulated several scenarios with different levels and\
distributions of STX and BTC participation. The below scenarios presume 5,000 BTC in dual\
stacking with 20% of current Stacking yield directed towards rewards. Actual numbers will\
fluctuate and approximations are based on historical data from the last year.&#x20;

If all else is held constant, yields will scale approximately inversely with the amount of BTC\
deposited. As such, one can, for example, infer approximate yields on 10,000 BTC from the\
scenarios modeled by cutting the yields in half.

<div data-with-frame="true"><figure><img src="../.gitbook/assets/image (4).png" alt=""><figcaption><p>Simulated Dual Stacking scenarios with different levels and<br>distributions of STX and BTC participation.</p></figcaption></figure></div>

When we also incorporate expected yield for standard stacking for users’ locked STX, the\
BTC-only yields remain unchanged (given that those users have no STX) and the users with\
greater STX see a greater increase in yields. We see the max yield increase approximately\
0.5% to 1.5% in annualized yield when including standard stacking yield on STX held.
