# Key Concepts

Understanding sBTC requires familiarity with several key concepts:

## sBTC

sBTC is a SIP-10 token on the Stacks Blockchain that can be converted back to BTC on the Bitcoin Blockchain. The key property of sBTC is its 1:1 peg to Bitcoin, meaning 1 sBTC is always equivalent to 1 BTC.

## sBTC Operation

An sBTC operation is any action initiated within the sBTC protocol. The two primary operations are:

- Depositing BTC to mint sBTC
- Withdrawing sBTC to receive BTC

## sBTC UTxO

The sBTC UTxO is the single unspent transaction output (UTxO) on the Bitcoin blockchain that holds the entire BTC balance pegged into sBTC. This UTxO is managed and maintained by the sBTC Signers.

## sBTC Bootstrap Signer

In sBTC-v1, the sBTC Bootstrap Signer Set is an entity separate from the Stacks Nakamoto signer. sBTC signer responsibilities include:

- Signing sBTC operations
- Communicating with contracts on the Stacks chain
- Managing the sBTC UTxO

This role is specific to sBTC-v1. In future version of sBTC, Nakamoto and sBTC signers will be the same entity.

## sBTC Bootstrap Signer Set

The sBTC Bootstrap Signer Set is the group of all sBTC signers. This set has full democratic access to the sBTC UTxO. Key properties include:

- Selected through a community vote weighted by STX holdings
- Responsible for maintaining the security of the peg wallet
- Ability to rotate their private keys for enhanced security

## SIP-10 Token

sBTC adheres to the SIP-10 (Stacks Improvement Proposal 10) standard for fungible tokens on the Stacks blockchain. This ensures compatibility with wallets and applications that support the SIP-10 standard.

Understanding these concepts is crucial for grasping the overall architecture and functionality of sBTC. In the following sections, we'll explore how these concepts come together to create sBTC.
