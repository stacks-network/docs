# Nakamoto in 10 Minutes

On the previous page, we outlined three primary changes to the way Stacks works that Nakamoto introduces:

* **Fast blocks:** The time taken for a user-submitted transaction to be mined within a block (and thus confirmed) will now take on the order of seconds, instead of tens of minutes. This is achieved by separating block production from cryptographic sortitions -- a winning miner may produce many blocks between two subsequent sortitions.
* **Bitcoin finality:** Once a transaction is confirmed, reversing it is at least as hard as reversing a Bitcoin transaction. The Stacks blockchain no longer forks on its own.
* **Bitcoin Miner MEV Resistance:** This proposal alters the sortition algorithm to ensure that Bitcoin miners do not have an advantage as Stacks miners. They must spend competitive amounts of Bitcoin currency to have a chance of earning STX.

Here is a video that covers exactly what happens to a Stacks transaction under Nakamoto rules. In it we cover exactly how Nakamoto achieves Bitcoin finality.

{% embed url="https://www.youtube.com/watch?v=DFBZTSsZUOs" %}

In the rest of this doc, we'll cover some of the key components of Nakamoto in a bit more detail.

### Fast Blocks

One of the most significant changes coming in Nakamoto is how new blocks are produced. Historically, because Stacks blocks have been anchored 1:1 to Bitcoin blocks, slow block times and transaction times have been one of the biggest pain points for Stacks users and developers.

Nakamoto brings significantly faster block times by decoupling Stacks block production from Bitcoin block production. In Nakamoto, new Stacks blocks are produced roughly every 5 seconds.

#### Tenure-Based Block Production

This is achieved via the use of tenure-based block production. Each Bitcoin block introduces a new tenure, in which a single miner cryptographically selected for that tenure is responsible for producing all Stacks blocks.

Rather than single Stacks blocks being tied to a single Bitcoin block, Bitcoin blocks are now tied to a miner tenure, during which they mine several Stacks blocks which settle in around 5 seconds.

But if a single miner is only cryptographically selected for their tenure, and not their produced blocks, what mechanisms exist to ensure the validity of their block production?

#### Stackers

This is where Stackers come in. In pre-Nakamoto Stacks, Stackers were responsible only for locking their STX tokens to contribute to the economic security of the network.

In Nakamoto, Stackers are responsible for validating and approving each block produced during a miner's tenure.

To ensure network consistency, the Stacks protocol commits to the state of the Stacks blockchain with each new Bitcoin block by referencing the first Stacks block produced in the previous tenure. Such a design reinforces the fidelity of transaction data and the synchronization between the two chains. It also links the Stacker’s actions with the actions of miners producing a partnership between the two to create both fast and secure blocks.

As part of this tenure change, Stackers also agree on a last signed block and require the next miner to build off of this, which prevents new Stacks forks. Stacks does not fork on its own and automatically forks with Bitcoin.

This symbiotic relationship between Stackers and miners is what creates the capability for both fast blocks and 100% Bitcoin finality.

This elegant design creates a cooperative relationship between miners and stackers while achieving the best of both worlds with block production and transaction speed and security.

Here is a diagram outlining miner and signer behavior.

<figure><img src="../../.gitbook/assets/image (1) (1) (1) (1) (1).png" alt=""><figcaption></figcaption></figure>

### Bitcoin Finality

Speaking of security, the concept of 100% Bitcoin finality is crucial to the design of Stacks. This is what turns Stacks into a true Bitcoin L2 and allows it to leverage all of the security inherent in Bitcoin.

Let's first define what we mean by 100% Bitcoin finality, then we'll dig into how Nakamoto accomplishes this.

Finality refers to the point at which transactions are irreversible. Once a blockchain reaches finality, it is nearly impossible to change the ledger's history without undertaking extraordinary measures that are often computationally and economically prohibitive.

When we talk about Stacks blocks having 100% Bitcoin finality, we mean that they are as hard to reverse as Bitcoin transactions themselves.

That's a bold claim, so how does Stacks accomplish that?

As discussed above, miners are responsible for producing Stacks blocks in their tenure, which corresponds to a single Bitcoin block. As part of their block commit transaction, which is the transaction that previously committed the hash of the next Stacks block to the Bitcoin chain, miners will instead be required to add an indexed block hash.

The indexed block hash is the hash of the first block produced by the last Stacks miner in their tenure. This is the SHA512/256 hash of both the consensus hash of all previously-accepted Bitcoin transactions that Stacks recognizes, as well as the hash of the block itself.

This will anchor the Stacks chain history to Bitcoin up to the start of the previous miner's tenure, as well as all causally-dependent Bitcoin state that Stacks has processed. This ensures Bitcoin finality, resolves miner connectivity issues by putting fork prevention on stackers, and allows nodes with up-to-date copies of the Stacks chain state to identify which Stacks blocks are affected by a Bitcoin reorg and recover the affected Stacks transactions.

This relationship between Stackers, miners, Bitcoin blocks, and Stacks blocks is what maintains Bitcoin finality while allowing miners to rapidly produce Stacks blocks. Bitcoin finality is achieved because at every Bitcoin block N + 1, the state of the Stacks chain as of the start of tenure N is written to Bitcoin. Even if at a future date all of the former Stackers’ signing keys were compromised, they would be unable to rewrite Stacks history for tenure N without rewriting Bitcoin history back to tenure N + 1.

Because of this, Stacks transactions can be considered to have Bitcoin finality after the tenure they are a part of concludes, or Bitcoin block N + 1. As an example, if I initiate a Stacks transaction that gets confirmed by a Stacks miner, at the conclusion of that miner's tenure (the end of the current Bitcoin block) that transaction will be written to Bitcoin as part of the Stacks chain state and all future miners are required to build off of that chain tip, making reversing the transaction as difficult as reversing the corresponding Bitcoin transaction.

#### Nakamoto Transactions and Bitcoin Reorgs

If Nakamoto transactions follow Bitcoin finality, what happens if Bicoin forks?

In order to answer this question, we need to distinguish between two types of Stacks transactions: Bitcoin-reliant and internal.

**Bitcoin-reliant** transactions are transactions that read Bitcoin state. If Bitcoin forks, then these transactions will change. For these, you cannot do better than following Bitcoin finality. Let's say you moved BTC from L1 to L2, you have to wait for Bitcoin finality before your L2 BTC can be used (you don’t have any L2 BTC if Bitcoin forks and your L1 transaction becomes unconfirmed).

**Internal** transactions don't rely on Bitcoin state, and thus won't change if Bitcoin forks. We can have faster confirmations with these because even if Bitcoin forks, signers can ensure that these are re-processed in the same order.

The key takeaway is this:

Under Nakamoto Stacks transactions won’t impactfully reorganize due to a Bitcoin fork. Not only is reorging relatively infrequent, but transactions on Stacks that got reorganized due to a Bitcoin fork behave just as reorganized Bitcoin transactions do. With some future analysis, transactions purely on the L2 chain may one day be entirely unaffected.

This is a nuanced and complicated concept, so if you are interested in learning more about how this works, you can take a look at the [Bitcoin Reorgs](nakamoto-in-depth/bitcoin-reorgs.md) page of the docs.

### Bitcoin MEV Mitigation

Miner Extractable Value (MEV) has been a longstanding issue across many blockchains, including Stacks pre-Nakamoto.

MEV refers to the potential profit miners can extract from the manipulation of transaction inclusion and ordering within the blocks they produce, which can lead to unfair practices and diminished trust in the network.

Specifically in pre-Nakamoto releases of Stacks, Bitcoin miners with a significant percentage of Bitcoin’s hashrate had the ability to censor commitment transactions of other Stacks miners ensuring they were able to win the block rewards and fees of Stacks blocks where they were also the winner of the Bitcoin block as a Bitcoin miner.

This allowed them to sometimes win these rewards for minimal bitcoin cost in PoX. This has led to reduction in Stacker BTC rewards and other bad incentives for Stacks mining. As such Nakamoto has changed the approach to sortitions to promote better fairness in the mining process.

#### Sortition Probability Factors

With the Nakamoto release, Stacks introduces a series of countermeasures to mitigate the influence of MEV and promote a fairer mining landscape.

* Miner Participation in Recent Blocks: The update emphasizes a miner's consistent participation within the network, requiring a history of attempts in recent blocks (the last 10) to qualify for sortition. This persistent involvement in at least the last 10 blocks aims to foster a dedicated and stable miner community.
* Median of Past Bids Method: By calculating the winning probability based on the median total BTC bids of the last ten blocks, the system discourages aberrant bidding behavior. This reduces the likelihood of a miner skewing sortition chances through atypical or extreme bids.
* Absolute Bid Total: Inclusion of an absolute measure of bids further strengthens the system's robustness. Rather than having a variable determined by just the immediate mining environment, the absolute bid total keeps the process anchored to a broader and more stable economic baseline.

These changes ensure that miners are rewarded for their genuine contributions to the network's security and continuity, safeguarding the blockchain from manipulation and encouraging a more equitable distribution of rewards.

#### MEV Mitigation Details

The Nakamoto system uses a variation of the Assumed Total Commitment with Carryforward (ATC-C) MEV mitigation strategy described in [this document](https://forum.stacks.org/uploads/short-url/bqIX4EQ5Wgf2PH4UtiZHZBqJvYE.pdf) to allocate block rewards to miners. Unlike pre-Nakamoto Stacks, there is no 40/60 fee split between two consecutive miners.

Each miner nominally receives the entire coinbase and transaction fees before the MEV mitigation is applied.

In the ATC-C algorithm, Nakamoto uses the document's recommended assumed total commitment function: the median total PoX spend across all miners for the past ten Bitcoin blocks.

It also uses the document's recommended carryforward function for missed sortitions' coinbases: the coinbase for a Bitcoin block without a sortition would be available to winning miners across the next ten tenures. That is, if a miner whose tenure begins during the next ten tenure-changes manages to produce a Stacks block with a Coinbase, then they receive a 10% of the coinbase that was lost.

The reason ATC (and ATC-C) were not considered as viable anti-MEV strategies before is because a decrease in the PoX total spend can lead to a Bitcoin block with no sortition. This is a deliberate design choice in ATC-C, because it has the effect of lowering the expected return of MEV mining.

In ATC-C, the probability of a miner winning a sortition is equal to (i.e. no longer proportional to) the miner's BTC spend, divided by the maximum of either the assumed total commit (median total BTC spend in the last 10 blocks) or the total BTC spend in this Bitcoin block. This means that the sum of each miners' winning probabilities is not guaranteed to be 1. The system deals with this by creating a virtual "null" miner that participates in each sortition, such that its probability of the null miner winning is 1 - sum(probabilities-of-all-other-miners). If the null miner wins, then the sortition is treated as empty.

While the existence of a null miner was a liveness concern in pre-Nakamoto Stacks, it is not a concern in Nakamoto. If the null miner wins tenure N, then the last non-null miner continues to produce blocks in tenure N. They receive transaction fees, but no coinbase for tenure N.

Nakamoto includes one additional change to ATC-C as described in the above report: if a miner does not mine in at least five of the ten prior Bitcoin blocks, it has zero chance of winning. This requires a Bitcoin MEV miner to participate as an honest miner for the majority of blocks it produces, such that even if they pay the bare minimum PoX payout each time, they are still paying Bitcoin transaction fees to other miners.

#### Example

The need for this additional tweak becomes apparent when considering the consequences for a real Bitcoin MEV miner who was active in pre-Nakamoto Stacks: F2Pool.

Consider what happens to F2Pool, who spends 200 sats on PoX and zero sats on transaction fees for their block-commit. Suppose the median total BTC spend over the last ten Bitcoin blocks was 500,000 sats (about what it is at the time of this writing).

With ATC-C alone, their probability of winning the sortition would be 200 / max(500,000, 200), or about 0.04% chance. The miner would need to send 2,500 such block-commits before winning a Stacks coinbase (worth about 500 USD).

F2Pool had 13.89% of Bitcoin's mining power over the past three months, so it would take them about 4 months to win a single STX coinbase (which is a very long time horizon). Right now, it costs 22 sats/vbyte to get a Bitcoin transaction mined in the next Bitcoin block; this is what Stacks miners pay.

A block-commit tx is about 250 vbytes, so that's 5500 sats, or about 1.41 USD with today's BTC price. So, F2Pool would lose money by MEV mining at their current rate if prices stay the same over those 4 months -- they'd forfeit about 3,525 USD in Bitcoin transaction fees (lost by excluding other Bitcoin transactions in order to include their block-commit) for a Stacks coinbase worth 500 USD. They'd have to pay about 1410 sats per block-commit just to break even, and they'd only recoup their investment on average once every 4 months.

This by itself is not a significant improvement -- F2Pool would be required to go from paying 200 sats to 1410 sats. However, with this proposal's tweek, F2Pool would be required to additionally win five Bitcoin blocks in a row in order to mine this cheaply.

Given that they have 13.89% of the mining power today, the odds of this happening by chance are only 0.005%. Since this is unlikely -- about once every 20,000 Bitcoin blocks (once every 138.9 days) -- F2Pool would instead be required to send legitimate block-commit transactions in at least 50% of the Bitcoin blocks.

In 87.11% of those, they would be paying the same transaction fees as every other Stacks miner. This alone would cost them $106.13 USD/day. With the additional de minimis PoX payout, this rises to $212.25 USD/day. In other words, they would expect to pay $29,481.51 USD just to be able to mine one Stacks block for a de minimis PoX payout. This is more expensive than mining honestly!

If the largest Bitcoin mining pool -- Foundry USA, at 30% of the Bitcoin mining power -- wanted to become a Bitcoin MEV miner on Stacks, then the given parameter choice still renders this unprofitable. There is a 0.243% chance that they win five blocks in a row, and can thus mine a de-minimis block-commit and be guaranteed to win. This happens about once every 2.85 days (every 411.5 Bitcoin blocks), so they'd be spending about $604.91 USD just to mine one Stacks block for free (which is not profitable either).
