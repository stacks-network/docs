---
description: >-
  The consensus and language changes that activated at the Epoch 4.0 hard fork,
  for integrators and node operators.
---

# Epoch 4.0 Consensus Changes

Epoch 4.0 activated on mainnet at Bitcoin block 960,230, on 30 July 2026. It replaced PoX-4 with PoX-5 and shipped Clarity 6 alongside a set of consensus changes. A node running anything older than `4.0.1` diverges from consensus after that block.

This page covers the consensus and language changes. For what the fork did to stacked STX, see [What's Changed in PoX-5](https://docs.stacks.co/operate/staking-stx/whats-changed-in-pox-5). For upgrading a signer, see the [PoX-5 Upgrade Guide](https://docs.stacks.co/operate/run-a-signer/pox-5-upgrade-guide).

| SIP                                                                                          | Scope                                                                                          |
| -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| SIP-045, PoX-5: Bitcoin Staking and Emission Schedule Alignment                              | PoX-5 replacing PoX-4, the yield waterfall, the emission change, removal of the miner BTC burn |
| SIP-044, Clarity 6, staking and PoX post-conditions, and removal of the cost-voting contract | Clarity 6, the new post-condition types, the block header version scheme, cost-voting          |

SIP-044 describes itself as a rider on SIP-045. Both are ratified and both votes concluded before activation. SIP-045's vote closed at Bitcoin block 958,925 with 181,488,504 STX voting across 87 unique wallets; SIP-044 reports 161,443,320 STX across 77 voters. Each passed with all but 2 STX in favor. The two totals are reported separately in each SIP and are not the same number.

## Miner BTC no longer reaches a burn address

Under PoX-4, miner BTC that matched no eligible reward address was sent to a Bitcoin burn address, and prepare-phase commitments went there by default. PoX-5 removes both cases. Every block-commit now pays a single output into the reward pool, which auto-bridges to sBTC and funds the waterfall. No miner BTC is destroyed.

The block-commit transaction shape and how to verify it are on [Verify Miner](https://docs.stacks.co/operate/run-a-miner/verify-miner).

## The emission schedule

SIP-029 lowered the coinbase block reward from 1,000 STX to 500 STX per Bitcoin block. That reduction took effect in April 2026 and was in force for roughly three months. SIP-045 restored the reward to 1,000 STX at Epoch 4.0 and removed the remaining SIP-029 reductions.

The 1,000 STX rate is provisional for the PoX-5 bootstrap phase. SIP-045 commits the PoX-6 SIP to an explicit reassessment. SIP-031 emissions are a separate stream and are unaffected.

## Cost-voting is disabled, not removed

The `cost-voting` contract is still deployed and still callable, and votes can still be cast. From Epoch 4.0 they have no effect on consensus: the node stops reading confirmed proposals and every cost function uses the boot defaults.

From Epoch 4.0 the cost functions are implemented in Rust only. There is no `costs-5.clar` and no `SP000000000000000000002Q6VF78.costs-5` contract, unlike `costs-2`, `costs-3` and `costs-4`. Anything that resolved cost functions by reading an on-chain contract needs a different source after the fork.

## Block header version and problematic transactions

The Nakamoto block header carries a single-byte version field. The high bit, `0x80`, is the shadow-block flag. The header version is the low seven bits, `version & 0x7f`.

| Version | Applies to                       |
| ------- | -------------------------------- |
| 0       | Nakamoto epochs before Epoch 4.0 |
| 1       | Epoch 4.0 and later              |

A block is invalid if `version & 0x7f` does not equal the version expected for its epoch. Version 1 headers serialize and hash a list of problematic-transaction markers, which is the mechanism that identifies and handles such transactions in consensus.

Read the version with the mask. A pre-4.0 shadow block has a version byte of `0x80`, which is version 0 with the flag set, and comparing the raw byte to `0` will reject it.

## Clarity 6

Clarity 6 activated with the fork. The full function reference is generated from the node source and lives at [Functions](clarity/functions.md).

Four native functions are new. `ed25519-verify` and `secp256k1-decompress?` are general cryptography. `get-bitcoin-tx-output?` parses a serialized Bitcoin transaction and returns one output plus the canonical txid, and `verify-merkle-proof` checks a Bitcoin-style merkle inclusion proof. The two together replace the pattern of calling an external `clarity-bitcoin` contract, and they are what PoX-5 uses to verify Bitcoin payments.

`concat` is not new. It has existed since Clarity 1, and Clarity 6 makes it variadic: it now takes two or more sequences in one call, at a runtime cost proportional to the combined input length rather than the quadratic cost of chaining binary calls.

The `with-stacking` allowance used by `restrict-assets?` and `as-contract?` is replaced by two allowances in Clarity 6. `with-stacking` remains valid in Clarity 4 and 5 contracts.

| Allowance      | Governs, in pox-5                                                               |
| -------------- | ------------------------------------------------------------------------------- |
| `with-staking` | `stake`, `register-for-bond`, `stake-update`                                    |
| `with-pox`     | `unstake`, `unstake-sbtc`, `update-bond-registration`, `announce-l1-early-exit` |

Two post-condition types are new. `Staking` constrains how much STX a principal may lock, and reuses the fungible condition codes. `PoX` constrains whether a principal may perform a position-altering PoX operation, and has its own three condition codes. See [Post-conditions](https://docs.stacks.co/post-conditions/overview) for how to write them.

## For integrators: the PoX-4 unlock has no transaction and no event

STX locked under PoX-4 became spendable at the activation height. There is no unlock transaction, no unlock event, and no receipt to watch for. The node carries a v4 unlock height and materialises the unlock the first time an account is touched, the same way the v2 and v3 unlocks worked.

Anything that detects unlocks by watching for an event will see nothing. Read the account's locked balance instead.

Calls to `.pox-4` other than read-only ones fail from Epoch 4.0 onward.
