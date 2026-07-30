---
description: >-
  How a signer or pool operator sets and collects a commission on sBTC staking
  rewards.
---

# Take a Signer Fee

{% hint style="info" %}
All Clarity on this page comes from a [pinned mainnet build of the reference signer-manager](https://github.com/stx-labs/signer-sidekick/blob/214c67eae2f1ce1c3c818ab6528ce4f2e1bdc22a/contracts/reference-manager/generated/mainnet/signer-manager.clar). If you deploy a different contract, its fee behaviour is whatever you wrote — see [Deploy a Signer Manager Contract](deploy-a-signer-manager-contract.md).
{% endhint %}

A signer can take a percentage of the sBTC rewards it distributes. This is the **pool fee**: running a Stacks node and signer software costs money, and the fee is how an operator covers that and claims on behalf of the people staking through them.

A signer and a pool operator are usually the same party, but they don't have to be. Anyone can stake to a signer-manager contract, so any signer-manager can accumulate members whether or not it markets itself as a pool.

The fee applies to both bond participants and STX-only stakers, and it is deducted before payout — including before an sBTC-to-L1 BTC withdrawal, so choosing native BTC payouts does not avoid it.

### Where the fee lives

The fee is a setting on your signer-manager contract, stored in basis points:

```clarity
;; Fees taken, in basis points, from rewards
(define-data-var fees-bips uint u0)
```

It defaults to `u0`, so a freshly deployed manager takes nothing until an admin sets it.

pox-5 settles per-staker rewards to your manager; your manager decides what to retain before distributing onward. Nothing about the fee is enforced or capped by pox-5 itself.

### Set the fee — `update-fees`

```clarity
(define-public (update-fees (new-fees uint))
    (begin
        (try! (authorize-admin))
        (asserts! (< new-fees MAX_BIPS) ERR_INVALID_FEES_BIPS)
        ...
        (var-set fees-bips new-fees)
        (ok true)
    )
)
```

Admin-only. The bound is one-sided and strict — `MAX_BIPS` is `u10000`, and `new-fees` must be _less than_ it — so the accepted range is `u0` to `u9999`, i.e. 0% to 99.99%.

There is no minimum, so an admin can also set the fee back to `u0`. There is no timelock and no cap on how much the fee can move in one call.

| Value   | Fee              |
| ------- | ---------------- |
| `u0`    | 0% (default)     |
| `u100`  | 1%               |
| `u500`  | 5%               |
| `u9999` | 99.99% (maximum) |

### Collect accrued fees — `withdraw-fees`

```clarity
(define-public (withdraw-fees
        (amount uint)
        (recipient principal)
    )
    (let ((fees (var-get earned-fees)))
        (try! (authorize-admin))
        (asserts! (<= amount fees) ERR_INSUFFICIENT_FEES)
        ...
    )
)
```

Admin-only. Takes an amount and a recipient, and transfers sBTC out of the contract. You cannot withdraw more than has actually accrued — check the balance first with the `get-earned-fees` read-only.

{% hint style="warning" %}
There is no function named `claim-fees`. The contract does expose `claim-rewards` and `claim-staker-rewards`, but those are permissionless staker-side calls for distributing rewards — not the admin fee withdrawal. Use `withdraw-fees`.
{% endhint %}

### Both calls require a direct admin transaction

```clarity
(define-private (authorize-admin)
    (ok (asserts! (and (is-eq contract-caller tx-sender) (is-admin tx-sender))
        ERR_UNAUTHORIZED_ADMIN
    ))
)
```

The `(is-eq contract-caller tx-sender)` clause means admin actions cannot be proxied through another contract — they must be sent directly from an admin account. The contract's deployer becomes the first admin automatically, and any existing admin can add or remove others with `update-admin`.

Rotate admin control to a cold wallet before accepting stake, and never remove the last working admin.

### How the fee is applied

The fee is a straight basis-point cut of the staker's gross rewards for a cycle:

```clarity
(fees (/ (* gross (get-fee-bips-for-cycle reward-cycle bond-index))
    MAX_BIPS
))
```

Note it reads `get-fee-bips-for-cycle`, not the live `fees-bips` variable. The rate is recorded per reward cycle and bond index, and cycles with no recorded rate default to zero:

```clarity
(define-read-only (get-fee-bips-for-cycle
        (reward-cycle uint)
        (bond-index (optional uint))
    )
    (default-to u0
        (map-get? fee-bips-for-cycle {
            reward-cycle: reward-cycle,
            bond-index: bond-index,
        })
    )
)
```

{% hint style="warning" %}
**Confirm the timing before you rely on it.** Because the applied rate comes from a per-cycle record rather than the current variable, calling `update-fees` does not obviously repopulate already-recorded cycles — which is good for stakers, but it means "when does a fee change take effect?" is not answerable from `update-fees` alone. Verify against your own deployment on testnet before announcing a fee change to members.
{% endhint %}

### Choosing a fee

Pools commonly charge a low single-digit percentage, around 5%, which covers node and signer running costs.

The headroom above that exists for a reason: a pool can be set up around a specific goal, where members deliberately commit their rewards to a cause, with the fee set far higher — up to the full 99.99%. Because the rate is public on-chain and readable at any time, members can verify what a pool charges before staking to it.

### Read-only helpers

| Function                       | Returns                                                           |
| ------------------------------ | ----------------------------------------------------------------- |
| `get-earned-fees`              | sBTC accrued to the admin and not yet withdrawn                   |
| `get-fee-bips-for-cycle`       | The rate actually applied for a given reward cycle and bond index |
| `is-admin`                     | Whether a principal is an admin on this manager                   |
| `get-unclaimed-staker-rewards` | A staker's rewards not yet claimed                                |

### Error codes

| Code    | Constant                 | Meaning                                                             |
| ------- | ------------------------ | ------------------------------------------------------------------- |
| `u1002` | `ERR_UNAUTHORIZED_ADMIN` | Caller is not an admin, or the call was proxied through a contract. |
| `u1005` | `ERR_INVALID_FEES_BIPS`  | `new-fees` was `u10000` or higher.                                  |
| `u1007` | `ERR_INSUFFICIENT_FEES`  | Tried to withdraw more than has accrued.                            |
| `u1010` | `ERR_NO_REFUNDS`         | `sweep-fee-refunds` called with nothing to sweep.                   |
