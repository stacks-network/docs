---
description: Native BTC holders who pair a Bitcoin L1 timelock with locked STX.
---

# BTC Protocol Bond Participants

Native BTC protocol bond participants lock BTC on Bitcoin L1 under their own keys and pair that position with locked STX on Stacks. In [PoX-5](../glossary.md#pox-pox-4-pox-5-pox-6), they are usually [whitelisted](../glossary.md#whitelist-and-whitelist-row) institutional partners with negotiated capacity, and they receive first-priority [protocol bond tranche](../glossary.md#waterfall-tranches) BTC yield if their [allocation](../glossary.md#allocation-bond-capacity), L1 lock, and STX commitment remain valid.

Registration is gated by full [BTC SPV proofs](../glossary.md#btc-spv-proof): for each L1 lockup output, the participant submits the Bitcoin block header, the merkle inclusion path, the raw transaction, and the output index to `register-for-bond`. The contract verifies the header, the merkle proof, and that the output's script-pubkey matches the expected [P2WSH lockup script](../glossary.md#lockup-script-p2wsh-lockup-output) derived from the participant's parameters before recording the membership.
