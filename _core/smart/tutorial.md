---
layout: core
description: "Blockstack smart contracting language"
permalink: /:collection/:path.html
---
# Tutorial: Hello World

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

<div class="uk-card uk-card-default uk-card-body">
<h5>Early Release</h5>
<p>Clarity and its accompanying toolset are in early release. If you encounter issues with or have feature requests regarding Clarity, please create an issue on the <a href='https://github.com/blockstack/stacks-blockchain/issues' target='_blank'>blockstack/stacks-blockchain</a> repository. To read previous or join ongoing discussions about smart contracts in general and Clarity in particular, visit the <strong><a href='https://forum.blockstack.org/c/clarity' target='_blank'>Smart Contracts</a></strong> topic in the Blockstack Forum.
</p>
</div>

## Pre-requisites

To complete the tutorial, you should have [NodeJS](https://nodejs.org/en/download/) installed on your workstation. You can verify your installation by opening up your terminal and run the following command:

```shell
npm --version
```

A version should be returned, indicating that NodeJS installed successfully.

## Step 1: Installing Clarity JS SDK

In this step, you initialize a starter project for Clarity development:

1. Using your terminal, run the following command:

    ```bash
    npm init clarity-dev
    ```

2. After the starter project was loaded up, you are asked to name the starter project. Feel free to hit ENTER to accept the default suggestion.

    ```bash
    ? Project name (clarity-dev-project)
    ```

    Finally, the project dependencies are installed and your project is ready for development.

3. The project is located in a new folder, `clarity-dev-project` by default. Jump into the folder and have a look at the file structure:

    ```bash
    cd clarity-dev-project
    ls
    ```

    Take note of the `contracts` and `test` folders. The other files are boilerplate to wire up the project.

## Step 2: Reviewing hello world contract

Now, let's have a look at a Clarity smart contract and get familiar with the basic language design characteristics.

1. Still inside the terminal, list the contents of the `contracts/sample` folder.

    ```bash
    ls contracts/sample
    ```

    This directory contains a hello world Clarity contract. Note that all Clarity files have a `.clar` suffix.

2. Let's review the contents of `hello-world.clar` with the `cat` command.

    ```bash
    cat contracts/sample/hello-world.clar
    ```

    You should see the contract source code. Take a few seconds to review the content.

    Clarity is a programming language based on [LISP](https://en.wikipedia.org/wiki/Lisp_(programming_language)). Most notably, Clarity is designed for static analysis, not compiled, and **not** [Turing complete](https://en.wikipedia.org/wiki/Turing_completeness).

    Let's go through the source code. Notice how the program and each statement is enclosed in `()` (parentheses). You'll see that the smart contract consists of two public methods. Starting at the top, let's review line by line:

    ```cl
    (define-public (say-hi)
        (ok "hello world")
    )

    (define-public (echo-number (val int))
        (ok val)
    )
    ```

    On the first line, a new public method `say-hi` is declared. To create private functions, you would use the `define-private` function. Note that only public functions can be called from outside e.g., through other smart contracts.

    The method doesn't take any parameters and simply returns "hello world" using the [`ok`](https://docs.blockstack.org/core/smart/clarityref#ok) response constructor.

    Let's review the second public method, `echo-number`. As opposed to the function before, this takes an input parameter of the type [`int`](https://docs.blockstack.org/core/smart/clarityref#int-type). Along with integer, Clarity supports the following types:
   * [uint](https://docs.blockstack.org/core/smart/clarityref#uint-type): 16-byte unsigned integer
   * [principal](https://docs.blockstack.org/core/smart/clarityref#principal-type): spending entity, roughly equivalent to a Stacks address
   * [boolean](https://docs.blockstack.org/core/smart/clarityref#bool-type): `true` or `false`
   * [buffer](https://docs.blockstack.org/core/smart/clarityref#buffer-type): fixed-length byte buffers
   * [tuple](https://docs.blockstack.org/core/smart/clarityref#tuple-type): named fields in keys and values

    The function simply uses the `ok` response and returns the value passed to the method.

## Step 3: Running tests

Smart contracts are often developed in a test-driven approach to ensure code quality but also to speed up the development cycle by removing the need to push every change to the blockchain before executing it. We will do the same in this project. In fact, the started project comes with test tooling already set up for you (using [Mocha](https://mochajs.org/)). Let's run the tests and review the results:

1. Still in the project root directory, run the following command:

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

    Oh, it looks like we see some failed test! That is on purpose - we will implement a new smart contract in the next tutorial! After every increment of the contract, we will run the tests again to ensure we're on the right track. For now, let's have a look at how we can interact with Clarity smart contracts.

## Step 4: Interacting with contracts

Tests are located in the `test` folder, let's have a look at the tests associated with the `hello-world.clar` file.

Run the following command:
   
```bash
cat test/hello-world.ts
```

Take a few seconds to review the contents of the file. You should ignore the test setup methods and focus on the most relevant parts related to Clarity.

Note that we're importing modules form the `@blockstack/clarity` package:

```js
import { Client, Provider, ProviderRegistry, Result } from "@blockstack/clarity";
```

### Initiliazing a client

At the test start, we are initializing contract instance `helloWorldClient` and a provider that forwards commands to the Rust CLI in order to interact with the Stack2.0 blockchain.

 ```js
 let helloWorldClient: Client;
let provider: Provider;

...

provider = await ProviderRegistry.createProvider();
helloWorldClient = new Client("SP3GWX3NE58KXHESRYE4DYQ1S31PQJTCRXB3PE9SB.hello-world", "sample/hello-world", provider);
```

Take a look at the client initialization. It requires a contract id and name in the following format: `{contract_id}.{contract_name}`. The second parameter indicates the location of the smart contract file, without the `.clar` suffix. By default, the location is assuming to be relative to the `contracts` folder.

### Checking syntax

Next, we check the contract for valid syntax with:

```js
    await helloWorldClient.checkContract();
```

Note that the `checkContract()` method returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). The `await` command makes sure JavaScript is not executing the next lines until the contract check completes.

### Deploying contract

Further down in the file, you find a contract deployment:

```js
await helloWorldClient.deployContract();
```

### Run public methods

Finally, you will find snippets that call the public `say-hi` method of the contract:

```js
const query = helloWorldClient.createQuery({ method: { name: "say-hi", args: [] } });
const receipt = await helloWorldClient.submitQuery(query);
const result = Result.unwrapString(receipt);
```

As you see, smart contract calls are realized through query definitions. The `createQuery` method defines the name and arguments passed to the smart contract function. With `submitQuery`, the method executed and the response is wrapped into a `Result` object. To obtain the readable result, we use the `unwrapString` method, which should return `hello world`.

Now, review the last test `should echo number` on your own and try to understand how arguments are passed to the `echo-number` smart contract.

With that, you have completed the first Clarity tutorial! Congratulations!

## Where to go next

{:.no_toc}

* <a href="tutorial-counter.html">Next tutorial: Writing your first smart contract</a>
* <a href="clarityRef.html">Clarity language reference</a>
