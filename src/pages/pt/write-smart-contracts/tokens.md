---
title: Tokens
description: Learn about token support within Clarity
icon: TestnetIcon
images:
  large: /images/pages/nft/token.png
  sm: /images/pages/nft/token.png
---

## Introduction

A fundamental use of blockchain technology is the representation, store, and transfer of value between users of a blockchain. Cryptocurrency is a very common use of blockchain technology, and remains one of the primary drivers of adoption of blockchain technology. Cryptocurrencies are represented by blockchain tokens: individual units of value within a given blockchain ecosystem. Blockchain tokens can extend beyond just digital currency, however, and recent developments throughout the cryptocurrency community have demonstrated potential for the use of blockchain to tokenize and represent not just money but other tangible assets.

A blockchain token is a digital asset that can be verifiably owned by a user of a blockchain. Blockchain tokens are governed by a set of rules that are defined by either the blockchain itself (in the case of native tokens) or by a smart contract on a blockchain. Rules can vary depending on the nature and the use of the token.

Tokens on a blockchain fall into two general categories, depending on their properties: [fungible][] or [non-fungible][]. The following sections discuss the properties of both types of tokens, and provide information about implementation of the two types of tokens on Stacks.

## Fungible tokens

A core property of any token on a blockchain is fungibility. A fungible token is a token that's mutually interchangable or capable of mutual substitution. In other words, one quantity or part of a fungible token can be replaced by an equal quantity or part of the same fungible token. Fungible tokens are often used to represent real-world fungible assets like currency. The STX token is an example of a fungible token. Other examples include stablecoins, tokens that represent voting rights in a DAO, or tokens that algorithmically track the price of stocks.

Fungible tokens form one of the most important value propositions for blockchain technology, the ability to store value and exchange that value through both internal and external transactions. Because fungible tokens can be divided into smaller parts and recombined into the same value representation, they serve a great utility for transferring value between blockchain users.

The primary fungible token on the Stacks blockchain is the native token, STX. Because the Stacks blockchain allows for the creation of [smart contracts][], other fungible tokens can be created on the Stacks blockchain as well. [SIP-010][] specifies the standard for fungible tokens on the Stacks blockchain. This specification defines the functions and traits that a fungible token on Stacks _must_ have. By complying with this standard, fungible tokens on Stacks can be easily represented by wallets that support Stacks.

### Understanding the fungible token standard

The [SIP-010][] standard is an interface definition that allows Stacks applications and wallets to interact with fungible tokens in a standard way. Supporting the standard reduces complexity for token creators to get their tokens into the ecosystem. Under the [SIP-010][] standard, fungible tokens must have the following characteristics:

- Ability to transfer a specified amount of the token to a recipient (`transfer`). The recipient is required to be a Stacks principal.
- Ability to obtain the human-readable name of the token (`get-name`).
- Ability to obtain a short name (ticker symbol) for the token (`get-symbol`).
- Ability to get the number of decimals in the token representation (`get-decimals`). This is used to construct a representation of the token that humans would be familiar dealing with. For example, the US dollar has 2 decimals, if the base unit is cents.
- Ability to get the balance of the token for a particular Stacks principal (`get-balance-of`).
- Ability to get the total supply of the token (`get-total-supply`).
- A URI to metadata associated with the token (`get-token-uri`). This can resolve to off-chain metadata about the token or contract, such as an image icon for the token or a description.

### Examples of fungible tokens on Stacks

- [Nothing](https://nothingtoken.com/) ([contract](https://explorer.stacks.co/txid/0x022bed728d648ff1a68036c40f3aff8136ee22fee18380731df0ab9d76d3c4a9?chain=mainnet))

## Non-fungible tokens (NFTs)

Non-fungible tokens (NFTs) are a type of token that are not interchangeable. NFTs have unique traits (usually in the form of attached metadata) that restrict the abillity to replace them with identical tokens. An NFT is a token that is unique, such as a piece of art, or ownership rights to a real-world asset such as a house.

NFTs alone don't have an inherent value, like a currency. The value of an NFT is derived from the assets that the NFT represents. The use of NFTs are myriad, including digital art, collectibles, domain names, and representation of ownership of content rights. NFTs can be used as digital certificates that track the authenticty of real world items, or digitize the ownership rights to property.

As with fungible tokens, NFTs on the Stacks blockchain are created with [smart contracts][]. [SIP-009][] specifies the standard for NFTs on the Stacks blockchain. This specification defines the functions and traits that an NFT _must_ have, but most NFTs have more functions or traits attached than those solely described by the specification. By complying with this standard, non-fungible tokens on Stacks can be easily represented by wallets that support Stacks.

### Understanding the non-fungible token standard

The [SIP-009][] standard is an interface definition that the Stacks ecosystem aligned on. With support for this standard across wallets and tools, it becomes easy to interact with NFTs. Under the [SIP-009][] standard, NFT contract must have the following characteristics:

- Ability to obtain the last token identifier (`get-last-token-id`). This id represents the upper limit of NFTs issued by the contract.
- A URI to metadata associated with a specific token identifier. (`get-token-uri`). This URI could resolve to a JSON file with information about the creator, associated media files, descriptions, signatures, and more.
- Ability to verify the owner for a given token identifier (`get-owner`). The owner resolves to a [Stacks principal](/write-smart-contracts/principals).
- Ability to transfer an NFT to a recipient (`transfer`). The recipient is required to be a Stacks principal.

### Examples of NFTs on Stacks

- [This is #1](https://thisisnumberone.com) ([contract](https://explorer.stacks.co/txid/SP3QSAJQ4EA8WXEDSRRKMZZ29NH91VZ6C5X88FGZQ.thisisnumberone-v2?chain=mainnet))

## Further reading

- [The Difference Between Fungible and Non-Fungible Tokens](https://101blockchains.com/fungible-vs-non-fungible-tokens/)
- [Explain It Like I Am 5: NFTs](https://messari.io/article/explain-it-like-i-am-5-nfts)

[fungible]: #fungible-tokens
[non-fungible]: #non-fungible-tokens-nfts
[smart contracts]: /write-smart-contracts/overview
[SIP-010]: https://github.com/hstove/sips/blob/feat/sip-10-ft/sips/sip-010/sip-010-fungible-token-standard.md
[SIP-009]: https://github.com/friedger/sips/blob/main/sips/sips/sip-009-nft-standard.md
