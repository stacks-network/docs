---
hidden: true
noIndex: true
---

# Nakamoto Upgrade - Start Here

The Nakamoto Upgrade is a major upgrade to the Stacks blockchain that instantiated at Bitcoin block 840,360. This marked the start of the [Nakamoto mainnet rollout](nakamoto-rollout-plan/).

There are several important things to be aware of when it comes to how the Nakamoto upgrade will be rolled out and different actions you may need to take depending on your role in the ecosystem.

### The Basics

First of all, if you aren't familiar with what Nakamoto is, you'll want to [get up to speed](what-is-the-nakamoto-release.md).

Next, you'll want to make sure you understand the rollout plan. Nakamoto is a major change to the network, and there are several moving parts and a specific, intentional [rollout plan and timeline](nakamoto-rollout-plan/).

After you familiarize yourself with what Nakamoto is and how it is being rolled out, you can check to see what specific actions you need to take and knowledge you need to have depending on your role. Those are each outlined below.

### Users/STX Holders

The upgrade is simple for you, you don't have to do anything. No token transfers, etc. For most of you, your wallets will be upgraded automatically and you'll be on the upgraded network without even realizing there was a change.&#x20;

In terms of buying/trading/withdrawing, exchanges _may_ briefly suspend STX-related activities, as they upgrade their nodes. Communicating a deposit/withdrawal suspension is the typical process, but in practice, these suspensions are either very brief or don't end up happening at all assuming their upgrade went smoothly. If an exchange decides to suspend activity they will communicate this to you directly. Again, typically these suspensions are quite brief and most exchanges don't suspend at all. If you have an issue with your exchange, please get in touch with them directly.&#x20;

### Stackers

After Nakamoto activation, stackers will need to either operate or work with a signer. If you are stacking in a pool, your pool operator will be responsible for running the signer. If you are solo stacking, you can either run your own signer or collaborate with an existing signer in order to stack your STX. For more information on how stacking and signing work together, visit the [Stack STX guide](../guides-and-tutorials/stack-stx/).

### Stacking Pool Operators

If you are a pool operator, you'll need to make sure you are ready to accept delegations and that you have an operational signer you can stack with. Details for this process can be found in the [How to Operate a Pool guide](../guides-and-tutorials/stack-stx/operate-a-pool.md).

### Signers

If you are operating as a signer, you'll want to make sure you familiarize yourself with both the [stacking guide](../guides-and-tutorials/stack-stx/) and the [running a signer guide](../guides-and-tutorials/running-a-signer/). These will give you all the information you need to not only run a signer but understand how signing and stacking work together.&#x20;

### Application Developers

The instantiation phase (current phase) focuses on activation the new stacking rules in pox-4. Fast blocks won't be available until after Activation, projected \~October 29th. This means that most developers won't need to do anything different, although there are some changes to various Hiro products and tools you should be aware of. Details on this can be found in the [Nakamoto for App Developers](nakamoto-rollout-plan/nakamoto.md) guide.

### Exchanges

For exchanges, your role will be much the same as other upgrades, and really only involves upgrading your node to the newest version. Depending on your setup, you may also want to take a look at some changes to the API and stacks.js. Details can be found in the [Nakamoto for Exchanges](nakamoto-rollout-plan/nakamoto-for-exchanges.md) guide.
