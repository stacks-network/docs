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
* **Last updated:** July 28, 2026

{% hint style="info" %}
This guide covers STX staking under PoX-5. Native BTC bonds and whitelisted sBTC community pools follow separate integration paths. **New to the Stacks signer or upgrade process?** You don't have to do this alone — reach out to [support@stackslabs.com](mailto:support@stackslabs.com) at any point and we'll walk your team through any step.
{% endhint %}

### What changes in PoX-5

The short version of what's different before you dig into the steps.

* PoX-5 replaces PoX-4 for STX staking. Existing PoX-4 positions do not migrate automatically; affected stackers must submit a new PoX-5 stake.
* Stacks pools now operate through a signer-manager contract that receives a one-time grant from the signer key, validates stake, and manages reward distribution.
* A signer becomes eligible when at least 50,000 STX is assigned to it for the upcoming cycle. PoX-5 also removes the recurring PoX-4 aggregation commitment.

### What you need to do

Roles differ, so start by finding yours below — some organizations have more than one. Every signer operator must upgrade before activation; pool operators must also deploy and register a signer-manager after activation, then coordinate stakers' move to PoX-5.

| If you...                            | Do this                                                                                                   |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| Run `stacks-signer`                  | Upgrade to `4.0.1`, preserve the existing signer key, and verify signing health.                          |
| Run the Stacks node your signer uses | Upgrade the node to `4.0.1` and verify chain-tip parity.                                                  |
| Provide signing for a pool           | Review its signer-manager, generate the one-time signer-key grant, and verify registration.               |
| Operate a stacking pool              | Deploy and administer the pool's PoX-5 signer-manager, complete registration, and operate rewards.        |
| Stack STX                            | After the signer-manager is active, submit a PoX-5 `stake` transaction from the wallet that owns the STX. |

> **Who deploys the signer-manager?** If you deploy a PoX-5 stacking pool, you must also deploy and administer its signer-manager contract. A signer-only provider reviews the contract and provides the signer-key grant, but does not deploy or administer the manager unless explicitly agreed.

### 1. Prepare before activation

Everything in this section happens **before** the fork. The goal is to have your signer and node on `4.0.1` and your signer-manager fully rehearsed on testnet, so activation day is execution rather than discovery.

#### Upgrade the signer and node

This is the one step every operator must complete, whether or not you run a pool: if your node and signer aren't on `4.0.1` at activation, they diverge from the network. For a full walkthrough of running the signer, see [Run a signer](https://docs.stacks.co/operate/run-a-signer).

1. Upgrade `stacks-signer` to `4.0.1`. If you operate its Stacks node, upgrade that node to `4.0.1` as well. Nodes on `3.4.x` diverge after activation.
2. Preserve the existing signer configuration, private key, and database. Do not rotate the signer key or create a fresh database solely for this upgrade.
3. Restart and confirm the running version, node connectivity, expected signer slot, clean logs, and normal proposal and response activity.
4. Monitor the activation window and the first post-fork blocks.

Official signer image:

```bash
docker pull ghcr.io/stacks-network/stacks-signer:4.0.1@sha256:815b5518ec0f3a9b4c30d7fdca8f048a1fe8c263790ca65c5785e119b87d8590
```

For a new signer, generate the key offline with `stacks-cli make_keychain` or your approved key-management process. Keep the private key on the signer host; registration uses only the 33-byte compressed public key.

#### Prepare the signer-manager

The signer-manager is the on-chain contract that connects stake to the signer and handles reward accounting — pool operators deploy and administer it. Because its code cannot be changed after deployment, get the source, canonical hash, wallet roles, and test results right before you go to mainnet. For the detail behind each action here, see the [PoX-5 signer integration guide](https://pox-5.vercel.app/docs/development/advanced/signers).

Before activation:

* Use the [mainnet reference signer-manager](https://github.com/stx-labs/signer-sidekick/blob/f0248dc0be7ab2d6f2958289f05f2b0833fa871f/contracts/reference-manager/generated/mainnet/signer-manager.clar) by default. Customize it only if your integration requires different behavior. Independently review and test any custom manager; do not deploy the unmodified `stacks-core` test fixture because it is not configured for mainnet.
* Record the expected canonical SHA-256, `7fd58a7591ff0ae1643eb7e71ea2867385bcac237a3ea819f52301310c0d2e27`, the contract name, and the intended principal.
* Use a compatible wallet, such as [Leather](https://leather.io/), for deployment. If the deployment wallet will not remain the administrator, rotate admin control to your cold wallet before registration.
* In Signer Sidekick, select **Testnet** and complete steps 1–7 in the next section. Test your reward-claim procedure separately using the process under **Operate rewards**.
* Assign owners for rewards, accounting, monitoring, and support.

The signer-manager contract validates new stake and updates, accounts for fees and rewards, and distributes rewards. The reference signer-manager uses Clarity 6 and cannot be deployed on mainnet until Epoch 4.0 activates at block `960,230`.

### 2. Complete the on-chain setup after activation

This section walks through the seven on-chain steps to bring a PoX-5 stacking pool live: deploying the signer-manager, securing its admin, linking it to your signer, and staking. Complete them **in order** — several are irreversible once submitted, because the manager contract is immutable after deployment, so read the full sequence before you start.

Use [Signer Sidekick](https://stx.fan/signer/) to rehearse on **Testnet** first; select **Mainnet** only after PoX-5 is active, and confirm the network indicator on every page. Signer Sidekick is one tool; the links below open its individual steps, and the [PoX-5 signer integration guide](https://pox-5.vercel.app/docs/development/advanced/signers) covers the detail behind each one.

| Step              | Owner and action                                                                                                                                                                          | Signer Sidekick page / signing identity                                                                  |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 1. Preflight      | Confirm the network, PoX-5 contract, balance, cycle, and signer-set minimum.                                                                                                              | [Preflight](https://stx.fan/signer/01-connect-preflight.html); connect the admin wallet, no transaction. |
| 2. Deploy         | Deploy the mainnet reference signer-manager approved for your rollout. Continue only if its canonical SHA-256 matches `7fd58a7591ff0ae1643eb7e71ea2867385bcac237a3ea819f52301310c0d2e27`. | [Deploy manager](https://stx.fan/signer/03-deploy-manager.html); deployment wallet.                      |
| 3. Secure admin   | Add the cold admin, reconnect as that admin, then remove the temporary deployer. Never remove the last working admin.                                                                     | Deploy page → **Admin rotation**; deployment wallet, then cold admin if needed.                          |
| 4. Generate grant | On the signer host, create the one-time signer-manager grant using a fresh `auth-id`.                                                                                                     | Signer key; off-chain command below.                                                                     |
| 5. Register       | Submit `register-self` and verify that the manager resolves to the expected signer public key.                                                                                            | [Register-self](https://stx.fan/signer/04-register-self.html); manager admin.                            |
| 6. Stake          | Lock STX for 1–96 cycles. The signer needs at least 50,000 STX in aggregate for the upcoming cycle; an individual stake may be smaller.                                                   | [Stake](https://stx.fan/signer/05-stake.html); staker wallet.                                            |
| 7. Verify         | Confirm registration, grant validity, assigned STX, and eligibility for the upcoming cycle.                                                                                               | [Rewards + status](https://stx.fan/signer/06-rewards-status.html); read-only.                            |

New to these actions? The [PoX-5 signer integration guide](https://pox-5.vercel.app/docs/development/advanced/signers) and [PoX-5 STX staking guide](https://pox-5.vercel.app/docs/development/solo-stx) give step-by-step detail behind each Signer Sidekick page.

Generate the grant on the signer host:

```bash
stacks-signer generate-staking-signature \
  --config <config> \
  --signer-manager <manager-principal> \
  --auth-id <unique-id> \
  --json
```

The `auth-id` must match the value used during registration. Do not accept stake until the signer-manager is registered and its signer-key grant is active; PoX-5 checks the grant on every new `stake` and `stake-update`.

### 3. Operate rewards

Once your signer is earning, rewards don't distribute themselves — this section covers how they flow and what you're responsible for operating. Read it before you accept partner or user stake, since the claim and distribution workflow isn't yet in the guided tool.

Under the reference manager, rewards accrue as sBTC. If a staker supplied a `pox-addr`, claiming initiates an sBTC withdrawal to that L1 Bitcoin address instead.

Reward distribution has two steps:

1. `claim-rewards` moves the signer's cycle rewards into the signer-manager.
2. `claim-staker-rewards` distributes each staker's share after fees.

Both calls are permissionless, but the pool operator should own automation, monitoring, reconciliation, and failed-withdrawal handling. The public Signer Sidekick web workflow does not yet include claim or distribution pages; agree on the operating procedure before accepting partner or user stake.

PoX-5 removes the recurring PoX-4 aggregation commitment. Participation still depends on completing registration and staking before the applicable cycle deadline.

### Security and known limitations

Skim these before you deploy or stake. They're the failure modes and tooling caveats most likely to catch a first-time PoX-5 rollout — especially around Ledger and key handling.

* **Signer keys:** Never paste a signer private key or seed phrase into a website, chat, or email. Do not reveal them in a screen-sharing session or screenshot. Generate grants on the signer host.
* **Ledger deployment:** Leave **Force Clarity 6 payload (`0x06`)** off. After Epoch 4.0 activates, the network applies Clarity 6 to the standard deployment payload, which Ledger can sign. Use the forced `0x06` payload only to test a Ledger version that supports it.
* **Ledger staking:** Staking post-conditions require Stacks App `0.26.15` or newer. Use Deny mode with the staking post-condition. Use Allow mode only after your organization has reviewed and approved the loss of that transaction-level guardrail.
* **Interim tooling:** Signer Sidekick is the guided workflow for this rollout. A reference hash match verifies source identity, not production approval. Confirm the network, manager principal, wallet identity, and final on-chain result at every step.
* **Transaction status:** A transaction ID confirms submission, not success. Verify that every deployment and contract call succeeded on-chain.
* **Troubleshooting:** Preserve signer configuration, logs, and database state when escalating an issue. Do not reset `signer.sqlite` without a diagnosed failure and an approved recovery plan.

### Readiness confirmation

Use this as your go/no-go checklist before activation. You are ready when:

* The signer and any operator-run node are on `4.0.1` and healthy;
* The signer-manager is deployed after activation, its admin is secured, and its signer-key grant is active;
* At least 50,000 STX is assigned to the signer for the upcoming cycle;
* Affected PoX-4 users or protocol accounts can complete a new PoX-5 stake; and
* Named owners are operating reward claims, accounting, monitoring, and support.

Provide Stacks with the running versions, signer-manager principal, registration and eligibility confirmation, and an activation-window contact.

### References

* [Stacks Core 4.0.1 release](https://github.com/stacks-network/stacks-core/releases/tag/4.0.1)
* [SIP-045: PoX-5 Bitcoin Staking](https://github.com/stacksgov/sips/blob/main/sips/sip-045/sip-045-pox-5-bitcoin-staking.md)
* [PoX-5 signer integration guide](https://pox-5.vercel.app/docs/development/advanced/signers)
* [PoX-5 STX staking guide](https://pox-5.vercel.app/docs/development/solo-stx)
* [PoX-5 mainnet reference signer-manager](https://github.com/stx-labs/signer-sidekick/blob/f0248dc0be7ab2d6f2958289f05f2b0833fa871f/contracts/reference-manager/generated/mainnet/signer-manager.clar)
* [PoX-5 contract](https://github.com/stacks-network/stacks-core/blob/4.0.1/stackslib/src/chainstate/stacks/boot/pox-5.clar)

For native BTC bonds or whitelisted sBTC community pools, use the separate [PoX-5 pools integration guide](https://pox-5.vercel.app/docs/development/pools).

**Questions or need help at any step?** Contact [support@stackslabs.com](mailto:support@stackslabs.com) — we're glad to review your setup or walk your team through the upgrade.
