---
title: Transaction signing
description: Prompt users to sign and broadcast transactions to the Stacks blockchain
images:
  large: /images/transaction-signing.svg
  sm: /images/transaction-signing.svg
---

## Introduction

This guide explains how to prompt users to sign [transactions](/understand-stacks/transactions) and broadcast them to the Stacks blockchain by implementing the [`connect`](https://github.com/blockstack/ux/tree/master/packages/connect#stacksconnect) package of Stacks.js.

Transaction signing provides a way for users execute [Clarity smart contracts](/write-smart-contracts/overview) that are relevant to your app then handle the result as appropriate.

Users can sign transactions that exchange fungible or non-fungible tokens with upfront guarantees that help them retain control over their digital assets.

There are three types of transactions:

1. STX transfer
2. Contract deployment
3. Contract execution

See the public registry tutorial for a concrete example of this functionality in practice.

[@page-reference]
| /build-apps/tutorials/public-registry

## Install dependency

~> With the recent launch of the Stacks Blockchain, the production release of `@stacks/connect` does not include a few key changes to help you build apps that integrate with the Stacks Mainnet and Testnet. If you're following this guide, you should install a beta version of `@stacks/connect` with the `launch-misc` tag on NPM, as described below. We expect this code to be officially released into the `@stacks/connect` package soon.

The following dependency must be installed:

```
npm install @stacks/connect@launch-misc
```

## Initiate session

Users must authenticate to an app before the `connect` package will work to prompt them for signing and broadcasting transactions to the Stacks blockchain with an authenticator such as [the Stacks Wallet](https://www.hiro.so/wallet/install-web).

See the authentication guide before proceeding to integrate the following transaction signing capabilities in cases where `userSession.isUserSignedIn()` returns `true`.

[@page-reference]
| /build-apps/guides/authentication

## Get the user's Stacks address

After your user has authenticated with their Stacks Wallet, you can get their Stacks address from their `profile`.

```ts
const profile = userSession.loadUserData().profile.stxAddress;

const mainnetAddress = stxAddresses.mainnet;
// "SP2K5SJNTB6YP3VCTCBE8G35WZBPVN6TDMDJ96QAH"
const testnetAddress = stxAddresses.testnet;
// "ST2K5SJNTB6YP3VCTCBE8G35WZBPVN6TDMFEVESR6"
```

## Prompt to transfer STX

Call the `openSTXTransfer` function provided by the `connect` package to trigger the display of a transaction signing prompt for transferring STX:

```tsx
import { openSTXTransfer } from '@stacks/connect';
import { StacksTestnet } from '@stacks/network';

const network = new StacksTestnet();

openSTXTransfer({
  recipient: 'ST2EB9WEQNR9P0K28D2DC352TM75YG3K0GT7V13CV',
  amount: '100',
  memo: 'Reimbursement',
  authOrigin,
  network,
  appDetails: {
    name: 'My App',
    icon: window.location.origin + '/my-app-logo.svg',
  },
  onFinish: data => {
    console.log('Stacks Transaction:', data.stacksTransaction);
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
  network: StacksNetwork;
  appDetails: {
    name: string;
    icon: string;
  };
  onFinish: (data: FinishedTxData) => void;
}
```

| parameter  | type          | required | description                                                                                                                                                                                          |
| ---------- | ------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| recipient  | string        | true     | STX address for recipient of transfer                                                                                                                                                                |
| amount     | string        | true     | Amount of microstacks (1 STX = 1,000,000 microstacks) to be transferred provided as string to prevent floating point errors.                                                                         |
| appDetails | object        | true     | Dictionary that requires `name` and `icon` for app                                                                                                                                                   |
| onFinish   | function      | true     | Callback executed by app when transaction has been signed and broadcasted. [Read more](#onFinish-option)                                                                                             |
| memo       | string        | false    | Optional memo for inclusion with transaction                                                                                                                                                         |
| authOrigin | string        | false    | URL of authenticator to use for prompting signature and broadcast. Defaults to `https://wallet.hiro.so` for the Stacks Wallet, which is handled by the Stacks Wallet browser extension if installed. |
| network    | StacksNetwork | false    | Specify the network that this transaction should be completed on. [Read more](#network-option)                                                                                                       |

## Prompt to deploy smart contract

Call the `openContractDeploy` function provided by the `connect` package to trigger the display of a transaction signing prompt for deploying a smart contract:

```tsx
import { openContractDeploy } from '@stacks/connect';

const codeBody = '(begin (print "hello, world"))';

openContractDeploy({
  contractName: 'my-contract-name',
  codeBody,
  appDetails: {
    name: 'My App',
    icon: window.location.origin + '/my-app-logo.svg',
  },
  onFinish: data => {
    console.log('Stacks Transaction:', data.stacksTransaction);
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
  network: StacksNetwork;
  appDetails: {
    name: string;
    icon: string;
  };
  onFinish: (data: FinishedTxData) => void;
}
```

| parameter    | type          | required | description                                                                                                                                                                                          |
| ------------ | ------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| codeBody     | string        | true     | Clarity source code for contract                                                                                                                                                                     |
| contractName | string        | true     | Name for contract                                                                                                                                                                                    |
| appDetails   | object        | true     | Dictionary that requires `name` and `icon` for app                                                                                                                                                   |
| onFinish     | function      | true     | Callback executed by app when transaction has been signed and broadcasted. [Read more](#onFinish-option)                                                                                             |
| authOrigin   | string        | false    | URL of authenticator to use for prompting signature and broadcast. Defaults to `https://wallet.hiro.so` for the Stacks Wallet, which is handled by the Stacks Wallet browser extension if installed. |
| network      | StacksNetwork | false    | Specify the network that this transaction should be completed on. [Read more](#network-option)                                                                                                       |

-> Contracts will deploy to the Stacks address of the authenticated user.

## Prompt to execute contract

Call the `openContractCall` function provided by the `connect` package to trigger the display of a transaction signing prompt for executing a contract.

As an example, consider this simple Clarity contract:

```clarity
(define-public
  (my-func
    (arg-uint uint)
    (arg-int int)
    (arg-buff (buff 20))
    (arg-string-ascii (string-ascii 20))
    (arg-string-utf8 (string-utf8 20))
    (arg-principal principal)
    (arg-bool bool)
  )
  (ok u0)
)
```

To execute this function, invoke the `openContractCall` method. Use the `ClarityValue` types from `@stacks/transactions` to construct properly formatted arguments.

```tsx
import { openContractCall } from '@stacks/connect';
import {
  uintCV,
  intCV,
  bufferCV,
  stringAsciiCV,
  stringUtf8CV,
  standardPrincipalCV,
  trueCV,
} from '@stacks/transactions';

const functionArgs = [
  uintCV(1234),
  intCV(-234),
  bufferCV(Buffer.from('hello, world')),
  stringAsciiCV('hey-ascii'),
  stringUtf8CV('hey-utf8'),
  standardPrincipalCV('STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6'),
  trueCV(),
];

const options = {
  contractAddress: 'ST22T6ZS7HVWEMZHHFK77H4GTNDTWNPQAX8WZAKHJ',
  contractName: 'my-contract',
  functionName: 'my-func',
  functionArgs,
  authOrigin,
  appDetails: {
    name: 'My App',
    icon: window.location.origin + '/my-app-logo.svg',
  },
  onFinish: data => {
    console.log('Stacks Transaction:', data.stacksTransaction);
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
  functionArgs?: ClarityValue[];
  network: StacksNetwork;
  authOrigin?: string;
  appDetails: {
    name: string;
    icon: string;
  };
  onFinish: (data: FinishedTxData) => void;
}
```

| parameter       | type             | required | description                                                                                                                                                                                                  |
| --------------- | ---------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --- |
| contractAddress | string           | true     | Stacks address to which contract is deployed                                                                                                                                                                 |
| contractName    | string           | true     | Name of contract to sign                                                                                                                                                                                     |
| functionName    | string           | true     | Name of function for signing / execution, which needs to be a [public function](/references/language-functions#define-public).                                                                               |
| functionArgs    | `ClarityValue[]` | true     | Arguments for calling the function. [Learn more about constructing clarity values](https://github.com/blockstack/stacks.js/tree/master/packages/transactions#constructing-clarity-values). Defaults to `[]`. |
| appDetails      | object           | true     | Dictionary that requires `name` and `icon` for app                                                                                                                                                           |
| onFinish        | function         | true     | Callback executed by app when transaction has been signed and broadcasted. [Read more](#onFinish-option)                                                                                                     |     |
| authOrigin      | string           | false    | URL of authenticator to use for prompting signature and broadcast. Defaults to `https://wallet.hiro.so` for the Stacks Wallet, which is handled by the Stacks Wallet browser extension if installed.         |
| network         | StacksNetwork    | false    | Specify the network that this transaction should be completed on. [Read more](#network-option)                                                                                                               |

## Getting the signed transaction back after completion {#onFinish-option}

Each transaction signing method from `@stacks/connect` allows you to specify an `onFinish` callback. This callback will be triggered after the user has successfully broadcasted their transaction. The transaction will be broadcasted, but it will be pending until it has been mined on the Stacks blockchain.

You can access some information about this transaction via the arguments passed to `onFinish`. Your callback will be fired with a single argument, which is an object with the following properties:

```ts
interface FinishedTxData {
  stacksTransaction: StacksTransaction;
  txRaw: string;
  txId: string;
}
```

The `StacksTransaction` type comes from the [`@stacks/transactions`](https://github.com/blockstack/stacks.js/tree/master/packages/transactions) library.

## Specifying the network for a transaction {#network-option}

All of the methods included on this page accept a `network` option. By default, Connect uses a testnet network option. You can import a network configuration from the [`@stacks/network`](https://github.com/blockstack/stacks.js/tree/master/packages/network) package.

```ts
import { StacksTestnet, StacksMainnet } from '@stacks/network';

const testnet = new StacksTestnet();
const mainnet = new StacksMainnet();

// use this in your transaction signing methods:

openSTXTransfer({
  network: mainnet,
  // other relevant options
});
```

## Usage in React Apps

Import the `useConnect` from the [`connect-react`](https://github.com/blockstack/ux/tree/master/packages/connect-react) package to integrate transaction signing more seamlessly into React apps.

```
npm install @stacks/connect-react
```

Each transaction signing method is itself available as a function returned by `useConnect` though prefixed with `do` for consistency with React action naming standards:

- `openContractCall` as `doContractCall`
- `openSTXTransfer` as `doSTXTransfer`
- `openContractDeploy` as `doContractDeploy`

Use these functions with the same parameters as outlined above. However, you don't have to specify `appDetails` since they are detected automatically if `useConnect` has been used already [for authentication](/build-apps/guides/authentication#usage-in-react-apps).

```tsx
import { useConnect } from '@stacks/connect-react';

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

## Request testnet STX from faucet

You may find it useful to request testnet STX from [the Stacks Explorer sandbox](https://explorer.stacks.co/sandbox?chain=testnet) while developing your app with the Stacks testnet.
