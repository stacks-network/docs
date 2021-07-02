---
title: Billboard
description: Learn how to store data on-chain and transfer STX tokens with Clarity
duration: 30 minutes
experience: intermediate
tags:
  - tutorial
images:
  large: /images/pages/billboard.svg
---

## Introduction

This tutorial demonstrates how to transfer STX tokens and handle errors in Clarity by building a simple on-chain message
store. Additionally, this tutorial provides a simple overview of testing a smart contract. This tutorial builds on
concepts introduced in the [counter tutorial][], and uses [Clarinet][] to develop and test the smart contract.

In this tutorial you will:

- Set up a development environment with Clarinet
- Define codes for error handling
- Add a data storage variable with functions to get and set the variable
- Add a STX transfer function within the variable setter
- Develop a unit test to verify the contract works as expected

The [final code for this tutorial][] is available in the Clarinet repository.

## Prerequisites

For this tutorial, you should have a local installation of [Clarinet][]. Refer to [Installing Clarinet][] for
instructions on how to set up your local environment. You should also have a text editor or IDE to edit the Clarity
smart contract.

For developing the unit test, it's recommended that you have an IDE with Typescript support, such as
[Visual Studio Code][].

If you are using Visual Studio Code, you may want to install the [Clarity Visual Studio Code plugin][].

## Step 1: set up the project

With Clarinet installed locally, open a new terminal window and create a new Clarinet project. Add a smart contract and
an empty test file to the project:

```sh
clarinet new billboard-clarity && cd billboard-clarity
clarinet contract new billboard
```

These commands create the necessary project structure and contracts for completing this tutorial. Remember that at
any point during this tutorial you can use `clarinet check` to check the validity of your Clarity syntax.

## Step 2: create message storage

Open the `contracts/billboard.clar` file in a text editor or IDE. For this tutorial, you'll use the boilerplate comments
to structure your contract for easy readability.

In this step, you'll add a variable to the contract that stores the billboard message, and define a getter function to
read the value of the variable.

Under the `data maps and vars` comment, define the `billboard-message` variable. Remember that you must define the type of
the variable, in this case `string-utf8` to support emojis and extended characters. You must also define the
maximum length of the variable, for this tutorial use the value `500` to allow for a longer message. You must also
define the initial value for the variable.

```clarity
;; data vars
(define-data-var billboard-message (string-utf8 500) u"Hello world!")
```

You also should define a read-only getter function returns the value of the `billboard-message` variable.

```clarity
;; public functions
(define-read-only (get-message)
    (var-get billboard-message))
```

These are the required methods for storing and accessing the message on the billboard.

## Step 3: define set message function

Define a method to set the billboard message. Under the public functions, define a `set-message` function. This public
function takes a `string-utf8` with a max length of `500` as the only argument. Note that the type of the argument
matches the type of the `billboard-message` variable. Clarity's type checking ensures that an invalid input to the
function doesn't execute.

```clarity
;; public functions
(define-public (set-message (message (string-utf8 500)))
    (ok (var-set billboard-message message))
)
```

The contract is now capable of updating the `billboard-message`.

## Step 4: transfer STX to set message

In this step, you'll modify the `set-message` function to add a cost in STX tokens, that increments by a set amount each
time the message updates.

First, you should define a variable to track the price of updating the billboard. This value is in micro-STX. Under the
`data maps and vars` heading, add a new variable `price` with type `uint` and an initial value of `u100`. The initial
cost to update the billboard is 100 micro-STX or 0.0001 STX.

```clarity
;; data vars
(define-data-var price uint u100)
```

You also should define a read-only getter function returns the value of the `price` variable. Read-only functions in
Clarity are public, and should be grouped with other public functions in the contract.

```clarity
;; public functions
(define-read-only (get-price)
    (var-get price)
)
```

It's a best practice to define codes to a descriptive constant for Clarity smart contracts. This makes the code easier
to understand for readers and makes errors reusable across contract methods. Under the `constants` comment, define a STX
transfer error constant. Assign the value `u0` to the constant. There is no standard for error constants in Clarity,
this value is used because it's the first error the contract defines. Error constants should be defined at the top of
the contract, usually preceding data variables.

```clarity
;; error consts
(define-constant ERR_STX_TRANSFER u0)
```

Modify the `set-message` function to transfer the amount of STX represented by the current price of the billboard from
the function caller to the contract wallet address, and then increment the new price. The function is then executed in four steps: transferring STX from the function caller to the contract, updating the `billboard-message` variable, incrementing the
`price` variable, and returning the new price.

The new `set-message` function uses [`let`][] to define local variables for the function. Two variables are declared,
the `cur-price`, which represents the current price of updating the billboard, and the `new-price`, which represents the
incremented price for updating the billboard.

The function then calls the [`stx-transfer?`][] function to transfer the current price of the contract in STX from the
transaction sender to the contract wallet. This syntax can be confusing: the function call uses the `tx-sender`
variable, which is the principal address of the caller of the function. The second argument to [`stx-transfer?`][] uses
the [`as-contract`][] function to change the context's `tx-sender` value to the principal address that deployed the
contract.

The entire [`stx-transfer?`][] function call is wrapped in the [`unwrap!`][] function, to provide protection from
the transfer failing. The [`unwrap!`][] function executes the first argument, in this case the [`stx-transfer?`][]
function. If the execution returns `(ok ...)`, the [`unwrap!`][] function returns the inner value of the `ok`, otherwise
the function returns the second argument and exits the current control-flow, in this case the `ERR_STX_TRANSFER` error
code.

If the token transfer is successful, the function sets the new `billboard-message` and updates the `price` variable to
`new-price`. Finally, the function returns `(ok new-price)`. It's generally a good practice to have public functions
return `ok` when successfully executed.

-> This function should replace the existing `set-message` function defined previously.

```clarity
(define-public (set-message (message (string-utf8 500)))
    (let ((cur-price (var-get price))
          (new-price (+ cur-price u10)))

        ;; pay the contract
        (unwrap! (stx-transfer? cur-price tx-sender (as-contract tx-sender)) (err ERR_STX_TRANSFER))

        ;; update the billboard's message
        (var-set billboard-message message)

        ;; update the price
        (var-set price new-price)

        ;; return the updated price
        (ok new-price)
    )
)
```

At this point, the final contract should look like this:

```clarity
;; error consts
(define-constant ERR_STX_TRANSFER u0)

;; data vars
(define-data-var billboard-message (string-utf8 500) u"Hello World!")
(define-data-var price uint u100)

;; public functions
(define-read-only (get-price)
    (var-get price)
)

(define-read-only (get-message)
    (var-get billboard-message)
)

(define-public (set-message (message (string-utf8 500)))
    (let ((cur-price (var-get price))
          (new-price (+ cur-price u10)))

        ;; pay the contract
        (unwrap! (stx-transfer? cur-price tx-sender (as-contract tx-sender)) (err ERR_STX_TRANSFER))

        ;; update the billboard's message
        (var-set billboard-message message)

        ;; update the price
        (var-set price new-price)

        ;; return the updated price
        (ok new-price)
    )
)
```

Use `clarinet check` to ensure that your Clarity code is well-formed and error-free.

## Step 5: write a contract test

At this point, the contract functions as intended, and can be deployed to the blockchain. However, it's good practice
to write automated testing to ensure that the contract functions perform in the expected way. Testing can be valuable
when adding complexity or new functions, as working tests can verify that any changes you make didn't fundamentally
alter the way the functions behave.

Open the `tests/billboard_test.ts` file in your IDE. In this step, you will add a single automated test to exercise the
`set-message` and `get-message` functions of the contract.

Using the Clarinet library, define variables to get a wallet address principal from the Clarinet configuration, and the
balance of that address on the chain.

The functional part of the test is defined using the `chain.mineBlock()` function, which simulates the mining of a
block. Within that function, the test makes four contract calls (`Tx.contractCall()`), two calls to `set-message` and
two calls to `get-message`.

Once the simulated block is mined, the test can make assertions about the chain state. This is accomplished using the
`assertEquals()` function and the `expect` function. In this case, the test asserts that the once the simulated block
is mined, the block height is now equal to `2`, and that the number of receipts (contract calls) in the block are
exactly `4`.

The test can then make assertions about the return values of the contract. The test checks that the result of the
transaction calls to `get-message` match the string values that the calls to `set-message` contain. This covers the
capability of both contract functions.

Finally, the test asserts that STX are transferred from the transaction caller wallet, covering the price updating and
token transfer. The test verifies that the addresses of the wallets match the expected addresses, and that the amount
transferred is the expected amount.

```ts
import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v0.12.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: 'A quick demo on how to assert expectations',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    let wallet_1 = accounts.get('wallet_1')!;

    let assetMaps = chain.getAssetsMaps();
    const balance = assetMaps.assets['STX'][wallet_1.address];

    let block = chain.mineBlock([
      Tx.contractCall('billboard', 'set-message', [types.utf8('testing')], wallet_1.address),
      Tx.contractCall('billboard', 'get-message', [], wallet_1.address),
      Tx.contractCall('billboard', 'set-message', [types.utf8('testing...')], wallet_1.address),
      Tx.contractCall('billboard', 'get-message', [], wallet_1.address),
    ]);

    assertEquals(block.receipts.length, 4);
    assertEquals(block.height, 2);

    block.receipts[1].result.expectUtf8('testing');

    block.receipts[3].result.expectUtf8('testing...');

    let [event] = block.receipts[0].events;
    let { sender, recipient, amount } = event.stx_transfer_event;
    sender.expectPrincipal('ST1J4G6RR643BCG8G8SR6M2D9Z9KXT2NJDRK3FBTK');
    recipient.expectPrincipal('ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.billboard');
    amount.expectInt(100);

    assetMaps = chain.getAssetsMaps();
    assertEquals(assetMaps.assets['STX'][wallet_1.address], balance - 210);
  },
});
```

Try running `clarinet test` to see the output of the unit test.

=> You have now learned how to store and update data on chain with a variable, and how to transfer STX tokens from
a contract caller to a new principal address. Additionally, you have learned how to write a unit test for a simple
Clarity contract using Clarinet.

[counter tutorial]: /write-smart-contracts/counter-tutorial
[clarinet]: /write-smart-contracts/clarinet
[installing clarinet]: /write-smart-contracts/clarinet#installing-clarinet
[visual studio code]: https://code.visualstudio.com/
[final code for this tutorial]: https://github.com/hirosystems/clarinet/tree/master/examples/billboard
[`let`]: /references/language-functions#let
[`stx-transfer?`]: /references/language-functions#stx-transfer
[`as-contract`]: /references/language-functions#as-contract
[`unwrap!`]: /references/language-functions#unwrap
[clarity visual studio code plugin]: https://marketplace.visualstudio.com/items?itemName=HiroSystems.clarity-lsp
