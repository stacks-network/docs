---
description: >-
  Mainnet upgrade guide for Stacks signer operators and stacking pool operators.
  Required release 4.0.1, activating at Bitcoin block 960,230.
---

# PoX-5 Upgrade Guide

{% hint style="warning" %}
Every signer operator must upgrade to `4.0.1` before activation at Bitcoin block `960,230` — approximately **July 30, 2026 AM UTC**. Nodes still on `3.4.x` diverge after activation.
{% endhint %}

* **Audience:** Stacks signer operators, stacking pool operators, and STX staking services
* **Required release:** `4.0.1`
* **Activation:** Bitcoin block `960,230` — approximately July 30, 2026 AM UTC
* **Last verified:** July 21, 2026

Pool operators must also deploy and register a signer-manager after activation, then coordinate affected stakers' move to PoX-5.

This guide covers STX staking under PoX-5. Native BTC bonds and whitelisted sBTC community pools follow separate integration paths.

### What you need to do

Use the table below to find the steps that apply to you. Some organizations have more than one role.

| If you...                            | Do this                                                                                                   |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| Run `stacks-signer`                  | Upgrade to `4.0.1`, preserve the existing signer key, and verify signing health.                          |
| Run the Stacks node your signer uses | Upgrade the node to `4.0.1` and verify chain-tip parity.                                                  |
| Provide signing for a pool           | Review its signer-manager, generate the one-time signer-key grant, and verify registration.               |
| Operate a stacking pool              | Deploy and administer the pool's PoX-5 signer-manager, complete registration, and operate rewards.        |
| Stack STX                            | After the signer-manager is active, submit a PoX-5 `stake` transaction from the wallet that owns the STX. |

{% hint style="info" %}
**Who deploys the signer-manager?** If you deploy a PoX-5 stacking pool, you must also deploy and administer its signer-manager contract. A signer-only provider reviews the contract and provides the signer-key grant, but does not deploy or administer the manager unless explicitly agreed.
{% endhint %}

Existing PoX-4 positions do not become PoX-5 positions automatically. Affected users or protocol-controlled accounts must submit a new PoX-5 stake transaction.

### 1. Prepare before activation

#### Upgrade the signer and node

1. Upgrade `stacks-signer` to `4.0.1`. If you operate its Stacks node, upgrade that node to `4.0.1` as well. Nodes on `3.4.x` diverge after activation.
2. Preserve the existing signer configuration, private key, and database. Do not rotate the signer key or create a fresh database solely for this upgrade.
3. Restart and confirm the running version, node connectivity, expected signer slot, clean logs, and normal proposal and response activity.
4. Monitor the activation window and the first post-fork blocks.

Official signer image:

```sh
docker pull ghcr.io/stacks-network/stacks-signer:4.0.1@sha256:815b5518ec0f3a9b4c30d7fdca8f048a1fe8c263790ca65c5785e119b87d8590
```

For a new signer, generate the key offline with `stacks-cli make_keychain` or your approved key-management process. Keep the private key on the signer host; registration uses only the 33-byte compressed public key.

#### Prepare the signer-manager

Before activation:

* review and test the mainnet-configured signer-manager source your organization intends to deploy;
* record its expected canonical hash, contract name, and intended principal;
* identify the temporary software wallet used for deployment and the cold wallet that will retain admin control;
* rehearse deployment, admin rotation, grant, registration, staking, and reward claims on testnet; and
* assign owners for rewards, accounting, monitoring, and support.

The signer-manager contract connects stake to the signer, validates new stake and updates, accounts for fees and rewards, and distributes rewards. Its code is immutable after deployment. Do not deploy an unmodified `stacks-core` test fixture: the PoX-5 and sBTC principals must match mainnet.

The reference signer-manager uses Clarity 6 and cannot be deployed on mainnet until Epoch 4.0 activates at block `960,230`.

### 2. Complete the on-chain setup after activation

{% hint style="warning" %}
Use [Signer Sidekick](https://stx.fan/signer/) **only after PoX-5 is active on mainnet.** Signer Sidekick is one tool; the links below open its individual steps. Select **Mainnet** and confirm the network indicator on every page.
{% endhint %}

| Step              | Owner and action                                                                                                                                | Signer Sidekick page / signing identity                                                                  |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 1. Preflight      | Confirm the network, PoX-5 contract, balance, cycle, and signer-set minimum.                                                                    | [Preflight](https://stx.fan/signer/01-connect-preflight.html); connect the admin wallet, no transaction. |
| 2. Deploy         | Deploy the reviewed, mainnet-configured signer-manager source for your rollout. Continue only if its canonical hash matches the expected value. | [Deploy manager](https://stx.fan/signer/03-deploy-manager.html); temporary software wallet.              |
| 3. Secure admin   | Add the cold admin, reconnect as that admin, then remove the temporary deployer. Never remove the last working admin.                           | Deploy page → **Admin rotation**; temporary wallet, then cold admin.                                     |
| 4. Generate grant | On the signer host, create the one-time signer-manager grant using a fresh `auth-id`.                                                           | Signer key; off-chain command below.                                                                     |
| 5. Register       | Submit `register-self` and verify that the manager resolves to the expected signer public key.                                                  | [Register-self](https://stx.fan/signer/04-register-self.html); manager admin.                            |
| 6. Stake          | Lock STX for 1–96 cycles. The signer needs at least 50,000 STX in aggregate for the upcoming cycle; an individual stake may be smaller.         | [Stake](https://stx.fan/signer/05-stake.html); staker wallet.                                            |
| 7. Verify         | Confirm registration, grant validity, assigned STX, and eligibility for the upcoming cycle.                                                     | [Rewards + status](https://stx.fan/signer/06-rewards-status.html); read-only.                            |

Generate the grant on the signer host:

```sh
stacks-signer generate-staking-signature \
  --config <config> \
  --signer-manager <manager-principal> \
  --auth-id <unique-id> \
  --json
```

The `auth-id` must match the value used during registration. Do not accept stake until the signer-manager is registered and its signer-key grant is active; PoX-5 checks the grant on every new `stake` and `stake-update`.

### 3. Operate rewards

Under the reference manager, rewards accrue as sBTC. If a staker supplied a `pox-addr`, claiming initiates an sBTC withdrawal to that L1 Bitcoin address instead.

Reward distribution has two steps:

1. `claim-rewards` moves the signer's cycle rewards into the signer-manager.
2. `claim-staker-rewards` distributes each staker's share after fees.

Both calls are permissionless, but the pool operator should own automation, monitoring, reconciliation, and failed-withdrawal handling. The public Signer Sidekick web workflow does not yet include claim or distribution pages; agree on the operating procedure before accepting partner or user stake.

PoX-5 removes the recurring PoX-4 aggregation commitment. Participation still depends on completing registration and staking before the applicable cycle deadline.

### Security and known limitations

{% hint style="danger" %}
**Signer keys:** Never paste a signer private key or seed phrase into a website, chat, or email. Generate grants on the signer host.
{% endhint %}

* **Ledger deployment:** Ledger Stacks App versions through `0.26.17` cannot sign the Clarity 6 deployment payload. Deploy with a temporary software wallet, then rotate admin control to the Ledger or cold wallet before registration or staking.
* **Ledger staking:** Staking post-conditions require Stacks App `0.26.15` or newer. Use Deny mode with the staking post-condition. Use Allow mode only after your organization has reviewed and approved the loss of that transaction-level guardrail.
* **Interim tooling:** Signer Sidekick is unofficial, interim tooling. A reference hash match verifies source identity, not production approval. Confirm the network, manager principal, wallet identity, and final on-chain result at every step.
* **Transaction status:** A transaction ID confirms submission, not success. Verify that every deployment and contract call succeeded on-chain.
* **Troubleshooting:** Preserve signer configuration, logs, and database state when escalating an issue. Do not reset `signer.sqlite` without a diagnosed failure and an approved recovery plan.

### Readiness confirmation

You are ready when:

* the signer and any operator-run node are on `4.0.1` and healthy;
* the signer-manager is deployed after activation, its admin is secured, and its signer-key grant is active;
* at least 50,000 STX is assigned to the signer for the upcoming cycle;
* affected PoX-4 users or protocol accounts can complete a new PoX-5 stake; and
* named owners are operating reward claims, accounting, monitoring, and support.

Provide Stacks with the running versions, signer-manager principal, registration and eligibility confirmation, and an activation-window contact.

### References

* [Stacks Core `4.0.1` release](https://github.com/stacks-network/stacks-core/releases/tag/4.0.1)
* [SIP-045: PoX-5 Bitcoin Staking](https://github.com/stacksgov/sips/blob/main/sips/sip-045/sip-045-pox-5-bitcoin-staking.md)
* [PoX-5 signer integration guide](https://pox-5.vercel.app/docs/development/advanced/signers)
* [PoX-5 STX staking guide](https://pox-5.vercel.app/docs/development/solo-stx)
* [PoX-5 reference signer-manager](https://github.com/stacks-network/stacks-core/blob/4.0.1/contrib/core-contract-tests/contracts/signer-manager.clar)
* [PoX-5 contract](https://github.com/stacks-network/stacks-core/blob/4.0.1/stackslib/src/chainstate/stacks/boot/pox-5.clar)

For native BTC bonds or whitelisted sBTC community pools, use the separate [PoX-5 pools integration guide](https://pox-5.vercel.app/docs/development/pools).
