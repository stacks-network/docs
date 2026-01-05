---
icon: seedling
---

# Bitcoin Development Basics

In the last sections, we talked about why now is an excellent time for developers to start building on Bitcoin and how Bitcoin works. Now we're going to start applying some of that knowledge and get started programming.

We're going to start by looking at the fundamentals of Bitcoin scripting and how Bitcoin transactions are constructed. Along the way, you'll learn important fundamentals about how Bitcoin works, but you'll also begin to see the major drawbacks of trying to build with only Bitcoin.

We're going to start off in this module by utilizing the command line to get Bitcoin set up on our local machine and begin working with it.

The first thing we need to do is get Bitcoin set up on our machine. Start by [downloading Bitcoin Core](https://bitcoin.org/en/bitcoin-core/).

<figure><img src="https://lwfiles.mycourse.app/635fe723662899c6bfb19e1d-public/363e23022af117cdd932b0f3cadfe860.jpeg" alt=""><figcaption></figcaption></figure>

Once it's installed you'll want to run `bitcoind`, which is the CLI we use to actually run Bitcoin.

Note that you don't need to run and download a full node in order to follow along here. We can run Bitcoin is `regtest` mode in order to create our own localized private Bitcoin network.

You can do that by running `bitcoind -regtest -daemon` which will run a regtest version of Bitcoin in the background as a daemon.

The next thing you need to familiarize yourself with is the Bitcoin CLI.

The first thing we are going to do is generate some new blocks and send the block reward to a new address that we'll generate.

We can do that with `bitcoin-cli -regtest generatetoaddress 101 $(bitcoin-cli -regtest getnewaddress)`

Here were telling the CLI to enter regtest mode, then generate 101 new blocks and send the block reward to the provided address, which in this case is a script to generate a new address using the CLI.

An array of the generated block hashes will be returned to us.

<figure><img src="https://lwfiles.mycourse.app/635fe723662899c6bfb19e1d-public/8700e9c212639634619e84ad5deda276.jpeg" alt=""><figcaption></figcaption></figure>

Now we can see the list of UTXOs we have created:

`bitcoin-cli -regtest listunspent`

And get the balance of our newly generated address:

`bitcoin-cli -regtest getbalance`

Alright we now have Bitcoin running locally and have a basic understanding of how to interact with it. Let's pause and take a look at how Bitcoin Script works before coming back and using the CLI to create some transactions.
