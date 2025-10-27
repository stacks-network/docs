# Stacking

### Introduction

Stacking rewards Stacks (STX) token holders with bitcoin for providing a valuable service to the network by locking up their tokens for a certain time and participating as consensus-critical signers. If you aren't familiar with the concept of signers in Stacks, be sure to check out the [Signing section](https://app.gitbook.com/o/hoh4mQXTl8NvI3cETroY/s/H74xqoobupBWwBsVMJhK/block-production/signing). This document is a conceptual overview of stacking and how it works.

`pox-4.clar` is the stacking contract. If you are interested in experimenting with proof of transfer use cases including state changes, solo stacking, and pool stacking, all the functions you’ll need can be found at the deployed contract:

* Testnet: https://explorer.hiro.so/txid/0xfba7f786fae1953fa56f4e56aeac053575fd48bf72360523366d739e96613da3?chain=testnet
* Mainnet: https://explorer.hiro.so/txid/0xc6d6e6ec82cabb2d7a9f4b85fcc298778d01186cabaee01685537aca390cdb46?chain=mainnet

### Stacking vs Staking

While stacking on the Stacks network can be conceptually similar to staking, Stacks is not a PoS network and there are a couple key differences.

There are two primary differences between stacking in Stacks and staking in PoS networks.

#### Yield generated in burnchain token

In staking, users lock one token and earn their yield in the same token. In stacking, users lock one token (STX) and earn a yield in the "burnchain" token (BTC), rather than the same token that was locked. In PoX, the yield comes from a finite, external source (Bitcoin deposits from Stacks miners). In PoS, the yield comes from the currency's issuance schedule itself.

How are these issuance rates set? In Ethereum, issuance rates are determined by network usage. Ethereum's goal is to create a deflationary money supply, so the issuance rate is determined depending on the usage of the network. In order for an Ethereum transaction to be considered valid, it must include a base fee that is burned during transaction execution. The [issuance rate is algorithmically determined](https://ethereum.org/en/roadmap/merge/issuance/#post-merge) block-by-block depending on how much ETH is being burned by these base fees plus normal gas fees.

Stacking doesn't generate yield in the same token and therefore doesn't need to issue new STX for stacking rewards. Stacking yield requires an input of an external token (BTC). Stacks does have an issuance rate and does generate new STX tokens, but that process is separate from stacking and the stacking yield mechanism.

#### No slashing

Although stackers do fulfill a consensus-critical role in Stacks by serving as signers, there is no concept of slashing in PoX (Proof of Transfer).

Rather, if stackers do not perform their duties as signers, they simply cannot unlock their STX tokens and will not receive their BTC rewards.

Stacking is a built-in action, required by the "proof-of-transfer" (PoX) mechanism. The PoX mechanism is executed by every miner on the Stacks network.

{% hint style="info" %}
Stacking functionality is implemented as a smart contract, using Clarity. Read more about [the contract](https://app.gitbook.com/s/GVj1Z9vMuEOMe7oH7Wnq/clarity/example-contracts/stacking).
{% endhint %}

### Locking and Unlocking STX

When STX tokens are "locked", no transfer of STX tokens occurs. Locking STX tokens is non-custodial, and STX tokens remain in your wallet. When you initiate a stacking transaction those tokens are locked and unspendable at the protocol level, but they do not leave the stacker's wallet.

At the end of the lock period, they will be automatically unlocked (spendable at the protocol level). This occurs implicitly; there is no direct transaction that unlocks them.

### Stacking flow

The Stacking mechanism can be presented as a flow of actions:

<figure><img src="../.gitbook/assets/image (20).png" alt=""><figcaption></figcaption></figure>

{% stepper %}
{% step %}
### Make API calls to get details about the upcoming reward cycle

Query the network to discover the upcoming cycle parameters and timing.
{% endstep %}

{% step %}
### Confirm eligibility for a specific Stacks account

Verify the account meets the minimum requirements and is eligible to participate.
{% endstep %}

{% step %}
### Confirm the BTC reward address and lockup duration

Specify the Bitcoin address to receive payouts and input the desired lockup period.
{% endstep %}

{% step %}
### Broadcast the stacking transaction to lock STX

The transaction is broadcast and the STX tokens are locked. This must happen before the prepare phase of the next reward cycle (the last 100 Bitcoin blocks of the ongoing reward phase).
{% endstep %}

{% step %}
### Reward cycles execute and BTC rewards are sent

The stacking mechanism executes reward cycles and sends out rewards to the configured BTC reward address.
{% endstep %}

{% step %}
### Monitor unlocking timing and rewards during lockup

During the lockup period, you can obtain details about unlocking timing, expected rewards, and more.
{% endstep %}

{% step %}
### Tokens are released after the lockup period

Once the lockup period has passed, the tokens become spendable again.
{% endstep %}

{% step %}
### Display reward history

Show historical details like earnings for previous reward cycles.
{% endstep %}
{% endstepper %}

{% hint style="info" %}
Keep in mind that the target duration for a reward cycle is \~2 weeks. This duration is based on the target block time of the Bitcoin network (10 minutes) and can be higher at times due to [confirmation time variances](https://www.blockchain.com/charts/median-confirmation-time) of the Bitcoin network.
{% endhint %}

### Stacking delegation flow

There are two main ways you can stack: solo stacking and delegated stacking.

{% stepper %}
{% step %}
### Solo stacking

Solo stacking follows the general stacking flow. You stack your own STX tokens and run your own signer. To operate as a solo stacker, you must have a minimum amount of STX tokens. This minimum is dynamic and can be found by viewing the [pox endpoint of the API](https://api.testnet.hiro.so/v2/pox) in the `min_threshold_ustx` field.
{% endstep %}

{% step %}
### Delegated stacking

<figure><img src="../.gitbook/assets/image (21).png" alt=""><figcaption></figcaption></figure>

Delegated stacking differs:

* Before stacking on behalf of a token holder, the delegator must be granted permission by the account owner. Permission is restricted to a maximum amount the delegator may stack; the maximum can be set higher than available funds. An account can be associated with only one delegator.
* The account sets the delegation relationship. They can optionally restrict the Bitcoin reward address that must be used for payouts and specify an expiration burn block height to limit the delegation duration.
* Delegators lock STX from different accounts ("pooling phase") until they reach the minimum required to participate in stacking.
* Once the delegator locks enough STX, they can finalize and commit participation in the next reward cycle.
* Some delegation relationships may allow the STX holder to receive payouts directly from the miner.
* Delegation can terminate automatically based on expiration rules or by actively revoking delegation rights.
{% endstep %}
{% endstepper %}

### Token holder eligibility

Stacks (STX) token holders don't automatically receive stacking rewards. To participate, they must:

* Commit to participation before a reward cycle begins
* Commit at least the minimum amount of STX tokens to secure a reward slot, or pool with others to reach the minimum
* Lock up STX tokens for a specified period
* Provide a supported Bitcoin address to receive rewards
* Maintain their signer software (if they operate a signer)

<figure><img src="../.gitbook/assets/image (22).png" alt=""><figcaption></figcaption></figure>

Token holders have a variety of providers and tools to support their participation in stacking. The Stacks website contains a [list of pools and stacking options](https://www.stacks.co/learn/stacking#startstacking).

### Stacking in the PoX consensus algorithm

Stacking is a built-in capability of PoX and occurs through a set of actions on the Stacks blockchain. The [full proof-of-transfer implementation details](https://github.com/stacks-network/stacks-blockchain/blob/develop/sip/sip-007-stacking-consensus.md) are in SIP-007. Below is a summary of the most relevant actions of the algorithm.

{% hint style="info" %}
Note that SIP-007 describes stacking before Nakamoto. While much of the functionality remains the same, stackers now have the additional responsibility of operating as signers as outlined in [SIP-021](https://github.com/stacksgov/sips/blob/feat/sip-021-nakamoto/sips/sip-021/sip-021-nakamoto.md).
{% endhint %}

<figure><img src="../.gitbook/assets/image (23).png" alt=""><figcaption></figcaption></figure>

Stacking happens in reward cycles of 2100 Bitcoin blocks (roughly two weeks). Reward cycles are split into two phases: the prepare phase and the reward phase.

* The prepare phase lasts 100 Bitcoin blocks and is where the new stackers for the upcoming reward phase are selected by the PoX anchor block (see SIP-007 for details).
* Because Stacks does not fork after the Nakamoto upgrade, the PoX anchor block is always known 100 Bitcoin blocks before the start of the next reward cycle. It is the last tenure-start block that precedes the prepare phase.
* The PoX anchor block identifies the next stackers. They have 100 Bitcoin blocks to prepare for signing Stacks blocks, including completing a Distributed Key Generation round for signing blocks.
* The PoX contract requires stackers to register their block-signing keys when they stack or delegate-stack STX, so the entire network can validate signatures on blocks.

This process is handled by [running a signer](https://app.gitbook.com/s/4cpTb2lbw0LAOuMHrvhA/run-a-signer) and then subsequently conducting stacking operations as that signer.

### Stacking and Signing

Stacking and signing are distinct actions, but both are necessary. Signers must stack their STX tokens, and you cannot stack STX without associated signing information. The nuance depends on solo vs delegated stacking.

### Solo Stacking

If you are solo stacking, you have two options for signing.

#### Run your own signer

You can run your own signer by following the How to Run a Signer guide. This requires technical knowledge and resources for running a machine. See the guide for details.

#### Work with another signer

If you don't want to run your own signer, you can collaborate with another signer and include their signature in your stacking transactions. Details on how to do this are in the [Stack STX](https://app.gitbook.com/s/4cpTb2lbw0LAOuMHrvhA/stacking-stx) guide.

### Delegated Stacking

If you delegate your STX to a pool operator, you do not need to run a signer. The pool operator conducts the actual stacking transaction and is responsible for running the signer.

If you are a pool operator, see the [operate-a-pool guide](https://app.gitbook.com/s/4cpTb2lbw0LAOuMHrvhA/stacking-stx/operate-a-stacking-pool).

### How and Where to Stack

Options for stacking include solo stacking, participating in a pool, using an exchange, and liquid stacking. The Stacks website has a [stacking page](https://www.stacks.co/learn/stacking) describing these options.

For detailed instructions on how to stack, see the [Stack STX guides](https://app.gitbook.com/s/4cpTb2lbw0LAOuMHrvhA/stacking-stx).

Tools and explorers for stacking data and statistics:

* https://app.signal21.io/
* https://www.stacking-tracker.com/
* https://www.stakingrewards.com/calculator?asset=stacks
* https://stacking.tools/
