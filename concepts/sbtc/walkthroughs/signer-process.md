# sBTC Signer Node Process

## Introduction

This document provides a detailed overview of the sBTC system, focusing on the operations of an sBTC signer node. We'll explore the automated processes and software interactions that occur in the sBTC ecosystem.

A step-by-step guide for setting up and running a sBTC signer node is in the works. This is a conceptual guide to help signers understand what their role looks like in the sBTC system.

## Signer Node Setup

As an sBTC signer, your primary responsibility is to run and maintain a signer node. Here's what that entails:

1. Hardware setup: Ensure your node has sufficient computational power and storage.
2. Software installation: Install the sBTC signer node software and its dependencies.
3. Key management: The node software securely generates and stores the Bitcoin private key and corresponding public key.
4. Node registration: Upon first run, the node automatically registers its public key with the sBTC Registry contract on the Stacks blockchain.

## Day-to-Day Operations

Once set up, your signer node operates autonomously, performing the following tasks:

### 1. Monitoring Deposit Requests

Your node continuously monitors for sBTC minting requests:

1. The node connects to the Bitcoin network and the Stacks blockchain.
2. It watches for Bitcoin transactions sent to the sBTC UTXO address.
3. When a deposit is detected, the node verifies the transaction details.

### 2. Processing Mint Requests

Upon confirming a deposit:

1. The node automatically prepares a signature for the mint operation using its private key.
2. It submits this signature to the sBTC Deposit contract on the Stacks blockchain.
3. The contract verifies the signature and combines it with signatures from other signer nodes.
4. Once enough valid signatures are collected, the contract mints the corresponding amount of sBTC.

### 3. Handling Withdrawal Requests

For sBTC withdrawal requests:

1. The node monitors the sBTC Withdrawal contract for new requests.
2. Upon detecting a request, it verifies the user's sBTC balance and the request's validity.
3. The node automatically signs the withdrawal operation and submits its signature.
4. Once enough signatures are collected and the sBTC is burned, the node participates in creating and signing a Bitcoin transaction to fulfill the withdrawal.
5. The signed Bitcoin transaction is broadcast to the Bitcoin network.

## Signer Set Rotation

Periodically, the sBTC system may rotate the signer set. Your node handles this process automatically:

1. The node detects the initiation of a rotation process.
2. If selected for the new set, it generates a new key pair and registers the new public key.
3. If part of the outgoing set, it participates in creating and signing a Bitcoin transaction that updates the sBTC UTXO to be controlled by the new signer set.
4. Once the rotation is complete, the node either continues operations with the new key (if still a signer) or shuts down and securely erases its keys (if no longer a signer).

## Security Considerations

To maintain the security of the sBTC system, your signer node:

1. Keeps the private key secure, using hardware security modules (HSMs) when possible.
2. Regularly verifies the integrity of the sBTC UTXO.
3. Communicates securely with other signer nodes to coordinate operations.
4. Automatically updates its software to address potential security threats and implement system upgrades.

## Monitoring and Maintenance

As a signer node operator, your main responsibilities include:

1. Ensuring the node remains online and operational 24/7.
2. Monitoring system logs for any anomalies or errors.
3. Keeping the host system updated and secured.
4. Responding to any alerts or notifications from the node software.
