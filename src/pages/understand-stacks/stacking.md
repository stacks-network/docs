---
title: Understand Stacking
description: Introduction to the reward mechanism of Proof-of-Transfer
images:
  sm: /images/pages/stacking-rounded.svg
---

## Introduction

Stacking rewards Stacks (STX) token holders with bitcoin for providing a valuable service to the network by locking up their tokens for a certain time.

Stacking is a built-in action, required by the "proof-of-transfer" (PoX) mechanism. The PoX mechanism is executed by every miner on the Stacks 2.0 network.

-> The Stacking consensus algorithm is implemented as a smart contract, using [Clarity](/write-smart-contracts/overview). [Read more about the contract](#stacking-contract).

## Stacking flow

The Stacking mechanism can be presented as a flow of actions:

![stacking flow](/images/stacking-illustration.png)

1. Make API calls to get details about the upcoming reward cycle
2. For a specific Stacks account, confirm eligibility
3. Confirm the BTC reward address and the lockup duration
4. The transaction is broadcasted and the Stacks (STX) tokens will be locked-up. This needs to happen before the prepare phase of the next reward cycle (last 100 bitcoin blocks of the ongoing reward phase)
5. The Stacking mechanism executes reward cycles and sends out rewards to the set BTC reward address
6. During the lockup period, details about unlocking timing, rewards and more can be obtained
7. Once the lockup period is passed, the tokens are released and accessible again
8. Display reward history, including details like earnings for previous reward cycles

-> Keep in mind that the target duration for a reward cycles is ~2 weeks. This duration is based on the target block time of the network (10 minutes) and can be higher at times due to [confirmation time variances](https://www.blockchain.com/charts/median-confirmation-time) of the bitcoin network.

If you would like to implement this flow in your own wallet, exchange, or any other application, please have a look at this tutorial:

[@page-reference | inline]
| /understand-stacks/integrate-stacking

[@page-reference | inline]
| /understand-stacks/stacking-using-CLI

## Stacking delegation flow

The Stacking flow is different for delegation use cases:

![stacking flow](/images/stacking-delegation-illustration.png)

- Before Stacking can be initiated for a token holder, the delegator needs to be granted permission to Stack on behalf of the account owner. The permission is restricted to the maximum amount the delegator is allowed to Stack. The maximum amount is not limited by the available funds and can be set much higher. An account can only be associated with one single delegator
- The account has to define the delegation relationship. They can optionally restrict the Bitcoin reward address that must be used for payouts, and the expiration burn block height for the permission, thus limiting the time a delegator has permission to Stack
- Delegators have to lock Stacks from different accounts ("pooling phase") until they reach the minimum amount of Stacks required to participate in Stacking
- Once a delegator locks enough STX tokens, they can finalize and commit their participation in the next reward cycle(s)
- Certain delegation relationships may allow the STX holder to receive the payout directly from the miner (step 5/6)
- The termination of the delegation relationship can either happen automatically based on set expiration rules or by actively revoking delegation rights

If you would like to implement this flow in your own wallet, exchange, or any other application, please have a look at this tutorial:

[@page-reference | inline]
| /understand-stacks/integrate-stacking-delegation

## PoX mining

PoX mining is a modification of Proof-of-Burn (PoB) mining, where instead of destroying the committed Bitcoin, it is transferred to eligible Stacks (STX) holders that participate in the Stacking protocol.

-> A PoX miner can only receive newly minted Stacks (STX) tokens when they transfer bitcoin to eligible owners of Stacks (STX) tokens

Miners have to run a software (mining client, aka "miner") on their machines to participate in the PoX mechanism. The mining client implements the PoX mechanism, which ensures proper handling and incentives through four key phases:

- Registration: Miners register for a future election by sending consensus data to the network
- Commitment: Registered miners transfer bitcoin to participate in the election. Committed bitcoin are sent to a set eligible Stacks (STX) tokens holders
- Election: A verifiable random function chooses one miner to write a new block on the Stacks blockchain
- Assembly: The elected miner writes the new block and collects rewards in form of new Stacks (STX) tokens

[@page-reference | inline]
| /start-mining

## Token holder eligibility

Stacks (STX) token holders do not automatically receive Stacking rewards. Instead, they must:

- Commit to participation before a reward cycle begins
- At the time of writing: Hold ~70,000 Stacks (STX) tokens - or pool with others to reach the minimum
- Lock up Stacks (STX) tokens for a specified period
- Set a supported Bitcoin address to receive rewards (native segwit is not supported)

Token holders will have a variety of providers and tools to support their participation in Stacking. Current providers, including 1-click options, pools, and more can be found [here](https://stacks.org/stacking#earn).

## Stacking consensus algorithm

Stacking is a built-in capability of PoX and is realized through a set of actions on the Stacks 2.0 network. The full implementation details can be found in [SIP-007](https://github.com/blockstack/stacks-blockchain/blob/develop/sip/sip-007-stacking-consensus.md). Below is a summary of the most relevant actions of the algorithm.

- Progression in Stacking consensus happens over reward cycles (with a fixed length). In each reward cycle, a set of Bitcoin addresses are iterated over
- A reward cycle consists of two phases: prepare and reward
- During the prepare phase, miners decide on an anchor block and a reward set. Mining any descendant forks of the anchor block requires transferring mining funds to the appropriate reward addresses. The reward set is the set of Bitcoin addresses which will receive funds in the reward cycle
- Miners register as leader candidates for a future election by sending a key transaction that burns cryptocurrency (proof-of-burn). The transaction also registers the leader's preferred chain tip (must be a descendant of the anchor block) and commitment of funds to 2 addresses from the reward set
- Token holders register for the next rewards cycle by broadcasting a signed message that locks up associated Stacks (STX) tokens for a protocol-specified lockup period, specifies a Bitcoin address to receive the funds, and votes on a Stacks chain tip
- Multiple leaders can commit to the same chain tip. The leader that wins the election and the peers who also burn for that leader collectively share the reward, proportional to how much each one burned
- Token holders' locked up tokens automatically unlock as soon as the lockup period is completed

## Stacking contract

Check out the [Stacking contract reference](/references/stacking-contract) to see available methods and error codes.

## Bitcoin address

!> You must provide a BTC address in one of two formats: [Legacy (P2PKH)](https://en.bitcoin.it/wiki/Transaction#Pay-to-PubkeyHash), which starts with "1". Or, [Segregated Witness / Segwit (P2SH)](https://en.bitcoin.it/wiki/Pay_to_script_hash), which starts with "3". The "Native Segwit" format (which starts with “bc1”), for example, is not supported.

The Stacking contract needs a special format for the bitcoin address (the reward address). This is required in order to ensure that miners will be able to correctly construct the bitcoin transaction containing the reward address.

The address must be specified in the following format using the Clarity language:

```clar
;; a tuple of a version and hashbytes buffer
(pox-addr (tuple (version (buff 1)) (hashbytes (buff 20))))
```

The `version` buffer must represent what kind of bitcoin address is being submitted. It can be one of the following:

```js
SerializeP2PKH = 0x00,  // hash160(public-key), same as bitcoin's p2pkh
SerializeP2SH = 0x01,   // hash160(multisig-redeem-script), same as bitcoin's multisig p2sh
SerializeP2WPKH = 0x02, // hash160(segwit-program-00(p2pkh)), same as bitcoin's p2sh-p2wpkh
SerializeP2WSH = 0x03,  // hash160(segwit-program-00(public-keys)), same as bitcoin's p2sh-p2wsh
```

The `hashbytes` are the 20 hash bytes of the bitcoin address. You can obtain that from a bitcoin library, for instance using [`bitcoinjs-lib`](https://github.com/bitcoinjs/bitcoinjs-lib):

```js
const btc = require('bitcoinjs-lib');
console.log(
  '0x' + btc.address.fromBase58Check('1C56LYirKa3PFXFsvhSESgDy2acEHVAEt6').hash.toString('hex')
);
```
