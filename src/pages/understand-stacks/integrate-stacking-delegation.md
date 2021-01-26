---
title: Integrate Stacking delegation
description: Learn how to add Stacking delegation capabilities to your wallet or exchange
icon: TestnetIcon
experience: advanced
duration: 60 minutes
tags:
  - tutorial
images:
  sm: /images/pages/stacking-rounded.svg
---

## Introduction

In this tutorial, you'll learn how to integrate the Stacking delegation flow by interacting with the respective smart contract, as well as reading data from the Stacks blockchain.

This tutorial highlights the following functionality:

- As an account holder: delegate STX tokens
- As a delegator: Stack STX token on behalf of the account holder
- As a delegator: Commit to Stacking with all delegated STX tokens

## Requirements

First, you'll need to understand the [Stacking delegation mechanism](/understand-stacks/stacking).

You'll also need [NodeJS](https://nodejs.org/en/download/) `12.10.0` or higher to complete this tutorial. You can verify your installation by opening up your terminal and run the following command:

```bash
node --version
```

Finally, you need to have access to at least two accounts (STX account holder and delegator). For testing purposes on the testnet, you can use the CLI to generate them:

```shell
stacks make_keychain -t > account.json
stacks make_keychain -t > delegator.json
```

You can use the faucet to obtain testnet STX tokens for the test account. Replace `<stxAddress>` below with your address:

```shell
curl -XPOST "https://stacks-node-api.testnet.stacks.co/extended/v1/faucets/stx?address=<stxAddress>&stacking=true"
```

## Overview

In this tutorial, we'll implement the Stacking delegation flow laid out in the [Stacking guide](/understand-stacks/stacking#stacking-delegation-flow).

## Step 1: Integrate libraries

Install the stacking, network, transactions libraries and bn.js for large number handling:

```shell
npm install --save @stacks/stacking @stacks/network @stacks/transactions bn.js
```

-> See additional [Stacking library reference](https://github.com/blockstack/stacks.js/tree/master/packages/stacking)

## Step 2: Delegate STX tokens

To get started, delegate STX tokens as an account holder:

```js
import { getNonce } from '@stacks/transactions';
import { StacksTestnet, StacksMainnet } from '@stacks/network';
import { StackingClient } from '@stacks/stacking';
import BN from 'bn.js';

const network = new StacksTestnet();
// for mainnet: const network = new StacksMainnet();
const client = new StackingClient(address, network);

// how much to stack, in microSTX
const amountMicroStx = new BN(100000000000);

// STX address of the delegator
const delegateTo = 'ST2MCYPWTFMD2MGR5YY695EJG0G1R4J2BTJPRGM7H';

// burn height at which the delegation relationship should be revoked (optional)
const untilBurnBlockHeight = 5000;

// a BTC address for reward payouts
const poxAddress = 'mvuYDknzDtPgGqm2GnbAbmGMLwiyW3AwFP';

// private key of the account holder for transaction signing
const privateKey = 'd48f215481c16cbe6426f8e557df9b78895661971d71735126545abddcd5377001';

const delegetateResponse = await client.delegateStx({
  amountMicroStx,
  delegateTo,
  untilBurnBlockHeight, // optional
  poxAddress, // optional
  privateKey,
});

// {
//   txid: '0xf6e9dbf6a26c1b73a14738606cb2232375d1b440246e6bbc14a45b3a66618481',
// }
```

This method calls the [`delegate-stx`](/references/stacking-contract#delegate-stx) method of the Stacking contract.

-> To avoid handling private keys, it is recommended to use the [Stacks Wallet](https://www.hiro.so/wallet) to sign the delegation transaction

## Step 3: Stack STX tokens

With an established delegation relationship, the delegator can stack STX tokens on behalf of the account holder.

```js
// the stacks STX address
const address = 'ST3XKKN4RPV69NN1PHFDNX3TYKXT7XPC4N8KC1ARH';

// block height at which to stack
const burnBlockHeight = 2000;

// the delegator initiates a different client
const delegatorAddress = 'ST22X605P0QX2BJC3NXEENXDPFCNJPHE02DTX5V74';

// number cycles to stack
const cycles = 3;

// delegator private key for transaction signing
const delegatorPrivateKey = 'd48f215481c16cbe6426f8e557df9b78895661971d71735126545abddcd5377001';

// the BTC address for reward payouts; either to the delegator or to the BTC address set by the account holder
const delegatePoxAddress = 'msiYwJCvXEzjgq6hDwD9ueBka6MTfN962Z';

// if you call this method multiple times during the same block, you need to increase the nonce manually
const nonce = getNonce(delegatorAddress, network).add(new BN(1));

const delegatorClient = new StackingClient(delegatorAddress, network);

const delegetateStackResponses = await delegatorClient.delegateStackStx({
  stacker: address,
  amountMicroStx,
  poxAddress: delegatePoxAddress, // if set in step 2, this needs to match `poxAddress`
  burnBlockHeight,
  cycles,
  privateKey: delegatorPrivateKey,
  nonce, // optional
});

//   {
//     txid: '0xf6e9dbf6a26c1b73a14738606cb2232375d1b440246e6bbc14a45b3a66618481',
//   }
```

This function calls the [`delegator-stack-stx`](/references/stacking-contract#delegate-stack-stx) method of the Stacking contract to lock up the STX token from the account holder.
This method must be called until the delegator locked up enough STX tokens required to participate in Stacking.

## Step 4: Commit to Stacking

As soon as pooling is completed and the minimum STX token threshold reached, the delegator needs to confirm participation for the next cycle(s):

```js
// reward cycle id to commit to
const rewardCycle = 12;

const delegetateCommitResponse = await delegatorClient.stackAggregationCommit({
  poxAddress: delegatePoxAddress, // this must be the delegator bitcoin address
  rewardCycle,
  privateKey: privateKeyDelegate,
});

// {
//   txid: '0xf6e9dbf6a26c1b73a14738606cb2232375d1b440246e6bbc14a45b3a66618481',
// }
```

This method calls the [`stack-aggregation-commit`](/references/stacking-contract#stack-aggregation-commit) function of the Stacking contract.

**Congratulations!** With the completion of this step, you successfully learnt how to use the Stacking library to ...

- Delegate STX tokens as an account holder
- Stack STX token on behalf of an account holder
- Commit to Stacking with all delegated STX tokens

## Optional: Revoke delegation rights

Delegators will be able to Stack STX tokens on the account holder's behalf until either the set burn height is reached or the account holder revokes the rights.

To revoke delegation rights, the account holder can call the `revokeDelegatestx` method.

```js
const revokeResponse = await client.revokeDelegateStx(privateKey);

// {
//   txid: '0xf6e9dbf6a26c1b73a14738606cb2232375d1b440246e6bbc14a45b3a66618481',
// }
```

This method calls the [`revoke-delegate-stx`](/references/stacking-contract#revoke-delegate-stx) method of the Stacking contract.

-> To avoid handling private keys, it is recommended to use the [Stacks Wallet](https://www.hiro.so/wallet) to sign the revoke transaction
