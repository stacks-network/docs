# Bitcoin Reorgs

Under Nakamoto Stacks transactions won’t impactfully reorganize due to a Bitcoin fork. Not only is reorging relatively infrequent, but transactions on Stacks that got reorganized due to a Bitcoin fork behave just as reorganized Bitcoin transactions do. With some future analysis, transactions purely on the L2 chain may one day be entirely unaffected.

Understanding this concept fundamentally comes down to understanding finality on post-Nakamoto Stacks.

**Under Nakamoto the Stacks chain won’t fork on its own.** It is designed not to fork with only special exceptions, and it’s entirely infeasible for Stacks to fork on its own if even 31% of Stackers don’t want it to fork, and even then it would likely only happen within the span of a single tenure.

The only case in which Stacks forks post-Nakamoto is if Bitcoin forks cause it to fork.

Under Nakamoto, instead of winning the right to make a single block, miners win the right to make a ton of blocks, and during that time we say they’re under “tenure”. Every single Stacks block produced in a tenure requires at least 70% of Stackers to approve (sign) it for it to be included in the Stacks blockchain. The Stackers are watching the Bitcoin blockchain and will only sign blocks from the miner that won the latest sortition.

Now, let’s imagine that Bitcoin reorganizes itself and the Stackers were watching a Bitcoin fork that is now sub-optimal. The Stackers would essentially go back in time to the latest common sortition between the fork that it was watching and the new best Bitcoin fork and start signing the blocks within the tenures from there. Note that 70% of the Stackers will be doing the same thing all at once, and the moment 70% agree to start signing from the latest tenure on the new Bitcoin fork there’s a new singularly optimal Stacks blockchain.

So what happens to the transactions that were confirmed on the tenure that got reorganized? Nothing. Still in the mempool as if the reorganized tenure didn’t happen. For anything within the Stacks blockchain everything is fine.&#x20;

**This is 1:1 with a Bitcoin fork reorganizing a Bitcoin transaction.** You shouldn’t consider a transaction on Bitcoin final if it’s near the chain tip, and you shouldn’t consider a Stacks transaction final if it’s near the tenure tip.

#### Replaying Transactions <a href="#replaying-transactions-3" id="replaying-transactions-3"></a>

Since 70% of the signers have to sign any Stacks block included in the chain at least 70% of signers know the state of the chain before and after a Bitcoin fork causes a Stacks reorg.

There’s a catch to this that makes enforcing it difficult: if a transaction were dependent on something on the Bitcoin blockchain that also got reorganized (a peg-in, for example), that transaction would now be invalid. Taint analysis is when you attempt to answer the questions “which transaction interacted with the now-orphaned Bitcoin blockchain in a way that makes them invalid (tainted) in the new chain” and then also “which transactions interacted with the now invalid (tainted) transaction such that they are now also invalid”. There’s a cascading effect, but enforcing any kind of replay requires that the Stackers and the Miners can identify which transactions can get replayed at all.

Taint analysis, and subsequently replay enforcement, can be added in the future.&#x20;

For the first release, Nakamoto explicitly ties the Stacks blockchain to the Bitcoin blockchain such that there’s only one optimal Stacks fork tied to Bitcoin at any given point. This is completely 1:1 with the Bitcoin Blockchain behavior, but on the tenure scale.
