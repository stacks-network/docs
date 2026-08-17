---
description: >-
  One-time setup before staking — bond parameter submission and contract-caller
  authorizations.
---

# Onboarding

Onboarding covers the bootstrapping transactions a staker, signer-manager, or admin sends _before_ a position is opened. None of these calls move yield-bearing capital — they configure who is allowed to do what.

Signer-key grants and revocations live on the [Advanced › Signers](advanced/signers.md) page, since not every integrator runs signer infrastructure.

### Submit bond parameters to the Endowment

The bond itself is configured by the Stacks [Endowment](../glossary.md#endowment-stacks-endowment) — they own the `setup-bond` call and the on-chain allowlist. As an integrator, you don't run this transaction. You submit the parameters you need to the Endowment and they publish them on-chain \~7 days before D0.

What to send them per bond your users participate in:

* **Staker principal** — the Stacks address that will register the bond and receive rewards (one row per participant in the allowlist).
* **`maxSats`** — the maximum BTC (in sats) that staker is allowed to commit for this bond. The required uSTX side is derived per-registration via `min-ustx-for-sats-amount(maxSats, stxValueRatio, minUstxRatioBps)`; no separate `maxUstx` cap is stored.
* **Signer manager / signer key**, if you operate signing infrastructure your users will route through (covered below).
* **Reward address preference** — sBTC default vs. L1 BTC opt-out, if applicable to your users.

The bond itself also carries **`earlyUnlockBytes`** — the early-exit subscript embedded in the L1 lockup script. It is a pre-pushed Bitcoin script fragment that authorises the BTC-side early-exit spend; its result is consumed by the shared `OP_VERIFY` after `OP_ENDIF`, so it **must leave a valid boolean on the stack** — e.g. `<pubkey> OP_CHECKSIG`, or an M-of-N `OP_CHECKMULTISIG` template. The Stacks-side early-exit announcement is made by the staker themselves via `announce-l1-early-exit`; there is no separately stored L2 admin principal.

Once published, the on-chain `bondIndex` plus your allowlist row is what every downstream flow on this page assumes. Read it back with `fetchBond` to confirm the bond's `targetRateBps`, `stxValueRatio`, `minUstxRatioBps`, and `earlyUnlockBytes` match what was agreed.

**Timing and finality of `setup-bond`** (distinct from the \~7-day off-chain publish above):

* It can only be called within **2 cycles** (`BOND_GAP_CYCLES`) before the bond's start block — earlier reverts with `ERR_CANNOT_SETUP_BOND_TOO_SOON`, after the start block with `ERR_CANNOT_SETUP_BOND_TOO_LATE`.
* It can only be called **once** per bond — a second call reverts with `ERR_BOND_ALREADY_SETUP`. Parameters and the allowlist are fixed for the period once set.
* Calling it is what **opens registration**: only after `setup-bond` lands can allowlisted participants call `register-for-bond`.

### Rotate the bond admin

The `bond-admin` principal is the only caller allowed to run `setup-bond` — and to hand the role to a new principal via `set-bond-admin`. Like `setup-bond`, this is an Endowment operation; you only run it if you hold the role (e.g. when migrating it to a multisig). The single gate is that the sender must be the current admin, so the pre-check reduces to one comparison:

```ts
import { buildSetBondAdmin, fetchEligibleSetBondAdmin } from '@stacks/bitcoin-staking';
import { broadcastTransaction, fetchNonce, signTransaction } from '@stacks/transactions';

const network = 'mainnet';

const eligible = await fetchEligibleSetBondAdmin({ caller: admin.stxAddress, network });
if (!eligible.ok) throw new Error('set-bond-admin would fail: u' + eligible.reasons.join(', u'));

const tx = await buildSetBondAdmin({
  newAdmin: 'SP000…MULTISIG', // e.g. hand the role to a multisig
  publicKey: admin.stxPublicKey,
  fee: 10_000n,
  nonce: await fetchNonce({ address: admin.stxAddress, network }),
  network,
});

await broadcastTransaction({
  transaction: signTransaction(tx, admin.stxPrivateKey),
  network,
});
```

Read the current admin back with `fetchBondAdmin` to confirm the rotation landed. Anyone other than the current admin gets `ERR_UNAUTHORIZED`.
