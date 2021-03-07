---
title: Hello, World
description: Learn the basics of Clarity and write a simple Hello World smart contract.
duration: 18 minutes
experience: beginners
tags:
  - tutorial
images:
  large: /images/pages/hello-world.svg
  sm: /images/pages/hello-world-sm.svg
---

## Introduction

In the world of smart contracts, everything is a blockchain transaction. You use tokens in your wallet to deploy a smart contract in a transaction, and each call to that contract after it's published is a transaction, too. That means that at each step, tokens are being exchanged as transaction fees. This tutorial introduces you to this mode of programming, which transforms blockchains into powerful state machines capable of executing complex logic.

Clarity, the smart contracting language used on the Stacks Blockchain, is based on LISP and uses its parenthesized notation. Clarity is an [interpreted language](https://en.wikipedia.org/wiki/Interpreted_language), and [decidable](https://en.wikipedia.org/wiki/Recursive_language). To learn more basics about the language, see the [Introduction to Clarity](/write-smart-contracts/overview) topic.

By the end of this tutorial, you:

- Have a working Clarity starter project and local dev environment
- Understand basic Clarity language design principles
- Deploy a contract to the Stacks 2.0 blockchain and call its public methods
- Understand how to use the Stacks CLI

## Prerequisites

### Check the Stacks 2.0 status

The Stacks 2.0 blockchain is currently in development and could experience resets and downtimes. To make sure you're not running into any challenges related to the status of the network, please open up the [Status Checker](https://stacks-status.com/) and confirm that all systems are operational. If some systems seem to have issues, it's best to wait until they're back up before you proceed with the next steps.

## Step 1: open the playground

To avoid setting things up on your machine, you can run all instructions inside a virtual container inside your browser window, using a project called Gitpod.

**[Open this Gitpod in a new browser window](https://gitpod.io/#https://github.com/agraebe/clarity-onboarding-playground)**

Gitpod will require you to login with a Github account. Follow the steps described on the screen. Once completed, you can see code editor window:

![new gitpod](/images/pages/clarity/gitpod-new.png)

The Gitpod playground comes pre-installed with the [Stacks CLI](/references/stacks-cli).

## Step 2: set up a starter project

Using the terminal window on the bottom of the screen, run the following command to initialize a new project:

```bash
npm init clarity-starter
```

After the starter project is loaded up, you have to select a project template (using your arrow keys). Select `Hello World`, which is the default, by hitting ENTER.

```bash
? Select a project template: (Use arrow keys)
❯ Hello World
  Counter
```

Next, you need to name the project folder. Hit ENTER to accept the default:

```bash
? Project name: (clarity-hello-world)
```

Wait a few seconds while all project dependencies install. Once completed, you can see a new folder on the left side of the screen (`clarity-hello-world`). This is the location of your new Clarity project. Open the project folder and get familiar with the structure.

## Step 3: review the contract

Inside the project folder, open the `contracts/hello-world.clar` file.

You can see that `()` (parentheses) enclose the program and each statement. The smart contract also consists of two functions:

```clarity
(define-public (say-hi)
  (ok "hello world"))

(define-read-only (echo-number (val int))
  (ok val))
```

On the first line, a new public function `say-hi` is declared. Public functions are callable from other smart contracts, enabling developers to break complex tasks into smaller, simpler smart contracts (an exercise in [separating concerns](https://en.wikipedia.org/wiki/Separation_of_concerns)).

-> To create private functions, you would use the `define-private` keyword. Only the current smart contract can run private functions. Other contract can only call public functions.

The function doesn't take any parameters and simply returns "hello world" using the [`ok`](/references/language-functions#ok) response constructor.

The second function, `echo-number`, is a [read-only function](/references/language-functions#define-read-only). Read-only functions are also public, but as the name implies, they can not change and variables or datamaps. `echo-number` takes an input parameter of the type `int`.

-> Clarity supports a variety of other [types](/references/language-types)

`echo-number` uses an [`ok`](/references/language-functions#ok) response to return the value passed to the function.

In the following steps, you can use this sample contract to deploy and run on the Stacks blockchain.

## Step 4: create a Stacks account

The container you are using comes pre-installed with Stacks CLI. Back inside the terminal, run the following command to create a new [Stacks 2.0 account](/understand-stacks/accounts):

```bash
stx make_keychain -t | json_pp > cli_keychain.json
```

This command creates a new address and saves the details in a JSON file.

-> The `-t` option generates an account for the [testnet](/understand-stacks/testnet). It can't function on the mainnet

Review your new Stacks account details by opening up the file `cli_keychain.json` from the left navigation bar.

```json
{
  "keyInfo": {
    "address": "STNBNMTXV9ERHEDCQA3WE2S4PTF8ANSC24EBDKS2",
    "btcAddress": "mjQtUz4kD7QsfAnxuPKKNM2EjFiomb9P8p",
    "index": 0,
    "privateKey": "416ce94972b13eee84943a0c42275c9f61f7..."
  },
  "mnemonic": "cup core apple emotion chalk absorb ..."
}
```

-> Check out the [Stacks CLI reference](/references/stacks-cli) for more details

## Step 5: obtain testing tokens

Uploading and calling smart contracts requires you to pay network fees to process the transactions. You need to get some testnet tokens, so you can pay the fees in the next steps.

The **STX faucet** is an API endpoint you can call to request testnet tokens for the new account. In the terminal, run the following command:

```bash
# replace <stx_address> with `address` property from your keychain
curl -XPOST "https://stacks-node-api.testnet.stacks.co/extended/v1/faucets/stx?address=<stx_address>" | json_pp
```

The response includes a `txId` property. This is the transaction that transfers funds to your Stacks address.

```json
{
  "success": true,
  "txId": "0xf2f0402f9f4c4d43b382690c4f7b97e24d5ff5dd5c619e3615daa64dca7ef4bc",
  "txRaw": "8080000000040016..."
}
```

-> You can also review the transaction status and details using the [Stacks Explorer](https://explorer.stacks.co/)

You need to wait up to a minute for the transaction to complete. Type the following in your terminal to see the balance:

```bash
stx balance -t <stx_address>
```

Once the transaction is successfully processed, you can see that your new balance is `500000`. This equals 0.5 Stacks (STX) tokens.

```json
{
  //  in microstacks (1 STX = 1000000 microstacks)
  "balance": "500000",
  "locked": "0",
  "unlock_height": 0,
  "nonce": 0
}
```

## Step 6: deploy the contract

A deployed contract on the Testnet is like a cloud function (comparable to serverless functions). It allows you to execute code remotely on the Stacks 2.0 network.

Now, you can deploy the reviewed contract file (`hello-world.clar`). Inside the terminal, run the following command:

```bash
# stx deploy_contract -t <contract_file_path> <contract_name> <fee> <nonce> <privateKey>
# replace `privateKey` with your private key from your keychain
stx deploy_contract -t clarity-hello-world/contracts/hello-world.clar hello-world 2000 0 <privateKey>
```

The command returns a new contract deploy transaction ID:

```bash
09adc98490c9f900d3149e74322e07ff6d1bf49660a08d8104c4dc66430bc3c0
```

The `deploy_contract` command takes the file contents and deploys a new contract with the name `hello-world`. With that name, the fully qualified contract identifier for the new account is `STNBNMTXV9ERHEDCQA3WE2S4PTF8ANSC24EBDKS2.hello-world`.

~> Your address is different. The contract identifier is essentially a naming convention to address deployed contract. It's based on the dot notation: `<address>.<contract_id>`

Ideally, you should estimate the minimal fees you need to pay. Factors like the size of the contract (amopngst others) determine the estimate. For this tutorial, you can keep it simple and accept the default fee of `2000` (equals 0.02 STX).

You have to wait up to a minute for the contract to broadcast to the network. In the meantime, you can open the transaction with the Explorer. Notice that every deployed smart contracts' source code is publicly verifiable.

-> Keep in mind that this operation increases the `nonce` of your account. [Read more about nonces](/understand-stacks/network#nonces)

## Step 7: call the public method

As soon as the contract deploys, you can call one of its methods. In this example, you are calling the `echo-number` function.

-> This is a `read-only` method, so it returns the result [without generating a new transaction](/understand-stacks/network#read-only-function-calls)

```bash
# stx call_read_only_contract_func -t <stx_address> <contract_name> <function_name> <stx_address>
# replace `stx_address` with the value from your keychain
stx call_read_only_contract_func -t <stx_address> hello-world echo-number <stx_address>
```

The command looks up the contract method definition on the network, identify that it requires an input parameter, and ask you for an integer to set `val`. Enter 42 an hit ENTER.

```bash
42
```

The method is now executed on the network. This can take a while. Once completed, the corresponding transaction contains the respond with the value you just entered, `42`:

```bash
(ok 42)
```

=> **Congratulations!** You can now deploy your smart contract and call public functions on the Testnet using the CLI. You just deployed your smart contract and called a public function on the testnet of the Stacks blockchain using the Stacks CLI.

With the completion of this tutorial, you now:

- Have a working Clarity starter project
- Understand basic Clarity language design principles
- Deployed a contract on the Stacks blockchain and called a public method
- Understand how to use the Stacks CLI
