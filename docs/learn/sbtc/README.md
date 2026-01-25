# sBTC: Bitcoin's Gateway to Smart Contracts

<div data-with-frame="true"><figure><img src="../.gitbook/assets/sbtc-cover.png" alt=""><figcaption></figcaption></figure></div>

{% hint style="info" %}
Developers: Jump to the [sBTC integration guides](https://app.gitbook.com/s/Zz9BLmTU9oydDpL3qiUh/more-guides/sbtc) to start building with sBTC in your Clarity smart contracts and applications.
{% endhint %}

## Overview

sBTC is a wrapped Bitcoin asset on Stacks that maintains a 1:1 peg with Bitcoin. As a SIP-010 compliant token, sBTC enables Bitcoin holders to access decentralized finance and smart contract capabilities while preserving their Bitcoin exposure.

### The Vision

> _Making Bitcoin a fully programmable, productive asset transforms it into the foundation of DeFi and a more secure web3. Enabling seamless movement of Bitcoin in and out of smart contracts—with trustless writes to the Bitcoin blockchain—unlocks hundreds of billions in previously passive BTC for the decentralized web._
>
> \- sBTC: Design of a Trustless Two-way Peg for Bitcoin

### Core Advantages

**Native Bitcoin Access**  
Participate in Stacks DeFi without converting or selling your BTC holdings.

**Fast Conversions**  
Deposit sBTC within 3 Bitcoin blocks; withdraw within 6 blocks—enabling responsive trading and DeFi strategies.

**Decentralized Infrastructure**  
A distributed set of 15 community-selected signers manages the peg wallet, eliminating single points of failure.

**Community-Driven Governance**  
The Stacks community participates in critical decisions including signer selection and protocol upgrades.

## Core Architecture

### sBTC Token

sBTC implements the [SIP-010 fungible token standard](https://github.com/stacksgov/sips/blob/main/sips/sip-010/sip-010-fungible-token-standard.md), ensuring compatibility across Stacks wallets and DeFi protocols. The fundamental property: **1 sBTC always equals 1 BTC**.

### sBTC UTXO

All BTC backing sBTC is held in a single unspent transaction output on Bitcoin. This UTXO exists at a secure multi-signature taproot address controlled collectively by the sBTC Signers:

[bc1prcs82tvrz70jk8u79uekwdfjhd0qhs2mva6e526arycu7fu25zsqhyztuy](https://mempool.space/address/bc1prcs82tvrz70jk8u79uekwdfjhd0qhs2mva6e526arycu7fu25zsqhyztuy)

This design consolidates security monitoring while maintaining transparency—anyone can verify the peg's backing on-chain.

### sBTC Signers

sBTC Signers operate independently from Stacks' Nakamoto signers. Their responsibilities include:

* Authorizing deposit and withdrawal operations
* Interfacing with sBTC smart contracts on Stacks
* Securing and maintaining the Bitcoin UTXO
* Rotating private keys to enhance security

Learn more about the current signer set at [Bitcoin L2 Labs](https://bitcoinl2labs.com/sbtc-rollout#sbtc-signers).

### sBTC Signer Set

The complete group of sBTC Signers functions as a democratic collective with shared UTXO access. This distributed model ensures:

- No single entity controls the peg
- Signers can independently verify operations
- Key rotation capabilities for ongoing security
- Resilience against individual signer failures

### Emily API

Emily serves as the coordination layer between users and signers. This API:

- Facilitates deposit and withdrawal requests
- Monitors operation status
- Provides programmatic access to bridge functionality
- Supervises transaction flow between Bitcoin and Stacks

### SIP-010 Compliance

Adhering to the SIP-010 standard means sBTC works seamlessly with:

- Stacks wallets supporting fungible tokens
- DEXs and DeFi protocols on Stacks
- Block explorers and analytics tools
- Standard token interfaces and conventions

<figure><img src="../.gitbook/assets/Group 316124848.png" alt=""><figcaption></figcaption></figure>

These components work together to create a trustless bridge between Bitcoin's security and Stacks' programmability, enabling a new class of Bitcoin-native applications.

---

## Additional Resources

* [sBTC Whitepaper](https://stacks-network.github.io/stacks/sbtc.pdf) - Technical design specification
* [Stacks Foundation](https://stacks.org/sbtc-on-mainnet) - Official mainnet launch announcement (December 2024)
* [Bitcoin Writes](https://www.bitcoinwrites.com/) - Weekly sBTC development updates (archived through August 2024)
* [Hiro Blog](https://www.hiro.so/blog/who-are-the-sbtc-signers-breaking-down-sip-028) - Deep dive on SIP-028 and signer selection
