---
title: Stacking Flows
description: Stacking flows in Nakamoto
sidebar_label: Stacking Flows
sidebar_position: 5
---

In Nakamoto, stacking flows have significant changes in comparison to previous versions of Stacks. Because Nakamoto requires stackers to run a signer, which validates blocks produced by Stacks miners, stackers need to provide new information when making Stacking transactions.

These changes affect both solo Stacking and delegated Stacking. This document intends to outline the new flows for both cases, so that we can better understand what Stackers need to do to Stack in Nakamoto.

## Definitions

- Stacker: an entity locking their STX to receive PoX rewards. This is a broad term including solo Stackers and Stackers who use pools.
- Solo stacker: an entity that locks their own STX and runs a signer. They don’t receive delegation.
- Delegator: a stacker who locks their STX and delegates to a signer. They don’t run the signer.
- Delegatee: an entity that runs a Signer and allows others to delegate their STX to them. A delegatee doesn’t need to Stack their own STX, but they can.
- Signer: an entity that runs the stacks-signer software and participates in block validation. This can be either a solo Stacker an entity receiving delegated STX. In many cases we also refer to “signer” as the software that validates blocks. We may want to try and improve this language to be more clear.

## First, run a signer

This is a necessary prerequisite to stacking.

Running a signer involves setting up a hosted production environment that includes both a Stacks Node and the Stacks Signer. For more information, refer to [how to run a signer](./signer.md).

Once the signer software is running, the signer needs to keep track of the `stacks_private_key` that they used when configuring their signer. This will be used in subsequent Stacking transactions.

## Signer keys and signer key signatures

The main difference with Stacking in Nakamoto is that the Signer (either solo Stacker or signer running a pool) needs to include two new parameters in their Stacking transactions:

1. `signer-key`: the public key that corresponds to the `stacks_private_key` their signer is using
2. `signer-signature`: a signature that demonstrates that this Stacker actually controls their `signer-key`. Because signer keys need to be unique, this is also a safety check to ensure that other Stackers can’t use someone else’s public key.

## Generating a signer key signature

The `signer-signature` uses the signer’s Stacks private key and creates a signature over the message (`pox-address`, `reward-cycle`), `where pox-address` is the BTC address used for rewards, and `reward-cycle` is the current reward cycle.

The exact user experiences for generating the `signer-signature` is to be determined, but there are two high-level processes that can be expected:

1. Using the stacks-signer or other CLI, via a command like `stacks-signer generate-stacking-signature {pox-address} {reward-cycle}`.
2. Using an application like a wallet or a web app. The signature is designed such that Stackers can use pre-existing standards for signing data with a wallet like [Leather](https://leather.io/) and [XVerse](https://www.xverse.app/). Stackers can also use hardware wallets to create this signature.

Solo Stackers will likely generate their signature as a first step while making their Stacking transaction.

### Using a hardware or software wallet to generate signatures

When the signer is configured with a `stacks_private_key`, the signer may want to be able to use that key in a wallet to make stacking signatures.

If the signer uses a tool like [@stacks/cli](https://docs.hiro.so/get-started/command-line-interface) to generate the key, the CLI also outputs a mnemonic (aka “seed phrase”) that can be imported into a wallet. Because the Stacks CLI uses the standard derivation path for generating Stacks keys, any Stacks wallet will default to having that same private key when the wallet is imported from a derivation path. Similarly, if a hardware wallet is setup with that mnemonic, then the Signer can use a wallet like Leather to make stacking signatures.

The workflow for using a setting up a wallet to generate signatures would be:

1. Use @stacks/cli to generate the keychain and private key.
   1. Typically, when using a hardware wallet, it’s better to generate the mnemonic on the hardware wallet. For this use case, however, the signer software needs the private key, and hardware wallets (by design) don’t allow exporting private keys.
2. Take the `privateKey` from the CLI output and add it to your signer’s configuration.
3. Take the mnemonic (24 words) and either:
   1. Setup a new hardware wallet with this mnemonic
   2. Store it somewhere securely, like a password manager. When the signer needs to generate signatures for Stacking transactions, they can import it into either Leather or XVerse.

When the user needs to generate signatures:

1. Setup your wallet with your signer key’s private key. Either:
   1. Setup your Leather wallet with a Ledger hardware wallet
   2. Import your mnemonic into Leather, XVerse, or another Stacks wallet
2. Open an app that has stacking signature functionality built-in
3. Connect your wallet to the app (aka sign in)
4. In the app, enter your PoX address and “submit”
5. The app will popup a window in your wallet that prompts you to sign the information
   1. The app will show clear information about what you’re signing
6. Create the signature
   1. If using a Ledger, confirm on your device
7. The app will display two results:
   1. Your signer key, which is the public key associated with your signer’s key
   2. Your signer signature
8. Finally, make a Stacking transaction using the signer key and signer signature.

## Solo Stacking

### Call the function `stack-stx`

Just like in previous versions of PoX, Stackers call `stack-stx`, but with the new arguments added in Nakamoto. The arguments are:

- Amount
- PoX Address: the BTC wallet to receive Stacking rewards
- Start burn height: the current BTC block height
- Lock period: the number of cycles to lock for (1 minimum, 12 max)
- Signer key: the public key that their signer is using
- Signer signature: the signature that proves control of this signer key

### Act as a signer

In the “prepare phase” before the next stacking cycle (100 blocks), the exact set of Stackers will be selected based on the amount of STX stacked. Just like in previous versions of PoX, each Stacker will have some number of reward slots based on the amount of STX locked.

It is critical that Stackers have their signer running during this period. The prepare phase is when distributed key generation (DKG) occurs, which is used when validating blocks by signers.

In general, Stackers don’t need to do anything actively during this period, other than monitoring their Signer to ensure it’s running properly.

### Extending their stacking period

Just like in the current version of PoX, Stackers can extend their lock period while still Stacking. The function called is `stack-extend`.

Stackers can “rotate” their signing key when extending their lock period.

The arguments are:

- Extend count: the number of cycles to add to their lock period. The resulting lock period cannot be larger than 12. For example, if currently locked with 6 cycles remaining, the maximum number they can extend is 6.
- Pox Address: the BTC address to receive rewards
- Signer public key: the public key used for signing. This can stay the same, or the Stacker can use a new key.
- Signer signature: a signature proving control of their signing key

## Delegated stacking

Similar to the changes to solo Stacking, the big difference for delegation flows is the inclusion of signer keys and signatures. Because signers need to make transactions to “finalize” a delegation, these new arguments add new complexities to the signer.

### Delegator initiates delegation

The first step, where the delegator sets up their delegation to a signer, is to call `delegate-stx`. The arguments here are unchanged:

- Amount
- Delegate to: the STX address of the signer they’re delegating to. Note that this is different from the “signer key” used. Instead, this is the STX address that is used to make PoX transactions.
- Until burn height: an optional argument where the delegation expires
- Pox Address: an option BTC address that, if specified, the signer must use to accept this delegation

### Signer “activates” the delegation

Just as in the current PoX contract, the signer calls `delegate-stack-stx` to commit the delegator’s STX. The arguments are:

- Stacker: the STX address of the delegator
- Amount
- Pox Address
- Start burn height
- Lock period: number of cycles to lock for. If the delegator provided the until burn height argument, then the end of these cycles cannot be past the expiration provided.

This step also allows the Signer to proactively choose which Stackers they’ll accept delegation from. For “closed” pools, the signer will only call this function for approved Stackers. It is up to each signer who runs a closed pool to implement this process, but tooling will likely be created to make this easier.

This step can happen for many Stackers before going to the next step.

### Signer “commits” delegated STX

At this point, the STX are committed to the signer, and the signer has some “aggregate balance” of committed STX. The signer is not actually eligible for rewards and signer slots until this step is called.

The signer cannot call this until the total number of STX committed is larger than the minimum threshold required to Stack. This threshold is a function of the total number of liquid STX. At the moment, the threshold is 90,000 STX.

Once the threshold is reached, the signer calls `stack-aggregation-commit`. This is the point where the signer must provide their signer key and signer key signature. The arguments are:

- Pox Address
- Reward-cycle: the current reward cycle
- Signer key: the public key of their signer
- Signer signature

Once this succeeds, the signer is eligible for reward slots. The number of reward slots depends on the amount of STX committed to this signer. Even if the signer commits more than the “global minimum”, the minimum amount to receive a slot depends on the amount of STX locked for each cycle. For example, in the current PoX cycle, that amount is 110,000 STX.

To act as a signer, each step up to this point must be taken before the prepare phase of the next cycle begins. It is crucial that the signer software is running.

### Signer increases amount committed

Even after the signer commits to a certain amount of STX in the previous step, the signer can increase this amount once more delegations are received. The initial steps must be taken for each Stacker (`delegate-stx` and then `delegate-stack-stx`), and then `stack-aggregation-increase` can be called.

### The need for a separate “Delegate Private Key”

The concept of the “signer key” or “signer private key” was introduced earlier in this document. The signer key is used during consensus mechanisms to sign blocks in Nakamoto.

Signers using delegation also need a separate keychain to make Stacking transactions such as `delegate-stack-stx` listed earlier. They need a separate key because they need to have the ability to rotate their signer key when necessary. The PoX contract is designed to support rotating the signer key without needing their Stackers to un-stack and re-stack later. You cannot rotate a delegate key without needing to wait for all delegated Stackers to un-stack and finally re-stack to the new delegate address.

Because of this limitation of being unable to rotate delegate addresses, it’s highly recommended to have a separate delegate key. The benefit of a separate delegate key is that it can easily be used in existing wallets, including hardware wallets.

## Tooling for Stackers

The exact tooling that will be available for both solo and delegated stacking is still in the works, but several options are being explored including:

- CLI tooling
- Web apps
- BTC native multi-sigs
