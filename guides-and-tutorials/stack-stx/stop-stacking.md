# Stop Stacking

When you decide it's time to stop stacking your STX tokens, the process depends on whether you are stacking solo or delegating your tokens to a pool operator. This guide explains the steps for both scenarios.

---

## Stopping Solo Stacking

When stacking solo using the `stack-stx` function, your STX is locked for a fixed period (the lock period) defined when you initiated stacking or when you extended the lock period. **No additional action is required to stop stacking**, you simply have to wait until the lock period expires.

{% hint style="info" %}
In solo stacking, both the `stack-stx` and `stack-extend` functions emits an event that includes the `unlock-burn-height` field. This is the burn block height at which your tokens will be automatically unlocked.
{% endhint %}

## Stopping Pooled Stacking

If you're stacking with a pool (where you delegate your STX via the `delegate-stx` function), the process to stop stacking requires one extra step before your STX is eventually unlocked.

### Step 1: Revoke Delegation

Before your STX can be unlocked, you must cancel the delegation with the pool operator. This is done by calling the `revoke-delegate-stx` function through the pool's interface, or within the [pox-4](https://explorer.hiro.so/txid/SP000000000000000000002Q6VF78.pox-4?chain=mainnet) contract.

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

Calling `revoke-delegate-stx` cancels your STX delegation, revoking the pool operator's access to further lock/stack your funds. Even after revoking the delegation, your STX will remain locked until the end of the last stacking cycle chosen by the pool (can be at most 12 cycles in the future).

{% hint style="warning" %}
Failing to revoke your delegation will mean that you continue to allow the pool to stack your STX until the reach of the burn block height mentioned in the delegate function (`delegate-stx`). Ensure that you have successfully called `revoke-delegate-stx` if you want to stop stacking sooner.
{% endhint %}

### Step 2: Wait for Funds to Unlock
After revoking your delegation, your STX tokens will still remain locked until the last stacking cycle chosen by the pool operator completes. The unlock occurs automatically at the predefined unlock burn height for that cycle.

{% hint style="info" %}
Even in pooled stacking, the unlocking mechanism follows the same blockchain timing as solo stacking. Revoking delegation only stops future stacking actions, it does not immediately unlock your tokens.
{% endhint %}

## Considerations
- Monitor Your Stacking Status: Use your wallet's interface or the [Hiro Explorer](https://explorer.hiro.so?chain=mainnet) to track the status of your lock period and confirm when your tokens are available.
- Using the API: Hiro's API offers an endpoint to [Get account STX balance](https://docs.hiro.so/stacks/api/accounts/stx-balances), which contains the `burnchain_unlock_height` height, representing the burn block height where your STX unlocks.
- Plan Ahead: Since the unlocking is bound to cycle's timing, plan your stacking period or revocation accordingly to minimize delays in accessing your funds.