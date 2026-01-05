# Blocks

Bitcoin blocks consist of a couple of key components: transactions and a header.

Transactions are bundled together and written to a block in the form of a merkle tree. Starting at the bottom, we have all of the transactions in a block and each is hashed with the SHA-256 algorithm. Then, two of those resulting hashes are hashed together, and so on up the tree until we reach a single root.

<figure><img src="https://lwfiles.mycourse.app/635fe723662899c6bfb19e1d-public/652ba74c6638659efab8272a87d1aa6b.png" alt=""><figcaption><p>You can visualize this using this graphic from Subhan Nadeem's <a href="https://www.freecodecamp.org/news/how-bitcoin-mining-really-works-38563ec38c87/">excellent guide to Bitcoin mining.</a></p></figcaption></figure>

\
This merkle root is the foundation of how the Bitcoin blockchain maintains perpetual data integrity. This single merkle root is the unique "summary" of all of the transactions contained in this block. If even one byte of data in any of these transactions was changed, the merkle root would be completely different, rendering a block invalid.

Since this violates the rules of the Bitcoin protocol, a node would catch this change and reject that block as invalid.

Next is the block header, which is made of 6 components:

* Bitcoin software version number
* Block timestamp
* The merkle root of this block's transactions
* The hash of the previous block
* A nonce
* The target

By containing the hash of the previous block in every block header, we can create an immutable chain of blocks and an ongoing ledger of every transaction that has ever occurred. This is where we get the term blockchain.

Nonce and target are two components that are critical to the mining process, and we'll cover them below when we dive deeper into mining.
