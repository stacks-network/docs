---
title: Gaia
description: Decentralized storage architecture for off-chain data
images:
  large: /images/pages/data-storage.svg
  sm: /images/pages/data-storage-sm.svg
---

## Introduction

Apps built with the Stacks blockchain store off-chain data using a storage system called
Gaia.

Whereas public transactional metadata is best stored on the Stacks blockchain, user
application data can often be stored more efficiently and privately in Gaia storage.

Storing data off of the blockchain ensures that Stacks applications can provide users with high performance and high availability for data reads and writes without introducing central trust
parties.

## Understand Gaia in the Stacks architecture

The following diagram depicts the Stacks architecture and Gaia's place in it:

![Stacks Architecture](/images/architecture.png)

Blockchains require consensus among large numbers of people, so they can be slow. Additionally, a blockchain is not designed to hold a lot of data. This means using a blockchain for every bit of data a user might write and store is expensive. For example, imagine if an application were storing every tweet in the chain.

The Stacks blockchain addresses performance problems using a layered approach. The base layer consists of the Stacks blockchain and the Blockchain Naming System (BNS). The blockchain governs ownership of identities in the Stacks network. Identities can be names such as domain names, usernames, or application names.

When an identity is created, its creation is recorded in the Stacks blockchain. Identities make up the primary data stored into the Stacks blockchain. These identities correspond to routing data in the OSI stack. The routing data is stored in the Atlas Peer Network, the second layer. Every core node that joins the Stacks Network is able to obtain an entire copy of this routing data. Stacks uses the routing data to associate identities (domain names, user names, and application names) with a particular storage location in the final layer, the Gaia Storage System.

A Gaia Storage System consists of a _hub service_ and storage resource on a cloud software provider. The storage provider can be any commercial provider such as Azure, DigitalOcean, Amazon EC2, and so forth. Typically the compute resource and the storage resource reside same cloud vendor, though this is not a requirement. Gaia currently has driver support for S3 and Azure Blob Storage, but the driver model allows for other backend support as well.

Gaia stores data as a simple key-value store. When an identity is created, a corresponding data store is associated with that identity on Gaia. When a user logs into a dApp,
the authentication process gives the application the URL of a Gaia hub, which
then writes to storage on behalf of that user.

The Stacks blockchain stores only identity data. Data created by the actions of an identity is stored in a Gaia Storage System. Each user has profile data. When a user interacts with a decentralized dApp that application stores application data on behalf of the user. Because Gaia stores user and application data off the blockchain, a Stacks DApp is typically more performant than DApps created on other blockchains.

## User control or how is Gaia decentralized?

A Gaia hub runs as a service which writes to data storage. The storage itself is a simple key-value store. The hub service
writes to data storage by requiring a valid authentication token from a requestor. Typically, the hub service runs on a compute resource and the storage itself on separate, dedicated storage resource. Typically, both resources belong to the same cloud computing provider.

![Gaiastorage](/images/gaia-storage.png)

Gaia's approach to decentralization focuses on user control of data and its storage. Users can choose a Gaia hub provider. If a user can choose which Gaia hub provider to use, then that choice is all the decentralization required to enable user-controlled applications. Moreover, Gaia defines a uniform API for applications to access that data.

The control of user data lies in the way that user data is accessed. When an application fetches a file `data.txt` for a given user `alice.id`, the lookup will follow these steps:

1. Fetch the `zonefile` for `alice.id`.
2. Read her profile URL from her `zonefile`.
3. Fetch Alice's profile.
4. _Verify_ that the profile is signed by `alice.id`'s key
5. Find the read-only url out of the profile's `appsMeta` section (e.g. `https://example-app.gaia.alice.org`).
6. Fetch the file from `https://example-app.gaia.alice.org/data.txt`.

Because `alice.id` has access to her [zonefile](https://docs.stacks.co/references/bns-contract#name-update), she can change where her profile is stored. For example, she may do this if the current profile's service provider or storage is compromised. To change where her profile is stored, she changes her Gaia hub URL to another Gaia hub URL. If a user has sufficient compute and storage resources, a user may run their own Gaia Storage System and bypass a commercial Gaia hub provider all together.

~> Users with existing identities cannot yet migrate their data from one hub to another.

Applications writing directly on behalf of `alice.id` do not need to perform a lookup. Instead, the [Stacks authentication flow](http://blockstack.github.io/stacks.js/index.html) provides Alice's chosen gaia hub URL to the application. This authentication flow _is also_ within Alice's control because Alice's wallet _must_ generate the authentication response.

## Understand data storage

A Gaia hub stores the written data _exactly_ as given. It offers minimal guarantees about the data. It does not ensure that data is validly formatted, contains valid signatures, or is encrypted. Rather, the design philosophy is that these concerns are client-side concerns.

Client libraries (such as `Stacks.js`) are capable of providing these guarantees. A liberal definition of the [end-to-end principle](https://en.wikipedia.org/wiki/End-to-end_principle) guides this design decision.

When an application writes to a Gaia hub, an authentication token, key, and the data are passed to the Gaia hub.

![Gaia writes](/images/gaia-writes.png)

The token ensures the app has the authorization to write to the hub on the user's behalf.

## Gaia versus other storage systems

Here's how Gaia stacks up against other decentralized storage systems. Features
that are common to all storage systems are omitted for brevity.

| Features                                   | [Gaia](https://github.com/blockstack/gaia) | [Sia](https://sia.tech/) | [Storj](https://storj.io/) | [IPFS](https://ipfs.io/) | [DAT](https://datproject.org/) | [SSB](https://www.scuttlebutt.nz/) |
| ------------------------------------------ | ------------------------------------------ | ------------------------ | -------------------------- | ------------------------ | ------------------------------ | ---------------------------------- |
| User controls where data is hosted         | X                                          |                          |                            |                          |                                |                                    |
| Data can be viewed in a normal Web browser | X                                          |                          |                            | X                        |                                |                                    |
| Data is read/write                         | X                                          |                          |                            |                          | X                              | X                                  |
| Data can be deleted                        | X                                          |                          |                            |                          | X                              | X                                  |
| Data can be listed                         | X                                          | X                        | X                          |                          | X                              | X                                  |
| Deleted data space is reclaimed            | X                                          | X                        | X                          | X                        |                                |                                    |
| Data lookups have predictable performance  | X                                          |                          | X                          |                          |                                |                                    |
| Writes permission can be delegated         | X                                          |                          |                            |                          |                                |                                    |
| Listing permission can be delegated        | X                                          |                          |                            |                          |                                |                                    |
| Supports multiple backends natively        | X                                          |                          | X                          |                          |                                |                                    |
| Data is globally addressable               | X                                          | X                        | X                          | X                        | X                              |                                    |
| Needs a cryptocurrency to work             |                                            | X                        | X                          |                          |                                |                                    |
| Data is content-addressed                  |                                            | X                        | X                          | X                        | X                              | X                                  |
