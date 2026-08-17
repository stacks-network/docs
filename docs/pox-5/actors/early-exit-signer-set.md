---
description: Signers that co-sign pre-authorized native BTC early exits.
---

# Early Exit Signer Set

The [Early Exit signer set](../glossary.md#early-exit-signer-set) co-signs pre-authorized [early-exit](../glossary.md#early-exit) requests for native BTC [protocol bonds](../glossary.md#protocol-bond). Exercising early exit unlocks the BTC path early but [forfeits remaining BTC yield](../glossary.md#forfeiture-early-exit), while the [paired STX](../glossary.md#paired-btc-and-paired-stx) remains locked through the [bonding period](../glossary.md#bonding-period).

The early-exit signer set is the BTC-side predicate embedded in the lockup script's `OP_ELSE` branch — `early-unlock-bytes`, a pre-pushed subscript that validates the early-exit signature (the result is consumed by the shared `OP_VERIFY` after `OP_ENDIF`). In practice this is always a single cosigner public key with `OP_CHECKSIG` — one key managed by a redundant, KMS-backed early-exit signing service, not an on-chain multisig script. This is only one of two conditions on that branch: `staker-unlock-bytes` runs unconditionally after `OP_ENDIF`, so an off-cycle spend requires a signature satisfying `early-unlock-bytes` **and** the staker's own signature, plus the staker's 32-byte commitment preimage. On L2, [`announce-l1-early-exit`](../glossary.md) is then called directly by the staker themselves so the contract zeros their shares; there is no separate stored L2 admin principal.
