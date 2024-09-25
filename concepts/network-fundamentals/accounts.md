# Accounts

### Introduction

Stacks uses an accounts-based model, more similar to Ethereum, rather than a [UTXO](https://learnmeabitcoin.com/technical/transaction/utxo/) model like Bitcoin. In a UTXO model, the network operates as a ledger, with each UTXO being analagous to a cash bill.

With an accounts-based model, each account is associated with a balance and that balance can be added to or subtracted from.

Stacks accounts are entities that own assets, like Stacks (STX) tokens. An account has an address, private key, nonce, and one or more asset balances.

{% hint style="info" %}
The cryptographic signature algorithm used in Stacks is [**secp256k1**](https://en.bitcoinwiki.org/wiki/Secp256k1).

Additionally, [Ed25519](https://ed25519.cr.yp.to/) is also used just for the VRF (Verifiable Random Function).
{% endhint %}

Assets cannot leave an account without an action from the account owner. All changes to assets (and the balances of the account) require a corresponding transaction.

{% hint style="info" %}
The transaction type doesn't need to be a token transfer - contract deploy and contract call transactions can change the balances of an account
{% endhint %}

### Creation

An account is generated from a 24-word mnemonic phrase. This is often referred to as the **seed phrase**. The seed phrase provides access to Stacks accounts.

{% hint style="danger" %}
If the seed phrase is lost, access to the associated account cannot be restored. No person or organization can recover a lost seed phrase.
{% endhint %}

The easiest way to generate a new Stacks account is to use the [Stacks CLI](https://github.com/hirosystems/stacks.js/tree/master/packages/cli):

```bash
# install CLI globally
npm install --global @stacks/cli

# generate a new account and store details in a new file
# '-t' option makes this a testnet account
stx make_keychain -t > cli_keychain.json
```

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
Addresses are created by generating the [RIPEMD-160 hash](https://en.wikipedia.org/wiki/RIPEMD#RIPEMD-160\_hashes) of the [SHA256](https://en.bitcoinwiki.org/wiki/SHA-256) of the public key. BTC addresses are encoded with [Base58Check](https://en.bitcoin.it/wiki/Base58Check\_encoding). For Stacks addresses, [c32check](https://github.com/stacks-network/c32check) is used. Deriving an address from a public key can be done without internet access, for instance using the c32check `c32addressDecode` method.
{% endhint %}

Alternatively to the CLI creation, the [Stacks Transactions JS](https://github.com/hirosystems/stacks.js/tree/master/packages/transactions) library can be used:

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

Finally, you can generate new account using a Stacks-enabled wallet like [Leather](https://leather.io/), [Xverse](https://www.xverse.app/), or [Asigna](https://asigna.io/).
