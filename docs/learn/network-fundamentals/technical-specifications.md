# Technical Specifications

### Consensus

* Proof of Transfer (PoX), introduced in [SIP-007](https://github.com/stacksgov/sips/blob/main/sips/sip-007/sip-007-stacking-consensus.md) and now in its fifth version, PoX-5, as described in [SIP-045](https://github.com/stacksgov/sips/blob/main/sips/sip-045/sip-045-pox-5-bitcoin-staking.md)
* Threat model
  * Reorganising the Stacks chain requires control of at least 70% of currently staked STX. Bitcoin mining power cannot reorg Stacks on its own, though it can censor sortitions, and a Bitcoin reorg still orphans the Stacks tenures anchored to it
  * Chain can halt if Stackers cannot meet 70% consensus on block validity
* Different actors and their roles
  * Stacks Miners package transactions into blocks and propose them to stackers
  * Stackers validate and append blocks to the chain
  * sBTC signers are a separate set, governed by their own registry contract under [SIP-028](https://github.com/stacksgov/sips/blob/main/sips/sip-028/sip-028-sbtc_peg.md), and validate sBTC deposit and withdrawal transactions

### Proof of Transfer Mining

* Coinbase reward: 1,000 STX per Bitcoin block, with no scheduled reductions. It was 1,000 STX from genesis, stepped down to 500 STX at Bitcoin height 945,000 under SIP-029, and was restored to 1,000 STX at Bitcoin height 960,230 when Epoch 4.0 activated under SIP-045. SIP-045 describes the 1,000 STX rate as provisional for the PoX-5 bootstrap phase, with reassessment deferred to PoX-6
* Coinbase rewards accumulate for "missed sortitions": If a Bitcoin block has no sortition (at height N), then any Stacks block mined in a subsequent sortition that builds off of any Stacks chain tip that existed at the penultimate sortition (at height N-1) may claim its coinbase. This encourages miners to keep mining even if Bitcoin fees are high.
* Reward maturity window: 100 tenures, meaning a miner earns the coinbase reward 100 tenures after the tenure they successfully mine. A tenure is one winning sortition, so this is roughly 100 Bitcoin blocks rather than 100 Stacks blocks
* Block interval: Stacks produces blocks continuously within a miner's tenure, on the order of ten seconds apart. There is no protocol-level target block time; the node enforces a minimum of one second between blocks. A new tenure normally begins at each Bitcoin block
* BTC commitment: a block-commit has exactly one commit output, paying the reward cycle's sBTC deposit address and carrying the full configured `burn_fee_cap`. Consensus requires only that the amount be non-zero. The output must still clear Bitcoin's own dust relay policy to propagate
* For more details, see [Block Production](../block-production/).

### Stacking

{% stepper %}
{% step %}
**Reward phase**

Miner BTC commitments fund the reward pool, which is distributed through the yield waterfall. Length of the reward phase is 2,000 blocks.
{% endstep %}

{% step %}
**Prepare phase**

An "anchor block" is chosen and the signer set for the next cycle is determined from the snapshot of the chain at that block. Length of prepare phase is 100 blocks. Staking commitments need to be confirmed before this phase starts.
{% endstep %}
{% endstepper %}

* A reward cycle is 2,100 Bitcoin blocks (\~2 weeks): a reward phase of 2,000 blocks followed by a prepare phase of 100 blocks
* Under PoX-5, miner BTC no longer pays a set of stacker reward addresses. Every block-commit pays a single output into the reward pool, which auto-bridges to sBTC and is distributed through a three-tranche waterfall: active protocol bonds, then STX-only stakers, then the reserve fund
* Staking minimum: 50,000 STX (`u50000000000`), counted as an aggregate per signer. There is no per-staker minimum
* Staking to a signer you do not run replaces PoX-4 delegation. A staker calls `stake` against a signer-manager contract, which registers them across all of their staked cycles in a single transaction
* STX holders who individually hold less than the signer minimum can stake to a shared signer manager to participate

### Accounts and Addresses

* Transactions in the Stacks blockchain originate from, are paid for by, and execute under the authority of accounts
* An account is fully specified by its address + nonce + assets
* An address is a 1 byte version plus a 20 byte public key hash (RIPEMD160(SHA256(input))). A contract principal adds a contract name of 1 to 40 bytes. Names of up to 128 bytes parse, for backwards compatibility with contract principals written before the limit was set, but a transaction cannot carry one longer than 40
* Two types of accounts: standard accounts are owned by one or more private keys; contract accounts are materialized when a smart-contract is instantiated (specified by the contract name above)
* Nonce counts number of times an account has authorized a transaction. Starts at 0, valid authorization must include the _next_ nonce value.
* Assets are a map of all asset types -- STX, any on-chain assets specified by a Clarity contract (for example NFTs) -- to quantities owned by that account.
* Accounts need not be explicit "created" or registered; all accounts implicitly exist and are instantiated on first-use.

### Transactions

* Transaction types: coinbase, token-transfer, contract-deploy, contract-call, tenure-change. A sixth type, poison-microblock, exists in the wire format but cannot be submitted and is inert after Nakamoto
* Only standard accounts (not contracts) can pay transaction fees.
* Transaction execution is governed by:

{% stepper %}
{% step %}
**Originating account**

The account that creates, authorizes and sends the transaction.
{% endstep %}

{% step %}
**Paying account**

The account that is billed by the leader for the cost of validating and executing the transaction.
{% endstep %}

{% step %}
**Sending account**

The account that identifies who is currently executing the transaction: this can change as a transaction executes via the `as-contract?` Clarity function.
{% endstep %}
{% endstepper %}

* Two types of authorizations: standard authorization is where originating account is the same as paying account. _Sponsored_ authorization is where originating account and paying account are distinct. For instance, developers or service providers could pay for users to call their smart-contracts.
* For sponsored authorization, first a user signs with the originating account and then a sponsor signs with the paying account.
* Nonce chaining limit: a submitted transaction's nonce may exceed the account's on-chain nonce by at most 26. The limit applies independently to the origin and to the sponsor, and is a window on how far ahead you may queue rather than a cap on pending transactions
* Pending mempool transactions are garbage-collected 42 hours and 40 minutes after they are received. See [`MEMPOOL_MAX_TRANSACTION_AGE`](https://github.com/stacks-network/stacks-core/blob/4.0.3/stackslib/src/core/mempool.rs#L72)
* [Learn more about transaction encoding in SIP-005](https://github.com/stacksgov/sips/blob/main/sips/sip-005/sip-005-blocks-and-transactions.md#transaction-encoding)
* [Transaction signing and verification are described in SIP-005](https://github.com/stacksgov/sips/blob/main/sips/sip-005/sip-005-blocks-and-transactions.md#transaction-signing-and-verifying)
* All transactions impacting account balance are atomic, a transfer operation can not increment one account’s balance without decrementing another’s. However, transactions that perform multiple account actions (for example, transferring from multiple accounts) may partially complete.
* A token-transfer transaction can include a memo field of exactly 34 bytes, zero-padded
