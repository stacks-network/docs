---
description: >-
  Testnet and mainnet rollout sequencing for the Nakamoto upgrade. Several key
  stepsbring more features live in a safe, step-by-step process that will give
  builders and partners time to integrate.
---

# Nakamoto Rollout Plan

#### **TL;DR:**

> As [shared in January](https://stacks.org/nakamoto-launch-window), the Nakamoto upgrade will begin rolling out between April 15 - 29 (Instantiation window) which will kick off a period of Signer onboarding ([and now additional Signer/miner resiliency features](https://stacks.org/nakamoto-activation-update)). Nakamoto rules will begin going live on August 28th, completing the launch!

### Two-Step Release and Signer Onboarding

Core Developers and Working Groups have regularly engaged with builders and key integration partners as pieces of the codebase are wrapped up and going to audit. This ongoing dialog led to the two-step release process described below, which will afford partners, many of whom are new to Stacks, ample time to register on mainnet, troubleshoot their setups if necessary, and be ready to sign blocks upon Activation. New signers need to fully test their setup on mainnet before they can become active validators.

### Step 1, Step 2: Instantiation & Activation

The rollout will follow this two-step process, each of which is implemented via hard fork. Breaking the Nakamoto release into two forks reduces risk by allowing Core Developers an opportunity before full activation to make any final adjustments or bug fixes as they observe pox-4 in the wild and as Signers come online.&#x20;

This strategy is now the preferred path given how much is happening as part of this upgrade and it is the same one being used on the testnet. Further, the rollout of the testnet is already in progress (at Step 1, Instantiation).&#x20;

1. **Step 1 - Instantiation:** The pox-4 contract and the majority of the Nakamoto code are shipped, but Nakamoto rules are inactive. This is so other aspects of the contract can be tested before layering on the complexity that comes with the testnet (and later mainnet) being dependent on it. Importantly, this phase also allows time for Signers to register without the network being dependent on them to sign blocks.
2. **Step 2 - Activation:** Nakamoto rules turn active, enabling the full set of Nakamoto features including Signer-based functions, fast blocks, and Bitcoin finality. In other words, ‘the switch is flipped’!

It’s important to note the heaviest lift of any hard fork is historically the sync from genesis. With the two Nakamoto forks, one goal is not to require this, making the upgrade more akin to a push-button software update and much simpler for all node operators.

<details>

<summary><strong>What are ‘Nakamoto Rules’?</strong></summary>

Nakamoto rules are the logic that makes Nakamoto different than the version before it called Stacks 2.4. The key difference is that under Nakamoto, block validation logic requires Signers to sign the blocks to be confirmed as anchor blocks. At Step 1 (Instantiation), this logic, or the ‘Nakamoto Rules’ remains inactive, meaning the network follows the block validation rules of Stacks 2.4. Once the testnet (and later mainnet) reaches Activation, the network switches to running these Nakamoto rules and all the features we’re excited about go live for everybody.

</details>

### Mainnet Rollout

As [shared in January](https://stacks.org/nakamoto-launch-window), mainnet rollout **will begin some time between April 15 and 29** which is currently roughly aligned with Stacking cycle 82.

Once instantiated (Step 1), a period of at least 2 Stacking cycles will be afforded to Signers and other integration partners to register with pox-4. During this time they will ensure their Signers are ready for the progression to Activation (Step 2) where the network will depend on Signers actively validating blocks.

This means that assuming there are no major bugs or issues, full Nakamoto features will activate around August 28th with some of that depending on how quickly Signers are onboarded.&#x20;

### Visualizing the rollout

<figure><img src="../../.gitbook/assets/Screenshot 2024-04-30 154011.png" alt=""><figcaption></figcaption></figure>

**Note about sBTC Rollout:** Previous [updates](https://stacks.org/halving-on-horizon-nakamoto) mentioned targeting a launch of sBTC 2-3 months after Nakamoto Mainnet is live and stable. Core Developers are now projecting [a faster follow](https://www.bitcoinwrites.com/p/sbtc-rollout-bootstrapping-programmable-bitcoin)!
