# Increase Stacked Position

This guide explains how to increase your stacked STX position. The process depends on your role:

- **Solo Stackers** use the `stack-increase` function.
- **Delegators** must first revoke their current delegation using `revoke-delegate-stx` and then re-delegate with a higher amount to the same pool operator using `delegate-stx`.
- **Pool Operators** increase their delegators' locked amount by calling `delegate-stack-increase` and then stacking the increased amount with either `stack-aggregation-commit-indexed` (if not already committed) or `stack-aggregation-increase` (if the commit has already been made).

## Solo Stackers

Solo stackers can add more STX to their active stacking position by calling the `stack-increase` function. The new amount takes effect from the next stacking cycle.

The `stack-increase` function locks an additional amount of STX from your account. Your account must be actively stacking and not delegating, and you must have enough unlocked STX to cover the increase.

<details>

<summary>Function source code</summary>

```clojure
;; Increase the number of STX locked.
;; *New in Stacks 2.1*
;; This method locks up an additional amount of STX from `tx-sender`'s, indicated
;; by `increase-by`.  The `tx-sender` must already be Stacking & must not be
;; straddling more than one signer-key for the cycles effected. 
;; Refer to `verify-signer-key-sig` for more information on the authorization parameters
;; included here.
(define-public (stack-increase 
  (increase-by uint)
  (signer-sig (optional (buff 65)))
  (signer-key (buff 33))
  (max-amount uint)
  (auth-id uint))
   (let ((stacker-info (stx-account tx-sender))
         (amount-stacked (get locked stacker-info))
         (amount-unlocked (get unlocked stacker-info))
         (unlock-height (get unlock-height stacker-info))
         (cur-cycle (current-pox-reward-cycle))
         (first-increased-cycle (+ cur-cycle u1))
         (stacker-state (unwrap! (map-get? stacking-state
                                          { stacker: tx-sender })
                                          (err ERR_STACK_INCREASE_NOT_LOCKED)))
         (cur-pox-addr (get pox-addr stacker-state))
         (cur-period (get lock-period stacker-state)))
      ;; tx-sender must be currently locked
      (asserts! (> amount-stacked u0)
                (err ERR_STACK_INCREASE_NOT_LOCKED))
      ;; must be called with positive `increase-by`
      (asserts! (>= increase-by u1)
                (err ERR_STACKING_INVALID_AMOUNT))
      ;; stacker must have enough stx to lock
      (asserts! (>= amount-unlocked increase-by)
                (err ERR_STACKING_INSUFFICIENT_FUNDS))
      ;; must be called directly by the tx-sender or by an allowed contract-caller
      (asserts! (check-caller-allowed)
                (err ERR_STACKING_PERMISSION_DENIED))
      ;; stacker must be directly stacking
      (asserts! (> (len (get reward-set-indexes stacker-state)) u0)
                (err ERR_STACKING_IS_DELEGATED))
      ;; stacker must not be delegating
      (asserts! (is-none (get delegated-to stacker-state))
                (err ERR_STACKING_IS_DELEGATED))

      ;; Validate that amount is less than or equal to `max-amount`
      (asserts! (>= max-amount (+ increase-by amount-stacked)) (err ERR_SIGNER_AUTH_AMOUNT_TOO_HIGH))

      ;; Verify signature from delegate that allows this sender for this cycle
      (try! (consume-signer-key-authorization cur-pox-addr cur-cycle "stack-increase" cur-period signer-sig signer-key increase-by max-amount auth-id))

      ;; update reward cycle amounts
      (asserts! (is-some (fold increase-reward-cycle-entry
            (get reward-set-indexes stacker-state)
            (some { first-cycle: first-increased-cycle,
                    reward-cycle: (get first-reward-cycle stacker-state),
                    stacker: tx-sender,
                    add-amount: increase-by,
                    signer-key: signer-key })))
            (err ERR_INVALID_INCREASE))
      ;; NOTE: stacking-state map is unchanged: it does not track amount-stacked in PoX-4
      (ok { stacker: tx-sender, total-locked: (+ amount-stacked increase-by)})))
```
</details>

The arguments are:

* Increase by: the amount of uSTX to add to your lock amount.
* Signer public key: the public key used for signing. This can stay the same, or you can use a new key.
* Signer signature: a signature proving control of your signing key
* Max Amount: This parameter is used to validate the signer signature provided. It represents the maximum number of uSTX (1 STX = 1,000,000 uSTX) that can be stacked in this transaction.
* Auth Id: This parameter is used to validate the signer signature provided. It is a random integer that prevents the re-use of this particular signer signature.

## Delegators

Delegators have to increase their delegated amount in two steps.

### Step 1: Revoke Your Current Delegation

Before increasing your delegation, cancel your current delegation through the `revoke-delegate-stx` function, so that you can delegate an increased amount of STX afterwards.

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

### Step 2: Delegate with a Higher Amount

After revoking, call the `delegate-stx` function with your new, higher amount. This function does not directly delegate the STX, but rather allows the pool operator to issue the stacking lock on behalf of the user calling this function.

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

      ;; delegate-stx no longer requires the delegator to not currently
      ;; be stacking.
      ;; delegate-stack-* functions assert that
      ;; 1. users can't swim in two pools at the same time.
      ;; 2. users can't switch pools without cool down cycle.
      ;;    Other pool admins can't increase or extend.
      ;; 3. users can't join a pool while already directly stacking.

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

The arguments here are unchanged from previous versions of PoX:

* Amount: Denoted in uSTX (1 STX = 1,000,000 uSTX)
* Delegate to: the STX address of the pool operator they're delegating to. Note that this is different from the “signer key” used. Instead, this is the STX address that is used to make PoX transactions.
* Until burn height: an optional argument representing the BTC block height when the delegation expires. If none is used, the delegation permission expires only when explicitly revoked.
* Pox Address: an optional BTC address that, if specified, the signer must use to accept this delegation

{% hint style="info" %}
Make sure the revocation is successful before initiating a new delegation. Otherwise, the `delegate-stx` transaction will fail.
{% endhint %}

## Pool Operators

Pool operators can increase the total stacking amount through a two-step process. First, you have to update the delegation's locked amount with `delegate-stack-increase`. Then, you can stack the increased amount by committing it in a future cycle, or increasing an already committed position.

### Step 1: Increase the Locked Amount

The `delegate-stack-increase` function allows a pool operator to add more STX to the existing locked position for a given delegator. It performs necessary checks and updates the delegation state with the increased amount.

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

The arguments are:

* Stacker: the STX address of the delegator
* Pox Address: The BTC address of the pool operator where they will receive the BTC rewards. If the delegator has set his own BTC address in the `delegate-stx` call, this address will have to be the same one, otherwise the contract call will fail.
* Increase by: the amount of uSTX to add to the delegator's locked amount.

### Step 2: Stack the Increased Amount

Once the locked amount is updated, the operator must commit the change. There are two functions that can be used to stack the increased amount:

#### A. If the Commit Has Not Yet Been Made: `stack-aggregation-commit-indexed`

This function stacks the total locked amount for an upcoming reward cycle. Note that the `stack-aggregation-commit-indexed` function wraps the `inner-stack-aggregation-commit` function. The wrapped inner function is included here.

<details>

<summary>Function source code</summary>

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

* Pox Address: the BTC address to receive rewards
* Reward-cycle: a reward cycle in the future (see the note above on passing the correct reward cycle)
* Signer public key: the public key of your signer
* Signer signature: A signature proving control of your signing key
* Max Amount: This parameter is used to validate the signer signature provided. It represents the maximum number of uSTX (1 stx = 1,000,000 uSTX) that can be stacked in this transaction.
* Auth Id: This parameter is used to validate the signer signature provided. It is a random integer that prevents the re-use of this particular signer signature.

#### B. If the Commit Has Already Been Made: `stack-aggregation-increase`

If you have previously committed an amount, you can further increase the stacked position by calling `stack-aggregation-increase`. This function adds an additional amount of STX to the already committed delegation.

<details>

<summary>Function source code</summary>

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
                     ;; TODO: this must be authorized with a signature, or tx-sender allowance!
                     signer: (get signer existing-entry) })

          ;; update the total ustx in this cycle
          (map-set reward-cycle-total-stacked
                   { reward-cycle: reward-cycle }
                   { total-ustx: total-ustx })

          ;; don't update the stacking-state map,
          ;;  because it _already has_ this stacker's state
          ;; don't lock the STX, because the STX is already locked
          ;;
          ;; clear the partial-stacked state, and log it
          (map-delete partial-stacked-by-cycle { pox-addr: pox-addr, sender: tx-sender, reward-cycle: reward-cycle })
          (map-set logged-partial-stacked-by-cycle { pox-addr: pox-addr, sender: tx-sender, reward-cycle: reward-cycle } partial-stacked)
          (ok true))))
```
</details>

The arguments are:

* Pox Address: the BTC address to receive rewards
* Reward Cycle: a reward cycle in the future (see the note above on passing the correct reward cycle)
* Reward Cycle Index: the index returned by the successful `stack-aggregation-commit-indexed` function for the given cycle
* Signer signature: A signature proving control of your signing key
* Signer public key: the public key of your signer
* Max Amount: This parameter is used to validate the signer signature provided. It represents the maximum number of uSTX (1 stx = 1,000,000 uSTX) that can be stacked in this transaction.
* Auth Id: This parameter is used to validate the signer signature provided. It is a random integer that prevents the re-use of this particular signer signature.

{% hint style="warning" %}
- **Sequential Process:** First call `delegate-stack-increase` to update the locked amount of a delegation. Then, commit the change:
  - Using `stack-aggregation-commit-indexed` if this is the first commit in the given cycle.
  - Using `stack-aggregation-increase` if you have already committed in the cycle you want to increase.

Failing to commit (or properly increase after a commit) will result in the increased delegation not taking effect in upcoming stacking cycles.
{% endhint %}
