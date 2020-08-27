---
title: Integrate Stacking
description: Learn how to add Stacking capabilities to your wallet or exchange
experience: advanced
duration: 60 minutes
tags:
  - tutorial
images:
  sm: /images/pages/stacking-rounded.svg
---

![What you'll be creating in this tutorial](/images/stacking-view.png)

## Introduction

In this tutorial, you will learn how to integrate Stacking by interacting with the respective smart contract and reading data from the Stacks blockchain.

This tutorial highlights the following functionality:

- Reading wallet information and verifying Stacking eligibility
- Initiating Stacking participation and locking up Stacks tokens by signing a transaction using [Blockstack Connect](/authentication/connect)
- Reading Stacking reward details by calling the [Stacks Blockchain API](/references/stacks-blockchain)

## Requirements

You should [review and understand the Stacking mechanism](/stacks-blockchain/stacking).

## Overview

![The flow you'll be implementation in this tutorial](/images/stacking-illustration.png)

In this tutorial, we will implement this Stacking flow:

1. Make API calls to get details about the upcoming reward cycle. The details include the next cycle timestamp, cycle duration, and estimated rewards
2. For a specific Stacks wallet, confirm the minimum balance required and no locked-up tokens
3. Enable participation by letting the Stacks wallet holder confirm the BTC reward address and the lockup duration. The action will result in a transaction that needs to be signed by the wallet holder
4. The transaction is broadcasted. With the confirmation of the transaction, the Stacks tokens will be locked-up and inaccessible throughout the lockup period
5. The Stacking mechanism executes reward cycles and sends out rewards to the set BTC reward address
6. During the lockup period, make API calls to get details about unlocking timing, rewards collected and projected
7. Once lockup period is passed, the tokens are released and accessible again
8. Display actual rewards collected from the last Stacking participation

## Step 1: Integrate JS libraries

- add connect to enable transaction signing
- add stacks API client lib to enable API calls and WebSockets

## Step 2: Display stacking info

- call Stacks API to obtain info: next cycle, cycle time

## Step 3: Add lock-up action

- ask for: BTC address, duration, token amount
- calls Stacks API to obtain info: estimated rewards
- verify BTC address (?) > maybe show in BTC explorer
- initiate transaction and handle signing

## Step 4: Confirm lock-up and display status

- calls Stacks API to obtain info: status, (estimated) rewards, unlock time

## Step 5: Display stacking history (optional)

- alls Stacks API to obtain info: previous lock-ups, durations, dates, and rewards

## Notes on delegation

- provide info for stacking delegation process
