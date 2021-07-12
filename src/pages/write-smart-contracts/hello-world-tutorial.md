---
title: Hello, World
description: Learn the basics of Clarity and write a simple Hello World smart contract.
duration: 15 minutes
experience: beginner
tags:
  - tutorial
images:
  large: /images/pages/hello-world.svg
  sm: /images/pages/hello-world-sm.svg
---

## Introduction

In the world of smart contracts, everything is a blockchain transaction. You use tokens in your wallet to deploy a
smart contract in a transaction, and each call to that contract after it's published is also a transaction. Because
block times can affect how quickly a function is executed and returned, it's advantageous to perform local development
and testing of smart contracts with a simulated blockchain, so that functions execute immediately. This tutorial
introduces you to local smart contract development with [Clarinet][], a development tool for building and testing
Clarity smart contracts.

Clarity, the smart contract language used on the Stacks Blockchain, is a LISP-based language and uses its
parenthesized notation. Clarity is an [interpreted language](https://en.wikipedia.org/wiki/Interpreted_language), and
[decidable](https://en.wikipedia.org/wiki/Recursive_language). To learn more basics about the language, see the
[Introduction to Clarity](/write-smart-contracts/overview) topic.

In this tutorial you will:

- Create a new Clarinet project
- Add a new Clarity contract to the project
- Populate the contract with 2 types of functions
- Execute the functions in a local, simulated blockchain
- Optionally, deploy and test the contract on the testnet blockchain

## Prerequisites

For this tutorial, you should have a local installation of Clarinet. Refer to [Installing Clarinet][] for instructions
on how to set up your local environment. You should also have a text editor or IDE to edit the Clarity smart contract.

Note that you could also complete the coding portion of this tutorial in an online REPL such as [clarity.tools][]. If
you are using the online REPL, you can skip to [step 3][] of the tutorial and enter the code into the sandbox.

If you are using Visual Studio Code, you may want to install the [Clarity Visual Studio Code plugin][].

### Optional prerequisites

While this tutorial primarily focuses on local smart contract development, you may wish to deploy your contract to
a live blockchain. For simplicity, contract deployment is performed using the [testnet sandbox][]. If you wish to
complete the optional deployment step, you should have the [Stacks Web Wallet][] installed, and you should request
testnet STX tokens from the [testnet faucet][] on the testnet explorer. Note that requesting testnet STX from the faucet
can take up to 15 minutes, so you may wish to request the tokens before beginning the tutorial.

## Step 1: create a new project

With Clarinet installed locally, open a new terminal window and create a new Clarinet project with the command:

```sh
clarinet new clarity-hello-world && cd clarity-hello-world
```

This command creates a new directory for your smart contract project, populated with boilerplate configuration and
testing files. Creating a new project only creates the Clarinet configuration, in the next step you can add a contract
to the project.

## Step 2: create a new contract

From the `clarity-hello-world` directory, create a new Clarity contract with the command:

```sh
clarinet contract new hello-world
```

This command adds a new `hello-world.clar` file in the `contracts` directory, and adds a `hello-world_test.ts` file to
the `test` directory. This tutorial ignores the test file, but for production contracts, you can create [unit tests][]
using it.

## Step 3: add code to the hello-world contract

Open the `contracts/hello-world.clar` file in a text editor or IDE. Delete the boilerplate comments, for the purpose of
this tutorial they're not necessary.

For this tutorial, you'll add two Clarity functions to the contract. Clarity functions are fully enclosed in
parentheses, and whitespace doesn't matter.

The first function is a public function called `say-hi`.

```clarity
(define-public (say-hi)
  (ok "hello world"))
```

Public functions in Clarity are callable from other smart contracts, which enables you to break complex tasks into
smaller, simpler smart contraxcts (an exercise in [separating concerns][]).

-> To create private functions, you would use the `define-private` keyword. Private functions can only be called from
within the smart contract they're declared in. External contracts can only call public functions.

The function doesn't take any parameters and simply returns "hello world" using the [`ok`][] response constructor.

The second function is a [read-only function][] called `echo-number`.

```clarity
(define-read-only (echo-number (val int))
  (ok val))
```

Read-only functions are also public functions, but as the name implies, they can't change any variables or datamaps.
`echo-number` takes an input parameter of type `int` and uses an [`ok`][] response to return the value passed to the
function.

-> Clarity supports a variety of other [types](/references/language-types)

The full `contracts/hello-world.clar` file should look like this:

```clarity
(define-public (say-hi)
  (ok "hello world"))

(define-read-only (echo-number (val int))
  (ok val))
```

In the following steps you can interact with this contract in the local console. You can optionally deploy this contract
to the testnet and interact with it on a live blockchain.

## Step 4: interact with the contract in the Clarinet console

In the `clarity-hello-world` directory in your terminal, use the following command to verify that the syntax in
your contract is correct:

```sh
clarinet check
```

If there are no errors, the command returns no output. If there are errors, verify that your
contract is exactly as listed in the preceding section.

In the same directory, use the following command to launch the local console:

```sh
clarinet console
```

This console is a Clarinet read-eval-print loop (REPL) that executes Clarity code instantly when a function is called.
When the Clarinet console is invoked, it provides a summary of the available contracts and the simulated wallets in
memory:

```sh
clarity-repl v0.11.1
Enter "::help" for usage hints.
Connected to a transient in-memory database.
Contracts
+-------------------------------------------------------+-------------------------+
| Contract identifier                                   | Public functions        |
+-------------------------------------------------------+-------------------------+
| ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.hello-world | (echo-number (val int)) |
|                                                       | (say-hi)                |
+-------------------------------------------------------+-------------------------+

Initialized balances
+------------------------------------------------------+---------+
| Address                                              | STX     |
+------------------------------------------------------+---------+
| ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE (deployer) | 1000000 |
+------------------------------------------------------+---------+
| ST1J4G6RR643BCG8G8SR6M2D9Z9KXT2NJDRK3FBTK (wallet_1) | 1000000 |
+------------------------------------------------------+---------+
| ST20ATRN26N9P05V2F1RHFRV24X8C8M3W54E427B2 (wallet_2) | 1000000 |
+------------------------------------------------------+---------+
| ST21HMSJATHZ888PD0S0SSTWP4J61TCRJYEVQ0STB (wallet_3) | 1000000 |
+------------------------------------------------------+---------+
| ST2QXSK64YQX3CQPC530K79XWQ98XFAM9W3XKEH3N (wallet_4) | 1000000 |
+------------------------------------------------------+---------+
| ST3DG3R65C9TTEEW5BC5XTSY0M1JM7NBE7GVWKTVJ (wallet_5) | 1000000 |
+------------------------------------------------------+---------+
| ST3R3B1WVY7RK5D3SV5YTH01XSX1S4NN5B3QK2X0W (wallet_6) | 1000000 |
+------------------------------------------------------+---------+
| ST3ZG8F9X4VKVTVQB2APF4NEYEE1HQHC2EDBF09JN (wallet_7) | 1000000 |
+------------------------------------------------------+---------+
| STEB8ZW46YZJ40E3P7A287RBJFWPHYNQ2AB5ECT8 (wallet_8)  | 1000000 |
+------------------------------------------------------+---------+
| STFCVYY1RJDNJHST7RRTPACYHVJQDJ7R1DWTQHQA (wallet_9)  | 1000000 |
+------------------------------------------------------+---------+
```

The console provides the ability to interact with your contract using Clarity commands. Call the `say-hi` function
with the following command:

```clarity
(contract-call? .hello-world say-hi)
```

The console immediately returns `(ok "hello world")`, the expected return value of the function.

Next, call the `echo-number` function:

```clarity
(contract-call? .hello-world echo-number 42)
```

The console immediately returns `(ok 42)`, the expected return value of the function with the parameters you called it
with.

Try calling the `echo-number` function with an incorrect type, in this case an unsigned integer:

```clarity
(contract-call? .hello-world echo-number u42)
```

The console should return `Analysis error: expecting expression of type 'int', found 'uint'`, indicating that the call
to the contract was invalid due to the incorrect type.

=> You have now learned the basics of Clarity and working with the Clarinet development tool. You may
wish to optionally deploy the contract to the testnet, described in the next and final step.

## Optional: deploy and test the contract on the testnet

For this tutorial, you'll use the [testnet sandbox][] to deploy your smart contract. Make sure you have connected your
[Stacks web wallet][] to the sandbox using the **Connect wallet** button, then copy and paste your smart contract into
the Clarity code editor on the **Write & Deploy** page. Edit the contract name or use the randomly generated name
provided to you.

![Hello world testnet sandbox](/images/hello-world-testnet-sandbox.png)

Click **Deploy** to deploy the contract to the blockchain. This will display the Stacks web wallet window with
information about the transaction. Verify that the transaction looks correct, and the network is set to `Testnet`, and
click **Confirm**.

The contract is added to the miners mempool, and included in the next block of the blockchain. This process can take up
to 15 minutes to complete. You can review it on the [transactions][] page of the explorer or in the activity field
of your web wallet.

When your contract is confirmed, navigate to the [call a contract][] page of the sandbox, and search for your contract.
Enter your wallet address in the top field, you can copy this address by clicking the Stacks web wallet icon and
clicking the **Copy address** button. Enter the contract name in the bottom field, in this case `hello-world`. Click
**Get Contract** to view the contract.

![Hello world sandbox contract](/images/hello-world-sandbox-contract.png)

Click the `say-hi` function in the function summary, then click **Call Function** to perform the function call in the
sandbox. This will display the Stacks web wallet with information about the transaction. Verify the information, then
click **Confirm** to execute the function call.

The function call is added to the miners mempool, and is executed in the next block of the blockchain. This process
can take up to 15 minutes to complete. You can review it on the [transactions][] page of the explorer or in the
activity field of your web wallet.

When the transaction is complete, you can access the transaction summary page from the activity panel in your web
wallet. The transaction summary page displays the output of the function:

![Hello world transaction summary](/images/hello-world-transaction-summary.png)

=> You have now learned one method of deploying and interacting with smart contracts on Stacks. You have also learned
the strengths of performing local development without having to wait for block times.

[clarinet]: /write-smart-contracts/clarinet
[installing clarinet]: /write-smart-contracts/clarinet#installing-clarinet
[clarity.tools]: https://clarity.tools
[testnet sandbox]: https://explorer.stacks.co/sandbox/deploy?chain=testnet
[stacks web wallet]: https://www.hiro.so/wallet/install-web
[testnet faucet]: https://explorer.stacks.co/sandbox/faucet?chain=testnet
[step 3]: #step-3-add-code-to-the-hello-world-contract
[unit tests]: /write-smart-contracts/clarinet#testing-with-clarinet
[separating concerns]: https://en.wikipedia.org/wiki/Separation_of_concerns
[`ok`]: /references/language-functions#ok
[read-only function]: /references/language-functions#define-read-only
[transactions]: https://explorer.stacks.co/transactions?chain=testnet
[call a contract]: https://explorer.stacks.co/sandbox/contract-call?chain=testnet
[clarity visual studio code plugin]: https://marketplace.visualstudio.com/items?itemName=HiroSystems.clarity-lsp
