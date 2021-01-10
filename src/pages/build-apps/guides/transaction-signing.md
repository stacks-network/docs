---
title: Transaction signing
description: Prompt users to sign and broadcast transactions to the Stacks blockchain
experience: beginners
tags:
  - tutorial
images:
  large: /images/pages/write-smart-contracts.svg
  sm: /images/pages/write-smart-contracts-sm.svg
---

## Introduction

This guide explains how to prompt users to sign transactions and broadcast them to the Stacks blockchain by implementing the `connect` package of [Stacks.js](https://blockstack.github.io/stacks.js/).

Transaction signing provides a way for users execute [Clarity smart contracts](/write-smart-contracts/overview) that are relevant to your app then handle the result immediately.

Users can sign transactions that exchange fungible or non-fungible tokens with upfront guarantees that help them retain control over their digital assets.

There are three types of transactions:

1. STX transfer
2. Contract deployment
3. Contract execution

[See the public registry tutorial](/build-apps/tutorials/public-registry) for a concrete example of this functionality in practice.

## Install dependency

The following dependency must be installed:

```
npm install @stacks/connect
```

## Initiate session

Users must authenticate to an app before the `connect` package will work to prompt them for signing and broadcasting transactions to the Stacks blockchain with an authenticator such as [the Stacks Wallet](https://blockstack.org/wallet).

[See the authentication guide](/build-apps/guides/authentication) before proceeding to integrate the following transaction signing capabilities in cases where `userSession.isUserSignedIn()` returns `true`.

## Prompt to transfer STX

Call the `openSTXTransfer` function provided by the `connect` package to trigger the display of a transaction signing prompt for transferring STX:

```tsx
import { openSTXTransfer } from '@stacks/connect';

openSTXTransfer({
  recipient: 'ST2EB9WEQNR9P0K28D2DC352TM75YG3K0GT7V13CV',
  amount: '100',
  memo: 'Reimbursement',
  authOrigin,
  appDetails: {
    name: 'My App',
    icon: window.location.origin + '/my-app-logo.svg',
  },
  finished: data => {
    console.log('Transaction ID:', data.txId);
    console.log('Raw transaction:', data.txRaw);
  },
});
```

Several parameters are available for calling `openSTXTransfer`. Here's the exact interface for them:

```tsx
interface STXTransferOptions {
  recipient: string;
  amount: string;
  memo?: string;
  authOrigin?: string;
  appDetails: {
    name: string;
    icon: string;
  };
  finished: (data: FinishedTxData) => void;
}
```

| parameter  | type     | required | description                                                                                                                                                                                          |
| ---------- | -------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| recipient  | string   | true     | STX address for recipient of transfer                                                                                                                                                                |
| amount     | string   | true     | Amount of microstacks (µSTX, with 1,000,000 µSTX per 1 STX) to be transferred provided as string to prevent floating point errors.                                                                   |
| appDetails | object   | true     | Dictionary that requires `name` and `icon` for app                                                                                                                                                   |
| finished   | function | true     | Callback executed by app when transaction has been signed and broadcasted. It received an object back with `txId` and `txRaw` properties, both of which are strings.                                 |
| memo       | string   | false    | Optional memo for inclusion with transaction                                                                                                                                                         |
| authOrigin | string   | false    | URL of authenticator to use for prompting signature and broadcast. Defaults to `https://wallet.hiro.so` for the Stacks Wallet, which is handled by the Stacks Wallet browser extension if installed. |

## Prompt to deploy smart contract

Call the `openContractDeploy` function provided by the `connect` package to trigger the display of a transaction signing prompt for deploying a smart contract:

```tsx
import { openContractDeploy } from '@blockstack/connect';

const codeBody = '(begin (print "hello, world"))';

openContractDeploy({
  contractName: 'my-contract-name',
  codeBody,
  appDetails: {
    name: 'My App',
    icon: window.location.origin + '/my-app-logo.svg',
  },
  finished: data => {
    console.log('Transaction ID:', data.txId);
    console.log('Raw transaction:', data.txRaw);
  },
});
```

Several parameters are available for calling `openContractDeploy`. Here's the exact interface for them:

```tsx
interface ContractDeployOptions {
  codeBody: string;
  contractName: string;
  authOrigin?: string;
  appDetails: {
    name: string;
    icon: string;
  };
  finished: (data: FinishedTxData) => void;
}
```

| parameter    | type     | required | description                                                                                                                                                                                          |
| ------------ | -------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| codeBody     | string   | true     | Clarity source code for contract                                                                                                                                                                     |
| contractName | string   | true     | Name for contract                                                                                                                                                                                    |
| appDetails   | object   | true     | Dictionary that requires `name` and `icon` for app                                                                                                                                                   |
| finished     | function | true     | Callback executed by app when transaction has been signed and broadcasted. It received an object back with `txId` and `txRaw` properties, both of which are strings.                                 |
| authOrigin   | string   | false    | URL of authenticator to use for prompting signature and broadcast. Defaults to `https://wallet.hiro.so` for the Stacks Wallet, which is handled by the Stacks Wallet browser extension if installed. |

-> Contracts will deploy to the Stacks address of the authenticated user.

## Prompt to execute contract

Call the `openContractCall` function provided by the `connect` package to trigger the display of a transaction signing prompt for executing a contract:

```tsx
import { openContractCall } from '@stacks/connect';

const options = {
  contractAddress: 'ST22T6ZS7HVWEMZHHFK77H4GTNDTWNPQAX8WZAKHJ',
  contractName: 'status',
  functionName: 'write-status!',
  functionArgs: [
    {
      type: 'buff',
      value: 'hello world',
    },
  ],
  authOrigin,
  appDetails: {
    name: 'My App',
    icon: window.location.origin + '/my-app-logo.svg',
  },
  finished: data => {
    console.log('Transaction ID:', data.txId);
    console.log('Raw transaction:', data.txRaw);
  },
};

await openContractCall(options);
```

Several parameters are available for calling `openContractCall`. Here's the exact interface for them:

```tsx
interface ContractCallOptions {
  contractAddress: string;
  functionName: string;
  contractName: string;
  functionArgs?: any[];
  authOrigin?: string;
  appDetails: {
    name: string;
    icon: string;
  };
  finished: (data: FinishedTxData) => void;
}
```

| parameter       | type     | required | description                                                                                                                                                                                          |
| --------------- | -------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| contractAddress | string   | true     | Stacks address to which contract is deployed                                                                                                                                                         |
| contractName    | string   | true     | Name of contract to sign                                                                                                                                                                             |
| functionName    | string   | true     | Name of function for signing / execution, which needs to be a [public function](/references/language-functions#define-public).                                                                       |
| functionArgs    | array    | true     | Arguments for calling the function. [Provide the Clarity type with each argument](#passing-clarity-types-with-function-arguments). Defaults to `[]`.                                                 |
| appDetails      | object   | true     | Dictionary that requires `name` and `icon` for app                                                                                                                                                   |
| finished        | function | true     | Callback executed by app when transaction has been signed and broadcasted. It received an object back with `txId` and `txRaw` properties, both of which are strings.                                 |
| authOrigin      | string   | false    | URL of authenticator to use for prompting signature and broadcast. Defaults to `https://wallet.hiro.so` for the Stacks Wallet, which is handled by the Stacks Wallet browser extension if installed. |

### Passing Clarity types with function arguments

To serialize your transaction properly, you'll need to provide an appropriate Clarity type for each function argument.

These types are named the same as in Clarity and must be passed as strings:

- `uint`: Unsigned integer (e.g. `"240"`)
- `int`: Signed integer (e.g. `"12"`)
- `bool`: Boolean (e.g. `true` or `false`, `0` or `1`)
- `buff`: Buffer (e.g. `"hello world"`)
- `principal`: [Contract or standard principal](/write-smart-contracts/principals) (e.g. `"ST22T6ZS7HVWEMZHHFK77H4GTNDTWNPQAX8WZAKHJ"`) or `"ST22T6ZS7HVWEMZHHFK77H4GTNDTWNPQAX8WZAKHJ.my-contract"`.

Argument are provided in an array of objects with keys `type` and `value`:

```tsx
const functionArguments = [
  {
    type: 'buff',
    value: 'hello, world',
  },
  {
    type: 'uint',
    value: '1',
  },
];
```

-> If you're using TypeScript, these Clarity types can be imported as `ContractCallArgumentType` from `@stacks/connect`.

## Usage in React Apps

Import the `useConnect` from the `connect` package to integrate transaction signing more seamlessly into React apps.

Each transaction signing method is itself available as a function returned by `useConnect` though prefixed with `do` for consistency with React action naming standards:

- `openContractCall` as `doContractCall`
- `openSTXTransfer` as `doSTXTransfer`
- `openContractDeploy` as `doContractDeploy`

Use these functions with the same parameters as outlined above. However, you don't have to specify `appDetails` since they are detected automatically if `useConnect` has been used already for authentication.

```tsx
import { useConnect } from '@stacks/connect';

const MyComponent = () => {
  const { doContractCall } = useConnect();

  const onClick = async () => {
    const options = {
      /** See examples above */
    };
    await doContractCall(options);
  };

  return <span onClick={onClick}>Call my contract</span>;
};
```

## Change network

TBD: Instructions for changing between mainnet, testnet and local networks

## Request testnet STX from faucet

You may find it useful to request testnet STX from [the faucet](https://testnet.blockstack.org/faucet) while developing your app with the Stacks testnet.
