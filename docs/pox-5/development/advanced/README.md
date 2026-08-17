---
description: >-
  Less common flows for PoX-5 integrators — signer-key grants and other edge
  cases.
---

# Advanced

Topics in this section aren't part of the typical integration journey. They're here for integrators with a specific need: a custodial wrapper that calls PoX-5 on behalf of users, or an operator running signer infrastructure.

All examples use `@stacks/bitcoin-staking` for the PoX-5 surface and `@stacks/transactions` for signing and broadcast.

### Calling PoX-5 from another contract

PoX-5 identifies the staker as `tx-sender` and imposes no contract-caller gate on the staker-facing entrypoints (`register-for-bond`, `update-bond-registration`, `stake`, `stake-update`, `unstake`, `unstake-sbtc`). They can be invoked directly by the staker or routed through an intermediary contract — a wallet's batching helper, a relayer, a custodial wrapper — with no pre-authorization step. The wrapper must carry the appropriate STX/sBTC post-conditions on the originating transaction, since `tx-sender` is the principal whose assets move.

A few entrypoints do constrain the caller: `announce-l1-early-exit` requires the staker to call it directly (`contract-caller == tx-sender == staker`); `claim-rewards` and `claim-staker-rewards-for-signer` treat `contract-caller` as the signer-manager principal; and the signer-key grant/revoke, bond-admin (`set-bond-admin`), and pause-admin (`set-pause-admin`, `pause-rewards`) entrypoints assert their respective `contract-caller`.

