---
title: Technical Specifications
description: Summary of technical specifications of Stacks 2.0
---

## Consensus

- Proof of Transfer (PoX) as described in [SIP-007](https://github.com/stacksgov/sips/blob/main/sips/sip-007/sip-007-stacking-consensus.md)
- Network will transition to Proof of Burn (PoB) as described in [SIP-001](https://github.com/stacksgov/sips/blob/main/sips/sip-001/sip-001-burn-election.md) after 10 years. [Learn more about Proof-of-Burn in SIP-001](https://github.com/stacksgov/sips/blob/main/sips/sip-001/sip-001-burn-election.md).
- Threat model
  - 51% of malicious Stacks mining power can perform a double-spend attack
  - 51% of malicious Bitcoin mining power can reorg the Stacks chain
- Different actors and their roles
  - Stacks Miners package transactions into blocks, mine them through a Bitcoin transaction, propagate them, and if they win the block race, append microblocks to their winning block until the next block is mined. The next block confirms the microblock stream.
  - Stacks Holders may alter the calculation of block limits (subject to a miner veto) and may vote to disable Proof-of-Transfer rewards for a reward cycle.
- Transactions are considered final when the corresponding "block commit" transaction on Bitcoin is finalized. Typically this can by 3-6 confirmations.
- For more details, see [Proof of Transfer](/understand-stacks/proof-of-transfer).

## Proof of Transfer Mining

- Coinbase reward schedule:
  - 1000 STX/block for first 4 years
  - 500 STX/block for following 4 years
  - 250 STX/block for subsequent 4 years
  - 125 STX/block in perpetuity after that
- Coinbase rewards accumulate for "missed sortitions": If a Bitcoin block has no sortition (at height N), then any Stacks block mined in a subsequent sortition that builds off of any Stacks chain tip that existed at the penultimate sortition (at height N-1) may claim its coinbase. This encourages miners to keep mining even if Bitcoin fees are high.
- Initial mining bonus: This is a special case of the above to incentivize early miners. Coinbase for all burnchain blocks between the first burn block height (to be chosen by independent miners as part of the Stacks 2.0 launch) and the first sortition winner accumulate and are distributed to miners over a fixed window (to be determined). For instance, say burn block height is 10,000 and first sortition is at block 10500 and distribution window is 100 blocks, then coinbase for the first 500 blocks (10,500 - 10,000) will be distributed evenly to miners who win sortition over the subsequent 100 blocks.
- Reward maturity window: 100 blocks, meaning leaders will earn the coinbase reward 100 blocks after the block they successfully mine.
- Block interval: Stacks blockchain produces blocks at the same rate as the underlying burnchain. For Bitcoin, this is approximately every 10 minutes.
- BTC commitment: Miners must commit at least 11,000 satoshis (5,500 sats / [UTXO output](https://learnmeabitcoin.com/technical/utxo)); 2 outputs / block) to avoid "dust."
- For more details, see [Mining](/understand-stacks/mining).

## Stacking

- Stacking works in 2 phases
  1. Prepare phase: In this phase an "anchor block" is chosen. The qualifying set of addresses ("reward set") is determined based on the snapshot of the chain at the anchor block. Length of prepare phase is 100 blocks. Stacking commitments need to be confirmed before this phase starts
  2. Reward phase: In this phase miner BTC commitments are distributed amongst the reward set. Reward cycle length is 2000 BTC blocks (~2 weeks).
- Two reward addresses / block, for a total of 4000 addresses every reward cycle. The addresses are chosen using a VRF (verifiable random function), so each node can deterministically arrive at the same reward addresses for a given block.
- Stacking threshold: 0.025% of the participating amount of STX when participation is between 25% and 100% and when participation is below 25%, the threshold level is always 0.00625 of the liquid supply of STX.
- Delegation: An STX address can designate another address to participate in Stacking on its behalf. [Relevant section in SIP-007](https://github.com/stacksgov/sips/blob/main/sips/sip-007/sip-007-stacking-consensus.md#stacker-delegation).
- Pooling: STX holders that individually do not meet the Stacking threshold can pool together their holdings to participate in Stacking. To do this, STX holders must set the (optional) reward address to the "delegate address." For more details, see [this reference](https://docs.stacks.co/references/stacking-contract#delegate-stx).
- Only two types of BTC reward addresses are supported: [Legacy (P2PKH)](https://en.bitcoin.it/wiki/Transaction#Pay-to-PubkeyHash) or [Segregated Witness / Segwit (P2SH)](https://en.bitcoin.it/wiki/Pay_to_script_hash). Native Segwit is not supported.
- Further reading: [Stacking](/stacks-blockchain/stacking)

## Accounts and Addresses

- Transactions in the Stacks blockchain originate from, are paid for by, and execute under the authority of accounts
- An account is fully specified by its address + nonce + assets
- Address contains 2 or 3 fields: 1 byte version, 20 byte public key hash (RIPEMD160(SHA256(input))), optional name (variable length, max 128 bytes)
- Two types of accounts: standard accounts are owned by one or more private keys; contract accounts are materialized when a smart-contract is instantiated (specified by the optional name field above)
- Nonce counts number of times an account has authorized a transaction. Starts at 0, valid authorization must include the _next_ nonce value.
- Assets are a map of all asset types -- STX, any on-chain assets specified by a Clarity contract (for example NFTs) -- to quantities owned by that account.
- Accounts need not be explicit "created" or registered; all accounts implicitly exist and are instantiated on first-use.
- Further reading: [Accounts](/understand-stacks/accounts)

## Transactions

- Transaction types: coinbase, token-transfer, contract-deploy, contract-call, poison-microblock.
- Only standard accounts (not contracts) can pay transaction fees.
- Transaction execution is governed by 3 accounts (may or may not be distinct)
  1. _originating account_ is the account that creates, _authorizes_ and sends the transaction
  2. _paying account_ is the account that is billed by the leader for the cost of validating and executing the transaction
  3. _sending account_ is the account that identifies who is currently executing the transaction: this can change as a transaction executes via the `as-contract` Clarity function
- Transactions can be batched or streamed into blocks. The behavior can be controlled by the anchor mode of a transaction. With streaming ([microblocks](/understand-stacks/microblocks)), a faster confirmation time is possible.
- Two types of authorizations: standard authorization is where originating account is the same as paying account. _Sponsored_ authorization is where originating account and paying account are distinct. For instance, developers or service providers could pay for users to call their smart-contracts.
- For sponsored authorization, first a user signs with the originating account and then a sponsor signs with the paying account.
- Mempool limit for concurrent pending transactions is 25 per account
- Pending mempool transactions will be garbage-collected [256 blocks after receipt](https://github.com/blockstack/stacks-blockchain/blob/master/src/core/mempool.rs#L62). With 10 minutes target block time, this would equal ~42 hours
- [Learn more about transaction encoding in SIP-005](https://github.com/stacksgov/sips/blob/main/sips/sip-005/sip-005-blocks-and-transactions.md#transaction-encoding)
- [Transaction signing and verification are described in SIP-005](https://github.com/stacksgov/sips/blob/main/sips/sip-005/sip-005-blocks-and-transactions.md#transaction-signing-and-verifying)
- All transactions impacting account balance are atomic, a transfer operation can not increment one account’s balance without decrementing another’s. However, transactions that perform multiple account actions (for example, transferring from multiple accounts) may partially complete.
- Transactions can include a memo string (max 34 bytes)
