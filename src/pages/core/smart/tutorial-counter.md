---
description: 'Clarity: Counter Tutorial'
---

# Counter

| Experience | | **Intermediate** |
| Duration | | **30 minutes** |

In this tutorial, you learn how to implement a smart contract that stores and manipulates an integer value on the Stacks 2.0 blockchain. By the end of this tutorial, you will ...

- Have experienced test-driven development with Clarity
- Understand more Clarity language design principles
- Have a working Clarity counter smart contract

## Overview

## Prerequisites

Before you get started, you should complete the [Hello World tutorial](tutorial.html).

## Step 1: Downloading counter starter project

In this step, you initialize a starter project with additional counter tutorial files:

Using your terminal, run the following command to create a new folder and initialize a new project:

```bash
mkdir counter; cd counter
npm init clarity-starter
```

You must now select a template. Type `counter` and hit ENTER:

```bash
? Template - one of [hello-world, counter]: counter
```

Finally, the project dependencies are installed and your project is ready for development. Because you already completed the [Hello World tutorial](tutorial.html), the project structure is familiar to you. The main difference is that we have additional tests for a new counter smart contract.

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

1. Take a quick look at the test file associated with the counter smart contract:

   ```shell
   cat test/counter.ts
   ```

   You should be familiar with the test set up from the Hello World tutorial. Notice how the instance of the smart contract is created on line 8:

   ```js
   counterClient = new Client(
     'SP3GWX3NE58KXHESRYE4DYQ1S31PQJTCRXB3PE9SB.counter',
     'counter',
     provider
   );
   ```

   That tells us that the new smart contract is named `counter` and that it should be found in the following file: `contracts/counter.clar`. Note that the `contracts` folder is assumed as the base folder and that every Clarity file has the suffix `.clar`.

   The file was already created during the project setup.

2. With the editor of your choice, open `contracts/counter.clar` and add the following lines of code:

   ```cl
   (define-data-var counter int 0)

   (define-public (get-counter)
     (ok (var-get counter)))
   ```

   The first line initializes a new integer variable `counter` with the value set to `0` using the [`define-data-var`](https://docs.blockstack.org/core/smart/clarityref#define-data-var) statement. It is important to note that all definition statements in Clarity need to be at the top of the file.

   The `counter` variable is stored in the data space associated with this particular smart contract. The variable is persisted and acts as the global shared state.

   To provide access to the `counter` variable from outside of the current smart contract, we need to declare a public function to get it. The last lines of the code add a public `get-counter` function. The [`var-get`](https://docs.blockstack.org/core/smart/clarityref#var-get) statement looks for a variable in the contract's data space and returns it.

   With that, you are ready to rerun the tests!

3. Run the tests and review the results:

   ```shell
   npm test
   ```

   You should now only see 2 failing tests! `should start at zero` is passing, and you successfully build your first part of the contract. Congrats!

   However, we don't stop here. Let's implement increment and decrement functions.

4. Add the following lines to the bottom of the `counter.clar` file and take a few seconds to review them:

   ```cl
   (define-public (increment)
     (begin
       (var-set counter (+ (var-get counter) 1))
         (ok (var-get counter))))
   ```

   First, the [`begin`](https://docs.blockstack.org/core/smart/clarityref#begin) statement evaluates the multi-line expressions and returns the value of the last expression. In this case, it is used to set a new value and return the new value.

   Next, a [`var-set`](https://docs.blockstack.org/core/smart/clarityref#var-set) is used to set a new value for the `counter` variable. The new value is constructed using the [`+`](https://docs.blockstack.org/core/smart/clarityref#-add) (add) statement. This statement takes a number of integers and returns the result. Along with add, Clarity provides statements to subtract, multiply, and divide integers. Find more details in the [Clarity language reference](https://docs.blockstack.org/core/smart/clarityref).

5. Finally, take a few minutes and implement a new public function `decrement` to subtract `1` from the `counter` variable. You should have all knowledge needed to succeed at this!

   Done? Great! Run the tests and make sure all of them are passing. You are looking for 4 passed tests:

   ```shell
   counter contract test suite
       ✓ should have a valid syntax (39ms)
       deploying an instance of the contract
       ✓ should start at zero
       ✓ should increment (133ms)
       ✓ should decrement (177ms)
   ```


    4 passing (586ms)
    ```

    **Congratulations! You just implemented your first Clarity smart contract.**

Here is how the final smart contract file should look like. Note that you can find the `decrement` function in here - in case you want to compare with your own implementation:

```cl
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

## If you're ready to deploy and execute the contract, try [the Explorer Sandbox](tutorial.html#access-the-explorer-sandbox) or following [the instructions to run the contract in the command-line](tutorial.html#get-familiar-with-cli-optional).

With the completion of this tutorial, you ...

- Experienced test-driven development with Clarity
- Understood more Clarity language design principles
- Developed a working Clarity counter smart contract

## Where to go next

- <a href="clarityRef.html">Clarity language reference</a>
