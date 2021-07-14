---
title: Counter tutorial
description: Learn how to write a simple counter in Clarity.
experience: beginner
duration: 20 minutes
tags:
  - tutorial
images:
  large: /images/pages/counter-tutorial.svg
  sm: /images/pages/counter-tutorial-sm.svg
---

## Introduction

This tutorial introduces variables in Clarity, and demonstrates how to interact with them through a simple incrementing
and decrementing counter. This tutorial builds on concepts introduced in the [hello world tutorial][] and continues to
exercise [Clarinet][] as a local development environment.

In this tutorial you will:

- Create a new Clarinet project
- Add a new Clarity contract to the project
- Populate the contract with a variable and read variable function
- Populate the contract with an increment and a decrement function
- Execute the functions in a local, simulated blockchain
- Optionally, deploy and test the contract on the testnet blockchain

## Prerequisites

For this tutorial, you should have a local installation of Clarinet. Refer to [Installing Clarinet][] for instructions
on how to set up your local environment. You should also have a text editor or IDE to edit the Clarity smart contract.

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
clarinet new clarity-counter && cd clarity-counter
```

This command creates a new directory for your smart contract project, populated with boilerplate configuration and
testing files. Creating a new project only creates the Clarinet configuration, in the next step you can add a contract
to the project.

## Step 2: create a new contract

From the `clarity-counter` directory, create a new Clarity contract with the command:

```sh
clarinet contract new counter
```

This command adds a new `counter.clar` file in the `contracts` directory, and adds a `counter_test.ts` file to
the `test` directory. This tutorial ignores the test file, but for production contracts, you can create [unit tests][]
using it.

## Step 3: define variables

Open the `contracts/counter.clar` file in a text editor or IDE. Delete the boilerplate comments, for the purpose of
this tutorial they're not necessary.

In this step, you'll add a variable to the contract, and define a read-only function to output the value of that
variable.

Start by defining the variable on the first line

```clarity
;; define counter variable
(define-data-var counter int 0)
```

The [`define-data-var`][] statement initializes a new integer variable named `counter` and sets the initial value to
`0`. It's important to note that all definition statements in Clarity need to be at the top of the file.

The `counter` variable is stored in the data space associated with the smart contract. The variable is persisted and

acts as a global shared state.

To provide access to the `counter` variable from outside the contract that it's defined in, you should declare a
`read-only` function to get the value. Add this function below the variable definition:

```clarity
;; counter getter
(define-read-only (get-counter)
  (ok (var-get counter)))
```

The [`var-get`][] statement looks for a variable in the contract's data space and returns it.

Your contract code should now look like this:

```clarity
;; define counter variable
(define-data-var counter int 0)

;; counter getter
(define-read-only (get-counter)
  (ok (var-get counter)))
```

At this point, you can check your contract code to ensure the syntax is correct. In the `clarity-counter` directory in
your terminal, use the command:

```sh
clarinet check
```

If there are no errors, the command returns no output. If there are errors, verify that your contract is exactly as
listed in the preceding section. You can also use the [`clarinet console`][] to interact with the `get-counter`
function:

```clarity
(contract-call? .counter get-counter)
```

The console should return `(ok 0)`.

-> Changes to your contract will not be loaded into the Clarinet console until it is restarted. Close the console with
`Ctrl + C` before proceding to the next step.

## Step 4: define counter functions

In this step, you'll add functions to increment and decrement the counter variable. Add the `increment` function to
the contract after the counter getter:

```clarity
;; increment method
(define-public (increment)
  (begin
    (var-set counter (+ (var-get counter) 1))
    (ok (var-get counter))))
```

The [`begin`][] statement evaluates multiple expressions and returns the value of the last on. In this case, it
evaluates an expression to set a new value for the `counter` variable, and then returns the new value.

The first expression in the `begin` statement is the [`var-set`][] expression, which sets a new value for the counter
variable. The new value is constructed using the [`+`] (add) statement. This statement takes a number of integer
arguments and returns the sum of the integers. Along with add, Clarity provides statements to subtract, multiply, and
divide integers. Find more details in the [Clarity language reference][].

Next, implement a new public function `decrement` to subtract `1` from the counter variable:

```clarity
;; decrement method
(define-public (decrement)
  (begin
    (var-set counter (- (var-get counter) 1))
    (ok (var-get counter))))
```

At this point the contract is complete. The full `counter.clar` file should look like this:

```clarity
;; define counter variable
(define-data-var counter int 0)

;; counter getter
(define-read-only (get-counter)
  (ok (var-get counter)))

;; increment method
(define-public (increment)
  (begin
    (var-set counter (+ (var-get counter) 1))
    (ok (var-get counter))))

;; decrement method
(define-public (decrement)
  (begin
    (var-set counter (- (var-get counter) 1))
    (ok (var-get counter))))
```

## Step 5: interact with the contract on the Clarinet console

Run `clarinet check` again to verify that the syntax in your contract is correct. If there are no errors, the command
returns no output. Use the following command to launch the local console:

```sh
clarinet console
```

You'll use the console to interact with the functions in your contract. Call the `increment` function to increment the
counter in the console:

```clarity
(contract-call? .counter increment)
```

The console should return `(ok 1)`. Try calling the `decrement` function to decrement the counter back to 0.

```clarity
(contract-call? .counter decrement)
```

-> You have now learned the basics of working with variables in Clarity, and developed further practice with the
Clarinet development tool. You may wish to optionally deploy the contract to the testnet, described in the next and
final step.

## Optional: deploy and test the contract on the testnet

For this tutorial, you'll use the [testnet sandbox][] to deploy your smart contract. Make sure you have connected your
[Stacks web wallet][] to the sandbox using the **Connect wallet** button, then copy and paste your smart contract into
the Clarity code editor on the **Write & Deploy** page. Edit the contract name or use the randomly generated name
provided to you.

![Counter testnet sandbox](/images/counter-testnet-sandbox.png)

Click **Deploy** to deploy the contract to the blockchain. This will display the Stacks web wallet window with
information about the transaction. Verify that the transaction looks correct, and the network is set to `Testnet`, and
click **Confirm**.

The contract is added to the miners mempool, and included in the next block of the blockchain. This process can take up
to 15 minutes to complete. You can review it on the [transactions][] page of the explorer or in the activity field
of your web wallet.

When your contract is confirmed, navigate to the [call a contract][] page of the sandbox, and search for your contract.
Enter your wallet address in the top field, you can copy this address by clicking the Stacks web wallet icon and
clicking the **Copy address** button. Enter the contract name in the bottom field, in this case `counter`. Click
**Get Contract** to view the contract.

Click the `increment` function in the function summary, then click **Call Function** to perform the function call in the
sandbox. This will display the Stacks web wallet with information about the transaction. Verify the information, then
click **Confirm** to execute the function call.

The function call is added to the miners mempool, and is executed in the next block of the blockchain. This process
can take up to 15 minutes to complete. You can review it on the [transactions][] page of the explorer or in the
activity field of your web wallet.

When the transaction is complete, you can access the transaction summary page from the activity panel in your web
wallet. The transaction summary page displays the output of the function.

Try calling the other public functions from the [call a contract][] page.

=> You have now learned one method of deploying and interacting with smart contracts on Stacks. You have also learned
the strengths of performing local development without having to wait for block times.

[hello world tutorial]: /write-smart-contracts/hello-world
[clarinet]: /write-smart-contracts/clarinet
[installing clarinet]: /write-smart-contracts/clarinet#installing-clarinet
[`define-data-var`]: /references/language-functions#define-data-var
[testnet sandbox]: https://explorer.stacks.co/sandbox/deploy?chain=testnet
[stacks web wallet]: https://www.hiro.so/wallet/install-web
[testnet faucet]: https://explorer.stacks.co/sandbox/faucet?chain=testnet
[unit tests]: /write-smart-contracts/clarinet#testing-with-clarinet
[`var-get`]: /references/language-functions#var-get
[`clarinet console`]: /write-smart-contracts/clarinet#testing-with-the-console
[`begin`]: /references/language-functions#begin
[`var-set`]: /references/language-functions#var-set
[`+`]: /references/language-functions#-add
[clarity language reference]: /references/language-functions
[transactions]: https://explorer.stacks.co/transactions?chain=testnet
[clarity visual studio code plugin]: https://marketplace.visualstudio.com/items?itemName=HiroSystems.clarity-lsp
[call a contract]: https://explorer.stacks.co/sandbox/contract-call?chain=testnet
