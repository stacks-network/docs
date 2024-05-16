# Nakamoto for Stackers

The Instantiation step of the Nakamoto rollout happened on \~April 22nd at Bitcoin block 840,360.  This means all Stacks were automatically unlocked on the network.

***

Stackers, here’s what you need to know for Cycle 84 and beyond:

* Your STX have automatically unlocked on April 22 at Bitcoin block 840,360&#x20;
* Despite your STX being unlocked for Cycle 83, you will still earn the full rewards from the cycle
* There are no frozen cycles, so you can immediately re-Stack after the upgrade, meaning you have all of Cycle 83 to initiate Stacking for Cycle 84. Follow updates from your Stacking provider/pool to be notified when they are ready to receive your new Stacking calls for Cycle 84

### Pools available for Stacking in Cycle 84

These pools have confirmed their systems are ready to accept your Stacking calls for Cycle 84. Please read their documentation or get in **direct contact with them** for more information or support.

* [Blockdaemon](https://www.blockdaemon.com/stacks)
* [Fastpool by Ryder](https://fastpool.org/)
* [Stacking DAO](https://medium.com/@stackingdao/the-nakamoto-odyssey-20x-point-boost-on-new-deposits-and-more-567c3a509112)
* [LISA](https://app.lisalab.io/lisa/stacking)
* [PlanBetter](https://twitter.com/planbetter\_/status/1784974388426637616)
* [Xverse](https://pool.xverse.app/)

### 'Re-Stacking' Timeline

<figure><img src="../../.gitbook/assets/Stacking Graphic (1).png" alt=""><figcaption></figcaption></figure>

## Solo Stacking vs Delegating

Remember that a new requirement for stackers (after [activation phase](./)) is that you will also need to function as a signer on the network to validate Stacks transactions.

This means that in order to stack you need to have an operational signer running. As a solo stacker, you have two options:

1. Switch to stacking [via a pool](https://www.stacks.co/learn/stacking) (this is the simplest path and most common)
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

After you have your Leather wallet connected to the right network (and received some testnet STX from the faucet if you are on testnet), you can go to [Lockstacks](https://lockstacks.com) in order to stack.

Connect your Leather wallet and stack via the UI.
