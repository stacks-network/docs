# Proof of Transfer (PoX)

<div data-with-frame="true"><figure><picture><source srcset="../.gitbook/assets/pox-light.png" media="(prefers-color-scheme: dark)"><img src="../.gitbook/assets/pox.png" alt=""></picture><figcaption></figcaption></figure></div>

In the previous sections, we took a look at the vision and ethos of Stacks and talked a lot about it being connected to Bitcoin and how it enables expanding functionality without modifying Bitcoin itself.

In this section, we'll run through the block production mechanism that makes that happen, Proof of Transfer.

This section will be a conceptual overview of Proof of Transfer. For more details on exactly how block production happens at a technical level, check out the section on [Block Production](../block-production/).

Popular consensus mechanisms in modern blockchains include Proof of Work, in which nodes dedicate computing resources, and Proof of Stake, in which nodes dedicate financial resources to secure the network. Proof of Burn is another, less-frequently used consensus mechanism where miners compete by ‘burning’ (destroying) a Proof of Work cryptocurrency as a proxy for computing resources.

Proof of Transfer (PoX) is an extension of the Proof of Burn mechanism. PoX uses the Proof of Work cryptocurrency of an established blockchain (Bitcoin in this case) to secure a new blockchain. However, unlike proof of burn, rather than burning the cryptocurrency, miners transfer the committed cryptocurrency to some other participants in the network (Stackers in this case).

<div data-with-frame="true"><figure><img src="../.gitbook/assets/Stacks_graphic - 67.png" alt=""><figcaption></figcaption></figure></div>

This allows network participants, known as Stackers, to secure the PoX network and earn a reward in the base cryptocurrency (BTC). Thus, PoX anchors on its chosen PoW chain. Stacks uses Bitcoin as its anchor chain.

<div data-with-frame="true"><figure><img src="../.gitbook/assets/Stacks_graphic - 80.png" alt=""><figcaption></figcaption></figure></div>

### Why Bitcoin?

There are a number of reasons that Stacks chose Bitcoin as the blockchain to power consensus. It's the oldest blockchain protocol, having launched in 2009, and has become a recognized asset outside of the cryptocurrency community. BTC has held the highest market capitalization of any cryptocurrency for the past decade.

Bitcoin champions simplicity and stability, and has stood the test of time. Influencing or attacking the network is infeasible or impractical for any potential hackers. It's one of the only cryptocurrencies to capture public attention. Bitcoin is a household name, and is recognized as an asset by governments, large corporations, and legacy banking institutions. Lastly, Bitcoin is largely considered a reliable store of value, and provides extensive infrastructure to support the PoX consensus mechanism.

[SIP-001](https://github.com/stacksgov/sips/blob/main/sips/sip-001/sip-001-burn-election.md) provides a full list of reasons why Bitcoin was chosen to secure Stacks.

{% hint style="info" %}
By the way, SIP stands for Stacks Improvement Proposal, and it's the process by which community members agree on making changes to the network. Reading the SIPs in detail is an excellent way to familiarize yourself with Stacks at the implementation level.
{% endhint %}

### Unlocking Bitcoin capital

In the previous section we talked about Stacks being able to allow us to build a decentralized economy on top of Bitcoin and that PoX was a key piece of being able to do that.

The reason is two-fold. First, as a part of this PoX mining process we have covered here, a hash of each Stacks tenure is recorded to the [OP\_RETURN](https://bitcoin.stackexchange.com/questions/29554/explanation-of-what-an-op-return-transaction-looks-like) opcode of a Bitcoin transaction. If you aren't familiar, the OP\_RETURN opcode allows us to store arbitrary data in a Bitcoin transaction.

This is the first part of how Stacks inherits Bitcoin's security: its history is anchored block-by-block to the Bitcoin chain. Anyone can use merkle roots to verify these hashes to determine if the history is correct.

Additionally, miners are required at a protocol level to build atop the last mined Stacks blocks, meaning that **Stacks is secured by both 100% of Bitcoin's hashrate in addition to the Stacks security budget from its miners.** We'll get into this process in more detail in the [Block Production](../block-production/) section.

Additionally, part of this PoX process involves each Stacks block also knowing which Bitcoin block it is anchored to. Clarity, Stacks' smart contract language, has built-in functions for reading this data, such as `get-block-info`, which returns, among other things, a field called `burnchain-header-hash`, which gives us the hash of the Bitcoin header corresponding to this Stacks block.

This allows us to do really interesting things like trigger certain things to happen in a Clarity contract by watching the chain and verifying whether or not certain transactions occurred.

The ultimate goal of all this is to enable the vision of web3, building a decentralized economy and enabling true user ownership of assets and data, on top of Bitcoin as a settlement layer, and using Bitcoin as a base decentralized money.

### Proof of Transfer Contracts and Technical Details

The Proof of Transfer functionality is implemented on the Stacks chain via a Clarity smart contract. An overview of this contract is available in the [Example Contracts](https://app.gitbook.com/s/uholC0CdufHxYs050O3V/clarity/example-contracts) section.

You can see the original design for stacking and proof of transfer by reading the relevant SIP, [SIP-007](https://github.com/stacksgov/sips/blob/main/sips/sip-007/sip-007-stacking-consensus.md).
