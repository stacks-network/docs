# Nakamoto for Stacking Providers

Remember that Nakamoto is being rolled out in two phases. This represents the first phase. Understanding this process is key to understanding the information below, read it here: [.](./ "mention")

## Upgrading your Stacking pool or service

There are a few basic steps you'll need to follow to get your Stacking pool set up to work with this first Nakamoto hard fork as this fork brings us the new [pox-4 contract](../what-is-the-nakamoto-release/nakamoto-in-depth/changes-to-pox-and-clarity.md):

1. Setup a Stacks node and signer by following the [How to Run a Signer](../signing-and-stacking/running-a-signer.md) doc.
2. Update your user-facing products and contracts to point to the new pox-4 contract
   * i.e. if you use a wrapper contract with pox-3 hardcoded, you'll need to deploy a new contract referencing pox-4
3. Update any internal infrastructure or automation that you use to manage your pool
4. Familiarize yourself with the new `stack-aggregation-commit` [function arguments](../signing-and-stacking/stacking-flow.md#pool-operator-commits-delegated-stx), along with [how to generate a signer key signature](../signing-and-stacking/stacking-flow.md#step-2-generate-a-signer-key-signature).

#### Other notes:&#x20;

* Once you are running a signer as described in the [How to Run a Signer](../signing-and-stacking/running-a-signer.md) doc, you'll initiate Stacking transactions as normal, but you'll need to pass an additional Signer signature field. This is covered extensively in the [How to Stack](../signing-and-stacking/stacking-flow.md) doc.
* For delegated stacking flows, the functions `delegate-stx` and `delegate-stack-stx` are unchanged. If your pool makes use of custom smart contracts for allowing Stackers to delegate to you, those contracts may need to be updated to point to the new `pox-4` address.
* The function `stack-aggregation-commit` now requires pool operators to provide their Signer’s public key, along with other related information. Learn more about generating Signer key signatures using the [stacks-signer CLI](https://docs.stacks.co/nakamoto-upgrade/signing-and-stacking/stacking-flow#generating-your-signature-using-the-stacks-signer-cli) or with [Lockstacks](https://docs.stacks.co/nakamoto-upgrade/signing-and-stacking/stacking-flow#generating-your-signature-with-lockstacks). Again, this entire flow is covered extensively in the [How to Stack](../signing-and-stacking/stacking-flow.md) doc.
* Depending on your pool’s infrastructure, you may need to update any tools or automations that you use to finalize your pool’s delegations.

## Timing

First, it's important to understand that on \~April 22nd, at Bitcoin block 840,360, all STX will automatically unlock from the network as part of the hard fork. This is network wide.&#x20;

As providers, you ultimately have as long as you need to make the Nakamoto upgrade, however, the faster you're able to upgrade, the fewer cycles your users will miss rewards for. Though there is a tight turnaround, you can actually upgrade fast enough such that users potentially miss zero cycles ([learn more](nakamoto-for-stacking-providers.md#rewards-in-cycle-83)). Some pools have been working with the [Nakamoto Testnet](nakamoto.md) in this interest, but it is not a requirement.&#x20;

<figure><img src="../../.gitbook/assets/Stacking Graphic (1).png" alt=""><figcaption></figcaption></figure>

#### Cycle 84

If you would like to avoid your users missing a Stacking cycle, you will need to upgrade your Stacking pool ahead of Cycle 84:&#x20;

* You'll need to make sure that you follow the steps [outlined above](nakamoto-for-stacking-providers.md#upgrading-your-stacking-pool-or-service) as soon as possible.&#x20;
* All Stacking now requires running a Signer, so you'll need to [follow the instructions](../signing-and-stacking/running-a-signer.md) to set it up. This is likely the newest or most difficult part, please reach out to your point of contact in the Stacks ecosystem for technical support as needed.&#x20;
* You'll need to have your upgrades done AND give enough time for your users to re-delegate to your pool before the start of cycle 84 (\~May 6th).



{% hint style="info" %}
**Reminder:** The network does not _**depend**_ on Signers for block production until the second hard fork expected in May. Learn More: [.](./ "mention")
{% endhint %}
