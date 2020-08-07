---
title: Creating a Namespace
description: Learn how to create a namespace in the Blockstack Naming Service.
---

## Introduction

Making a namespace is very expensive. Given the large amount of cryptocurrency at stake in name creation, developers
wanting to create their own namespaces should read [Understand Namespaces](/core/naming/namespaces) first. You should
also read this document thoroughly before creating a namespace.

## Creation process

There are four steps to creating a namespace.

### Step 1. Send a `NAMESPACE_PREORDER` transaction

This step registers the _salted hash_ of the namespace with BNS nodes, and burns the requisite amount of cryptocurrency.
Additionally, this step proves to the BNS nodes that user has honored the BNS consensus rules by including a recent
_consensus hash_ in the transaction (see the section on [BNS forks](#bns-forks) for details).

### Step 2. Send a `NAMESPACE_REVEAL` transaction

This second step reveals the salt and the namespace ID (pairing it with its
`NAMESPACE_PREORDER`). It reveals how long names last in this namespace before
they expire or must be renewed, and it sets a _price function_ for the namespace
that determines how cheap or expensive names its will be.

The price function takes a name in this namespace as input, and outputs the amount of cryptocurrency the name will cost.
The function does this by examining how long the name is, and whether or not it has any vowels or non-alphabet characters.
The namespace creator has the option to collect name registration fees for the first year of the namespace's existence by
setting a _namespace creator address_.

### Step 3. Seed the namespace with `NAME_IMPORT` transactions

Once a namespace is revealed, the user has the option to populate it with a set of
names. Each imported name is given both an owner and some off-chain state.
This step is optional; Namespace creators are not required to import names.

### Step 4. Send a `NAMESPACE_READY` transaction

The final step of the process _launches_ the namespace and makes the namespace available to the
public. Once a namespace is launched, anyone can register a name in it if they
pay the appropriate amount of cryptocurrency. Again, the appropriate amount is according to the price function
revealed in step 2.

## Consensus rules and competition for namespaces

Namespaces are created on a first-come first-serve basis. The BNS consensus rules require a `NAMESPACE_REVEAL` to be
paired with a previous `NAMESPACE_PREORDER` sent within the past 24 hours. If two people try to create the same namespace,
the one that successfully confirms both the `NAMESPACE_PREORDER` and `NAMESPACE_REVEAL` wins. The fee burned in the
`NAMESPACE_PREORDER` is spent either way.

Once a user issues the `NAMESPACE_PREORDER` and `NAMESPACE_REVEAL`, they have 1 year before they must send the `NAMESPACE_READY`
transaction. If they do not do this, then the namespace they created disappears (along with all the names they imported).

Pairing the `NAMESPACE_PREORDER` and `NAMESPACE_REVEAL` steps is designed to prevent frontrunning. Frontrunning is a
practice where name registrar uses insider information to register domains for the purpose of re-selling them or earning
revenue from them. By registering the domains, the registrar locks out other potential registrars. Thus, through this
pairing, a malicious actor cannot watch the blockchain network and race a victim to claim a namespace.

## Explore the namespace creation history

If you would like to navigate a namespace history, you can. To do this, do the following:

1. Query a Stacks Blockchain server for a particular name.

   The format to query the Stacks Blockchain server is:

   `https://core.blockstack.org/v1/namespaces/NAMESPACE`

   For example, the `https://core.blockstack.org/v1/namespaces/id` query returns this transaction history:

   ```json
   {
     "address": "1KdDvp1DJ4EYUZc8savutRN4vv1ZwvGfQf",
     "base": 4,
     "block_number": 373601,
     "buckets": "[6, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]",
     "coeff": 250,
     "history": {
       "373601": [
         {
           "address": "1KdDvp1DJ4EYUZc8savutRN4vv1ZwvGfQf",
           "block_number": 373601,
           "burn_address": "1111111111111111111114oLvT2",
           "consensus_hash": "17ac43c1d8549c3181b200f1bf97eb7d",
           "op": "*",
           "op_fee": 4000000000,
           "opcode": "NAMESPACE_PREORDER",
           "preorder_hash": "9f1ad5039dbdabc2d98a87486ae1c478f03cd564",
           "sender": "76a914cc4c07c0ef988b7bae982ce1ece51615258a15e388ac",
           "sender_pubkey": "047c7f6d1f71780ccd373a7d2a020a1aeb7d47639e86fe951f5ba23a9ca8d6f7cfb03ed7ca411b22fa5244b9998d27d9c7bf7f0603f1997d1c7b3dc5a9b342c554",
           "token_fee": "0",
           "token_units": "BTC",
           "txid": "5f00b8e609821edd6f3369ee4ee86e03ea34b890e242236cdb66ef6c9c6a1b28",
           "vtxindex": 178
         }
       ]
     }
   }
   ```

2. Copy a `txid` (transaction id) from the json.

   For example, the `NAMESPACE_PREORDER` in this case has a `txid` of `5f00b8e609821edd6f3369ee4ee86e03ea34b890e242236cdb66ef6c9c6a1b28`.

3. Provide the id in a query to a blockchain explorer such as [Blockchain.com](https://www.blockchain.com/) or similar.

   For example, a search on Blockchain returns this [page of information](https://www.blockchain.com/btc/tx/5f00b8e609821edd6f3369ee4ee86e03ea34b890e242236cdb66ef6c9c6a1b28).
