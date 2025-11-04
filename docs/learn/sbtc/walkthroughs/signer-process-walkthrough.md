# Signer Process Walkthrough

## Introduction

This document provides a detailed overview of the sBTC system, focusing on the operations of an sBTC signer node. We'll explore the automated processes and software interactions that occur in the sBTC ecosystem.

A step-by-step guide for setting up and running a sBTC signer node is in the works. This is a conceptual guide to help signers understand what their role looks like in the sBTC system.

## Signer Node Setup

As an sBTC signer, your primary responsibility is to run and maintain a signer node. Here's what that entails:

{% stepper %}
{% step %}
#### Hardware setup

Ensure your node has sufficient computational power and storage.
{% endstep %}

{% step %}
#### Software installation

Install the sBTC signer node software and its dependencies.
{% endstep %}

{% step %}
#### Key management

The node software securely generates and stores the Bitcoin private key and corresponding public key.
{% endstep %}

{% step %}
#### Node registration

Upon first run, the node automatically registers its public key with the sBTC Registry contract on the Stacks blockchain.
{% endstep %}
{% endstepper %}

## Day-to-Day Operations

Once set up, your signer node operates autonomously, performing the following tasks:

{% stepper %}
{% step %}
#### Monitoring Deposit Requests

Your node continuously monitors for sBTC minting requests:

* The node connects to the Bitcoin network and the Stacks blockchain.
* It watches for Bitcoin transactions sent to the sBTC UTXO address.
* When a deposit is detected, the node verifies the transaction details.
{% endstep %}

{% step %}
#### Processing Mint Requests

Upon confirming a deposit:

* The node automatically prepares a signature for the mint operation using its private key.
* It submits this signature to the sBTC Deposit contract on the Stacks blockchain.
* The contract verifies the signature and combines it with signatures from other signer nodes.
* Once enough valid signatures are collected, the contract mints the corresponding amount of sBTC.
{% endstep %}

{% step %}
#### Handling Withdrawal Requests

For sBTC withdrawal requests:

* The node monitors the sBTC Withdrawal contract for new requests.
* Upon detecting a request, it verifies the user's sBTC balance and the request's validity.
* The node automatically signs the withdrawal operation and submits its signature.
* Once enough signatures are collected and the sBTC is burned, the node participates in creating and signing a Bitcoin transaction to fulfill the withdrawal.
* The signed Bitcoin transaction is broadcast to the Bitcoin network.
{% endstep %}
{% endstepper %}
