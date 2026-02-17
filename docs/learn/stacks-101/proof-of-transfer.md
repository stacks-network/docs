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
are rewarded in BTC, Stacks PoX miners spend (already mined) BTC and are rewarded in STX.\
Like PoW, PoX uses a Nakamoto-style single-leader election: PoX miners bid by simply\
spending BTC, and they have a bid-weighted random probability of becoming a leader. Leader\
election happens on the Bitcoin chain and new blocks are written on the Stacks layer. In this\
way, PoX reuses work already done by Bitcoin miners, and does not consume any significant\
amount of additional electricity: only the cost of running normal laptops/computers for Stacks\
nodes to bid using BTC.

Like PoW, PoX is permissionless: Anyone can be a Stacks miner, as long as they are willing\
to spend BTC. Also, any STX holder can lock their STX (called “stacking”) to participate in\
PoX consensus, and earn Bitcoin rewards for doing useful work for the system, i.e., for being a\
signatory for the decentralized Bitcoin peg. In keeping with Bitcoin ethos, Stackers are\
rewarded for their positive contributions to the system and inhibited by economic disincentives\
from behaving poorly (but unlike in bonded Proof of Stake systems, they are not "slashed").\
Finally, the nature of PoX consensus is such that the price ratio between BTC and STX is\
continually recorded and available on-chain, serving as an on-chain Bitcoin price oracle. This is\
valuable for the decentralized peg, removing the need for an external oracle, as described in the\
companion paper about the peg.

The below diagram flowcharts the PoX consensus amongst its relevant participants.

<div data-with-frame="true"><figure><img src="../.gitbook/assets/Stacks_graphic - 67.png" alt=""><figcaption></figcaption></figure></div>

As depicted in the flowchart, Proof of Transfer provides two critical components that work together to secure and operate the network.

1. **Economic** – BTC is transferred from miners to stackers, creating a bidirectional incentive structure rooted in Bitcoin itself. Miners commit BTC to participate in block production, effectively competing for the right to produce the next Stacks block. In return, successful miners earn newly minted STX and transaction fees. Stackers, on the other hand, lock their STX to support consensus and receive the BTC committed by miners as a reward. This mechanism ties the Stacks economy directly to Bitcoin, aligning incentives across participants and anchoring security in a real, external asset rather than relying solely on inflation or internal token mechanics.
2. **Programmatic** – Beyond economic incentives, PoX provides the technical coordination layer that determines how blocks are produced, validated, and finalized. Miner BTC commitments on Bitcoin serve as inputs into leader selection, which determines who can construct the next Stacks block. Once produced, blocks are cryptographically linked and anchored to Bitcoin, inheriting its settlement assurances. In this way, PoX is not just an economic exchange mechanism — it is the consensus engine that orchestrates block construction, ordering, and finality while maintaining a verifiable connection to Bitcoin L1.

### Who are the participants in Proof of Transfer?

<div data-with-frame="true"><figure><img src="../.gitbook/assets/Stacks_graphic - 80.png" alt=""><figcaption></figcaption></figure></div>

### Proof of Transfer: Implementation Details

The Proof of Transfer functionality is implemented on the Stacks network as a Clarity smart contract.

Proof of Transfer has went through multiple iterations over the years. Below lists the different smart contract implementations of Proof of Transfer.

<table><thead><tr><th width="107.99609375">Version</th><th width="131.1015625">Date</th><th width="228.8671875">Mainnet Contract</th><th data-type="content-ref">SIP</th></tr></thead><tbody><tr><td>PoX 4</td><td>2024-04-22</td><td><a href="https://explorer.hiro.so/txid/SP000000000000000000002Q6VF78.pox-4">SP000000000000000000002Q6VF78.pox-4</a></td><td><a href="https://github.com/stacksgov/sips/blob/main/sips/sip-021/sip-021-nakamoto.md">https://github.com/stacksgov/sips/blob/main/sips/sip-021/sip-021-nakamoto.md</a></td></tr><tr><td>PoX 3</td><td>2023-05-27</td><td><a href="https://explorer.hiro.so/txid/SP000000000000000000002Q6VF78.pox-3">SP000000000000000000002Q6VF78.pox-3</a></td><td><a href="https://github.com/stacksgov/sips/blob/main/sips/sip-022/sip-022-emergency-pox-fix.md">https://github.com/stacksgov/sips/blob/main/sips/sip-022/sip-022-emergency-pox-fix.md</a></td></tr><tr><td>PoX 2</td><td>2023-03-20</td><td><a href="https://explorer.hiro.so/txid/SP000000000000000000002Q6VF78.pox-2">SP000000000000000000002Q6VF78.pox-2</a></td><td><a href="https://github.com/stacksgov/sips/blob/main/sips/sip-015/sip-015-network-upgrade.md">https://github.com/stacksgov/sips/blob/main/sips/sip-015/sip-015-network-upgrade.md</a></td></tr><tr><td>PoX 1</td><td>2021-01-15</td><td><a href="https://explorer.hiro.so/txid/SP000000000000000000002Q6VF78.pox">SP000000000000000000002Q6VF78.pox</a></td><td><a href="https://github.com/stacksgov/sips/blob/main/sips/sip-007/sip-007-stacking-consensus.md">https://github.com/stacksgov/sips/blob/main/sips/sip-007/sip-007-stacking-consensus.md</a></td></tr></tbody></table>

An walkthrough of the current PoX 4 contract is available in the [Example Contracts](https://app.gitbook.com/s/uholC0CdufHxYs050O3V/clarity/example-contracts) section.

***

### Additional Resources

* \[[SIP-001](https://github.com/stacksgov/sips/blob/main/sips/sip-001/sip-001-burn-election.md)] SIP-001 provides a full list of reasons why Bitcoin was chosen to secure Stacks.
* \[[SIP-007](https://github.com/stacksgov/sips/blob/main/sips/sip-007/sip-007-stacking-consensus.md)] Details of the original design for stacking and Proof of Transfer.
* \[[Stacks Developers YT](https://youtu.be/YynwIJIXJWw?si=9DXsd9PzMN14xt-L)] PoX: Under the Hood
* \[[Stacks Developers YT](https://youtu.be/4UJ3ZK8JsrI?si=m8VSVIuCwIyOe3pe)] How Do Developers Test the Stacks Network?
