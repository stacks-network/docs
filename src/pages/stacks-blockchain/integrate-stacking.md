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

-> Alternatively to integration using JS libraries, you can [use the CLI](https://gist.github.com/kantai/c261ca04114231f0f6a7ce34f0d2499b).

## Requirements

First, you will need to understand the [Stacking mechanism](/stacks-blockchain/stacking).

You will also need [NodeJS](https://nodejs.org/en/download/) `8.12.0` or higher to complete this tutorial. You can verify your installation by opening up your terminal and run the following command:

```bash
node --version
```

## Overview

In this tutorial, we will implement this Stacking flow:

![The flow you'll be implementation in this tutorial](/images/stacking-illustration.png)

1. Make API calls to get details about the upcoming reward cycle. The details include the next cycle timestamp, cycle duration, and estimated rewards
2. For a specific Stacks wallet, confirm the minimum balance required and no locked-up tokens
3. Enable participation by letting the Stacks wallet holder confirm the BTC reward address and the lockup duration. The action will result in a transaction that needs to be signed by the wallet holder
4. The transaction is broadcasted. With the confirmation of the transaction, the Stacks tokens will be locked-up and inaccessible throughout the lockup period
5. The Stacking mechanism executes reward cycles and sends out rewards to the set BTC reward address
6. During the lockup period, make API calls to get details about unlocking timing, rewards collected and projected
7. Once the lockup period is passed, the tokens are released and accessible again
8. Display reward history, including details like earnings for previews reward cycles

## Step 1: Integrate libraries

First install the stacks transactions library and an API client for the [Stacks 2.0 Blockchain API](/references/stacks-blockchain):

```shell
npm install --save @blockstack/stacks-transactions@0.6.0 @stacks/blockchain-api-client c32check
```

-> The API client is generated from the [OpenAPI specification](https://github.com/blockstack/stacks-blockchain-api/blob/master/docs/openapi.yaml) ([openapi-generator](https://github.com/OpenAPITools/openapi-generator)). Many other languages and frameworks are be supported by the generator.

## Step 2: Generating an account

To get started, let's create a new, random Stacks 2.0 account:

```js
import {
  makeRandomPrivKey,
  privateKeyToString,
  getAddressFromPrivateKey,
  TransactionVersion,
  StacksTestnet,
  uintCV,
  tupleCV,
  makeContractCall,
  bufferCVFromString,
} from '@blockstack/stacks-transactions';
const {
  InfoApi,
  AccountsApi,
  SmartContractsApi,
  Configuration,
  TransactionsApi,
} = require('@stacks/blockchain-api-client');
const c32c = require('c32check');

const apiConfig = new Configuration({
  fetchApi: fetch,
  basePath: 'https://stacks-node-api.blockstack.org',
});

// generate rnadom key
const privateKey = makeRandomPrivKey();

// get Stacks address
const principal = getAddressFromPrivateKey(
  privateKeyToString(privateKey),
  TransactionVersion.Testnet
);
```

-> Review the [accounts guide](/stacks-blockchain/accounts) for more details

## Step 3: Display stacking info

!> Todo: Prepare for API call (get address, resolve contract ID, construct Clarity values for API call)

In order to inform users about the upcoming reward cycle, we need to obtain Stacking information:

```js
const info = new InfoApi(apiConfig);

const poxInfo = await info.getPoxInfo();
const coreInfo = await info.getCoreApiInfo();
const blocktimeInfo = await info.getNetworkBlockTimes();

console.log({ poxInfo, coreInfo, blocktimeInfo });
```

-> Check out the API references for the 3 endpoints used here: [GET /v2/info](https://blockstack.github.io/stacks-blockchain-api/#operation/get_core_api_info), [GET v2/pox](https://blockstack.github.io/stacks-blockchain-api/#operation/get_pox_info), and [GET /extended/v1/info/network_block_times](https://blockstack.github.io/stacks-blockchain-api/#operation/get_network_block_times)

Here are the fields that we need for this tutorial:

| **Parameter**                  | **Description**                                                                                          |
| ------------------------------ | -------------------------------------------------------------------------------------------------------- |
| `contract_id`                  | The deployed Stacking smart contract ID                                                                  |
| `first_burnchain_block_height` | The block height at which the Stacking began                                                             |
| `min_amount_ustx`              | Minimum micro-STX required to participate in the next Stacking cycle                                     |
| `rejection_fraction`           | The fraction of liquid STX that must vote to reject PoX for it to revert to PoB in the next reward cycle |
| `reward_cycle_id`              | The next reward cycle ID                                                                                 |
| `reward_cycle_length`          | Length of the next reward (in blocks) cycle                                                              |

-> Stacking execution will differ between mainnet and testnet in terms of cycle times and participation thresholds

With the fields above, you can present if Stacking is executed in the next cycle, when the next cycle begins, and the duration of a cycle:

```js
// will Stacking be executed in the next cycle?
const stackingExecution = poxInfo.rejection_votes_left_required > 0;

// how long (in seconds) is a Stacking cycle?
const cycleDuration = poxInfo.reward_cycle_length * blocktimeInfo.testnet.target_block_time;

// how much time is left (in seconds) until the next cycle begins?
const secondsToNextCycle =
  (poxInfo.reward_cycle_length -
    ((coreInfo.burn_block_height - poxInfo.first_burnchain_block_height) %
      poxInfo.reward_cycle_length)) *
  blocktimeInfo.testnet.target_block_time;

// the actual datetime of the next cycle start
const nextCycleStartingAt = new Date();
nextCycleStartingAt.setSeconds(nextCycleStartingAt.getSeconds() + secondsToNextCycle);
```

Users need to have sufficient Stacks (STX) tokens to participate in Stacking. With the Stacking info, this can be verified easily:

```js
const accounts = new AccountsApi(apiConfig);

const accountBalance = await accounts.getAccountBalance({
  principal,
});

const accountSTXBalance = accountBalance.stx.balance;

// enough balance for participation?
const canParticipate = accountSTXBalance >= poxInfo.min_amount_ustx;
```

For testing purposes, you can use a faucet to obtain STX tokens:

```shell
curl -XPOST "https://stacks-node-api.blockstack.org/extended/v1/faucets/stx?address=<principal>"
```

You will have to wait a few minutes for the transaction to complete.

Users can select how many cycles they would like to participate in. To help with that decision, the unlocking time can be estimated:

```js
// this would be provided by the user
let numberOfCycles = 3;

// the projected datetime for the unlocking of tokens
const unlockingAt = new Date(nextCycleStartingAt);
unlockingAt.setSeconds(
  unlockingAt.getSeconds() +
    poxInfo.reward_cycle_length * numberOfCycles * blocktimeInfo.testnet.target_block_time
);
```

## Step 4: Verify stacking eligibility

At this point, your app shows Stacking details. If Stacking is executed and the user has enough funds, the user should be asked to provide input for the amount of micro-STX to lockup.

With this input, and the data from previous steps, we can determine the eligibility:

```js
// micro-STX tokens to lockup, must be >= poxInfo.min_amount_ustx and <=accountSTXBalance
let microSTXoLockups = 50000;

// generate BTC from Stacks address
const btcAddress = c32c.c32ToB58(principal);
const version = bufferCV(Buffer.from('0', 'hex'));
const hashbytes = bufferCV(btcAddress);

// read-only contract call
const smartContracts = new SmartContractsApi(apiConfig);

const contractCall = await smartContracts.callReadOnlyFunction({
  stacksAddress: poxInfo.contract_id.split('.')[0],
  contractName: poxInfo.contract_id.split('.')[1],
  functionName: 'can-stack-stx',
  readOnlyFunctionArgs: {
    sender: principal,
    arguments: [
      tupleCV({
        hashbytes,
        version,
      }),
      uintCV(microSTXoLockups),
      uintCV(poxInfo.reward_cycle_id),
      uintCV(numberOfCycles),
    ],
  },
});

const isEligible = contractCall.result;
```

If the user is eligible, the stacking action should be enabled on the UI.

-> For more information on this read-only API call, please review the [API references](https://blockstack.github.io/stacks-blockchain-api/#operation/call_read_only_function)

## Step 5: Add stacking action

Next, the Stacking action can be enabled. Once the user confirms the action, a new transaction needs to be broadcasted to the network:

```js
const tx = new TransactionsApi(apiConfig);

const txOptions = {
  contractAddress: poxInfo.contract_id.split('.')[0],
  contractName: poxInfo.contract_id.split('.')[1],
  functionName: 'stack-stx',
  functionArgs: [
    uintCV(microSTXoLockups),
    tupleCV({
      hashbytes,
      version,
    }),
    uintCV(numberOfCycles),
  ],
  senderKey: privateKey,
  validateWithAbi: true,
  network: new StacksTestnet(),
};

const transaction = await makeContractCall(txOptions);

const rawTx = transaction.serialize().toString('hex');

const contractCall = tx.postCoreNodeTransactions({
  body: rawTx,
});
```

-> The transaction completion will take several minutes. Concurrent stacking actions should be disabled to ensure the user doesn't lock up more tokens as expected

## Step 6: Confirm lock-up and display status

TODO: check for transaction completion

Once the user signed the transaction, the Stacks tokens in the account will be locked up for the lockup duration. During that duration, the application can display the Stacking status.

- read-only call to 'get-stacker-info'

## Step 7: Display stacking history (optional)

- alls Stacks API to obtain info: previous lock-ups, durations, dates, and rewards

## Notes on delegation
