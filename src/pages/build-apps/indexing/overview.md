---
title: Overview
description: Build multi-player apps that index, store, and query user data with Radiks
images:
  large: /images/pages/radiks.svg
  sm: /images/pages/radiks-sm.svg
---

## Introduction

The Stacks Radiks feature enables Stacks decentralized applications (DApps) to index and store across data
belonging to multiple users. Radiks works with Stacks's Gaia Storage System. Using Radiks, you can build
multi-player DApps that:

- index, store, and query application data
- query a user's publicly saved data
- display real-time updates that reflect in progress changes
- support collaboration among sets of users

Want to jump right in and start integrating indexing into your app? [Try this tutorial](/build-apps/tutorials/indexing).

## Why use Radiks?

Many applications serve data that users create to share publicly with others. Facebook, Twitter, and Instagram are
examples of such applications. Decentralized applications that want to create comparable multi-user experiences must
ensure that anything a user creates for public sharing is still under control of the creator in the user's Gaia storage.

For example, if Twitter wanted to be a decentralized application while still having many different users creating their
own tweets, those tweets would be stored in each user's own Gaia storage. In such a situation, Twitter still needs a way
to keep track of everyone's tweets, display those tweets in user timelines, and perform searches across the platform.
Radiks exists to support these kinds of scenarios. It allows applications to query across multiple user data using
complicated queries like text search, joins, and filters.

Radiks allows applications to query data in a performant and flexible way. Each application that wishes to index and
query in this way requires its own Radiks server.

## How Radiks works with application data

Radiks consists of a database, a pre-built server, and a client. A developer adds the Radiks library to their application.
With this library, developers model their application data. The model defines an application data schema for the Radiks
server. Then, you can use calls to write and query data that use that schema. Whenever an application saves or updates
data on behalf of a user, Radiks follows this flow:

1. Encrypts private user data on the client-side.
2. Saves a raw JSON of this encrypted data in the user's Gaia storage.
3. Stores the encrypted data on the Radiks server.

Radiks can store both public and sensitive, non-public data since all data is encrypted by default before it leaves the
client. Your application can query Radiks for public data and then decrypt the sensitive information on the client.
Radiks servers can only return queries for unencrypted data.

## How Radiks authorizes writes

Radiks must ensure that the user is writing to their own data. To ensure this, Radiks creates and manages _signing keys_.
These keys sign all writes that a user performs. Radiks server-validates all signatures before performing a write. This
guarantees that a user is not able to overwrite another user's data.

A Radiks server is also built to support writes in a collaborative but private situation. For example, consider a
collaborative document editing application, where users can create organizations and invite users to that organization.
All users in that organization should have read and write privileges to the organization data. Thus, these organizations
will have a single shared key that is used to sign and encrypt data.

When an organization administrator needs to remove a user from the group, they are expected to revoke the previous key
and create a new one. Radiks is aware of these relationships, and will only support writes that are signed with the
currently active key related to an organization.

## Is Radiks decentralized

Although Radiks applications rely on a centrally hosted database, an application using Radiks remains fundamentally
decentralized. A DApp that uses Radiks has these characteristics.

### Built on decentralized authentication

Radiks is deeply tied to Stacks authentication, which uses a blockchain and Gaia to give you full control over
your user data.

### No data lock-in

All user data is first stored in Gaia before encrypted with the user's keys and stored in Radiks. This process means
the user still controls their data for as long as they need to. If the application's Radiks server shuts down, the
user can still access their data. And, without the user's signing keys, an application cannot decrypt the user's data.
Users may also backup or migrate their application data from Gaia.

### Censorship resistance

All data is also stored in Gaia; no third-party can revoke access to this data.

### Maximum privacy

All data is encrypted on the client-side before being stored anywhere using Stacks authorization. The application
host cannot inspect, sell, or use user data in any way that a user doesn't explicitly authorize.

If you are not familiar with Gaia, see [read the Gaia documentation](/build-apps/references/gaia).
