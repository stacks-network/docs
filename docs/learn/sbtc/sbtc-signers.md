# The sBTC Signers

The Peg Wallet UTXO is a fundamental element of the sBTC system, serving as the Bitcoin backing for all sBTC tokens in circulation. The system uses a Single UTXO Model: the sBTC peg wallet is consistently represented as a single Unspent Transaction Output (UTXO) on the Bitcoin blockchain. This design offers simplicity and improved efficiency in managing the peg wallet.

{% hint style="info" %}
This UTXO resides in a secure multi-signature taproot address controlled by the sBTC Signers:\
[bc1pss7kvauf5utmxp3pznz7guc63zujmpwnt9q4znzu4dzhd69yumgs58cjgl](https://mempool.space/address/bc1pss7kvauf5utmxp3pznz7guc63zujmpwnt9q4znzu4dzhd69yumgs58cjgl)
{% endhint %}

## Overview

* Single UTXO Model: the peg wallet is always a single UTXO.
* Responsibility: UTXO management is performed by the Signer set.
* Purpose: simplify tracking and management, reduce Bitcoin transactions required for sBTC operations, and centralize funds in a single, well-secured output.

## How the Single UTXO is maintained

{% stepper %}
{% step %}
**Constructing the new UTXO**

A Signer coordinator constructs the UTXO by creating a new Bitcoin output that will represent the peg wallet going forward.
{% endstep %}

{% step %}
**Consolidating requests into a batch**

The Signer set collectively consolidates all deposit and withdrawal requests and creates optimized batches that can be processed within a single UTXO.
{% endstep %}

{% step %}
**Creating the new UTXO from the previous UTXO**

The new UTXO is created by:

* spending the amount from the previous UTXO,
* adding confirmed deposits,
* subtracting confirmed withdrawals.
{% endstep %}

{% step %}
**Optimizing batching with approval sets**

When multiple sBTC operation requests are present, the Signer coordinator groups them by approval sets. If differing approval sets exist across active operations, the coordinator batches deposit UTXOs into groups with the maximum size per approval set to preserve the single UTXO invariant while maximizing batch efficiency.
{% endstep %}
{% endstepper %}

## Benefits

* Simplified tracking and management of peg funds.
* Fewer Bitcoin transactions for sBTC operations.
* Centralized funds in a single, well-secured output improves operational efficiency.

{% hint style="info" %}
The Single UTXO Model is designed to balance simplicity and operational efficiency for the sBTC peg wallet.
{% endhint %}

## Security considerations

* The single UTXO is managed by the sBTC Bootstrap Signer Set, which requires a threshold of signers to approve any spending (multi-signature).
* Regular audits and continuous monitoring are essential to ensure the UTXO accurately represents the total sBTC in circulation at all times.
* The UTXO, held by the Signers' bitcoin address, is only spendable via a [key path spend](https://github.com/stacks-sbtc/sbtc/blob/7d8b2cb508f7068373ced808f6e9d28c92387b28/signer/src/keys.rs#L439-L441). This means there are no hidden taproot script path spends.

{% hint style="warning" %}
Security is paramount: multi-signature approval, audits, and monitoring are core controls to protect the peg wallet.
{% endhint %}

***

### What's the difference between Stacks Signers vs sBTC Signers

| Role                       | Stacks Signer                      | sBTC Signer                                        |
| -------------------------- | ---------------------------------- | -------------------------------------------------- |
| **Primary Responsibility** | Signs and validates Stacks blocks  | Secures peg for sBTC (Bitcoin ↔ Stacks)            |
| **What They Sign**         | Stacks block data                  | Bitcoin transactions (peg-in / peg-out)            |
| **Layer**                  | Stacks consensus layer             | Bitcoin layer (via threshold signatures)           |
| **Purpose**                | Ensure canonical chain progression | Ensure safe custody + movement of BTC backing sBTC |
| **Trust Model**            | Part of Stacks consensus           | Threshold signer set managing BTC                  |
| **Failure Impact**         | Chain instability / fork risk      | Risk to BTC peg integrity                          |
| **Assets Involved**        | STX                                | BTC                                                |

## Who are the sBTC Signers

**sBTC Signer Set**

<table data-header-hidden><thead><tr><th width="211"></th><th></th></tr></thead><tbody><tr><td><strong>Organization</strong></td><td><strong>Qualifications</strong></td></tr><tr><td><strong>Asymmetric Research</strong></td><td>Top validator on various networks (Solana, Aptos), providing critical feedback to Stacks ecosystem.</td></tr><tr><td><strong>Bitcoin L2 Labs</strong></td><td>Development company for sBTC protocol, deep involvement in Stacks and Bitcoin ecosystems.</td></tr><tr><td><strong>Blockdaemon</strong></td><td>Largest node operator, 50+ blockchains supported, active as a signer in Stacks.</td></tr><tr><td><strong>Degen Lab</strong></td><td>Continuous involvement with the Stacks ecosystem, successfully built a decentralized stacking pool, and contributor to several open-source projects</td></tr><tr><td><strong>Fast Pool</strong></td><td>Oldest Stacking pool, deep knowledge of Bitcoin and Stacks nodes since 2021.</td></tr><tr><td><strong>SenseiNode</strong></td><td>Top Latin American node operator, 9,500+ validators, focused on decentralizing infrastructure.</td></tr><tr><td><strong>Stacking DAO</strong></td><td>Leading DeFi app and liquid staking protocol, managing 56 million STX, sBTC signer infrastructure.</td></tr><tr><td><strong>Xverse</strong></td><td>Long-term Stacks supporter, largest Stacking pool by TVL, integrated into Xverse wallet.</td></tr><tr><td><strong>Ankr</strong></td><td>RPC infrastructure across 70+ blockchains, handling 8B+ daily requests, with non-custodial staking already serving 18,000+ users</td></tr><tr><td><strong>The Tie</strong></td><td>Institutional crypto data platform serving ~500 funds, asset managers, and banks + staking infrastructure across 40+ networks.</td></tr><tr><td><strong>Hashkey</strong></td><td><a href="https://www.hashkey.com/en-US">HashKey</a> brings regulated digital asset expertise and an established institutional footprint in Asia to the signer set.</td></tr></tbody></table>

#### Signer Rotations

A decentralized signer set is a living network, and rotation is part of its design. Signers commit infrastructure, key shares, and operational overhead to the set, and on a semi-regular basis, some step back while others step in. The protocol is designed for exactly this: the 70% consensus threshold holds throughout the transition, every handoff is verified onchain, and no BTC ever moves with fewer approvals than before. Each cycle is also how the set gets stronger, bringing in signers whose infrastructure and regulatory posture match where [Bitcoin-native finance](https://www.stacks.co/bitcoin-native-finance) is heading.

**Previous rotations:**

* [February 3rd, 2026](https://github.com/stacks-sbtc/sbtc/discussions/624?sort=new#discussioncomment-15687048)
* [September 4th, 2026](https://www.stacks.co/blog/meet-the-new-sbtc-signers-ankr-the-tie-and-hashkey-join-the-set)
