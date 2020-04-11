---
layout: learn
permalink: /:collection/:path.html
---
# Overview
{:.no_toc}

* TOC
{:toc}

Blockstack Connect is a Javascript library for integrating your application with Stacks v2. With Connect, you get some big benefits:

- Pre-built UI to introduce your users to Blockstack, before they authenticate
- Integration with our new authenticator
- Ability to interact with the Stacks 2.0 blockchain, with support for smart contracts and other transactions.

## Demo

To get a test feel for the user experience of using Connect, you can use [Banter](https://banter.pub).

## How does this compare to `blockstack.js`?

Although [`blockstack.js`](https://github.com/blockstack/blockstack.js) exposes everything you need to handle authentication with Blockstack, there is still the hard problem of getting users used to the paradigm of authentication that is privacy-first and self-sovereign. Many apps implement their own dialogues before authentication, which explain what Blockstack is and why they use it.

`@blockstack/connect` provides developers with a plug-and-play API that is simple to use, and provides great, out-of-the-box education that end-users can understand.