---
description: >-
  Less common flows for PoX-5 integrators — signer-key grants and other edge
  cases.
---

# Advanced

Topics in this section aren't part of the typical integration journey. They're here for integrators with a specific need: a custodial wrapper that calls PoX-5 on behalf of users, or an operator running signer infrastructure.

* [Signers](signers.md) — Signer-key grants and revocations for operators running signer infrastructure on behalf of stakers.
* [Eligibility Preflights](eligibility.md) — Dry-run any PoX-5 entrypoint's assert chain client-side and get back the contract's own error codes before broadcasting.

### Calling PoX-5 from another contract

PoX-5 treats the staker as `tx-sender` and does not gate the staker-facing entrypoints by caller (`register-for-bond`, `update-bond-registration`, `stake`, `stake-update`, `unstake`, `unstake-sbtc`). The staker can call these directly, or route them through another contract — a wallet's batching helper, a relayer, a custodial wrapper — with no separate pre-authorization step. When routing through another contract, that contract must carry the correct STX and sBTC post-conditions on the transaction, because `tx-sender` remains the principal whose assets move.

A few entrypoints do restrict the caller. `announce-l1-early-exit` requires the staker to call it directly, with no intermediary contract in between. `claim-rewards` and `claim-staker-rewards-for-signer` require the caller to be the signer-manager principal. The signer-key grant and revoke calls, the bond-admin call, and the pause-admin calls each require their own specific caller.
