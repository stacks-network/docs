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



{% hint style="info" %}
**Reminder:** The network does not _**depend**_ on Signers for block production until the second hard fork expected in May. Learn More: [.](./ "mention")
{% endhint %}
