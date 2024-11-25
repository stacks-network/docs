# Clarity Contracts

This graph summarizes the overall of the Clarity portion of the sBTC protocol.

Throughout this section, we'll expand on each contract and its functionality.

<figure><img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXe6LEEESrk6Az-iRR5ZeEuqOQvBESKtFvBIjSYPhAjLZ2LpEwM-UOnSWn4b6hFFv0uFnysxL6wO-BVgJaPTAdYUkbvBenJrY8rY-YrGT9CSwqdCl2kuS5ZhNheumR-yBPAOHtccAt1eOD4dU5Zi-14gBgwv?key=uPKXlfIDnNUlnyka_NtgIw" alt=""><figcaption></figcaption></figure>

### sBTC Clarity Contracts

At a high level, the sBTC Clarity contracts are responsible for the following:

#### sbtc-bootstrap signers

Core contract for meta signer functionality such as registration & the rotation process.

#### sbtc-deposit

Processing contract called by the signers to record a consumed Bitcoin transaction & mint some amount of sBTC to a principal contained in the payload.

#### sbtc-registry

State storage for maintaining upgradability across protocol.

#### sbtc-withdrawal

Interaction points for users and signers to update withdrawal request state.

### User Types

In addition to the contracts themselves, there are two main user types that will interact with these contracts.

#### Signer

A signer that is part of the current sBTC signer set. More information on signers and their role in sBTC can be found in the [Signer Process Walkthrough](../walkthroughs/signer-process.md).

#### Wallet

A participant in the Stacks/Bitcoin ecosystem that wants to deposit/withdraw/use sbtc.
