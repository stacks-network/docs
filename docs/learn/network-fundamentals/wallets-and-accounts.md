# Wallets & Accounts

<div data-with-frame="true"><figure><img src="../.gitbook/assets/Frame 316126255.jpg" alt=""><figcaption></figcaption></figure></div>

{% hint style="info" %}
For the technical breakdown and standard for how wallets/accounts are generated in Stacks, check out [**SIP-005 standard**](https://github.com/stacksgov/sips/blob/main/sips/sip-005/sip-005-blocks-and-transactions.md) that outlines all of this.
{% endhint %}

### Introduction

Stacks wallets are software or hardware tools for storing cryptocurrencies, NFTs, and other digital assets. They are also used for establishing on-chain identity in decentralized applications (dApps). These wallets cryptographically store and manage each user’s identity and funds through a single blockchain address, which leverage public-key cryptography.&#x20;

#### Purpose of a Stacks wallet

* Establish User Identity
* Store Assets
* Display Balances
* Sign Transactions
* Sign Messages
* Participate in the Bitcoin Economy

Wallets in Stacks consists of accounts, which uses an accounts-based model, rather than a UTXO model like Bitcoin. This model is simpler than the UTXO model and has a more traditional concept of “balance”, similar to what you would encounter at a bank. In this model, each address has a single “balance” figure for a given token that increases/decreases as transactions are sent to/from that account. This is what most Web3 ecosystems use. In a UTXO model, the network operates as a ledger, with each UTXO being analogous to a cash bill.

#### Components of a Stacks account

* **Private Key** - The private key is an alphanumeric code that is paired to a single public key on a 1:1 basis. Never share your private key with anyone. A private key is how you prove ownership of a public key and how you can spend assets held by that particular key-pair.\
  \
  Example private key in Stacks (32 bytes appended with a 0x01 byte):\
  `5a4133fec2cf923d37238d3ba2fcd2ee9c8dce882c22218fd210d8a02ceb2c7401`
* **Public Key** - The public key is derived mathematically from the private key. It can be shared safely and is used by the network to verify signatures created by the private key, without revealing the private key itself.\
  \
  Example public key in Stacks (compressed format):\
  `02e8eb87862945d369511fdcce326ffef9a01b68c7d070e3ce685a5cbb9b1ecfc5`
* **Address (Principal)** - The address is a shorter, user-friendly representation derived from the public key. It’s what you share to receive sBTC, STX, tokens, or NFTs on Stacks, and it acts as the on-chain identifier for the user.\
  \
  Example public address in Stacks (c32check encoding):\
  `SPM9G3CNGSCTB4956290NESM0MR9W9CCEPVEPSQC`

{% hint style="info" %}
The private/public key generation uses the cryptographic **secp256k1** curve.

The cryptographic signature algorithm used in Stacks is **ECDSA** over **secp256k1**.
{% endhint %}

Stacks accounts are entities that own assets, like Stacks (STX) tokens. An account has an address, private key, nonce, and one or more asset balances. Assets cannot leave an account without an action from the account owner. All changes to assets (and the balances of the account) require a corresponding transaction.

All Stacks wallets also support Bitcoin addresses, enabling seamless participation across both the Stacks and Bitcoin ecosystems.

***

### Creation

An wallet's accounts are generated from a 24-word mnemonic phrase conforming to the BIP39 standard. This is often referred to as the **seed phrase**. The seed phrase provides access to Stacks accounts.

{% hint style="danger" %}
If the seed phrase is lost, access to the associated account cannot be restored. No person or organization can recover a lost seed phrase.
{% endhint %}

The easiest way to generate a new Stacks account is to use the [Stacks CLI](https://github.com/stx-labs/stacks.js/tree/master/packages/cli):

{% code title="Generate a new account (CLI)" %}
```bash
# install CLI globally
npm install --global @stacks/cli

# generate a new account and store details in a new file

# '-t' option makes this a testnet account
stx make_keychain -t > cli_keychain.json
```
{% endcode %}

`make_keychain` creates the following file:

```js
{
  "mnemonic": "aaa bbb ccc ddd ...",
  "keyInfo": {
    "privateKey": "5a3f1f15245bb3fb...",
    "address": "STJRM2AMVF90ER6G3RW1QTF85E3HZH37006D5ER1",
    "btcAddress": "biwSd6KTEvJcyX2R8oyfgj5REuLzczMYC1",
    "wif": "L4HXn7PLmzoNW...",
    "index": 0
  }
}
```

{% hint style="info" %}
Check out the [Stacks CLI reference](https://docs.hiro.so/references/stacks-cli) for more details
{% endhint %}

| Field                | Description                                                                                                                                                        |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `mnemonic`           | A 24-word seed phrase used to access the account, generated using [BIP39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki) with 256 bits of entropy |
| `keyInfo.privateKey` | Private key for the account. Required for token transfers and often referred to as `senderKey`                                                                     |
| `keyInfo.address`    | Stacks address for the account                                                                                                                                     |
| `keyInfo.btcAddress` | Corresponding BTC address for the account.                                                                                                                         |
| `keyInfo.wif`        | Private key of the btcAddress in compressed format.                                                                                                                |
| `keyInfo.index`      | Nonce for the account, starting at 0                                                                                                                               |

Note that a new account automatically exists for each new private key. There is no need to manually instantiate an account on the Stacks blockchain.

{% hint style="info" %}
Addresses are created by generating the [RIPEMD-160 hash](https://en.wikipedia.org/wiki/RIPEMD#RIPEMD-160_hashes) of the [SHA256](https://en.bitcoinwiki.org/wiki/SHA-256) of the public key. BTC addresses are encoded with [Base58Check](https://bitcoin.it/wiki/Base58Check_encoding). For Stacks addresses, [c32check](https://github.com/stacks-network/c32check) is used. Deriving an address from a public key can be done without internet access, for instance using the c32check `c32addressDecode` method.
{% endhint %}

Alternatively to the CLI creation, the [Stacks Transactions JS](https://github.com/stx-labs/stacks.js/tree/master/packages/transactions) library can be used:

{% code title="Generate a private key & derive address (transactions library)" %}
```js
import {
  makeRandomPrivKey,
  privateKeyToString,
  getAddressFromPrivateKey,
  TransactionVersion,
  getPublicKey,
} from "@stacks/transactions";

const privateKey = makeRandomPrivKey();

// Get public key from private
const publicKey = getPublicKey(privateKey);

const stacksAddress = getAddressFromPrivateKey(
  privateKeyToString(privateKey),
  TransactionVersion.Testnet // remove for Mainnet addresses
);
```
{% endcode %}

Finally, you can generate new account using a Stacks-enabled wallet like [Leather](https://leather.io/), [Xverse](https://www.xverse.app/), or [Asigna](https://asigna.io/).

***

### Handling different formats

It's common for new Stacks developers to get tripped up on the different ways when specifying Stacks' principals (aka addresses) in their development.

Here's a breakdown of dealing with principals in 3 different use cases.

<div data-with-frame="true"><figure><img src="../.gitbook/assets/handling-principal-formats.jpeg" alt=""><figcaption></figcaption></figure></div>

***

### The Stacks and Bitcoin address connection

What makes Stacks beautifully connected to its L1 settlement layer, Bitcoin, is their many shared aspects. One being how both utilize a similar address generation scheme based on the P2PKH format, which allows for both a Bitcoin & Stacks address to share the same public key hash. If you base58check decode a legacy bitcoin address, you can reveal the public key hash, which can then be used to generate its respective c32check encoded Stacks address.

Programmatically, you could also use a method called `b58ToC32`, from the `c32check` javascript library, which can abstract the conversion for you.

<div data-with-frame="true"><figure><img src="../.gitbook/assets/bitcoin-stacks-address-connection.jpeg" alt=""><figcaption></figcaption></figure></div>

***

### Additional Resources

* \[[Hiro Blog](https://www.hiro.so/blog/understanding-the-differences-between-bitcoin-address-formats-when-developing-your-app)] Understanding the Differences Between Bitcoin Address Formats When Developing Your App
* \[[Hiro Blog](https://www.hiro.so/blog/how-every-stacks-address-has-a-corresponding-bitcoin-address)] How Every Stacks Address Has a Corresponding Bitcoin Address&#x20;
* \[[Hiro Blog](https://www.hiro.so/blog/an-intro-to-web3-wallets-for-web3-founders)] An Intro to Web3 Wallets for Web3 Founders
* \[[Hiro Blog](https://www.hiro.so/blog/why-web3-needs-bitcoin-centric-wallet-standards)] Why Web3 Needs Bitcoin-Centric Wallet Standards
