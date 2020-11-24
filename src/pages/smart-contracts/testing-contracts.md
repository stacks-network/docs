---
title: Testing Clarity code
description: Learn to Test Clarity Contract Code with JavaScript and Mocha.
experience: advanced
duration: 15 minutes
---

## Introduction

Clarity, the smart contracting language, is based on [LISP](<https://en.wikipedia.org/wiki/Lisp_(programming_language)>). Clarity is an interpreted language, and [decidable](https://en.wikipedia.org/wiki/Recursive_language). In this tutorial, you will learn how to test Clarity and how use [Mocha](https://mochajs.org/) to test Clarity contracts while you develop them.

- Have a working Clarity starter project
- Understand how to test Clarity code using `.ts` files and Mocha.

## Prerequisites

### Node environment

To complete the tutorial, you should have [NodeJS](https://nodejs.org/en/download/) installed on your workstation. To install and run the starter project, you need to have at least version `8.12.0`. You can verify your installation by opening up your terminal and run the following command:

```bash
node --version
```

## Download a starter project

Using your terminal, run the following command to create a new folder and initialize a new project:

```bash
mkdir hello-world; cd hello-world
npm init clarity-starter
```

After the starter project is loaded up, you have to select a template and a name for your local project folder. Feel free to hit ENTER both times to accept the default suggestion.

```bash
? Template - one of [hello-world, counter]: (hello-world)
```

Finally, after the project dependencies have been installed, your project is ready for development.

The project resources are created in your current folder. Take note of the `contracts` and `test` folders. The other files are boilerplate to wire up the project.

## Run tests

The starter project comes with test tooling already set up for you using [Mocha](https://mochajs.org/). Let's run the tests and review the results:

Still in the project root directory, run the following command:

```bash
npm test
```

You should see the following response:

```bash
  hello world contract test suite
    ✓ should have a valid syntax
    deploying an instance of the contract
    ✓ should return 'hello world'
    ✓ should echo number

3 passing (412ms)
```

Great, all tests are passing! Now, let's have a look at the test implementation. That helps understand how to interact with Clarity smart contracts.

## Interact with contracts

Tests are located in the `test` folder, let's have a look at the tests associated with the `hello-world.clar` file.

Run the following command:

```bash
cat test/hello-world.ts
```

Take a few seconds to review the contents of the file. You should ignore the test setup functions and focus on the most relevant parts related to Clarity.

Note that we're importing modules from the `@blockstack/clarity` package:

```js
import { Client, Provider, ProviderRegistry, Result } from '@blockstack/clarity';
```

### Initializing a client

At the test start, we are initializing a contract instance `helloWorldClient` and a provider that simulates interactions with the Stacks 2.0 blockchain. If this were in a production environment, the contract instance would be the equivalent of a contract deployed to the blockchain. The provider would be the Stacks blockchain.

```js
let helloWorldClient: Client;
let provider: Provider;

(...)

provider = await ProviderRegistry.createProvider();
helloWorldClient = new Client("SP3GWX3NE58KXHESRYE4DYQ1S31PQJTCRXB3PE9SB.hello-world", "hello-world", provider);
```

Take a look at the client initialization. It requires a contract identifier in the following format: `{contract_address}.{contract_name}`. The second argument indicates the location of the smart contract file, without the `.clar` suffix. By default, the location is assumed to be relative to the `contracts` folder.

As you can see above, a sample Stacks address and contract identifier is already provided for you. You don't need to modify anything.

### Checking syntax

Next, we check the contract for valid syntax. If the smart contract implementation has syntax error (bugs), this check would fail:

```js
await helloWorldClient.checkContract();
```

Note that the `checkContract()` function returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). The `await` command makes sure JavaScript is not executing the next lines until the contract check completes.

### Deploying contract

Further down in the file, you find a contract deployment:

```js
await helloWorldClient.deployContract();
```

### Run public functions

Finally, you will find snippets that call the public `say-hi` function of the contract:

```js
const query = helloWorldClient.createQuery({ function: { name: 'say-hi', args: [] } });
const receipt = await helloWorldClient.submitQuery(query);
const result = Result.unwrapString(receipt);
```

As you see, smart contract calls are realized through query definitions. The `createQuery` function defines the name and arguments passed to the smart contract function. With `submitQuery`, the function is executed and the response is wrapped into a `Result` object. To obtain the readable result, we use the `unwrapString` function, which should return `hello world`.

Now, review the last test `should echo number` on your own and try to understand how arguments are passed to the `echo-number` smart contract.

---

With the completion of this tutorial, you:

- Created a working Clarity starter project
- Understood how to test Clarity contracts

Congratulations!
