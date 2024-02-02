# Verifying a Bitcoin Transaction

One of the coolest things about Clarity is that it allows us to have visibility into the state of the Bitcoin blockchain. Since Stacks blocks are mined in lockstep with Bitcoin blocks, we can directly read the burnchain header info of each Bitcoin block using Clarity's built-in [`get-burn-block-info?`](https://docs.stacks.co/docs/clarity/language-functions#get-burn-block-info-clarity2) function.

There are quite a few relatively complex things that need to happen to do this successfully, but a [clarity-bitcoin library](https://github.com/friedger/clarity-bitcoin/) exists to make the process a lot easier and handle some of the heavy lifting for us.

Let's take a look at how to verify a Bitcoin transaction was mined using Clarity using the library. If you take a look at the `clarity-bitcoin.clar` file in the linked repo, you'll find a function called `was-tx-mined-compact`. That's what we'll be working with, and it looks like this:

```clarity
(define-read-only (was-tx-mined-compact (height uint) (tx (buff 1024)) (header (buff 80)) (proof { tx-index: uint, hashes: (list 14 (buff 32)), tree-depth: uint}))
    (let ((block (unwrap! (parse-block-header header) (err ERR-BAD-HEADER))))
      (was-tx-mined-internal height tx header (get merkle-root block) proof)))
```

The transaction itself is relatively simple, but there's a lot happening within other private function calls. I encourage you to read the contract for yourself and trace what is happening, step-by-step, when we call this function.

For now, we'll just go over how to actually call this function successfully.

You can see that it takes a few pieces of information:

* `(height uint)` the block height you are looking to verify the transaction within
* `(tx (buff 1024))` the raw transaction hex of the transaction you are looking to verify
* `(header (buff 80))` the block header of the block
* `(proof { tx-index: uint, hashes: (list 14 (buff 32)), tree-depth: uint})` a merkle proof formatted as a tuple

:::info

A Merkle proof is a compact way to prove that a transaction is included in a block in the Bitcoin blockchain. Here's how it works:

1. Transactions in a block are hashed and paired, then the hashes of the pairs are hashed and paired, and so on until a single hash remains - this is called the Merkle root.
2. The Merkle root is included in the block header. By providing the hashes that lead from a transaction's hash up to the Merkle root, along with the block header, one can prove that the transaction is included in that block.
3. These hashes that connect a transaction to the Merkle root are called the Merkle proof or Merkle path. By providing the Merkle proof along with the transaction hash and block header, anyone can verify that the transaction is part of that block.
4. This allows for efficient decentralized verification of transactions without having to download the entire blockchain. One only needs the transaction hash, Merkle proof, and block header to verify.

:::

Once we have this information, we can call into the `clarity-bitcoin.clar` contract and pass in this data. A common practice would be to get this data from a Bitcoin block explorer API like Mempool.space or Blockstream's esplora, parse it into the correct format for this helper, and then pass it to this function.

We could do that directly via this contract if we just need a direct response on if the transaction was included or not, but more likely we would want to integrate this functionality into a Clarity contract of our own where we can `asserts!` that a transaction was mined before taking another action.

Here's a basic example where we are calling [Blockstream's API](https://github.com/Blockstream/esplora/blob/master/API.md) using JavaScript, parsing the data into the right format, and then calling into our own `mint` function to only mint an NFT if the selected transaction was mined.

We can get all the information we need with nothing but the transaction ID, which will usually be passed to us when we use a wallet like [Hiro's web wallet](https://hirowallet.gitbook.io/developers/bitcoin/sign-transactions/sending-bitcoin) to initiate the Bitcoin transaction.

Let's go through the code we can use to implement this. For full context, this code is taken from the example [bitbadge](https://github.com/kenrogers/bitbadge) repo, which you can take a look at. For a complete ste-by-step walkthrough of how to implement this, check out the [Bitcoin Primer](https://bitcoinprimer.dev).

Here's the mint function:

```clarity
(define-public (mint (recipient principal) (height uint) (tx (buff 1024)) (header (buff 80)) (proof { tx-index: uint, hashes: (list 14 (buff 32)), tree-depth: uint}))
    (let
        (
            (token-id (+ (var-get last-token-id) u1))
            (tx-was-mined (try! (contract-call? .clarity-bitcoin was-tx-mined-compact height tx header proof)))
        )
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        (asserts! (is-eq tx-was-mined true) err-tx-not-mined)
        (try! (nft-mint? bitbadge token-id recipient))
        (var-set last-token-id token-id)
        (ok token-id)
    )
)
```

Note the `(asserts! (is-eq tx-was-mined true) err-tx-not-mined)` line. This is what is doing the heavy lifting.

:::caution Right now the clarity-bitcoin library only supports legacy transactions. Work is in-progress to add support for segwit, but until then we have to do a bit of work on the front end to strip the witness data from the raw transaction hex. :::

Here's the JavaScript code we can use to get the data we need.

First we get the raw transaction and the merkle proof (we do this when we first get the transaction ID back).

The `useEffect` here is so that we can check to see if the transaction was confirmed every 10 seconds before we get the rest of the information.

```javascript
// Effect hook to check and see if the tx has been confirmed using blockstream API
useEffect(() => {
  const intervalId = setInterval(() => {
    const txid = JSON.parse(localStorage.getItem("txid"));
    if (txid) {
      fetch(`https://blockstream.info/testnet/api/tx/${txid}/status`)
        .then((response) => response.json())
        .then(async (status) => {
          // set txStatus in localStorage if it is confirmed, otherwise we want to leave it pending
          if (status.confirmed) {
            localStorage.setItem("txStatus", "confirmed");
            // set the block details
            const blockDetails = {
              block_height: status.block_height,
              block_hash: status.block_hash,
            };
            setBlockDetails(blockDetails);
            localStorage.setItem("blockDetails", JSON.stringify(blockDetails));
            // fetch and set the tx raw
            const rawResponse = await fetch(
              `https://blockstream.info/testnet/api/tx/${txid}/hex`
            );
            const txRaw = await rawResponse.text();
            localStorage.setItem("txRaw", txRaw);
            // fetch and set the merkle proof
            const proofResponse = await fetch(
              `https://blockstream.info/testnet/api/tx/${txid}/merkle-proof`
            );
            const txMerkleProof = await proofResponse.json();
            localStorage.setItem(
              "txMerkleProof",
              JSON.stringify(txMerkleProof)
            );
            clearInterval(intervalId);
          }
        })
        .catch((err) => console.error(err));
    }
  }, 10000);
  return () => clearInterval(intervalId); // Clean up on component unmount
}, []);
```

Then we get and parse the rest of the data when we call the actual mint function.

```javascript
// This function retrieves raw transaction and merkle proof from localStorage and calls the mint Clarity function
const mintBitbadge = async () => {
  // Retrieving rawTx and merkleProof from local storage
  let txRaw = "";
  let txMerkleProof = "";

  if (typeof window !== "undefined") {
    txRaw = removeWitnessData(localStorage.getItem("txRaw"));
    txMerkleProof = JSON.parse(localStorage.getItem("txMerkleProof"));
  }

  // First we need to verify that the sender of this transaction is the same as the user that is signed in
  if (!verifyCorrectSender()) {
    console.log("wrong sender");
    return false;
  }

  const blockHeight = blockDetails.block_height;

  // Fetch the block hash
  const blockHashResponse = await fetch(
    `https://blockstream.info/testnet/api/block-height/${blockHeight}`
  );
  const blockHash = await blockHashResponse.text();

  // Fetch the block header
  const blockHeaderResponse = await fetch(
    `https://blockstream.info/testnet/api/block/${blockHash}/header`
  );
  const blockHeaderHex = await blockHeaderResponse.text();

  const txIndex = txMerkleProof.pos;
  const hashes = txMerkleProof.merkle.map(
    (hash) => bufferCV(hexToBytes(hash).reverse()) // lib needs reversed hashes
  ); // Convert each hash to BufferCV and reverse it

  const functionArgs = [
    principalCV(userData.profile.stxAddress.testnet),
    uintCV(blockHeight),
    bufferCV(Buffer.from(txRaw, "hex")),
    bufferCV(Buffer.from(blockHeaderHex, "hex")),
    tupleCV({
      "tx-index": uintCV(txIndex),
      hashes: listCV(hashes),
      "tree-depth": uintCV(txMerkleProof.merkle.length),
    }),
  ];

  const contractAddress = "ST3QFME3CANQFQNR86TYVKQYCFT7QX4PRXM1V9W6H"; // Replace with your contract address
  const contractName = "bitbadge-v3"; // Replace with your contract name
  const functionName = "mint"; // Replace with your function name

  const options = {
    contractAddress,
    contractName,
    functionName,
    functionArgs,
    appDetails: {
      name: "BitBadge",
      icon: "https://freesvg.org/img/bitcoin.png",
    },
    onFinish: (data) => {
      console.log(data);
    },
  };

  await openContractCall(options);
};
```
