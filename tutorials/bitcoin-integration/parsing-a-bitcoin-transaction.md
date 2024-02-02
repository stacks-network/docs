# Parsing a Bitcoin Transaction

While we can verify that a transaction was mined using a library and Clarity's built-in functions, as outlined in the Verifying a transaction on the BTC chain docs, we can parse a Bitcoin transaction using Clarity as well.

This doesn't actually require having access to the chain, all we need is the raw transaction hex.

If you aren't familiar with how Bitcoin transactions are encoded in raw form, take a quick look at that.

The short version is that all of the data from a Bitcoin transaction is encoded in hex form in a string of numbers, we can slice out pieces of that hex value to pull out all of our transaction data.

The process to do this is relatively complex, but the Clarity-Bitcoin library comes with a function called `parse-tx` that makes this simple.

All we need to do is pass it a raw transaction hex and we can get back the data of the transaction, including inputs and outputs.

:::caution Note that currently the library only supports legacy transactions, although work to support segwit and taproot transactions is currently underway. :::

You can view a [deployed version of the library](https://explorer.hiro.so/txid/0xd493b9ada8899be8773d3f55b21d300ef83ac5c0dd38c8a4dd52a295bd71d539?chain=mainnet) on the explorer and the [GitHub repo here](https://github.com/friedger/clarity-bitcoin).

The `parse-tx` function looks like this.

```clarity
(define-read-only (parse-tx (tx (buff 1024)))
    (let ((ctx { txbuff: tx, index: u0})
          (parsed-version (try! (read-uint32 ctx)))
          (parsed-txins (try! (read-txins (get ctx parsed-version))))
          (parsed-txouts (try! (read-txouts (get ctx parsed-txins))))
          (parsed-locktime (try! (read-uint32 (get ctx parsed-txouts)))))
     (ok {version: (get uint32 parsed-version),
          ins: (get txins parsed-txins),
          outs: (get txouts parsed-txouts),
          locktime: (get uint32 parsed-locktime)})))
```

We can get the raw transaction hex from a Bitcoin block explorer API like mempool, and it will be returned back to use looking something like this:

`0200000000010196277c04c986c1ad78c909287fd12dba2924324699a0232e0533f46a6a3916bb0100000000ffffffff026400000000000000160014274ae586ad2035efb4c25049c155f98310d7e106ca16440000000000160014599bcef6387256c6b019030c421b4a4d382fe2600247304402204d94a1e4047ca38a450177ccb6f88585ca147f1939df343d8ac5d962c5f35bb302206f7fa42c21c47ebccdc460393d35c5dfd3b6f0a26cf10fac23d3e6fab71835c20121020cb972a66e3fb1cdcc9efcad060b4457ebec534942700d4af1c0d82a33aa13f100000000`.

You can paste this into a raw transaction decoder like [this one](https://live.blockcypher.com/btc/decodetx/) and see the data.

If we were using stacks.js, we would just need to pass this to our function as a buffer like this:

```javascript
bufferCV(Buffer.from(txRaw, "hex"));
```

Where `txRaw` is just a string containing our raw transaction. When we do that, we are presented with the data of the transaction.

We can then take that data and pull out whatever we need from it.
