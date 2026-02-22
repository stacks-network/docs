# Tokens

<div data-with-frame="true"><figure><img src="../.gitbook/assets/image (19).png" alt=""><figcaption></figcaption></figure></div>

### STX

Stacks (STX) tokens are the native tokens on the Stacks network. The smallest fraction is one micro-STX: 1,000,000 micro-STX make one Stacks (STX). STX amounts should be stored as integers (8 bytes long), and represent the amount of micro-STX.

STX is central to the consensus mechanism of the Stacks Bitcoin layer, discussed below, and is essential for two key goals: (i) it incentivizes mining of Stacks blocks with a “new block subsidy,” which is critical since transaction fees are not enough to sustain a ledger at least in the early days (as is the case with Bitcoin itself), and (ii) it serves as a liveness incentive and the basis for the economically secured decentralized Bitcoin peg.

<details>

<summary>Why Does Stacks Need a Token?</summary>

This brings us to a central philosophical conversation in the world of crypto and Bitcoin, whether or not blockchains need tokens. Let's start by looking at the fundamental reason why tokens exist: to fund the maintenance and forward progress of a blockchain.

Bitcoin is a token. It is a cryptocurrency that is used to incentivize miners to add new blocks to the chain. In Bitcoin's case, mining rewards are set on a predefined schedule, and once those mining rewards run out, the chain will need to survive on transaction fees alone.

The purpose of a blockchain is to have a permanent historical record of every transaction that has ever occurred on the chain. Blockchains are basically ledgers. The token aspect is used as an incentive mechanism to secure and maintain the chain.

This is why networks like Lightning and other P2P networks don't need tokens, they don't need to maintain a historical record. Channel-based solutions like Lightning rely on users opening 2-of-2 multisigs with each other. Once those channels are closed, the state disappears. When we are talking about a system that is supposed to maintain a global financial system, it is important for the maintenance of that system to be incentivized correctly.

Let's look at this concept in the context of Stacks and its goals. Stacks seeks to provide smart contract functionality to Bitcoin, to serve as the programming rails for building a decentralized economy on top of Bitcoin.

Many Bitcoin community members are skeptical of new tokens and rightly so. There are countless projects out there that force the use of a token on their project and in many cases a token is actually not needed. The Stacks project was started by Bitcoin builders who have a long history of building apps & protocols on Bitcoin L1 without any token (e.g., BNS launched in 2015 on Bitcoin L1 which was one of the largest protocols using OP\_RETURN on Bitcoin L1). So why did a bunch of Bitcoin builders decide to have a separate token for Stacks L2? Great question! Let's dig into the details.

The Stacks token (STX) is primarily meant to be used for two things:

1. **Incentives for Stacks L2 miners**: Newly minted STX are used to incentivize decentralized block production on Stacks L2.
2. **Incentives for peg-out signers**: Signers participating in peg-out operations receive incentives in STX to economically align them with protocol rules.

The only way to remove the token is to build Stacks as a federated network like Liquid. In a federation the pre-selected group of companies control the mining and block production and a pre-selected group of companies need to be trusted for peg-out transactions.

Stacks developers wanted to design an open and permissionless system. The only way to have a decentralized mining process is through incentives. As mentioned above, this is how Bitcoin works as well, where newly minted BTC are used as incentives to mine new blocks and anyone in the world can decide to become a miner. Anyone with BTC can mine the Stacks L2 chain, it is open and permissionless.

Similarly, the way sBTC is designed is that the group of signers is open and permissionless (unlike a federation). These signers have economic incentives to correctly follow the protocol for peg-out requests. In a federation, users need to blindly trust the pre-set federation members to get their BTC out of the federation and back on Bitcoin L1. Stacks developers wanted to have an open, permissionless, and decentralized way to move BTC from Bitcoin L1 to Stacks L2 and back. This is made possible through economic incentives i.e., need for a token.

Other than these two reasons, STX is also used to pay gas fees for transactions. However, once the upcoming sBTC peg is live most of the economy of Stacks L2 is expected to follow a Bitcoin standard and work using BTC as the economic unit. It is expected that users will mostly interact just with Bitcoin and use BTC in wallets and apps (gas fees can be paid with BTC using atomic swaps in the background). It is important to note that BTC cannot be used for mining incentives on Stacks L2 because the only way to incentivize decentralized block production is through newly minted assets by the protocol (similar to how Bitcoin works itself) i.e., need for a token.

</details>

<a href="https://youtu.be/Khfl50J7v6s?si=AkG2x9VIWsrCUoSL" class="button primary">How to get STX</a>

### sBTC

sBTC is a decentralized, trust-minimized two-way Bitcoin peg between Bitcoin and the Stacks\
blockchain. Implemented as a SIP-010 compliant fungible token on Stacks, sBTC enables\
Bitcoin holders to securely represent their BTC as tokens on the Stacks chain without relying\
on a single trusted entity. This bridge allows Bitcoin to be seamlessly integrated into the Stacks\
ecosystem, significantly expanding Bitcoin’s utility through programmable smart contracts\
while maintaining its fundamental security properties.

<a href="../sbtc/" class="button primary">Learn more about sBTC</a>

### SIP-010 Fungible Tokens

[SIP-010](https://github.com/stacksgov/sips/blob/main/sips/sip-010/sip-010-fungible-token-standard.md) is the standard for defining fungible tokens on Stacks. Defining a common interface (known in Clarity as a "trait") allows different smart contracts, apps, and wallets to interoperate with fungible token contracts in a reusable way.

<a href="https://app.gitbook.com/s/Zz9BLmTU9oydDpL3qiUh/get-started/create-a-token/fungible-tokens" class="button primary">Create a fungible token</a>

### SIP-009 Non-Fungible Tokens

[SIP-009](https://github.com/stacksgov/sips/blob/main/sips/sip-009/sip-009-nft-standard.md) is the standard for defining fungible tokens on Stacks. Defining a common interface (known in Clarity as a "trait") allows different smart contracts, apps, and wallets to interoperate with non-fungible token contracts in a reusable way. Its primary purpose is to ensure that NFTs are composable and different tools know how to interact with them.

<a href="https://app.gitbook.com/s/Zz9BLmTU9oydDpL3qiUh/get-started/create-a-token/non-fungible-tokens" class="button primary">Create a non-fungible token</a>

### SIP-013 Semi-Fungible Tokens

Semi-fungible tokens (SFTs) are a hybrid token structure that embraces parts of both FTs (fungible tokens) and NFTs. SFTs are interchangeable (like FTs) and can be traded between users like cash—1 SFT has the same value as another SFT in the same collection. But each SFT also has a unique identifier (like NFTs).

[SIP-013](https://github.com/stacksgov/sips/blob/main/sips/sip-013/sip-013-semi-fungible-token-standard.md) is the standard for defining semi-fungible tokens on Stacks. Defining a common interface (known in Clarity as a "trait") allows different smart contracts, apps, and wallets to interoperate with semi-fungible token contracts in a reusable, standard way.

<a href="https://app.gitbook.com/s/Zz9BLmTU9oydDpL3qiUh/get-started/create-a-token/semi-fungible-tokens" class="button primary">Create a semi-fungible token</a>
