# Block Production

<div data-with-frame="true"><figure><img src="../.gitbook/assets/block-production.png" alt=""><figcaption></figcaption></figure></div>

Block production is a key concept to understand how Stacks operates under the hood. This section walks through the three main actions that need to happen for the Stacks chain to operate.

{% stepper %}
{% step %}
**Mining**

Miners are responsible for building and proposing new blocks on the Stacks chain.
{% endstep %}

{% step %}
**Signing**

Signing is the process used to validate blocks and sign sBTC deposits and withdrawals. Stackers participate in signing once they meet stacking prerequisites.
{% endstep %}

{% step %}
**Stacking**

Stacking is an action performed by stackers that is a necessary prerequisite to signing. It enables participation in validation and earning rewards.
{% endstep %}
{% endstepper %}

There are two primary parties in Stacks block production: miners and stackers. Miners build and propose new blocks, while stackers validate those blocks and sign sBTC deposits and withdrawals. Stacking enables stackers to participate in signing.

{% hint style="info" %}
For an in-depth technical overview of block production after the Nakamoto Upgrade, see SIP-021:

https://github.com/stacksgov/sips/blob/feat/sip-021-nakamoto/sips/sip-021/sip-021-nakamoto.md
{% endhint %}

Here's a diagram outlining the block production process under Nakamoto rules. The following docs dig into each part in detail.

<figure><img src="../.gitbook/assets/image (33).png" alt=""><figcaption></figcaption></figure>
