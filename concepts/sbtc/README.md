## Introduction to sBTC

sBTC is a SIP-10 token on the Stacks blockchain that represents Bitcoin (BTC) in a 1:1 ratio. It enables Bitcoin holders to utilize their BTC within the Stacks ecosystem, allowing participation in DeFi applications and other smart contract functionalities while maintaining a peg to the underlying Bitcoin.

### Purpose

The primary purpose of sBTC is to bridge the Bitcoin and Stacks ecosystems, providing Bitcoin holders with access to the rich functionality of smart contracts on the Stacks blockchain without sacrificing the security and value of their BTC holdings.

### Key Benefits

1. **Bitcoin Compatibility**: Allows Bitcoin holders to participate in the Stacks ecosystem without selling their BTC.
2. **DeFi Access**: Enables BTC holders to engage with decentralized finance applications on Stacks.
3. **Quick Conversions**: Facilitates rapid movement between BTC and sBTC.
4. **Decentralized Management**: Utilizes a set of signers for maintaining the peg wallet.
5. **Community Governance**: Involves the community in key decisions, such as selecting the initial signing set.

## Key Concepts

Understanding sBTC requires familiarity with several key concepts.

### sBTC

sBTC is a SIP-10 token on the Stacks Blockchain that can be converted back to BTC on the Bitcoin Blockchain. The key property of sBTC is its 1:1 peg to Bitcoin, meaning 1 sBTC is always equivalent to 1 BTC.

### sBTC UTXO

The sBTC UTXO is the single unspent transaction output (UTXO) on the Bitcoin blockchain that holds the entire BTC balance pegged into sBTC. This UTXO is managed and maintained by the sBTC Signers.

### sBTC Signer

In sBTC, the sBTC Signer is a signer entity separate from the Stacks Nakamoto signer. sBTC signer responsibilities include:

- Signing sBTC operations
- Communicating with contracts on the Stacks chain
- Managing the sBTC UTxO

In future version of sBTC, Nakamoto and sBTC signers will be the same entity.

### sBTC Signer Set

The sBTC Signer Set is the group of all sBTC signers. This set has full democratic access to the sBTC UTXO. Key properties include:

- Selected through a community vote weighted by STX holdings
- Responsible for maintaining the security of the peg wallet
- Ability to rotate their private keys for enhanced security

### SIP-10 Token

sBTC adheres to the SIP-10 (Stacks Improvement Proposal 10) standard for fungible tokens on the Stacks blockchain. This ensures compatibility with wallets and applications that support the SIP-10 standard.

Understanding these concepts is crucial for grasping the overall architecture and functionality of sBTC. In the following sections, we'll explore how these concepts come together to create sBTC.

Here's what we'll cover:

1. [Core Features](core-features.md)
2. [sBTC Operations](operations/README.md)
   - [Deposit](operations/deposit.md)
   - [Withdrawal](operations/withdrawal.md)
3. [Peg Wallet UTXO](peg-wallet-utxo.md)
4. [Clarity Contracts](clarity-contracts.md)
5. [Auxiliary Features](auxiliary-features/README.md)
   - [Transaction Fee Sponsorship](auxiliary-features/fee-sponsorship.md)
   - [Signer Wallet Rotation](auxiliary-features/signer-wallet-rotation.md)
6. [Security Considerations](security-considerations.md)
7. [Future Development](future-development.md)
