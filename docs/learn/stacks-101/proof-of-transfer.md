# Proof of Transfer (PoX)

<div data-with-frame="true"><figure><picture><source srcset="../.gitbook/assets/pox-light.png" media="(prefers-color-scheme: dark)"><img src="../.gitbook/assets/pox.png" alt=""></picture><figcaption></figcaption></figure></div>

In the previous sections, we took a look at the vision and ethos of Stacks and talked a lot about it being connected to Bitcoin and how it enables expanding functionality without modifying Bitcoin itself. In this section, we'll run through the block production mechanism that makes that happen, Proof of Transfer.

{% hint style="info" %}
This section will be a conceptual overview of Proof of Transfer. For more details on exactly how block production happens at a technical level, check out the section on [Block Production](../block-production/).
{% endhint %}

### What is Proof of Transfer?

The Stacks layer relies on STX and on BTC for its novel consensus mechanism, called Proof\
of Transfer (PoX), that utilizes both the Stacks and Bitcoin layers. PoX is similar in spirit to\
Bitcoin’s Proof of Work (PoW) consensus: Like how Bitcoin PoW miners spend electricity and\
are rewarded in BTC, Stacks PoX miners spend (already mined) BTC and are rewarded in STX.

Like PoW, PoX uses a single-leader election: PoX miners bid by simply spending BTC, and they have a bid-weighted random probability of becoming a leader. Leader election happens on the Bitcoin chain and new blocks are written on the Stacks layer. In this way, PoX reuses work already done by Bitcoin miners, and does not consume any significant amount of additional electricity: only the cost of running normal laptops/computers for Stacks nodes to bid using BTC.

Like PoW, PoX is permissionless: Anyone can be a Stacks miner, as long as they are willing\
to spend BTC. Also, any STX holder can lock their STX (called “stacking”) to participate in\
PoX consensus, and earn Bitcoin rewards for doing useful work for the system, i.e., for being a\
signatory for the decentralized Bitcoin peg. In keeping with Bitcoin ethos, Stackers are\
rewarded for their positive contributions to the system and inhibited by economic disincentives\
from behaving poorly (but unlike in bonded Proof of Stake systems, they are not "slashed").

Finally, the nature of PoX consensus is such that the price ratio between BTC and STX is\
continually recorded and available on-chain, serving as an on-chain Bitcoin price oracle. This is\
valuable for the decentralized peg, removing the need for an external oracle, as described in the\
companion paper about the peg.

The below diagram flowcharts the PoX consensus mechanism amongst its relevant participants.

<div data-with-frame="true"><figure><img src="../.gitbook/assets/Stacks_graphic - 67.png" alt=""><figcaption></figcaption></figure></div>

As depicted in the flowchart, Proof of Transfer also provides two critical dynamics that work together to secure and operate the network.

1. **Economic** – BTC is transferred from miners to stackers, creating a bidirectional incentive structure rooted in Bitcoin itself. Miners commit BTC to participate in block production, effectively competing for the right to produce the next Stacks block. In return, successful miners earn newly minted STX and transaction fees. Stackers, on the other hand, lock their STX to support consensus and receive the BTC committed by miners as a reward. This mechanism ties the Stacks economy directly to Bitcoin, aligning incentives across participants and anchoring security in a real, external asset rather than relying solely on inflation or internal token mechanics.
2. **Programmatic** – Beyond economic incentives, PoX provides the technical coordination layer that determines how blocks are produced, validated, and finalized. Miner BTC commitments on Bitcoin serve as inputs into leader selection, which determines who can construct the next Stacks block. Once produced, blocks are cryptographically linked and anchored to Bitcoin, inheriting its settlement assurances. In this way, PoX is not just an economic exchange mechanism — it is the consensus engine that orchestrates block construction, ordering, and finality while maintaining a verifiable connection to Bitcoin L1.

### Who are the participants in Proof of Transfer?

<div data-with-frame="true"><figure><img src="../.gitbook/assets/Stacks_graphic - 80.png" alt=""><figcaption></figcaption></figure></div>

***

### Breakdown of PoX's Core Components

<details>

<summary>Leader Election (Miners)</summary>

**Who gets to mine the next tenure of Stacks blocks?**

**Participants: Miners**

* Idea: Spend BTC to win a chance at producing blocks
* Single-leader election through _cryptographic sortition_
* Embed _verifiable random function_ (VRF) state in Bitcoin transactions
* Deterministic but unpredictable winner at each Bitcoin block
* Mining through block commits: (block hash, VRF seed) pair
* VRF seed = hash(VRF proof)

</details>

<details>

<summary>Reward Set (Stackers)</summary>

**But where does the BTC spent by miners go?**

**Participants: Stackers that are either solo stacking or pool stacking**

* Idea: Spent BTC (from miners) are sent to STX holders
* Expected BTC payout is a function of your-lockup over total-lockup
* Locked STX never leave your account, and will unlock automatically
* Takes unproductive STX our of circulation
* Reward Cycle: 2100 Bitcoin blocks
* Reward Phase: first 2000 Bitcoin blocks
* Prepare Phase: last 100 Bitcoin blocks
* Anchor block: first Stacks block confirmed in prepare phase
* Reward Set: snapshot of locked STX in anchor block

<div data-with-frame="true"><figure><img src="../.gitbook/assets/image (3).png" alt=""><figcaption></figcaption></figure></div>

<div data-with-frame="true"><figure><img src="../.gitbook/assets/image (1).png" alt=""><figcaption></figcaption></figure></div>

</details>

<details>

<summary>Block Signers (Signers)</summary>

**Can locked STX secure the network as well?**

**Participants: Stackers that are taking on the role of a Signer**

* Idea: Use PoX yield to incentivize good chain QoS
* PoX yield as a salary to replicate and sequence blocks
* Stacks select Signer public key when they stack
* Signers sign blocks from miner with weighted signature (by # reward slots)
* Once 70%+ of reward slots sign off, block is appended
* Block signer set changes once per reward cycle
* 70%+ or more signers assumed to be online and honest
* Honest Signers vote to withhold (burn) faulty Stackers' subsequent BTC

<div data-with-frame="true"><figure><img src="../.gitbook/assets/image (2).png" alt=""><figcaption></figcaption></figure></div>

</details>

***

### Technical Implementation Details

The Proof of Transfer functionality is implemented on the Stacks network as a Clarity smart contract.

Proof of Transfer has went through multiple iterations over the years. Below lists the different smart contract implementations of Proof of Transfer.

<table><thead><tr><th width="107.99609375">Version</th><th width="131.1015625">Date</th><th width="228.8671875">Mainnet Contract</th><th data-type="content-ref">SIP</th></tr></thead><tbody><tr><td>PoX 4</td><td>2024-04-22</td><td><a href="https://explorer.hiro.so/txid/SP000000000000000000002Q6VF78.pox-4">SP000000000000000000002Q6VF78.pox-4</a></td><td><a href="https://github.com/stacksgov/sips/blob/main/sips/sip-021/sip-021-nakamoto.md">https://github.com/stacksgov/sips/blob/main/sips/sip-021/sip-021-nakamoto.md</a></td></tr><tr><td>PoX 3</td><td>2023-05-27</td><td><a href="https://explorer.hiro.so/txid/SP000000000000000000002Q6VF78.pox-3">SP000000000000000000002Q6VF78.pox-3</a></td><td><a href="https://github.com/stacksgov/sips/blob/main/sips/sip-022/sip-022-emergency-pox-fix.md">https://github.com/stacksgov/sips/blob/main/sips/sip-022/sip-022-emergency-pox-fix.md</a></td></tr><tr><td>PoX 2</td><td>2023-03-20</td><td><a href="https://explorer.hiro.so/txid/SP000000000000000000002Q6VF78.pox-2">SP000000000000000000002Q6VF78.pox-2</a></td><td><a href="https://github.com/stacksgov/sips/blob/main/sips/sip-015/sip-015-network-upgrade.md">https://github.com/stacksgov/sips/blob/main/sips/sip-015/sip-015-network-upgrade.md</a></td></tr><tr><td>PoX 1</td><td>2021-01-15</td><td><a href="https://explorer.hiro.so/txid/SP000000000000000000002Q6VF78.pox">SP000000000000000000002Q6VF78.pox</a></td><td><a href="https://github.com/stacksgov/sips/blob/main/sips/sip-007/sip-007-stacking-consensus.md">https://github.com/stacksgov/sips/blob/main/sips/sip-007/sip-007-stacking-consensus.md</a></td></tr></tbody></table>

A walkthrough of the current PoX 4 contract is available in the [Example Contracts](https://app.gitbook.com/s/uholC0CdufHxYs050O3V/clarity/example-contracts) section.

***

### Wrapping it up: PoX in a nutshell

• PoX selects a randomized single-leader block miner once per BTC block\
• PoX incentivizes miners to make STX blocks and earn STX coinbase + tx fees\
• PoX incentivizes STX holders to lock up STX to get BTC yield from miners\
• PoX disincentivizes BTC L1 miners from interfering\
• PoX incentivizes Stackers, as a Signer, to keep the network healthy

***

### Additional Resources

* \[[SIP-001](https://github.com/stacksgov/sips/blob/main/sips/sip-001/sip-001-burn-election.md)] SIP-001 provides a full list of reasons why Bitcoin was chosen to secure Stacks.
* \[[SIP-007](https://github.com/stacksgov/sips/blob/main/sips/sip-007/sip-007-stacking-consensus.md)] Details of the original design for stacking and Proof of Transfer.
* \[[SIP-021](https://github.com/stacksgov/sips/blob/main/sips/sip-021/sip-021-nakamoto.md)] Nakamoto Upgrade: Fast and reliable blocks
* \[[Stacks Developers YT](https://youtu.be/YynwIJIXJWw?si=9DXsd9PzMN14xt-L)] PoX: Under the Hood
* \[[Stacks Developers YT](https://youtu.be/4UJ3ZK8JsrI?si=m8VSVIuCwIyOe3pe)] How Do Developers Test the Stacks Network?
* \[[Hiro YT](https://youtu.be/2Bmo1cK0C8k?si=uiYaXudIhjxkNaS6)] A Breakdown of Stacks' Proof of Transfer Smart Contract
