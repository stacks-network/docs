# Nakamoto Stacking Quickstart

{% hint style="info" %}
If you are stacking as part of a pool, the below instructions should be enough for you to get started stacking on Nakamoto.

If you are interested in solo stacking or becoming a pool operator, you will also need to run a signer.

In that case, you'll need to first [get a signer up and running](signing-and-stacking/running-a-signer.md), and then [integrate stacking](signing-and-stacking/stacking-flow.md) using your preferred method.
{% endhint %}

The Nakamoto Testnet is currently live. If you are interested in experimenting with stacking on the testnet, you can do so now using Leather and Lockstacks.

### Setting up Leather

Before stacking with an app like Lockstacks, you'll need to set up a wallet like Leather or Xverse. Instructions for getting set up with Leather are included here. The process for Xverse will be similar.

Click the menu button in the top right and select “Change network”. Then click “Add a network”. Enter this information:

* Name: “Nakamoto Testnet”. This is just for labeling, and it can be any value.
* Bitcoin API: “Testnet”
* Stacks API: [https://api.nakamoto.testnet.hiro.so](https://explorer.hiro.so/?chain=testnet\&api=https://api.nakamoto.testnet.hiro.so)
* Bitcoin API URL: keep default
* Bitcoin Network token: this is a required field but you can just type any value, like “a”

### Get Testnet STX Tokens

Next, you can visit the [Nakamoto Testnet explorer](https://explorer.hiro.so/sandbox/faucet?chain=testnet\&api=https://api.nakamoto.testnet.hiro.so) to get some testnet STX tokens from the faucet.

Make sure you are using the Nakamot Testnet. You can verify this by ensuring that `api=https://api.nakamoto.testnet.hiro.so` is present in the URL.

### Using Lockstacks

After you have your Leather wallet connected to the Nakamoto Testnet and received some testnet STX from the faucet, you can go to the [Lockstacks staging site](https://staging.lockstacks.com) in order to stack.

The staging site ([https://staging.lockstacks.com](https://staging.lockstacks.com)) specifically has the option to use Nakamoto as the network.

Connect your Leather wallet and stack via the UI.

