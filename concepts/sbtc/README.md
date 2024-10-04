## Introduction to sBTC

sBTC is a SIP-10 token on the Stacks blockchain that represents Bitcoin (BTC) in a 1:1 ratio. It enables Bitcoin holders to utilize their BTC within the Stacks ecosystem, allowing participation in DeFi applications and other smart contract functionalities while maintaining a peg to the underlying Bitcoin.

### Purpose

The primary purpose of sBTC is to bridge the Bitcoin and Stacks ecosystems, providing Bitcoin holders with access to the rich functionality of smart contracts on the Stacks blockchain without sacrificing the security and value of their BTC holdings.

### Version

This documentation primarily covers sBTC-v1, which is designed as a builder-first stand-in for a more decentralized version. Future versions (e.g., sBTC-v2) will introduce a more robust, open-network signer set and additional economic incentives for signers to faithfully process transactions.

### Key Benefits

1. **Bitcoin Compatibility**: Allows Bitcoin holders to participate in the Stacks ecosystem without selling their BTC.
2. **DeFi Access**: Enables BTC holders to engage with decentralized finance applications on Stacks.
3. **Quick Conversions**: Facilitates rapid movement between BTC and sBTC.
4. **Decentralized Management**: Utilizes a set of signers for maintaining the peg wallet.
5. **Community Governance**: Involves the community in key decisions, such as selecting the initial signing set.

## Table of Contents

1. [Key Concepts](key-concepts.md)
2. [Core Features](core-features.md)
3. [sBTC Operations](operations/README.md)
   - [Deposit](operations/deposit.md)
   - [Withdrawal](operations/withdrawal.md)
4. [Peg Wallet UTxO](peg-wallet-utxo.md)
5. [Clarity Contracts](clarity-contracts.md)
6. [Auxiliary Features](auxiliary-features/README.md)
   - [Transaction Fee Sponsorship](auxiliary-features/fee-sponsorship.md)
   - [Dynamic Blocklist](auxiliary-features/dynamic-blocklist.md)
   - [Signer Wallet Rotation](auxiliary-features/signer-wallet-rotation.md)
7. [Security Considerations](security-considerations.md)
8. [Future Development](future-development.md)

For developers and contributors, please refer to the [sBTC-v1 GitHub repository](https://github.com/stacks-network/sbtc) for the latest updates and development progress.
