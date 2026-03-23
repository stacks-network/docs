# Operate a Pool

This guide covers how to operate a stacking pool: accepting delegated STX from stackers, committing them to reward cycles, and managing the pool's stacked position.

{% hint style="info" %}
This guide assumes you are familiar with stacking at a conceptual level. If not, read the [Stacking](https://app.gitbook.com/s/H74xqoobupBWwBsVMJhK/block-production/stacking) concept guide first.
{% endhint %}

If you want to delegate your STX to a pool instead, see the [Stack with a Pool](stack-with-a-pool.md) guide.

***

## Prerequisites

1. **A running signer** or a signer you are collaborating with. See the [Run a Signer](../run-a-signer/) guide.
2. **A pool operator wallet**: a separate STX address used to manage delegations and make stacking transactions. This is different from your signer key. See [Key and Address Rotation](key-and-address-rotation.md) for why this separation matters.
3. **Funding**: your pool operator wallet needs enough STX to cover transaction fees.

{% hint style="info" %}
As a pool operator, you should have two separate accounts:

* **Pool operator account**: used for all stacking operations (`delegate-stack-stx`, `stack-aggregation-commit-indexed`, etc.).
* **Signer account**: the key used to configure your signer. The signer public key is what you pass into the aggregation commit function.

This separation is recommended because you can rotate a signer key without disrupting delegations, but you cannot rotate a pool operator key without delegators needing to un-stack and re-delegate. See [Key and Address Rotation](key-and-address-rotation.md) for more details.
{% endhint %}

Set up your pool operator wallet using any Stacks wallet such as [Leather](https://leather.io/) or [Xverse](https://www.xverse.app/). Share this wallet's STX address with parties that will delegate to you.

For improved UX, you might use the helper contract [pox4-pools](https://explorer.hiro.so/txid/SP001SFSMC2ZY76PD4M68P3WGX154XCH7NE3TYMX.pox4-pools?chain=mainnet) and add your pool to [earn.leather.io](https://earn.leather.io/).

{% hint style="info" %}
There are several ways to make stacking transactions. This guide covers using [Leather Earn](https://earn.leather.io/), which is the simplest option. You can also call the functions directly from the [deployed contract](https://explorer.hiro.so/txid/SP000000000000000000002Q6VF78.pox-4?chain=mainnet), or use the [@stacks/stacking](https://github.com/stx-labs/stacks.js/tree/main/packages/stacking) NPM package.
{% endhint %}

***

## Accept Delegations

After a delegator calls `delegate-stx` (see [Stack with a Pool](stack-with-a-pool.md)), you as the pool operator call `delegate-stack-stx` to commit each delegator's STX. This must be called for every individual stacker.

<details>

<summary>Function source code</summary>

```clojure
;; As a delegate, stack the given principal's STX using partial-stacked-by-cycle
;; Once the delegate has stacked > minimum, the delegate should call stack-aggregation-commit
(define-public (delegate-stack-stx (stacker principal)
                                   (amount-ustx uint)
                                   (pox-addr { version: (buff 1), hashbytes: (buff 32) })
                                   (start-burn-ht uint)
                                   (lock-period uint))
    ;; this stacker's first reward cycle is the _next_ reward cycle
    (let ((first-reward-cycle (+ u1 (current-pox-reward-cycle)))
          (specified-reward-cycle (+ u1 (burn-height-to-reward-cycle start-burn-ht)))
          (unlock-burn-height (reward-cycle-to-burn-height (+ (current-pox-reward-cycle) u1 lock-period))))
      ;; the start-burn-ht must result in the next reward cycle, do not allow stackers
      ;;  to "post-date" their `stack-stx` transaction
      (asserts! (is-eq first-reward-cycle specified-reward-cycle)
                (err ERR_INVALID_START_BURN_HEIGHT))

      ;; must be called directly by the tx-sender or by an allowed contract-caller
      (asserts! (check-caller-allowed)
        (err ERR_STACKING_PERMISSION_DENIED))

      ;; stacker must have delegated to the caller
      (let ((delegation-info (unwrap! (get-check-delegation stacker) (err ERR_STACKING_PERMISSION_DENIED))))
        ;; must have delegated to tx-sender
        (asserts! (is-eq (get delegated-to delegation-info) tx-sender)
                  (err ERR_STACKING_PERMISSION_DENIED))
        ;; must have delegated enough stx
        (asserts! (>= (get amount-ustx delegation-info) amount-ustx)
                  (err ERR_DELEGATION_TOO_MUCH_LOCKED))
        ;; if pox-addr is set, must be equal to pox-addr
        (asserts! (match (get pox-addr delegation-info)
                         specified-pox-addr (is-eq pox-addr specified-pox-addr)
                         true)
                  (err ERR_DELEGATION_POX_ADDR_REQUIRED))
        ;; delegation must not expire before lock period
        (asserts! (match (get until-burn-ht delegation-info)
                         until-burn-ht (>= until-burn-ht
                                           unlock-burn-height)
                      true)
                  (err ERR_DELEGATION_EXPIRES_DURING_LOCK))
        )

      ;; stacker principal must not be stacking
      (asserts! (is-none (get-stacker-info stacker))
        (err ERR_STACKING_ALREADY_STACKED))

      ;; the Stacker must have sufficient unlocked funds
      (asserts! (>= (stx-get-balance stacker) amount-ustx)
        (err ERR_STACKING_INSUFFICIENT_FUNDS))

      ;; ensure that stacking can be performed
      (try! (minimal-can-stack-stx pox-addr amount-ustx first-reward-cycle lock-period))

      ;; register the PoX address with the amount stacked via partial stacking
      ;;   before it can be included in the reward set, this must be committed!
      (add-pox-partial-stacked pox-addr first-reward-cycle lock-period amount-ustx)

      ;; add stacker record
      (map-set stacking-state
        { stacker: stacker }
        { pox-addr: pox-addr,
          first-reward-cycle: first-reward-cycle,
          reward-set-indexes: (list),
          lock-period: lock-period,
          delegated-to: (some tx-sender) })

      ;; return the lock-up information, so the node can actually carry out the lock.
      (ok { stacker: stacker,
            lock-amount: amount-ustx,
            unlock-burn-height: unlock-burn-height })))
```

</details>

The arguments are:

* **Stacker**: the STX address of the delegator
* **Amount**: denoted in uSTX (1 STX = 1,000,000 uSTX)
* **Pox Address**: the BTC address where you will receive rewards. If the delegator specified a BTC address in their `delegate-stx` call, you must use that same address.
* **Start burn height**: the current BTC block height (add 1 or 2 to the current height when initiating the transaction). The delegation will not actively be stacked at this height, but at whatever reward cycle is committed in the aggregation commit step.
* **Lock period**: number of cycles to lock for (maximum 12). If the delegator specified an expiration burn height, the lock period cannot extend past that.

This step also lets you choose which stackers to accept. For closed pools, only call this function for approved stackers.

You can repeat this for multiple stackers before proceeding to the commit step.

***

## Commit Delegated STX

Once the total delegated STX exceeds the minimum stacking threshold, call `stack-aggregation-commit-indexed` to commit the pool's aggregate balance to a reward cycle. This is when you provide your signer key and signature.

{% hint style="info" %}
The minimum stacking threshold can be found at [https://api.hiro.so/v2/pox](https://api.hiro.so/v2/pox) under `min_threshold_ustx` (1 STX = 1,000,000 uSTX).
{% endhint %}

{% hint style="info" %}
Use `stack-aggregation-commit-indexed` instead of the legacy `stack-aggregation-commit`. The indexed version returns the reward index, which is required if you later need to call `stack-aggregation-increase`.
{% endhint %}

<details>

<summary>Function source code</summary>

Note that `stack-aggregation-commit-indexed` wraps `inner-stack-aggregation-commit`. The inner function is shown here.

```clojure
;; Commit partially stacked STX and allocate a new PoX reward address slot.
;;   This allows a stacker/delegate to lock fewer STX than the minimal threshold in multiple transactions,
;;   so long as: 1. The pox-addr is the same.
;;               2. This "commit" transaction is called _before_ the PoX anchor block.
;;   This ensures that each entry in the reward set returned to the stacks-node is greater than the threshold,
;;   but does not require it be all locked up within a single transaction
;;
;; Returns (ok uint) on success, where the given uint is the reward address's index in the list of reward
;; addresses allocated in this reward cycle.  This index can then be passed to `stack-aggregation-increase`
;; to later increment the STX this PoX address represents, in amounts less than the stacking minimum.
;;
;; *New in Stacks 2.1.*
(define-private (inner-stack-aggregation-commit (pox-addr { version: (buff 1), hashbytes: (buff 32) })
                                                (reward-cycle uint)
                                                (signer-sig (optional (buff 65)))
                                                (signer-key (buff 33))
                                                (max-amount uint)
                                                (auth-id uint))
  (let ((partial-stacked
         ;; fetch the partial commitments
         (unwrap! (map-get? partial-stacked-by-cycle { pox-addr: pox-addr, sender: tx-sender, reward-cycle: reward-cycle })
                  (err ERR_STACKING_NO_SUCH_PRINCIPAL))))
    ;; must be called directly by the tx-sender or by an allowed contract-caller
    (asserts! (check-caller-allowed)
              (err ERR_STACKING_PERMISSION_DENIED))
    (let ((amount-ustx (get stacked-amount partial-stacked)))
      (try! (consume-signer-key-authorization pox-addr reward-cycle "agg-commit" u1 signer-sig signer-key amount-ustx max-amount auth-id))
      (try! (can-stack-stx pox-addr amount-ustx reward-cycle u1))
      ;; Add the pox addr to the reward cycle, and extract the index of the PoX address
      ;; so the delegator can later use it to call stack-aggregation-increase.
      (let ((add-pox-addr-info
                (add-pox-addr-to-ith-reward-cycle
                   u0
                   { pox-addr: pox-addr,
                     first-reward-cycle: reward-cycle,
                     num-cycles: u1,
                     reward-set-indexes: (list),
                     stacker: none,
                     signer: signer-key,
                     amount-ustx: amount-ustx,
                     i: u0 }))
           (pox-addr-index (unwrap-panic
                (element-at (get reward-set-indexes add-pox-addr-info) u0))))

        ;; don't update the stacking-state map,
        ;;  because it _already has_ this stacker's state
        ;; don't lock the STX, because the STX is already locked
        ;;
        ;; clear the partial-stacked state, and log it
        (map-delete partial-stacked-by-cycle { pox-addr: pox-addr, sender: tx-sender, reward-cycle: reward-cycle })
        (map-set logged-partial-stacked-by-cycle { pox-addr: pox-addr, sender: tx-sender, reward-cycle: reward-cycle } partial-stacked)
        (ok pox-addr-index)))))
```

</details>

The arguments are:

* **Pox Address**: the BTC address to receive rewards
* **Reward-cycle**: the future reward cycle to commit for
* **Signer public key**: the public key of your signer (this is how you associate your pool operator address with your signer)
* **Signer signature**: a signature proving control of your signing key (see [Generate a Signer Signature](generate-signer-signature.md))
* **Max Amount**: used to validate the signer signature
* **Auth Id**: used to validate the signer signature

{% hint style="info" %}
The `delegate-stack-stx` function sets the stacker's first reward cycle to the _next_ reward cycle. When generating your signature and calling `stack-aggregation-commit-indexed`, make sure the reward cycles match.

For example, if you are in cycle 557 when calling `delegate-stack-stx`, pass cycle 558 or higher in both your signature and your `stack-aggregation-commit-indexed` transaction.

For solo stacking methods, you use the current reward cycle in the signature. For `stack-aggregation-commit-indexed`, you use the target reward cycle because you can commit for future cycles, not just N+1.
{% endhint %}

Once this succeeds, your pool is eligible for reward slots in that cycle. All steps up to this point must be completed before the prepare phase begins.

### Using Leather Earn

Pool operators can log in to Leather Earn and visit [https://earn.leather.io/pool-admin](https://earn.leather.io/pool-admin) to manage pool operations:

* **delegate-stack-stx**: After a user delegates, call this for each individual stacker.
* **stack-aggregation-commit**: Enter the reward cycle, BTC address, signer public key, signer key signature, Auth ID, and Max amount. This must be done for every individual reward cycle where the pool will be acting as a signer.

***

## Increase Committed Amount

Even after committing, you can increase the total committed STX when new delegations are received.

{% stepper %}
{% step %}
#### Update the delegator's locked amount

Call `delegate-stack-increase` for each delegator whose locked amount needs to increase.

<details>

<summary>Function source code</summary>

```clojure
;; As a delegator, increase an active Stacking lock, issuing a "partial commitment" for the
;;   increased cycles.
;; *New in Stacks 2.1*
;; This method increases `stacker`'s current lockup and partially commits the additional
;;   STX to `pox-addr`
(define-public (delegate-stack-increase
                    (stacker principal)
                    (pox-addr { version: (buff 1), hashbytes: (buff 32) })
                    (increase-by uint))
    (let ((stacker-info (stx-account stacker))
          (existing-lock (get locked stacker-info))
          (available-stx (get unlocked stacker-info))
          (unlock-height (get unlock-height stacker-info)))

     ;; must be called with positive `increase-by`
     (asserts! (>= increase-by u1)
               (err ERR_STACKING_INVALID_AMOUNT))

     (let ((unlock-in-cycle (burn-height-to-reward-cycle unlock-height))
           (cur-cycle (current-pox-reward-cycle))
           (first-increase-cycle (+ cur-cycle u1))
           (last-increase-cycle (- unlock-in-cycle u1))
           (cycle-count (try! (if (<= first-increase-cycle last-increase-cycle)
                                  (ok (+ u1 (- last-increase-cycle first-increase-cycle)))
                                  (err ERR_STACKING_INVALID_LOCK_PERIOD))))
           (new-total-locked (+ increase-by existing-lock))
           (stacker-state
                (unwrap! (map-get? stacking-state { stacker: stacker })
                 (err ERR_STACK_INCREASE_NOT_LOCKED))))

      ;; must be called directly by the tx-sender or by an allowed contract-caller
      (asserts! (check-caller-allowed)
        (err ERR_STACKING_PERMISSION_DENIED))

      ;; stacker must not be directly stacking
      (asserts! (is-eq (len (get reward-set-indexes stacker-state)) u0)
                (err ERR_STACKING_NOT_DELEGATED))

      ;; stacker must be delegated to tx-sender
      (asserts! (is-eq (unwrap! (get delegated-to stacker-state)
                                (err ERR_STACKING_NOT_DELEGATED))
                       tx-sender)
                (err ERR_STACKING_PERMISSION_DENIED))

      ;; stacker must be currently locked
      (asserts! (> existing-lock u0)
        (err ERR_STACK_INCREASE_NOT_LOCKED))

      ;; stacker must have enough stx to lock
      (asserts! (>= available-stx increase-by)
        (err ERR_STACKING_INSUFFICIENT_FUNDS))

      ;; stacker must have delegated to the caller
      (let ((delegation-info (unwrap! (get-check-delegation stacker) (err ERR_STACKING_PERMISSION_DENIED)))
            (delegated-to (get delegated-to delegation-info))
            (delegated-amount (get amount-ustx delegation-info))
            (delegated-pox-addr (get pox-addr delegation-info))
            (delegated-until (get until-burn-ht delegation-info)))
        ;; must have delegated to tx-sender
        (asserts! (is-eq delegated-to tx-sender)
                  (err ERR_STACKING_PERMISSION_DENIED))
        ;; must have delegated enough stx
        (asserts! (>= delegated-amount new-total-locked)
                  (err ERR_DELEGATION_TOO_MUCH_LOCKED))
        ;; if pox-addr is set, must be equal to pox-addr
        (asserts! (match delegated-pox-addr
                         specified-pox-addr (is-eq pox-addr specified-pox-addr)
                         true)
                  (err ERR_DELEGATION_POX_ADDR_REQUIRED))
        ;; delegation must not expire before lock period
        (asserts! (match delegated-until
                        until-burn-ht
                            (>= until-burn-ht unlock-height)
                        true)
                  (err ERR_DELEGATION_EXPIRES_DURING_LOCK)))

      ;; delegate stacking does minimal-can-stack-stx
      (try! (minimal-can-stack-stx pox-addr new-total-locked first-increase-cycle (+ u1 (- last-increase-cycle first-increase-cycle))))

      ;; register the PoX address with the amount stacked via partial stacking
      ;;   before it can be included in the reward set, this must be committed!
      (add-pox-partial-stacked pox-addr first-increase-cycle cycle-count increase-by)

      ;; stacking-state is unchanged, so no need to update

      ;; return the lock-up information, so the node can actually carry out the lock.
      (ok { stacker: stacker, total-locked: new-total-locked}))))
```

</details>

Arguments:

* **Stacker**: the STX address of the delegator
* **Pox Address**: the BTC address for rewards. Must match the delegator's specified address if one was set.
* **Increase by**: the amount of uSTX to add to the delegator's locked amount
{% endstep %}

{% step %}
#### Commit or increase the stacked amount

After updating locked amounts, you must commit the change:

* **If you have not yet committed** for the given cycle: call `stack-aggregation-commit-indexed` (see above).
* **If you have already committed**: call `stack-aggregation-increase` with the index returned from the first commit and a new signature.

<details>

<summary>stack-aggregation-increase source code</summary>

```clojure
;; Commit partially stacked STX to a PoX address which has already received some STX (more than the Stacking min).
;; This allows a delegator to lock up marginally more STX from new delegates, even if they collectively do not
;; exceed the Stacking minimum, so long as the target PoX address already represents at least as many STX as the
;; Stacking minimum.
;;
;; The `reward-cycle-index` is emitted as a contract event from `stack-aggregation-commit` when the initial STX are
;; locked up by this delegator.  It must be passed here to add more STX behind this PoX address.  If the delegator
;; called `stack-aggregation-commit` multiple times for the same PoX address, then any such `reward-cycle-index` will
;; work here.
;;
;; *New in Stacks 2.1*
;;
(define-public (stack-aggregation-increase (pox-addr { version: (buff 1), hashbytes: (buff 32) })
                                           (reward-cycle uint)
                                           (reward-cycle-index uint))
  (let ((partial-stacked
         ;; fetch the partial commitments
         (unwrap! (map-get? partial-stacked-by-cycle { pox-addr: pox-addr, sender: tx-sender, reward-cycle: reward-cycle })
                  (err ERR_STACKING_NO_SUCH_PRINCIPAL))))

    ;; must be called directly by the tx-sender or by an allowed contract-caller
    (asserts! (check-caller-allowed)
              (err ERR_STACKING_PERMISSION_DENIED))

    ;; reward-cycle must be in the future
    (asserts! (> reward-cycle (current-pox-reward-cycle))
              (err ERR_STACKING_INVALID_LOCK_PERIOD))

    (let ((amount-ustx (get stacked-amount partial-stacked))
          ;; reward-cycle must point to an existing record in reward-cycle-total-stacked
          ;; infallible; getting something from partial-stacked-by-cycle succeeded so this must succeed
          (existing-total (unwrap-panic (map-get? reward-cycle-total-stacked { reward-cycle: reward-cycle })))
          ;; reward-cycle and reward-cycle-index must point to an existing record in reward-cycle-pox-address-list
          (existing-entry (unwrap! (map-get? reward-cycle-pox-address-list { reward-cycle: reward-cycle, index: reward-cycle-index })
                          (err ERR_DELEGATION_NO_REWARD_SLOT)))
          (increased-ustx (+ (get total-ustx existing-entry) amount-ustx))
          (total-ustx (+ (get total-ustx existing-total) amount-ustx)))

          ;; must be stackable
          (try! (minimal-can-stack-stx pox-addr total-ustx reward-cycle u1))

          ;; new total must exceed the stacking minimum
          (asserts! (<= (get-stacking-minimum) total-ustx)
                    (err ERR_STACKING_THRESHOLD_NOT_MET))

          ;; there must *not* be a stacker entry (since this is a delegator)
          (asserts! (is-none (get stacker existing-entry))
                    (err ERR_DELEGATION_WRONG_REWARD_SLOT))

          ;; the given PoX address must match the one on record
          (asserts! (is-eq pox-addr (get pox-addr existing-entry))
                    (err ERR_DELEGATION_WRONG_REWARD_SLOT))

          ;; update the pox-address list -- bump the total-ustx
          (map-set reward-cycle-pox-address-list
                   { reward-cycle: reward-cycle, index: reward-cycle-index }
                   { pox-addr: pox-addr,
                     total-ustx: increased-ustx,
                     stacker: none,
                     signer: (get signer existing-entry) })

          ;; update the total ustx in this cycle
          (map-set reward-cycle-total-stacked
                   { reward-cycle: reward-cycle }
                   { total-ustx: total-ustx })

          ;; clear the partial-stacked state, and log it
          (map-delete partial-stacked-by-cycle { pox-addr: pox-addr, sender: tx-sender, reward-cycle: reward-cycle })
          (map-set logged-partial-stacked-by-cycle { pox-addr: pox-addr, sender: tx-sender, reward-cycle: reward-cycle } partial-stacked)
          (ok true))))
```

</details>

Arguments for `stack-aggregation-increase`:

* **Pox Address**: the BTC address to receive rewards
* **Reward Cycle**: a reward cycle in the future
* **Reward Cycle Index**: the index returned by `stack-aggregation-commit-indexed`
{% endstep %}
{% endstepper %}

{% hint style="warning" %}
This is a sequential process. First call `delegate-stack-increase`, then commit the change:
* Use `stack-aggregation-commit-indexed` if this is the first commit for that cycle.
* Use `stack-aggregation-increase` if you have already committed.

Failing to commit (or properly increase after a commit) will result in the increased delegation not taking effect.
{% endhint %}

***

## How Signer Registration Works for Pools

The delegated stacking workflow requires multiple transactions to register a signer:

{% stepper %}
{% step %}
#### Stackers delegate their STX

Stackers call `delegate-stx` to give the pool operator permission.
{% endstep %}

{% step %}
#### Pool operator accepts delegations

The pool operator calls `delegate-stack-stx` for each individual stacker.
{% endstep %}

{% step %}
#### Pool operator commits

The pool operator calls `stack-aggregation-commit-indexed` to commit all delegated STX. This is where the signer key is associated with the pool.
{% endstep %}
{% endstepper %}

All steps must be completed before the prepare phase of the target reward cycle. During the prepare phase, DKG occurs and the signer is automatically registered. No manual action is needed beyond monitoring.
