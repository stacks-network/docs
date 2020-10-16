---
title: Setting up local environment
description: Learn how to setup a local smart contract development environment
duration: 45 minutes
experience: advanced
---

## Introduction

As soon as you get to work on your smart conrtacts and testing them end to end within your application, you need a local development environment that supports all steps and helps you achieve faster iteration cycles. This is critical because transaction times on the testnet take a few minutes and would slow you down. The solution is to run a local version of the testnet, often called a "mocknet".

By the end of this tutorial, you will:

- Have all required tooling and services up and running locally
- Be able to improve and re-deploy smart contracts quickly
- Test your smart contract inside your app

## Prerequisites

### Prior tutorials

You need to be familiar with Clarity and the Stacks authentication (using Connect). Please finish all previous tutorials, especially the [Counter tutorial](/smart-contracts/counter-tutorial) and the [Building a todo app tutorial](/authentication/building-todo-app).

### Environment

You should have [NodeJS](https://nodejs.org/en/download/) and [Docker](https://docs.docker.com/get-docker/) installed on your workstation.

## Overview

For a complete local mocknet setup, you need the following services and tools:

- [Stacks Node](https://github.com/blockstack/stacks-blockchain)
- [Stacks Blockchain API](https://github.com/blockstack/stacks-blockchain-api)
- [Stacks Explorer](https://github.com/blockstack/explorer)
- [Stack Authenticator](https://github.com/blockstack/ux/tree/master/packages/app)
- [Todo's web with Connect](https://github.com/blockstack/blockstack-todos/)

## Step 1: Set up Stacks Node and Blockchain API

The easiest way to spin up both of these locally is by booting up a docker image:

```bash
docker run -p 3999:3999 blockstack/stacks-blockchain-api-standalone mocknet
```

The initial start will take a few minutes. As soon as it is complete, you should be able to open up `http://localhost:3999/` and see:

```js
{"status":"ready"}
```

## Step 2: Set up Stacks Explorer

The Stacks Explorer makes it easy way to review transactions. Let's spin up a local version:

```bash
git clone https://github.com/blockstack/explorer.git
cd explorer
yarn
yarn dev
```

You should now be able to open up `http://localhost:3000/` and see the homepage. **Make sure to select `Localhost` from the network list on the top right side of the screen!**

Now, click on "Recent transactions" and you should see the two contracts.

## Step 3: Create sample contract project

Next, let's create a sample contract project:

```bash
cd ..
mkdir contracts
cd contracts
npm init clarity-starter
```

Select "Counter" and wait until all dependencies are installed.

Upon completion, open up the folder using [VSCode](https://code.visualstudio.com/). This editor is recommended because there are extension available to make Clarity development easier. Please install these extensions:

- [Clarity](https://marketplace.visualstudio.com/items?itemName=blockstack.clarity), the official language extension by Blockstack that defines the Clarity language for VS Code and provides auto-complete and syntax highlighting.
- [clarity-lsp](https://marketplace.visualstudio.com/items?itemName=lgalabru.clarity-lsp), which adds inline help functionality for Clarity to VS Code
- [Rainbow Brackets](https://marketplace.visualstudio.com/items?itemName=2gua.rainbow-brackets), which adds helpful colorization of matching pairs of parentheses while you code

!> Do not just search for "Clarity" in the marketplace. You might install the wrong extensions by accident.

## Step 4: Create contract deployment script

When you develop your contract, you will often redeploy your `.clar` files. The fastest way is to create a deployment script.

In the same contract project folder as before, install dependencies:

```bash
npm i @stacks/network @stacks/transactions --saveDev
```

Next, create the deployment script file:

```bash
mkdir scripts
cd scripts
touch deploy-contract.js
```

Finally, paste the following code:

```js
const readline = require('readline');
const fs = require('fs');
const { makeContractDeploy, broadcastTransaction } = require('@stacks/transactions');
const { StacksTestnet } = require('@stacks/network');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// set to local mocknet
const network = new StacksTestnet();
network.coreApiUrl = 'http://localhost:3999';

rl.question('Contract to deploy: /contracts/ ', async function (contract) {
  const fileUrl = `../contracts/${contract}.clar`;
  console.log(`Deploying contract from file: ${fileUrl}`);

  const txOptions = {
    contractName: `${contract}-${+new Date()}`,
    codeBody: fs.readFileSync(fileUrl).toString(),
    senderKey: 'cb3df38053d132895220b9ce471f6b676db5b9bf0b4adefb55f2118ece2478df01',
    network,
  };

  const transaction = await makeContractDeploy(txOptions);

  const txResult = await broadcastTransaction(transaction, network);

  if (typeof txResult === 'string') {
    console.log(`New transactions was broadcasted: http://localhost:3000/txid/0x${txResult}`);
  } else {
    console.log(txResult);
  }

  rl.close();
});

rl.on('close', function () {
  process.exit(0);
});
```

-> The script uses [default testnet keys](https://github.com/blockstack/stacks-blockchain-api/blob/e6e445b2cd1055f4bf25af7af646405783d5877e/src/api/routes/debug.ts#L36-L52)

You can now simply deploy a contract by running the script and entering the file your want to deploy (without the `.clar` extension):

```bash
node deploy-contract.js
# enter: "counter"

-> Contract to deploy: /contracts/ counter
-> Deploying contract from file: ../contracts/counter.clar
-> New transactions was broadcasted: http://localhost:3000/txid/0x65dac9d90092422a682204f44c74c3617647d5659e077f0d6052c4097825df8f
-> Contract name: counter-1602885440723
```

-> The docker image you spun up in the previous step needs to still be running

You will notice that the name of the new contract has a unix timestamp appended to it. This will ensure that you can redeploy the same file. It is a simple versioning mechanism. You have to make sure to always use the most recent contract name.

## Step 5: Set up Stacks Authenticator

Users of your web app will need to authenticate using their Secret Key before they could sign a Stacks transaction. The authentication needs to point to your local mocknet.

Let's spin up the authentication service:

```bash
cd ..
git clone https://github.com/blockstack/ux.git
cd ux
yarn
yarn lerna run dev --scope @blockstack/app
```

Once completed, you can open up `http://localhost:8080` and see a screen that indicates you are not logged in.

## Step 6: Create sample app

With all the previous services running, you are ready to integrate your smart contract inside an app. We will reuse the Stacks Todo's sample app:

```bash
cd ..
git clone https://github.com/blockstack/blockstack-todos.git
cd blockstack-todos
yarn
yarn start
```

The command will identify that port 3000 being used already (by the Explorer). Hit `Y` to accept using port 3001. Once the app is running, you should be able to open up `http://localhost:3001/` and see the homepage.

!> Do not proceed with the login just yet. You need to change the authenticator URL to the local service

### Point to local Stacks Authenticator

Inside the `src/components/App.jsx` file update the `authOptions`:

```js
const authOptions = {
  authOrigin: 'http://localhost:8080',
};
```

Inside the `src/components/Signin.jsx` file, update the `doOpenAuth` call:

```js
<Button onClick={() => doOpenAuth(false, { authOrigin: 'http://localhost:8080' })}>
  Get Started
</Button>
```

With these two changes, you can try out the app again and log in this time! You should be able to create a new Secret Key and finally land on the Todo list view.

### Add sample contract calls

Let's add a few sample contract calls to the application! You will use the `counter.clar` contract that you should've deployed by now.

Inside the `src/components/TodoList.jsx` file, add a few more imports:

```js
import { openContractCall } from '@blockstack/connect';
import { Button } from '@blockstack/ui';
import { callReadOnlyFunction, StacksTestnet, cvToString } from '@blockstack/stacks-transactions';
```

Next, add a read-only contract call method.

-> Read-only contract calls do not require transactions to be created or broadcasted to the network. The read-only calls are regular API calls that return the result

```js
// set to local mocknet
const network = new StacksTestnet();
network.coreApiUrl = 'http://localhost:3999';

...

// load user data from session
const userData = userSession.loadUserData();

...

const doReadOnlyCall = async name => {
  const opts = {
    contractAddress: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6',
    contractName: 'counter-1602876828853', // replace this
    functionName: name,
    functionArgs: [],
    network,
    senderAddress: userData.profile.stxAddress,
  };

  const resp = await callReadOnlyFunction(opts);

  console.log(cvToString(resp));
};
```

!> You have to replce the `contractName` field with your most recently deployed contract name

Now, add a regular contract call method. This method will create and broadcast a new transaction to the network.

```js
const doContractCall = async name => {
  const opts = {
    contractAddress: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6',
    contractName: 'counter-1602876828853', // replace this
    functionName: name,
    authOrigin: 'http://localhost:8080',
    functionArgs: [],
    appDetails: {
      name: "To-do's",
      icon: window.location.origin + '/logo.svg',
    },
    finished: data => {
      console.log('TX ID:', data.txId);
      console.log('Raw TX:', data.txRaw);
    },
  };

  await openContractCall(opts);
};
```

Finally, you need to add three buttons for the contract calls inside the `render` method:

```js
<Box mt={[5, '60px']}>
  <Button onClick={() => doContractCall('increment')}>Increment</Button>
  <Button onClick={() => doContractCall('decrement')}>Decrement</Button>
  <Button onClick={() => doReadOnlyCall('get-counter')}>Get counter</Button>
</Box>
```

You should be able to see the three new buttons on the bottom of the view!

### Try it out

You have all projects in place to develop and test your smart contract locally on your own mocknet.

Try out the contract calls you just added. Open the web app and click the `Increment` button (after logging in).

Do **not** click confirm yet! Your new Secret Key account is associated with a Stacks (STX) address that has no funds yet. You can use the local mocknet faucet to get some funds.

Copy the `tx-sender` field in the preview screen of the transaction and close the screen. Now run a faucet call:

```bash
curl -X POST http://localhost:3999/extended/v1/faucets/stx?address=<tx-sender>
```

Now you should have funds on your account. Go back to the web app and click the `Increment` button again. On the top left of the transaction window it should display: `500 STX available`.

You can proceed and click on `Confirm transaction`. The window will close.

-> You can see this new transactions in the Explorer: `http://localhost:3000/transactions`.

Now, repeat this process at your own will and hit the `Get counter` button. Open up the console view of your browser and you will notice the counter number printed accordibly.

=> **Congratulations!** You have a fully functioning local development environment up and running

With the completion of this tutorial, you:

- Have all required tooling and services up and running locally
- Can re-deploy smart contracts quickly
- Can test your smart contract inside your app
