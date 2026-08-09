---
description: >-
  How signers validate and sign Stacks blocks under PoX-5: how the signer set is
  chosen each cycle, what a valid block is, and how tenure changes work.
---

# Signing: Verifying Block Validity

<div data-with-frame="true"><figure><img src="https://2842511454-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FH74xqoobupBWwBsVMJhK%2Fuploads%2FjFK8dOojyXCt47QStvhQ%2Fsigning-cover.png?alt=media&#x26;token=a5b8dfbc-f35b-4928-b2b8-b82ac4dd46dc" alt=""><figcaption></figcaption></figure></div>

{% hint style="info" %}
**Builder Resources**

* To operate as a signer, see [Run a Signer](https://docs.stacks.co/operate/run-a-signer).
* To view a full list of active signers, see the [Explorer's signers page](https://explorer.hiro.so/signers?chain=mainnet).
{% endhint %}

#### The Big Picture

* Signers validate and sign proposed Stacks blocks before they can join the chain.
* The signer set is fixed each reward cycle: every signer-manager with at least 50,000 STX staked to it.
* A signer's voting weight is proportional to the STX staked through it.
* Accepting a block requires signatures carrying at least 70% of total signer weight.
* Signing prevents forks and anchors Stacks history to Bitcoin.

***

### Intro

Signers play a role in the Stacks network that had previously belonged to miners. Before the Nakamoto upgrade, miners both decided the contents of blocks and decided whether blocks joined the chain. Since Nakamoto, each actor holds one of those responsibilities:

* **Miners** decide the contents of blocks.
* **Signers** decide whether a block is included in the chain.

The bulk of the complexity in the Nakamoto changes went into separating these two concerns while keeping both mining and staking open-membership. Anyone can become a miner and anyone can become a staker. [SIP-021](https://github.com/stacksgov/sips/blob/main/sips/sip-021/sip-021-nakamoto.md) describes the design as it was introduced.

Signers are required to acknowledge and validate a miner's block before it can be appended to the chain. To do so, they must first agree on the canonical chain tip, then apply the block on that tip to determine its validity. Once enough signers agree that the block is both canonical and valid, their signatures accompany the block as it replicates to the rest of the Stacks peer network, and only at that point do nodes append it to their chain histories.

This behavior prevents forks from arising. If a miner builds a block atop a stale tip, signers refuse to sign it. If signers cannot agree on the canonical Stacks tip, no block is appended in the first place. The failure mode this creates, a chain that halts while signers disagree, is mitigated by keeping the signer set large and diverse enough that quorum is met at all times, and by paying signers through PoX rewards to stay online.

***

### How Signers Are Selected

Under PoX-5, a signer is a signer-manager contract bound to one signer key. The binding happens once: the signer-key holder signs a [SIP-018](https://github.com/stacksgov/sips/blob/main/sips/sip-018/sip-018-signed-structured-data.md) grant naming the manager, and the manager submits it through `grant-signer-key` and registers with `register-signer`. The key holder can revoke the grant at any time with `revoke-signer-grant`, which stops the manager accepting new stake while existing positions wind down.

During each prepare phase, the last 100 Bitcoin blocks of a reward cycle, the signer set for the upcoming cycle is fixed: every registered signer-manager with at least 50,000 STX (`SIGNER_SET_MIN_USTX`) staked to it in aggregate. A signer's voting weight for that cycle is proportional to the total STX staked through it, counting the STX in STX-only stakes and the STX side of protocol bonds together. The BTC side of a bond carries no signing weight: signing weight, like governance weight, is a function of locked STX alone.

The signer software detects from chain state whether its manager is in the upcoming cycle's signer set. Staking transactions are sent manually; everything the signer does with that information is automatic.

#### The relationship between stakers and signers

<div data-with-frame="true"><figure><img src="https://2842511454-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FH74xqoobupBWwBsVMJhK%2Fuploads%2FlvBLhI7D2ThkIs3oW5jR%2Fstaking-and-signing.svg?alt=media&#x26;token=4ccaf8db-6e07-4cf3-b378-e19584a49526" alt="Manual staking transactions feeding the reward phase, and the signer software acting automatically once its manager is in the signer set"><figcaption></figcaption></figure></div>

* Stakers are not signers. Signing is done by the key granted to the signer-manager they stake to, and running that signer is the manager operator's job.
* Every signer is backed by staked STX. To be in the signer set, a manager must represent at least the 50,000 STX aggregate threshold, and its weight grows with the stake it represents.

***

### Signer Signing

When a miner proposes a block, each signer validates it independently and signs it with its granted signer key. The block carries the resulting set of signatures, and a node accepts it only when the signatures are valid, free of duplicates, ordered consistently with the signer set, and together carry at least 70% of the total signer weight for the cycle. The threshold is a consensus constant in the node ([`NAKAMOTO_SIGNER_BLOCK_APPROVAL_THRESHOLD`](https://github.com/stacks-network/stacks-core/blob/4.0.1/stackslib/src/core/mod.rs)).

Weight, in this protocol, is stake: a signer-manager representing 10% of all staked STX carries 10% of the vote on every block. Blocks are accepted by an economic majority of the locked capital, which is what ties block production back to the staking described on the [Staking page](stacking.md).

***

### Validating and Appending New Blocks

When miners are selected for a new tenure, they begin building blocks from transactions in the mempool and send them to signers for approval. Signers must approve a block with at least 70% of signer weight for it to be appended to the chain.

Signers approve a block based on several properties:

* The block is well-formed
  * It has the correct version and mainnet/testnet flag
  * Its header contains the right number of Stacks blocks preceding this one.
  * Its header contains the correct total Bitcoin spent in the sortition that elected the current tenure.
  * Its header contains the same Bitcoin block hash as the Bitcoin block that contains its tenure's block-commit transaction\*
  * Its header contains the correct parent block ID of the immediate parent of this block.\*
  * The transaction Merkle tree root is consistent with the transactions
  * The state root hash matches the MARF tip root hash once all transactions are applied
  * The block header has a valid ECDSA signature from the miner.
  * The block header carries signer signatures meeting the 70% weight threshold.
* All Bitcoin transactions since the last valid sortition up to (but not including) this tenure's block-commit's Bitcoin block have been applied to the Stacks chain state\*
* In the case of a tenure start block:
  * The first transaction is the `TenureChange` transaction.
  * The first transaction after the `TenureChange` transaction is a `Coinbase`.

The properties marked with \* are collectively how Stacks ensures Bitcoin finality. By adhering to them, miners can only append blocks that build atop the correct chain tip, which also anchors the history to Bitcoin.

### Conducting Miner Tenure Changes

The other primary signing responsibility in block production is conducting tenure change transactions. As discussed in the mining section, miners submit a `block-commit` transaction on the Bitcoin chain to initiate mining. If a miner is selected, signers detect that and create a `tenure-change` transaction.

This tenure change transaction includes:

| Name                           | Description                                                                                                                                                                                                                                                                                                                                           | Representation      |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| tenure consensus hash          | Consensus hash of this tenure. Corresponds to the sortition in which the miner of this block was chosen. It may be the case that this miner's tenure gets extended across subsequent sortitions; if this happens, then this `consensus hash` value remains the same as the sortition in which the winning block-commit was mined.                     | 20 bytes            |
| previous tenure consensus hash | Consensus hash of the previous tenure. Corresponds to the sortition of the previous winning block-commit.                                                                                                                                                                                                                                             | 20 bytes            |
| burn view consensus hash       | Current consensus hash on the underlying burnchain. Corresponds to the last-seen sortition.                                                                                                                                                                                                                                                           | 20 bytes            |
| previous tenure end            | The index block hash of the last Stacks block from the previous tenure.                                                                                                                                                                                                                                                                               | 32 bytes            |
| previous tenure blocks         | The number of blocks produced since the last sortition-linked tenure.                                                                                                                                                                                                                                                                                 | 4 bytes, big-endian |
| cause                          | <p>A flag to indicate the cause of this tenure change<br>- <code>0x00</code> indicates that a sortition occurred, and a new miner should begin producing blocks.<br>- <code>0x01</code> indicates that the current miner should continue producing blocks. The current miner's tenure execution budget is reset upon processing this transaction.</p> | 1 byte              |
| pubkey hash                    | The ECDSA public key hash of the current tenure.                                                                                                                                                                                                                                                                                                      | 20 bytes            |

This tenure change transaction is then sent to the newly elected miner, who must include it as the first transaction in their first block, otherwise signers will not approve it.

This process repeats as new miners are elected for tenures.

[SIP-021](https://github.com/stacksgov/sips/blob/main/sips/sip-021/sip-021-nakamoto.md) has a detailed description of what happens under the hood during these processes.

***

### If You Knew Signing Under PoX-4

The corrections to the old model, in one place:

* Stackers registered a block-signing key with every stacking or delegate-stack transaction. That is gone: a signer-manager holds one signer key through a one-time grant, revocable by the key holder.
* Reward slots are gone, and with them the cap of 4,000 slots per cycle. The signer set is the set of qualifying signer-managers, and weight comes from staked STX rather than slots clinched.
* Delegation is gone, so the old distinction between stackers who sign and stackers who delegate their signing no longer describes anything. Signing belongs to the key granted to the signer-manager a staker stakes to.
* SIP-021 specifies signing with an aggregate Schnorr signature generated through the WSTS protocol, including a distributed key generation round each cycle. The node validates blocks against a set of individual signer signatures weighted by stake, as described above. Read the WSTS material in SIP-021 as design history.

***

#### Additional Resources

* [SIP-021: Nakamoto](https://github.com/stacksgov/sips/blob/main/sips/sip-021/sip-021-nakamoto.md)
* [SIP-045: PoX-5, Bitcoin Staking](https://github.com/stacksgov/sips/blob/main/sips/sip-045/sip-045-pox-5-bitcoin-staking.md)
* [pox-5.clar at release 4.0.1](https://github.com/stacks-network/stacks-core/blob/4.0.1/stackslib/src/chainstate/stacks/boot/pox-5.clar)
* [Run a Signer](https://docs.stacks.co/operate/run-a-signer)
* [Generate a Signer Signature](https://docs.stacks.co/operate/staking-stx/generate-signer-signature)
