# Stackers and Signing

Stackers play an essential role in the Nakamoto system that had previously been the responsibility of miners. Before, miners both decided the contents of blocks, and decided whether or not to include them in the chain (i.e. by deciding whether or not to confirm them). In this system each actor has the following responsibilities necessary to make the system function reliably without forks:

* **Miners** decide the contents of blocks.
* **Stackers** decide whether or not the block is included in the chain.

The bulk of the complexity of the Nakamoto changes is in separating these two concerns while ensuring that both mining and Stacking remain open-membership processes. **Crucially, anyone can become a miner and anyone can become a Stacker, just as before.** The most substantial changes are in getting miners and Stackers to work together in their new roles to achieve this proposal's goals.

The key idea is that Stackers are required to acknowledge and validate a miner's block before it can be appended to the chain. To do so, Stackers must first agree on the canonical chain tip, and then apply (and roll back) the block on this chain tip to determine its validity. Once Stackers agree that the block is both canonical and valid, they collectively sign it and replicate it to the rest of the Stacks peer network. Only at this point do nodes append the block to their chain histories.

This new behavior prevents forks from arising. If a miner builds a block atop a stale tip, Stackers will refuse to sign the block. If Stackers cannot agree on the canonical Stacks tip, then no block will be appended in the first place. While this behavior creates a new failure mode for Stacks -- namely, the chain can halt indefinitely if Stackers cannot agree on the chain tip -- this is mitigated by having a large and diverse body of Stackers such that enough of them are online at all times to meet quorum and incentivizing them via PoX rewards to act as such.

### Stacker Signing

The means by which Stackers agree on the canonical chain tip and agree to append blocks is tied to PoX. In each reward cycle, a Stacker clinches one or more reward slots; there are at most 4,000 reward slots per reward cycle. Stackers vote to accept blocks by producing a weighted threshold signature over the block. The signature must represent a substantial fraction of the total STX locked in PoX (the threshold), and each Stacker's share of the signature (its weight) is proportional to the fraction of locked STX it owns.

The weighted threshold signature is a Schnorr signature generated through a variation of the [FROST protocol](https://eprint.iacr.org/2020/852.pdf). Each Stacker generates a signing key pair, and they collectively generate an aggregate public key for nodes to use to verify signatures computed through a distributed signing protocol. This signing protocol allocates shares of the associated aggregate private key to Stackers proportional to the number of reward slots they clinch. No Stacker learns the aggregate private key; Stackers instead compute shares of the private key and use them to compute shares of a signature, which can be combined into a single Schnorr signature.

When a miner produces a block, Stackers execute a distributed signing protocol to collectively generate a single Schnorr signature for the block. Crucially, the signing protocol will succeed only if at least X% of the reward slots are accounted for in the aggregate signature. Nakamoto is currently set to use a 70% signing threshold -- at least 70% of the reward slots (by proxy, 70% of the stacked STX) must sign a block in order to append it to the Stacks blockchain.

Nakamoto uses the [WSTS protocol with the FIRE extension](https://trust-machines.github.io/wsts/wsts.pdf), which admits a distributed key generation and signature generation algorithm pair whose CPU and network bandwidth complexity grows with the number of distinct Stackers. The FIRE extension enables WSTS to tolerate byzantine Stackers.

Here is a diagram outlining the relationship between signing and stacking.

<figure><img src="../../../.gitbook/assets/image (17).png" alt=""><figcaption></figcaption></figure>
