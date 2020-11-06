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

![What you'll create in this tutorial](/images/stacking-view.png)

## Introduction

!> The Stacking implementation is still in development and could change in the coming weeks

In this tutorial, you'll learn how to integrate Stacking by interacting with the respective smart contract, as well as reading data from the Stacks blockchain.

This tutorial highlights the following functionality:

- Generate Stacks accounts
- Display stacking info
- Verify stacking eligibility
- Add stacking action
- Display stacking status

-> Alternatively to integration using JS libraries, you can [use the CLI](https://gist.github.com/kantai/c261ca04114231f0f6a7ce34f0d2499b).

## Requirements

First, you'll need to understand the [Stacking mechanism](/understand-stacks/stacking).

You'll also need [NodeJS](https://nodejs.org/en/download/) `8.12.0` or higher to complete this tutorial. You can verify your installation by opening up your terminal and run the following command:

```bash
node --version
```

## Overview

In this tutorial, we'll implement the Stacking flow laid out in the [Stacking guide](/understand-stacks/stacking#stacking-flow).

-> Check out the sample source code for this tutorial in this GitHub repository: [stacking-integration-sample](https://github.com/agraebe/stacking-integration-sample)

## Step 1: Integrate libraries

Install the stacks transactions library and an API client for the [Stacks 2.0 Blockchain API](/references/stacks-blockchain):

```shell
npm install --save @stacks/transactions @stacks/network @stacks/blockchain-api-client c32check cross-fetch bn.js
```

-> The API client is generated from the [OpenAPI specification](https://github.com/blockstack/stacks-blockchain-api/blob/master/docs/openapi.yaml) ([openapi-generator](https://github.com/OpenAPITools/openapi-generator)). Many other languages and frameworks are supported by the generator.

## Step 2: Generating an account

To get started, let's create a new, random Stacks 2.0 account:

```js
const fetch = require('cross-fetch');
const BN = require('bn.js');
const {
  makeRandomPrivKey,
  privateKeyToString,
  getAddressFromPrivateKey,
  TransactionVersion,
  uintCV,
  tupleCV,
  makeContractCall,
  bufferCV,
  serializeCV,
  deserializeCV,
  cvToString,
  connectWebSocketClient,
  broadcastTransaction,
  standardPrincipalCV,
} = require('@stacks/transactions');
const { StacksTestnet } = require('@stacks/network');
const {
  InfoApi,
  AccountsApi,
  SmartContractsApi,
  Configuration,
  TransactionsApi,
} = require('@stacks/blockchain-api-client');
const c32 = require('c32check');

const apiConfig = new Configuration({
  fetchApi: fetch,
  basePath: 'https://stacks-node-api.blockstack.org',
});

// generate rnadom key
const privateKey = makeRandomPrivKey();

// get Stacks address
const stxAddress = getAddressFromPrivateKey(
  privateKeyToString(privateKey),
  TransactionVersion.Testnet
);
```

-> Review the [accounts guide](/understand-stacks/accounts) for more details

## Step 3: Display stacking info

In order to inform users about the upcoming reward cycle, we need to obtain Stacking information:

```js
const info = new InfoApi(apiConfig);

const poxInfo = await info.getPoxInfo();
const coreInfo = await info.getCoreApiInfo();
const blocktimeInfo = await info.getNetworkBlockTimes();

console.log({ poxInfo, coreInfo, blocktimeInfo });
```

-> Check out the API references for the 3 endpoints used here: [GET /v2/info](https://blockstack.github.io/stacks-blockchain-api/#operation/get_core_api_info), [GET v2/pox](https://blockstack.github.io/stacks-blockchain-api/#operation/get_pox_info), and [GET /extended/v1/info/network_block_times](https://blockstack.github.io/stacks-blockchain-api/#operation/get_network_block_times)

The object, including PoX, core, and block time information, looks like this:

```js
{
  poxInfo: {
    contract_id: 'ST000000000000000000002AMW42H.pox',
    first_burnchain_block_height: 0,
    min_amount_ustx: 2000000000000,
    registration_window_length: undefined,
    rejection_fraction: 25,
    reward_cycle_id: 4,
    reward_cycle_length: 120
  },
  coreInfo: {
    limit: undefined,
    peer_version: 385875968,
    burn_consensus: undefined,
    burn_block_height: 605,
    stable_burn_consensus: undefined,
    stable_burn_block_height: 604,
    server_version: 'blockstack-core 0.0.1 => 23.0.0.0 (master:5b816c2+, release build, linux [x86_64])',
    network_id: 2147483648,
    parent_network_id: 3669344250,
    stacks_tip_height: 104,
    stacks_tip: 'b05c6c5221b307ad41484ee527fa127ad1a09a0818ec64775309a3d4e4d40143',
    stacks_tip_burn_block: undefined,
    exit_at_block_height: null
  },
  blocktimeInfo: {
    mainnet: { target_block_time: 600 },
    testnet: { target_block_time: 120 }
  }
}
```

-> Stacking execution will differ between mainnet and testnet in terms of cycle times and participation thresholds

With the obtained PoX info, you can present whether Stacking has been executed in the next cycle, when the next cycle begins, the duration of a cycle, and the minimum microstacks required to participate:

```js
// will Stacking be executed in the next cycle?
const stackingExecution = poxInfo.rejection_votes_left_required > 0;

// how long (in seconds) is a Stacking cycle?
const cycleDuration = poxInfo.reward_cycle_length * blocktimeInfo.testnet.target_block_time;

// how much time is left (in seconds) until the next cycle begins?
const secondsToNextCycle =
  (poxInfo.reward_cycle_length -
    ((coreInfo.burn_block_height - poxInfo.first_burnchain_block_height - 1) %
      poxInfo.reward_cycle_length)) *
  blocktimeInfo.testnet.target_block_time;

// the actual datetime of the next cycle start
const nextCycleStartingAt = new Date();
nextCycleStartingAt.setSeconds(nextCycleStartingAt.getSeconds() + secondsToNextCycle);

console.log({
  stackingExecution,
  cycleDuration,
  nextCycleStartingAt,
  // minimum microstacks required to participate
  minimumUSTX: poxInfo.min_amount_ustx,
});
```

Users need to have sufficient Stacks (STX) tokens to participate in Stacking. With the Stacking info, this can be verified easily:

```js
const accounts = new AccountsApi(apiConfig);

const accountBalance = await accounts.getAccountBalance({
  principal: stxAddress,
});

const accountSTXBalance = new BN(accountBalance.stx.balance, 10);
const minAmountSTX = new BN(poxInfo.min_amount_ustx, 10);

// enough balance for participation?
const canParticipate = accountSTXBalance.cmp(minAmountSTX) >= 0;

res.json({
  stxAddress,
  btcAddress: c32.c32ToB58(stxAddress),
  accountSTXBalance: accountSTXBalance.toNumber(),
  canParticipate,
});
```

For testing purposes, you can use a faucet to obtain STX tokens:

```shell
curl -XPOST "https://stacks-node-api.blockstack.org/extended/v1/faucets/stx?address=<stxAddress>&stacking=true"
```

You'll have to wait a few minutes for the transaction to complete.

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

At this point, your app shows Stacking details. If Stacking is executed and the user has enough funds, the user should be asked to provide input for the amount of microstacks to lockup and a bitcoin address to be used to pay out rewards.

-> The sample code used assumes usage of the bitcoin address associated with the Stacks account. You can replace this with an address provided by the users or read from your database. Read more about the [bitcoin address format](/understand-stacks/stacking#bitcoin-address).

With this input, and the data from previous steps, we can determine the eligibility for the next reward cycle:

```js
// microstacks tokens to lockup, must be >= poxInfo.min_amount_ustx and <=accountSTXBalance
let microstacksoLockup = poxInfo.min_amount_ustx;

// derive bitcoin address from Stacks account and convert into required format
const hashbytes = bufferCV(Buffer.from(c32.c32addressDecode(stxAddress)[1], 'hex'));
const version = bufferCV(Buffer.from('01', 'hex'));

const smartContracts = new SmartContractsApi(apiConfig);

const [contractAddress, contractName] = poxInfo.contract_id.split('.');

// read-only contract call
const isEligible = await smartContracts.callReadOnlyFunction({
  contractAddress,
  contractName,
  functionName: 'can-stack-stx',
  readOnlyFunctionArgs: {
    sender: stxAddress,
    arguments: [
      `0x${serializeCV(
        tupleCV({
          hashbytes,
          version,
        })
      ).toString('hex')}`,
      `0x${serializeCV(uintCV(microstacksoLockup)).toString('hex')}`,
      // explicilty check eligibility for next cycle
      `0x${serializeCV(uintCV(poxInfo.reward_cycle_id)).toString('hex')}`,
      `0x${serializeCV(uintCV(numberOfCycles)).toString('hex')}`,
    ],
  },
});

const response = cvToString(deserializeCV(Buffer.from(isEligible.result.slice(2), 'hex')));

if (response.startsWith(`(err `)) {
  // user cannot participate in stacking
  // error codes: https://github.com/blockstack/stacks-blockchain/blob/master/src/chainstate/stacks/boot/pox.clar#L2
  console.log({ isEligible: false, errorCode: response }));
  return;
}
// success
console.log({ isEligible: true });
```

If the user is eligible, the stacking action should be enabled on the UI. If not, the respective error message should be shown to the user.

-> For more information on this read-only API call, please review the [API references](https://blockstack.github.io/stacks-blockchain-api/#operation/call_read_only_function)

## Step 5: Add stacking action

Next, the Stacking action should be implemented. Once the user confirms the action, a new transaction needs to be broadcasted to the network:

```js
const tx = new TransactionsApi(apiConfig);

const [contractAddress, contractName] = poxInfo.contract_id.split('.');
const network = new StacksTestnet();

const txOptions = {
  contractAddress,
  contractName,
  functionName: 'stack-stx',
  functionArgs: [
    uintCV(microstacksoLockup),
    tupleCV({
      hashbytes,
      version,
    }),
    uintCV(coreInfo.burn_block_height),
    uintCV(numberOfCycles),
  ],
  senderKey: privateKey.data.toString('hex'),
  validateWithAbi: true,
  network,
};

const transaction = await makeContractCall(txOptions);

const contractCall = await broadcastTransaction(transaction, network);

// this will return a new transaction ID
console.log(contractCall);
```

The transaction completion will take several minutes. Concurrent stacking actions should be disabled to ensure the user doesn't lock up more tokens as expected.

## Step 6: Confirm lock-up

The new transaction will not be completed immediately. It'll stay in the `pending` status for a few minutes. We need to poll the status and wait until the transaction status changes to `success`:

```js
const waitForTransactionSuccess = txId =>
  new Promise((resolve, reject) => {
    const pollingInterval = 3000;
    const intervalID = setInterval(async () => {
      const resp = await tx.getTransactionById({ txId });
      if (resp.tx_status === 'success') {
        // stop polling
        clearInterval(intervalID);
        // update UI to display stacking status
        return resolve(resp);
      }
    }, pollingInterval);
  });

const resp = await waitForTransactionSuccess(contractCall.txId);
```

-> More details on the lifecycle of transactions can be found in the [transactions guide](/understand-stacks/transactions#lifecycle)

Alternatively to the polling, the Stacks Blockchain API client library offers WebSockets. WebSockets can be used to subscribe to specific updates, like transaction status changes. Here is an example:

```js
const client = await connectWebSocketClient('ws://stacks-node-api.blockstack.org/');

const sub = await client.subscribeAddressTransactions(contractCall.txId, event => {
  console.log(event);
  // update UI to display stacking status
});

await sub.unsubscribe();
```

## Step 6: Display Stacking status

With the completed transactions, Stacks tokens are locked up for the lockup duration. During that time, your application can display the following details: unlocking time, amount of Stacks locked, and bitcoin address used for rewards.

```js
const [contractAddress, contractName] = poxInfo.contract_id.split('.');
const functionName = 'get-stacker-info';

const stackingInfo = await smartContracts.callReadOnlyFunction({
  contractAddress,
  contractName,
  functionName,
  readOnlyFunctionArgs: {
    sender: stxAddress,
    arguments: [`0x${serializeCV(standardPrincipalCV(stxAddress)).toString('hex')}`],
  },
});

const response = deserializeCV(Buffer.from(stackingInfo.result.slice(2), 'hex'));

const data = response.value.data;

console.log({
  lockPeriod: cvToString(data['lock-period']),
  amountSTX: cvToString(data['amount-ustx']),
  firstRewardCycle: cvToString(data['first-reward-cycle']),
  poxAddr: {
    version: cvToString(data['pox-addr'].data.version),
    hashbytes: cvToString(data['pox-addr'].data.hashbytes),
  },
});
```

To display the unlocking time, you need to use the `firstRewardCycle` and the `lockPeriod` fields.

-> Coming soon: how to obtain rewards paid out to the stacker? how to find out if an account has stacked tokens?

**Congratulations!** With the completion of this step, you successfully learnt how to ...

- Generate Stacks accounts
- Display stacking info
- Verify stacking eligibility
- Add stacking action
- Display stacking status

## Step 7: Display stacking history (optional)

-> Coming soon: how to obtain info previous lock-ups, durations, dates, and rewards?

## Notes on delegation

-> Coming soon: how to enable Stacking delegation?
