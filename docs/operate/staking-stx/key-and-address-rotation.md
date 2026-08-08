# Key and Address Rotation

This guide covers how and when to rotate your signer key, Bitcoin reward address, and pool operator key. Understanding the differences between these keys and the constraints around rotating them is important for long-term operations.

***

## Definitions

* **Signer key**: the cryptographic key used by the signer software to participate in block validation and DKG. Configured as `stacks_private_key` in the signer configuration.
* **Bitcoin reward address (PoX address)**: the BTC address where stacking rewards are sent.
* **Pool operator key**: the STX address used by a pool operator to make stacking transactions (`delegate-stack-stx`, `stack-aggregation-commit-indexed`, etc.). This is separate from the signer key.

{% hint style="info" %}
The signer key and pool operator key may belong to the same entity, but they should be **separate keys**. See the pool operator key section below for why.
{% endhint %}

***

## Rotate a Signer Key

You can rotate your signer key without needing to stop stacking. This is done through specific stacking function calls that accept a new signer key as a parameter.

### Solo stackers

When calling `stack-extend`, you can pass a new `signer-key`. The new key will be used for the extended cycles. You will also need a new [signer signature](generate-signer-signature.md) generated with the new key.

When calling `stack-increase`, you can also pass a new `signer-key`.

{% hint style="warning" %}
You cannot rotate your signer key mid-cycle. The rotation takes effect in the next cycle when the new stacking parameters are applied.
{% endhint %}

### Pool operators

When calling `stack-aggregation-commit-indexed` for a new reward cycle, you can pass a new `signer-key`. This associates the new key with the pool for that cycle.

{% hint style="info" %}
The pox-4 contract is designed to support rotating the signer key without needing your stackers to un-stack and re-stack. This is one of the key advantages of keeping the signer key separate from the pool operator key.
{% endhint %}

### After rotating

After rotating your signer key, you must also update your signer software configuration to use the new `stacks_private_key`. Restart the signer software to apply the change.

Make sure the new signer is running before the prepare phase of the cycle where the new key takes effect.

***

## Rotate a Bitcoin Reward Address

You can change the Bitcoin address where you receive stacking rewards when making certain stacking function calls.

### Solo stackers

* **`stack-extend`**: accepts a `pox-addr` parameter. You can pass a new BTC address, and rewards for the extended cycles will be sent there.
* **`stack-stx`**: when starting a new stacking position (after a previous one has unlocked), you can specify any BTC address.

### Pool operators

* **`stack-aggregation-commit-indexed`**: accepts a `pox-addr` parameter. You can use a different BTC address for each reward cycle you commit to.
* **`delegate-stack-stx`**: accepts a `pox-addr` parameter. If the delegator specified a required BTC address in their `delegate-stx` call, you must use that address.

{% hint style="info" %}
Changing the BTC address does not affect previously committed reward cycles. The new address only applies to newly committed cycles.
{% endhint %}

***

## Pool Operator Key

The pool operator key (the STX address used for making stacking transactions) **cannot be rotated** without delegators needing to un-stack and re-delegate to the new address.

This is because the `delegate-stx` function records the specific pool operator address that the delegator authorizes. If the pool operator changes their address, all existing delegations are no longer valid for the new address.

### Why this matters

If your pool operator key is compromised, every delegator must:

1. Wait for their current lock period to expire
2. Call `revoke-delegate-stx` to cancel the old delegation
3. Call `delegate-stx` with the new pool operator address

This is disruptive and time-consuming, which is why it is **strongly recommended** to keep the pool operator key separate from the signer key.

### Recommendations

{% stepper %}
{% step %}
#### Use separate keys

Keep your signer key and pool operator key separate. The signer key can be rotated through stacking transactions, while the pool operator key should be treated as a long-lived identity.
{% endstep %}

{% step %}
#### Secure the pool operator key

Since the pool operator key is harder to rotate, secure it with a hardware wallet or other cold-storage mechanism. The benefit of a separate pool operator key is that it can easily be used in existing wallets, including hardware wallets like Ledger.
{% endstep %}

{% step %}
#### Limit signer key exposure

The signer key is stored on a server running the signer software. Rotate it periodically and follow the [OpSec Best Practices](../run-a-signer/opsec-best-practices.md) to minimize the risk of compromise.
{% endstep %}
{% endstepper %}
