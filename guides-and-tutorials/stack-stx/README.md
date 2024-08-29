# Stack STX

Stacking is an essential component of Stacks.

There are three different ways you can potentially stack your STX tokens and we have a dedicated guide for each of these scenarios.

If you aren't familiar with how stacking works, especially as it relates to signing after the Nakamoto upgrade, besure to check out the following concept guides:

* [Stackers and signing](../../concepts/block-production/stackers-and-signing.md)
* [Stacking](../../concepts/block-production/stacking.md)

In Nakamoto, stacking flows have significant changes in comparison to previous versions of Stacks. Because Nakamoto requires stackers to run a signer, which validates blocks produced by Stacks miners, stackers need to provide new information when making Stacking transactions.

These changes affect both solo Stacking and delegated Stacking. This document outlines the new flows for solo stacking. The next doc outlines the flow and steps for operating a pool.

If you aren't familiar with the general block production process under Nakamoto and what role signers and stackers play, you may want to read [Nakamoto in 10 Minutes](../../nakamoto-upgrade/nakamoto-in-10-minutes.md) to get up to speed.

The following sections will walk you through how to begin operating as a solo stacker.

Stacking utilizes the `pox-4` contract. There is a detailed [walkthrough of the stacking contract](../../example-contracts/stacking.md) that you can look at to see what functions are being called at each phase and some common errors you may encounter. This will be especially useful for pool operators who need to call these functions.

This doc is also useful if you run into errors when calling stacking functions, as it both walks through several common error scenarios and walks through each function call so you can more easily trace what might be happening.

Before we get into the step-by-step of how to actually stack, it's important to make sure you have an understanding of the different roles, processes and functions involved in Stacking.

### Definitions and Roles

* **Stacker**: an entity locking their STX to receive PoX rewards. This is a broad term including solo Stackers and Stackers who use pools.
* **Solo stacker**: an entity that locks their own STX and runs a signer. They don’t receive delegation.
* **Delegator**: a stacker who locks their STX and delegates to a signer or pool operator. They don’t run the signer.
* **Pool operator**: an entity that runs a Signer and allows others to delegate their STX to them. A pool operator doesn’t need to Stack their own STX, but they can. They will also run a signer, but the pool operator and signer address may be different
* **Signer**: an entity that runs the stacks-signer software and participates in block validation. This can be either a solo Stacker or an entity receiving delegated STX. Depending on context, this may also refer to the signer software that validates blocks.

{% hint style="info" %}
It's important to understand that in the context of the pool operator and signer, these are likely the same _entity_ but may not be the same Stacks address.

This distinction will be discussed further as we cover the step-by-step process below.
{% endhint %}

As mentioned above, there are three primary ways you can stack:

1. Solo stacking
2. Pool operator
3. Delegator

The following pages in this section will walk through the practical steps for stacking for all three scenarios.

As you read through these, it may be helpful to follow along with the functions in the [pox-4 contract](https://explorer.hiro.so/txid/0xfba7f786fae1953fa56f4e56aeac053575fd48bf72360523366d739e96613da3?chain=testnet) to get an idea of what each function is doing.

### Solo Stack

If you meet the minimum and want to [solo stack](stacking-flow.md), you will either need to run a signer, collaborate with an existing one, or use [stacking.tools](https://stacking.tools/). This guide will walk you through all options.

### Operate a Pool

You can also [operate a pool](operate-a-pool.md) and have others delegate their STX to you. If you are a pool operator, you will need to run a signer, collaborate with an existing one, or use [stacking.tools](https://stacking.tools/).

### Stack with a Pool

If you do not meet the minimum amount of STX to solo stack, you can [delegate your STX to a pool operator ](stack-with-a-pool.md)and have them stack on your behalf. The minimum stacking amount is dynamic and can be found by visiting the [https://api.hiro.so/v2/pox](https://api.hiro.so/v2/pox) endpoint and looking at the `min_threshold_ustx` field. Note it is denoted in uSTX (1 STX = 1,000,000 uSTX). This is the most common stacking scenario.

### Relationship between manual stacking transactions and the running signer

This section describes the various transactions that signers need to make in order to be registered as a signer for a certain reward cycle. The order of operations between the automated signer and the stacking transactions that need to be done “manually” is important for ensuring that a signer is fully set up for a certain reward cycle.

<figure><img src="../../.gitbook/assets/Untitled design (1).png" alt=""><figcaption></figcaption></figure>

#### Prerequisite: ensure the signer is hosted and running

It's important to emphasize the importance of getting the signer running in a hosted environment before making Stacking transactions. If the signer doesn’t do that, they run the risk of being registered as a signer without their signer software being ready to run DKG and other important consensus mechanisms.

Some of the important things to double check to ensure the signer is “running” are:

* The signer software is configured with a private key that the user can access (either through SSH or other means). This is important because their signer needs to utilize this private key to generate signer key signatures that are used in Stacking transactions.
* The signer software is properly configured to make RPC calls to a Stacks node. This refers to the `endpoint` signer configuration field. If properly configured, there should be logs in the Stacks node that show the RPC calls being made from the signer.
* The stacks node is properly configured to send events to the signer. This refers to the \[\[`event_observers`]] field in the Stacks Node’s configuration. If properly configured, the signer should have logs indicating that it’s receiving events from the Stacks node.

### How a signer becomes registered in the signer set

Each of the stacking transactions described above are done “manually”. More specifically, this means that none of these transactions are executed automatically by the signer software. The transactions must be done “out of band”.

In order for a signer to actually be registered in a reward cycle, there need to be manual transactions made in the `pox-4` contract. While the signer software is running, it is continually polling the Stacks node and asking “am I a signer in reward cycle N?”.

If these manual transactions are confirmed, and the signer has enough STX associated with the signer’s public key, the signer will be registered as a signer in the signer set.

#### Solo stacking

The workflow for solo stackers is more simple, because there are less stacking transactions that need to be made.

For solo stacking, the only transaction that needs to be made is `stack-stx`. Included in this transaction’s payload is the signer’s public key.

In order for the signer to be registered in reward cycle N+1, the `stack-st`x transaction must be confirmed during the first 2000 blocks of reward cycle N. The last 100 blocks of cycle N (the “prepare phase”) is where DKG occurs.

The start of the prepare phase is when Stacks nodes determine the official signer set of the next reward cycle.

#### Delegated Stacking

The workflow for delegated signers is more complex, because it requires more transactions.

This workflow is explained more in a previous section, but the high-level workflow is:

1. Stackers delegate their STX to a pool operator
2. The pool operator makes `delegate-stack-stx` transactions to “approve” specific stackers. This needs to be called for every individual stacker that delegates to them.
3. The pool operator makes a `stack-aggregation-commit` transaction to “commit” all of its delegated STX up to this point.

Similar to solo stacking, these steps must be made before the prepare phase of an upcoming reward cycle.

### Once a signer is registered in the signer set

During the prepare phase before a reward cycle, Stacks nodes automatically determine the signer set for the upcoming cycle. When this occurs, the Stacks nodes make an “internal” transaction to update the `.signers` contract with the list of signers.

The signer software is continuously polling the Stacks node to see if it is registered for a cycle. If the signer software finds that it is registered (by matching its public key to the signers stored in the `signers` contract) it begins performing its duties as a signer.

During the prepare phase, the signers perform DKG through StackerDB messages. Once an aggregate public key is determined, the signer automatically makes a `vote-for-aggregate-key` transaction. No out-of-band action is needed to be taken for this to occur.

During the instantiation phase (before fast blocks and full Nakamoto rules go live), the signer must pay a STX transaction fee for this transaction to be confirmed. Critically, this means that a minimum balance must be kept in the STX address associated with the signer’s key. There is a config field called `tx_fee_ms` (transaction fee in micro-stacks) that can be optionally configured to set the fee for these transactions. If the config field is omitted, the fee defaults to 10,000 micro-stacks (0.01 STX).

During the Activation phase (after fast blocks and full Nakamoto rules have been activated), the signer doesn’t need to pay fees for this transaction, so no STX balance needs to be kept in that address.
