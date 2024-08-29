# Stack with a Pool

The most common stacking scenario is to be an individual stacker that does not meet the stacking minimum and to stack with a pool.

This is also the least complex version and is very easy to accomplish.

Be sure you are familiar with the [concept of stacking](../../concepts/block-production/stacking.md) before digging into this.

The dynamic minimum required to stack STX changes based on the total liquid supply of STX in the network and can be found by looking at the `pox` endpoint of the Hiro API: [https://api.hiro.so/v2/pox](https://api.hiro.so/v2/pox).

If you do not meet this minimum, you'll need to delegate your STX to a pool operator.

This is a non-custodial delegation, meaning that your STX do not actually leave your wallet.

Delegating your STX to a pool operator involves a few steps:

{% hint style="info" %}
Pool operators have a lot of control over exactly how they implement stacking. Usually users will be interacting with a wrapper contract that the pool operator has created to utilize the core stacking contract.
{% endhint %}

1. Find a pool to delegate to
2. Use the pool's UI with your wallet of choice to call a delegate function with a few parameters
3. Pool operator will then stack your STX tokens on your behalf
4. Pool operator will allocate rewards proportionally based on how much you have stacked
5. Pool operator will distribute your rewards at the end of the stacking cycle

Let's dig into each of these. If you want to dig into the specific functions and the contract that handles this process, be sure to take a look at the [stacking contract walkthrough](../../example-contracts/stacking.md).

### Find a pool

The first step is to find a stacking pool you would like to stack with. Pool operators have a lot of control over exactly how they implement stacking and reward distribution, and they all do things a bit differently, so it's important to do your research. The Stacks website has a great [page on stacking](https://www.stacks.co/learn/stacking) that links to several pool operators for you to research.

### Call the delegate function

After you've chosen your pool operator, you'll need to get set up with a [Stacks-compatible wallet](https://www.stacks.co/explore/ecosystem?category=All+Teams#wallets) like Leather, Xverse, or Asigna.

Then you'll use your chosen pool operator's UI to call their delegation function. You may need to pass a couple of parameters here like how long you want to grant delegation permission for.

### Pool operator stacks tokens

Once you grant permission for the pool operator to delegate. They will take over and call a separate function in the stacking contract to actually stack those delegated tokens. At this point your STX will be locked.

Depending on how the pool operator handles things, they may offer the option to automatically continue to stack your STX for up to 12 continuous cycles.

### Pool operator allocates rewards

Next, the pool operator will track what proportion of rewards you should earn based on the proportion of STX you delegated. If distributing rewards directly in Bitcoin, the pool operator will need to take custody of the Bitcoin and manually distribute it.

This is why it is important to do your research and stack with a pool operator whose reward distribution mechanism you trust. Different operators have different methods to make this process transparent and as trust-minimized as possible.

### Pool operator distributes rewards

Finally, the pool operator will distribute those rewards to you in either BTC or STX, depending on the model they use.

### Liquid Stacking

Liquid stacking is when you delegate your STX tokens to a liquid stacking provider and they issue you a new token such as stSTX that you can then use in the ecosystem. This makes it so that stackers can still use their STX to participate in DeFi protocols and other apps even while their STX are locked.

This works a bit differently than traditional stacking and links to liquid stacking providers for you to research can be found on the [Stacks website](https://www.stacks.co/learn/stacking).
