---
title: Integrate Stacking
description: Learn how to add Stacking capabilities to your wallet or exchange
experience: advanced
duration: 60 minutes
tags:
  - tutorial
images:
  sm: /images/pages/stacking-rounded.svg
---

![What you'll be creating in this tutorial](/images/stacking-view.png)

## Introduction

In this tutorial, you will learn how to integrate Stacking by interacting with the respective smart contract and reading data from the Stacks blockchain.

This tutorial highlights the following functionality:

- Reading wallet information and verifying Stacking eligibility
- Initiating Stacking participation and locking up Stacks tokens by signing a transaction
- Reading Stacking reward details

## Requirements

- Familiarity with the [Stacks 2.0 blockchain](/stacks-blockchain/overview)
- Familiarity with the [Stacking mechanism](/stacks-blockchain/stacking)

## Overview

In this tutorial, we will implement this Stacking flow:

![The flow you'll be implementation in this tutorial](/images/stacking-illustration.png)

1. Make API calls to get details about the upcoming reward cycle. The details include the next cycle timestamp, cycle duration, and estimated rewards
2. For a specific Stacks wallet, confirm the minimum balance required and no locked-up tokens
3. Enable participation by letting the Stacks wallet holder confirm the BTC reward address and the lockup duration. The action will result in a transaction that needs to be signed by the wallet holder
4. The transaction is broadcasted. With the confirmation of the transaction, the Stacks tokens will be locked-up and inaccessible throughout the lockup period
5. The Stacking mechanism executes reward cycles and sends out rewards to the set BTC reward address
6. During the lockup period, make API calls to get details about unlocking timing, rewards collected and projected
7. Once lockup period is passed, the tokens are released and accessible again
8. Display reward history, including details like earnings for previews rewrad cycles

## Step 1: Integrate transactions JS library

First, we will add the [Stacks transactions JS library](https://github.com/blockstack/stacks-transactions-js). This library will help contruct, sign, and broadcast transactions.

## Step 2: Implement account management

Allow users to create and manage their Stacks account:

[@page-reference | inline]
| /stacks-blockchain/managing-accounts

## Step 3: Display stacking info

In order to inform users about the upcoming reward cycle and duration, we need to the stacking info using the [Stacks Blockchain API]():

```js
curl --location --request POST 'https://stacks-node-api-latest.argon.blockstack.xyz/v2/contracts/call-read/ST2MTD9MVRD074PTKGDYAKVTJSPWZGEQSDE3CEFRP/hello_world/get-value?sender=SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR&arguments=[%220x0011...%22]' \
--header 'Content-Type: application/json' \
--data-raw '{
  "sender": "SP31DA6FTSJX2WGTZ69SFY11BH51NZMB0ZW97B5P0",
  "arguments": ["0x0011...", "0x00231..."]
}'
```

## Step 4: Verify stacking eligibility

Using the user session, you can also verify if the account holder is eligible for Stacking.

- read tokens available
- make API call to read minimum tokens required

## Step 5: Add lock-up action

Next, your application should ask the user for the following input:

- BTC reward address: This address will receive earnings
- Reward cycles: The number of reward cycles to participate in
- STX tokens: The amount of tokens that will be locked up

> Using the cycle duration and next cycle timestamp, you can calculate the lockup duration: `next_cycle_timestamp + (cycle_duration * cycle_amount)`.

It is strongly recommended to verify the input fields presented to the user:

```js
const btcAddress = '<btcInput>'.match(/^[13][a-km-zA-HJ-NP-Z0-9]{26,33}$/);
const rewardCycles = parseInt('cycleInput');
const stxAmount = Decimal.Parse('stxInput', NumberStyles.AllowDecimalPoint);
```

With the user input, you can make an API call to obtain estimated rewards:

```js
const response = await contractsAPI.callReadOnlyFunction({
  contractName: '',
  functionName: '',
  stacksAddress: '',
  // arguments, e.g. stx ?
});

console.log(response);
// reward estimates in uSTX
```

It it important to understand and point out to users that the rewards are _estimations_ based on previous reward cycles. The actual reward depends on a variety of parameters and amount would likely vary.

Now that the user was presented with the reward estimates, the Stacking action should be enabled. The action will require signing a transaction and is best handled with Blockstack Connect:

```js
import { openContractCall } from '@blockstack/connect';

// While in beta, you must provide this option:
const authOrigin = 'https://deploy-preview-301--stacks-authenticator.netlify.app';

// Here's an example of options:
const myStatus = 'hey there';
const options = {
  contractAddress: 'ST22T6ZS7HVWEMZHHFK77H4GTNDTWNPQAX8WZAKHJ',
  contractName: 'status',
  functionName: 'write-status!',
  functionArgs: [
    {
      type: 'buff',
      value: myStatus,
    },
  ],
  authOrigin,
  appDetails: {
    name: 'SuperApp',
    icon: 'https://example.com/icon.png',
  },
  finished: data => {
    console.log('TX ID:', data.txId);
    console.log('Raw TX:', data.txRaw);
  },
};

await openContractCall(options);
```

## Step 6: Confirm lock-up and display status

Once the user signed the transaction, the Stacks tokens in the account will be locked up for the lockup duration. During that duration, the application can display the Stacking status.

- calls Stacks API to obtain info: status, (estimated) rewards, rewards earned, unlock time

## Step 7: Display stacking history (optional)

- alls Stacks API to obtain info: previous lock-ups, durations, dates, and rewards

## Notes on delegation

- provide info for stacking delegation process
