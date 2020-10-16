---
title: Setting up local environment
description: Learn how to set up your local smart contract development environment
duration: 30 minutes
experience: intermediate
---

## Introduction

As soon as you get to work on your smart contracts and testing them end to end within your application, you need a local development environment that supports all steps and helps you achieve faster iteration cycles. This is critical because transaction times on the testnet take a few minutes and would slow you down. The solution is to run a local version of the testnet, often called a "mocknet".

By the end of this tutorial, you will:

- Have all required tooling and services up and running locally
- Be able to deploy and test smart contracts inside your app

## Prerequisites

### Prior tutorials

You need to be familiar with Clarity and the Stacks authentication (using Connect). Please finish all previous tutorials, especially the [Counter tutorial](/smart-contracts/counter-tutorial) and the [Building a todo app tutorial](/authentication/building-todo-app).

### Environment

You should have [NodeJS](https://nodejs.org/en/download/) and [Docker](https://docs.docker.com/get-docker/) installed on your workstation.

## Overview

For a complete local mocknet setup, you need the following services:

- [Stacks Node](https://github.com/blockstack/stacks-blockchain)
- [Stacks Blockchain API](https://github.com/blockstack/stacks-blockchain-api)
- [Stacks Explorer](https://github.com/blockstack/explorer)

## Step 1: Spin up mocknet

The easiest way to spin up the Node, Blockchain API, and the Explorer locally is with Docker:

```bash
git clone https://github.com/blockstack/stacks-local-dev
cd stacks-local-dev/
docker-compose up -d
```

-> Make sure your Docker service is up and running

The initial start will take a few minutes. As soon as it is complete, you should be able to open up [http://localhost:3999/](http://localhost:3999/) and see:

```js
{"status":"ready"}
```

~> The Stacks Node is running on port `20443`, the Stacks Blockchain API on `3999` and the Stacks Explorer is on port `3000`.

## Step 2: Deploy your contract

~> Make sure you completed the [Counter tutorial](/smart-contracts/counter-tutorial). A working contract and test-driven development setup is recommended

When you develop your contract in a test-driven fashion, you will aim to complete the contract before deploying it to the testnet. Only once the contract is ready to be tested inside your app (or together with other contracts), you will need to deploy it. The fastest way to do so is by using the CLI:

```shell
# install the new CLI if not done yet
npm install --global @stacks/cli

# deploy the contract:
# deploy_contract <SOURCE_FILE> <CONTRACT_NAME> <FEE> <NONCE> <PAYMENT_KEY> -t -T <NETWORK_ADDRESS>
blockstack deploy_contract ./counter.clar counter 2000 0 cb3df38053d132895220b9ce471f6b676db5b9bf0b4adefb55f2118ece2478df01 -t -T http://localhost:20443
```

-> You can use one of the [default testnet keys](https://github.com/blockstack/stacks-blockchain-api/blob/e6e445b2cd1055f4bf25af7af646405783d5877e/src/api/routes/debug.ts#L36-L52) as your payment key

The CLI will respond with a new contract deploy transaction:

```js
{
  txid: '4bc11e1334c52852111142d55e5bbcfadbbb3441c44aa29a4bc507f7d2239377',
  transaction: 'https://testnet-explorer.now.sh/txid/0x4bc11e1334c52852111142d55e5bbcfadbbb3441c44aa29a4bc507f7d2239377'
}
```

If you have to deploy a new version of your contract, it is much simpler to reset the local mocknet that to deploy a new contract with a different identifier. Changing contract identifiers across projects can cause mistakes. To reset the mocknet, you can run the following inside the `stacks-local-dev` folder:

```bash
# make sure you are inside the stacks-local-dev folder
# shutdown and start back up
docker-compose down; docker-compose up -d
```

## Step 3: Create an app

With all the previous services running and a working smart contract, you are ready to test the contract inside an app. We will reuse the [app from the todo tutorial](/authentication/building-todo-app).

-> If you already have this project, or your own app, you can skip this step

```bash
git clone https://github.com/blockstack/blockstack-todos.git
cd blockstack-todos
npm install --saveDev @stacks/network@1.0.0-beta.8
npm install
npm run start
```

The command will identify that port 3000 being used already (by the Explorer running inside Docker). Hit `Y` to accept using port 3001. Once the app is running, a new windoe will open up ([http://localhost:3001/](http://localhost:3001/)), displaying the homepage.

### Add contract calls

Let's add a few sample contract calls to the application! You will use the `counter.clar` contract that should be deployed already.

Open the todo project with the editor of your choice. Inside the `src/components/TodoList.jsx` file, add a few more imports:

```js
import { openContractCall } from '@blockstack/connect';
import { Button } from '@blockstack/ui';
import { callReadOnlyFunction, cvToString } from '@blockstack/stacks-transactions';
import { StacksMocknet } from '@stacks/network';
```

Next, add a read-only contract call method.

-> Read-only contract calls do not require transactions to be created or broadcasted to the network. The read-only calls are regular API calls that return the result

```js
...
// const { userSession } = authOptions;

// load user data from session
const userData = userSession.loadUserData();

const doReadOnlyCall = async name => {
  const opts = {
    contractAddress: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6',
    contractName: 'counter',
    functionName: name,
    functionArgs: [],
    network: new StacksMocknet(),
    senderAddress: userData.profile.stxAddress,
  };

  const resp = await callReadOnlyFunction(opts);

  console.log(cvToString(resp));
};
```

Now, add a regular contract call method right below the privous code. This method will create and broadcast a new transaction to the network.

```js
const doContractCall = async name => {
  const opts = {
    contractAddress: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6',
    contractName: 'counter',
    functionName: name,
    functionArgs: [],
    network: new StacksMocknet(),
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

Finally, you need to add three buttons for the contract calls inside the `return` method on the bottom of the file:

```js
<Box mt={[5, '60px']}>
  <Button onClick={() => doContractCall('increment')}>Increment</Button>
  <Button onClick={() => doContractCall('decrement')}>Decrement</Button>
  <Button onClick={() => doReadOnlyCall('get-counter')}>Get counter</Button>
</Box>
```

You should be able to see the three new buttons on the bottom of the view!

### Try it out

You have all projects in place to develop and test your smart contract locally on your mocknet.

Try out the contract calls you just added. Open the web app and click the `Increment` button (after logging in).

Do **not** click confirm yet! Your new Secret Key account is associated with a Stacks (STX) address that has no funds yet. You can use the local mocknet faucet to get some funds.

Copy the `tx-sender` field in the preview screen of the transaction and close the screen. Now run a faucet call:

```bash
curl -X POST http://localhost:3999/extended/v1/faucets/stx?address=<tx-sender>
```

Now you should have funds on your account. Go back to the web app and click the `Increment` button again. On the top left of the transaction window it should display: `500 STX available`.

You can proceed and click on `Confirm transaction`. The window will close.

Now, repeat this process at your own will and hit the `Get counter` button. Open up the console view of your browser and you will notice the counter number printed accordingly.

=> **Congratulations!** You have a fully functioning local development environment up and running

With the completion of this tutorial, you:

- Have all required tooling and services up and running locally
- Can deploy and test smart contracts inside your app
