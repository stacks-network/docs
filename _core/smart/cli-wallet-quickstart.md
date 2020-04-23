---
layout: smart
description: "Blockstack CLI Wallet Quickstart"
permalink: /:collection/:path.html
---
# Send/Receive Stacks on Testnet

This quickstart guide will show you how to setup a Stacks wallet using the Blockstack JavaScript CLI and use it to send/receive Stacks tokens on Testnet. This wallet is intended for developer experimentation with Testnet only, do not use this wallet to store your tokens.

## Prerequisites

You will need to have `npm` installed.

## Installation

To install the Blockstack CLI, run the following command in terminal. 

`npm install -g https://github.com/blockstack/cli-blockstack#feature/stacks-2.0-tx` 

## Creating a Wallet

First, we are going to generate a new wallet for Testnet. To generate a wallet use the `make_keychain` command with the `-t` option for Testnet.

```
$ blockstack-cli make_keychain -t

{
  "mnemonic": "private unhappy random runway boil scissors remove harvest fatigue inherit inquiry still before mountain pet tail mad accuse second milk client rebuild salt chase",
  "keyInfo": {
    "privateKey": "381314da39a45f43f45ffd33b5d8767d1a38db0da71fea50ed9508e048765cf301",
    "address": "ST1BG7MHW2R524WMF7X8PGG3V45ZN040EB9EW0GQJ",
    "index": 0
  }
}
```

The mnemonic is your 24 word seed phrase which you should back up securely if you want access to this wallet again in the future. Once lost, it cannot be recovered. 

The Stacks address associated with this wallet is: 
`ST1BG7MHW2R524WMF7X8PGG3V45ZN040EB9EW0GQJ`

Note that this is a Testnet address for use with Testnet only. You will use this address to receive tokens from the Testnet faucet or other people.

The private key is what you will need to send tokens later. 

## Getting Tokens

To receive Testnet Stacks tokens, visit the Testnet stacks token [faucet](https://testnet.blockstack.org/faucet). Enter the Stacks address you generated above into the address field on the faucet page and click "Get STX".

Once the faucet transaction has been broadcasted, you will need to wait for the balance to be reflected in your account.

## Checking Balance

Once you’ve requested Testnet Stacks tokens from the faucet, you can check the balance of your account using the following command. 

```
$ blockstack-cli balance ST1BG7MHW2R524WMF7X8PGG3V45ZN040EB9EW0GQJ -H "https://neon.blockstack.org"

{
  "balance": "1000",
  "nonce": 0
}
``` 

Using the `-H` option, we specify a connection to the testnet node at `https://neon.blockstack.org`

Verify that your account has tokens before continuing to the next step to send tokens.

## Sending Tokens

In order to send tokens, we will need the 5 parameters below.

**Recipient Address** - The Stacks address of the recipient

**Amount** - The number of Stacks to send denoted in microstacks (1 STX = 1000000 microstacks)

**Fee Rate** - The transaction fee rate for this transaction. You can safely set a fee rate of 1 for Testnet.

**Nonce** - The nonce is a number that needs to be incremented monotonically for each transaction from the account. This ensures transactions are not duplicated. You can get the latest valid nonce for each account using the `balance` command.

**Private Key** - This is the private key corresponding to your account that was generated when you created the wallet earlier using the CLI.

Once we have the parameters, we can use the  `send_tokens` command:

```
$ blockstack-cli send_tokens ST1WZ69T99RHQMQX3D91ZH2R37GV5NK8KDS5D5VDZ 1000 1 0 381314da39a45f43f45ffd33b5d8767d1a38db0da71fea50ed9508e048765cf301 -t -T "https://neon.blockstack.org"

d32de0d66b4a07e0d7eeca320c37a10111c8c703315e79e17df76de6950c622c
```    

With this command we’re sending 1000 microstacks to the Stacks address `ST1WZ69T99RHQMQX3D91ZH2R37GV5NK8KDS5D5VDZ`. 

We set the fee rate to `1`, as this does not matter for Testnet. 

The nonce is set to `0` for this transaction, since it will be the first transaction we send from this account. 

Finally, the last parameter is the private key from earlier. `381314da39a45f43f45ffd33b5d8767d1a38db0da71fea50ed9508e048765cf301` 

Once again, we’re using the `-t` option to indicate that this is a Testnet transaction, so it should be broadcasted to Testnet.

Using the `-T` option, we specify that we want to broadcast to the testnet node at `https://neon.blockstack.org`

If valid, your transaction will now be broadcasted to the network and you will see the transaction ID displayed on the screen.

