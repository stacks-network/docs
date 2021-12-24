---
title: Stacking
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

![Stacking flow](/images/stacking-illustration.png)

1. Make API calls to get details about the upcoming reward cycle
2. For a specific Stacks account, confirm eligibility
3. Confirm the BTC reward address and the lockup duration
4. The transaction is broadcasted and the STX tokens are locked. This needs to happen before the prepare phase of the next reward cycle, the last 100 Bitcoin blocks of the ongoing reward phase
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

![Delegated tacking flow](/images/stacking-delegation-illustration.png)

- Before Stacking can be initiated for a token holder, the delegator needs to be granted permission to Stack on behalf of the account owner. The permission is restricted to the maximum amount the delegator is allowed to Stack. The maximum amount is not limited by the available funds and can be set much higher. An account can only be associated with one single delegator
- The account has to define the delegation relationship. They can optionally restrict the Bitcoin reward address that must be used for payouts, and the expiration burn block height for the permission, thus limiting the time a delegator has permission to Stack
- Delegators have to lock Stacks from different accounts ("pooling phase") until they reach the minimum amount of Stacks required to participate in Stacking
- Once a delegator locks enough STX tokens, they can finalize and commit their participation in the next reward cycle
- Certain delegation relationships may allow the STX holder to receive the payout directly from the miner (step 5/6)
- The termination of the delegation relationship can either happen automatically based on set expiration rules or by actively revoking delegation rights

## PoX mining

PoX mining is a modification of Proof-of-Burn (PoB) mining, where instead of sending the committed Bitcoin to a burn address, it's transferred to eligible STX holders that participate in the stacking protocol.

-> A PoX miner can only receive newly minted STX tokens when they transfer Bitcoin to eligible owners of STX tokens

![Mining flow](/images/pox-mining-flow.png)

Miners run Stacks nodes with mining enabled to participate in the PoX mechanism. The node implements the PoX mechanism, which ensures proper handling and incentives through four key phases:

- Registration: miners register for a future election by sending consensus data to the network
- Commitment: registered miners transfer Bitcoin to participate in the election. Committed BTC are sent to a set participating STX token holders
- Election: a verifiable random function chooses one miner to write a new block on the Stacks blockchain
- Assembly: the elected miner writes the new block and collects rewards in form of new STX tokens

[@page-reference | inline]
| /start-mining/mainnet, /start-mining/testnet

## Token holder eligibility

Stacks (STX) token holders don't automatically receive stacking rewards. Instead, they must:

- Commit to participation before a reward cycle begins
- Commit the minimum amount of STX tokens to secure a reward slot, or pool with others to reach the minimum
- Lock up STX tokens for a specified period
- Provide a supported Bitcoin address to receive rewards (native segwit is not supported)

The following diagram describes how the minimum STX tokens per slot is determined. More information on
[dynamic minimums for stacking](https://stacking.club) is available at stacking.club.

![Dynamic minimum for individual eligibility](/images/stacking-dynamic-minimum.png)

Token holders have a variety of providers and tools to support their participation in Stacking. The Stacks website contains a [list of stacking providers and pools](https://stacks.org/stacking#earn).

## Stacking in the PoX consensus algorithm

Stacking is a built-in capability of PoX and occurs through a set of actions on the Stacks blockchain. The [full proof-of-transfer implementation details](https://github.com/blockstack/stacks-blockchain/blob/develop/sip/sip-007-stacking-consensus.md) are in SIP-007. Below is a summary of the most relevant actions of the algorithm.

![PoX cycles](/images/pox-cycles.png)

- Stacking happens over reward cycles with a fixed length. In each reward cycle, a set of Bitcoin addresses associated with stacking participants receive BTC rewards
- A reward cycle consists of two phases: prepare and reward
- During the prepare phase, miners decide on an anchor block and a reward set. Mining any descendant forks of the anchor block requires transferring mining funds to the appropriate reward addresses. The reward set is the set of Bitcoin addresses which are eligible to receive funds in the reward cycle
- Miners register as leader candidates for a future election by sending a key transaction that burns cryptocurrency. The transaction also registers the leader's preferred chain tip (must be a descendant of the anchor block) and commitment of funds to 2 addresses from the reward set
- Token holders register for the next rewards cycle by broadcasting a signed message that locks up associated STX tokens for a protocol-specified lockup period, specifies a Bitcoin address to receive the funds, and votes on a Stacks chain tip
- Multiple leaders can commit to the same chain tip. The leader that wins the election and the peers who also burn for that leader collectively share the reward, proportional to how much each one burned
- Token holders' locked up tokens automatically unlock as soon as the lockup period finishes

## Stacking contract

Check out the [Stacking contract reference](/references/stacking-contract) to see available methods and error codes.

## Bitcoin address

!> You must provide a BTC address in one of two formats: [Legacy (P2PKH)](https://en.bitcoin.it/wiki/Transaction#Pay-to-PubkeyHash), which starts with `1`. Or, [Segregated Witness / Segwit (P2SH)](https://en.bitcoin.it/wiki/Pay_to_script_hash), which starts with `3`. The "Native Segwit" format (which starts with "bc1"), for example, is not supported.

The Stacking contract needs a special format for the Bitcoin address (the reward address). This is required to ensure that miners are able to correctly construct the Bitcoin transaction containing the reward address.

The address must be specified in the following format using the Clarity language:

```clar
;; a tuple of a version and hashbytes buffer
(pox-addr (tuple (version (buff 1)) (hashbytes (buff 20))))
```

The `version` buffer must represent what kind of bitcoin address is being submitted. It can be one of the following:

```js
SerializeP2PKH  = 0x00, // hash160(public-key), same as bitcoin's p2pkh
SerializeP2SH   = 0x01, // hash160(multisig-redeem-script), same as bitcoin's multisig p2sh
SerializeP2WPKH = 0x02, // hash160(segwit-program-00(p2pkh)), same as bitcoin's p2sh-p2wpkh
SerializeP2WSH  = 0x03, // hash160(segwit-program-00(public-keys)), same as bitcoin's p2sh-p2wsh
```

The `hashbytes` are the 20 hash bytes of the bitcoin address. You can obtain that from a bitcoin library, for instance using [`bitcoinjs-lib`](https://github.com/bitcoinjs/bitcoinjs-lib):

```js
const btc = require('bitcoinjs-lib');
console.log(
  '0x' + btc.address.fromBase58Check('1C56LYirKa3PFXFsvhSESgDy2acEHVAEt6').hash.toString('hex')
);
```
