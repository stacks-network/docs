# Stack with a Pool

This guide covers delegated stacking from the **delegator** perspective — how to delegate your STX to a pool, increase your delegation, revoke it, and stop stacking.

{% hint style="info" %}
This guide assumes you are familiar with stacking at a conceptual level. If not, read the [Stacking](https://app.gitbook.com/s/H74xqoobupBWwBsVMJhK/block-production/stacking) concept guide first.
{% endhint %}

Delegating is the most common stacking scenario. It applies when you do not meet the minimum STX threshold to solo stack and want a pool operator to stack on your behalf. This is a **non-custodial** delegation — your STX do not leave your wallet.

The minimum stacking amount is dynamic and can be found at the [pox endpoint](https://api.mainnet.hiro.so/v2/pox) under `min_threshold_ustx` (1 STX = 1,000,000 uSTX).

{% hint style="info" %}
Pool operators have control over how they implement stacking and reward distribution. Usually you will interact with a wrapper contract the pool operator has created.
{% endhint %}

If you want to operate a pool instead, see the [Operate a Pool](operate-a-pool.md) guide.

***

## Delegate to a Pool

{% stepper %}
{% step %}
#### Find a pool

The Stacks website has a [page on stacking](https://www.stacks.co/learn/stacking) that links to several pool operators. Do your research — operators differ in reward distribution, fees, and trust models.
{% endstep %}

{% step %}
#### Call `delegate-stx`

Use your pool operator's UI or call the function directly to delegate. This does not lock your STX — it gives the pool operator **permission** to stack on your behalf.

<details>

<summary>Function source code</summary>

```clojure
;; Delegate to `delegate-to` the ability to stack from a given address.
;;  This method _does not_ lock the funds, rather, it allows the delegate
;;  to issue the stacking lock.
;; The caller specifies:
;;   * amount-ustx: the total amount of ustx the delegate may be allowed to lock
;;   * until-burn-ht: an optional burn height at which this delegation expires
;;   * pox-addr: an optional address to which any rewards *must* be sent
(define-public (delegate-stx (amount-ustx uint)
                             (delegate-to principal)
                             (until-burn-ht (optional uint))
                             (pox-addr (optional { version: (buff 1), hashbytes: (buff 32) })))

    (begin
      ;; must be called directly by the tx-sender or by an allowed contract-caller
      (asserts! (check-caller-allowed)
                (err ERR_STACKING_PERMISSION_DENIED))

      ;; pox-addr, if given, must be valid
      (match pox-addr
         address
            (asserts! (check-pox-addr-version (get version address))
                (err ERR_STACKING_INVALID_POX_ADDRESS))
         true)

      ;; tx-sender must not be delegating
      (asserts! (is-none (get-check-delegation tx-sender))
        (err ERR_STACKING_ALREADY_DELEGATED))

      ;; add delegation record
      (map-set delegation-state
        { stacker: tx-sender }
        { amount-ustx: amount-ustx,
          delegated-to: delegate-to,
          until-burn-ht: until-burn-ht,
          pox-addr: pox-addr })

      (ok true)))
```

</details>

The arguments are:

* **Amount**: Denoted in uSTX (1 STX = 1,000,000 uSTX). The maximum amount the pool operator is allowed to lock.
* **Delegate to**: the STX address of the pool operator.
* **Until burn height**: optional BTC block height when the delegation expires. If not set, the delegation permission expires only when explicitly revoked.
* **Pox Address**: optional BTC address that, if specified, the pool operator must use when accepting this delegation.
{% endstep %}

{% step %}
#### Pool operator stacks your tokens

Once you've delegated, the pool operator takes over. They call `delegate-stack-stx` to lock your STX, and then `stack-aggregation-commit-indexed` to commit the pool's total to the reward cycle. Your STX will be locked at this point.

The pool operator may offer the option to automatically continue stacking for up to 12 continuous cycles.
{% endstep %}

{% step %}
#### Pool operator distributes rewards

The pool operator tracks the proportion of rewards you've earned and distributes them in BTC or STX, depending on their model. Research your pool's reward distribution mechanism to ensure you understand and trust it.
{% endstep %}
{% endstepper %}

***

## Increase Your Delegation

To increase the amount of STX you've delegated, you need to revoke your current delegation and re-delegate with a higher amount.

{% stepper %}
{% step %}
#### Revoke your current delegation

Call `revoke-delegate-stx` to cancel the existing delegation. See [Revoke and Stop Stacking](#revoke-and-stop-stacking) below for details.
{% endstep %}

{% step %}
#### Delegate with a higher amount

After the revocation is confirmed, call `delegate-stx` again with the new, higher amount to the same pool operator.

{% hint style="info" %}
Make sure the revocation is successful before initiating a new delegation. Otherwise, the `delegate-stx` transaction will fail.
{% endhint %}
{% endstep %}
{% endstepper %}

***

## Revoke and Stop Stacking

To stop stacking as a delegator, you must cancel the delegation with the pool operator by calling `revoke-delegate-stx`.

<details>

<summary>Function source code</summary>

```clojure
;; Revokes the delegation to the current stacking pool.
;; New in pox-4: Fails if the delegation was already revoked.
;; Returns the last delegation state.
(define-public (revoke-delegate-stx)
  (let ((last-delegation-state (get-check-delegation tx-sender)))
    ;; must be called directly by the tx-sender or by an allowed contract-caller
    (asserts! (check-caller-allowed)
              (err ERR_STACKING_PERMISSION_DENIED))
    (asserts! (is-some last-delegation-state) (err ERR_DELEGATION_ALREADY_REVOKED))
    (asserts! (map-delete delegation-state { stacker: tx-sender }) (err ERR_DELEGATION_ALREADY_REVOKED))
    (ok last-delegation-state)))
```

</details>

You can call this through the pool's interface or directly on the [pox-4](https://explorer.hiro.so/txid/SP000000000000000000002Q6VF78.pox-4?chain=mainnet) contract.

{% hint style="warning" %}
Revoking delegation **does not immediately unlock** your STX. Your tokens remain locked until the end of the last stacking cycle chosen by the pool operator (can be at most 12 cycles). Revoking only prevents the pool from stacking your STX in future cycles.

Failing to revoke means you continue to allow the pool to stack your STX until the burn block height specified in the `delegate-stx` call.
{% endhint %}

After revoking, wait for the current lock period to expire. The unlock occurs automatically.

***

## Liquid Stacking

Liquid stacking is when you delegate your STX to a liquid stacking provider who issues you a new token (e.g., stSTX) that you can use in the ecosystem while your STX are locked. This lets you participate in DeFi protocols even while stacking.

Links to liquid stacking providers can be found on the [Stacks website](https://www.stacks.co/learn/stacking).

***

## Considerations

* **Monitor your stacking status**: Use your wallet's interface or the [Hiro Explorer](https://explorer.hiro.so/?chain=mainnet) to track your lock period.
* **Using the API**: Hiro's API offers an endpoint to [Get account STX balance](https://docs.hiro.so/stacks/api/accounts/stx-balances), which includes the `burnchain_unlock_height` representing when your STX unlock.
* **Plan ahead**: Unlocking is bound to cycle timing. Plan your revocation accordingly to minimize delays in accessing your funds.
