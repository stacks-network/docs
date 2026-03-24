# Stacking STX

Stacking is the process of locking STX tokens to support the network's consensus and earn BTC rewards. If you aren't familiar with how stacking works, read the [Stacking](../../learn/block-production/stacking.md) and [Stackers and Signing](../../learn/block-production/signing.md) concept guides first.

Stacking utilizes the `pox-4` contract. You can view it on the [Explorer](https://explorer.hiro.so/txid/SP000000000000000000002Q6VF78.pox-4?chain=mainnet) and review the detailed [stacking contract walkthrough](/broken/spaces/GVj1Z9vMuEOMe7oH7Wnq/pages/fc4fa1c229d8cb4deedf49de6dc1de0dc0b1ed72) to understand what each function does.

### Definitions and Roles

* **Stacker**: an entity locking their STX to earn PoX rewards. This is a broad term including solo stackers and delegators.
* **Solo stacker**: an entity that locks their own STX and runs a signer (or collaborates with one). They don't receive delegation.
* **Delegator**: a stacker who delegates their STX to a pool operator. They don't run a signer.
* **Pool operator**: an entity that accepts delegated STX and manages the stacking process. A pool operator runs a signer (or collaborates with one). The pool operator and signer address may be different.
* **Signer**: an entity running the stacks-signer software that participates in block validation.

{% hint style="info" %}
The pool operator and signer are often the same entity but may use different Stacks addresses. This distinction is covered in the [Key and Address Rotation](key-and-address-rotation.md) guide.
{% endhint %}

### Guides

{% stepper %}
{% step %}
#### [Solo Stacking](solo-stacking.md)

If you meet the minimum STX threshold and want to stack independently. Covers how to start stacking, extend your lock period, increase your position, and stop.
{% endstep %}

{% step %}
#### [Stack with a Pool](stack-with-a-pool.md)

If you want to delegate your STX to a pool operator. Covers how to delegate, increase your delegation, revoke, and stop stacking.
{% endstep %}

{% step %}
#### [Operate a Pool](operate-a-pool.md)

If you want to accept delegated STX and manage the stacking process. Covers how to accept delegations, commit aggregated STX, and increase committed amounts.
{% endstep %}

{% step %}
#### [Generate a Signer Signature](generate-signer-signature.md)

Both solo stacking and delegated stacking require signer signatures. This guide covers all signature generation methods: stacks-signer CLI, stacks.js, Leather Earn, Degen Lab's stacking.tools, and hardware wallets.
{% endstep %}

{% step %}
#### [Key and Address Rotation](key-and-address-rotation.md)

How to rotate your signer key, Bitcoin reward address, and pool operator key. Includes recommendations for key separation and security.
{% endstep %}
{% endstepper %}

If you do not meet the minimum amount of STX to solo stack, you can [delegate your STX to a pool operator](stack-with-a-pool.md) and have them stack on your behalf. This is the most common stacking scenario.

{% hint style="info" %}
The minimum stacking threshold is dynamic and can be found at the [pox endpoint](https://api.mainnet.hiro.so/v2/pox) under `min_threshold_ustx` (1 STX = 1,000,000 uSTX).
{% endhint %}
