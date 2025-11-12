# Parsing a Bitcoin Transaction

While we can verify that a transaction was mined using a library and Clarity's built-in functions (see the Verifying a transaction on the BTC chain docs), we can also parse a Bitcoin transaction using Clarity directly.

This doesn't require access to the chain — all we need is the raw transaction hex.

If you aren't familiar with how Bitcoin transactions are encoded in raw form, take a quick look at that. The short version is that all of the data from a Bitcoin transaction is encoded in hex form in a string of bytes; we can slice out pieces of that hex value to pull out all of our transaction data.

The process to do this is relatively complex, but the Clarity-Bitcoin library provides a function called `parse-tx` that makes this simple. All we need to do is pass it a raw transaction hex and we get back the data of the transaction, including inputs and outputs.

{% hint style="warning" %}
Note that currently the library only supports legacy transactions. Work to support segwit and taproot transactions is underway.
{% endhint %}

You can view a deployed version of the library on the explorer: https://explorer.hiro.so/txid/0xd493b9ada8899be8773d3f55b21d300ef83ac5c0dd38c8a4dd52a295bd71d539?chain=mainnet

And the GitHub repo here: https://github.com/friedger/clarity-bitcoin

The `parse-tx` function looks like this:

{% code title="parse-tx.clar" %}
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
{% endcode %}

Example raw transaction hex (from a block explorer API like mempool):

`0200000000010196277c04c986c1ad78c909287fd12dba2924324699a0232e0533f46a6a3916bb0100000000ffffffff026400000000000000160014274ae586ad2035efb4c25049c155f98310d7e106ca16440000000000160014599bcef6387256c6b019030c421b4a4d382fe2600247304402204d94a1e4047ca38a450177ccb6f88585ca147f1939df343d8ac5d962c5f35bb302206f7fa42c21c47ebccdc460393d35c5dfd3b6f0a26cf10fac23d3e6fab71835c20121020cb972a66e3fb1cdcc9efcad060b4457ebec534942700d4af1c0d82a33aa13f100000000`

You can paste this into a raw transaction decoder like this one to inspect the decoded fields: https://live.blockcypher.com/btc/decodetx/

If using stacks.js, pass the raw hex to your Clarity function as a buffer like this:

{% code title="JavaScript (stacks.js)" %}
```javascript
bufferCV(Buffer.from(txRaw, "hex"));
```
{% endcode %}

Where `txRaw` is a string containing the raw transaction hex. Passing that buffer into `parse-tx` returns the parsed transaction object with version, inputs (ins), outputs (outs), and locktime. You can then extract whatever fields you need from that returned data.

{% stepper %}
{% step %}
### Get the raw transaction hex

Obtain the raw transaction hex from a Bitcoin block explorer API (for example, mempool or blockcypher). This is a single hex string representing the entire transaction.
{% endstep %}

{% step %}
### Pass the hex into Clarity-Bitcoin's parser

Convert the hex string to a buffer and pass it to the `parse-tx` function (via your Stacks/Clarity call). In stacks.js:

`bufferCV(Buffer.from(txRaw, "hex"));`
{% endstep %}

{% step %}
### Use the parsed result

`parse-tx` returns an object containing:

* version
* ins (transaction inputs)
* outs (transaction outputs)
* locktime

Extract whatever fields you need from that returned object.
{% endstep %}
{% endstepper %}
