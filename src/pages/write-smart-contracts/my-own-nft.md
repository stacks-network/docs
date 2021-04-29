---
title: My own NFT
description: Build your own NFT on Bitcoin
duration: 15 minutes
experience: beginners
tags:
  - tutorial
icon: TestnetIcon
images:
  large: /images/pages/hello-world.svg
  sm: /images/pages/hello-world-sm.svg
---

![What you'll build in this tutorial](/images/pages/nft/nft-preview.png)

## Introduction

In this tutorial, you will create your own non-fungible token (NFT) on [Bitcoin](/understand-stacks/bitcoin) by deploying and running a Clarity smart contract.

NFTs have desirable [characteristics](/write-smart-contracts/tokens) like uniqueness, programmability, and permanent records ownership. Very simplfied, an NFT is a piece of information that is unique. A common example of an NFT might be a piece of digital art.

> To experience collecting and owning an NFT, try out [our SWAG NFT app]().

Clarity offers native support for token creation and management. On top of that, the Stacks ecosystem adopted a standard for NFTs (see [SIP009](https://github.com/stacksgov/sips/pull/3)). With these in place, it becomes very easy for anyone to create NFTs.

By the end of this tutorial, you:

- Have a working Clarity smart contract based on the SIP009 standard
- Deploy a contract to the Stacks 2.0 blockchain and call its public methods
- Can collect a very rare SWAG NFT - limited to only 100 pieces!

## Prerequisites

## Step 1: understand NFT standard

Similarly to NFT standards in Ethereum (see [EIP 721](https://eips.ethereum.org/EIPS/eip-721)), [SIP009](https://github.com/stacksgov/sips/pull/3) is an interface definition that the Stacks ecosystem aligned on. With support for this standard across wallets and tools, it becomes easy to interact with NFTs. Here are the contract characteristcs are required by the standard:

- Ability to obtain the last token identifier (`get-last-token-id`). This id represents the upper limit of NFTs issued by the contract
- A URI to metadata associated with a specific token identifier. (`get-token-uri`). This URI could resolve to a JSON file with information about the creator, associated media files, descriptions, signatures, and more
- Ability to verify the owner for a given token identifier (`get-owner`). The owner resolves to a [Stacks principal](/write-smart-contracts/principals)
- Ability to transfer an NFT to a recipient (`transfer`). The recipient is required to be a Stacks principal as well

## Step 2: obtain STX for testing

Uploading and calling smart contracts requires you to pay network fees to process the transactions. You need to get some testnet tokens, so you can pay the fees in the next steps.

The **STX faucet** allows you request testnet tokens. To run the faucet, open up the [Sandbox faucet view](https://explorer.stacks.co/sandbox/faucet?chain=testnet) and click on "Request STX":

![faucet](/images/pages/nft/faucet.png)

Once the faucet call was send, you will see a confirmation: "STX coming your way shortly!". You need to wait up to a minute for the transaction to complete.

Once the transaction is successfully processed, you can see that your new balance on the right side of the Sandbox view.

## Step 3: deploy your NFT contract

Open up the [Sandbox deploy view](https://explorer.stacks.co/sandbox/deploy?chain=testnet). You should see a Clarity code editor with a "hello world" code snippet. Replace the entire code with the following:

```clar
;; use the SIP090 interface
(impl-trait 'ST000000000000000000002AMW42H.nft-trait.nft-trait)

;; define a new NFT. Make sure to replace NFT_NAME
(define-non-fungible-token <NFT_NAME> uint)

;; Store the last issues token ID
(define-data-var last-id uint u0)

;; Claim a new NFT
(define-public (claim)
  (ok (mint tx-sender)))

;; SIP090: Transfer token to a specified principal
(define-public (transfer (token-id uint) (sender principal) (recipient principal))
  (if (and
        (is-eq tx-sender sender))
      ;; Make sure to replace NFT_NAME
      (match (nft-transfer? <NFT_NAME> token-id sender recipient)
        success (ok success)
        error (err {code: error}))
      (err {code: error})))

;; SIP090: Get the owner of the specified token ID
(define-read-only (get-owner (token-id uint))
  ;; Make sure to replace NFT_NAME
  (ok (nft-get-owner? <NFT_NAME> token-id)))

;; SIP090: Get the last token ID
(define-read-only (get-last-token-id)
  (ok (var-get last-id)))

;; SIP090: Get the token URI. You can set it to any other URI
(define-read-only (get-token-uri (token-id uint))
  (ok (some "https://docs.blockstack.org")))

;; Internal - Mint new NFT
(define-private (mint (new-owner principal))
    (let ((next-id (+ u1 (var-get last-id))))
      ;; Make sure to replace NFT_NAME
      (match (nft-mint? <NFT_NAME> next-id new-owner)
        success
          (begin
            (var-set last-id next-id)
            (ok success))
        error (err {code: error}))))
```

!> Make sure to replace `<NFT_NAME>` with your own token name!

Next, set a name for your contract. The Sandbox creates a random name, but we should replace it for easier future reference. You can use the same name you used to replace `<NFT_NAME>`.

With the contract code and name defined, you can hit the "Deploy" button. It will open the Stacks Web Wallet:

![faucet](/images/pages/nft/wallet.png)

Verify that all the information is correct and hit "Confirm" to deploy your contract! You need to wait up to a minute for the transaction to complete.

## Step 4: claim your new NFT

// TODO

=> **Congratulations!** You can now ...

With the completion of this tutorial, you:

-

## Bonus: collect a rare SWAG NFT
