---
layout: org
description: "Blockstack Network documentation"
permalink: /:collection/:path.html
---
# Overview of Blockstack

Blockstack is a full-stack decentralized computing network that enables a new generation of applications where developers and users can interact fairly and securely. Blockstack uses blockchain technology to build protocols and developer tools designed to enable a fair and open Internet that returns digital rights to developers and consumers.


## What is the Blockstack Ecosystem?

The Blockstack Ecosystem is the legal entities and community structures that support the Blockstack technology, the apps that rely on it, and the people that work with it. The ecosystem’s mission is to foster an open and decentralized Internet that establishes and protects privacy, security and freedom for all users.

The documentation on this site focuses on the technologies produced by three entities in the ecosystem.


### Blockstack Public Benefit Corp (PBC)

Blockstack Public Benefit Corp. (PBC) started development of the Blockstack
platform in 2014 and launched an alpha of the platform in early 2017. The
platform’s development philosophy followed two simple principles. First, create
backend facilities that allow blockchain applications to be both performant and
scalable. Second, provide simple, familiar development interfaces to blockchain
technology. The result of this effort is a technology platform that allows
developers to:

- Build a blockchain application in any Javascript framework. The platform does not require learning a new programming language or extending an existing application stack.

- Use well-defined REST endpoints that simplify and encapsulate the blockchain backend. The Blockstack Javascript API reduces blockchain-backed applications to familiar `GET` and `PUT` operations.

- Access the Blockstack’s Naming System (BNS). The system has over 70K users that can immediately start using your application.

- Scale quickly to large, performant production systems. Blockstack’s Gaia storage system gives fast, scalable performance on a level comparable to Amazon S3, Google Drive, or Azure.

Using Blockstack’s technology developers can start building immediately on the
blockchain with the knowledge you have today. You won’t need to spend time or
effort developing expertise in specialized languages or technologies.

### Blockstack Signature Fund

{% include signature_fund.md %}

### Blockstack Token LLC

Through the 2017 Blockstack token offering, Blockstack Token LLC created the
Stacks token. This year's hard fork is an especially exciting milestone for the ecosystem because it distributes the first Stacks tokens to existing purchasers and recipients. This hard fork launches the Stacks blockchain v1, and enables the following two features for the Blockstack network:

* Registration of all digital assets and smart contracts for registering digital assets with the Stacks token.

* A genesis block that distributes Stacks tokens to existing purchasers.

A full technical description of the upgrade is available on <a href="https://forum.blockstack.org/t/blockstack-annual-hard-fork-2018/6518" target="\blank" >the Blockstack forum</a>.

In future upgrades and hard forks, the blockchain will expand to introduce a new
scalable consensus algorithm to increase the number of transactions it can
process.  This consensus algorithm is planned to be introduced in additional
hard forks in 2019.

Addtionally, a future Stacks blockchain will support truly decentralized mobile
applications by removing the need to trust a remote Blockstack Core node.
Instead, it will be possible for light clients to calculate the economic weight
of different Stacks blockchain forks, and identify the fork with the most
economic activity. Today, light clients  rely on other trusted sources for fork
selection and cannot make that decision independently. For mobile apps this
enables functionality like looking up names without having to rely on a remote
Blockstack Core node.

Finally, Blockstack currently supports relatively simple smart contracts that
are used to register digital assets on the network. The Stacks blockchain v2
will support general-purpose smart contracts written in a non-Turing-complete
language currently under development.

{% include important.html content="<p>This webpage
contains forward-looking statements, including statements regarding Blockstack
PBC’s plans for the Blockstack Core and blockchain. Forward-looking statements
are subject to risks and uncertainties that could cause actual results to differ
materially, and reported results should not be considered as an indication of
future performance. Potential risks and uncertainties that could change our
actual results include, but are not limited to, risks associated with: the
failure of Blockstack to successfully implement proof-of-burn mining; the
failure of Blockstack to successfully launch the genesis block; technical
obstacles in further developing the Stacks blockchain and potential failure of
its underlying technology; the failure of App Mining Program to successfully
incentivize the development of applications for the Blockstack network; risks
associated with potential attacks on the Stacks blockchain, its mining
mechanisms and the App Reviewers; technical difficulties in the transition from
a centralized to a decentralized administration of the App Mining program; and
the ability of Blockstack to develop the Blockstack Core. These forward-looking
statements speak only as of the date hereof. Blockstack PBC disclaims any
obligation to update these forward-looking statements.</p>" %}
