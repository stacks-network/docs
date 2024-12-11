# Clarity Contracts

### Deployed Testnet Contracts

* [sbtc-registry](https://explorer.hiro.so/txid/0xfa96a73673a97e803c7c1039f9bcf290d9727b0dfaa990f8e52fd81448bb4d09?chain=testnet)
* [sbtc-token](https://explorer.hiro.so/txid/0x6b42a28d249045fc710a83c7cb542e73688f3e16c5b1bdb0be896f33388365f1?chain=testnet)
* [sbtc-deposit](https://explorer.hiro.so/txid/0xa9cfdfafd575f2594e20d39c604ff54e2fc50cfb09024c90dbedcedae5b963ba?chain=testnet)
* [sbtc-withdrawal](https://explorer.hiro.so/txid/0x9699d61100efb8c127674830cf65c3bb44b4497700a59a2688bb3cc2c52297eb?chain=testnet)
* [sbtc-bootstrap signers](https://explorer.hiro.so/txid/0x15ef8164c493401109b75a654cbd1c3a2a4780ae061e510e52e47bd7863d5c53?chain=testnet)

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
