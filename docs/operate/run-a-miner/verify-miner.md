# Verify Miner

## Verify Configuration

You can verify that your node is operating as a miner by checking its log output to verify that it was able to find its Bitcoin UTXOs:

{% code title="logs" %}
```bash
$ head -n 1000 /path/to/your/node/logs | grep -i utxo
INFO [1630127492.031042] [testnet/stacks-node/src/run_loop/neon.rs:146] [main] Miner node: checking UTXOs at address: <redacted>
INFO [1630127492.062652] [testnet/stacks-node/src/run_loop/neon.rs:164] [main] UTXOs found - will run as a Miner node
```
{% endcode %}

## Verify Operations

The first transaction of the miner is a registration transaction on Bitcoin. It contains only an `OP_RETURN` output.

Thereafter the miner creates one Bitcoin transaction per block. Under PoX-5 that transaction has three outputs:

| vout | Output                                                                                                                  | Amount                  |
| ---- | ----------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| 0    | `OP_RETURN` carrying the magic bytes, the leader-block-commit opcode byte `[` (`0x5b`), and the serialized block-commit | 0                       |
| 1    | P2TR output to the reward cycle's sBTC deposit address                                                                  | the full `burn_fee_cap` |
| 2    | Change back to the miner. The next commit spends this output, which is how the miner's UTXO chain advances              | remainder               |

If the miner won a sortition, the corresponding Stacks address will create a tenure change transaction and a coinbase transaction. The coinbase is scheduled only once that tenure-start block is accepted onto the canonical chain, and it matures 100 tenures later, which is roughly 100 Bitcoin blocks. Winning a sortition without getting a block accepted pays nothing, and that coinbase accrues to a later winner. The tenure's transaction fees are scheduled by the following tenure, so they arrive one tenure behind the coinbase.

### Check the commit output against the expected address

The vout 1 address is derived once per reward cycle from the sBTC signers' aggregate public key. It changes when that key rotates, and it changed between cycles 141 and 142. Nothing else in the derivation moves: the deposit recipient is always the `pox-5` contract, and the max-fee value baked into the deposit script is fixed. Read the address from a node rather than hardcoding it:

```bash
CYCLE=$(curl -s http://localhost:20443/v2/pox | jq -r .reward_cycle_id)
curl -s http://localhost:20443/v3/stacker_set/$CYCLE | jq -c '.stacker_set.sbtc_address'
```

```json
{"Addr32":[true,"P2TR",[35,78,62,152,83,38,17,204,89,128,170,73,10,116,43,155,202,197,215,235,64,216,24,108,149,0,228,113,82,224,35,51]]}
```

`true` is the mainnet flag. The 32 numbers are the taproot output key, one byte each. Render them as hex:

```bash
curl -s http://localhost:20443/v3/stacker_set/$CYCLE \
  | jq -r '.stacker_set.sbtc_address.Addr32[2][]' \
  | xargs printf '%02x'; echo
```

A P2TR `scriptPubKey` is `5120` followed by that key, where `51` is `OP_1` and `20` is a 32-byte push. So the vout 1 script of your own commit must equal `5120` plus the hex above:

```bash
bitcoin-cli getrawtransaction <your-commit-txid> 1 | jq -r '.vout[1].scriptPubKey.hex'
```

The node also logs the recipient it selected, at `debug` level:

```
DEBG Waterfall PoX recipient chosen; recipient: 06-234e3e98..., block_height: ..., stacks_block_hash: ...
```

`06` is the PoX address version byte for P2TR and the hex that follows is the same output key. Most operators run at `info`, so this line is absent unless debug logging is on.

### Check the spend amount

```bash
stacks-node get-spend-amount --config /etc/stacks-node/Config.toml
```

Adjust the path to match your setup. This prints `Will spend <satoshis>`. It computes the commit outputs to do so but prints only the amount, so it is not a way to read the commit address.

### What changed at Epoch 4.0

Before Epoch 4.0 the commit carried two outputs to stacker reward addresses, each holding half of `burn_fee_cap`, and a commit in the prepare phase or with no matching reward slot paid a burn address instead. PoX-5 replaces all three cases with the single sBTC output above, so the shape is the same in every block of the cycle, prepare phase included.

The switch happened at the start of the first reward cycle beginning after Bitcoin block 960,230, which is cycle 141. The cycle containing 960,230 ran the PoX-4 shape to its end, so commits from that cycle have four outputs and are not evidence of a misconfigured node.
