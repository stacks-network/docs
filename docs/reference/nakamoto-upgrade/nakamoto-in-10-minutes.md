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

<div data-with-frame="true"><figure><img src="../.gitbook/assets/image (1).png" alt=""><figcaption></figcaption></figure></div>

### Bitcoin MEV Mitigation

Miner Extractable Value (MEV) has been a longstanding issue across many blockchains, including Stacks pre-Nakamoto.

MEV refers to the potential profit miners can extract from the manipulation of transaction inclusion and ordering within the blocks they produce, which can lead to unfair practices and diminished trust in the network.

Specifically in pre-Nakamoto releases of Stacks, Bitcoin miners with a significant percentage of Bitcoin’s hashrate had the ability to censor commitment transactions of other Stacks miners ensuring they were able to win the block rewards and fees of Stacks blocks where they were also the winner of the Bitcoin block as a Bitcoin miner.

The Nakamoto system uses a variation of the Assumed Total Commitment with Carryforward (ATC-C) MEV mitigation strategy described in [this document](https://github.com/stacksgov/sips/blob/main/sips/sip-021/MEV-Report.pdf) to allocate block rewards to miners. The probability a miner will win the block and be granted the current tenure will be based on a function that accounts for the total block commit spend on the blocks leading up to the current block.

The ATC solution leaves the option for a block to have no valid winner. The TenureChange-Extend transaction mitigates the majority of adverse effects caused by a missed block.
