# Proof of Transfer (PoX)

<figure><picture><source srcset="../.gitbook/assets/pox-light.png" media="(prefers-color-scheme: dark)"><img src="../.gitbook/assets/pox.png" alt=""></picture><figcaption></figcaption></figure>

## Introduction

Proof of Transfer (PoX) is the innovative consensus mechanism that powers Stacks, enabling it to function as a Bitcoin Layer 2 while maintaining deep security and economic ties to Bitcoin. This groundbreaking approach allows Stacks to expand Bitcoin's functionality without requiring any modifications to Bitcoin itself.

This guide provides a comprehensive overview of how Proof of Transfer works, why it matters, and how the Nakamoto upgrade has fundamentally strengthened Stacks' connection to Bitcoin.

For technical implementation details about block production, see the [Block Production](../block-production/) section.

---

## Understanding Blockchain Consensus

Before diving into Proof of Transfer, it's helpful to understand the landscape of blockchain consensus mechanisms.

Consensus algorithms require participants to commit resources—computational or financial—to secure a blockchain. The goal is to make it economically or computationally infeasible for any single malicious actor to attack the network.

### Common Consensus Mechanisms

**Proof of Work (PoW)** — Nodes dedicate computing resources to solve cryptographic puzzles. Bitcoin pioneered this approach, creating the most secure and battle-tested blockchain network.

**Proof of Stake (PoS)** — Nodes stake financial resources (native tokens) to participate in consensus and earn rewards. Validators with more stake have greater influence.

**Proof of Burn** — A less common approach where miners compete by "burning" (permanently destroying) cryptocurrency as a proxy for computing resources, demonstrating economic commitment.

---

## What is Proof of Transfer?

Proof of Transfer extends the proof of burn concept with a crucial innovation: instead of destroying cryptocurrency, miners transfer Bitcoin to other network participants (Stackers).

<div data-with-frame="true"><figure><img src="../.gitbook/assets/Stacks_graphic - 67.png" alt=""><figcaption></figcaption></figure></div>

### The PoX Cycle

In Stacks' Proof of Transfer mechanism:

1. **Miners** commit Bitcoin to mine Stacks blocks and earn STX rewards
2. **Stackers** lock their STX tokens to support consensus
3. The Bitcoin committed by miners is distributed to Stackers as yield
4. Each Stacks block is cryptographically anchored to Bitcoin

This creates a virtuous cycle where both miners and Stackers are economically aligned with Bitcoin's security and value.

<div data-with-frame="true"><figure><img src="../.gitbook/assets/Stacks_graphic - 80.png" alt=""><figcaption></figcaption></figure></div>

### Key Benefits

**Bitcoin-Native Security** — Stacks blocks are cryptographically anchored to Bitcoin, inheriting its immutability and security properties.

**Productive Bitcoin** — BTC holders can earn yield by participating in Stacks consensus, making their Bitcoin productive without selling or wrapping it.

**Sustainable Mining** — Miners use existing Bitcoin rather than requiring massive energy expenditure for separate proof of work.

**No Bitcoin Modification** — The entire system operates without requiring any changes to the Bitcoin protocol.

---

## Why Bitcoin?

Stacks chose Bitcoin as its anchor chain for compelling technical, economic, and philosophical reasons.

### Technical Excellence

**Unparalleled Security** — Bitcoin has operated continuously since 2009 without successful attacks, demonstrating the most robust security model in blockchain history.

**Battle-Tested Stability** — Over 15 years of operation have proven Bitcoin's resistance to attacks, network disruptions, and protocol vulnerabilities.

**Massive Hashpower** — Bitcoin commands the largest proof-of-work network in the world, making chain reorganizations economically impractical.

### Economic Strength

**Dominant Market Position** — Bitcoin has maintained the highest market capitalization among all cryptocurrencies for over a decade.

**Global Recognition** — Bitcoin is recognized as a legitimate asset class by governments, corporations, and financial institutions worldwide.

**Store of Value** — Bitcoin is widely considered "digital gold," providing a stable foundation for building economic systems.

**Deep Liquidity** — Extensive infrastructure supports Bitcoin trading, custody, and integration across financial systems.

### Philosophical Alignment

**Simplicity and Stability** — Bitcoin's conservative approach to protocol changes aligns with Stacks' goal of building on a reliable foundation.

**Decentralization** — Bitcoin's distributed network and open participation model embody true decentralization.

**Proven Track Record** — Bitcoin's longevity and resilience make it the ideal base layer for long-term applications.

For a comprehensive analysis of why Bitcoin was selected, see [SIP-001](https://github.com/stacksgov/sips/blob/main/sips/sip-001/sip-001-burn-election.md).

> **About SIPs**: Stacks Improvement Proposals (SIPs) are the formal process through which the community proposes and agrees on network changes. Reading SIPs in detail is an excellent way to understand Stacks at the implementation level. View all SIPs in the [SIPs section](../network-fundamentals/sips.md).

---

## The Nakamoto Upgrade: 100% Bitcoin Finality

In October 2024, Stacks activated the Nakamoto upgrade—the most significant enhancement to the network since its mainnet launch in 2021. This upgrade fundamentally strengthened Stacks' connection to Bitcoin.

### What Changed

**Bitcoin Finality** — Stacks transactions now achieve 100% Bitcoin finality, meaning that once confirmed, reversing a Stacks transaction requires reversing Bitcoin itself—making Stacks essentially reorg-proof.

**Faster Blocks** — Block production is no longer tied 1:1 to Bitcoin blocks. Stacks now produces blocks approximately every 6 seconds, dramatically improving transaction speed and user experience.

**Enhanced Security Model** — Stacks is now secured by 100% of Bitcoin's hashrate in addition to the Stacks security budget from its miners.

**MEV Resistance** — The upgrade includes protections against miner extractable value (MEV), ensuring a fairer and more transparent network.

### Technical Implementation

**Signer Network** — The Nakamoto upgrade introduced a new role called Signers, who validate blocks and ensure consensus alignment with Bitcoin.

**Tenure-Based Mining** — Miners are assigned "tenures"—periods during which they can produce multiple Stacks blocks that are ultimately settled on Bitcoin.

**Two-Phase Rollout** — The upgrade was implemented in two phases (Instantiation and Activation) to ensure network stability and give participants time to integrate.

### Impact on PoX

The Nakamoto upgrade significantly enhanced the Proof of Transfer mechanism:

- **Upgraded PoX Contract** — The pox-4 contract introduced improvements to the stacking protocol
- **Increased Yields** — Average stacking yields increased from as low as 2% before the upgrade to over 10% in recent cycles
- **Stronger Bitcoin Anchoring** — Every Stacks block is now more tightly coupled to Bitcoin's security guarantees

---

## How Stacks Inherits Bitcoin's Security

Proof of Transfer creates multiple layers of security inheritance from Bitcoin.

### 1. Cryptographic Anchoring

Every Stacks block records a hash to Bitcoin's blockchain using the OP_RETURN opcode, which allows up to 40 bytes of arbitrary data in Bitcoin transactions.

> For background on OP_RETURN, see this [Stack Exchange explanation](https://bitcoin.stackexchange.com/questions/29554/explanation-of-what-an-op-return-transaction-looks-like).

This means:
- Stacks' history is permanently recorded on Bitcoin block-by-block
- Anyone can verify Stacks block hashes using merkle proofs
- The integrity of Stacks' history depends on Bitcoin's immutability

### 2. Fork Resistance

After the Nakamoto upgrade, Stacks achieves true Bitcoin finality:

- **No Independent Forks** — Stacks can no longer fork on its own
- **Bitcoin-Level Security** — Reorganizing Stacks would require reorganizing Bitcoin itself, which is computationally and economically infeasible
- **Miner Requirements** — Miners must build atop the last mined Stacks blocks at the protocol level

### 3. Dual Security Budget

Stacks benefits from two security layers:

1. **Bitcoin's Hashpower** — 100% of Bitcoin's mining power secures the ordering and finality of Stacks transactions
2. **Stacks Mining** — Additional economic security from miners committing Bitcoin to produce Stacks blocks

---

## Unlocking Bitcoin Capital

Proof of Transfer doesn't just secure Stacks—it enables entirely new possibilities for Bitcoin.

### Reading Bitcoin State

Stacks blocks track which Bitcoin block they're anchored to, enabling powerful cross-chain functionality.

Clarity, Stacks' smart contract language, includes built-in functions like [`get-block-info`](https://docs.stacks.co/docs/write-smart-contracts/clarity-language/language-functions#get-block-info), which returns:

- `burnchain-header-hash` — The Bitcoin block hash corresponding to a Stacks block
- Other Bitcoin-related metadata

This enables smart contracts to:
- Verify Bitcoin transactions occurred
- Trigger actions based on Bitcoin state
- Create Bitcoin-aware decentralized applications

### Real-World Applications

**Catamaran Swaps** — Enables atomic swaps between Bitcoin and Stacks by verifying Bitcoin transactions in Clarity contracts. See the [Catamaran documentation](https://docs.catamaranswaps.org/en/latest/catamaran.html).

**Zest Protocol** — A Bitcoin-native lending protocol that leverages PoX and Bitcoin verification. Learn more at [zestprotocol.com](https://www.zestprotocol.com/).

**sBTC** — A decentralized, trustless Bitcoin peg that allows BTC to move between Bitcoin and Stacks (more on this below).

---

## sBTC: Programmable Bitcoin

sBTC represents the culmination of Stacks' vision to make Bitcoin fully programmable while maintaining its security properties.

### What is sBTC?

sBTC is a 1:1 Bitcoin-backed asset that enables Bitcoin to be used in smart contracts and decentralized applications on Stacks. Unlike centralized alternatives like wBTC, sBTC is secured by a decentralized network of validators (Signers) rather than a single custodian.

### Launch Timeline

**Phase 0: Testnet** — Completed November 22, 2024

**Phase 1: Bitcoin Deposits** — Launched December 17, 2024, enabling users to deposit BTC and mint sBTC

**Phase 2: Bitcoin Withdrawals** — Expected March 2025, enabling full two-way functionality

**Phase 3: Full Decentralization** — Transition to a fully open, permissionless Signer network with expanded participation beyond the initial 15 community-elected signers

### Current Status

The initial 1,000 BTC cap was reached in just four days after launch. The next milestone includes expanding the cap by an additional 2,000 BTC, with plans to eventually remove the cap entirely.

### Key Features

**1:1 Bitcoin Backing** — Every sBTC is backed by exactly 1 BTC locked in the protocol

**Decentralized Security** — Secured by a network of Signers requiring 70% consensus for transaction approval, maintaining balance between liveness and security

**Bitcoin Finality** — Leverages Stacks' 100% Bitcoin finality for maximum security

**Yield Opportunities** — Early adopters can earn approximately 5% annual Bitcoin rewards, paid in sBTC, simply by enrolling and holding the asset

### Use Cases

**DeFi Applications** — Use Bitcoin in lending, borrowing, and liquidity provision without selling it

**Bitcoin-Collateralized Stablecoins** — Create stablecoins backed by BTC

**DAO Treasuries** — Enable DAOs to hold and deploy BTC trustlessly

**NFTs and dApps** — Access faster, cheaper Bitcoin-backed transactions for digital assets

### Technical Implementation

sBTC builds on the Proof of Transfer mechanism:

- **Signer Network** — 14 of 15 elected Signers currently secure the sBTC network, operating independently from Stacks Signers for safety and operational clarity
- **Smart Contract Integration** — Enables programmatic BTC transfers to and from Bitcoin addresses
- **Security Audits** — Partnerships with Asymmetric Research, Immunefi, and other security providers ensure robust protocol security

---

## The Bigger Vision

The ultimate goal of Proof of Transfer and sBTC is to enable Web3's vision of a decentralized economy built on Bitcoin.

### Bitcoin as Settlement Layer

Stacks positions Bitcoin as the foundation for:
- **Decentralized Finance** — Financial applications without intermediaries
- **True Ownership** — User control of assets and data
- **Programmable Money** — Smart contracts leveraging Bitcoin's security

### Unlocking Bitcoin's Potential

Stacks 2.0 brought the ability to "read" Bitcoin state through Clarity. sBTC completes the vision by adding the "write" piece, creating a fully expressive Bitcoin layer that can unlock hundreds of billions in Bitcoin capital.

This transforms Bitcoin from a passive store of value into an active foundation for the decentralized economy.

---

## Technical Resources

### Smart Contracts

The Proof of Transfer functionality is implemented via a [Clarity smart contract on-chain](https://explorer.hiro.so/txid/0xc6d6e6ec82cabb2d7a9f4b85fcc298778d01186cabaee01685537aca390cdb46?chain=mainnet).

The current version (pox-4) was introduced with the Nakamoto upgrade and includes enhanced stacking features.

### APIs and Tools

**Hiro API** — Access PoX details including contract addresses, stacker information, and miner data via [Hiro's API](https://docs.hiro.so/api#tag/Info/operation/get_pox_info).

**Explorer** — View real-time PoX activity on the [Stacks Explorer](https://explorer.hiro.so/).

**Stacking Dashboard** — Monitor stacking participation and rewards on community-built dashboards.

### Documentation

**SIP-007** — The original design for Stacking and Proof of Transfer. Read [SIP-007](https://github.com/stacksgov/sips/blob/main/sips/sip-007/sip-007-stacking-consensus.md) for complete technical details.

**SIP-028** — Establishes criteria and selection process for sBTC Signers who secure the sBTC protocol.

**SIP-029** — Revises the STX emissions schedule to align with Bitcoin's halving cycle.

**Nakamoto Documentation** — Comprehensive technical documentation on the Nakamoto upgrade and its implications.

---

## Participate in PoX

### As a Stacker

Lock STX tokens to earn Bitcoin rewards:
1. Choose between solo stacking or joining a stacking pool
2. Lock your STX for reward cycles
3. Earn BTC distributed from miners

### As a Miner

Commit Bitcoin to mine Stacks blocks:
1. Run a Stacks mining node
2. Participate in block production
3. Earn STX rewards for successful blocks

### As a Signer

Support network consensus (requires technical expertise):
1. Run a Signer node
2. Validate blocks and maintain network security
3. Participate in the decentralized governance of Stacks

For detailed guides on participation, see the [Operate](../operate/) section.

---

## Looking Forward

Proof of Transfer continues to evolve as Stacks grows:

**Performance Improvements** — Core developers are working toward consistent sub-10 second transaction times, with the goal of making Stacks the fastest Bitcoin L2 while maintaining decentralization and security.

**Stacking Enhancements** — Proposed improvements to simplify the stacking process and increase yields for both individuals and pool operators.

**sBTC Expansion** — Progressive removal of deposit caps, institutional custody integration, and exchange listings to make sBTC widely accessible.

**Data Availability** — Ongoing research into using Bitcoin as a full data availability layer for enhanced verifiability.

These improvements, collectively known as the "Satoshi Upgrades," ensure Stacks remains the leading Bitcoin Layer 2 solution.

---

## Conclusion

Proof of Transfer represents a paradigm shift in how blockchains can leverage Bitcoin's security and capital. By creating economic alignment between Stacks and Bitcoin, PoX enables:

- True Bitcoin-native security through cryptographic anchoring
- Productive use of Bitcoin through stacking yields
- Programmable Bitcoin through smart contracts and sBTC
- A decentralized economy built on the world's most secure blockchain

The Nakamoto upgrade and sBTC launch mark crucial milestones in realizing this vision, bringing us closer to a world where Bitcoin powers not just a store of value, but an entire decentralized economy.

---

## Additional Resources

- [Stacks Whitepaper](https://stacks.org/sbtc-nakamoto) — The Nakamoto Release with sBTC
- [sBTC Documentation](https://www.stacks.co/sbtc) — Complete guide to sBTC
- [Nakamoto Upgrade Details](https://docs.stacks.co/nakamoto-upgrade/) — Technical documentation
- [Stacks Roadmap](https://www.stacks.co/roadmap) — Future development plans
- [Community Forum](https://forum.stacks.org/) — Join the discussion

[Base Learn]: https://base.org/learn
[Block Production]: ../block-production/
[SIPs section]: ../network-fundamentals/sips.md
[Operate]: ../operate/
