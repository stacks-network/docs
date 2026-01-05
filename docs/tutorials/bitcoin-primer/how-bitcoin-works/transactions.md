# Transactions

Before we look at how blocks are constructed, let's first take a look at how Bitcoin transactions work.

As we noted above, any Bitcoin address can generate a new transaction to be broadcasted to the network.

A transaction is just a set of data that indicates the amount of Bitcoin being sent, what address it is being sent from, and what address it is being sent to.

The entire collective history of these transactions is what forms the Bitcoin blockchain.

All you are doing when you make a transaction is sending these pieces of data to the Bitcoin network. Eventually, a miner will add this transaction to a block and it will be confirmed on-chain, living on in perpetuity.

A transaction is a record of moving coins from one wallet to another, but it's not like how you might picture a bank account, where you are just moving a number from one bucket to another.

Instead, Bitcoin addresses (covered more below) are a record of every transaction that the address has ever sent or received, and this is how we can read the balance of a transaction.

Additionally, when you send bitcoins from your address to someone else, you are not directly sending a portion of your total bitcoins, you are batching transactions you have already received and sending that as a new transaction to someone else.

That's a little confusing, so let's lay it out with an example.

Let's say I receive three bitcoin transactions for 1, 2, and 3 BTC. I might have 6 BTC total, but it is recorded simply as me having received these three transactions.

So if I want to send 5 BTC to someone, my two transactions for 2 and 3 BTC will be batched together and sent as one new transaction. These batches are called outputs.

What if want to send 5.5 BTC to someone? In that case, Bitcoin will batch each of my transactions into a new output for 6 BTC, and then create an additional output to send 0.5 BTC back to myself.

It's weird but works better from a programming perspective.

Each transaction is locked using cryptography, so I can't just submit a new transaction that sends 1 BTC from your address to mine. We'll cover this in more detail below in the Addresses section.

If you've seen the term UTXO, that stands for "unspent transaction output".

If we modify our example above and I have a fourth transaction in my address for another 3 BTC, that output was not used in me paying the 5.5 BTC, so that is known as an unspent transaction output.

All of my other outputs are considered spent and cannot be used again, but this other one can because it is unspent.

Similarly, the 0.5 BTC that I sent back to myself is now a new UTXO that I can spend in the future.

UTXOs are critical because the total number of bitcoins an address owns is simply the sum of all of its UTXOs.

### The Mempool

When someone first initiates a new transaction, it does not immediately get written to a block. Instead, it gets sent to the mempool, which is a waiting room for transactions until they get picked up by a miner to be written to a block.
