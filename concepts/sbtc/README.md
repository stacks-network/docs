## Introduction to sBTC

sBTC is a SIP-010 token on the Stacks blockchain that represents Bitcoin (BTC) in a 1:1 ratio. It enables Bitcoin holders to participate in DeFi applications and other smart contract functionalities while maintaining a peg to the underlying Bitcoin.

### Purpose

The primary purpose of sBTC is to bridge Bitcoin to DeFi via the Stacks blockchain, providing Bitcoin holders with access to the rich functionality of smart contracts without sacrificing the security and value of their BTC holdings.

### Key Benefits

1. **Bitcoin Compatibility**: Allows Bitcoin holders to participate in the Stacks ecosystem without selling their BTC.
2. **Quick Conversions**: Facilitates rapid movement between BTC and sBTC (within 3 Bitcoin blocks for deposit, 6 for withdrawal).
3. **Decentralized Management**: Initially utilizes a set of 15 community-chosen signers for maintaining the peg wallet.
4. **Community Governance**: Involves the community in key decisions, such as selecting the initial signing set.

## Key Concepts

Understanding sBTC requires familiarity with several key concepts:

### sBTC

sBTC is a [SIP-010](https://github.com/stacksgov/sips/blob/main/sips/sip-010/sip-010-fungible-token-standard.md) token on the Stacks Blockchain that can be converted back to BTC on the Bitcoin Blockchain. The key property of sBTC is its 1:1 peg to Bitcoin, meaning 1 sBTC is always equivalent to 1 BTC.

### sBTC UTXO

The sBTC UTXO is the single unspent transaction output (UTXO) on the Bitcoin blockchain that holds the entire BTC balance pegged into sBTC. This UTXO is managed and maintained by the set of sBTC Signers.

### sBTC Signer

In sBTC, the sBTC Signer is a signer entity separate from the Stacks Nakamoto signer. sBTC signer responsibilities include:

- Signing sBTC operations
- Communicating with the sBTC contracts on the Stacks chain
- Managing the sBTC UTXO

### sBTC Signer Set

The sBTC Signer Set is the group of all sBTC signers. This set has full democratic access to the sBTC UTXO and is responsible for maintaining the security of the peg wallet. The signers also have the ability to rotate their private keys for enhanced security.

### Emily API

Emily is an API that helps facilitate and supervise the sBTC Bridge in addition to serving as a programmatic liaison between sBTC users and signers.

### SIP-010 Token

sBTC adheres to the [SIP-010](https://github.com/stacksgov/sips/blob/main/sips/sip-010/sip-010-fungible-token-standard.md) standard for fungible tokens on the Stacks blockchain. This ensures compatibility with wallets and applications that support the SIP-010 standard.

Understanding these concepts is crucial for grasping the overall architecture and functionality of sBTC. In the following sections, we'll explore how these concepts come together to create sBTC.
