# Bitcoin Finality

The concept of 100% Bitcoin finality is crucial to the design of Stacks. This is what turns Stacks into a true Bitcoin L2 and allows it to leverage all of the security inherent in Bitcoin.

Let's first define what we mean by 100% Bitcoin finality, then we'll dig into how Stacks accomplishes this.

Finality refers to the point at which transactions are irreversible. Once a blockchain reaches finality, it is nearly impossible to change the ledger's history without undertaking extraordinary measures that are often computationally and economically prohibitive.

When we talk about Stacks blocks having 100% Bitcoin finality, we mean that they are as hard to reverse as Bitcoin transactions themselves.

That's a bold claim, so how does Stacks accomplish that?

As discussed above, miners are responsible for producing Stacks blocks in their tenure, which corresponds to a single Bitcoin block. As part of their block commit transaction, which is the transaction that previously committed the hash of the next Stacks block to the Bitcoin chain, miners will instead be required to add an indexed block hash.

The indexed block hash is the hash of the first block produced by the last Stacks miner in their tenure. This is the SHA512/256 hash of both the consensus hash of all previously-accepted Bitcoin transactions that Stacks recognizes, as well as the hash of the block itself.

This will anchor the Stacks chain history to Bitcoin up to the start of the previous miner's tenure, as well as all causally-dependent Bitcoin state that Stacks has processed. This ensures Bitcoin finality, resolves miner connectivity issues by putting fork prevention on stackers, and allows nodes with up-to-date copies of the Stacks chain state to identify which Stacks blocks are affected by a Bitcoin reorg and recover the affected Stacks transactions.

This relationship between Stackers, miners, Bitcoin blocks, and Stacks blocks is what maintains Bitcoin finality while allowing miners to rapidly produce Stacks blocks. Bitcoin finality is achieved because at every Bitcoin block N + 1, the state of the Stacks chain as of the start of tenure N is written to Bitcoin. Even if at a future date all of the former Stackers’ signing keys were compromised, they would be unable to rewrite Stacks history for tenure N without rewriting Bitcoin history back to tenure N + 1.

Because of this, Stacks transactions can be considered to have Bitcoin finality after the tenure they are a part of concludes, or Bitcoin block N + 1. As an example, if I initiate a Stacks transaction that gets confirmed by a Stacks miner, at the conclusion of that miner's tenure (the end of the current Bitcoin block) that transaction will be written to Bitcoin as part of the Stacks chain state and all future miners are required to build off of that chain tip, making reversing the transaction as difficult as reversing the corresponding Bitcoin transaction.

#### Nakamoto Transactions and Bitcoin Reorgs

If Nakamoto transactions follow Bitcoin finality, what happens if Bicoin forks?

In order to answer this question, we need to distinguish between two types of Stacks transactions: Bitcoin-reliant and internal.

**Bitcoin-reliant** transactions are transactions that read Bitcoin state. If Bitcoin forks, then these transactions will change. For these, you cannot do better than following Bitcoin finality. Let's say you moved BTC from L1 to L2, you have to wait for Bitcoin finality before your L2 BTC can be used (you don’t have any L2 BTC if Bitcoin forks and your L1 transaction becomes unconfirmed).

**Internal** transactions don't rely on Bitcoin state, and thus won't change if Bitcoin forks. We can have faster confirmations with these because even if Bitcoin forks, signers can ensure that these are re-processed in the same order.

The key takeaway is this:

Under Nakamoto Stacks transactions won’t impactfully reorganize due to a Bitcoin fork. Not only is reorging relatively infrequent, but transactions on Stacks that got reorganized due to a Bitcoin fork behave just as reorganized Bitcoin transactions do. With some future analysis, transactions purely on the L2 chain may one day be entirely unaffected.

This is a nuanced and complicated concept, so if you are interested in learning more about how this works, you can take a look at the [Bitcoin Reorgs](bitcoin-reorgs.md) page of the docs.
