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

Transaction signing provides a way for users execute [smart contracts written in Clarity](/write-smart-contracts/overview) that are relevant to your app then handle the result immediately.

Users can sign transactions that exchange fungible or non-fungible tokens with upfront guarantees while retaining complete control over their digital assets.

See [the public registry tutorial](/build-apps/tutorials/public-registry) for a concrete example of this functionality in practice.

## How it works

For your app's users to be able to execute a smart contract function, they need to sign and broadcast a transaction.

It's important that users remain in control of the private keys that sign these transactions. Connect provides an easy-to-use workflow that allows your users to securely sign transactions.

Connect allows you to open the authenticator with parameters indicating the details of the transaction - like the smart
contract address, function name, and specific arguments. Your users get the chance to see these details, and then sign
and broadcast the transaction in a single click. Their transaction will be securely signed and broadcasted onto the
Stacks blockchain. After this is done, a callback is fired to allow you to update your app.

## Calling Clarity Contract Functions

Once you have a Clarity smart contract built and deployed, you'll naturally want to allow your app's users to interact
with it.

To initiate a contract call transaction, use the `openContractCall` function.

```tsx
import { openContractCall } from '@stacks/connect';

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

There are some required parameters needed when calling `openContractCall`. Here is the exact interface which describes what options you have:

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

| parameter       | type     | optional | description                                                                                                                                                                   |
| --------------- | -------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| contractAddress | string   | false    | The Stacks address that published this contract                                                                                                                               |
| contractName    | string   | false    | The name that was used when publishing this contract                                                                                                                          |
| functionName    | string   | false    | The name of the function you're calling. This needs to be a [public function](/references/language-functions#define-public).                                                  |
| functionArgs    | array    | false    | The arguments you're calling the function with. You'll need to provide the Clarity type with each argument. See the below section for details. Defaults to `[]`.              |
| appDetails      | object   | false    | A dictionary that includes `name` and `icon`                                                                                                                                  |
| finished        | function | false    | A callback that is fired when the transaction is signed and broadcasted. Your callback will receive an object back with a `txId` and a `txRaw`, both of which are strings.    |
| authOrigin      | string   | true     | The location of the authenticator. This is only necessary when developing the authenticator locally, or when using beta features. Defaults to `"https://app.blockstack.org"`. |

### Passing Clarity types with function arguments

To be able to serialize your transaction properly, you need to provide the appropriate Clarity type with each argument.
These types are named the same as they are in Clarity. The `value` that you pass must be a string. The types you can pass are:

- `uint` - for example `"240"`
- `int` - for example `"12"`
- `bool` - can be `true`, `false`, `0` or `1`
- `buff` - for example `"asdf"`
- `principal` - This can be a contract principal, or a standard principal.
  [Read more about principals](/write-smart-contracts/principals). Examples: `"ST22T6ZS7HVWEMZHHFK77H4GTNDTWNPQAX8WZAKHJ"`
  or `"ST22T6ZS7HVWEMZHHFK77H4GTNDTWNPQAX8WZAKHJ.my-contract"`.

Using these types, each argument is an object with the keys `type` and `value`. For example:

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

If you're using TypeScript, these Clarity types can be imported as `ContractCallArgumentType` from `@stacks/connect`.

## Stacks (STX) Token Transfers

STX token transfers can be initiated with the `openSTXTransfer` function.

```tsx
import { openSTXTransfer } from '@stacks/connect';

openSTXTransfer({
  recipient: 'ST2EB9WEQNR9P0K28D2DC352TM75YG3K0GT7V13CV',
  amount: '100',
  memo: 'Testing STX Transfers!',
  authOrigin,
  appDetails: {
    name: 'SuperApp',
    icon: 'https://example.com/icon.png',
  },
  finished: data => {
    console.log(data.txId);
  },
});
```

When calling `openSTXTransfer`, you need to specify a few details. Here are the options you have:

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

| parameter  | type     | optional | description                                                                                                                                                                |
| ---------- | -------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| recipient  | string   | false    | The STX Address for the recipient of this STX transfer                                                                                                                     |
| amount     | string   | false    | The amount of microstacks (µSTX) to be transferred. This argument is a string to prevent floating point errors. There are 1,000,000 µSTX per STX.                          |
| memo       | string   | true     | An optional memo to include in the transaction.                                                                                                                            |
| appDetails | object   | false    | A dictionary that includes `name` and `icon`                                                                                                                               |
| finished   | function | false    | A callback that is fired when the transaction is signed and broadcasted. Your callback will receive an object back with a `txId` and a `txRaw`, both of which are strings. |
| authOrigin | string   | true     | Location of the authenticator to use for signing. Defaults `"https://app.blockstack.org"`.                                                                                 |

## Deploy smart contract

To allow your app's users to deploy Clarity smart contracts, use the `openContractDeploy` method.

```tsx
import { openContractDeploy } from '@blockstack/connect';

const codeBody = '(begin (print "hello, world"))';

openContractDeploy({
  contractName: 'my-contract-name',
  codeBody,
  appDetails: {
    name: 'SuperApp',
    icon: 'https://example.com/icon.png',
  },
  finished: data => {
    console.log(data.txId);
  },
});
```

Here is the interface for the options you can provide to `openContractDeploy`:

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

| parameter    | type     | optional | description                                                                                                                                                                   |
| ------------ | -------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| codeBody     | string   | false    | The Clarity source code for this contract                                                                                                                                     |
| contractName | string   | false    | The name for this contract                                                                                                                                                    |
| appDetails   | object   | false    | A dictionary that includes `name` and `icon`                                                                                                                                  |
| finished     | function | false    | A callback that is fired when the transaction is signed and broadcasted. Your callback will receive an object back with a `txId` and a `txRaw`, both of which are strings.    |
| authOrigin   | string   | true     | The location of the authenticator. This is only necessary when developing the authenticator locally, or when using beta features. Defaults to `"https://app.blockstack.org"`. |

## Usage in React Apps

Make sure you follow the [setup instructions](/authentication/building-todo-app#onboard-into-your-first-stacks-app) first. When you're using
`useConnect`, you don't have to specify `appDetails` - we'll pick that up from your existing configuration.

Each transaction signing method is exposed through the `useConnect` hook, but they're prefixed with `do` instead of
`open`, to remain consistent with our React action naming standards.

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

## Network settings

TBD: instructions on toggling network

You may find it useful to request testnet STX from [the faucet](https://testnet.blockstack.org/faucet) while developing and testing your app with the Stacks testnet.
