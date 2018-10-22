---
layout: org
permalink: /:collection/:path.html
---
# What is the Blockstack Ecosystem

The Blockstack Ecosystem has a mission to bring a new internet where users
control the access to, and use of, their own identity and data. With this
mission in mind, three independent entities were formed:

* TOC
{:toc}

These three affiliated entities drive the advancement of the Blockstack mission.
In this section, you learn about the mechanisms each entity uses to advance the
overall mission.


## Blockstack Public Benefit Corp (PBC)

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

- Scale quickly to large, performant production systems. Blockstack’s GAIA storage system gives fast, scalable performance on a level comparable to Amazon S3, Google Drive, or Azure.

Using Blockstack’s technology developers can start building immediately on the
blockchain with the knowledge you have today. You won’t need to spend time or
effort developing expertise in specialized languages or technologies.

## Blockstack Signature Fund

On 2017 Blockstack announced the Blockstack Signature Fund — a $25 million fund
of thesis-driven VCs supporting teams looking to build for the long term on the
new internet. The Signature Fund is aimed at growing an ecosystem of
decentralized applications on Blockstack. Application creators can apply for
funding. Application investors can apply to qualify as a funding partner.

The fund releases funds through a Signature Bounty program. This is a global
bounty program using a contest model. Teams from all over the world submit
products and a set of judges determine who wins the prize for the best product.

In addition to the bounty program, Blockstack supports an application mining
program. This is an early stage program for developers. In this program,
application developers register their application on App.co. Then, each month,
application developers get paid each month depending on their application
quality ranking. The ranking is determined by a set of application reviewers.

Application mining differs from the venture model or the app studio model
because the rewards are in cryptocurrency. Blockstack PBC administrates both the
review and delivery of these monthly payments.

## Blockstack Token LLC

Through the 2017 Blockstack token offering, Blockstack Token LLC created the
Stacks token. Stacks are a utility token which is distinct from security tokens
and are often called app tokens or user tokens. The Stacks token help to seed
both blockchain application development and incentives for blockchain users.

In the third quarter of 2018, Blockstack activated the token which enabled the
following two features:

* Purchase of names and namespaces with the Stacks token.

* Continued life of the Stacks token in the event Blockstack migrates off of Bitcoin (the blockchain underlying the Stacks blockchain).

In future upgrades and hard forks, allowing the token to implement proof-of-burn
mining, a new type of blockchain mining algorithm where instead of burning
electricity to produce blocks, miners burn an existing cryptocurrency. The
Stacks token will make it possible to implement full-fledged smart contracts.
Right now, Blockstack Core supports a simple kind of smart contract
(namespaces), but in the future, it will support any smart contract written in a
non-Turing-complete Lisp dialect we’re developing.

The Stacks token will make it possible for light clients to calculate the
economic weight of different Blockstack Core chain forks, and identify the fork
with the most economic activity. Today, light clients have to be told a priori
which fork to use. This will be very useful for mobile apps that want to perform
name lookups without having to rely on a remote Core node.
