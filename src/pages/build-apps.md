---
title: Building decentralized apps
description: Overview and guides for getting started building decentralized applications.
images:
  large: /images/pages/build-apps.svg
  sm: /images/pages/build-apps-sm.svg
---

## Introduction

Prefer to jump right in? Get started with this tutorial where you’ll create a decentralized to-do list app.

[@page-reference | inline]
| /authentication/building-todo-app

## What are decentralized apps?

Decentralized apps are apps that don’t depend on a centralized platform, server or database. Instead, they use a
decentralized network, built on the Stacks blockchain, for [authentication](/authentication/overview), [data storage](/data-storage/overview),
and [backend logic](/data-storage/indexing-overview). Just like Bitcoin, a decentralized network of applications is accessible to
anyone and not controlled by any central authority.

To learn more about the Stacks network and decentralization, read the [Stacks overview](/ecosystem/overview).

### User-owned data

Data is stored with the user and encrypted with a key that only they own. Developers aren’t responsible for, or have to
host, their users’ data. This protects users against security breaches and keeps their data private.

### Smart contracts

Decentralized apps can use [smart contracts](/write-smart-contracts/overview) to make their backend logic public, open, and
permissionless. Once published on the blockchain, no one really owns or controls a smart contract. They will execute when
the terms are met, regardless of who interacts with it.

### Compatible and extendable

Decentralized apps are compatible by nature because they use the same data and shared state. You can build on top of
other apps without requiring permission or fear of being shut out.

## Getting started

To build your decentralized app, you’ll use [authentication](/authentication/overview), [data storage](/data-storage/overview),
[data indexing](/data-storage/indexing-overview) (optional), and [smart contracts](/write-smart-contracts/overview) (optional).
Get started with the documentation and tutorials below.

### Authentication and data storage

Like a regular app, yours will require user authentication and data storage — but decentralized. Get started with the
documentation below or try the tutorial.

[@page-reference | inline]
| /authentication/overview

[@page-reference | inline]
| /data-storage/overview

[@page-reference | inline]
| /authentication/building-todo-app

### Data indexing

If you need to store and index data shared by multiple users, such as messages or a shared document, read the Radiks
documentation.

[@page-reference | inline]
| /data-storage/indexing-overview

### Smart contracts

You can use smart contracts to decentralize your app’s backend logic, making it open and permissionless. Smart contracts
on the Stacks blockchain are written in the [Clarity language](https://clarity-lang.org). View the smart contracts documentation or get started with a tutorial.

[@page-reference | inline]
| /write-smart-contracts/overview

[@page-reference | inline]
| /write-smart-contracts/hello-world-tutorial

[@page-reference | inline]
| /write-smart-contracts/counter-tutorial

[@page-reference | inline]
| /write-smart-contracts/public-registry-tutorial

### Stacks.js

[Stacks.js](https://blockstack.github.io/stacks.js/) is a collection of JavaScript library developed by Blockstack PBC that makes it easy to integrate authentication, data storage
and smart contracts functionality in a user-friendly way.
