---
description: >-
  How to produce the one-time signer-key grant that ties your signer to a
  signer-manager contract under PoX-5.
---

# Generate a Signer Signature

{% hint style="info" %}
Updated for Stacks 4.x and PoX-5.
{% endhint %}

PoX-5 uses a one-time **signer-key grant**. You generate one grant per signer-manager contract and submit it once. Every staking call routed through that manager then relies on it until you revoke it. There is nothing to generate per transaction, per cycle, or per staker.

The grant ties three things together: your signer node, the signer-manager contract that stakers stake to, and the pox-5 contract. Without an active grant, `stake` and every related call against your manager fails with `ERR_SIGNER_KEY_GRANT_NOT_FOUND` (u17).

### Generate the grant

Run this on the signer host, where the private key already lives:

```sh
stacks-signer generate-staking-signature \
  --config /etc/stacks-signer/config.toml \
  --signer-manager <manager-principal> \
  --auth-id <unique-id> \
  --json
```

Adjust the config path to match your setup. Replace `<manager-principal>` with your signer-manager's contract principal. Replace `<unique-id>` with a uint you have not used before for this signer key and manager pair.

The command prints JSON. It contains your public key and the signature. It does not contain your private key, which is what makes it safe to move to whatever you use to build the next transaction.

{% hint style="danger" %}
Never paste a signer private key or seed phrase into a website, a chat, or an email. Generate the grant on the signer host.
{% endhint %}

For testing, the [signer key helper](https://stx.fan/signer/02-signer-key-helper.html) produces the same JSON offline. It is useful for seeing how the grant is built. For a real deployment, prefer the CLI so the private key never leaves the host.

### Submit it on-chain

The grant is signed off-chain. It is submitted on-chain by the signer-manager contract itself, in two calls:

1. `grant-signer-key` records the grant.
2. `register-signer` binds the manager to the key.

Both require `contract-caller` to equal the signer-manager. An account cannot submit either on the contract's behalf. Trying fails with `ERR_UNAUTHORIZED_SIGNER_REGISTRATION` (u26).

The reference signer-manager wraps both into a single `register-self` entrypoint, so in practice this is one transaction. See [Deploy a Signer Manager Contract](https://docs.stacks.co/operate/deploy-a-signer-manager-contract).

The [register-self page](https://stx.fan/signer/04-register-self.html) takes a completed grant and builds that transaction for you.

### What the grant contains

The signed message carries two application fields and nothing else:

```clarity
message: { topic: "grant-authorization", signer-manager: <principal>, auth-id: <uint> }
domain:  { name: "pox-5-signer", version: "1.0.0", chain-id: <uint> }
```

* **`signer-manager`** is the contract principal the key is bound to. Every staker who later stakes through that manager relies on this one grant.
* **`auth-id`** is a replay guard. The tuple `(signer-key, signer-manager, auth-id)` can be consumed exactly once. Reusing it fails with `ERR_SIGNER_KEY_GRANT_USED` (u12). Pick a fresh value to issue a new grant.

There is no `max-amount`, `period`, `reward-cycle`, or `pox-addr` field. The grant is not scoped to a single call.

### One grant covers every entrypoint

| Entrypoint                 | Needs an active grant?                                                                  |
| -------------------------- | --------------------------------------------------------------------------------------- |
| `stake`                    | Yes                                                                                     |
| `stake-update`             | Yes, the same grant                                                                     |
| `register-for-bond`        | Yes, the same grant                                                                     |
| `update-bond-registration` | Yes. Rotating to a different signer-manager requires that manager to hold its own grant |
| `register-signer`          | No. Gated on `contract-caller == signer-manager` instead                                |

Lock period is bounded by `MAX_NUM_CYCLES` (96) at the `stake` and `register-for-bond` level, not by anything in the grant.

### Revoke a grant

`revoke-signer-grant` removes the binding. It takes `(signer-manager, signer-key)` in that order.

It must be sent directly by the Stacks principal derived from the signer key. No SIP-018 message is needed, and it cannot be forwarded through another contract. Calling it from any other principal fails with `ERR_UNAUTHORIZED` (u1).

Revoking is not a kill switch. It stops the manager accepting new stake. Existing positions are left intact and wind down as their locks expire.

### Doing it with the SDK

`@stacks/bitcoin-staking` exposes the same flow for tooling:

```typescript
import {
  signSignerGrant,
  fetchEligibleGrantSignerKey,
  buildGrantSignerKey,
} from '@stacks/bitcoin-staking';

const signerSignature = signSignerGrant({ signerManager, authId, chainId, privateKey });

const eligible = await fetchEligibleGrantSignerKey({
  signerKey, signerManager, authId, signerSignature, network,
});

const tx = await buildGrantSignerKey({
  signerKey, signerManager, authId, signerSignature, publicKey, fee, nonce, network,
});
```

The package also provides `buildSignerGrantMessage`, `computeSignerGrantHash`, and `verifySignerGrant` as pure functions, plus `fetchVerifySignerKeyGrant` and `fetchSignerKeyGrantUsed` for reading on-chain state.

### What changed from PoX-4

If you ran a signer before Epoch 4.0, you generated a fresh signature for every call, scoped to that call:

```sh
# PoX-4. No longer valid.
stacks-signer generate-stacking-signature \
  --method stack-stx --max-amount 1000000000000 --auth-id 71948271489 \
  --period 1 --reward-cycle 100 --pox-address bc1... \
  --config ./config.toml --json
```

Three things changed. The command was renamed from `generate-stacking-signature` to `generate-staking-signature`. Five scoping flags collapsed into a single `--signer-manager`. And the result is reusable, so you run it once per manager rather than once per transaction.

The old per-function signature table no longer applies. There are no `--method`, `--max-amount`, `--period`, `--reward-cycle`, or `--pox-address` flags, because a grant authorises a signer-manager rather than a specific call.
