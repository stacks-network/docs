# Sending Bitcoin with Leather Wallet

Using Leather's web wallet, we can easily initiate a simple Bitcoin transaction using only a few lines of code.

You'll need to be authenticated with the Leather wallet for this to work, which you can see how to do in the Authentication with Stacks.js tutorial.

Once you have the wallet hooked up, you can use the Leather wallet API to initiate a simple Bitcoin transaction in your JS app like this.

```javascript
const sendBitcoin = async () => {
  const resp = await window.btc?.request("sendTransfer", {
    address: "tb1qya9wtp4dyq67ldxz2pyuz40esvgd0cgx9s3pjl", //replace this with whatever address you want to send to
    amount: "10000", // the amount you want to send denoted in satoshis
  });

  // Storing txid in local storage
  // We'll get back the transaction IF, which we can then use to do whatever we want
  if (typeof window !== "undefined") {
    localStorage.setItem("txid", JSON.stringify(resp.result.txid));
  }

  // We may want to do something once this transaction has confirmed, so we can set it to pending here and then use an API like mempool.space to query the Bitcoin chain for information about this transaction
  localStorage.setItem("txStatus", "pending");
};
```

Then all we would do is hook up our button to call this `sendBitcoin` function.

```javascript
<button onClick={sendBitcoin}>Send Bitcoin</button>
```

You can take a look at the Verifying a transaction on the BTC chain recipe to see a more complex user flow of verifying a transaction was mined using this returned ID as a starting point.

You can take a look at a bit more info about this simple API on the[ wallet developer docs](https://hirowallet.gitbook.io/developers/bitcoin/sign-transactions/sending-bitcoin).
