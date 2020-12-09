---
title: Stacking using the Stacks CLI
description: Learn how use the Stacks CLI to participate in stacking
experience: beginner
duration: 10 minutes
tags:
  - guide
images:
  sm: /images/pages/stacking-rounded.svg
---

## Introduction

!> The Stacking implementation is still in development and could change in the coming weeks

In this guide, you'll learn how to use the Stacks CLI to participate in stacking. The CLI is a great way to quickly try out stacking on testnet. To integrate stacking into your application, see the [stacking integration guide](/stacks-blockchain/integrate-stacking).

## Requirements

First, you'll need to understand the [Stacking mechanism](/stacks-blockchain/stacking).

You'll also need [NodeJS](https://nodejs.org/en/download/) `12.10.0` or higher to complete this tutorial. You can verify your installation by opening up your terminal and run the following command:

```bash
$ node --version
```

You will also need to install the Stacks CLI from NPM:

```bash
$ npm install @stacks/cli -g
```

## Generate A New Key Pair

```bash
$ stx make_keychain -t
{
  "mnemonic": "turn food juice small swing junior trip crouch slot wood nephew own tourist hazard tomato follow trust just project traffic spirit oil diary blue",
  "keyInfo": {
    "privateKey": "dca82f838f6e5a893cffc8efe861196252373a5b8b62c0b55ba3a0a7a28795d301",
    "address": "ST1P3HXR80TKT48TKM2VTKCDBS4ET9396W0W2S3K8",
    "btcAddress": "mqPBWmSGJhrA9x5XJC6qJtFsHnudqZ2XJU",
    "index": 0
  }
}
```

We'll be using this testnet key pair to perform stacking. But first we'll need to get some testnet tokens.

-> If you're stacking on mainnet, make sure you have an account with sufficient number of Stacks tokens to participate.

## Get Testnet Tokens Using The Faucet

Use the following `curl` command to request tokens from the testnet node's faucet endpoint.

Note that we used the address we generated above as a parameter.

```bash
curl -X POST https://stacks-node-api.xenon.blockstack.org/extended/v1/faucets/stx?address=ST1P3HXR80TKT48TKM2VTKCDBS4ET9396W0W2S3K8
```

## Check Balance

Confirm that the faucet transaction has completed by checking the balance of your address. The `-t` flag is used to indicate testnet.

```bash
stx balance ST1P3HXR80TKT48TKM2VTKCDBS4ET9396W0W2S3K8 -t
{
  "balance": "90000000000000",
  "locked": "0",
  "unlock_height": 0,
  "nonce": 0
}
```

## Check Stacking Eligibility

Before we send the stacking transaction, we will need to check if we're eligible for stacking.

This check ensure that we meet the minimum threshold amount of STX required in order to participate in stacking.

The arguments required for the `can_stack` command are:

1. Amount to stack in microstacks, we'll use the entire balance in our account.
   90000000000000

2. Number of reward cycles to lock up your tokens for stacking, we'll use 10 here.
   10

3. BTC address to receive stacking rewards. We can use any valid BTC address.
   mqkccNX5h7Xy1YUku3X2fCFCC54x6HEiHk

4. The address that we will be stacking with. We'll use the address generated previously.
   ST1P3HXR80TKT48TKM2VTKCDBS4ET9396W0W2S3K8

```bash
stx can_stack 90000000000000 10 mqkccNX5h7Xy1YUku3X2fCFCC54x6HEiHk ST1P3HXR80TKT48TKM2VTKCDBS4ET9396W0W2S3K8 -t
{ eligible: true }
```

If we meet the conditions to participate in stacking, the command will return true.

## Stacking

Next, we will perform the stacking transaction using the `stack` command.

We need the following 4 arguments:

1. Amount to stack in microstacks.
   90000000000000

2. Number of reward cycles to lock up your tokens for stacking.
   10

3. BTC address to receive stacking rewards. This is also referred to as the PoX address.
   mqkccNX5h7Xy1YUku3X2fCFCC54x6HEiHk

4. The private key to the address we're stacking with, which we generated previously.
   dca82f838f6e5a893cffc8efe861196252373a5b8b62c0b55ba3a0a7a28795d301

```bash
stx stack 90000000000000 10 mqkccNX5h7Xy1YUku3X2fCFCC54x6HEiHk dca82f838f6e5a893cffc8efe861196252373a5b8b62c0b55ba3a0a7a28795d301
{
  txid: '0x2e33ad647a9cedacb718ce247967dc705bc0c878db899fdba5eae2437c6fa1e1',
  transaction: 'https://testnet-explorer.blockstack.org/txid/0x2e33ad647a9cedacb718ce247967dc705bc0c878db899fdba5eae2437c6fa1e1'
}
```

If the commands completes successfully, we'll get back a TXID and a URL to the block explorer showing the transaction status.

Now we should wait until the transaction is confirmed. This usually takes a few minutes.

## Checking Stacking Status

Once the transaction has been confirmed, we can check the stacking status using the `stacking_status` command:

```bash
stx stacking_status ST1P3HXR80TKT48TKM2VTKCDBS4ET9396W0W2S3K8 -t
{
  amount_microstx: '90000000000000',
  first_reward_cycle: 25,
  lock_period: 10,
  unlock_height: 3960,
  pox_address: {
    version: '00',
    hashbytes: '05cf52a44bf3e6829b4f8c221cc675355bf83b7d'
  }
}
```

Here we can see how many microstacks are locked and when they will unlock.
