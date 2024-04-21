# Transactions

### New Transactions

**Tenure Change**

A tenure change is an event in the existing Stacks blockchain when one miner assumes responsibility for creating new stacks blocks from another miner. Currently, the miner's tenure lasts until the next cryptographic sortition, over which time it has the option to create a single Stacks block and stream microblocks until the next sortition ends its tenure. A change in tenure occurs when a Stacks block is discovered from a cryptographic sortition.

In Nakamoto, the Stackers themselves carry out a tenure change by creating a specially-crafted `TenureChange` transaction to serve as a consensus critical artifact stored on the Stacks blockchain which ties the selection of a new miner to the sortition that selected it. Miners must include this artifact as the first transaction in the first block it produces in its new tenure. The sortition prompts Stackers to begin creating the `TenureChange` for the next miner, and the next miner's tenure begins only once the newly selected miner produces a block with the `TenureChange` transaction.

In the act of producing a `TenureChange` transaction, the Stackers also internally agree to no longer sign the current miner's blocks. Thus, the act of producing a `TenureChange` atomically transfers block-production responsibilities from one miner to another. The new miner cannot orphan recently-confirmed blocks from the old miner because the `TenureChange` transaction contains within it the most recently confirmed blockId as identified by the same Stackers that produced the `TenureChange`. As a result, any new blocks that fail to build upon the latest Stacks block identified by the Signers will be verifiably invalid.

<figure><img src="../../../.gitbook/assets/image (14).png" alt=""><figcaption></figcaption></figure>

_Figure 3: Tenure change overview. When a new Bitcoin block arrives, Stackers begin the process of deciding the last block they will sign from miner N. When they reach quorum, they make this data available for download by miners, and wrap it in a WSTS-signed specially-crafted data payload. This information serves as a record of the tenure change, and must be incorporated in miner N+1's tenure-start block. In other words, miner N+1 cannot begin producing Stacks blocks until Stackers informs it of block X -- the block from miner N that it must build atop. Stacks-on-Bitcoin transactions are applied by miner N+1 for all Bitcoin blocks in sortitions N and earlier when its tenure begins._

The `TenureChange` transaction encodes the following data:

| Name                           | Description                                                                                                                                                                                                                                                                                                                                           | Representation                                     |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| tenure consensus hash          | Consensus hash of this tenure. Corresponds to the sortition in which the miner of this block was chosen. It may be the case that this miner's tenure gets extended across subsequent sortitions; if this happens, then this `consensus hash` value remains the same as the sortition in which the winning block-commit was mined.                     | 20 bytes                                           |
| previous tenure consensus hash | Consensus hash of the previous tenure. Corresponds to the sortition of the previous winning block-commit.                                                                                                                                                                                                                                             | 20 bytes                                           |
| burn view consensus hash       | Current consensus hash on the underlying burnchain. Corresponds to the last-seen sortition.                                                                                                                                                                                                                                                           | 20 bytes                                           |
| previous tenure end            | The index block hash of the last Stacks block from the previous tenure.                                                                                                                                                                                                                                                                               | 32 bytes                                           |
| previous tenure blocks         | The number of blocks produced since the last sortition-linked tenure.                                                                                                                                                                                                                                                                                 | 4 bytes, big-endian                                |
| cause                          | <p>A flag to indicate the cause of this tenure change<br>- <code>0x00</code> indicates that a sortition occurred, and a new miner should begin producing blocks.<br>- <code>0x01</code> indicates that the current miner should continue producing blocks. The current miner’s tenure execution budget is reset upon processing this transaction.</p> | 1 byte                                             |
| pubkey hash                    | The ECDSA public key hash of the current tenure.                                                                                                                                                                                                                                                                                                      | 20 bytes                                           |
| signature                      | The Stacker signature.                                                                                                                                                                                                                                                                                                                                | 65 bytes                                           |
| signers                        | A bitmap of which Stackers signed. The ith bit refers to the ith Stacker in the order in which the principals are stacked.                                                                                                                                                                                                                            | 4 bytes big-endian length + ceil(num\_stackers /8) |

**TenureChange-BlockFound**

_**A\*\*\*\***** ****`TenureChange-BlockFound`**** ****\*\*\*\*transaction is induced by a winning sortition. This causes the new miner to start producing blocks, and stops the current miner from producing more blocks.**_

When produced, the `TenureChange-BlockFound` transaction will be made available to miners for download, so that miners can include it in their first block. Miners N and N+1 will both monitor the availability of this data in order to determine when the former must stop producing blocks and the latter may begin producing blocks. Once miner N+1 receives this data, it begins its tenure by doing the following:

1. It processes any currently-unprocessed Stacks-on-Bitcoin transactions up to (but excluding) the Bitcoin block which contains its sortition (so, up to sortition N).
2. It produces its tenure-start block, which contains the `TenureChange-BlockFound` transaction as its first transaction.
3. It begins mining transactions out of the mempool to produce Stacks blocks.

If miner N cannot obtain or observe the `TenureChange-BlockFound` transaction, then it will keep producing blocks. However, Stackers will not sign them, so as far as the rest of the network is concerned, these blocks never materialized. If miner N+1 does not see the `TenureChange-BlockFound` transaction, it does not start mining; a delay in obtaining the `TenureChange-BlockFound` transaction can lead to a period of chain inactivity. This can be mitigated by the fact that the miner can learn the set of Stackers' IP addresses in advance, and can directly query them for the data.

**TenureChange-Extend**

_**A\*\*\*\***** ****`TenureChange-Extend`****, which is induced by Stackers, resets the current tenure's ongoing execution budget, thereby allowing the miner to continue producing blocks.**_

The time between cryptographic sortitions (and thus tenure changes) depends on the time between two consecutive Bitcoin blocks. This can be highly variable, which complicates the task of sustaining a predictable transaction confirmation latency while also preventing a malicious miner from spamming the network with too many high-resource transactions.

Today, each miner receives a tenure block budget, which places hard limits on how much CPU, RAM, and I/O their block can consume when evaluated. In this proposal, each miner begins its tenure with a fixed budget, but Stackers may opt to increase that budget through a vote. This is done to enable the miner to continue to produce blocks if the next Bitcoin block is late.

Ultimately the cadence and decision making around when to initiate, approve, and execute a TenureChange-Extend is at the discretion of the Stackers. To achieve a regular cadence, Stackers are recommended to keep track of the elapsed wall-clock time since the start of the tenure. Once the expected tenure time has passed (e.g. 10 minutes), they can vote to grant the miner an additional tenure execution budget.

Stackers can produce as many TenureChange-Extend transactions as they like to extend a miner’s tenure. This offers a forward-compatibility path for increasing the blockchain’s throughput to take advantage of future optimizations to the chain’s performance. Also, it allows Stackers to keep the last-winning miner online in order to tolerate empty sortitions, which may arise from misconfigured miners as well as the Bitcoin MEV miner solution (described below).

### Stacker Turnover

A miner tenure change happens every time the Signers collectively issue a `TenureChange-BlockFound` transaction in response to a sortition on the burn chain selecting a valid miner.

Additionally, there are Stacker cycles, which happen once every 2100 Bitcoin blocks (one reward cycle) in which a new set of Stackers are selected by the PoX anchor block (see [SIP-007](https://github.com/stacksgov/sips/blob/main/sips/sip-007/sip-007-stacking-consensus.md)).

Because Stacks will no longer fork, the PoX anchor block is always known 100 Bitcoin blocks before the start of the next reward cycle. It is the last tenure-start block that precedes prepare-phase.

The PoX anchor block identifies the next Stackers. They have 100 Bitcoin blocks to prepare for signing Stacks blocks. Within this amount of time, the new Stackers would complete a WSTS DKG for signing blocks. The PoX contract will require Stackers to register their block-signing keys when they stack or delegate-stack STX, so the entire network knows enough information to validate their WSTS Schnorr signatures on blocks.
