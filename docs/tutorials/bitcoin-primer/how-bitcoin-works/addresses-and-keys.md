# Addresses and Keys

So other than being a node, how do we actually become a Bitcoin user and participate in the network?

And since transactions are just lines of data, what's to stop me from initiating a transaction sending BTC from your address to mine?

This is where addresses and keys come in.

Rather than a traditional web app, where you might be identified by a username or an email address, and authenticate with a password, Bitcoin uses the concept of addresses with public and private keys to establish identities and verify transactions.

Let's see how this works.

Bitcoin identities or accounts or composed of two primary components, a public key and a private key. You can think of a public key as your username, it's publicly visible and is used to establish your identity and separate it from everyone else.

Your private key should not be shared with anyone and this is how you prove that you are the owner of said public key. You can receive bitcoins with a public key, but you can't send them without also having access to the private key.

Public keys are long and unwieldy, so the Bitcoin protocol also generates condensed versions of these called addresses. This is usually how you will interact with other Bitcoin users. Addresses contain a few other neat little tricks that make things easier, Learn Me A Bitcoin has some interesting information on this.

How do these get generated?

The first step is to generate a private key, which is a really big random number in hexadecimal format.

Then we use this private key to generate our public key, which is publicly visible. Since we don't want anyone to be able to determine our private key from our public key, we use a one-way mathematical function to generate this public key.

This is a deterministic function, so anytime we pass our private key into this function, we will get this same public key.

That's how we can authenticate our transactions. Anytime we send out a new transaction, it gets sent out with a lock on it. Remember that all of the bitcoins we own are really just sets of outputs that were sent to us.

Well when they were sent, the sender placed a lock that said that only we can open it, or only this address can open it. And the key we use to open that lock is our private key.

So even though outputs are being broadcast to the entire chain, they are being broadcast with these locks so that only the owners can take them and use them as inputs in new transactions.

Something else that is useful to know is that you can tell what network an address belongs to based on how it begins. Addresses are generated differently depending on their encoding scheme and network.

First, we have two different encoding schemes for addresses, base58 (aka legacy) and bech32.

Base58 mainnet addresses will start with either a '3' or a '1'.

Bech 32 mainnet addresses will start with 'bc'.

Base58 testnet addresses will start with 'm' or '2'.

Bech 32 testnet addresses will start with 'tb'.

Base58 regtest addresses will start with 'm' or '2' (same as testnet).

Bech32 regtest addresses will start with 'bcrt'.

This will come in handy as you are developing to know which network and address type you are working with.

For more on bitcoin addresses, check out a deeper [explainer](https://www.hiro.so/blog/understanding-the-differences-between-bitcoin-address-formats-when-developing-your-app) on the Hiro blog.
