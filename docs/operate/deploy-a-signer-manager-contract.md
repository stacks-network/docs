---
description: >-
  For signer-key holders and pool operators deploying and binding a
  signer-manager contract under PoX-5.
---

# Deploy a Signer Manager Contract

{% hint style="info" %}
All Clarity references on this page are pinned to [`pox-5.clar` at `stacks-core` 4.0.1](https://github.com/stacks-network/stacks-core/blob/4.0.1/stackslib/src/chainstate/stacks/boot/pox-5.clar) and to a [pinned mainnet build of the reference signer-manager](https://github.com/stx-labs/signer-sidekick/blob/214c67eae2f1ce1c3c818ab6528ce4f2e1bdc22a/contracts/reference-manager/generated/mainnet/signer-manager.clar).
{% endhint %}

### Who needs this page

Most integrators never write a signer-manager: they pick a signer and route through it, or they use the reference implementation as-is. This page is for the operator side: deploying a signer-manager contract and binding it to a signer key so stakers can route through it.

### Which key does what

Four roles are involved and they do not have to be the same key. Only the staker's wallet holds the STX being locked.

| Role           | What it does                                                                                | Holds the staked STX    | Rotation                                                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Signer key** | Signs the one-time SIP-018 grant binding the signer to a manager. Lives on the signer host. | No                      | Keep it across upgrades. Its derived Stacks principal is the only one that can revoke the grant.                               |
| **Deployer**   | Broadcasts the contract deployment and becomes the first admin automatically.               | No, only the deploy fee | Needed only if this account is not fit to stay admin. Deploy from a hardened account and it can remain admin with no rotation. |
| **Admin**      | Calls `update-fees`, `withdraw-fees` and `update-admin`. Must be an EOA calling directly.   | No                      | When rotating: add the cold admin first, remove the deployer second. Never remove the last working admin.                      |
| **Staker**     | Submits the PoX-5 `stake` transaction and delegates to the manager.                         | Yes                     | Not applicable.                                                                                                                |

### What a signer is in PoX-5

* A signer is no longer a `{ btcRewardAddress, signerKey }` tuple in a reward set. It is a **signer-manager contract**, identified in all contract state by its principal, with one associated signer key.
* Every staker (STX-only or bond participant) delegates to a signer-manager. There is no separate "solo" signer set: a solo staker is just a signer-manager with one member.
* The pox-5 contract hooks into the manager during staking actions via `validate-stake!`, replacing PoX-4's per-transaction signer signatures that scoped each call by amount, period, and pox-addr.
* Most operators do not need to write a contract at all. The reference signer-manager covers the common case: it accepts delegations, registers the signer key once, and handles reward accounting and onward distribution. Write your own only for custom needs: allowlisting members, different fee logic, custom sBTC routing.

{% hint style="warning" %}
**"Immutable" applies to the code, not the terms.** A deployed contract's Clarity source can never change, but the reference manager's _parameters_ can. An admin can call `update-fees` at any time, up to 99.99%, and `update-admin` lets any existing admin add another. Stakers should read a manager's admin set and current fee, not assume its economics are fixed.
{% endhint %}

### The `signer-manager` trait

Your contract must implement one method:

```clarity
(define-trait signer-manager-trait (
    (validate-stake!
        ;; staker, first-index, num-indexes, amount-ustx, amount-sats, is-bond, signer-calldata
        (principal uint uint uint uint bool (optional (buff 500)))
        (response bool uint)
    )
))
```

* `first-index` is a reward cycle for STX-only flows and a bond index for bond flows.
* `num-indexes` is the cycle count for STX-only, or `u1` for a bond.
* `amount-sats` is `u0` for STX-only, or the BTC commitment for bond legs.
* It is invoked only through pox-5's internal `signer-manager-validate-stake` wrapper, which raises a reentrancy guard (`signer-manager-call-active`) for the duration of the call. Any attempt to re-enter pox-5 from inside your `validate-stake!` callback fails with `ERR_REENTRANT_CALL (u49)`.
* pox-5 settles per-staker rewards itself, so your contract does not need to track staker-level accounting.

Your contract must also gate `validate-stake!` so only pox-5 can call it. The reference manager does this with:

```clarity
(define-private (authorize-pox-5)
    (ok (asserts! (is-eq contract-caller 'SP000000000000000000002Q6VF78.pox-5)
        ERR_UNAUTHORIZED_CALLER
    ))
)
```

### Deploy your contract

Deploy a Clarity contract implementing `signer-manager-trait`. The [pinned mainnet reference manager](https://github.com/stx-labs/signer-sidekick/blob/214c67eae2f1ce1c3c818ab6528ce4f2e1bdc22a/contracts/reference-manager/generated/mainnet/signer-manager.clar) is the recommended starting point. It is generated for mainnet, so its pox-5 and sBTC principals are already correct.

{% hint style="danger" %}
Do not deploy the `stacks-core` test fixture under `contrib/core-contract-tests/`. Its pox-5 and sBTC principals do not match mainnet. Verify the canonical hash of whatever source you deploy against the expected value before broadcasting, and confirm the deployed principal on-chain afterwards. A transaction ID confirms submission, not success.
{% endhint %}

The reference manager's deployer becomes its first admin automatically (`(map-set admins tx-sender true)`).

{% hint style="warning" %}
**Deploying with Ledger.** The deployment can be signed with a Ledger, so the deployer does not have to be a temporary software wallet. A wallet still builds and broadcasts the transaction; the Ledger only signs it.

Ledger Stacks App versions through `0.26.17` cannot sign a deployment payload that carries an explicit Clarity version, so leave any "force Clarity 6 payload" option switched off. With the version omitted, the node defaults the contract to Clarity 6, which it does since Epoch 4.0 activated. The Leather extension omits the version for you from version `6.107.0` onward. Stacks App `0.27.x` is expected to remove the restriction.
{% endhint %}

### Register the signer key: `register-signer`

After deployment, the signer-manager contract itself calls `pox-5::register-signer` to bind itself to a signer key.

```clarity
;; Only the signer contract itself can register itself
(asserts! (is-eq contract-caller signer)
    ERR_UNAUTHORIZED_SIGNER_REGISTRATION
)
```

`contract-caller` must equal the signer-manager. It cannot be forwarded through an intermediary contract, and it cannot be sent by an EOA on the manager's behalf. Violating this aborts with `ERR_UNAUTHORIZED_SIGNER_REGISTRATION (u26)`.

Registration also re-checks the grant first, so the grant must already be in place. [Generate a Signer Signature](stacking-stx/generate-signer-signature.md) has the `stacks-signer` command that produces it. Read the registered key back on-chain with `get-signer-info`, or via `fetchSignerInfo` in the SDK.

### Grant the signer-manager permission: `grant-signer-key`

{% stepper %}
{% step %}
#### Build the SIP-018 grant message

`get-signer-grant-message-hash` hashes a slim tuple under a domain pinned to pox-5:

```clarity
(define-constant POX_5_SIGNER_DOMAIN {
    name: "pox-5-signer",
    version: "1.0.0",
    chain-id: chain-id,
})

;; hashed alongside:
{
    topic: "grant-authorization",
    signer-manager: signer-manager,
    auth-id: auth-id,
}
```

The grant binds a signer key to a signer-manager and **nothing else**: no `max-amount`, `period`, `reward-cycle`, or `pox-addr`. The on-chain grant map is keyed only on `{ signer-key, signer-manager }`; replay protection adds `auth-id` in a separate map. This is the substantive break from PoX-4's per-transaction scoped signatures.
{% endstep %}

{% step %}
#### Sign it off-chain, then submit from the manager

The signer-key holder signs the hash off-chain with `signSignerGrant`. The **signer-manager contract** then submits `grant-signer-key`, which enforces the same caller rule as registration:

```clarity
;; Only the signer contract itself can call this function to grant a signer key
(asserts! (is-eq contract-caller signer-manager)
    ERR_UNAUTHORIZED_SIGNER_REGISTRATION
)
```

The reference manager wraps both calls in a single `register-self` entrypoint, submitting `grant-signer-key` and then `register-signer`.
{% endstep %}

{% step %}
#### Verify before submitting

* `fetchEligibleGrantSignerKey`: preflight, returns the failure reasons the call would hit
* `fetchSignerGrantMessageHash`: cross-check the hash against the chain
* `fetchVerifySignerKeyGrant`: is there already an active grant for this pair
* `fetchSignerKeyGrantUsed`: replay-guard check for a given `authId`
{% endstep %}
{% endstepper %}

```typescript
import {
  buildGrantSignerKey,
  fetchEligibleGrantSignerKey,
  signSignerGrant,
} from '@stacks/bitcoin-staking';

const signerSignature = signSignerGrant({
  signerManager,
  authId,
  chainId,
  privateKey: signer.privateKey,
});

const eligible = await fetchEligibleGrantSignerKey({
  signerKey: signer.publicKey,
  signerManager,
  authId,
  signerSignature,
  network,
});
if (!eligible.ok) {
  throw new Error('grant-signer-key would fail: u' + eligible.reasons.join(', u'));
}

const tx = await buildGrantSignerKey({
  signerKey: signer.publicKey,
  signerManager,
  authId,
  publicKey: user.stxPublicKey,
  signerSignature,
  fee: 10_000n,
  nonce,
  network,
});
```

{% hint style="danger" %}
Generate the signature on the signer host. Never paste a signer private key or seed phrase into a website, chat, or email.
{% endhint %}

{% hint style="info" %}
Builders in `@stacks/bitcoin-staking` attach no post-conditions and default to `Deny` mode. Any transaction you build that moves an asset needs explicit post-conditions.
{% endhint %}

### Revoke a grant: `revoke-signer-grant`

Takes `signer-manager` first, then `signer-key`. It must be sent **directly** by the Stacks principal derived from the signer key. `contract-caller` is the authorization, so it cannot be forwarded through an intermediary contract, and no SIP-018 message is needed:

```clarity
(asserts!
    (is-eq
        (unwrap-panic (principal-construct?
            (if is-in-mainnet
                STACKS_ADDR_VERSION_MAINNET
                STACKS_ADDR_VERSION_TESTNET
            )
            (hash160 signer-key)
        ))
        contract-caller
    )
    ERR_UNAUTHORIZED
)
```

Calling from any other principal fails with `ERR_UNAUTHORIZED (u1)`.

Revoking is not a kill switch. It blocks future `register-signer` calls for that pair, and because every new-stake entrypoint re-checks the grant, it also stops an already-registered manager accepting **new** stake. Existing positions are left alone: the manager's `signers` entry stays intact so outstanding obligations can still be settled, and those positions wind down as their bonds and stakes expire.

### Error codes

From pox-5:

| Code  | Constant                               | Meaning                                                                                                      |
| ----- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `u1`  | `ERR_UNAUTHORIZED`                     | `revoke-signer-grant` sent by a principal other than the one derived from the signer key.                    |
| `u12` | `ERR_SIGNER_KEY_GRANT_USED`            | Replay protection. `(signer-key, signer-manager, auth-id)` already used.                                     |
| `u13` | `ERR_INVALID_SIGNATURE_RECOVER`        | Could not recover a public key from the 65-byte RSV signature.                                               |
| `u14` | `ERR_INVALID_SIGNATURE_PUBKEY`         | Recovered pubkey does not match the `signer-key` argument.                                                   |
| `u17` | `ERR_SIGNER_KEY_GRANT_NOT_FOUND`       | A staking or registration entrypoint ran against a `(signer-manager, signer-key)` pair with no active grant. |
| `u26` | `ERR_UNAUTHORIZED_SIGNER_REGISTRATION` | `register-signer` or `grant-signer-key` invoked with `contract-caller != signer-manager`.                    |
| `u49` | `ERR_REENTRANT_CALL`                   | Reentrant call into pox-5 while a `signer-manager-validate-stake` call was in flight.                        |

The reference signer-manager has its own separate error namespace, which you will hit during setup rather than staking:

| Code    | Constant                  | Meaning                                                             |
| ------- | ------------------------- | ------------------------------------------------------------------- |
| `u1002` | `ERR_UNAUTHORIZED_ADMIN`  | An admin-only call from a non-admin, or proxied through a contract. |
| `u1005` | `ERR_INVALID_FEES_BIPS`   | Fee outside the allowed range.                                      |
| `u1006` | `ERR_UNAUTHORIZED_CALLER` | `validate-stake!` invoked by something other than pox-5.            |
| `u1007` | `ERR_INSUFFICIENT_FEES`   | Attempted to withdraw more fees than have accrued.                  |

### Signer fees

A signer-manager may take a commission on the rewards it distributes. This is contract-level logic, not a pox-5 protocol feature: pox-5 settles per-staker rewards to the manager, and the manager decides whether to retain a fee before onward distribution.

In the reference manager:

* `update-fees` sets the fee, in basis points. Admin-only. The default at deploy is `u0`, and the bound is one-sided: `(asserts! (< new-fees MAX_BIPS) ERR_INVALID_FEES_BIPS)` with `MAX_BIPS` of `u10000`, so any value from `u0` to `u9999` is accepted, i.e. 0% to 99.99%.
* `withdraw-fees` collects accrued fees, taking an amount and a recipient. Admin-only, and capped at what has actually accrued.

Both require a direct call from an admin EOA: `authorize-admin` asserts `(is-eq contract-caller tx-sender)`, so admin actions cannot be proxied through another contract.

The fee is a percentage of sBTC rewards, deducted before payout, including before an sBTC-to-L1 BTC withdrawal. It applies to both bond participants and STX-only stakers. A dedicated **Take a signer fee** guide covers the operator workflow in detail.
