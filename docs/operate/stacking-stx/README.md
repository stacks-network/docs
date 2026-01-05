# Stacking STX

Stacking is an essential component of Stacks.

There are three different ways you can potentially stack your STX tokens and we have a dedicated guide for each of these scenarios.

If you aren't familiar with how stacking works, especially as it relates to signing after the Nakamoto upgrade, be sure to check out the following concept guides:

* [Stackers and signing](https://app.gitbook.com/s/H74xqoobupBWwBsVMJhK/block-production/signing)
* [Stacking](https://app.gitbook.com/s/H74xqoobupBWwBsVMJhK/block-production/stacking)

In Nakamoto, stacking flows have significant changes in comparison to previous versions of Stacks. Because Nakamoto requires stackers to run a signer, which validates blocks produced by Stacks miners, stackers need to provide new information when making Stacking transactions.

These changes affect both solo Stacking and delegated Stacking. This document outlines the new flows for solo stacking. The next doc outlines the flow and steps for operating a pool.

The following sections will walk you through how to begin operating as a solo stacker.

Stacking utilizes the `pox-4` contract. There is a detailed [walkthrough of the stacking contract](https://app.gitbook.com/s/GVj1Z9vMuEOMe7oH7Wnq/clarity/example-contracts/stacking) that you can look at to see what functions are being called at each phase and some common errors you may encounter. This will be especially useful for pool operators who need to call these functions.

This doc is also useful if you run into errors when calling stacking functions, as it both walks through several common error scenarios and walks through each function call so you can more easily trace what might be happening.

Before we get into the step-by-step of how to actually stack, it's important to make sure you have an understanding of the different roles, processes and functions involved in Stacking.

### Definitions and Roles

* **Stacker**: an entity locking their STX to receive PoX rewards. This is a broad term including solo Stackers and Stackers who use pools.
* **Solo stacker**: an entity that locks their own STX and runs a signer. They don’t receive delegation.
* **Delegator**: a stacker who locks their STX by delegating to a pool operator that runs a signer. They don’t run the signer.
* **Pool operator**: an entity that runs a Signer and allows others to delegate their STX to them. A pool operator doesn’t need to Stack their own STX, but they can. They will also run a signer, but the pool operator and signer address may be different
* **Signer**: an entity that runs the stacks-signer software and participates in block validation. This can be either a solo Stacker or an entity receiving delegated STX. Depending on context, this may also refer to the signer software that validates blocks.

{% hint style="info" %}
It's important to understand that in the context of the pool operator and signer, these are likely the same _entity_ but may not be the same Stacks address.

This distinction will be discussed further as we cover the step-by-step process below.
{% endhint %}

Below are the primary ways you can stack:

{% stepper %}
{% step %}
#### Solo stacking

If you meet the minimum and want to [solo stack](solo-stack.md), you will either need to run a signer, collaborate with an existing one, or use [stacking.tools](https://stacking.tools/). This guide will walk you through all options.
{% endstep %}

{% step %}
#### Operate a pool

You can also [operate a pool](operate-a-stacking-pool.md) and have others delegate their STX to you. If you are a pool operator, you will need to run a signer, collaborate with an existing one, or use [stacking.tools](https://stacking.tools/).
{% endstep %}

{% step %}
#### Stack with a pool

If you do not meet the minimum amount of STX to solo stack, you can [delegate your STX to a pool operator ](stack-with-a-pool.md)and have them stack on your behalf. The minimum stacking amount is dynamic and can be found by visiting the https://api.hiro.so/v2/pox endpoint and looking at the `min_threshold_ustx` field. Note it is denoted in uSTX (1 STX = 1,000,000 uSTX). This is the most common stacking scenario.
{% endstep %}
{% endstepper %}

As you read through these, it may be helpful to follow along with the functions in the [pox-4 contract](https://explorer.hiro.so/txid/SP000000000000000000002Q6VF78.pox-4?chain=mainnet) to get an idea of what each function is doing.

### Relationship between manual stacking transactions and the running signer

This section describes the various transactions that signer entities need to make in order to be registered as a signer for a certain reward cycle. The order of operations between the automated signer and the stacking transactions that need to be done “manually” is important for ensuring that a signer is fully set up for a certain reward cycle.

#### Prerequisite: ensure the signer is hosted and running

It's important to emphasize the importance of getting the signer running in a hosted environment before making Stacking transactions. If the signer doesn’t do that, they run the risk of being registered as a signer without their signer software being ready to run DKG and other important consensus mechanisms.

Some of the important things to double check to ensure the signer is “running” are:

* The signer software is configured with a private key that the user can access (either through SSH or other means). This is important because their signer needs to utilize this private key to generate signer key signatures that are used in Stacking transactions.
* The signer software is properly configured to make RPC calls to a Stacks node. This refers to the `endpoint` signer configuration field. If properly configured, there should be logs in the Stacks node that show the RPC calls being made from the signer.
* The stacks node is properly configured to send events to the signer. This refers to the \[`event_observers`] field in the Stacks Node’s configuration. If properly configured, the signer should have logs indicating that it’s receiving events from the Stacks node.

### How a signer becomes registered in the signer set

Each of the stacking transactions described above are done “manually”. More specifically, this means that none of these transactions are executed automatically by the signer software. The transactions must be done “out of band”.

In order for a signer to actually be registered in a reward cycle, there need to be manual transactions made in the `pox-4` contract. While the signer software is running, it is continually polling the Stacks node and asking “am I a signer in reward cycle N?”.

If these manual transactions are confirmed, and the signer has enough STX associated with the signer’s public key, the signer will be registered as a signer in the signer set.

#### Solo stacking

The workflow for solo stackers is simpler, because there are less stacking transactions that need to be made.

For solo stacking, the only transaction that needs to be made is `stack-stx`. Included in this transaction’s payload is the signer’s public key.

In order for the signer to be registered in reward cycle N+1, the `stack-stx` transaction must be confirmed during the first 2000 blocks of reward cycle N. The last 100 blocks of cycle N (the “prepare phase”) is where DKG occurs.

The start of the prepare phase is when Stacks nodes determine the official signer set of the next reward cycle.

#### Delegated Stacking

The workflow for delegated signers is more complex, because it requires more transactions.

This workflow is explained more in detail in the [operate a pool](operate-a-stacking-pool.md) guide, but the high-level workflow is:

{% stepper %}
{% step %}
#### Stackers delegate their STX to a pool operator

Stackers delegate their STX to a pool operator.
{% endstep %}

{% step %}
#### The pool operator approves specific stackers

The pool operator makes `delegate-stack-stx` transactions to “approve” specific stackers. This needs to be called for every individual stacker that delegates to them.
{% endstep %}

{% step %}
#### The pool operator commits delegated STX

The pool operator makes a `stack-aggregation-commit` transaction to “commit” all of its delegated STX up to this point.
{% endstep %}
{% endstepper %}

Similar to solo stacking, these steps must be made before the prepare phase of an upcoming reward cycle.

### Once a signer is registered in the signer set

During the prepare phase before a reward cycle, Stacks nodes automatically determine the signer set for the upcoming cycle. When this occurs, the Stacks nodes make an “internal” transaction to update the `.signers` contract with the list of signers.

The signer software is continuously polling the Stacks node to see if it is registered for a cycle. If the signer software finds that it is registered (by matching its public key to the signers stored in the `signers` contract) it begins performing its duties as a signer.

During the prepare phase, the signers perform DKG through StackerDB messages. Once an aggregate public key is determined, the signer automatically makes a `vote-for-aggregate-key` transaction. No out-of-band action is needed to be taken for this to occur.
