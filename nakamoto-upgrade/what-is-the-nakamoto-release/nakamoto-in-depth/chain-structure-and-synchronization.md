# Chain Structure and Synchronization

### Chain Structure

The Nakamoto Stacks chain is a linearized history of blocks without forks. Miners create blocks at a fast cadence (on the order of seconds), they send them to signers for validation, and if signers reach at least 70% quorum on the block, then the block is replicated to the rest of the peer network. The process repeats until the next cryptographic sortition chooses a different miner to produce blocks.

Miners submit their candidacy to produce blocks by sending a block-commit transaction on the Bitcoin chain. Nakamoto alters the semantics of the block-commit in one key way: the block\_header\_hash field is no longer the hash of a proposed Stacks block (i.e. its BlockHeaderHash), but instead is the index block hash (i.e. StacksBlockId) of the previous miner's first-ever produced block.

By altering the block-commit to expect the first block from the previous tenure, we make the system resilient to high network latency. Miner candidates will have approximately the time between Bitcoin blocks to obtain and process the previous miner’s blocks and submit a valid block-commit for the current Stacks tip.

<figure><img src="../../../.gitbook/assets/image (13).png" alt=""><figcaption></figcaption></figure>

_Figure 1: Overview of the relationship between Bitcoin blocks (and sortitions), Stacks blocks, and the inventory bitmaps exchanged by Stacks nodes. Each winning block-commit's BlockHeaderHash field no longer refers to a new Stacks block to be appended, but instead contains the index block hash of the very first Stacks block in the previous tenure. Signers force the miner to build upon the last signed Stacks block in the previous tenure by refusing to sign blocks that don’t build upon the most recently signed block. These tenure start blocks each contain a TenureChange transaction (not shown), which, among other things, identifies the number of Stacks blocks produced since the last valid start block (numbers in dark orange circles)._

This is to both preserve Bitcoin finality and to facilitate initial block downloads without significantly altering the inventory state synchronization and block downloader state machines. Bitcoin finality is preserved because at every Bitcoin block N+1, the state of the Stacks chain as of the start of tenure N is written to Bitcoin. Even if at a future date all of the former Stackers' signing keys were compromised, they would be unable to rewrite Stacks history for tenure N without rewriting Bitcoin history back to sortition N+1.

### Chain Synchronization

Nodes do the following when they have all of the Stacks chain state up to reward cycle R:

1. **Download and process all sortitions in reward cycle R+1.** The node downloads the Bitcoin blocks, identifies the valid block-commits within them, and runs sortition on each Bitcoin block's block-commits to choose a winner. It does this on a reward-cycle by reward-cycle basis, since it must first process the PoX anchor block for the next reward cycle before it can validate the next reward cycle's block-commits.
2. **For each sortition N+1, go and fetch the start block of tenure N if sortition N+1 has a valid block-commit and the inventory bit for tenure N is 1.** Each neighbor node serves the node an inventory bitmap of all tenure start blocks they have available, which enables the node to identify neighbors that have the blocks they need. Only the inventory bitmap of tenure start blocks is needed; there is no longer a need for a PoX anchor block bitmap nor a microblock bitmap.
3. **For each start block of tenure N, identify the number of blocks** between this start block and the last prior tenure committed to by a winning block-commit (note that this may not always be tenure N-1). This information is identified by a special TenureChange transaction that must be included in each tenure start block (see next section). So, the act of fetching the tenure-start blocks in step 2 is the act of obtaining these TenureChange transactions.
4. **Download and validate the continuity of each block sequence between consecutive block commits.** Now that the node knows the number of blocks between two consecutive winning block-commits, as well as the hashes of the first and last block in this sequence, the node can do this in a bounded amount of space and time. There is no risk of a malicious node serving an endless stream of well-formed but invalid blocks to a booting-up node, because the booting-up node knows exactly how many blocks to expect and knows what hashes they must have.
5. **Concurrently processes newly-downloaded blocks in reward cycle R+1** to build up its tenure of the blockchain.
6. **Repeat once the PoX anchor block for R+2 has been downloaded and processed**

When the node has synchronized to the latest reward cycle, it would run this algorithm to discover new tenures within the current reward cycle until it reaches the chain tip. Once it has processed all blocks as of the last sortition, it continues to keep pace with the current miner by receiving new blocks broadcasted through the peer network by Stackers once they accept the next Stacks block.
