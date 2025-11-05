# Nakamoto Upgrade Start Here

The Nakamoto Upgrade is a major upgrade to the Stacks blockchain that instantiated at Bitcoin block 840,360. This marked the start of the [Nakamoto mainnet rollout](https://app.gitbook.com/o/hoh4mQXTl8NvI3cETroY/s/GVj1Z9vMuEOMe7oH7Wnq/~/changes/8/nakamoto-upgrade/nakamoto-rollout-plan).

There are several important things to be aware of regarding how the Nakamoto upgrade will be rolled out and different actions you may need to take depending on your role in the ecosystem.

## The Basics

If you aren't familiar with what Nakamoto is, first [get up to speed](https://app.gitbook.com/o/hoh4mQXTl8NvI3cETroY/s/GVj1Z9vMuEOMe7oH7Wnq/~/changes/8/nakamoto-upgrade/what-is-the-nakamoto-release).

Next, make sure you understand the rollout plan. Nakamoto is a major change to the network, and there are several moving parts and a specific, intentional [rollout plan and timeline](https://app.gitbook.com/o/hoh4mQXTl8NvI3cETroY/s/GVj1Z9vMuEOMe7oH7Wnq/~/changes/8/nakamoto-upgrade/nakamoto-rollout-plan).

After you familiarize yourself with what Nakamoto is and how it’s being rolled out, check the sections below to see what specific actions you may need to take depending on your role.

## Users / STX Holders

* For most users the upgrade is simple: you don't have to do anything. No token transfers are required. In many cases wallets will be upgraded automatically and you'll be on the upgraded network without noticing a change.
* Exchanges may briefly suspend STX-related activities (deposits/withdrawals/trading) while they upgrade their nodes. These suspensions are typically communicated by the exchange and are often very brief or may not be necessary if their upgrade proceeds smoothly. If you experience issues with an exchange, contact that exchange directly.

## Stackers

After Nakamoto activation, stackers will need to either operate or work with a signer.

* If you are stacking in a pool, your pool operator will be responsible for running the signer.
* If you are solo stacking, you can either run your own signer or collaborate with an existing signer to stack your STX.

## Stacking Pool Operators

If you operate a pool, ensure you are ready to accept delegations and that you have an operational signer you can stack with. Details are in the How to Operate a Pool guide.

## Signers

If you operate a signer, familiarize yourself with both the stacking guide and the running a signer guide. These guides explain how to run a signer and how signing and stacking interact.

## Application Developers

The instantiation phase (current phase) focuses on activating the new stacking rules in PoX-4. Fast blocks won't be available until after Activation, projected \~October 29th. Most developers won't need to change anything immediately, but there are updates to some Hiro products and tools you should be aware of. See the [Nakamoto for App Developers](https://app.gitbook.com/o/hoh4mQXTl8NvI3cETroY/s/GVj1Z9vMuEOMe7oH7Wnq/~/changes/8/nakamoto-upgrade/nakamoto-rollout-plan/nakamoto) guide for details.

## Exchanges

For exchanges, the process is similar to past upgrades: upgrade your node to the newest version. Depending on your setup, review changes to the API and stacks.js. See the [Nakamoto for Exchanges](https://app.gitbook.com/o/hoh4mQXTl8NvI3cETroY/s/GVj1Z9vMuEOMe7oH7Wnq/~/changes/8/nakamoto-upgrade/nakamoto-rollout-plan/nakamoto-for-exchanges) guide for details.
