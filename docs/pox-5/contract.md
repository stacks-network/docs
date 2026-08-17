---
description: Line-by-line function inventory for the PoX-5 Clarity contract.
---

# Smart Contract Function Index

This page inventories the integrator-relevant functions in `stackslib/src/chainstate/stacks/boot/pox-5.clar`, the canonical [PoX-5](glossary.md#pox-pox-4-pox-5-pox-6) Clarity boot contract. Line ranges are inclusive and cover each function from its `define-*` form through its closing parenthesis.

Contract version: `a7e3e76019d911aef9bd6f8dbde0da81517a3b45`

## Public Functions

### Public Function Summaries

**Staking**

* [`stake`](development/solo-stx.md) starts STX-only staking for the caller through a registered signer manager. It validates the signer manager, the start height, the lock period, and the caller's STX balance. Calls during the [prepare phase](glossary.md#prepare-phase-prepare-window) are rejected. A caller with an ending bond or a non-overlapping position can roll over directly into a new stake — the old bond keeps earning for its remaining cycles under its old signer, and the caller cannot manage it any more. A caller with an overlapping bond or an existing STX-only stake cannot stake again.
* [`stake-update`](development/solo-stx.md) changes an existing STX-only staker's signer, extends their lock, increases their locked amount, or combines those updates. Calls during the prepare phase are rejected.
* [`unstake`](development/solo-stx.md) shortens an active STX-only staker's remaining participation so their unlock cycle becomes the next reward cycle. Calls during the prepare phase are rejected.

**Protocol Bonds**

* [`register-for-bond`](development/paired-btc.md) lets an allowlisted staker join a configured protocol bond. The staker proves L1 BTC lockups or locks sBTC, supplies enough STX, and selects a registered signer manager. Registration must land before the bond starts and outside the prepare phase. A caller with an ending bond or a non-overlapping STX-only stake can roll over directly into the new bond; an overlapping position is rejected. Returns the registered position, including the unlock heights.
* [`update-bond-registration`](development/paired-btc.md) lets an existing bond participant rotate their signer-manager mid-bond. Rotating to the same signer is rejected, as are calls during the prepare phase. Only bond participants can use this entrypoint — STX-only stakers cannot.
* [`announce-l1-early-exit`](development/paired-btc.md) marks an L1-locked bond participant as exited early after their BTC timelock is spent off-cycle. Only the staker themselves can call it, and only directly (not via another contract). The `old-signer-manager` argument must be the staker's currently-recorded signer. The call removes the position's remaining reward shares; the staker's locked STX remains locked through the bond's normal unlock cycle. sBTC-locked participants use `unstake-sbtc` instead.
* [`unstake-sbtc`](development/paired-btc.md) lets an sBTC-locked bond participant withdraw some or all of their locked sBTC, at any time outside the prepare phase — including after the bond is over. L1-locked memberships cannot use it.

**Rewards**

* [`calculate-rewards`](development/rewards.md) computes the latest reward distribution across active protocol bonds and STX-only staking. Anyone can call it; it runs at most once per distribution height and requires all active bonds to be listed in the call.
* [`claim-rewards`](development/rewards.md) lets a signer claim accumulated sBTC rewards for a reward cycle and a supplied list of bond periods. The contract transfers the total sBTC to the caller and returns a breakdown per leg.
* [`claim-staker-rewards-for-signer`](development/rewards.md) (signer-manager only) settles a single staker's accumulated sBTC under one cycle/bond leg for the calling signer-manager's accounting. It does not transfer sBTC — the signer-manager pays the staker out of what it received from `claim-rewards`.

**Signer Management**

* [`register-signer`](development/advanced/signers.md) registers a signer manager contract and its signer key. The signer manager contract must call it directly.
* [`grant-signer-key`](development/advanced/signers.md) records permission for a signer manager to use a signer key, verified by a one-time signature.
* [`revoke-signer-grant`](development/advanced/signers.md) removes an existing signer-key grant. Only the principal derived from the signer key can call it.

The Endowment configures each bond period with `setup-bond` and operates the remaining admin entrypoints. Integrators do not call these; see [Onboarding](development/onboarding.md) for what to submit to the Endowment instead.

### Relevant Public Function Locations

| Function                                               |                                                                                                                                                                           Lines |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| `stake`                                                |   [pox-5.clar:976:1086](https://github.com/stacks-network/stacks-core/blob/a7e3e76019d911aef9bd6f8dbde0da81517a3b45/stackslib/src/chainstate/stacks/boot/pox-5.clar#L976-L1086) |
| `stake-update`                                         | [pox-5.clar:1092:1173](https://github.com/stacks-network/stacks-core/blob/a7e3e76019d911aef9bd6f8dbde0da81517a3b45/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1092-L1173) |
| `unstake`                                              | [pox-5.clar:1424:1470](https://github.com/stacks-network/stacks-core/blob/a7e3e76019d911aef9bd6f8dbde0da81517a3b45/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1424-L1470) |
| `register-for-bond`                                    |     [pox-5.clar:642:842](https://github.com/stacks-network/stacks-core/blob/a7e3e76019d911aef9bd6f8dbde0da81517a3b45/stackslib/src/chainstate/stacks/boot/pox-5.clar#L642-L842) |
| `update-bond-registration`                             |     [pox-5.clar:850:943](https://github.com/stacks-network/stacks-core/blob/a7e3e76019d911aef9bd6f8dbde0da81517a3b45/stackslib/src/chainstate/stacks/boot/pox-5.clar#L850-L943) |
| `announce-l1-early-exit`                               | [pox-5.clar:1196:1257](https://github.com/stacks-network/stacks-core/blob/a7e3e76019d911aef9bd6f8dbde0da81517a3b45/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1196-L1257) |
| `unstake-sbtc`                                         | [pox-5.clar:1261:1342](https://github.com/stacks-network/stacks-core/blob/a7e3e76019d911aef9bd6f8dbde0da81517a3b45/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1261-L1342) |
| `calculate-rewards`                                    | [pox-5.clar:2158:2240](https://github.com/stacks-network/stacks-core/blob/a7e3e76019d911aef9bd6f8dbde0da81517a3b45/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2158-L2240) |
| `claim-rewards`                                        | [pox-5.clar:2387:2438](https://github.com/stacks-network/stacks-core/blob/a7e3e76019d911aef9bd6f8dbde0da81517a3b45/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2387-L2438) |
| `claim-staker-rewards-for-signer` **(signer-manager)** | [pox-5.clar:2444:2470](https://github.com/stacks-network/stacks-core/blob/a7e3e76019d911aef9bd6f8dbde0da81517a3b45/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2444-L2470) |
| `register-signer`                                      |     [pox-5.clar:946:973](https://github.com/stacks-network/stacks-core/blob/a7e3e76019d911aef9bd6f8dbde0da81517a3b45/stackslib/src/chainstate/stacks/boot/pox-5.clar#L946-L973) |
| `grant-signer-key`                                     | [pox-5.clar:2743:2811](https://github.com/stacks-network/stacks-core/blob/a7e3e76019d911aef9bd6f8dbde0da81517a3b45/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2743-L2811) |
| `revoke-signer-grant`                                  | [pox-5.clar:2824:2860](https://github.com/stacks-network/stacks-core/blob/a7e3e76019d911aef9bd6f8dbde0da81517a3b45/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2824-L2860) |

## Read-only Public Functions

### Rewards

| Function                           |                                                                                                                                                                           Lines |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| `get-rewards`                      | [pox-5.clar:2135:2145](https://github.com/stacks-network/stacks-core/blob/a7e3e76019d911aef9bd6f8dbde0da81517a3b45/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2135-L2145) |
| `get-new-rewards`                  | [pox-5.clar:2149:2156](https://github.com/stacks-network/stacks-core/blob/a7e3e76019d911aef9bd6f8dbde0da81517a3b45/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2149-L2156) |
| `get-earned`                       | [pox-5.clar:2341:2354](https://github.com/stacks-network/stacks-core/blob/a7e3e76019d911aef9bd6f8dbde0da81517a3b45/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2341-L2354) |
| `get-earned-staker-rewards`        | [pox-5.clar:2358:2373](https://github.com/stacks-network/stacks-core/blob/a7e3e76019d911aef9bd6f8dbde0da81517a3b45/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2358-L2373) |
| `compute-earned-rewards`           | [pox-5.clar:2378:2385](https://github.com/stacks-network/stacks-core/blob/a7e3e76019d911aef9bd6f8dbde0da81517a3b45/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2378-L2385) |
| `assert-all-active-bonds-included` | [pox-5.clar:2616:2637](https://github.com/stacks-network/stacks-core/blob/a7e3e76019d911aef9bd6f8dbde0da81517a3b45/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2616-L2637) |

`get-earned` returns a signer's accrued sBTC; `get-earned-staker-rewards` is its per-staker counterpart. See [Rewards](development/rewards.md).

### Signer Key Grants

| Function                        |                                                                                                                                                                           Lines |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| `get-signer-grant-message-hash` | [pox-5.clar:2865:2877](https://github.com/stacks-network/stacks-core/blob/a7e3e76019d911aef9bd6f8dbde0da81517a3b45/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2865-L2877) |
| `verify-signer-key-grant`       | [pox-5.clar:2879:2890](https://github.com/stacks-network/stacks-core/blob/a7e3e76019d911aef9bd6f8dbde0da81517a3b45/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2879-L2890) |

### Bitcoin SPV / Lockup Helpers

These read-onlys are exposed at the contract surface but are primarily used internally during L1 lockup verification. They are listed for completeness rather than as a public API. At registration, the contract validates each lockup output: it reconstructs the expected P2WSH script for the output's committed unlock height, and checks the script, the amount, the block header, and the merkle proof. A registration with an invalid output is rejected.

`construct-lockup-script` builds the L1 lockup witness script from the caller-supplied `staker-unlock-bytes` and `early-unlock-bytes`. Both must be pre-pushed, self-contained script fragments that leave a boolean result on the stack. See the lockup-script section of [paired-btc](development/paired-btc.md) for the full template and the height limits that apply to the CLTV branch.
