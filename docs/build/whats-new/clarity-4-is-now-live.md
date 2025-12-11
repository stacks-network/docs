---
description: November 18, 2025
---

# Clarity 4 is now LIVE!

SIP-033 and SIP-034 have officially activated at Bitcoin block 923222 – bringing Clarity 4 live on Stacks, the smart contract layer secured by Bitcoin.

This upgrade introduces Version 4 of the Clarity smart contract language, marking a major step forward for the Stacks ecosystem. For users, it delivers safer, smarter contracts with enhanced built-in protections.

For builders, it unlocks five powerful new functions that make developing secure, flexible, and Bitcoin-native DeFi applications easier than ever.

### What Clarity 4 Means for Bitcoin Builders

#### 1. On-chain Contract Verification

Developers can now fetch the hash of another contract’s code body.

[`contract-hash?`](https://docs.stacks.co/reference/clarity/functions#contract-hash)

This makes it possible for one contract to verify that another follows a specific template before interacting with it – a major step toward safer, more trustless bridges and marketplaces that can support a wider range of assets.

#### 2. Allowing Contracts to Set Post-Conditions

New functions allow contracts to set post-conditions that protect their assets.

[`restrict-assets?`](https://docs.stacks.co/reference/clarity/functions#restrict-assets)

This means a contract can safely call external contracts (such as traits) and automatically roll back any changes if the executed code moves assets beyond what’s allowed.

#### 3. Convert Simple Values into ASCII Strings

Clarity 4 adds a function to convert simple values like booleans or principals into ASCII strings.

[`to-ascii?`](https://docs.stacks.co/reference/clarity/functions#to-ascii)

This makes it easier to generate readable, string-based messages – a useful tool for developers building cross-chain features and integrations.

#### 4. Get the Timestamp of the Current Block

A new keyword lets developers retrieve the timestamp of the current block.

[`stacks-block-time`](https://docs.stacks.co/reference/clarity/keywords#stacks-block-time)

This addition enables time-based logic in smart contracts – an essential capability for building features like yield schedules, lockups, or expiration conditions in DeFi applications.

#### 5. Native Passkey Integration

Clarity 4 introduces a new function enabling on-chain verification of secp256r1 signatures.

[`secp256r1-verify`](https://docs.stacks.co/reference/clarity/functions#secp256r1-verify)

This lays the groundwork for passkey-based authentication, opening the door to features like hardware-secured wallets and biometric transaction signing.

#### 6. Dimension-specific Tenure Extensions

The SIP-033 vote also included technical rider SIP-034, which introduces dimension-specific tenure extensions. Signers can approve resets to one budget dimension (e.g., read-count) without resetting the others, allowing high-throughput workloads even when the cost model is pessimistic.

### Why This Matters for Bitcoin

Clarity 4 strengthens Stacks' position as Bitcoin's liquidity layer by giving developers the tools to build more sophisticated Bitcoin DeFi applications – all secured by Bitcoin through Stacks' Proof of Transfer mechanism.

Whether you're building Bitcoin lending protocols, yield products with sBTC, or the next generation of BTCFi applications, Clarity 4 delivers the security and functionality Bitcoin capital markets demand.

Check out [the full SIP-033](https://github.com/stacksgov/sips/pull/218) & [SIP-034](https://github.com/314159265359879/sips/blob/9b45bf07b6d284c40ea3454b4b1bfcaeb0438683/sips/sip-034/sip-034.md) specifications.

***

#### Additional Resources

* \[[Hiro Youtube](https://youtu.be/oJgacfc7YVk?si=b72bNicdS8NjUpml)] A Dev N' Tell with Brice on new Clarity 4 features
