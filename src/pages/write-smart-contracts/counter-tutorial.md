---
title: Counter tutorial
description: Learn how to write a simple smart contract in the Clarity language.
experience: intermediate
duration: 30 minutes
tags:
  - tutorial
images:
  large: /images/pages/counter-tutorial.svg
  sm: /images/pages/counter-tutorial-sm.svg
---

## Introduction

In this tutorial, you learn how to implement a smart contract that stores and manipulates an integer value on the Stacks 2.0 blockchain. By the end of this tutorial, you will ...

- Have experienced test-driven development with Clarity
- Understand more Clarity language design principles
- Have a working Clarity counter smart contract

## Prerequisites

=> Before you get started, you should complete the [Hello World tutorial](hello-world-tutorial).

### Check the Stacks 2.0 status

The Stacks 2.0 blockchain is currently in development and could experience resets and downtimes. To make sure you're not
running into any challenges related to the status of the network, please open up the [Status Checker](http://status.test-blockstack.com/)
and confirm that all systems are operational. If some systems seem to have issues, it is best to wait until they are back up before you proceed with the next steps.

## Step 1: Downloading counter starter project

In this step, you initialize a starter project with additional counter tutorial files:

Using your terminal, run the following command to create a new folder and initialize a new project:

```bash
# create and go to new `counter` project folder
mkdir counter; cd counter
npm init clarity-starter
```

You will be asked to select a project template. Press down with your arrow keys to choose `Counter` and hit **ENTER**:

```bash
? Select a project template: (Use arrow keys)
  Hello World
❯ Counter
```

Finally, the project dependencies are installed and your project is ready for development. Because you already completed the [Hello World tutorial](tutorial), the project structure is familiar to you. The main difference is that we have additional tests for a new counter smart contract.

## Step 2: Running tests

Smart contracts are often developed in a test-driven approach. This not only improves code quality, but also removes the need to push every iteration to the blockchain before executing it. We will do the same in this project. Now, let's run the tests and review the results:

Still in the project root directory, run the following command:

```bash
npm test
```

You should see the following response:

```bash
counter contract test suite
    ✓ should have a valid syntax
    deploying an instance of the contract
    1) should start at zero
    2) should increment
    3) should decrement

1 passing (734ms)
3 failing

... # error details

npm ERR! Test failed.  See above for more details.
```

It looks like we see some failed tests! That is on purpose - we will implement the new smart contract in the next steps! After every step in this tutorial, we will rerun the tests to ensure we're on the right track.

## Step 3: Developing a smart contract

Let's get familiar with the tests to understand what the new smart contract should look like

1. In your editor, take a quick look at the test file associated with the counter smart contract: `test/counter.ts`

   ```bash
   cat test/counter.ts
   ```

   You will see a [Mocha](https://mochajs.org/) test suite. This file describes the tests for the counter smart contract.
   Notice how the smart contract is instantiated on line 8 of file `counter.ts`

   ```jsx
   counterClient = new Client(
     'SP3GWX3NE58KXHESRYE4DYQ1S31PQJTCRXB3PE9SB.counter',
     'counter',
     provider
   );
   ```

   That tells us that the new smart contract is named `counter` and that it should be found in the following file:
   `contracts/counter.clar`. Note that the `contracts` folder is assumed as the base folder and that every Clarity file
   has the suffix `.clar`.

   The file was already created during the project setup.

2. Using your editor, open `contracts/counter.clar`. You will notice the file already includes some content:

   ```clarity
   ;; define counter variable
   ;; increment method
   ;; decrement method
   ;; counter getter
   ```

   What you see are four one-line comments. In Clarity, a comment line is started with `;;`. As you can see, the
   comments indicate the structure of the smart contract we are going to implement.

   Let's declare a counter variable and define a public getter method:

   ```clarity
    ;; define counter variable
    (define-data-var counter int 0)

    ...

    ;; counter getter
    (define-public (get-counter)
      (ok (var-get counter)))
   ```

   The [`define-data-var`](/references/language-functions#define-data-var) statement initializes a
   new integer variable named `counter` and sets the value to `0`. It is important to note that all definition statements
   in Clarity need to be at the top of the file.

   The `counter` variable is stored in the data space associated with the smart contract. The variable is persisted and
   acts as the global shared state.

   To provide access to the `counter` variable from outside of the current smart contract, we need to declare a public function to get it. The last lines of the code add a public `get-counter` function. The [`var-get`](/references/language-functions#var-get) statement looks for a variable in the contract's data space and returns it.

   With that, you are ready to rerun the tests!

3. Run the tests and review the results:

   ```bash
   npm test
   ```

   You should now only see 2 failing tests! `should start at zero` is passing, and you successfully build your first part of the contract. Congrats!

   However, we don't stop here. Let's implement increment and decrement functions.

4. Add the following lines to the `counter.clar` file (below the increment method comment) and take a few seconds to review them:

   ```clarity
   ;; increment method
   (define-public (increment)
     (begin
       (var-set counter (+ (var-get counter) 1))
       (ok (var-get counter))))
   ```

   First, the [`begin`](/references/language-functions#begin) statement evaluates multiple expressions and returns the value of the last one. In this case, it is used to set a new value and return the new value.

   Next, a [`var-set`](/references/language-functions#var-set) is used to set a new value for the `counter` variable. The new value is constructed using the [`+`](/references/language-functions#-add) (add) statement. This statement takes a number of integers and returns the result. Along with add, Clarity provides statements to subtract, multiply, and divide integers. Find more details in the [Clarity language reference](/references/language-functions).

5. Next, implement a new public function `decrement` to subtract `1` from the `counter` variable. You should have all knowledge needed to succeed at this!

   Here is the final contract:

   ```clarity
   (define-data-var counter int 0)

   (define-public (get-counter)
     (ok (var-get counter)))

   (define-public (increment)
     (begin
       (var-set counter (+ (var-get counter) 1))
       (ok (var-get counter))))

   (define-public (decrement)
     (begin
       (var-set counter (- (var-get counter) 1))
       (ok (var-get counter))))
   ```

   Done? Great! Run the tests and make sure all of them are passing. You are looking for 4 passed tests:

   ```bash
   counter contract test suite
       ✓ should have a valid syntax (39ms)
       deploying an instance of the contract
       ✓ should start at zero
       ✓ should increment (133ms)
       ✓ should decrement (177ms)
       4 passing (586ms)
   ```

## Step 4: Deploy and call the contract

Your new smart contract is ready to be deployed to the Stacks 2.0 blockchain. You should be familiar with the steps
from the ["Hello, World" tutorial](/write-smart-contracts/hello-world-tutorial#deploy-the-contract).

As soon as you successfully deploy your contract, you can play around with the contract and verify the functionality by
calling all public methods you implemented. Here's a suggested order:

- Call the `get-counter` method. It should return `0`
- Call the `increment` method and let the transaction complete
- Call the `get-counter` method. It should return `1`
- Call the `decrement` method and let the transaction complete
- Call the `get-counter` method. It should return `0`

-> As you can see, read-only function calls don't require a transaction to complete. This is because the method doesn't require a state change.

=> Congratulations! You just implemented, deployed, and called your own Clarity smart contract.

With the completion of this tutorial, you:

- Experienced test-driven development with Clarity
- Understood more Clarity language design principles
- Developed a working Clarity counter smart contract and called its public methods
