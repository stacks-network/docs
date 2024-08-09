# Nakamoto for Stackers, STX Holders

## Stacking after the Nakamoto hard fork

The Nakamoto Activation sequence is expected to start on August 28. You can learn more about the steps here: [#nakamoto-activation-sequence](./#nakamoto-activation-sequence "mention")

As we approach the start of this sequence, more detail will provided to Stackers about any action they will need to take. As with most previous hard forks, it is expected Stackers will need to re-Stack or re-delegate after the hard fork is complete. Look out for more detailed instructions from your Stacking provider.&#x20;

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
