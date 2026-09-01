---
description: >-
  How staking works under PoX-5: locking STX to a signer-manager contract,
  earning Bitcoin-denominated rewards, and what the lock does and does not do.
---

# Staking: How STX Holders Contribute

<div data-with-frame="true"><figure><img src="https://2842511454-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FH74xqoobupBWwBsVMJhK%2Fuploads%2FAkgFBWqIWWeT5ZeNwVzp%2Fstaking-cover.png?alt=media&#x26;token=82fd722d-efae-4218-ae0e-42ac6215fe4a" alt="Staking"><figcaption></figcaption></figure></div>

{% hint style="info" %}
**Builder Resources**

* All staking operations happen in the PoX contract implementation, [pox-5 on the Explorer](https://explorer.hiro.so/txid/SP000000000000000000002Q6VF78.pox-5?chain=mainnet).
* To start staking STX, see the [Staking STX guides](https://docs.stacks.co/operate/staking-stx).
{% endhint %}

#### The Big Picture

* Staking locks STX to help secure the network and earn Bitcoin-denominated rewards.
* It is part of Proof of Transfer (PoX): miners commit BTC, and that BTC pays stakers.
* You stake by naming a signer-manager contract. The STX locks in your own account and never moves.
* There is no per-staker minimum. A signer-manager needs 50,000 STX in aggregate to enter the signer set.
* You can unstake an STX-only position at any time, and the STX unlocks at the start of the next cycle. Bond-paired STX is committed for the bond term.
* Rewards arrive as sBTC by default. A native BTC payout can be elected through your signer-manager.

***

### Intro

Staking rewards Stacks (STX) token holders with Bitcoin-denominated payouts for locking their tokens and backing the signers that validate blocks. Signers are covered in the [Signing section](signing.md). This page is a conceptual overview of staking under PoX-5.

`pox-5.clar` is the staking contract. It activated with the Epoch 4.0 hard fork at Bitcoin block 960,230 and replaced `pox-4`. Every staking function lives at the deployed contract:

* Mainnet: [`SP000000000000000000002Q6VF78.pox-5`](https://explorer.hiro.so/txid/SP000000000000000000002Q6VF78.pox-5?chain=mainnet)
* Testnet: the primary Hiro testnet runs PoX-5, with Epoch 4.0 activating at burnchain height 2,702. To run a node against it, start from the [example testnet follower configuration](https://docs.stacks.co/reference/node-operations/readme-1#example-testnet-follower-configuration), which carries the PoX-5 parameters (`pox_5_sbtc_contract`, `pox_5_sbtc_registry_contract`, `pox_5_bond_admin`).
* Devnet: [Clarinet](https://github.com/hirosystems/clarinet) 3.23.0 and later runs devnet on Epoch 4.0 and Clarity 6 by default, with pox-5 available out of the box from a devnet snapshot that starts at block 163.

The pinned source is [`pox-5.clar` at release 4.0.1](https://github.com/stacks-network/stacks-core/blob/4.0.1/stackslib/src/chainstate/stacks/boot/pox-5.clar), and [SIP-045](https://github.com/stacksgov/sips/blob/main/sips/sip-045/sip-045-pox-5-bitcoin-staking.md) specifies the design.

<details>

<summary>How this differs from proof-of-stake staking</summary>

The mechanism shares the shape of staking: lock a token, back consensus, earn yield. What still differs from staking on a proof-of-stake network:

**Yield comes from an external token, not issuance**

In proof-of-stake, you lock one token and earn yield in the same token, funded by the currency's issuance schedule. [Ethereum's issuance rate](https://ethereum.org/en/roadmap/merge/issuance/#post-merge) is set algorithmically against how much ETH is burned in fees. In PoX, you lock STX and the yield is denominated in the burnchain token: BTC, committed by Stacks miners, paid out as sBTC or native BTC. Stacks does issue new STX, but that issuance is separate from staking and does not fund staking rewards.

**No slashing**

Stakers back a consensus-critical role, but PoX has no slashing. Locked STX is never destroyed or seized. A signer that fails to perform forfeits rewards, not principal.

</details>

#### Locking and Unlocking STX

When STX locks, no transfer occurs. Locking is non-custodial: the tokens stay in your account and become unspendable at the protocol level.

Unlocking is implicit. At the start of the cycle after your chosen duration ends, or after you unstake, the tokens become spendable again. No transaction unlocks them.

***

### The Signer-Manager Relationship

Staking means locking STX and naming a signer-manager contract to act for you. The signer-manager is the contract your stake routes through: it validates your stake when you enter, is bound to the signer key that signs blocks, and distributes your rewards.

<div data-with-frame="true"><figure><img src="https://2842511454-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FH74xqoobupBWwBsVMJhK%2Fuploads%2FtgQWu2VHlMNA9q0uE9YH%2Fsigner-manager-relationship.png?alt=media&#x26;token=11367cc6-5f5a-4d1c-aada-8cefd809551b" alt="The staker, the signer-manager contract, and pox-5, with the STX lock staying in the staker&#x27;s account and rewards flowing back through the manager"><figcaption><p>How a stake reaches the signer set</p></figcaption></figure></div>

Who does what:

* **You, the staker**, lock STX in your own account and choose how many cycles it covers, from 1 to 96.
* **The signer-manager contract** is bound to a signer key once, through a one-time [SIP-018](https://github.com/stacksgov/sips/blob/main/sips/sip-018/sip-018-signed-structured-data.md) grant, and receives your settled rewards for onward distribution. It may take a fee, which is contract-level logic rather than a protocol feature.
* **The pox-5 contract** registers your position for every cycle you chose in the single staking transaction, and settles rewards per staker to the manager.

A signer-manager enters the signer set once at least 50,000 STX (`SIGNER_SET_MIN_USTX`) is staked to it in aggregate. The threshold is fixed, and it applies to the manager rather than to you: your own stake can be any size.

Running your own signer-manager and staking to someone else's are the same mechanism. A "solo" staker is someone running their own manager, which is operationally identical to offering a pool, because anyone can stake to that contract.

{% hint style="info" %}
Choosing a manager means reading its fee, fee ceiling, admin set, and grant status, all of which are on-chain. [Stake to an Existing Signer-Manager](https://docs.stacks.co/operate/staking-stx/stack-with-a-pool) covers what to check.
{% endhint %}

***

### Two Ways to Participate

PoX-5 has two participation paths, and a Stacks principal can hold one position in one path at a time.

<div data-with-frame="true"><figure><img src="https://2842511454-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FH74xqoobupBWwBsVMJhK%2Fuploads%2FNbgQIA47Wit0M6HBoFGx%2Fstaking-participation-paths_v2.png?alt=media&#x26;token=32fa7f39-ca41-4d8e-bb00-32b8c433d031" alt="Bitcoin Staking protocol bond beside STX-only staking, mutually exclusive per Stacks principal: the bond pairs BTC or sBTC with an STX lock for a committed twelve-cycle term earning a target APY on allowlisted capacity, while STX-only locks STX alone for one to ninety-six cycles with uncapped but variable residual yield"><figcaption><p>The choice, side by side</p></figcaption></figure></div>

**Bitcoin Staking: Protocol Bond** pairs a BTC commitment with an STX lock for a bond term of 12 cycles (roughly six months). The BTC side is either a timelocked UTXO on Bitcoin L1 that stays under your own keys, or sBTC, which pox-5 holds for the term. Bonds have a Target Protocol Yield Rate (aka Target APY) on the BTC side; the paired STX earns no yield. Capacity is allowlisted per bonding period, so registering requires an allowance for that period, and `register-for-bond` is the entry point.

**STX-Only Staking** locks STX alone. You choose 1 to 96 cycles, you can unstake at any time outside the prepare phase with the unlock at the next cycle start, and there is no capacity limit. Rewards come from the miner BTC left after protocol bond obligations, split 85% to STX-only stakers pro rata and 15% to the protocol reserve.

In the bootstrap phase that allowance is allocated by the Stacks Endowment to whitelisted partners, with roughly a tenth of bond capacity kept open through selected pooling partners, so most participants reach a bond through a pool rather than by calling `register-for-bond` themselves. Liquid staking products work differently again: you deposit into the product, the product stakes, and you hold a token representing your share, so pox-5 never records you as a staker at all.

<div data-with-frame="true"><figure><img src="https://2842511454-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FH74xqoobupBWwBsVMJhK%2Fuploads%2FG660xt3cld5Hh0RkGykm%2Fstaking-bond-timeline_v2.png?alt=media&#x26;token=f0cb4501-14e4-44c6-a8a4-4340f01e953e" alt="Six staggered bond periods running at once, and one bond&#x27;s two legs — BTC timelocked on L1, STX locked on Stacks — with Day 0, Day 175 and Day 182 marked"><figcaption><p>Six bonds running at once, and the shape of one</p></figcaption></figure></div>

Bonding periods are staggered: a new one opens every two reward cycles (about a month), each runs twelve cycles, and six are active at any moment, so a bond that ends is immediately followed by one that starts. The BTC timelock expires 1,050 Bitcoin blocks (about a week) before the bond ends, and that window is when you can re-lock BTC for the next bond. On a roll-over the STX lock extends without unlocking; otherwise the STX unlocks when the bond ends. Exiting early (`unstake-sbtc`, or the L1 early-exit path) forfeits the remaining yield, never principal, and the paired STX stays locked to term.

Both paths route through a signer-manager, and both keep the STX in your account. Registering a bond while STX-only staking, or the reverse, is rejected by the contract.

The bond mechanics in depth are in [SIP-045](https://github.com/stacksgov/sips/blob/main/sips/sip-045/sip-045-pox-5-bitcoin-staking.md) and the [Bitcoin Staking whitepaper](https://github.com/stacksgov/sips/blob/main/sips/sip-045/sip-045-5.pdf).

***

### Staking Flow

<div data-with-frame="true"><figure><img src="https://2842511454-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FH74xqoobupBWwBsVMJhK%2Fuploads%2FlMhn2FbjJMLcbh5boEKo%2Fstaking-flow_v2png.png?alt=media&#x26;token=2c76f993-8c1c-4f25-a961-aae5936aee68" alt="Two mutually exclusive ways to stake, side by side: a Bitcoin protocol bond in five steps, with its native BTC and sBTC variants shown at the lock and exit steps, and STX-only staking in five steps"><figcaption><p>Two ways in, step by step</p></figcaption></figure></div>

{% stepper %}
{% step %}
**Choose a signer-manager**

Pick a contract whose fee and admin set you accept; both are readable on-chain before you commit.
{% endstep %}

{% step %}
**Broadcast the staking transaction**

`stake` names the manager, the amount, and a duration of 1 to 96 cycles, and locks the STX in your account.
{% endstep %}

{% step %}
**Earn across cycles**

The one transaction registers you for every cycle you chose, and no further action keeps you in the reward set.
{% endstep %}

{% step %}
**Get paid**

pox-5 settles rewards per staker to your manager, which distributes them as sBTC, or as native BTC if you elected that.
{% endstep %}

{% step %}
**Unstake when you choose**

`unstake` ends the position and the STX unlocks at the start of the next cycle.
{% endstep %}
{% endstepper %}

{% hint style="warning" %}
Staking, staking updates, and unstaking are blocked during the prepare phase, the last 100 Bitcoin blocks of every reward cycle, while the upcoming cycle's signer set is frozen. This recurs every cycle.
{% endhint %}

`stake-update` changes a live position without a cooldown: switch managers, increase the amount, extend the duration, or rotate a payout address. Changes take effect from the start of the next cycle. Reducing your locked amount is the exception, and still costs a cycle.

### Staking Cycles

Staking happens in reward cycles of 2,100 Bitcoin blocks (roughly two weeks). The last 100 Bitcoin blocks of each cycle are the prepare phase, in which the upcoming cycle's signer set is fixed and staking transactions are rejected.

<div data-with-frame="true"><figure><img src="https://2842511454-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FH74xqoobupBWwBsVMJhK%2Fuploads%2Ffz7B1xYNMnl5u5ICddZi%2Fstaking-cycles.png?alt=media&#x26;token=7aea0cf7-4dee-42af-a195-acf5c9aade65" alt="A reward cycle of 2,100 Bitcoin blocks ending in a 100-block prepare phase, with reward distributions every 1,050 blocks and unlocks at the cycle boundary"><figcaption><p>One reward cycle, block by block</p></figcaption></figure></div>

* The prepare phase fixes the signer set for the upcoming cycle: every signer-manager with at least 50,000 STX staked to it in aggregate.
* During the reward phase, miners commit BTC to mine Stacks blocks, and that BTC funds staker rewards.
* Rewards are credited once per distribution interval of 1,050 Bitcoin blocks (roughly one week), two intervals per reward cycle. The interval gates crediting only: your signer-manager can claim credited rewards at any time.
* Unlocks happen at a cycle boundary: at the start of the cycle after your chosen duration ends, or after you unstake.

{% hint style="info" %}
The two-week target comes from Bitcoin's 10-minute target block time, so a cycle stretches when Bitcoin blocks run slow.
{% endhint %}

***

### Staking and Signing

Staking and signing are distinct actions, and both are necessary. The staked STX decides how much weight a signer carries, and the signer key does the signing. A signer-manager connects the two: it is bound to one signer key through a one-time grant, and the signer software detects from chain state whether its manager is in the signer set for the upcoming cycle.

<div data-with-frame="true"><figure><img src="https://2842511454-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FH74xqoobupBWwBsVMJhK%2Fuploads%2FS1L4pYrXDd1Ju74JhJkr%2Fstaking-and-signing.png?alt=media&#x26;token=3395cd31-c1fa-4f1a-97e0-f762285052c7" alt="Manual staking transactions feeding the reward phase, and the signer software acting automatically once its manager is in the signer set"><figcaption><p>What you do, and what the signer does</p></figcaption></figure></div>

You do not run a signer to stake. The manager you stake to is bound to one, and your stake adds to its weight. Running your own signer means deploying a signer-manager, binding your signer key to it, and operating the signer software: see [Deploy a Signer Manager Contract](https://docs.stacks.co/operate/deploy-a-signer-manager-contract) and [Run a Signer](https://docs.stacks.co/operate/run-a-signer).

Signing itself is covered in [Signing: Verifying Block Validity](signing.md).

***

### How and Where to Stake

Anyone with STX in their own account can stake. [app.leather.io/staking](https://app.leather.io/staking) lists signer-managers to pick from, and several pool operators run their own staking apps. Whichever you use, the transaction goes to `pox-5`.

For step-by-step instructions, see the [Staking STX guides](https://docs.stacks.co/operate/staking-stx).

***

### If You Knew Stacking Under PoX-4

The network renamed stacking to staking with PoX-5, and the mechanics changed with the name. The corrections to the old model, in one place:

* Every PoX-4 position unlocked when Epoch 4.0 activated. Re-enroll under PoX-5 to keep earning.
* Solo and pooled stacking were separate mechanisms. Both are replaced by staking to a signer-manager, and the protocol has no delegator or pool operator role.
* `delegate-stx`, `revoke-delegate-stx`, and `stack-aggregation-commit` no longer exist. No operator commits per cycle on your behalf, so a missed commit can no longer cost a pool a cycle of rewards.
* The dynamic minimum is gone, and the `min_threshold_ustx` field with it.
* Per-transaction signer signatures are gone, replaced by the one-time signer-key grant.
* The cooldown cycle is gone for everything except reducing your locked amount, which still costs a cycle.
* [SIP-007](https://github.com/stacksgov/sips/blob/main/sips/sip-007/sip-007-stacking-consensus.md) describes PoX before Nakamoto, and [SIP-021](https://github.com/stacksgov/sips/blob/main/sips/sip-021/sip-021-nakamoto.md) describes Nakamoto. Read both as history rather than current behavior.

[What's Changed in PoX-5](https://docs.stacks.co/operate/staking-stx/whats-changed-in-pox-5) covers the migration in operator detail.

***

#### Additional Resources

* [SIP-045: PoX-5, Bitcoin Staking](https://github.com/stacksgov/sips/blob/main/sips/sip-045/sip-045-pox-5-bitcoin-staking.md)
* [Bitcoin Staking whitepaper](https://github.com/stacksgov/sips/blob/main/sips/sip-045/sip-045-5.pdf)
* [pox-5.clar at release 4.0.1](https://github.com/stacks-network/stacks-core/blob/4.0.1/stackslib/src/chainstate/stacks/boot/pox-5.clar)
* [Staking STX guides](https://docs.stacks.co/operate/staking-stx)
