# Block Production

<div data-with-frame="true"><figure><img src="https://2842511454-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FH74xqoobupBWwBsVMJhK%2Fuploads%2FAtIlPCw7qrGfrokaExNi%2Fblock-production-cover.png?alt=media&#x26;token=a3179850-9434-42ed-baf4-c64037aa5b03" alt=""><figcaption></figcaption></figure></div>

Block production is a key concept to understand how Stacks operates under the hood. This section walks through the three main actions that need to happen for the Stacks network to operate.

{% stepper %}
{% step %}
**Mining**

Miners are responsible for building and proposing new blocks on the Stacks chain.
{% endstep %}

{% step %}
**Signing**

Signing is the process used to validate blocks before they join the chain. A signer is a signer-manager contract bound to one signer key, and a block joins the chain only once signers carrying enough weight have signed it.
{% endstep %}

{% step %}
**Staking**

Staking is where that weight comes from. You lock STX in your own account and name an existing signer-manager contract; the stake you add becomes part of that manager's weight, and you earn Bitcoin-denominated rewards for it. Staking takes one of two mutually exclusive paths per account: STX-only, or a protocol bond pairing native BTC or sBTC with an STX lock.
{% endstep %}
{% endstepper %}

Three roles cooperate in Stacks block production: miners build and propose new blocks, signers validate and sign them, and stakers back the signers by locking STX to a signer-manager.

{% hint style="info" %}
**Signers here are not sBTC signers.** The signers on this page validate Stacks blocks under PoX-5. The [sBTC signers](https://docs.stacks.co/learn/sbtc/clarity-contracts/sbtc-signers) are a separate set with their own keys in their own contract, and they do not have to be Stacks signers. Their threshold signing requires more than 50% of the signer keys. The one connection is that the sBTC bridge is how miner-committed BTC becomes the sBTC paid out as staking rewards.
{% endhint %}

***

### Core Roles: Miner vs Staker vs Signer

<table><thead><tr><th width="94.29296875">Role</th><th>Primary Function</th><th>What They Do</th><th>Rewards</th><th>Where They Operate</th></tr></thead><tbody><tr><td><strong>Miner</strong></td><td>Produce Stacks blocks</td><td>Sends BTC in PoX to compete for the right to write the next block and earn STX</td><td>Earns STX block rewards + fees</td><td>Bitcoin (for bids) + Stacks</td></tr><tr><td><strong>Staker</strong></td><td>Secure the network via PoX</td><td>Locks STX in their own account and names a signer-manager contract</td><td>Earns Bitcoin-denominated rewards funded by miner BTC, as sBTC by default or native BTC by election</td><td>Stacks (the STX never leaves their account)</td></tr><tr><td><strong>Signer</strong></td><td>Validate and finalize blocks</td><td>A signer-manager contract bound to one signer key signs blocks; its weight is proportional to the STX staked through it</td><td>Receives per-staker settled rewards from pox-5 for distribution, and may take a fee set in the contract</td><td>Stacks</td></tr></tbody></table>

#### The relationship between Stakers and Signers

As you read through the Staking section, you may find stakers and signers mentioned in the same breath. Under PoX-5 the relationship is precise:

* Stakers are not signers\
  → signing is done by the key granted to the signer-manager contract they stake to, and running that signer is the manager operator's job
* Every signer is backed by **staked STX**\
  → to be in the signer set, a signer-manager must have at least 50,000 STX staked to it in aggregate, and its weight grows with the stake it represents
