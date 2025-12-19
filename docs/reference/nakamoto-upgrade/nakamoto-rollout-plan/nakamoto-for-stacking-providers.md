# Nakamoto for Stacking Providers

## Upgrading your Stacking pool or service

There are a few basic steps you'll need to follow to get your Stacking pool set up to work with this first Nakamoto hard fork as this fork brings us the new pox-4 contract:

{% stepper %}
{% step %}
### Setup a Stacks node and signer

Set up a Stacks node and signer by following the How to Run a Signer doc.
{% endstep %}

{% step %}
### Update user-facing products and contracts to use pox-4

Update your user-facing products and contracts to point to the new pox-4 contract.

* If you use a wrapper contract with pox-3 hardcoded, you'll need to deploy a new contract referencing pox-4.
{% endstep %}

{% step %}
### Update internal infrastructure and automation

Update any internal infrastructure or automation that you use to manage your pool.
{% endstep %}

{% step %}
### Familiarize yourself with new stack-aggregation-commit arguments and signer signature generation

Familiarize yourself with the new `stack-aggregation-commit` function arguments, along with how to generate a signer key signature.
{% endstep %}
{% endstepper %}

{% hint style="info" %}
Other notes:

* Once you are running a signer as described in the How to Run a Signer doc, you'll initiate Stacking transactions as normal, but you'll need to pass an additional Signer signature field. This is covered extensively in the How to Stack doc.
* For delegated stacking flows, the functions `delegate-stx` and `delegate-stack-stx` are unchanged. If your pool makes use of custom smart contracts for allowing Stackers to delegate to you, those contracts may need to be updated to point to the new `pox-4` address.
* The function `stack-aggregation-commit` now requires pool operators to provide their Signer’s public key, along with other related information. Learn more about generating Signer key signatures using the stacks-signer CLI or with [Lockstacks](https://docs.stacks.co/nakamoto-upgrade/signing-and-stacking/stacking-flow#generating-your-signature-with-lockstacks). Again, this entire flow is covered extensively in the How to Stack doc.
* Depending on your pool’s infrastructure, you may need to update any tools or automations that you use to finalize your pool’s delegations.
{% endhint %}
