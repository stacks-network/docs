---
layout: core
description: "Blockstack smart contracting language"
permalink: /:collection/:path.html
---
# Tutorial: Counter

| Experience | | **Intermediate**  |
| Duration | | **30 minutes** |

In this tutorial, you learn how to implement a smart contract that stores and manipulates an integer value on the Stack2.0 Blockchain. By the end of this tutorial, you will ...

* Have experienced test-driven development with Clarity
* Understand more Clarity language design principles
* Have a working Clarity counter smart contract

## Overview

* TOC
{:toc}

<div class="uk-card uk-card-default uk-card-body">
<h5>Early Release</h5>
<p>Clarity and its accompanying toolset are in early release. If you encounter issues with or have feature requests regarding Clarity, please create an issue on the <a href='https://github.com/blockstack/stacks-blockchain/issues' target='_blank'>blockstack/stacks-blockchain</a> repository. To read previous or join ongoing discussions about smart contracts in general and Clarity in particular, visit the <strong><a href='https://forum.blockstack.org/c/clarity' target='_blank'>Smart Contracts</a></strong> topic in the Blockstack Forum.
</p>
</div>

## Pre-requisites

Before you get started, you should complete the [Hello World Tutorial](tutorial.html).

## Step 1: Download counter tutorial project

In this step, you initialize a starter project with additional counter tutorial files:

1. Using your terminal, run the following command:

    ```bash
    npm init clarity-starter --counter-tutorial
    ```

2. After the additional project files are loaded up, you can confirm the project name. Feel free to hit ENTER to accept the default suggestion - or enter a new one.

    ```bash
    ? Project name (clarity-counter-project)
    ```

    Finally, the project dependencies will install, and your project is ready for development. Because you already completed the Hello World tutorial, the project structure is familiar to you. The main difference is that we have additional tests for a new counter smart contract.

## Step 2: Running tests

Smart contracts are often developed in a test-driven approach to ensure code quality but also to speed up the development cycle by removing the need to push every change to the Blockchain before executing it. We will do the same in this project. Now, let's run the tests and review the results:

1. Still in the project root directory, run the following command:

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

    hello world contract test suite
        ✓ should have a valid syntax
        deploying an instance of the contract
        ✓ should return 'hello world'
        ✓ should echo number


    4 passing (455ms)
    3 failing
    ```

    It looks like we see some failed test! That is on purpose - we will implement the new smart contract in the next steps! After every increment of the contract, we will rerun the tests to ensure we're on the right track.

## Step 3: Developing a smart contract

Let's get familiar with the tests to understand what the new smart contract should look like

1. Take a quick look at the test file associated with the counter smart contract:

    ```shell
    cat test/counter.ts
    ```

    You should be familiar with the test set up from the Hello World tutorial. Notice how the instance of the smart contract is created on line 8:

    ```js
    counterClient = new Client("SP3GWX3NE58KXHESRYE4DYQ1S31PQJTCRXB3PE9SB.counter", "sample/counter", provider);
    ```

    That tells us that the new smart contract is named `counter` and that we need to start by creating a new file for the smart contract: `contracts/sample/counter.clar`. Note that the `contracts` folder is assumed as the base folder and that every Clarity file has the suffix `.clar`.

2. Let's create the new file:

    ```shell
    touch contracts/sample/counter.clar
    ```

3. With the editor of your choice, open the file and add the following lines of code:

    ```cl
    (define-data-var counter int 0)

    (define-public (get-counter)
        (ok (var-get counter))
    )
    ```

    The first line initializes a new integer variable `counter` with the value set to `0` using the [`define-data-var`](https://docs.blockstack.org/core/smart/clarityref#define-data-var) statement. It is important to note that all definition statements in Clarity need to be at the top of the file.

    To provide access to the variable from outside of the current smart contract, we need to declare a public get method for this variable. The last lines of the code add a public `get-counter` method. The [`var-get`](https://docs.blockstack.org/core/smart/clarityref#var-get) statement looks for a variable in the contract's data map and returns it.

    With that, you are ready to rerun the tests!

4. Run the tests and review the results:

    ```shell
    npm test
    ```

    You should now only see 2 failing tests! `should start at zero` is passing, and you successfully build your first part of the contract. Congrats!

    However, we don't stop here. Let's implement increment and decrement methods.

5. Add the following lines to the bottom of the `counter.clar` file and take a few seconds to review them:

    ```cl
    (define-public (increment)
        (begin
            (var-set counter (+ (var-get counter) 1))
            (ok (var-get counter))
        )
    )
    ```

    First, the [`begin`](https://docs.blockstack.org/core/smart/clarityref#begin) statement evaluates the multi-line expressions and returns the value of the last expression. In this case, it is used to set a new value and return the new value.

    Next, a [`var-set`](https://docs.blockstack.org/core/smart/clarityref#var-set) is used to set a new value for the `counter` variable. The new value is constructed using the [`+`](https://docs.blockstack.org/core/smart/clarityref#-add) (add) statement. This statement takes a number of integers and returns the result. Along with add, Clarity provides statements to subtract, multiply, and divide integers. Find more details in the [Clarity language reference](https://docs.blockstack.org/core/smart/clarityref).

6. Finally, take a few minutes and implement a new public method `decrement` to subtract `1` from the `counter` variable. You should have all knowledge needed to succeed at this!

    Done? Great! Run the tests and make sure all of them are passing. You are looking for 7 successful tests:

    ```shell
    counter contract test suite
        ✓ should have a valid syntax
        deploying an instance of the contract
        ✓ should start at zero
        ✓ should increment (95ms)
        ✓ should decrement (92ms)

    hello world contract test suite
        ✓ should have a valid syntax
        deploying an instance of the contract
        ✓ should return 'hello world'
        ✓ should echo number


    7 passing (518ms)
    ```

    **Congratulations! You just implemented your first Clarity smart contract.**

7. Here is how the final smart contract file should look like. Note that you can find the `decrement` method in here - in case you want to compare with your own implementation:

    ```cl
    (define-data-var counter int 0)
    (define-public (increment)
        (begin
            (var-set counter (+ (var-get counter) 1))
            (ok (var-get counter))
        )
    )
    (define-public (decrement)
        (begin
            (var-set counter (- (var-get counter) 1))
            (ok (var-get counter))
        )
    )
    (define-public (get-counter)
        (ok (var-get counter))
    )
    ```

## Where to go next

{:.no_toc}

* <a href="tutorial-token.html">Next tutorial: Writing a token management smart contract</a>
* <a href="clarityRef.html">Clarity language reference</a>
