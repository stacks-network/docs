---
description: >-
  Testnet and mainnet rollout sequencing for the Nakamoto upgrade. Several key
  steps bring more features live in a safe, step-by-step process that will give
  builders and partners time to integrate.
---

# Nakamoto Rollout Plan

{% hint style="info" %}
Nakamoto has completed step 1 of the rollout (Instantiation). Next, a hard fork that follows an Activation sequence outlined below will make Nakamoto features available to the whole network.&#x20;
{% endhint %}

### Step 1, Step 2: Instantiation & Activation

The rollout will follow this two-step process, each of which is implemented via hard fork. &#x20;

1. **Step 1 - Instantiation:** The pox-4 contract and the majority of the Nakamoto code are shipped, but Nakamoto rules are inactive. This is so other aspects of the contract can be tested before layering on the complexity that comes with the testnet (and later mainnet) being dependent on it. Importantly, this phase also allows time for Signers to register without the network being dependent on them to sign blocks.
2. **Step 2 - Activation:** Once completely rolled out, the full set of Nakamoto features including Signer-based functions, fast blocks, and Bitcoin finality. In other words, ‘the switch is flipped’! This switch is scheduled to occur at Bitcoin Block #867867 (\~October 29th).

It’s important to note the heaviest lift of any hard fork is historically the sync from genesis. With the two Nakamoto forks, one goal is not to require this, making the upgrade more akin to a push-button software update and much simpler for all node operators.

<details>

<summary><strong>What are ‘Nakamoto Rules’?</strong></summary>

Nakamoto rules are the logic that makes Nakamoto different than the version before it called Stacks 2.4. The key difference is that under Nakamoto, block validation logic requires Signers to sign the blocks to be confirmed as anchor blocks. At Step 1 (Instantiation), this logic, or the ‘Nakamoto Rules’ remains inactive, meaning the network follows the block validation rules of Stacks 2.4. Once the testnet (and later mainnet) reaches Activation, the network switches to running these Nakamoto rules and all the features we’re excited about go live for everybody.

</details>

### Nakamoto Activation Sequence

<table><thead><tr><th width="106"></th><th width="169">Step	</th><th width="319">Overview	</th><th>Date/Period</th></tr></thead><tbody><tr><td>✅ A, B</td><td><strong>A</strong>ctivation Window Opens &#x26; <strong>B</strong>inaries Delivered</td><td>Pending no new bugs, final binaries are delivered - this is all the code Signers, Miners, and Node Operators need to run the network.</td><td>Aug 28th</td></tr><tr><td>✅ C</td><td><strong>C</strong>ycle Handoff - Signers</td><td>At the end of Cycle 92, core developers will watch for a successful ‘handoff’, meaning a successful change of the Signer sets between Stacking cycles.</td><td>Cycle 92 to Cycle 93</td></tr><tr><td>✅ D</td><td>First Testnet Hard Fork</td><td>Core developers performed a successful testnet hardfork (on Nakamoto testnet).</td><td>Sept 27</td></tr><tr><td>✅ E</td><td>Determine Hard Fork Block</td><td>Core developers have selected Bitcoin block #867867.</td><td>October 17</td></tr><tr><td>F</td><td>Epoch 3.0 - Nakamoto Rules Start</td><td>Fast blocks, full Bitcoin finality! Nakamoto rules go live on mainnet at hard fork block.</td><td>~October 29</td></tr></tbody></table>

### Factors that could affect timelines:

* **Testing & Audit Results:** A top-notch group of researchers, contractors, and testers, along with security auditors from Clarity Alliance and Quantstamp, continue to hammer away at Nakamoto as they have for the past several months. This testing is ongoing, so there is always the possibility they surface an issue that needs to be addressed before the final hard fork.
* **Signer Needs:** The ecosystem is proud to have industry leaders comprising its leading Signer network. Signers are a critical new network player so if a clear issue or unexpected need arises during activation, additional time would be taken to address it.
* **Miner adoption:** As always, miners must choose to adopt the new code. Should they be delayed or experience issues with their setups, it could cause a delay in Activation.

Factors that could affect timelines: As always, core developers are committed to a safe, secure launch. As such, several factors _could_ warrant additional time added to the Nakamoto activation sequence outlined above and result in a new hard fork block being selected:

\
