# Proof of Transfer

In the previous sections, we took a look at the vision and ethos of Stacks and talked a lot about it being connected to Bitcoin and how it enables expanding functionality without modifying Bitcoin itself.

In this section, we'll run through the block production mechanism that makes that happen, Proof of Transfer.

This section will be a conceptual overview of Proof of Transfer. For more details on exactly how block production happens at a technical level, check out the section on [Block Production](../block-production/).

Consensus algorithms for blockchains require compute or financial resources to secure the blockchain. The general practice of decentralized consensus is to make it practically infeasible for any single malicious actor to have enough computing power or ownership stake to attack the network.

Popular consensus mechanisms in modern blockchains include proof of work, in which nodes dedicate computing resources, and proof of stake, in which nodes dedicate financial resources to secure the network.

Proof of burn is another, less-frequently used consensus mechanism where miners compete by ‘burning’ (destroying) a proof of work cryptocurrency as a proxy for computing resources.

Proof of transfer (PoX) is an extension of the proof of burn mechanism. PoX uses the proof of work cryptocurrency of an established blockchain (Bitcoin in this case) to secure a new blockchain. However, unlike proof of burn, rather than burning the cryptocurrency, miners transfer the committed cryptocurrency to some other participants in the network (Stackers in this case).

<figure><img src="../../.gitbook/assets/image (11).png" alt=""><figcaption></figcaption></figure>

This allows network participants to secure the PoX cryptocurrency network and earn a reward in the base cryptocurrency (BTC). Thus, PoX blockchains are anchored on their chosen PoW chain. Stacks uses Bitcoin as its anchor chain.

<figure><img src="../../.gitbook/assets/image (12).png" alt=""><figcaption></figcaption></figure>

### Why Bitcoin?

There are a number of reasons that Stacks chose Bitcoin as the blockchain to power consensus. It's the oldest blockchain protocol, having launched in 2009, and has become a recognized asset outside of the cryptocurrency community. BTC has held the highest market capitalization of any cryptocurrency for the past decade.

Bitcoin champions simplicity and stability, and has stood the test of time. Influencing or attacking the network is infeasible or impractical for any potential hackers. It's one of the only cryptocurrencies to capture public attention. Bitcoin is a household name, and is recognized as an asset by governments, large corporations, and legacy banking institutions. Lastly, Bitcoin is largely considered a reliable store of value, and provides extensive infrastructure to support the PoX consensus mechanism.

SIP-001 provides a full [list of reasons why Bitcoin was chosen to secure Stacks](https://github.com/stacksgov/sips/blob/main/sips/sip-001/sip-001-burn-election.md).

{% hint style="info" %}
By the way, SIP stands for Stacks Improvement Proposal, and it's the process by which community members agree on making changes to the network. Reading the SIPs in detail is an excellent way to familiarize yourself with Stacks at the implementation level. All of the SIPs are available in the [SIPs section](../network-fundamentals/sips.md) of the docs.
{% endhint %}

### Unlocking Bitcoin capital

In the previous section we talked about Stacks being able to allow us to build a decentralized economy on top of Bitcoin and that PoX was a key piece of being able to do that.

The reason is two-fold. First, as a part of this PoX mining process we have covered here, a hash of each Stacks block is recorded to the OP\_RETURN opcode of a Bitcoin transaction. If you aren't familiar, the OP\_RETURN opcode allows us to store up to 40 bytes of arbitrary data in a Bitcoin transaction.

{% hint style="info" %}
This [Stack Exchange answer](https://bitcoin.stackexchange.com/questions/29554/explanation-of-what-an-op-return-transaction-looks-like) gives a good overview of the reasoning and history of this opcode.
{% endhint %}

This is the first part of how Stacks inherits Bitcoin's security: it's history is anchored block-by-block to the Bitcoin chain. Anyone can use merkle roots to verify these hashes to determine if the history is correct.

Additionally, after the Nakamoto Upgrade, Stacks no longer forks on its own. Miners are required at a protocol level to build atop the last mined Stacks blocks, meaning that **Stacks is secured by both 100% of Bitcoin's hashrate in addition to the Stacks security budget from its miners.** We'll get into this process in more detail in the [Block Production](../block-production/) section.

Additionally, part of this PoX process involves each Stacks block also knowing which Bitcoin block it is anchored to. Clarity, Stacks' smart contract language, has built-in functions for reading this data, such as [`get-block-info`](https://docs.stacks.co/docs/write-smart-contracts/clarity-language/language-functions#get-block-info), which returns, among other things, a field called `burnchain-header-hash`, which gives us the hash of the Bitcoin header corresponding to this Stacks block.

This allows us to do really interesting things like trigger certain things to happen in a Clarity contract by watching the chain and verifying whether or not certain transactions occurred. You can see this in action in [Catamaran Swaps](https://docs.catamaranswaps.org/en/latest/catamaran.html), with other interesting projects like [Zest](https://www.zestprotocol.com/) seeking to expand on this functionality.

The ultimate goal of all this is to enable the vision of web3, building a decentralized economy and enabling true user ownership of assets and data, on top of Bitcoin as a settlement layer, and using Bitcoin as a base decentralized money.

<figure><img src="../../.gitbook/assets/image (16).png" alt=""><figcaption></figcaption></figure>

### Proof of Transfer Contracts and Technical Details

The Proof of Transfer functionality is implemented on the Stacks chain via a [Clarity smart contract](https://explorer.hiro.so/txid/0xc6d6e6ec82cabb2d7a9f4b85fcc298778d01186cabaee01685537aca390cdb46?chain=mainnet). An overview of this contract is available in the docs.

You can see the original design for stacking and proof of transfer by reading the relevant SIP, [SIP-007](https://github.com/stacksgov/sips/blob/main/sips/sip-007/sip-007-stacking-consensus.md). You can also utilize [Hiro's API](https://docs.hiro.so/api#tag/Info/operation/get\_pox\_info) to get proof of transfer details including the relevant contract address.
