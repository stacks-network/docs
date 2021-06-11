---
title: My own NFT
description: Build your own NFT on Bitcoin
duration: 15 minutes
experience: beginners
tags:
  - tutorial
icon: TestnetIcon
images:
  large: /images/pages/nft/nft.png
  sm: /images/pages/nft/nft.png
---

![What you'll build in this tutorial](/images/pages/nft/nft-preview.png)

## Introduction

In this tutorial, you will create your own non-fungible token (NFT) on [Bitcoin](/understand-stacks/bitcoin) by deploying and running a Clarity smart contract.

NFTs have desirable [characteristics](/write-smart-contracts/tokens) like uniqueness, programmability, and permanent records ownership. Very simplfied, an NFT is a piece of information that is unique. A common example of an NFT might be a piece of digital art.

> To experience collecting and owning an NFT, try out the [SWAG NFT app](https://stacks-nft-onboarding.vercel.app/).

Clarity offers native support for token creation and management. On top of that, the Stacks ecosystem adopted a standard for NFTs (see [SIP009](https://github.com/stacksgov/sips/blob/main/sips/sip-009/sip-009-nft-standard.md)). With these in place, it becomes very easy for anyone to create NFTs.

By the end of this tutorial, you will ...

- Have a working Clarity smart contract based on the SIP009 standard
- Deploy a contract to the Stacks 2.0 testnet and call a public method
- Claim a very rare SWAG NFT - limited to only 100 pieces!

## Prerequisites

Install [Stacks Wallet for web](https://www.hiro.so/wallet/install-web) - a Firefox/Chrome extension that will allow you manage your wallet and confirm transactions from within your browser.

## Step 1: obtain STX for testing

Uploading and calling smart contracts requires you to pay network fees to process the transactions. You need to get some testnet tokens, so you can pay the fees in the next steps.

The **STX faucet** allows you request testnet tokens. To run the faucet, open up the [Sandbox faucet view](https://explorer.stacks.co/sandbox/faucet?chain=testnet) and click on "Request STX":

![faucet](/images/pages/nft/faucet.png)

Once the faucet call was send, you will see a confirmation: "STX coming your way shortly!". You need to wait up to 2 minutes for the transaction to complete.

-> You have to wait until the transaction is completed on the testnet. The testnet has a transaction processing time ("target block time") of 2 minutes. The waiting period on the mainnet is close to 10 minutes.

Once the transaction is successfully processed, you can see that your new balance on the right side of the Sandbox view.

## Step 2: deploy your NFT contract

Open up the [Sandbox deploy view](https://explorer.stacks.co/sandbox/deploy?chain=testnet). You should see a Clarity code editor with a "hello world" code snippet. Replace the entire code with the following:

!> Make sure to replace `MY-OWN-NFT` with your own token name!

```clar
;; use the SIP090 interface
(impl-trait 'ST2D2YSXSNFVXJDWYZ4QWJVBXC590XSRV5AMMCW0.nft-trait.nft-trait)

;; define a new NFT. Make sure to replace MY-OWN-NFT
(define-non-fungible-token MY-OWN-NFT uint)

;; Store the last issues token ID
(define-data-var last-id uint u0)

;; Claim a new NFT
(define-public (claim)
  (mint tx-sender))

;; SIP090: Transfer token to a specified principal
(define-public (transfer (token-id uint) (sender principal) (recipient principal))
  (if (and
        (is-eq tx-sender sender))
      ;; Make sure to replace MY-OWN-NFT
      (match (nft-transfer? MY-OWN-NFT token-id sender recipient)
        success (ok success)
        error (err error))
      (err u500)))

;; SIP090: Get the owner of the specified token ID
(define-read-only (get-owner (token-id uint))
  ;; Make sure to replace MY-OWN-NFT
  (ok (nft-get-owner? MY-OWN-NFT token-id)))

;; SIP090: Get the last token ID
(define-read-only (get-last-token-id)
  (ok (var-get last-id)))

;; SIP090: Get the token URI. You can set it to any other URI
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
            ;; only make contract call when last-id is 0
            (if
              (is-eq next-id u1)
              (contract-call? 'ST2D2YSXSNFVXJDWYZ4QWJVBXC590XSRV5AMMCW0.exclusive-swag-nft claim-swag)
              (ok true)))
        error (err error))))

;; Internal - Register for exclusive NFT eligiblity
(contract-call? 'ST2D2YSXSNFVXJDWYZ4QWJVBXC590XSRV5AMMCW0.exclusive-swag-nft register-contract)
```

Next, set a name for your contract. The Sandbox creates a random name, but we should replace it for easier future reference. You can use the same name you used to replace `MY-OWN-NFT`.

With the contract code and name defined, you can hit the "Deploy" button. It will open the Stacks Web Wallet:

![faucet](/images/pages/nft/wallet.png)

Verify that all the information is correct and hit "Confirm" to deploy your contract! You need to wait up to a minute for the transaction to complete.

## Step 3: claim your new NFT

// TODO

=> **Congratulations!** You can now ...

With the completion of this tutorial, you:

-

## Bonus: collect a rare SWAG NFT
