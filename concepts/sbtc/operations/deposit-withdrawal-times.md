# sBTC Withdrawal Time vs Deposit Time

## Why are Deposits So Fast and Withdrawals So Slow?

sBTC allows users to use their BTC on the Stacks L2 by using a wrapped token called sBTC. Moving sBTC onto the Stacks L2 can take as little time as 1 Bitcoin block, but moving sBTC off the Stacks L2 into the native Bitcoin blockchain takes 6 Bitcoin blocks. Why is that?

To understand why moving onto the Stacks layer can be so fast and yet moving off must be so slow, we need to first understand the consensus mechanism of the Stacks blockchain.

The Stacks blockchain uses a consensus mechanism called proof of transfer, or PoX, in order to mint new blocks. On each Bitcoin block miners on the Stacks blockchain each sacrifice some amount of Bitcoin in a bid to win the right to make the next few Stacks blocks, where they retain the right to keep making Stacks blocks until the next Bitcoin block occurs and the latest bidding round elects a new Miner. Signers (validators equivalents for the Stacks Blockchain) look at the Bitcoin blocks and approve new Stacks blocks based on which miner currently has the right to make Stacks blocks, and they only approve new blocks from the Signers that won the most recent bid on the Bitcoin block within the fork that they collectively consider to be the “best”. The Stacks blockchain can only have new blocks added if the Signers agree that the miner who proposed it is the winner of the bid on the Bitcoin blockchain, and all the Signers are voting on which block should be added, effectively collectively deciding which Bitcoin fork is the best one.

Here’s an important part: if the Signers believe that there’s a new and better Bitcoin fork that differs from the one that the last several Stacks blocks had been mined on, they’ll then only approve new Stacks blocks that build off of Stacks blocks that are tied to that new fork. As in, every Stacks block that was built on Bitcoin Blocks in the other Bitcoin fork that aren’t in this new fork are considered invalid; thus the Stacks blockchain forks too.

A simple way to say this: “The Stacks blockchain forks with the Bitcoin blockchain.”

Now that we understand this forking mechanism, let's take a look at why moving off the Stacks layer must be so slow.

sBTC exists on the Stacks layer as a token that smart contracts can interact with. To move sBTC over from the Stacks layer to the Bitcoin layer the owner of the sBTC calls a smart contract to initiate what we call the “withdrawal” sequence. This lets the “sBTC Signers” (these are different from the earlier Signers mentioned, sorry) know that they need to create a transaction on the Bitcoin blockchain to distribute the BTC back to the user.

If the signers create a Bitcoin transaction to enact the withdrawal they can’t take it back, and it will be valid on every fork of the Bitcoin blockchain. So what happens if, say, the bitcoin blockchain forks and the withdrawal on the Stacks layer got reorganized out? Then there’s an irretrievable withdrawal transaction on the Bitcoin blockchain giving precious BTC to a user who never withdrew their sBTC on the Stacks layer.

"Can the Signers that maintain the original chain force miners to replay all previously confirmed transactions?" It's worth asking to learn more about withdrawal process. The Stacks blockchain is a true Layer 2 on top of Bitcoin, and you can write a smart contract to have different behavior based on observations of the Bitcoin blockchain underneath. You can, for example, write a Stacks contract that says “Pay to Jeff if the latest Bitcoin block hash ends in an even hex digit, and pay to Abigail if it’s an odd hex digit.” Now when there’s a reorg of the Bitcoin blockchain you can replay this transaction which originally paid to Jeff, but it now pays to Abigail, and what happens if this contract was giving out sBTC, and further what happens if Jeff then immediately executed a withdrawal?

So in the end, to process a withdrawal safely you need to be sufficiently sure it won’t get reorganized out. That means it can only be processed 6 Bitcoin blocks (the finality criteria the Signers are comfortable with) after the withdrawal was made on the Stacks blockchain.

But then, why can deposits be done in one Bitcoin block at its fastest?

Remember how Stacks forks with Bitcoin? Let's say someone makes a deposit on the Bitcoin blockchain in an attempt to mint sBTC, and then lets say the sBTC Signers immediately mint sBTC. What happens if the Bitcoin chain forks causing the Stacks blockchain to fork? The mint gets reorganized out! Sure, the deposit is no longer on the Bitcoin blockchain, but it’s not on the Stacks blockchain either. If that deposit doesn’t ever arrive on the Bitcoin blockchain the sBTC signers will never mint sBTC, so there’s nothing to take back!

So all in all, for movements of sBTC from the Stacks layer into the Bitcoin layer the protocol needs to wait for Bitcoin to be sufficiently final, but movements from the Bitcoin layer to the Stacks layer don’t need to wait for finality to mint because the Stacks layer will just reorganized itself if the Bitcoin layer reorganizes too.

But then conceptually remember, the mint call on the Stacks blockchain is just as final as the Bitcoin block that contains the deposit of BTC onto the Stacks layer. If you’re minting sBTC on the Stacks layer and you want to wait for it to be final you’ll need to wait a suitable number of Bitcoin blocks to consider it finally minted, but that’s up to you and not the sBTC Signers.
