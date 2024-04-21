# Changes to PoX and Clarity

### **PoX Contract Changes**

**PoX Failure**

In the event that PoX does not activate, the chain halts. If there are no Stackers, then block production cannot happen.

**Changes to PoX**

To support tenure changes, Nakamoto uses a new PoX contract, `.pox-4`. The `.pox-4` contract would be altered over the current PoX contract (`.pox-3`) to meet the following requirements:

* Stackers register a WSTS signing key when they call `stack-stx` or a delegate provides the signing key with `delegate-stack-stx`.

In addition, a `.stackers` boot contracts will be created which carries out the following tasks:

* The `.stackers` contract will expose each reward cycle's full reward set, including the signing keys for each stacker, via a public function. Internally, the Stacks node will call a private function to load the next reward set into the `.stackers` data space after it identifies the PoX anchor block. This is required for some future Stacks features that have been discussed.
* The `.stackers` contract will expose two private functions to update the signing set for the following reward cycle.
  * `update-signer-set`: will update the reward set for the upcoming reward cycle. It will take in a list of at maximum size 4096 of signer pubkeys.
  * `update-current-signer`: will update the the specified signer with their corresponding key-ids.
* The `.stackers` contract will expose a function to vote on the aggregate public key used by the Stackers to sign new blocks in the current tenure.
  * `vote-for-aggregated-public-key` takes the key of the signer calling the contract, the reward cycle number, the round number, and the list of all tapleaves.

### New Stacks-on-Chain Rules

The `stack-stx` Stacks-on-Chain transaction will be extended to include the Stacker’s signing key, as follows:

```
        0      2  3              19           20           53
        |------|--|---------------|-----------|------------|
         magic  op  uSTX to lock    num-cycles  signing key
```

The new field, `signing key`, will contain the compressed secp256k1 ECDSA public key for the stacker.

In addition, the following two new Stacks-on-Chain transactions are added:

#### Delegate-Stack-STX

In Nakamoto, it will now be possible for a stacking delegate to lock up their delegated STX via a Bitcoin transaction. It shall contain an OP\_RETURN with the following payload:

```
        0      2  3              19           20             21        25
        |------|--|---------------|-----------|--------------|----------|
         magic  op  uSTX to lock    num-cycles  has-pox-addr?  index
```

Where `op` = `+`, `uSTX to lock` is the number of microSTX to lock up, `num-cycles` is the number of reward cycles to lock for. The field `has-pox-addr?` can be `0x00` or `0x01`. If it is `0x01`, then `index` is treated as a 4-byte big-endian integer, and is used as an index into the transaction outputs to identify the PoX address the delegate must use. The value `0` refers to the first output after the OP\_RETURN. The output’s `scriptPubKey` is then decoded and converted to the PoX address. If `index` points to a nonexistent transaction output or if `scriptPubKey` cannot be decoded into a PoX address, then this transaction is treated as invalid and has no effect. If `has-pox-addr?` is `0x00` instead, then index is not decoded and the delegate may choose the PoX address.

**Stack-Aggregation-Commit**

In Nakamoto, it will now be possible for a stacking delegate to commit delegated STX behind a PoX address. It shall contain an OP\_RETURN with the following payload:

```
        0      2  3       7           11
        |------|--|-------|-----------|
         magic  op  index  reward cycle
```

Where `op` = `*`, and as with `delegate-stack-stx` above, `index` is a big-endian 4-byte integer which points to a transaction output whose `scriptPubKey` must decode to a supported PoX address. The `reward cycle` field is a 4 byte big-endian integer which identifies the `reward cycle` for which to aggregate the stacked STX.

### Changes to Clarity

Nakamoto produces Stacks blocks occur at a much greater frequency than in the past. Many contracts rely on the `block-height` primitive to approximate a time assuming that a block takes, on average, 10 minutes. To release faster blocks while preserving the functionality of existing contracts that make this block frequency assumption, Nakamoto will use a new version of Clarity, version 3, which includes the following changes.

1. A new primitive `stacks-block-height` that indicates the block height under Nakamoto
2. A new Clarity global variable `tenure-height` will be introduced, which evaluates to the number of tenures that have passed. When the Nakamoto block-processing starts, this will be equal to the chain length.
3. The clarity global variable block-height will continue to be supported in the existing Clarity 2 contracts by returning the same value as `tenure-height`, but usage of block-height in a Clarity 3 contract will trigger an analysis error.
