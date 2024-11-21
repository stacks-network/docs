# What is the Nakamoto Upgrade?

The Nakamoto Release is a recent hard fork on the Stacks network designed to bring several benefits, chief among them are increased transaction throughput and 100% Bitcoin finality.&#x20;

With Nakamoto, Stacks block production would no longer be tied to miner elections. Instead, miners produce blocks at a fixed cadence, and the set of PoX Stackers rely on the miner elections to determine when the current miner should stop producing blocks and a new miner should start. This blockchain will only fork if 70% of Stackers approve the fork, and chain reorganization will be as difficult as reorganizing Bitcoin.

The Nakamoto release brings many new capabilities and improvements to the Stacks blockchain by focusing on a set of core advancements: improving transaction speed, enhancing finality guarantees for transactions, mitigating Bitcoin miner MEV (miner extractable value) opportunities that affect PoX, and boosting robustness against chain reorganizations.

### Previous Stacks Block Production Design

The Stacks blockchain today produces blocks in accordance with the algorithms described in [SIP-001](https://github.com/stacksgov/sips/blob/main/sips/sip-001/sip-001-burn-election.md) and [SIP-007](https://github.com/stacksgov/sips/blob/main/sips/sip-007/sip-007-stacking-consensus.md), and [SIP-015](https://github.com/stacksgov/sips/blob/main/sips/sip-015/sip-015-network-upgrade.md). Miners compete to append a block to the blockchain through the miner selection process facilitated by a VRF backed sortition process. Miners submit a block-commit transaction to Bitcoin, which commits to the hash of the block the miner intends to append. The sortition process selects at most one block-commit in the subsequent Bitcoin block, which entitles the submitter to propagate their block and earn a block reward.

{% hint style="info" %}
Throughout this documentation and the SIPs, you'll frequently see the term "cryptographic sortition" or some variation thereof (miner sortition, the sortition, etc.). A Cryptographic sortition is a process of randomly selecting one or more entities from a set using cryptography. This is a decentralized and verifiable way to select participants for a variety of tasks, such as consensus protocols, lotteries, and auctions.

More specifically, miner sortition in the context of Stacks is the weighted cryptographic sortition process by which a miner candidate is selected as the next miner (leader). Details of this process are in [SIP-001](https://github.com/stacksgov/sips/blob/main/sips/sip-001/sip-001-burn-election.md) with mechanism alterations in [SIP-007](https://github.com/stacksgov/sips/blob/main/sips/sip-007/sip-007-stacking-consensus.md).

Nakamoto will introduce further mechanism alterations to this process.
{% endhint %}

### The Problems

Over the last three years the Stacks community has identified several issues with the current system design:

1. **Slow Bitcoin blocks, Stacks forks, and missed sortitions are disruptive to on-chain applications.** The act of waiting to produce a new block until after a sortition elects a valid miner ties best-case Stacks block production rate to the block production rate of Bitcoin, leading to very high transaction confirmation latency.
2. **Microblocks are not effective in speeding up transaction confirmation time.** While microblocks have the potential to mitigate missed sortitions and improve transaction inclusion time, they do not work in practice because the protocol cannot ensure that microblocks will be confirmed until the next sortition happens. Additionally, new miners will often orphan recently-confirmed transactions from the old miner that were included in microblocks because there is no consensus-critical procedure that forces the next miner to build upon the latest microblock.
3. **Stacks forks are not tied to Bitcoin forks, allowing cheap reorgs** The cost to reorg the last N blocks in the Stacks blockchain is the cost to produce the next N + 1 Stacks blocks (i.e. by spending BTC), which is cheap compared to the cost of reorging the Bitcoin. This SIP describes an opportunity to tie the canonical Stacks fork to the Bitcoin blockchain such that the act of reorging Stacks chain history requires the Stacks miner to produce the fork with 70% of stacker sign-off.
4. **Stacks forks arise due to poorly-connected miners.** If a set of miners has a hard time learning the canonical Stacks chain tip when they submit block-commits, then they will collectively orphan other miners who are better-connected. This has happened in practice.
5. **Some Bitcoin miners run their own Stacks miners and deliberately exclude other Stacks miners' `block-commits` from their Bitcoin blocks.** Once the STX block reward became sufficiently large this allowed them to pay a trivial PoX payout while guaranteeing that they would win the cryptographic sortition in their Bitcoin block. This was anticipated in the original design but the regularity with which it happens today is greater than the original protocol accounted for, and thus must be addressed now.

### The Solutions

To address these shortcomings, Nakamoto applies three fundamental changes to the way Stacks works.

* **Fast blocks:** The time taken for a user-submitted transaction to be mined within a block (and thus confirmed) will now take on the order of seconds, instead of tens of minutes. This is achieved by separating block production from cryptographic sortitions -- a winning miner may produce many blocks between two subsequent sortitions.
* **Bitcoin finality:** Once a transaction is confirmed, reversing it is at least as hard as reversing a Bitcoin transaction. The Stacks blockchain no longer forks on its own.
* **Bitcoin Miner MEV Resistance:** This proposal alters the sortition algorithm to ensure that Bitcoin miners do not have an advantage as Stacks miners. They must spend competitive amounts of Bitcoin currency to have a chance of earning STX.

### Nakamoto Design

To achieve these goals Nakamoto introduced the following changes to the Stacks protocol:

1. **Decouple Stacks tenure changes from Bitcoin block arrivals.** In both today's system and Nakamoto, miners take turns appending blocks to the Stacks blockchain -- the next miner is selected by cryptographic sortition, and the miner has the duration of the Bitcoin block (its tenure) to announce a new block state. Nakamoto allows a miner to produce many Stacks blocks per Bitcoin block instead of one, and requiring the next miner to confirm all of them. There are no more microblocks or Bitcoin-anchored blocks; instead, there are only Nakamoto Stacks blocks. This will achieve fast block times.
2. **Require stackers to collaborate before the next block can be produced.** Stackers will need to collectively validate, store, sign, and propagate each Nakamoto Stacks block the miner produces before the next block can be produced. Stackers must do this in order to earn their PoX payouts and unlock their STX (i.e. PoX is now treated as compensation from the miner for playing this essential role). In Nakamoto, a sortition only selects a new miner; it does not give the miner the power to unilaterally orphan confirmed transactions as it does today. This will ensure that miners do not produce forks and are able to confirm all prior Stacks blocks prior to selection.
3. **Use stackers to police miner behavior.** A sortition causes the Stackers to carry out a tenure change by (a) agreeing on a "last-signed" block from the current miner, and (b) agreeing to only sign blocks from the new miner which descend from this last-signed block. Thus, Stackers police miner behavior -- Stackers prevent miners from mining forks during their tenure, and ensure that they begin their tenures by building atop the canonical chain tip. The new miner cannot orphan recently-confirmed transactions from the old miner because the signers who approved the tenure change are necessarily aware of all Stacks blocks that came before it. This **further prevents miners from forking the Stacks blockchain.**
4. **Require Stacks miners to commit the indexed block hash of the first block produced by the last Stacks miner in their block-commit transactions on the Bitcoin blockchain.** This is the SHA512/256 hash of both the consensus hash of all previously-accepted Bitcoin transactions that Stacks recognizes, as well as the hash of the block itself (a block-commit today only contains the hash of the Stacks block). This will anchor the Stacks chain history to the Bitcoin up to the start of the previous miner's tenure, as well as all causally-dependent Bitcoin state that Stacks has processed. This **ensures Bitcoin finality and resolves miner connectivity issues** by putting fork prevention on Stackers.
5. **Adopt a Bitcoin MEV solution which punishes block-commit censorship.** The probability a stacks miner wins a sortition should be altered such that omitting block commits of honest Stacks miners is not profitable to Bitcoin miners. The mechanics of this are outlined below.

Although Nakamoto is a breaking change, all smart contracts published prior to this its activation will be usable after it activates.

Let's dive into how each of these pieces work so we can get an in-depth understanding of exactly how Nakamoto works.
