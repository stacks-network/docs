# Proof of Transfer (PoX)

By [@stacks-core](https://github.com/stacks-network/stacks-core)

{% hint style="info" %}
PoX-5 replaced PoX-4 at Epoch 4.0, which activated at Bitcoin block 960,230. Every PoX-4 lock released at activation, and calls to `.pox-4` that change state now fail. This page covers `.pox-5`. The PoX-4 source is kept at [`pox-4.clar`](https://github.com/stacks-network/stacks-core/blob/4.0.4/stackslib/src/chainstate/stacks/boot/pox-4.clar).
{% endhint %}

The deployed contract is [`SP000000000000000000002Q6VF78.pox-5`](https://explorer.hiro.so/txid/SP000000000000000000002Q6VF78.pox-5?chain=mainnet\&tab=sourceCode). The line links below point at the source pinned at release tag [4.0.4](https://github.com/stacks-network/stacks-core/blob/4.0.4/stackslib/src/chainstate/stacks/boot/pox-5.clar).

## Contract summary

`pox-5` runs Bitcoin Staking. It does four jobs:

* **STX-only staking.** A staker locks STX to a signer-manager contract for 1 to 96 reward cycles.
* **Protocol bonds.** A 12-cycle position pairing locked STX with either a Bitcoin L1 timelock, proven to the contract with a Merkle proof, or sBTC held by the contract.
* **Signer registration.** A signer-manager contract registers itself with a signer key whose holder has granted it that key.
* **Rewards.** The contract calculates sBTC rewards once per distribution and pays them to signer-managers, which settle with their stakers.

There is no `delegate-stx` and no `pox-addr` argument. Where a staker's rewards go is set by their signer-manager, passed as `signer-calldata`.

## Public functions

### Staking

| Function       | Called by | What it does                                                                        | Source                                                                                                                              |
| -------------- | --------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `stake`        | Staker    | Starts STX-only staking through a registered signer-manager.                        | [L976-L1086](https://github.com/stacks-network/stacks-core/blob/4.0.4/stackslib/src/chainstate/stacks/boot/pox-5.clar#L976-L1086)   |
| `stake-update` | Staker    | Changes signer-manager, extends the lock, increases the amount, or any combination. | [L1092-L1173](https://github.com/stacks-network/stacks-core/blob/4.0.4/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1092-L1173) |
| `unstake`      | Staker    | Moves an STX-only stake's unlock to the next reward cycle.                          | [L1424-L1470](https://github.com/stacks-network/stacks-core/blob/4.0.4/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1424-L1470) |

### Protocol bonds

| Function                   | Called by             | What it does                                                                                  | Source                                                                                                                              |
| -------------------------- | --------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `register-for-bond`        | Allowlisted staker    | Joins a bond with STX plus either L1 lockup proofs or sBTC. Must land before the bond starts. | [L642-L842](https://github.com/stacks-network/stacks-core/blob/4.0.4/stackslib/src/chainstate/stacks/boot/pox-5.clar#L642-L842)     |
| `update-bond-registration` | Bond participant      | Moves an active bond to a different signer-manager.                                           | [L850-L943](https://github.com/stacks-network/stacks-core/blob/4.0.4/stackslib/src/chainstate/stacks/boot/pox-5.clar#L850-L943)     |
| `announce-l1-early-exit`   | The staker, directly  | Ends an L1 bond's reward share early. The STX stays locked until the bond ends.               | [L1196-L1257](https://github.com/stacks-network/stacks-core/blob/4.0.4/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1196-L1257) |
| `unstake-sbtc`             | sBTC bond participant | Withdraws part or all of the locked sBTC.                                                     | [L1261-L1342](https://github.com/stacks-network/stacks-core/blob/4.0.4/stackslib/src/chainstate/stacks/boot/pox-5.clar#L1261-L1342) |

### Rewards

| Function                          | Called by      | What it does                                                                                                 | Source                                                                                                                              |
| --------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| `calculate-rewards`               | Anyone         | Computes the latest distribution across active bonds and STX-only staking. Every active bond must be listed. | [L2158-L2240](https://github.com/stacks-network/stacks-core/blob/4.0.4/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2158-L2240) |
| `claim-rewards`                   | Signer-manager | Transfers the signer's accumulated sBTC for a reward cycle and the listed bonds.                             | [L2387-L2438](https://github.com/stacks-network/stacks-core/blob/4.0.4/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2387-L2438) |
| `claim-staker-rewards-for-signer` | Signer-manager | Settles one staker's rewards in the manager's accounting. Transfers nothing.                                 | [L2444-L2470](https://github.com/stacks-network/stacks-core/blob/4.0.4/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2444-L2470) |

### Signers

| Function              | Called by                  | What it does                                                                              | Source                                                                                                                              |
| --------------------- | -------------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `grant-signer-key`    | Signer-manager             | Records a one-time grant, signed by the key holder, letting the manager use a signer key. | [L2743-L2811](https://github.com/stacks-network/stacks-core/blob/4.0.4/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2743-L2811) |
| `register-signer`     | Signer-manager             | Registers the manager with a granted signer key.                                          | [L946-L973](https://github.com/stacks-network/stacks-core/blob/4.0.4/stackslib/src/chainstate/stacks/boot/pox-5.clar#L946-L973)     |
| `revoke-signer-grant` | The signer key's principal | Revokes a grant. The manager can take no new stake, and existing positions wind down.     | [L2824-L2860](https://github.com/stacks-network/stacks-core/blob/4.0.4/stackslib/src/chainstate/stacks/boot/pox-5.clar#L2824-L2860) |

### Administration

`setup-bond`, `set-bond-admin`, `set-pause-admin` and `pause-rewards` are called by the bond and pause admins, and `set-burnchain-parameters` runs once at boot. Integrators do not call them.

## Where to go next

* [Bitcoin Staking](https://docs.stacks.co/learn/bitcoin-staking) for the concepts.
* [Stake to an Existing Signer-Manager](https://docs.stacks.co/operate/staking-stx/stack-with-a-pool) and [Ending or Changing a Bond Position](https://docs.stacks.co/operate/protocol-bonds/ending-or-changing-a-bond-position) for the flows.
* [Deploy a Signer Manager Contract](https://docs.stacks.co/operate/deploy-a-signer-manager-contract) for the other side of the `signer-manager` trait.
