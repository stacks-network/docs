---
title: NFT tutorial
description: Build your own NFT on Bitcoin
duration: 15 minutes
experience: intermediate
tags:
  - tutorial
icon: TestnetIcon
images:
  large: /images/pages/nft/nft.png
  sm: /images/pages/nft/nft.png
---

![What you'll build in this tutorial](/images/pages/nft/nft-preview.png)

## Introduction

Non-fungible tokens, or NFTs, are a type of [token](/write-smart-contracts/tokens#non-fungible-tokens-nfts) that can
represent unique data. NFTs are an emerging technology in blockchain, and there are many different potential uses for
them. NFTs have desirable [characteristics](/write-smart-contracts/tokens) like uniqueness, programmability, and
verifiable ownership. Simply put, an NFT is a piece of information that's unique. A common example of an NFT might be a
piece of digital art.

Clarity offers native support for token creation and management. On top of that, the Stacks ecosystem has adopted a
[standard for NFTs](https://github.com/stacksgov/sips/blob/main/sips/sip-009/sip-009-nft-standard.md). With these two
resources, creating your own NFT on Stacks is easy.

In this tutorial you will:

- Create a new Clarinet project
- Add contracts to the project, and set dependencies for those contracts
- Define an NFT contract based on the [SIP-009](https://github.com/stacksgov/sips/blob/main/sips/sip-009/sip-009-nft-standard.md) standard
- Verify the contract using Clarinet
- Optionally, deploy and test the contract on the testnet blockchain

## Prerequisites

For this tutorial, you should have a local installation of Clarinet. Refer to [Installing Clarinet](/write-smart-contracts/clarinet#installing-clarinet)
for instructions on how to set up your local environment. You should also have a text editor or IDE to edit the Clarity
smart contracts.

If you are using Visual Studio Code, you may want to install the [Clarity Visual Studio Code plugin](https://marketplace.visualstudio.com/items?itemName=HiroSystems.clarity-lsp).

### Optional prerequisites

While this tutorial primarily focuses on local smart contract development, you may wish to deploy your contract to a
live blockchain. For simplicity, contract deployment is performed using the [testnet sandbox](https://explorer.stacks.co/sandbox/deploy?chain=testnet).
If you wish to complete the optional deployment step, you should have the [Stacks Web Wallet](https://www.hiro.so/wallet/install-web)
installed, and you should request testnet STX tokens from the [testnet faucet](https://explorer.stacks.co/sandbox/faucet?chain=testnet)
on the testnet explorer. Note that requesting testnet STX from the faucet can take up to 15 minuets, so you may wish to
request the tokens before beginning the tutorial.

![faucet](/images/pages/nft/faucet.png)

## Step 1: Create a new project

With [Clarinet installed locally](/write-smart-contracts/clarinet#installing-clarinet), open a terminal window and
create a new Clarinet project with the command:

```sh
clarinet new clarity-nft && cd clarity-nft
```

This command creates a new directory for your smart contract project, populated with boilerplate configuration and
testing files. Creating a new project only creates the Clarinet configuration, in the next stel you can add contracts
to the project.

## Step 2: Add contracts to the project

Because NFTs rely on the traits defined in [SIP-009](https://github.com/stacksgov/sips/blob/main/sips/sip-009/sip-009-nft-standard.md),
the project should have two contracts: one that defines the traits, and the other to define your specific NFT. The NFT
contract is dependent on the contract that defines the traits.

From the `clarity-nft` directory, create two new Clarity contracts with the commands:

```sh
clarinet contract new nft-trait; clarinet contract new my-nft
```

These commands add four new files: a `nft-trait.clar` and `my-nft.clar` file in the `contracts` director, and
corresponding test files in the `tests` directory.

Remove the `nft-trait_test.ts` file from the `tests` directory, as it's not necessary.

```sh
rm tests/nft-trait_test.ts
```

-> Remember that at any point in this tutorial, you can run `clarinet check` to check the validity of your contract.

## Step 3: Configure dependencies and define traits

The NFT standard, [SIP-009](https://github.com/stacksgov/sips/blob/main/sips/sip-009/sip-009-nft-standard.md), defines
a set of standard traits that a compliant contract must implement. This is useful to ensure that different tokens are
able to be supported by Stacks wallets without additional development on the wallet. On the live blockchain, a contract
can declare that it conforms to a specific set of traits with the [`impl-trait`](/references/language-functions#impl-trait)
Clarity function. When a contract uses `impl-trait` to assert compliance with a set of standard traits, the contract can
fail deployment to the blockchain if it violates the trait specification.

In the local Clarinet REPL, you must specify the contract dependency in the configuration files. Open `Clarinet.toml`
and edit the `contracts.my-nft` heading to declare the dependency on the `nft-trait` contract.

```toml
[contracts.my-own-nft]
path = "contracts/my-own-nft.clar"
depends_on = ["nft-trait"]
```

Update the `nft-trait.clar` contract to define the required traits for [SIP-009](https://github.com/stacksgov/sips/blob/main/sips/sip-009/sip-009-nft-standard.md#trait).
You can paste the contract from this page, or from [Friedger's repository](https://github.com/friedger/clarity-smart-contracts/blob/master/contracts/sips/nft-trait.clar).

```clarity
(define-trait nft-trait
  (
    ;; Last token ID, limited to uint range
    (get-last-token-id () (response uint uint))

    ;; URI for metadata associated with the token
    (get-token-uri (uint) (response (optional (string-ascii 256)) uint))

     ;; Owner of a given token identifier
    (get-owner (uint) (response (optional principal) uint))

    ;; Transfer from the sender to a new principal
    (transfer (uint principal principal) (response bool uint))
  )
)
```

## Step 4: Define your personal NFT

For this tutorial, you'll define an NFT contract for the Stacks testnet. Open the `my-nft.clar` file and copy the
following code into the file.

```clarity
;; use the SIP090 interface (testnet)
(impl-trait 'ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.nft-trait.nft-trait)

;; define a new NFT. Make sure to replace MY-OWN-NFT
(define-non-fungible-token MY-OWN-NFT uint)

;; Store the last issues token ID
(define-data-var last-id uint u0)

;; Claim a new NFT
(define-public (claim)
  (mint tx-sender))

;; SIP009: Transfer token to a specified principal
(define-public (transfer (token-id uint) (sender principal) (recipient principal))
  (if (and
        (is-eq tx-sender sender))
      ;; Make sure to replace MY-OWN-NFT
      (match (nft-transfer? MY-OWN-NFT token-id sender recipient)
        success (ok success)
        error (err error))
      (err u500)))

;; SIP009: Get the owner of the specified token ID
(define-read-only (get-owner (token-id uint))
  ;; Make sure to replace MY-OWN-NFT
  (ok (nft-get-owner? MY-OWN-NFT token-id)))

;; SIP009: Get the last token ID
(define-read-only (get-last-token-id)
  (ok (var-get last-id)))

;; SIP009: Get the token URI. You can set it to any other URI
(define-read-only (get-token-uri (token-id uint))
  (ok (some "https://docs.stacks.co")))

;; Internal - Mint new NFT
(define-private (mint (new-owner principal))
    (let ((next-id (+ u1 (var-get last-id))))
      ;; Make sure to replace MY-OWN-NFT
      (match (nft-mint? MY-OWN-NFT next-id new-owner)
        success
          (begin
            (var-set last-id next-id)
            (ok true))
        error (err error))))
```

Continue editing the file, making sure that you replace the `MY-OWN-NFT` string in the contract with your own string.

When you have finished editing the file, run `clarinet check` in the terminal to check that your Clarity code is valid.

## Step 5: Review contracts and methods in the console

If the Clarity code is valid, you can run `clarinet console` in the terminal to interact with the contract.

```
Contracts
+-----------------------------------------------------+---------------------------------+
| Contract identifier                                 | Public functions                |
+-----------------------------------------------------+---------------------------------+
| ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.my-nft    | (claim)                         |
|                                                     | (get-last-token-id)             |
|                                                     | (get-owner (token-id uint))     |
|                                                     | (get-token-uri (token-id uint)) |
|                                                     | (transfer                       |
|                                                     |     (token-id uint)             |
|                                                     |     (sender principal)          |
|                                                     |     (recipient principal))      |
+-----------------------------------------------------+---------------------------------+
| ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.nft-trait |                                 |
+-----------------------------------------------------+---------------------------------+
```

Try claiming the NFT by running the command `(contract-call? .my-nft claim)`. You should receive console output similar
to the following:

```
>> (contract-call? .my-nft claim)
Events emitted
{"type":"nft_mint_event","nft_mint_event":{"asset_identifier":"ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.my-nft::MY-OWN-NFT","recipient":"ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE","value":"u1"}}
(ok true)
```

## Step 6: Add tests

At this point, the contract functions as intended, and can be deployed to the blockchain. However, it is good practice
to write automated testing to ensure that the contract functions always perform in the expected way. When adding
complexity or changing the contract, having pre-written, working tests can help you verify that changes you make don't
alter the way that contract functions behave.

Open the `tests/my-nft_test.ts` file in your IDE. In this step, you will add a single automated test to verify the
`get-last-token-id` and `get-token-uri` functions of the contract.

The test uses the `chain.mineBlock()` function to simulate the mining of a block. Within that simulated block, the test
makes 2 contract calls (`Tx.contractCall()`), one each to each of the contract functions under test.

Once the simulated block is mined, the test can make assertions about the return values of the functions under test. The
test checks that 2 contract calls were made in the block, and that exactly one block was mined. The test then asserts
that the return values of each contract call were `ok`, and that the value wrapped in the `ok` is the expected value.

Replace the contents of the `tests/my-nft_test.ts` file with the following code:

```ts
import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v0.12.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: 'Ensure that NFT token URL and ID is as expected',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    let wallet_1 = accounts.get('wallet_1')!;
    let block = chain.mineBlock([
      Tx.contractCall('my-nft', 'get-last-token-id', [], wallet_1.address),
      Tx.contractCall('my-nft', 'get-token-uri', [types.uint(1)], wallet_1.address),
    ]);
    assertEquals(block.receipts.length, 2);
    assertEquals(block.height, 2);
    block.receipts[0].result.expectOk().expectUint(0);
    block.receipts[1].result.expectOk().expectSome().expectAscii('https://docs.stacks.co');
  },
});
```

Run `clarinet test` in the terminal to review the output of the test.

=> You have now learned how to work with contract traits, and how to unit test a contract with Clarinet. If you would
like to try deploying your contract to the testnet, proceed with the following optional step.

## Optional: Deploy the NFT to the testnet

For this tutorial, you'll use the [testnet sandbox](https://explorer.stacks.co/sandbox/deploy?chain=testnet) to deploy
your smart contract. Make sure you have connected your [Stacks web wallet](https://www.hiro.so/wallet/install-web) to
the sandbox using the **Connect wallet** button, then copy and paste the `my-nft.clar` smart contract into the Clarity
code editor on the [Write & Deploy](https://explorer.stacks.co/sandbox/deploy?chain=testnet) page. Edit the contract name or use the randomly generated name provided to you.

Click **Deploy** to deploy the contract to the blockchain. This will display the Stacks web wallet window with
information about the transaction. Verify that the transaction looks correct, and the network is set to `Testnet`, and
click **Confirm**.

The deployment process can take up to 15 minutes to complete. You can review it on the
[transactions](https://explorer.stacks.co/transactions?chain=testnet) page of the explorer, or in the activity field of
your web wallet.

When your contract is confirmed, navigate to the
[Call a contract](https://explorer.stacks.co/sandbox/contract-call?chain=testnet) page of the sandbox, and search for
your contract. Enter your wallet address in the top field, can you copy this address by clicking the Stacks web wallet
icon and clicking the **Copy address** button. Enter the contract name in the bottom field, in this case `my-nft`. Click
**Get contract** to view the contract.

Click the `claim` function in the function summary, then click **Call function** to perform the function call in the
sandbox. This will display the Stacks web wallet with information about the transaction. Verify the information, then
click **Confirm** to execute the function call. The function call can take up to 15 minutes to complete.

When the transaction is complete, you can access the transaction summary page from the activity panel of your web
wallet. The transaction summary page displays the output of the function. You should also see your personal NFT in your
web wallet.
