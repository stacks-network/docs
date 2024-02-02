# Commit-Reveal System

Thus far, we have have been introduced to some of the Bitcoin transactions that make it possible to interact with sBTC. However, one big drawback of the transaction formats we have been talking about is that they require the creation of custom Bitcoin transactions, which is a moderately sophisticated use case of Bitcoin and thus remains unsupported by some wallets as well as a lot of custodian solutions that are widely used in the current landscape. Cutting out this portion of the Bitcoin ecosystem from being able to use sBTC is not ideal. As a protocol, it is super important that sBTC is accessible to anyone who wants to use it, and this translates to allowing sBTC compatible transactions to be sent from any viable Bitcoin wallet.

To accommodate for this use case, sBTC also supports an alternate transaction wire-format that has universal compatibility with any Bitcoin wallet. Since this scheme uses two transactions to fulfill a sBTC operation, we call it the commit-reveal scheme. As the name suggests, one of the transactions _commits_ the intent of the user and the second transaction _reveals_ it to the protocol.

Note that commit-reveal does not introduce new sBTC operations, but rather an alternate way to _express_ the same operations . From the perspective of the sBTC protocol, these two schemes are completely compatible and interchangeable with each other, in terms of how they are interpreted by the protocol and the effects they produce.

Let's dig a little deeper into the details.

### Operation format

Fundamentally, all sBTC transactions on Bitcoin have to embed some data into the blockchain itself that highlights the intent of the user to interact with the sBTC protocol. The protocol then identifies these intents from the chain and verifies and executes them, thus executing the intent of the user that was previously embedded in the chain.

As long as we have a reliable way to achieve this cycle of embedding an intent into Bitcoin, reading it and processing it, we can fulfill any sBTC operation. Both the direct scheme (SIP-021 style transactions) and transactions that fulfill commit-reveal scheme achieve this, only differing slightly in how the data is embedded into the chain itself.

In the direct scheme, we embed the data directly in the transaction itself, by using an `OP_RETURN` output.

In the commit reveal scheme, this embedding is done in two stages: the commit transaction and the reveal transaction.

#### Commit transaction

The commit transaction is a very simple transaction with only one requirement: it must contain an output to either a `p2tr`, `p2wsh`, `p2sh-p2wsh` or `p2sh` address. We need to use these types of addresses because all of them require a user to reveal a script to be spent. We require the revealed script to have the following format:

```
<DATA> OP_DROP <LOCK SCRIPT...>
```

where the `DATA` part of the script is similar to the corresponding data format of the direct scheme using `OP_RETURN`, minus the first two magic bytes (that part will be dealt with in the reveal transaction that follows). The data is at most 86 bytes long (the opcode + payload is at most 78 bytes) and also contains an 8 byte chunk that specifies a fee subsidy, i.e. the amount of funds that the reveal transaction is allowed to spend as transaction fees.

The `DATA` section of the script thus looks like this:

```
0  1                            n            n + 8
|--|----------------------------|--------------|
 op     sBTC payload               fee subsidy
```

where the first byte is the opcode of the sBTC transaction, the payload is essential data required for the specific sBTC operation and the fee subsidy limits the maximum amount of money the reveal transaction is allowed to use as fees.

#### Reveal transaction

The reveal transaction is also fairly simple in construction and MUST satisfy the following:

1. It MUST consume an UTXO from a commit transaction as its first input.
2.  The first output MUST be an `OP_RETURN` output with a three byte payload where the first two bytes are the magic bytes (the same ones we promised to add back) that specify the network they are running on - `T2` for mainnet and `X2` for testnet, and the last two bytes is an opcode and a script version byte.

    ```
    0      2  3         4
    |------|--|---------|
     magic  op  version
    ```

The opcode identifies which type of script is revealed. It is `w` if the script is embedded in segwit witness data, and `r` if the script is in a p2sh redeem script.

The version identifies the SegWit witness version. It is `0` for `p2wsh` scripts and `1` for `p2tr` scripts. If the opcode is `r`, this version byte may be omitted.

Because the reveal transaction consumes the UTXO from the commit transaction, the data that was embedded in the script of the commit transaction is _revealed_. Thus, when the sBTC protocol observes a bitcoin operation with the opcode `w` or `r`, it indicates a reveal transaction and the data for the intended operation by the initiator of the commit transaction can be found in either the witness or redeem script of the first input.

Any remaining outputs of the reveal transaction must be of the same form as in the direct scheme. For instance, the reveal transaction representing an sBTC withdrawal request must contain two additional outputs (just like its direct scheme counterpart) in order:

1. the BTC recipient address
2. the funding of the fulfillment transaction.

### Processing the commit-reveal scheme at the protocol level

Now that we understand how the low level representations of commit-reveal transactions and what they represent, we need to talk about how the sBTC protocol itself interacts with the scheme to ensure fulfillment of such transactions.

On a high level, this diagram summarizes the interactions between the various parties involved in the fulfillment of the commit-reveal scheme:

<figure><img src="../../../.gitbook/assets/Diagram Feb 2 2024 from Mermaid Chart (1).png" alt=""><figcaption></figcaption></figure>

More importantly there are three parts of the process that need to interact:

1. The _Committer_ (the person the submitting the _commit_ transaction, initiating the scheme)
2. The _Revealer_ (the person that consumes _commit_ transactions and initiates reveal transactions)
3. The Bitcoin blockchain itself, which provides the underlying data layer which is used to express the scheme

The _Committer_ can be thought of as a system that interacts with a user wallet and constructs _commit_ transactions (like the sBTC bridge).

The _Revealer_ can be thought of a specific system that participates in the sBTC protocol, maintaining a wallet and can consume _commit_ transactions and broadcast _reveal_ transactions. They probably have convenient API endpoints for the _Committer_ to use to construct Witness data.

Here is an example flow of data through the protocol (for illustration purposes only):

1. User interacts with a web UI of a _Committer_, providing operation data to construct the commit transaction
2. The _Committer_ constructs a witness script that can be spent by the _Revealer_
3. The _Committer_ then sends this witness script and any other associated data that might be required to construct a reveal transaction to the _Revealer_
4. The _Committer_ returns the address to send the _commit_ operation to the user
5. User broadcasts the _commit_ transaction by making a payment to the given commit address
6. The _Revealer_ reads the _commit_ transaction, having already processed the witness script
7. The _Revealer_ broadcasts the _reveal_ transaction (there can be economic incentives here that makes the _Revealer_ not reveal a _commit_ transaction. For example, if the cost of revealing the transaction is too high, the _Revealer_ might choose to ignore it altogether)
8. The sBTC protocol picks up the _reveal_ transaction and fulfills it (by interpreting the operation data from the witness script)

NOTE: _It is entirely possible for the Revealer to steal the witness data and use it for its own benefit, although this will be entire visible on the Bitcoin chain data itself and can be completely traced. Thus, there needs to be some degree of cryptoeconomic incentives present that discourage the Revealer from doing this._
