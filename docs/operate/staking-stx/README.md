# Staking STX

Staking is locking STX, or STX paired with BTC or sBTC, to support the network's consensus and earn Bitcoin-denominated rewards. If you aren't familiar with how it works, read the [Stacking](https://docs.stacks.co/learn/block-production/stacking) and [Stackers and Signing](https://docs.stacks.co/learn/block-production/signing) concept guides first.

Staking uses the `pox-5` contract, deployed at `SP000000000000000000002Q6VF78.pox-5`. You can [read its source on the Explorer](https://explorer.hiro.so/txid/SP000000000000000000002Q6VF78.pox-5?chain=mainnet\&tab=sourceCode). PoX-5 activated with the Epoch 4.0 hard fork and replaces `pox-4`.

{% hint style="warning" %}
**Every PoX-4 position unlocked at activation.** If you were stacking under PoX-4, your STX is already unlocked and you must re-enroll under PoX-5 to keep earning. See [What's Changed in PoX-5](whats-changed-in-pox-5.md).
{% endhint %}

### Start here

{% stepper %}
{% step %}
#### What's Changed in PoX-5

If you were stacking under PoX-4: what unlocked, how to re-enroll, what changed about rewards, and the deadlines for the next cycle.

* [What's Changed in PoX-5](whats-changed-in-pox-5.md)
{% endstep %}

{% step %}
#### Stake to an existing signer-manager

The common path, and what most people should do. You keep custody of your STX; the signer-manager you choose handles registration and reward distribution. Pick one whose fee and admin set you are comfortable with. Both are readable on-chain.

* [Stake to an Existing Signer-Manager](stack-with-a-pool.md)
{% endstep %}

{% step %}
#### Run your own signer-manager

For operators. This means deploying a contract and running infrastructure: a Bitcoin node, a Stacks node, and the signer software.

* [Deploy a Signer Manager Contract](../deploy-a-signer-manager-contract.md)
* [Generate a Signer Signature](generate-signer-signature.md)
* [Take a Signer Fee](../take-a-signer-fee.md)
* [Run a Signer](../run-a-signer/)
* [PoX-5 Upgrade Guide](../run-a-signer/pox-5-upgrade-guide.md)
* [Run a Node](../run-a-node/) and [Run a Bitcoin Node](../run-a-node/run-a-bitcoin-node.md)
{% endstep %}
{% endstepper %}

{% hint style="info" %}
The minimum for a signer-manager to enter the signer set is a **fixed 50,000 STX** (`SIGNER_SET_MIN_USTX`) in aggregate across everyone staking to it. An individual stake may be smaller. This replaces PoX-4's cycle-varying `min_threshold_ustx`.
{% endhint %}

### Definitions and roles

* **Staker**: anyone locking STX. Either **STX-only** staking, or a **protocol bond** pairing a BTC L1 timelock (or sBTC) with an STX lock. PoX-5 allows exactly one position per Stacks principal, and the two kinds are mutually exclusive.
* **Signer-manager**: the contract a staker stakes to. It is identified on-chain by its contract principal, not by a raw signer key, and it holds the reward-distribution logic.
* **Signer**: the holder of the signer key that a signer-manager has been granted via `grant-signer-key`. Running a signer means running the `stacks-signer` software alongside your own Stacks node and Bitcoin node.
* **Pool**: a signer-manager that other people stake to.

{% hint style="info" %}
**"Solo" and "pooled" are no longer separate mechanisms.** Under PoX-4 they were. Under PoX-5 everyone stakes non-custodially to a signer-manager contract; the only question is who deployed it.

A solo staker in the old sense is someone running their own signer-manager, which is operationally the same thing as offering a pool service, because anyone can stake to that contract. There is no `delegator` or `pool operator` role at the protocol layer.
{% endhint %}

### Reference guides

Updated for PoX-5:

* [Stake to an Existing Signer-Manager](stack-with-a-pool.md)
* [Generate a Signer Signature](generate-signer-signature.md)

{% hint style="warning" %}
The guides below were written for PoX-4 and are being updated for PoX-5. Treat their contract calls and arguments as out of date until then. Per-transaction signer signatures and the `delegate-stx` / `stack-aggregation-commit` flow no longer exist.
{% endhint %}

* [Solo Stacking](solo-stacking.md)
* [Operate a Pool](operate-a-pool.md)
* [Key and Address Rotation](key-and-address-rotation.md)
