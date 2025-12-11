# Mining

<figure><img src="../.gitbook/assets/image (8).png" alt=""><figcaption><p>source: <a href="https://www.hiro.so/blog">Hiro blog</a></p></figcaption></figure>

{% hint style="info" %}
This is conceptual guide that covers how mining works. For practical steps on how to setup your own miner please refer to the guides to running a miner on [mainnet](https://app.gitbook.com/s/4cpTb2lbw0LAOuMHrvhA/run-a-miner/mine-mainnet-stacks-tokens) and [testnet](https://app.gitbook.com/s/4cpTb2lbw0LAOuMHrvhA/run-a-miner/mine-testnet-stacks-tokens).
{% endhint %}

### Miner Tenures

In previous version of Stacks (before the Nakamoto Upgrade), Stacks miners would mine new Stacks blocks at a one-to-one cadence with Bitcoin blocks.

After Nakamoto, this is no longer the case. Under Nakamoto rules, miners are instead selected for a tenure that corresponds to a Bitcoin block. During this tenure, miners build and propose several Stacks blocks (roughly every 10 seconds) and stackers will approve and append them (next section).

To be considered for a tenure, a miner must have a block commit included in a Bitcoin block. If a miner wishes to update their commitment after submission, they may use Bitcoin Replace-By-Fee.

### Coinbase rewards

Miners receive coinbase rewards for tenures they win.

The reward amounts are:

* 1000 STX per tenure are released in the first 4 years of mining
* 500 STX per tenure are released during the following 4 years
* 250 STX per tenure are released during the following 4 years
* 125 STX per tenure are released from then on indefinitely.

These "halvings" are synchronized with Bitcoin halvings.

<figure><img src="../.gitbook/assets/image (16).png" alt=""><figcaption></figcaption></figure>

### Transaction fees

Miners receive Stacks fees for transactions mined in any block they produce.

### Reward maturity

Block rewards and transaction fees take 100 blocks on the Bitcoin blockchain to mature. After successfully mining a block your rewards appear in your Stacks account after \~24 hours.

### Mining with proof-of-transfer

Miners commit Bitcoin to **two** addresses in every leader block commit. The amount committed to each address must be the same. The addresses are chosen from the current reward set of stacking participants. Addresses are chosen using a verifiable-random-function, and determining the correct two addresses for a given block requires monitoring the Stacks chain.

For more detailed information on this process, read [SIP-007](https://github.com/stacksgov/sips/blob/main/sips/sip-007/sip-007-stacking-consensus.md), which describes proof of transfer in detail.

<figure><img src="../.gitbook/assets/image (17).png" alt=""><figcaption></figcaption></figure>

PoX mining is a modification of Proof-of-Burn (PoB) mining, where instead of sending the committed Bitcoin to a burn address, it's transferred to eligible STX holders that participate in the stacking protocol.

{% hint style="info" %}
A PoX miner can only receive newly minted STX tokens when they transfer Bitcoin to eligible owners of STX tokens
{% endhint %}

<figure><img src="../.gitbook/assets/image (18).png" alt=""><figcaption></figcaption></figure>

Miners run Stacks nodes with mining enabled to participate in the PoX mechanism. The node implements the PoX mechanism, which ensures proper handling and incentives through four key phases:

* Registration: miners register for a future election by sending consensus data to the network
* Commitment: registered miners transfer Bitcoin to participate in the election. Committed BTC are sent to a set participating STX token holders
* Election: a verifiable random function chooses one miner for a new tenure to write blocks on the Stacks blockchain
* Assembly: the elected miner writes the new blocks by pulling transactions from the mempool and collects rewards in form of new STX tokens

### Probability to mine next block

The miner who is selected to mine the next block is chosen depending on the amount of BTC the miners sent, that is, transferred or burnt.

The probability for a miner to mine the next block is determined using a variation of the Assumed Total Commitment with Carryforward (ATC-C) MEV mitigation strategy described in [this document](https://github.com/stacksgov/sips/blob/feat/sip-021-nakamoto/sips/sip-021/MEV-Report.pdf) to allocate block rewards to miners. The probability a miner will win the sortition and be granted the current tenure will be based on a function that accounts for the total block commit spend on the blocks leading up to the current sortition.

You can read more about this in the [MEV section of SIP-021](https://github.com/stacksgov/sips/blob/feat/sip-021-nakamoto/sips/sip-021/sip-021-nakamoto.md#block-reward-distribution-and-mev).

While there is no minimum BTC commitment enforced by the protocol, in practice, there's a floor constrained by [dust](https://unchained-capital.com/blog/dust-thermodynamics/): basically, if the fees for a transaction exceed the value of the spent output, it's considered dust. How dust is [calculated](https://github.com/bitcoin/bitcoin/blob/master/src/policy/policy.cpp#L14) depends on a number of factors, we've found 5,500 satoshis to be good lower bound per [output](https://learnmeabitcoin.com/technical/output). Bitcoin transactions from Stacks miners contain two outputs (for Proof-of-Transfer), so a commitment of at least 11,000 satoshis / block is recommended.

To calculate the amount of BTC to send miners should:

* Guess the price BTC/STX for the next day (100 blocks later)
* Guess the total amount of BTCs committed by all miners

Stackers are in charge of both validating and appending new blocks and conducting miner tenure changes. The next section will explain how that works, and then we'll see how this process results in Bitcoin finality.

### Stacks mining in practice

If you take a look at [SIgnal21's mining dashboard](https://app.signal21.io/stacks/mining), you can view some interesting data about mining on the Stacks network, including BTC spent per block, STX earned per block, the total number of miners over the course of the chain's history, and the number of miners for any given block.

Many people notice the seemingly small number of miners on Stacks. Without context, this can sometimes raise eyebrows. Let's dig into how mining works on Stacks so we can understand why this isn't an issue for decentralization.

Stacks miners function similarly to sequencers in L2 systems in that they are only responsible for constructing and proposing new blocks, not appending them to the chain. But unlike most Ethereum L2s that operate with just a single centralized sequencer, Stacks consistently has at least 4-5 miners with open membership allowing anyone to join.

It's important to note that there are two primary parties involved in the block production process on Stacks: miners and stackers.

These two roles serve complementary relationships in the [block production process](README.md), and stackers drastically reduce any potential destructive power miners have over the chain.

Miners cannot reorganize the chain. In the worst case, all miners can do is omit (some kinds of) transactions, and all that is required to address this is to run your own miner.

Furthermore, more miners on the network would mean fewer BTC rewards for Stackers, as miners would have to spend more of their funds on Bitcoin L1 fees rather than sending it to the Stackers.

{% hint style="info" %}
**Wouldn't more miners mean more competition, meaning more rewards?**

The reason more miners means fewer rewards is because miners act economically rationally, and they don't have an unlimited amount of BTC to work with.

Miners are paying their PoX commitments plus their Bitcoin fees for a chance to win the coinbase (1,000 STX) plus fees for a tenure. If there are more miners, they will each pay less, because they will have a lower chance of winning. They can't pay ever-increasing amounts of BTC because at some point they will never be profitable, so there is a limit to how much BTC they can spend in order to try and win a tenure.

As they pay less, the Bitcoin fee becomes a more significant portion of their expenses, and that also decreases their odds of winning the tenure.

Here's a concrete example:

Let's say Stacks is trading at 1,000 Sats per STX.

The total spend from all miners, if everyone is acting logically and we ignore Stacks fees, would be less than 1,000,000 Sats (1,000 STX coinbase \* 1000 Sats/STX).

If that is from 5 miners, then it could be 10,000 Sats (2,000 Sats for each transaction) going to Bitcoin fees and 990,000 Sats going to PoX.

If there are 100 miners, then it would be 200,000 Sats going to Bitcoin fees, and 800,000 Sats going to PoX.
{% endhint %}

This creates a natural economic equilibrium where:

{% stepper %}
{% step %}
#### Enough miners participate to ensure blocks are produced reliably

Content as above describing reliability.
{% endstep %}

{% step %}
#### Stackers receive optimal BTC rewards

Content as above describing rewards optimization.
{% endstep %}

{% step %}
#### The network maintains censorship resistance without unnecessary mining competition

Content as above describing censorship resistance.
{% endstep %}
{% endstepper %}

This design is intentional - by having stackers as complimentary security guarantors who receive BTC rewards via PoX, Stacks achieves security without requiring an excessive number of miners competing solely to win block production rights.

Unlike other chains where miners alone determine the canonical chain, Stacks' two-party system provides stronger guarantees:

* Miners cannot force invalid transactions or blocks (stackers won't sign them, and even if they did, the nodes would not accept them)
* No miner can unilaterally reorg the chain (stackers control chain finality)
* The 70% stacker threshold signature requirement ensures broad consensus before blocks are accepted

This separation of concerns between miners and stackers is what makes Stacks uniquely secure despite having a small number of miners.

### What About Microblocks?

Microblocks are a legacy feature of the previous version of Stacks that no longer exist. They were originally created as a way to improve transaction throughput, but without the functionality of Nakamoto, they never worked in practice.

Instead of microblocks, Nakamoto instead utilizes a block production structure that creates Stacks blocks at a rapid cadence as described here.
