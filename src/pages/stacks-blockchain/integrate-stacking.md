---
title: Integrate Stacking
description: Understand how to add Stacking capabilities to your wallet or exchange
experience: advanced
duration: 60 minutes
tags:
  - tutorial
images:
  large: /images/pages/todo-app.svg
  sm: /images/pages/todo-app-sm.svg
---

![What you'll be creating in this tutorial](/images/todo-list-app.png)

## Introduction

In this tutorial, you will learn how to integrate Stacking by interacting the respective smart contract using Connect and reading data from the Stacks Blockchain API.

This tutorial highlights the following functionality:

- Reading wallet information and verifying if Stacking participation is possible
- Initiating Stacking participation and locking up Stacks tokens
- Reading Stacking reward details (reward and lockup period, amount of tokens locked up)

## Requirements

You should [review and understand the Stacking mechanism](/stacks-blockchain/stacking).

## Overview

The Stacking flow:

- [unlocked]
  - history (previous lock-ups, durations, dates, and rewards)
  - next cycle timestamp?
- [action: lock-up]
  - duration of lock-up?
  - estimated rewards?
- [locked]
  - time to unlock
  - disable further lock-up action
- [auto action: unlock]
  - enable lock-up action
  - actual rewards

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
