---
description: >-
  How to stake STX-only under PoX-5 by choosing a signer-manager contract, what
  to check before you do, and how you get paid.
---

# Stake to an Existing Signer-Manager

Staking STX-only under PoX-5 (Stacks 4.x) means locking your STX and naming a signer-manager contract to act for you. You choose how many cycles it runs, from 1 to 96. You can unstake at any time and your STX unlocks at the start of the next cycle, so you are never locked for more than one cycle.

You keep custody throughout: the STX locks in your own account and the manager never holds it.

### Stake

For STX-only staking, use [app.leather.io/staking](https://app.leather.io/staking), which lists signer-managers you can pick from. Several pool operators run their own staking apps as well.

Whichever you use, the transaction goes to `pox-5`.

<figure><img src="https://4065274862-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F4cpTb2lbw0LAOuMHrvhA%2Fuploads%2FjDg22iamidwOWL66JBSd%2Fimage.png?alt=media&#x26;token=f61519b1-c36c-4d8e-85e6-b3bd26cbd4c1" alt="A list of signer-manager contracts to choose from in the Leather staking app"><figcaption><p>Choosing a signer-manager</p></figcaption></figure>

<figure><img src="https://4065274862-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F4cpTb2lbw0LAOuMHrvhA%2Fuploads%2FP4PeRg1y6jTAyRGrwZCu%2Fimage.png?alt=media&#x26;token=e90baa33-27dc-4f5c-9744-ca43ec67e537" alt="Fields for the amount of STX to stake and the number of cycles to run"><figcaption><p>Setting the amount and the number of cycles</p></figcaption></figure>

[Watch the flow end to end](https://x.com/Stacks/status/2083267023916662923)

{% hint style="warning" %}
Staking and staking updates are blocked during the prepare phase, the last 100 Bitcoin blocks of every reward cycle. A `stake` submitted then fails with `ERR_STAKE_IN_PREPARE_PHASE (u47)`. This recurs every cycle rather than happening once.
{% endhint %}

A transaction ID confirms submission, not success. Confirm the position on-chain or in your wallet before treating yourself as staked.

<figure><img src="https://4065274862-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F4cpTb2lbw0LAOuMHrvhA%2Fuploads%2FVfufmVUm8XT7n8FYjIYS%2Fimage.png?alt=media&#x26;token=2a179bd9-4535-49cc-9c9f-ade4bd5c44b8" alt="An active staking position shown in the app after the transaction confirmed"><figcaption><p>The position confirmed after the transaction lands</p></figcaption></figure>

{% hint style="warning" %}
**One position per Stacks principal.** STX-only staking and a protocol bond are mutually exclusive. Registering a bond while staked fails with `ERR_ALREADY_STAKED (u19)`.
{% endhint %}

### Choosing between signer-managers

If you took whichever manager your app offered, you can skip this. Everything below is readable on-chain before you stake.

* **Current fee.** A percentage of your sBTC rewards, deducted by the manager before it pays you.
* **Fee ceiling.** Fixed in the deployed code and unchangeable afterwards. Some managers permit anything up to 99.99%. Others cap at 5%.
* **Admin set.** Who can change the fee and withdraw accrued fees. Some managers block an admin from removing themselves, so the contract can never be left with no admin. Others have no such guard.
* **An active signer-key grant.** A manager without one cannot accept new stake, and your transaction fails with `ERR_SIGNER_KEY_GRANT_NOT_FOUND (u17)`.

A manager needs 50,000 STX (`SIGNER_SET_MIN_USTX`) in aggregate across everyone staking to it before it enters the signer set. That threshold is fixed and applies to the manager rather than to you, so your own stake can be any size as long as the signer-manager doesn't restrict it.

{% hint style="info" %}
**Immutable code, mutable terms.** A deployed contract's Clarity source can never change, but its parameters can. An admin can change the fee at any time, up to whatever ceiling that contract fixed at deployment. Read the current fee and the admin set rather than assuming the economics are settled.
{% endhint %}

### How you are paid

Rewards reach your signer-manager as sBTC and the manager distributes them. To be paid in native BTC on Bitcoin L1 instead, supply a `signer-calldata` buffer when you stake, if the manager contract supports it. pox-5 forwards that buffer to the manager and stores nothing itself, so what it means is defined by the manager you chose.

Both [app.leather.io/staking](https://app.leather.io/staking) and pool operators' own apps can supply those extra details. A general-purpose app offers the options it knows about, so a custom signer-manager may accept choices that only its operator's own app can work with.

{% hint style="warning" %}
**Re-staking without resupplying your Bitcoin address reverts you to sBTC.** In the reference manager, `signer-calldata` of `none` on a later call deletes the stored entry rather than preserving it, and you get no error.
{% endhint %}

Claiming is non-custodial and anyone can call it. Rewards move from `pox-5` to the signer-manager, then the manager's `claim-staker-rewards` moves them on to you. Your manager will normally do both, and since PoX-5 (Stacks 4.x) you can also do them yourself.

### Change or end your position

`stake-update` re-runs the manager's validation. A second call overwrites whatever the first stored, which is also how a stored payout address is rotated. You can change:

* **The signer-manager**, which is how you switch pools. It takes effect from the start of the next cycle, with no cooldown.
* **The amount**, to increase your stake.
* **The duration**, to extend how many cycles it runs.
* **The Bitcoin payout address and max fee.** When a manager starts paying to a new address depends on its own policy, typically from the next payout. Check the operator's site.

`unstake` ends the position. Like staking, it is blocked during the prepare phase, failing with `ERR_UNSTAKE_IN_PREPARE_PHASE (u28)`. Unlocks happen at the start of the next cycle.

### If you stacked under PoX-4

Every PoX-4 position unlocked when Epoch 4.0 activated, so you are not stacking until you re-enroll.

This used to be called joining a pool, and the word still works. PoX-5 has no separate pooling mechanism, so a manager with one staker and a manager with a thousand are the same kind of thing.

`delegate-stx` and `revoke-delegate-stx` are gone. PoX-5 has no delegation map, so there is no permission grant to inspect or revoke. You stake to a manager directly and you end it with `unstake`.

`stack-aggregation-commit` is gone. No operator commits per cycle on your behalf.

Solo and pooled stacking were separate mechanisms under PoX-4. They are not separate now.
