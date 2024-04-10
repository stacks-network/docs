# Nakamoto for Stackers & Pools

Nakamoto is set to be instantiated on mainnet on April 16th, at block 839,444. Remember that Nakamoto is being rolled out in two phases, and this represents the first phase.

Stackers, here’s what you need to be ready for the first of 2 forks that will [bring us the Nakamoto upgrade](https://docs.stacks.co/nakamoto-upgrade/nakamoto-rollout-plan).

* Your STX will automatically unlock at Bitcoin block 839,444
* Despite your STX being unlocked before the end of Cycle 82, you will still earn the full rewards from the cycle!
* There are no frozen cycles, so you can immediately re-Stack after the upgrade
* Given the timing of the upgrade, you’ll only have about 3 days to initiate Stacking for Cycle 83.
* The tight turnaround means that **not all Stacking providers will be ready to serve you**. Pools that will be ready for Cycle 83 will be listed here. Please message _signers@stacks.org_ if your pool will be avialable for users in Cycle 83.

<figure><img src="../../.gitbook/assets/Image from Skiff (1).png" alt=""><figcaption></figcaption></figure>

{% hint style="info" %}
Unlike previous major updates, core developers have left Stackers a decent chance at not having any missed reward cycles. The determining factor for whether or not rewards will be paid in Cycle 83 is if enough STX (73M PoX minimum) can be locked in time. Whether or not that happens will be determined both by how quickly Stacking pools can upgrade to support the new pox contract and then of course how many users re-Stack for the cycle. Core contributors and the Stacks Foundation are doing everything they can to support pool upgrades now so that the minimum can be met for Cycle 83. If the minimum is not achieved, the upgrade will proceed much as those before it with a proof of burn cycle for Cycle 83. PoX and BTC rewards would then reactive for the next cycle after which the 73M threshold is reached.
{% endhint %}

**Why the tight turnaround for Stacking providers?** While not ideal timing, the chosen Bitcoin block was the earliest block the core developers felt comfortable for the release and consistent feedback from builders is that the faster Nakamoto can be shipped, the better. While it didn’t leave a lot of time for pools to be upgraded for Cycle 83, many have been working on testnet and can be ready. Considering all the factors, it’s likely the net benefit to the ecosystem for shipping sooner is much greater than the potential downside of one proof-of-burn cycle for the upgrade. Further, a missed cycle for major upgrades has been the expected standard - that there is a decent chance we may not skip one at all is a great bonus goal for the network to try and achieve.

**Reminder:** The network does not _**depend**_ on Signers for block production until the second hard fork expected in May. Learn More: [https://docs.stacks.co/nakamoto-upgrade/nakamoto-rollout-plan](https://docs.stacks.co/nakamoto-upgrade/nakamoto-rollout-plan)

### Pool Operators

Pool operators, you will have 2 reward cycles between instantiation and activation to get your signer up and running before it becomes consensus-critical.

However, in order to participate in reward cycle 83, you'll need to make sure that you are stacking (and thus need an active signer to stack with) and will need to re-stack your delegated STX tokens in between mainnet instantiation (April 16th) and the start of cycle 83 (April 20th).

This also means that anybody participating in your pool will need to re-delegate to you.

There are a few things pool operators should do to prepare for `pox-4`.

You'll want to make sure that you are running a signer as described in the [How to Run a Signer](../signing-and-stacking/running-a-signer.md) doc.

From there, you'll initiate stacking transactions as normal, but you'll need to pass an additional signer signature field. This is covered extensively in the [How to Stack](../signing-and-stacking/stacking-flow.md) doc.

For delegated stacking flows, the functions `delegate-stx` and `delegate-stack-stx` are unchanged. If your pool makes use of custom smart contracts for allowing Stackers to delegate to you, those contracts may need to be updated to point to the new `pox-4` address.

The function `stack-aggregation-commit` now requires pool operators to provider their signer’s public key, along with other related information. Learn more about generating signer key signatures using the [stacks-signer CLI](https://docs.stacks.co/nakamoto-upgrade/signing-and-stacking/stacking-flow#generating-your-signature-using-the-stacks-signer-cli) or with [Lockstacks](https://docs.stacks.co/nakamoto-upgrade/signing-and-stacking/stacking-flow#generating-your-signature-with-lockstacks). Again, this entire flow is covered extensively in the [How to Stack](../signing-and-stacking/stacking-flow.md) doc.

Depending on your pool’s infrastructure, you may need to update any tools or automations that you use to finalize your pool’s delegations.

In summary, here are the things you’ll need to do to get your Stacking pool set up for pox-4:

1. Setup a Stacks node and signer by following the [How to Run a Signer](../signing-and-stacking/running-a-signer.md) doc
2. Update your user-facing products and contracts to point to the new pox-4 contract
   1. ie if you use a wrapper contract with pox-3 hardcoded, you'll need to deploy a new contract referencing pox-4
3. Update any internal infrastructure or automation that you use to manage your pool
4. Familiarize yourself with the new `stack-aggregation-commit` [function arguments](../signing-and-stacking/stacking-flow.md#pool-operator-commits-delegated-stx), along with [how to generate a signer key signature](../signing-and-stacking/stacking-flow.md#step-2-generate-a-signer-key-signature).
