---
layout: smart
description: "Clarity: Hello World Tutorial"
permalink: /:collection/:path.html
---
# Hello World

| Experience | | **Beginner**  |
| Duration | | **15 minutes** |

In this tutorial, you learn how to use Clarity, Blockstack's smart contracting language. By the end of this tutorial, you will ...

* Have a working Clarity starter project
* Understand basic Clarity language design principles
* Understand how to interact with smart contracts
* Understand how to test smart contracts

## Overview

* TOC
{:toc}

## Prerequisites

To complete the tutorial, you should have [NodeJS](https://nodejs.org/en/download/) installed on your workstation. To install and run the starter project, you need to have at least version `8.12.0`. You can verify your installation by opening up your terminal and run the following command:

```shell
node --version
```

A version >= `v8.12.0` should be returned, indicating that a compatible NodeJS release is installed.

## Step 1: Downloading starter project

In this step, you initialize a starter project for Clarity development:

1. Using your terminal, run the following command to create a new folder and initialize a new project:

    ```bash
    mkdir hello-world; cd hello-world
    npm init clarity-starter
    ```

2. After the starter project was loaded up, you have to select a template and a name for your local project folder. Feel free to hit ENTER both times to accept the default suggestion.

    ```bash
    ? Template - one of [hello-world, counter]: (hello-world)
    ```

    Finally, after the project dependencies have been installed, your project is ready for development.

3. The project resources are created in your current folder. Have a look at the project structure:

    ```bash
    ls
    ```

    Take note of the `contracts` and `test` folders. The other files are boilerplate to wire up the project.

## Step 2: Reviewing hello world contract

Now, let's have a look at a Clarity smart contract and get familiar with the basic language design characteristics.

1. Still inside the terminal, list the contents of the `contracts` folder.

    ```bash
    ls contracts
    ```

    This directory contains one file for the hello world smart contract. Note that all Clarity files have a `.clar` suffix.

2. Let's review the contents of `hello-world.clar` with the `cat` command.

    ```bash
    cat contracts/hello-world.clar
    ```

    You should see the contract source code. Take a few seconds to review the content.

    Clarity is a programming language based on [LISP](https://en.wikipedia.org/wiki/Lisp_(programming_language)). Most notably, Clarity is interpreted and decidable.

    Let's go through the source code. Notice how the program and each statement is enclosed in `()` (parentheses). You'll see that the smart contract consists of two public functions. Starting at the top, let's review line by line:

    ```cl
    (define-public (say-hi)
      (ok "hello world"))

    (define-public (echo-number (val int))
      (ok val))
    ```

    On the first line, a new public function `say-hi` is declared. To create private functions, you would use the `define-private` keyword. Private functions can only be executed by the current smart contract - not from other smart contracts published to the same network. Only public functions can be called from other contracts. The reason public functions exist is to enable re-using code that is already available in other smart contracts, and to enable developers to break complex smart contracts into smaller, simpler smart contracts (an exercise in [separating concerns](https://en.wikipedia.org/wiki/Separation_of_concerns)).

    The function doesn't take any parameters and simply returns "hello world" using the [`ok`](https://docs.blockstack.org/core/smart/clarityref#ok) response constructor.

    Let's review the second public function, `echo-number`. As opposed to the function before, this takes an input parameter of the type [`int`](https://docs.blockstack.org/core/smart/clarityref#int-type). Along with integer, Clarity supports the following types:
   * [uint](https://docs.blockstack.org/core/smart/clarityref#uint-type): 16-byte unsigned integer
   * [principal](https://docs.blockstack.org/core/smart/clarityref#principal-type): spending entity, roughly equivalent to a Stacks address
   * [boolean](https://docs.blockstack.org/core/smart/clarityref#bool-type): `true` or `false`
   * [buffer](https://docs.blockstack.org/core/smart/clarityref#buffer-type): fixed-length byte buffers
   * [tuple](https://docs.blockstack.org/core/smart/clarityref#tuple-type): named fields in keys and values

    The function simply uses the `ok` response and returns the value passed to the function.

## Step 3: Running tests

The starter project comes with test tooling already set up for you (using [Mocha](https://mochajs.org/)). Let's run the tests and review the results:

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

## Step 4: Interacting with contracts

Tests are located in the `test` folder, let's have a look at the tests associated with the `hello-world.clar` file.

Run the following command:

```bash
cat test/hello-world.ts
```

Take a few seconds to review the contents of the file. You should ignore the test setup functions and focus on the most relevant parts related to Clarity.

Note that we're importing modules from the `@blockstack/clarity` package:

```js
import { Client, Provider, ProviderRegistry, Result } from "@blockstack/clarity";
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

Take a look at the client initialization. It requires a contract id and name in the following format: `{owner_stacks_address}.{contract_identifier}`. The second field indicates the location of the smart contract file, without the `.clar` suffix. By default, the location is assumed to be relative to the `contracts` folder.

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
const query = helloWorldClient.createQuery({ function: { name: "say-hi", args: [] } });
const receipt = await helloWorldClient.submitQuery(query);
const result = Result.unwrapString(receipt);
```

As you see, smart contract calls are realized through query definitions. The `createQuery` function defines the name and arguments passed to the smart contract function. With `submitQuery`, the function is executed and the response is wrapped into a `Result` object. To obtain the readable result, we use the `unwrapString` function, which should return `hello world`.

Now, review the last test `should echo number` on your own and try to understand how arguments are passed to the `echo-number` smart contract.

---

With that, you have completed the first Clarity tutorial! In just a few minutes you ...

* Created a working Clarity starter project
* Understood basic Clarity language design principles
* Understood how to interact with smart contracts
* Understood how to test smart contracts

Congratulations!

## Where to go next

{:.no_toc}

* <a href="tutorial-counter.html">Next tutorial: Writing a counter smart contract</a>
* <a href="clarityRef.html">Clarity language reference</a>
