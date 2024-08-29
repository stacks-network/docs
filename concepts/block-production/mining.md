# Mining

{% hint style="info" %}
This is conceptual guide that covers how mining works. For practical steps on how to setup your own miner please refer to the guides to running a miner on [mainnet](../../guides-and-tutorials/run-a-miner/mine-mainnet-stacks-tokens.md) and [testnet](../../guides-and-tutorials/run-a-miner/mine-testnet-stacks-tokens.md).
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

<figure><img src="../../.gitbook/assets/image (8).png" alt=""><figcaption></figcaption></figure>

### Transaction fees

Miners receive Stacks fees for transactions mined in any block they produce.

### Reward maturity

Block rewards and transaction fees take 100 blocks on the Bitcoin blockchain to mature. After successfully mining a block your rewards appear in your Stacks account after \~24 hours.

### Mining with proof-of-transfer

Miners commit Bitcoin to **two** addresses in every leader block commit. The amount committed to each address must be the same. The addresses are chosen from the current reward set of stacking participants. Addresses are chosen using a verifiable-random-function, and determining the correct two addresses for a given block requires monitoring the Stacks chain.

For more detailed information on this process, read [SIP-007](https://github.com/stacksgov/sips/blob/main/sips/sip-007/sip-007-stacking-consensus.md), which describes proof of transfer in detail.

<figure><img src="../../.gitbook/assets/image (9).png" alt=""><figcaption></figcaption></figure>

PoX mining is a modification of Proof-of-Burn (PoB) mining, where instead of sending the committed Bitcoin to a burn address, it's transferred to eligible STX holders that participate in the stacking protocol.

{% hint style="info" %}
A PoX miner can only receive newly minted STX tokens when they transfer Bitcoin to eligible owners of STX tokens
{% endhint %}

<figure><img src="../../.gitbook/assets/image (10).png" alt=""><figcaption></figcaption></figure>

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

### What About Microblocks?

Microblocks are a legacy feature of the previous version of Stacks that no longer exist. They were originally created as a way to improve transaction throughput, but without the functionality of Nakamoto, they never worked in practice.

Instead of microblocks, Nakamoto instead utilizes a block production structure that creates Stacks blocks at a rapid cadence as described here.
