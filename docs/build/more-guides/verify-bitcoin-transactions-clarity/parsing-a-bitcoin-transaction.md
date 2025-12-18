# Parsing a Bitcoin Transaction

### Intro

While we can verify that a transaction was mined using the `clarity-bitcoin-lib` contract library, we can also parse a Bitcoin transaction using Clarity directly.

If you aren't familiar with how Bitcoin transactions are encoded in raw form, take a quick look at that. The tl;dr is that all of the data from a Bitcoin transaction is encoded in hexadecimal form in a string of bytes; we can slice out pieces of that hex value to pull out all of our transaction data components.

The process to do this is relatively complex, but the `clarity-bitcoin-lib` provides a function called `parse-tx` or `parse-wtx` (for witness transactions) that makes this simple. All we need to do is pass in a raw transaction hex and we get back the data of the transaction, including inputs and outputs.

{% hint style="info" %}
The current version of the `clarity-bitcoin-lib` is version 7. Click [here](https://explorer.hiro.so/txid/0xe433b35e95acfd24595e601860b4240cfaacd689ae7e7938a80c5505f186516b) for the deployed mainnet contract.
{% endhint %}

The `parse-tx` function of the `clarity-bitcoin-lib` contract looks like this:

{% code title="clarity-bitcoin-lib" %}
```clarity
;; --snip--

(define-read-only (parse-tx (tx (buff 4096)))
  (let (
      (ctx {
        txbuff: tx,
        index: u0,
      })
      (parsed-version (try! (read-uint32 ctx)))
      (parsed-txins (try! (read-txins (get ctx parsed-version))))
      (parsed-txouts (try! (read-txouts (get ctx parsed-txins))))
      (parsed-locktime (try! (read-uint32 (get ctx parsed-txouts))))
    )
    ;; check if it is a non-segwit transaction?
    ;; at least check what happens
    (asserts! (is-eq (len tx) (get index (get ctx parsed-locktime)))
      (err ERR-LEFTOVER-DATA)
    )
    (ok {
      version: (get uint32 parsed-version),
      ins: (get txins parsed-txins),
      outs: (get txouts parsed-txouts),
      locktime: (get uint32 parsed-locktime),
    })
  )
)
```
{% endcode %}

Where `txRaw` is a string containing the raw transaction hex. Passing that buffer into `parse-tx` returns the parsed transaction object with version, inputs (ins), outputs (outs), and locktime. You can then extract whatever fields you need from that returned data.

***

### Steps

{% stepper %}
{% step %}
#### Get the raw transaction hex

Obtain the raw transaction hex from a Bitcoin explorer API. This is a single hex string representing the entire transaction.

Example raw bitcoin transaction hex:

`0200000000010196277c04c986c1ad78c909287fd12dba2924324699a0232e0533f46a6a3916bb0100000000ffffffff026400000000000000160014274ae586ad2035efb4c25049c155f98310d7e106ca16440000000000160014599bcef6387256c6b019030c421b4a4d382fe2600247304402204d94a1e4047ca38a450177ccb6f88585ca147f1939df343d8ac5d962c5f35bb302206f7fa42c21c47ebccdc460393d35c5dfd3b6f0a26cf10fac23d3e6fab71835c20121020cb972a66e3fb1cdcc9efcad060b4457ebec534942700d4af1c0d82a33aa13f100000000`

{% hint style="info" %}
You can paste this into a raw transaction decoder like this one to inspect the decoded fields: [https://live.blockcypher.com/btc/decodetx/](https://live.blockcypher.com/btc/decodetx/)
{% endhint %}
{% endstep %}

{% step %}
#### Pass the transaction hex into Clarity-Bitcoin's parser

Convert the hex string to a Clarity buffer and pass it to the `parse-tx` function (via your stack.js read-only function call). In stacks.js:

If using stacks.js, pass the raw hex to your Clarity function as a Clarity typed buffer:

<pre class="language-javascript" data-title="JavaScript (stacks.js)"><code class="lang-javascript">import {
  fetchCallReadOnlyFunction,
  bufferCV,
} from "@stacks/transactions"
import { hexToBytes } from "@stacks/common"

let txRaw = '&#x3C;raw-transaction-hex>'

// Data of read-only function of below clarity-bitcoin-lib contract:
const contractAddress = "SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9"
const contractName = "clarity-bitcoin-lib-v7"
const functionName = "parse-tx"

// Calling clarity read-only function
let result = await fetchCallReadOnlyFunction({
  contractAddress,
  contractName,
  functionName,
<strong>  functionArgs: [bufferCV(Buffer.from(txRaw, "hex"))],
</strong>  network: 'mainnet',
  // this could be any principal address
  senderAddress: 'SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRCBGD7R'
})
</code></pre>
{% endstep %}

{% step %}
#### Examine and use the parsed result

`parse-tx` returns an object containing:

* version
* ins (transaction inputs)
* outs (transaction outputs)
* locktime

Extract whatever fields you need from that returned object.
{% endstep %}
{% endstepper %}

***

### Example Usage

#### Square Runes

A Clarity implementation for parsing Bitcoin Runes protocol data, allowing Stacks smart contracts to understand and react to Runes transactions on the Bitcoin chain.

Check out the project repo [here](https://github.com/Rapha-btc/square-runes).

<pre class="language-clarity" data-title="runes-capsule.clar" data-expandable="true"><code class="lang-clarity">;; --snip--

;; ============================================
;; PARSING HELPERS (using runes-decoder)
;; ============================================

;; Parse OP_RETURN from tx buffer using the runes-decoder library
(define-read-only (parse-deposit-opreturn (tx-buff (buff 4096)))
  (let (
      (output0 (unwrap! (get-output-at-index tx-buff u0) (err u500)))
      (script (get scriptPubKey output0))
    )
    ;; decode-any-runestone is more generic - handles Tag 0, 11, 22
    (contract-call? .runes-decoder decode-any-runestone script)
  )
)

;; Get output at specific index from parsed tx
;; is this different for legacy Rafa?
(define-read-only (get-output-at-index (tx (buff 4096)) (index uint))
  (let (
      (parsed-tx (contract-call?
<strong>        'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.clarity-bitcoin-lib-v7
</strong><strong>        parse-wtx tx false
</strong>      ))
    )
    (match parsed-tx
      result (let (
          (outs (get outs result))
          (out (unwrap! (element-at? outs index) (err u502)))
        )
        (ok {
          scriptPubKey: (get scriptPubKey out),
          value: (get value out)
        })
      )
      error (err u503) ;; missing
    )
  )
)
</code></pre>
