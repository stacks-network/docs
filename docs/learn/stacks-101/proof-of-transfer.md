# Proof of Transfer (PoX)

<figure><picture><source srcset="../.gitbook/assets/pox-light.png" media="(prefers-color-scheme: dark)"><img src="../.gitbook/assets/pox.png" alt=""></picture><figcaption></figcaption></figure>

In the previous sections, we took a look at the vision and ethos of Stacks and talked a lot about it being connected to Bitcoin and how it enables expanding functionality without modifying Bitcoin itself.

In this section, we'll run through the block production mechanism that makes that happen, Proof of Transfer.

This section will be a conceptual overview of Proof of Transfer. For more details on exactly how block production happens at a technical level, check out the section on [Block Production](../block-production/).

Consensus algorithms require compute or financial resources to secure blockchains. They make it hard for any single malicious actor to attack the network with enough power or stake.

Popular consensus mechanisms in modern blockchains include proof of work, in which nodes dedicate computing resources, and proof of stake, in which nodes dedicate financial resources to secure the network.

Proof of burn is another, less-frequently used consensus mechanism where miners compete by ‘burning’ (destroying) a proof of work cryptocurrency as a proxy for computing resources.

Proof of Transfer (PoX) extends proof of burn. It uses an established PoW cryptocurrency (Bitcoin) to secure a new blockchain. Instead of burning the crypto, miners transfer it to other participants (Stackers).

<div data-with-frame="true"><figure><img src="../.gitbook/assets/Stacks_graphic - 67.png" alt=""><figcaption></figcaption></figure></div>

This lets participants secure the PoX network and earn BTC rewards. PoX blockchains anchor to their chosen PoW chain. Stacks anchors to Bitcoin.

<div data-with-frame="true"><figure><img src="../.gitbook/assets/Stacks_graphic - 80.png" alt=""><figcaption></figcaption></figure></div>

### Why Bitcoin?

Stacks chose Bitcoin for consensus for several reasons. It's the oldest protocol (launched 2009) and recognized beyond crypto. BTC has the highest market cap for a decade.

Bitcoin emphasizes simplicity and stability, proven over time. Attacking it is impractical. It's widely recognized by governments and institutions. It's a reliable store of value with infrastructure for PoX.

SIP-001 provides a full [list of reasons why Bitcoin was chosen to secure Stacks](https://github.com/stacksgov/sips/blob/main/sips/sip-001/sip-001-burn-election.md).

{% hint style="info" %}
By the way, SIP stands for Stacks Improvement Proposal, and it's the process by which community members agree on making changes to the network. Reading the SIPs in detail is an excellent way to familiarize yourself with Stacks at the implementation level. All of the SIPs are available in the [SIPs section](../network-fundamentals/sips.md) of the docs.
{% endhint %}

### Unlocking Bitcoin capital

Previously, we discussed how Stacks enables a decentralized economy on Bitcoin, with PoX as key.

The reason is twofold. First, in PoX mining, each Stacks block's hash is recorded in a Bitcoin transaction's OP_RETURN opcode, storing up to 40 bytes of data.

{% hint style="info" %}
This [Stack Exchange answer](https://bitcoin.stackexchange.com/questions/29554/explanation-of-what-an-op-return-transaction-looks-like) gives a good overview of the reasoning and history of this opcode.
{% endhint %}

This anchors Stacks' history to Bitcoin block-by-block, inheriting its security. Anyone can verify hashes using Merkle roots.

After the Nakamoto Upgrade, Stacks doesn't fork independently. Miners build on the last blocks, securing Stacks with 100% of Bitcoin's hash rate plus its own budget. Details in [Block Production](../block-production/).

Each Stacks block knows its anchored Bitcoin block. Clarity has functions like [`get-block-info`](https://docs.stacks.co/docs/write-smart-contracts/clarity-language/language-functions#get-block-info) to read the `burnchain-header-hash`.

This enables triggering Clarity contracts based on Bitcoin transactions. See [Catamaran Swaps](https://docs.catamaranswaps.org/en/latest/catamaran.html) and [Zest](https://www.zestprotocol.com/).

The goal is web3: a decentralized economy with user-owned assets and data on Bitcoin as settlement layer.

### Proof of Transfer Contracts and Technical Details

The Proof of Transfer functionality is implemented on the Stacks chain via a [Clarity smart contract](https://explorer.hiro.so/txid/0xc6d6e6ec82cabb2d7a9f4b85fcc298778d01186cabaee01685537aca390cdb46?chain=mainnet). An overview of this contract is available in the docs.

See the original design in [SIP-007](https://github.com/stacksgov/sips/blob/main/sips/sip-007/sip-007-stacking-consensus.md). Use [Hiro's API](https://docs.hiro.so/api#tag/Info/operation/get_pox_info) for PoX details.
