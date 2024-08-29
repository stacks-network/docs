# Signing

Stackers play an essential role in the Nakamoto system that had previously been the responsibility of miners. Before, miners both decided the contents of blocks, and decided whether or not to include them in the chain (i.e. by deciding whether or not to confirm them). In this system each actor has the following responsibilities necessary to make the system function reliably without forks:

* **Miners** decide the contents of blocks.
* **Stackers** decide whether or not the block is included in the chain.

The bulk of the complexity of the Nakamoto changes is in separating these two concerns while ensuring that both mining and Stacking remain open-membership processes. **Crucially, anyone can become a miner and anyone can become a Stacker, just as before.** The most substantial changes are in getting miners and Stackers to work together in their new roles to achieve this proposal's goals.

The key idea is that Stackers are required to acknowledge and validate a miner's block before it can be appended to the chain. To do so, Stackers must first agree on the canonical chain tip, and then apply (and roll back) the block on this chain tip to determine its validity. Once Stackers agree that the block is both canonical and valid, they collectively sign it and replicate it to the rest of the Stacks peer network. Only at this point do nodes append the block to their chain histories.

This new behavior prevents forks from arising. If a miner builds a block atop a stale tip, Stackers will refuse to sign the block. If Stackers cannot agree on the canonical Stacks tip, then no block will be appended in the first place. While this behavior creates a new failure mode for Stacks -- namely, the chain can halt indefinitely if Stackers cannot agree on the chain tip -- this is mitigated by having a large and diverse body of Stackers such that enough of them are online at all times to meet quorum and incentivizing them via PoX rewards to act as such.

### Stacker Signing

{% hint style="info" %}
You can view a list of all of the [active signers](https://explorer.hiro.so/signers?chain=mainnet) on Hiro's block explorer.
{% endhint %}

We'll cover how stacking works in the [Stacking](stacking.md) section and the sBTC signing in the [sBTC](../sbtc/) section, here we'll cover the signing process as it relates to Stacks block production.

The means by which Stackers agree on the canonical chain tip and agree to append blocks is tied to PoX. In each reward cycle, a Stacker clinches one or more reward slots; there are at most 4,000 reward slots per reward cycle. Stackers vote to accept blocks by producing a weighted threshold signature over the block. The signature must represent a substantial fraction of the total STX locked in PoX (the threshold), and each Stacker's share of the signature (its weight) is proportional to the fraction of locked STX it owns.

The weighted threshold signature is a Schnorr signature generated through a variation of the [FROST protocol](https://eprint.iacr.org/2020/852.pdf). Each Stacker generates a signing key pair, and they collectively generate an aggregate public key for nodes to use to verify signatures computed through a distributed signing protocol. This signing protocol allocates shares of the associated aggregate private key to Stackers proportional to the number of reward slots they clinch. No Stacker learns the aggregate private key; Stackers instead compute shares of the private key and use them to compute shares of a signature, which can be combined into a single Schnorr signature.

When a miner produces a block, Stackers execute a distributed signing protocol to collectively generate a single Schnorr signature for the block. Crucially, the signing protocol will succeed only if at least X% of the reward slots are accounted for in the aggregate signature. Nakamoto is currently set to use a 70% signing threshold -- at least 70% of the reward slots (by proxy, 70% of the stacked STX) must sign a block in order to append it to the Stacks blockchain.

Nakamoto uses the [WSTS protocol with the FIRE extension](https://trust-machines.github.io/wsts/wsts.pdf), which admits a distributed key generation and signature generation algorithm pair whose CPU and network bandwidth complexity grows with the number of distinct Stackers. The FIRE extension enables WSTS to tolerate byzantine Stackers.

Here is a diagram outlining the relationship between signing and stacking.

<figure><img src="../../.gitbook/assets/image (17).png" alt=""><figcaption></figcaption></figure>

### Validating and Appending New Blocks

When miners are selected for a new tenure, they begin building new blocks from transactions in the mempool. They then send those blocks to stackers for approval. Stackers must approve the blocks with a quorum of at least 70% for them to be appended to the chain.

Stackers will approve a block based on several properties:

* The block is well-formed
  * It has the correct version and mainnet/testnet flag
  * Its header contains the right number of Stacks blocks preceding this one.
  * Its header contains the correct total Bitcoin spent in the sortition that elected the current tenure.
  * Its header contains the same Bitcoin block hash as the Bitcoin block that contains its tenure's block-commit transaction\*
  * Its header contains the correct parent block ID of the immediate parent of this block.\*
  * The transaction Merkle tree root is consistent with the transactions
  * The state root hash matches the MARF tip root hash once all transactions are applied
  * The block header has a valid ECDSA signature from the miner.
  * The block header has a valid WSTS Schnorr signature from the set of Stackers.
* All Bitcoin transactions since the last valid sortition up to (but not including) this tenure's block-commit’s Bitcoin block have been applied to the Stacks chain state\*
* In the case of a tenure start block:
  * The first transaction is the `TenureChange` transaction.
  * The first transaction after the `TenureChange` transaction is a `Coinbase`.

The properties marked with \* are collectively how Stacks ensures Bitcoin finality. By adhering to these properties, it ensures that miners are only able to append blocks if they build atop the correct chain tip, which also anchors the history to Bitcoin.

Stackers, by validating these rules, ensure Bitcoin finality. We'll talk about this more in the next section.

### Conducting Miner Tenure Changes

The other primary signing responsibility in block production involves conducting tenure change transactions. As discussed in the mining section, miners will submit a `block-commit` transaction on the Bitcoin chain to initiate mining. If they are selected, stackers will detect that and create a `tenure-change` transaction.

This tenure change transaction includes:

| Name                           | Description                                                                                                                                                                                                                                                                                                                                           | Representation      |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| tenure consensus hash          | Consensus hash of this tenure. Corresponds to the sortition in which the miner of this block was chosen. It may be the case that this miner's tenure gets extended across subsequent sortitions; if this happens, then this `consensus hash` value remains the same as the sortition in which the winning block-commit was mined.                     | 20 bytes            |
| previous tenure consensus hash | Consensus hash of the previous tenure. Corresponds to the sortition of the previous winning block-commit.                                                                                                                                                                                                                                             | 20 bytes            |
| burn view consensus hash       | Current consensus hash on the underlying burnchain. Corresponds to the last-seen sortition.                                                                                                                                                                                                                                                           | 20 bytes            |
| previous tenure end            | The index block hash of the last Stacks block from the previous tenure.                                                                                                                                                                                                                                                                               | 32 bytes            |
| previous tenure blocks         | The number of blocks produced since the last sortition-linked tenure.                                                                                                                                                                                                                                                                                 | 4 bytes, big-endian |
| cause                          | <p>A flag to indicate the cause of this tenure change<br>- <code>0x00</code> indicates that a sortition occurred, and a new miner should begin producing blocks.<br>- <code>0x01</code> indicates that the current miner should continue producing blocks. The current miner’s tenure execution budget is reset upon processing this transaction.</p> | 1 byte              |
| pubkey hash                    | The ECDSA public key hash of the current tenure.                                                                                                                                                                                                                                                                                                      | 20 bytes            |

This tenure change transaction is then sent to the newly elected miner and they must include it as the first transaction in their first block, otherwise stackers will not approve it.

This process is then repeated over and over as new miners are elected for tenures.

Be sure to take a look at [SIP-021](https://github.com/stacksgov/sips/blob/feat/sip-021-nakamoto/sips/sip-021/sip-021-nakamoto.md) to get a detailed description of exactly what happens under the hood during these processes.

Next up, let's dig a little deeper into this idea of Bitcoin finality and how the Stacks block production mechanism achieves it.
