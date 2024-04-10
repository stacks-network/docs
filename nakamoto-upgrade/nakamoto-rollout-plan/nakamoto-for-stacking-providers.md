# Nakamoto for Stacking Providers

Nakamoto is set to be instantiated on mainnet on \~April 16th, at Bitcoin block 839,444. Remember that Nakamoto is being rolled out in two phases. This represents the first phase. Understanding this process is key to understanding the information below, read it here: [.](./ "mention")

## Upgrading your Stacking pool or service

There are a few basic steps you'll need to follow to get your Stacking pool set up to work with this first Nakamoto hard fork as this fork brings us the new [pox-4 contract](../nakamoto-in-depth/changes-to-pox-and-clarity.md):

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

First, it's important to understand that on \~April 16th, at Bitcoin block 839,444, all STX will automatically unlock from the network as part of the hard fork. This is network wide.&#x20;

As providers, you ultimately have as long as you need to make the Nakamoto upgrade, however, the faster you're able to upgrade, the fewer cycles your users will miss rewards for. Though there is a tight turnaround, you can actually upgrade fast enough such that users potentially miss zero cycles ([learn more](nakamoto-for-stacking-providers.md#rewards-in-cycle-83)). Some pools have been working with the [Nakamoto Testnet](../nakamoto.md) in this interest, but it is not a requirement.&#x20;

<figure><img src="../../.gitbook/assets/Image from Skiff (1).png" alt=""><figcaption><p>A timeline of Stacking from the Stackers perspective</p></figcaption></figure>

#### Cycle 83

If you hope to have your Stacking pool ready for Cycle 83:&#x20;

* You'll need to make sure that you follow the steps [outlined above](nakamoto-for-stacking-providers.md#upgrading-your-stacking-pool-or-service) as soon as possible.&#x20;
* All Stacking now requires running a Signer, so you'll need to [follow the instructions](../signing-and-stacking/running-a-signer.md) to set it up. This is likely the newest or most difficult part, please reach out to your point of contact in the Stacks ecosystem for technical support as needed.&#x20;
* You'll need to have your upgrades done AND give enough time for your users to re-delegate to your pool before the start of cycle 83 (\~April 20th).

#### Rewards in Cycle 83

Unlike previous major updates, core developers have left Stackers a decent chance at not having any missed reward cycles. The determining factor for whether or not rewards will be paid in Cycle 83 is if enough STX (73M PoX minimum) can be locked in time. Whether or not that happens will be determined both by how quickly Stacking pools can upgrade to support the new pox contract and then if users are able to Stack enough total for the cycle. Core contributors and the Stacks Foundation have offered support to pools in hopes the minimum can be met for Cycle 83. If the minimum is not achieved, the upgrade will proceed much as those before it with a proof of burn cycle for Cycle 83. PoX and BTC rewards would then reactivate for the next cycle after which the 73M threshold is reached.

#### **Why the tight turnaround for Cycle 83?**&#x20;

While not ideal timing for pool operators, the chosen Bitcoin block was the earliest block within the Instantiation window the core developers felt comfortable with the release and consistent feedback from builders is that the faster Nakamoto can be shipped, the better. While it didn’t leave a lot of time for pools to be upgraded for Cycle 83, many have been working on testnet and can be ready. Considering all the factors, it’s likely the net benefit to the ecosystem for shipping sooner is much greater than the potential downside of one proof-of-burn cycle for the upgrade. Further, a missed cycle for major upgrades has been the expected standard - that there is a decent chance we may not skip one at all is a great bonus goal for the network to try and achieve.

{% hint style="info" %}
**Reminder:** The network does not _**depend**_ on Signers for block production until the second hard fork expected in May. Learn More: [.](./ "mention")
{% endhint %}
