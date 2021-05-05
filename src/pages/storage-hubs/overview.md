---
title: Storage hubs overview
description: Securely store application and user data off-chain
---

## Introduction

The Gaia storage system allows you to store private application data off the blockchain and still access it securely
with Stacks applications. Where possible, applications should only store critical transactional metadata directly to
the Stacks blockchain, while keeping application and user data in the Gaia storage system. For more information about
the Gaia storage system, see the [Gaia protocol reference](/build-apps/references/gaia).

A [Gaia hub](/build-apps/references/gaia#user-control-or-how-is-gaia-decentralized) consists of a service and a storage
resource, generally hosted on the same cloud compute provider. The hub service requires an authentication token from a
storage requestor, and writes key-value pairs to the associated storage resource. Storage requestors can choose a Gaia
hub provider. This documentation provides an overview of how to set up and operate a Gaia hub.
