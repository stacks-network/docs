# Nakamoto for Stackers

The current projection for the Instantiation step of the Nakamoto rollout is \~April 22nd at Bitcoin block 840,360. You can check the [real-time projection here](https://stacks-network.github.io/when-activation/2.5/).  Remember that Nakamoto is being rolled out in two phases, and this represents the first phase.

***

Stackers, here’s what you need to be ready for the first of 2 forks that will [bring us the Nakamoto upgrade](https://docs.stacks.co/nakamoto-upgrade/nakamoto-rollout-plan)!

* Your STX will automatically unlock at Bitcoin block 840,360 (approximately April 22nd)
* Despite your STX being unlocked for Cycle 83, you will still earn the full rewards from the cycle
* There are no frozen cycles, so you can immediately re-Stack after the upgrade
* You will have all of Cycle 83 to initiate Stacking for Cycle 84. Follow updates from your Stacking provider/pool to be notified when they are ready to receive your new Stacking calls for Cycle 84

<figure><img src="../../.gitbook/assets/Stacking Graphic (1).png" alt=""><figcaption></figcaption></figure>

{% hint style="info" %}
**Reminder:** The network does not _**depend**_ on Signers for block production until the second hard fork expected in May. Learn More: [https://docs.stacks.co/nakamoto-upgrade/nakamoto-rollout-plan](https://docs.stacks.co/nakamoto-upgrade/nakamoto-rollout-plan)
{% endhint %}

## Solo Stacking vs Delegating

Remember that a new requirement for stackers (after [activation phase](./)) is that you will also need to function as a signer on the network to validate Stacks transactions.

This means that in order to stack you need to have an operational signer running. As a solot stacker, you have two options:

1. Switch to stacking [via a pool](https://www.stacks.co/learn/stacking)
2. [Operate your own signer](../signing-and-stacking/running-a-signer.md)

Solo stacking without running a signer will not work with pox-4 as you'll need to pass in a valid signer signature when calling your `stack-stx` functions. More info on how this works can be found in the [How to Stack](../signing-and-stacking/stacking-flow.md) guide.

## Stacks (STX) Holders

The upgrade is simple for you, you don't have to do anything. No token transfers, etc. For most of you, your wallets will be upgraded automatically and you'll be on the upgraded network without even realizing there was a change.&#x20;

In terms of buying/trading/withdrawing, exchanges _may_ briefly suspend STX-related activities, as they upgrade their nodes. Communicating a deposit/withdrawal suspension is the typical process, but in practice, these suspensions are either very brief or don't end up happening at all assuming their upgrade went smoothly. If an exchange decides to suspend activity they will communicate this to you directly. Again, typically these suspensions are quite brief and most exchanges don't suspend at all. If you have an issue with your exchange, please get in touch with them directly.&#x20;

### Stacking Quickstart

{% hint style="info" %}
If you are stacking as part of a pool, the below instructions should be enough for you to get started stacking on Nakamoto.

If you are interested in solo stacking or becoming a pool operator, you will also need to run a signer.

In that case, you'll need to first [get a signer up and running](../signing-and-stacking/running-a-signer.md), and then [integrate stacking](../signing-and-stacking/stacking-flow.md) using your preferred method.
{% endhint %}

#### Setting up Leather

Before stacking with an app like Lockstacks, you'll need to set up a wallet like Leather or Xverse. Instructions for getting set up with Leather are included here. The process for Xverse will be similar.

Click the menu button in the top right and select “Change network” and select the network you would like to stack on (testnet or mainnet).

#### Using Lockstacks

After you have your Leather wallet connected to the right network (and received some testnet STX from the faucet if you are on testnet), you can go to the [Lockstacks staging site](https://staging.lockstacks.com) in order to stack.

The staging site ([https://staging.lockstacks.com](https://staging.lockstacks.com)) specifically has pox-4 functionality enabled.

Connect your Leather wallet and stack via the UI.
