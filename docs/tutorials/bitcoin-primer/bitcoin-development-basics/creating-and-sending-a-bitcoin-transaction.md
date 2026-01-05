# Creating & Sending a Bitcoin Transaction

The first thing we are going to do is list all of our UTXOs using `bitcoin-cli -regtest listunspent`. If you followed the original setup steps from the previous lesson, this will list out a few outputs with 50 bitcoins and our generated address should have 350.

We're going to be creating a transaction to send money to someone else, so we need to generate a new address with `bitcoin-cli -regtest getnewaddress` which will give us a new address to work with.

In my case the new address is `bcrt1q3cwy2hv9qkff8dtn3jgv0fh7rtwdvpu6dmt9pc`, yours will be different.

Now we need to open up a code editor to actually build our transaction.

I'm going to create a new folder called `bitcoin101` and a new file in there called `transaction.json`. This is where we'll build our transaction.

```json
[
    {
        "txid": "9031a74d6a920032d46519a789f7854b996ec7d98e446c3751d24b1df68257fb",
        "vout": 0
    }
]

{
    "bcrt1q3cwy2hv9qkff8dtn3jgv0fh7rtwdvpu6dmt9pc": 49,

}
```

The first item here is the transaction ID that I pulled from our terminal output when we ran `bitcoin-cli -regtest listunspent`. Note that this is represented as the first object in an array. You might get some syntax errors here depending on your code editor, we need to do some work to get this to work with `bitcoin-cli`, but let's keep going for now.

Next, we have an item called `vout` which corresponds to which output of this transaction we are referring to. Since this particular transaction only has one output, we have an index of 0 here, indicating the first (and only in this case) output of this particular transaction.

Finally, we have another JSON object that has a key of a Bitcoin address (this is the address that we generated in the previous step) and the amount of bitcoins we are going to be transferring to this address.

Now we need to wrap each of these sections in quotes to create separate strings from each of them to pass to the CLI.

Then we need to escape the double quotes for the keys and indices of the objects.

Now we need to put it all in one row.

Mine looks like this at the end:

```json
"[{\"txid\": \"9031a74d6a920032d46519a789f7854b996ec7d98e446c3751d24b1df68257fb\",\"vout\": 0}]" "[{\"bcrt1q3cwy2hv9qkff8dtn3jgv0fh7rtwdvpu6dmt9pc\": 49}]"
```

Yes, this is weird and kind of a pain. But now we have two strings representing JSON objects that we can pass to our Bitcoin script. When we work with libraries and layers in future tutorials, we won't need to deal with things like this.

We're just constructing things from scratch for now so you understand how it all works.

Next we need to run the following to create this transaction:

```bash
bitcoin-cli -regtest createrawtransaction "[{\"txid\": \"9031a74d6a920032d46519a789f7854b996ec7d98e446c3751d24b1df68257fb\",\"vout\": 0}]" "[{\"bcrt1q3cwy2hv9qkff8dtn3jgv0fh7rtwdvpu6dmt9pc\": 49}]"
```

And we get back a raw transaction hexadecimal string:

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1679086844200/bf063cba-96ef-46db-a402-c0c5ca9a8a67.png?auto=compress,format\&format=webp)

This contains the inputs we want to use, but it does not give us the unlocking scripts we would need to actually utilize these inputs as an output if we were the recipient.

Before we look at those, let's decode this raw transaction.

We can do that with `bitcoin-cli -regtest decoderawtransaction 0200000001fb5782f61d4bd251376c448ed9c76e994b85f789a71965d43200926a4da731900000000000fdffffff0100111024010000001600148e1c455d85059293b5738c90c7a6fe1adcd6079a00000000`.

That will give us the decoded transaction:

```json
{
  "txid": "f51169cbc1744817ef5ff52a972f241641247b871d55c96d71c00308388cef3a",
  "hash": "f51169cbc1744817ef5ff52a972f241641247b871d55c96d71c00308388cef3a",
  "version": 2,
  "size": 82,
  "vsize": 82,
  "weight": 328,
  "locktime": 0,
  "vin": [
    {
      "txid": "9031a74d6a920032d46519a789f7854b996ec7d98e446c3751d24b1df68257fb",
      "vout": 0,
      "scriptSig": {
        "asm": "",
        "hex": ""
      },
      "sequence": 4294967293
    }
  ],
  "vout": [
    {
      "value": 49.00000000,
      "n": 0,
      "scriptPubKey": {
        "asm": "0 8e1c455d85059293b5738c90c7a6fe1adcd6079a",
        "desc": "addr(bcrt1q3cwy2hv9qkff8dtn3jgv0fh7rtwdvpu6dmt9pc)#4grm02gz",
        "hex": "00148e1c455d85059293b5738c90c7a6fe1adcd6079a",
        "address": "bcrt1q3cwy2hv9qkff8dtn3jgv0fh7rtwdvpu6dmt9pc",
        "type": "witness_v0_keyhash"
      }
    }
  ]
}
```

Notice that we are missing the `scriptSig` field of the input (`vin`)here. We have both an input and an output in this transaction, but our _unlocking_ script is missing, meaning we have no conditions that need to be met in order to use this UTXO. We'll need to create this in the next step so that we set some script that can meet the conditions set by the locking script in `vout`.

We have an input which has no script conditions to be used as an input, but if we look at the `vout` field we do have a `scriptPubKey` which corresponds to the locking script that we need to solve if we want to use this UTXO as an output for a new transaction.

Now we need to sign this transaction by providing the unlocking scripts for the outputs.

We can do this with the CLI by running `bitcoin-cli -regtest signrawtransactionwithwallet 0200000001fb5782f61d4bd251376c448ed9c76e994b85f789a71965d43200926a4da731900000000000fdffffff0100111024010000001600148e1c455d85059293b5738c90c7a6fe1adcd6079a00000000` where we paste in that same raw transaction.

This will give us another raw transaction:

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1679120801109/79ea2274-f303-41cc-b2f1-b8e40e550fb2.png?auto=compress,format\&format=webp)

Let's decode that as well with `bitcoin-cli -regtest decoderawtransaction 02000000000101fb5782f61d4bd251376c448ed9c76e994b85f789a71965d43200926a4da731900000000000fdffffff0100111024010000001600148e1c455d85059293b5738c90c7a6fe1adcd6079a02473044022007edd24d8867fa81ee96e54eb8041443ce84cef346e6039a2c0a055d01e2792302202159c07be4c07e2d1c679cdd4b2f5d3953da3c05845493bff3365b8dbd52ed7b012102f815159d7e6e2d1b2ec6c7c8c9d0863274999d4cfb28b6e6081ed448211fe54700000000`.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1679120829663/1c290909-ecd7-4729-be44-e55ff8819df3.png?auto=compress,format\&format=webp)

We have something important to learn here. Pay attention to the `txinwitness` field here. Notice that the `scriptSig` field is still empty, but now we have something in this new `txinwitness` field.

This is a new script we haven't seen yet, and it has to do with the SegWit update. This new script is a P2WPKH, or pay to witness public key hash. It's very similar to a P2PKH script, except it occurs when a native SegWit wallet wallet sends a UTXO to another SegWit wallet.

The `scriptPubKey`, which is our locking script, also doesn't actually look like a script. It's just a `0` with what looks like an address behind it.

What's going on here?

This P2WPKH transaction actually has all the same information as a P2PKH transaction, but the data is in funky places.

The entire point of SegWit is to "segregate the witness" data (segregated witness) in order to save space taken up by transaction data. The public keys and signatures are what the witness data is composed of, so those get pulled out of the transaction itself in order to decrease the amount of space the transaction takes up.

So where does the data go?

That's where the `txinwitness` field comes in.

These two values are a signature and a public key. The `0` plus long string in the `scriptPubKey` field is the SegWite version plus the public key hash.

You can read more about how this works on a non-SegWit node here, although this is quite rare these days.

A SegWit node just knows to hash the public key in the `txinwitness` field, check that against the already-hashed key in the `scriptPubKey` field, and then finally run `OP_CHECKSIG` against the public key and signature provided in the `txinwitness` data.

Basically, the P2PKH script has been embedded in the core protocol as the default way to process transactions.

Now we need to actually send this transaction.

Remember that due to the way UTXOs work we need to not only send this transaction but we also need to create another transaction to send our change back to ourselves.

Let's first generate a change transaction with `bitcoin-cli -regtest getrawchangeaddress` which gives us a new address.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1679124725931/f8ba5bb8-3d54-4704-a0a6-72c88f87c1cf.png?auto=compress,format\&format=webp)

Now we're going to take that and append it to our previous transaction with the amount of change we want to send back.

```bash
bitcoin-cli -regtest createrawtransaction "[{\"txid\": \"9031a74d6a920032d46519a789f7854b996ec7d98e446c3751d24b1df68257fb\",\"vout\": 0}]" "{\"bcrt1q3cwy2hv9qkff8dtn3jgv0fh7rtwdvpu6dmt9pc\": 49, \"bcrt1q6ktd4t8vwtqww6882v5xk7d3k9a65xqelamqk2\": 0.99}"
```

What we are saying here is that we want to take our UTXO of 50 bitcoins, send 49 to one address, send 0.99 back to ourselves as change, and use the remainder as a transaction fee.

If we run this we get a new raw transaction.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1679125128230/18a958ab-a075-48bf-a950-46f7b09c7355.png?auto=compress,format\&format=webp)

Now we need to sign this with `bitcoin-cli -regtest signrawtransactionwithwallet 0200000001fb5782f61d4bd251376c448ed9c76e994b85f789a71965d43200926a4da731900000000000fdffffff0200111024010000001600148e1c455d85059293b5738c90c7a6fe1adcd6079ac09ee60500000000160014d596daacec72c0e768e753286b79b1b17baa181900000000`.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1679125271728/71942cf4-d62f-4ca7-8431-754505ecdd97.png?auto=compress,format\&format=webp)

And then we copy the hex code and broadcast the transaction with `bitcoin-cli -regtest sendrawtransaction 02000000000101fb5782f61d4bd251376c448ed9c76e994b85f789a71965d43200926a4da731900000000000fdffffff0200111024010000001600148e1c455d85059293b5738c90c7a6fe1adcd6079ac09ee60500000000160014d596daacec72c0e768e753286b79b1b17baa18190247304402201d1e720b1847bd4e020c1f82012917f99a16bddd4e4d053efad03192b510e67a02202ceb0f604c81630628aee1c44152647c836aa66f5e95e83756080810391bc7be012102f815159d7e6e2d1b2ec6c7c8c9d0863274999d4cfb28b6e6081ed448211fe54700000000`.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1679125362966/e23bdf29-2943-451a-b89f-7929fc726b20.png?auto=compress,format\&format=webp)

That gives us a transaction hash. Now we can generate a new block with `bitcoin-cli -regtest -generate 1` and this transaction will be included.

Then we can list our UTXOs with `bitcoin-cli -regtest listunspent` and see the new UTXOs listed at the top.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1679125494985/328c8442-3e95-4841-aa20-f560b42530c7.png?auto=compress,format\&format=webp)

That was a lot. Most of this functionality is handled by whatever wallet software you use. But now you know how transactions are created and sent.

This will come in handy in a future lesson when we need to take an existing transaction and check that it actually occurred. Don't worry though if this was all super complex, the wallet software we'll be using will handle all the heavy lifting of the transaction generation and sending, all we need to do is integrate it with a few lines of JS.
