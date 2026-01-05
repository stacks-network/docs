# Miners

As you probably know, Bitcoin uses proof-of-work mining. What does that mean? The Bitcoin protocol uses a SHA-256 hashing algorithm. SHA-256 is a one-way deterministic hashing algorithm that takes an input and returns a hash in the form of a 256-bit number.

That means:

1. One-way: we provide an input to the hashing function, and it gives us an output, but we cannot then take that output and get back the original input
2. Deterministic: If we provide the same input, we will get the same output every time. If we change even one character, we get a completely different hash

Let's look at an example of this using this [hash calculator](https://xorbin.com/tools/sha256-hash-calculator).

If we type "Hello World" into the input box, we get a hash back.

<figure><img src="https://lwfiles.mycourse.app/635fe723662899c6bfb19e1d-public/b28da6003c2fbb4219b851ffa66c4cad.png" alt=""><figcaption></figcaption></figure>

We get the hash a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e.\
\
Let's see what happens if we change even one little character, let's change the "H" to be lowercase.

<figure><img src="https://lwfiles.mycourse.app/635fe723662899c6bfb19e1d-public/25cd7a3bf92a507e766a8fb597d5083b.png" alt=""><figcaption></figcaption></figure>

SHA-256 gives us a completely different hash. But, if we switch back to a capital "H", you'll see that we get the same hash that we got before, that's the deterministic part of the hash function.

But we said the output is a 256-bit number, what's with the letters?

The output is represented as a hexadecimal number, which uses base 16 instead of the base 10 representation most of us are used to with the decimal system. In decimal notation we can only represent values with 0-9, and with hexadecimal we expand that to use the symbols a-f to represent the values 10-15.

So in a hexadecimal number, 3a would actually represent the values 3 and 10.

Okay, so what do these hash values have to do with mining?

When someone becomes a miner, their Bitcoin software will take a megabyte worth of transactions (remember that transactions are sent to all nodes) run it through SHA-256, and continue trying different pieces of data until it gets to a number that the network accepts, in which case they are given the block reward.

The block reward is how new Bitcoin is minted and is also the financial incentive for miners to spend computational energy to try to guess this hash value.

But what data is getting submitted to the hash function by the miners? And how does the network decide which is acceptable? More importantly, how does this process ensure that only valid data is written to the chain?

### Bitcoin Mining In-Depth

Let's go back up to the target and nonce fields of the block header we mentioned above.\
Now that we have some context into how hashing plays a role in mining, we can see what these fields are used for.

Remember that the output of a SHA-256 function is just a hexadecimal number.

The target field of the block header is also a number but in traditional base 10 notation.

The goal of miners is to take the information contained in the current block header, add a random number to it called a nonce, and calculate the hash. If the hash value is lower than the target value, then the miner writes the block to the chain and is rewarded with the block subsidy.

The "work" part of the proof of work consensus mechanism consists of mining software trying an extremely large number of different nonces to get a hash value that is lower than the target.

So a miner will start with a nonce of 0, and then increase the nonce one at a time until the hash outputs a number that is lower than the set target.

Even for the Genesis block, the highest the target number will ever be, required 2,083,236,893 attempts to get the final acceptable nonce.

Miners get their rewards by adding a transaction to their block rewarding themselves, this is a special transaction called a generation transaction and is accepted by the network upon publishing a valid block.

So that is how things work from the miner side, but how do the other nodes know that the transactions contained in this published block are legitimate?

The rules that transactions need to follow are coded into every Bitcoin node, so a receiving node will first check to make sure that all transactions contained in the new block follow the rules.

If they do, it will then double-hash the header of the published block to verify that it is lower than the target. The miner publishes the successful nonce with their header, so the validating nodes only need to run the hash function with the provided nonce to ensure it is correct.

Even if a miner goes through the costly process of trying to mine a new block, they still need to include valid transactions or their efforts will be wasted, since the validating nodes won't accept an invalid block.

### Difficulty Adjustment

Trying all the different inputs required to generate an accepted hash requires an immense amount of energy, and this energy expenditure is the core of what secures the Bitcoin chain.

Bitcoin has a built-in difficulty adjustment, which automatically adjusts the difficulty of guessing the correct hash depending on how many miners are online.

Every two weeks, Bitcoin analyzes miner activity and adjusts the difficulty so that the average time to write a block is 10 minutes.

It does this by raising or lowering the target number to make it so that the odds of guessing the nonce roughly match up with it taking 10 minutes to occur based on the current hashrate of the Bitcoin network.

Because of this, we can verify the real Bitcoin chain by determining which is the longest, we'll get into this a bit more in the Blockchain section below.
