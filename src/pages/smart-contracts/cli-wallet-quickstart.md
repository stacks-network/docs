---
title: CLI Wallet quickstart
description: Learn how to set up a wallet via the CLI and send/receive STX on the Testnet.
---

## Introduction

This quickstart guide will show you how to setup a Stacks wallet using the Stacks JavaScript CLI and use it to
send/receive Stacks tokens on Testnet. This wallet is intended for developer experimentation with Testnet only, do not use this wallet to store your tokens.

## Prerequisites

You will need to have `npm` installed.

## Installation

To install the Stacks CLI, run the following command in terminal.

`npm install -g @stacks/cli`

## Creating a Wallet

First, we are going to generate a new wallet for Testnet. To generate a wallet use the `make_keychain` command with the `-t` option for Testnet.

```bash
$ stx make_keychain -t

{
  "mnemonic": "private unhappy random runway boil scissors remove harvest fatigue inherit inquiry still before mountain pet tail mad accuse second milk client rebuild salt chase",
  "keyInfo": {
    "privateKey": "381314da39a45f43f45ffd33b5d8767d1a38db0da71fea50ed9508e048765cf301",
    "address": "ST1BG7MHW2R524WMF7X8PGG3V45ZN040EB9EW0GQJ",
    "btcAddress": "n4X37UmRZYk9HawtS1w4xRtqJWhByxiz3c",
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

```bash
$ stx balance ST1BG7MHW2R524WMF7X8PGG3V45ZN040EB9EW0GQJ -t

{
  "balance": "10000",
  "nonce": 0
}
```

By default, using the `-t` flag causes the CLI to connect to the testnet node at `http://testnet-master.blockstack.org:20443`.

To specify a node to connect to, add the `-H` flag followed by the URL of the node `"http://localhost:20443"`. This flag can be used with all commands in this guide.

Verify that your account has tokens before continuing to the next step to send tokens.

Take note that the nonce for the account is `0`. We will be using this number in the next step.

## Sending Tokens

In order to send tokens, we will need the 5 parameters below.

**Recipient Address** - The Stacks address of the recipient

**Amount** - The number of Stacks to send denoted in microstacks (1 STX = 1000000 microstacks)

**Fee Rate** - The transaction fee rate for this transaction. You can safely set a fee rate of 1 for Testnet.

**Nonce** - The nonce is a number that needs to be incremented monotonically for each transaction from the account. This ensures transactions are not duplicated. You can get the latest valid nonce for each account using the `balance` command.

**Private Key** - This is the private key corresponding to your account that was generated when you created the wallet earlier using the CLI.

Once we have the parameters, we can use the `send_tokens` command:

```bash
$ stx send_tokens ST2KMMVJAB00W5Z6XWTFPH6B13JE9RJ2DCSHYX0S7 1000 200 0 381314da39a45f43f45ffd33b5d8767d1a38db0da71fea50ed9508e048765cf301 -t

d32de0d66b4a07e0d7eeca320c37a10111c8c703315e79e17df76de6950c622c
```

With this command we’re sending 1000 microstacks to the Stacks address `ST2KMMVJAB00W5Z6XWTFPH6B13JE9RJ2DCSHYX0S7`.

We set the fee rate to `200` microstacks. If you're not sure how much your transaction will cost. You can add the `-e` flag to estimate the transaction fee needed to get processed by the network, without broadcasting your transaction.

The nonce is set to `0` for this transaction, since it will be the first transaction we send from this account. For subsequent transactions, you will need to increment this number by `1` each time. You can check the current nonce for the account using the `balance` command.

Finally, the last parameter is the private key from earlier. `381314da39a45f43f45ffd33b5d8767d1a38db0da71fea50ed9508e048765cf301`

Once again, we’re using the `-t` option to indicate that this is a Testnet transaction, so it should be broadcasted to Testnet.

If valid, your transaction will now be broadcasted to the network and you will see the transaction ID displayed on the screen.

To view the raw transaction without broadcasting, add the `-x` flag to your command.
