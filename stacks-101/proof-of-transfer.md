# Proof of Transfer

In the previous section, we took a look at the vision and ethos of Stacks. We talked a lot about it being connected to Bitcoin and how it enables expanding functionality without modifying Bitcoin itself.

In this section, we'll run through the consensus mechanism that makes that happen, Proof of Transfer.

Consensus algorithms for blockchains require compute or financial resources to secure the blockchain. The general practice of decentralized consensus is to make it practically infeasible for any single malicious actor to have enough computing power or ownership stake to attack the network.

Popular consensus mechanisms in modern blockchains include proof of work, in which nodes dedicate computing resources, and proof of stake, in which nodes dedicate financial resources to secure the network.

Proof of burn is another, less-frequently used consensus mechanism where miners compete by ‘burning’ (destroying) a proof of work cryptocurrency as a proxy for computing resources.

Proof of transfer (PoX) is an extension of the proof of burn mechanism. PoX uses the proof of work cryptocurrency of an established blockchain to secure a new blockchain. However, unlike proof of burn, rather than burning the cryptocurrency, miners transfer the committed cryptocurrency to some other participants in the network.

<figure><img src="../.gitbook/assets/image (11).png" alt=""><figcaption></figcaption></figure>

This allows network participants to secure the PoX cryptocurrency network and earn a reward in the base cryptocurrency. Thus, PoX blockchains are anchored on their chosen PoW chain. Stacks uses Bitcoin as its anchor chain.

<figure><img src="../.gitbook/assets/image (12).png" alt=""><figcaption></figcaption></figure>

### Why Bitcoin?

There are a number of reasons that Stacks chose Bitcoin as the blockchain to power consensus. It's the oldest blockchain protocol, having launched in 2009, and has become a recognized asset outside of the cryptocurrency community. BTC has held the highest market capitalization of any cryptocurrency for the past decade.

Bitcoin champions simplicity and stability, and has stood the test of time. Influencing or attacking the network is infeasible or impractical for any potential hackers. It's one of the only cryptocurrencies to capture public attention. Bitcoin is a household name, and is recognized as an asset by governments, large corporations, and legacy banking institutions. Lastly, Bitcoin is largely considered a reliable store of value, and provides extensive infrastructure to support the PoX consensus mechanism.

SIP-001 provides a full [list of reasons why Bitcoin was chosen to secure Stacks](https://github.com/stacksgov/sips/blob/main/sips/sip-001/sip-001-burn-election.md).

{% hint style="info" %}
By the way, SIP stands for Stacks Improvement Proposal, and it's the process by which community members agree on making changes to the network, we'll look at these in a future lesson.
{% endhint %}

### Unlocking Bitcoin capital

In the previous section we talked about Stacks being able to allow us to build a decentralized economy on top of Bitcoin and that PoX was a key piece of being able to do that.

The reason is two-fold. First, as a part of this PoX mining process we have covered here, a hash of each Stacks block is recorded to the OP\_RETURN opcode of a Bitcoin transaction. If you aren't familiar, the OP\_RETURN opcode allows us to store up to 40 bytes of arbitrary data in a Bitcoin transaction.

{% hint style="info" %}
This [Stack Exchange answer](https://bitcoin.stackexchange.com/questions/29554/explanation-of-what-an-op-return-transaction-looks-like) gives a good overview of the reasoning and history of this opcode.
{% endhint %}

This is how Stacks records its history to the Bitcoin chain and why it inherits some security as a result of this process. If you wanted to try and create a false Stacks fork, you would have to broadcast the entire process to the Bitcoin chain.

Similarly, if you wanted to try and change the history of the Stacks chain, you would have to somehow modify these OP\_RETURN values in each corresponding Bitcoin block, meaning you would have to compromise Bitcoin in order to compromise the history of Stacks.

{% hint style="warning" %}
Note that this is not the same thing as saying that you need to compromise Bitcoin in order compromise Stacks at all, but simply that in order to falsify the history of the Stacks chain you would have to also falsify the history of the Bitcoin chain.
{% endhint %}

Additionally, part of this PoX process involves each Stacks block also knowing which Bitcoin block it is anchored to. Clarity, Stacks' smart contract language, has built-in functions for reading this data, such as [`get-block-info`](https://docs.stacks.co/docs/write-smart-contracts/clarity-language/language-functions#get-block-info), which returns, among other things, a field called `burnchain-header-hash`, which gives us the hash of the Bitcoin header corresponding to this Stacks block.

This allows us to do really interesting things like trigger certain things to happen in a Clarity contract by watching the chain and verifying whether or not certain transactions occurred. You can see this in action in [Catamaran Swaps](https://docs.catamaranswaps.org/en/latest/catamaran.html), with other interesting projects like [Zest](https://www.zestprotocol.com/) seeking to expand on this functionality.

The ultimate goal of all this is to enable the vision of web3, building a decentralized economy and enabling true user ownership of assets and data, on top of Bitcoin as a settlement layer, and using Bitcoin as a base decentralized money.

<figure><img src="../.gitbook/assets/image (16).png" alt=""><figcaption></figcaption></figure>

We also recommend [reading the full PoX whitepaper](https://community.stacks.org/pox), as it breaks down the reasoning behind creating a PoX chain and the unique benefits we get from doing so.

### Proof of Transfer Contracts and Technical Details

The Proof of Transfer functionality is implemented on the Stacks chain via a [Clarity smart contract](https://explorer.stacks.co/txid/0xfc878ab9c29f3d822a96ee73898000579bdf69619a174e748672eabfc7cfc589). An overview of this contract is available in the docs.

You can see the original design for stacking and proof of transfer by reading the relevant SIP, [SIP-007](https://github.com/stacksgov/sips/blob/main/sips/sip-007/sip-007-stacking-consensus.md). You can also utilize [Hiro's API](https://docs.hiro.so/api#tag/Info/operation/get\_pox\_info) to get proof of transfer details including the relevant contract address.

However, since Stacks mainnet launched in January 2021, several shortcomings have been recognized in the stacking process, which are being corrected in the next major network epoch, Stacks 2.1 You can read more about these changes in [SIP-015](https://github.com/stacksgov/sips/blob/feat/sip-015/sips/sip-015/sip-015-network-upgrade.md), the SIP responsible for managing the upgrade to 2.1.

#### Got another question

Have another question not answered here? Post in on Stack Overflow under the appropriate tag(s) and post the link to the Stack Overflow question in the Stacks Discord in the appropriate channel.
