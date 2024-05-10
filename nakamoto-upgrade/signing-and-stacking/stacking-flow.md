# How to Stack (as a signer)

{% hint style="info" %}
This doc assumes you are familiar with stacking at a conceptual level. If not, you may want to read the [Stacking](../../stacks-101/stacking.md) section of Stacks 101.
{% endhint %}

{% hint style="info" %}
Much of the technical instructions below apply to users who are interested in either solo stacking or becoming a pool operator. Both of those types of stackers will need to run a signer.

However, if you prefer to participate in a pool by delegating your STX, you do not need to also operate a signer. Simplified instructions for delegating your STX token using Leather and Lockstacks can be found in the [Nakamoto for Stackers](../nakamoto-rollout-plan/nakamoto-for-stackers.md) doc.
{% endhint %}

In Nakamoto, stacking flows have significant changes in comparison to previous versions of Stacks. Because Nakamoto requires stackers to run a signer, which validates blocks produced by Stacks miners, stackers need to provide new information when making Stacking transactions.

These changes affect both solo Stacking and delegated Stacking. This document outlines the new flows for both cases.

If you aren't familiar with the general block production process under Nakamoto and what role signers and stackers play, you may want to read [Nakamoto in 10 Minutes](../what-is-the-nakamoto-release/nakamoto-in-10-minutes.md) to get up to speed.

The following sections will walk you through how to begin operating as a solo stacker or pool operator.

If you are only interested in delegating your STX to a pool operator and not running your own signer, the [Nakamoto for Stackers guide](../nakamoto-rollout-plan/nakamoto-for-stackers.md) may be a better guide to follow.

Stacking utilizes the `pox-4` contract. There is a detailed [walkthrough of the stacking contract](../../clarity/example-contracts/stacking.md) that you can look at to see what functions are being called at each phase and some common errors you may encounter.

Before we get into the step-by-step of how to actually stack, it's important to make sure you have an understanding of the different roles, processes and functions involved in Stacking.

### Definitions and Roles

* **Stacker**: an entity locking their STX to receive PoX rewards. This is a broad term including solo Stackers and Stackers who use pools.
* **Solo stacker**: an entity that locks their own STX and runs a signer. They don’t receive delegation.
* **Delegator**: a stacker who locks their STX and delegates to a signer or pool operator. They don’t run the signer.
* **Pool operator**: an entity that runs a Signer and allows others to delegate their STX to them. A pool operator doesn’t need to Stack their own STX, but they can. They will also run a signer, but the pool operator and signer address may be different
* **Signer**: an entity that runs the stacks-signer software and participates in block validation. This can be either a solo Stacker or an entity receiving delegated STX. Depending on context, this may also refer to the signer software that validates blocks.

{% hint style="info" %}
It's important to understand that in the context of the pool operator and signer, these are likely the same _entity_ but may not be the same S\_tacks address.\_

This distinction will be discussed further as we cover the step-by-step process below.
{% endhint %}

As mentioned above, there are three primary ways you can stack:

1. Solo stacking
2. Pool operator
3. Delegator

This guide is focused on 1 and 2. Let's walk through the flow for each of these now, and then we'll get into the step-by-step process for actually carrying out these stacking transactions.

As you read through these, it may be helpful to follow along with the functions in the [pox-4 contract](https://explorer.hiro.so/txid/0xfba7f786fae1953fa56f4e56aeac053575fd48bf72360523366d739e96613da3?chain=testnet) to get an idea of what each function is doing.

### Solo Stacker Flow

{% hint style="info" %}
Note that in order to solo stack, you need to have the minimum number of STX tokens. This number can be found by visiting the pox endpoint of Hiro's API at [https://api.testnet.hiro.so/v2/pox](https://api.testnet.hiro.so/v2/pox) and looking at the `min_threshold_ustx` field. (1 STX = 1,000,000 uSTX)
{% endhint %}

#### Call the function `stack-stx`

<details>

<summary>Function source code</summary>

```clojure
;; Lock up some uSTX for stacking!  Note that the given amount here is in micro-STX (uSTX).
;; The STX will be locked for the given number of reward cycles (lock-period).
;; This is the self-service interface.  tx-sender will be the Stacker.
;;
;; * The given stacker cannot currently be stacking.
;; * You will need the minimum uSTX threshold.  This will be determined by (get-stacking-minimum)
;; at the time this method is called.
;; * You may need to increase the amount of uSTX locked up later, since the minimum uSTX threshold
;; may increase between reward cycles.
;; * You need to provide a signer key to be used in the signer DKG process.
;; * The Stacker will receive rewards in the reward cycle following `start-burn-ht`.
;; Importantly, `start-burn-ht` may not be further into the future than the next reward cycle,
;; and in most cases should be set to the current burn block height.
;; 
;; To ensure that the Stacker is authorized to use the provided `signer-key`, the stacker
;; must provide either a signature have an authorization already saved. Refer to
;; `verify-signer-key-sig` for more information.
;;
;; The tokens will unlock and be returned to the Stacker (tx-sender) automatically.
(define-public (stack-stx (amount-ustx uint)
                          (pox-addr (tuple (version (buff 1)) (hashbytes (buff 32))))
                          (start-burn-ht uint)
                          (lock-period uint)
                          (signer-sig (optional (buff 65)))
                          (signer-key (buff 33))
                          (max-amount uint)
                          (auth-id uint))
    ;; this stacker's first reward cycle is the _next_ reward cycle
    (let ((first-reward-cycle (+ u1 (current-pox-reward-cycle)))
          (specified-reward-cycle (+ u1 (burn-height-to-reward-cycle start-burn-ht))))
      ;; the start-burn-ht must result in the next reward cycle, do not allow stackers
      ;;  to "post-date" their `stack-stx` transaction
      (asserts! (is-eq first-reward-cycle specified-reward-cycle)
                (err ERR_INVALID_START_BURN_HEIGHT))

      ;; must be called directly by the tx-sender or by an allowed contract-caller
      (asserts! (check-caller-allowed)
                (err ERR_STACKING_PERMISSION_DENIED))

      ;; tx-sender principal must not be stacking
      (asserts! (is-none (get-stacker-info tx-sender))
        (err ERR_STACKING_ALREADY_STACKED))

      ;; tx-sender must not be delegating
      (asserts! (is-none (get-check-delegation tx-sender))
        (err ERR_STACKING_ALREADY_DELEGATED))

      ;; the Stacker must have sufficient unlocked funds
      (asserts! (>= (stx-get-balance tx-sender) amount-ustx)
        (err ERR_STACKING_INSUFFICIENT_FUNDS))

      ;; Validate ownership of the given signer key
      (try! (consume-signer-key-authorization pox-addr (- first-reward-cycle u1) "stack-stx" lock-period signer-sig signer-key amount-ustx max-amount auth-id))

      ;; ensure that stacking can be performed
      (try! (can-stack-stx pox-addr amount-ustx first-reward-cycle lock-period))

      ;; register the PoX address with the amount stacked
      (let ((reward-set-indexes (try! (add-pox-addr-to-reward-cycles pox-addr first-reward-cycle lock-period amount-ustx tx-sender signer-key))))
          ;; add stacker record
         (map-set stacking-state
           { stacker: tx-sender }
           { pox-addr: pox-addr,
             reward-set-indexes: reward-set-indexes,
             first-reward-cycle: first-reward-cycle,
             lock-period: lock-period,
             delegated-to: none })

          ;; return the lock-up information, so the node can actually carry out the lock.
          (ok { stacker: tx-sender, lock-amount: amount-ustx, signer-key: signer-key, unlock-burn-height: (reward-cycle-to-burn-height (+ first-reward-cycle lock-period)) }))))
```

</details>

The first thing solo stackers will need to do is call the `stack-stx` function.

Just like in previous versions of PoX, Stackers call `stack-stx`, but with the new arguments added in Nakamoto. The arguments are:

* Amount: Denoted in ustx (1 stx = 1,000,000 ustx)
* PoX Address: the BTC wallet to receive Stacking rewards
* Start burn height: the current BTC block height
* Lock period: the number of cycles to lock for (1 minimum, 12 max)
* Signer key: the **public** key that your signer is using
* Signer signature: the signature that proves control of this signer key
* max-amount: This parameter is used to validate the signer signature provided. It represents the maximum number of ustx that can be locked in this transaction.
* auth-id: This parameter is used to validate the signer signature provided. auth-id is a random integer that prevents re-use of this particular signer signature.

#### Act as a signer

In the “prepare phase” before the next stacking cycle (100 blocks), the exact set of Stackers will be selected based on the amount of STX stacked. Just like in previous versions of PoX, each Stacker will have some number of reward slots based on the amount of STX locked.

**It is critical that solo stackers have their signer running during this period.** The prepare phase is when distributed key generation (DKG) occurs, which is used when validating blocks by signers.

In general, you don’t need to do anything actively during this period, other than monitoring your signer software to ensure it’s running properly.

#### Extending their stacking period

Just like in the current version of PoX, you can extend your lock period while still Stacking. The function called is `stack-extend`.

<details>

<summary>Function source code</summary>

```clojure
;; Extend an active Stacking lock.
;; *New in Stacks 2.1*
;; This method extends the `tx-sender`'s current lockup for an additional `extend-count`
;;    and associates `pox-addr` with the rewards, The `signer-key` will be the key
;;    used for signing. The `tx-sender` can thus decide to change the key when extending.
;; 
;; Because no additional STX are locked in this function, the `amount` field used
;; to verify the signer key authorization is zero. Refer to `verify-signer-key-sig` for more information.
(define-public (stack-extend (extend-count uint)
                             (pox-addr { version: (buff 1), hashbytes: (buff 32) })
                             (signer-sig (optional (buff 65)))
                             (signer-key (buff 33))
                             (max-amount uint)
                             (auth-id uint))
   (let ((stacker-info (stx-account tx-sender))
         ;; to extend, there must already be an etry in the stacking-state
         (stacker-state (unwrap! (get-stacker-info tx-sender) (err ERR_STACK_EXTEND_NOT_LOCKED)))
         (amount-ustx (get locked stacker-info))
         (unlock-height (get unlock-height stacker-info))
         (cur-cycle (current-pox-reward-cycle))
         ;; first-extend-cycle will be the cycle in which tx-sender *would have* unlocked
         (first-extend-cycle (burn-height-to-reward-cycle unlock-height))
         ;; new first cycle should be max(cur-cycle, stacker-state.first-reward-cycle)
         (cur-first-reward-cycle (get first-reward-cycle stacker-state))
         (first-reward-cycle (if (> cur-cycle cur-first-reward-cycle) cur-cycle cur-first-reward-cycle)))

    ;; must be called with positive extend-count
    (asserts! (>= extend-count u1)
              (err ERR_STACKING_INVALID_LOCK_PERIOD))

    ;; stacker must be directly stacking
      (asserts! (> (len (get reward-set-indexes stacker-state)) u0)
                (err ERR_STACKING_IS_DELEGATED))

    ;; stacker must not be delegating
    (asserts! (is-none (get delegated-to stacker-state))
              (err ERR_STACKING_IS_DELEGATED))

    ;; Verify signature from delegate that allows this sender for this cycle
    (try! (consume-signer-key-authorization pox-addr cur-cycle "stack-extend" extend-count signer-sig signer-key u0 max-amount auth-id))

    ;; TODO: add more assertions to sanity check the `stacker-info` values with
    ;;       the `stacker-state` values

    (let ((last-extend-cycle  (- (+ first-extend-cycle extend-count) u1))
          (lock-period (+ u1 (- last-extend-cycle first-reward-cycle)))
          (new-unlock-ht (reward-cycle-to-burn-height (+ u1 last-extend-cycle))))

      ;; first cycle must be after the current cycle
      (asserts! (> first-extend-cycle cur-cycle) (err ERR_STACKING_INVALID_LOCK_PERIOD))
      ;; lock period must be positive
      (asserts! (> lock-period u0) (err ERR_STACKING_INVALID_LOCK_PERIOD))

      ;; must be called directly by the tx-sender or by an allowed contract-caller
      (asserts! (check-caller-allowed)
                (err ERR_STACKING_PERMISSION_DENIED))

      ;; tx-sender must be locked
      (asserts! (> amount-ustx u0)
        (err ERR_STACK_EXTEND_NOT_LOCKED))

      ;; tx-sender must not be delegating
      (asserts! (is-none (get-check-delegation tx-sender))
        (err ERR_STACKING_ALREADY_DELEGATED))

      ;; standard can-stack-stx checks
      (try! (can-stack-stx pox-addr amount-ustx first-extend-cycle lock-period))

      ;; register the PoX address with the amount stacked
      ;;   for the new cycles
      (let ((extended-reward-set-indexes (try! (add-pox-addr-to-reward-cycles pox-addr first-extend-cycle extend-count amount-ustx tx-sender signer-key)))
            (reward-set-indexes
                ;; use the active stacker state and extend the existing reward-set-indexes
                (let ((cur-cycle-index (- first-reward-cycle (get first-reward-cycle stacker-state)))
                      (old-indexes (get reward-set-indexes stacker-state))
                      ;; build index list by taking the old-indexes starting from cur cycle
                      ;;  and adding the new indexes to it. this way, the index is valid starting from the current cycle
                      (new-list (concat (default-to (list) (slice? old-indexes cur-cycle-index (len old-indexes)))
                                        extended-reward-set-indexes)))
                  (unwrap-panic (as-max-len? new-list u12)))))
          ;; update stacker record
          (map-set stacking-state
            { stacker: tx-sender }
            { pox-addr: pox-addr,
              reward-set-indexes: reward-set-indexes,
              first-reward-cycle: first-reward-cycle,
              lock-period: lock-period,
              delegated-to: none })

        ;; return lock-up information
        (ok { stacker: tx-sender, unlock-burn-height: new-unlock-ht })))))
```

</details>

You can “rotate” your signing key when extending your lock period.

The arguments are:

* Extend count: the number of cycles to add to your lock period. The resulting lock period cannot be larger than 12. For example, if currently locked with 6 cycles remaining, the maximum number you can extend is 6.
* Pox Address: the BTC address to receive rewards
* Signer public key: the public key used for signing. This can stay the same, or you can use a new key.
* Signer signature: a signature proving control of your signing key
* max-amount: This parameter is used to validate the signer signature provided. It represents the maximum number of ustx (1 stx = 1,000,000 ustx) that can be locked in this transaction.
* auth-id: This parameter is used to validate the signer signature provided. auth-id is a random integer that prevents re-use of this particular signer signature.

### Pool Operator Stacking Flow

For pool operators, the flow is a bit different. Remember that as a pool operator, other stackers are delegating their STX to you to stack on behalf of them. This additional role adds a couple of extra steps to your stacking flow if operating as a pool operator.

Similar to the changes to solo Stacking, the big difference for delegation flows is the inclusion of signer keys and signatures. Because signers need to make transactions to “finalize” a delegation, these new arguments add new complexities to the signer.

#### Delegator initiates delegation

{% hint style="info" %}
This step does not apply to pool operators/signers. It is included here to illustrate the end-to-end flow, but if you are operating as a pool operator/signer you will not perform this step. Instead, users delegate their stx to you as the pool operator.
{% endhint %}

The first step, where the delegator sets up their delegation to a pool operator, is to call `delegate-stx`. This function does not directly delegate the stx, but rather allows the pool operator to issue the stacking lock on behalf of the user calling this function. You can think of calling this function as the delegaor giving permission to the pool operator to stack on their behalf.

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

* Amount: Denoted in ustx (1 stx = 1,000,000 ustx)
* Delegate to: the STX address of the pool operator they're delegating to. Note that this is different from the “signer key” used. Instead, this is the STX address that is used to make PoX transactions.
* Until burn height: an optional argument when the delegation expires. If none is used, the delegation  permission expires only when explicitly revoked.
* Pox Address: an optional BTC address that, if specified, the signer must use to accept this delegation

#### Pool operator “activates” the delegation

Just as in the current PoX contract, after a delegator calls the `delegate-stx` function, the pool operator calls `delegate-stack-stx` to commit the delegator’s STX.

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

* Stacker: the STX address of the delegator
* Amount: denoted in ustx (1 stx = 1,000,000 ustx)
* Pox Address: The BTC address of the pool operator where they will receive the BTC rewards
* Start burn height: The BTC block height in which delegation can begin. This field is used to ensure that an old transaction intended for an earlier cycle will fail, and also prevents callers from "post-dating" the call to a future cycle. The best option here is to add 1 or 2 to the current block height when you initiate this transaction. Note that the delegation will not actively begin at this block height, but whatever reward cycle is passed in the aggregation commit function (below).
* Lock period: number of cycles to lock for. If the delegator provided the until burn height argument, then the end of these cycles cannot be past the expiration provided. Max lock period is 12

This step also allows the pool operator to proactively choose which Stackers they’ll accept delegation from. For “closed” pools, the pool operator will only call this function for approved Stackers. It is up to each pool operator who runs a closed pool to implement this process.

This step can happen for many Stackers before going to the next step.

{% hint style="info" %}
If you look at the function source code, you'll see that the `delegate-stack-stx` function sets the stacker's reward cycle to be the _next_ reward cycle.

When generating your signature and your `stack-aggregation-commit` transaction, you'll want to make sure that the reward cycles match.

So if you are in cycle 557 when you call the `delegate-stack-stx` function, you'll want to pass in cycle 558 when you generate your signature and your `stack-aggregation-commit` transaction.

With `stack-aggregation-commit`, the `reward-cycle` arg is saying "I'm commiting these stacks to be stacked in cycle N". But the `delegate-stack-stx` transaction gets you setup for next cycle, aka 558.

Also make sure that, when you generate your signature, you use 558 as the reward cycle. in solo stacking methods, you use the current reward cycle in the signature, but not for `stack-aggregation-commit`. This is because with `stack-aggregation-commit` you can commit stacks for future cycles, not just the n+1 cycle
{% endhint %}

#### Pool operator “commits” delegated STX

The next step is for the pool operator to call `stack-aggregation-commit-indexed`.

{% hint style="info" %}
In the contract source code, you'll notice a similarly named function called `stack-aggregation-commit`. This is a legacy function that makes it difficult to increas the stacking amount. We recommend using `stack-aggregation-commit-indexed`.
{% endhint %}

<details>

<summary>Function source code</summary>

Note that the `stack-aggregation-commit-indexed` function wraps the `inner-stack-aggregation-commit` function. The wrapped inner function is included here.

Check out the [deployed contract](https://explorer.hiro.so/txid/0xaf8857ee1e4b8afc72f85b85ad785e1394672743acc63f4df79fb65b5e8b9d2a?chain=testnet) to see the flow of contract calls.

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

At this point, the STX are committed to the pool operator, and the pool operator has some “aggregate balance” of committed STX. The pool operator is not actually eligible for rewards and signer slots until this step is called.

The pool operator cannot call this until the total number of STX committed is larger than the minimum threshold required to Stack. This minimum stacking threshold is a function of the total number of liquid STX.

{% hint style="info" %}
This number varies and can be found by visiting the pox endpoint of Hiro's API at [https://api.testnet.hiro.so/v2/pox](https://api.testnet.hiro.so/v2/pox) and looking at the `min_threshold_ustx` field. (1 STX = 1,000,000 uSTX).
{% endhint %}

Once the threshold is reached, the pool operator calls `stack-aggregation-commit`. This is the point where you as the pool operator must provide your signer key and signer key signature. The arguments are:

* Pox Address: the BTC address to receive rewards
* Reward-cycle: the current reward cycle (see the note above on passing the correct reward cycle here)
* Signer key: the public key of your signer (remember that this may be different than the address you are using to operate the pool, but this step is how you associate the two together)
* Signer signature: Your generated signer signature (details on how to do this are below)

{% hint style="info" %}
In the Definitions and Roles section at the top of this document, we described how the pool operator and signer may be the same entity, but not necessarily have the same address.

Signers who are also pool operators and have stx delegated to them also need a separate keychain to make Stacking transactions such as `delegate-stack-stx` listed earlier.

So as a signing entity operating a pool, you will have two accounts:

* Your pool operator account, which you will use to conduct all of the stacking operations we have covered here
* Your signer account, which is what you used to set up your signer. This signer public key is what you will pass in to the above aggregation commit function, and is also the key you will use when generating your signer signature

If you are operating as a signer and a pool operator, you'll need a separate key because you need to have the ability to rotate your signer key when necessary.

The PoX contract is designed to support rotating the signer key without needing your Stackers to un-stack and re-stack later. You cannot rotate a pool operator key without needing to wait for all delegated Stackers to un-stack and finally re-stack to the new pool operator address.

Because of this limitation of being unable to rotate pool operator addresses, it’s highly recommended to have a separate pool operator key. The benefit of a separate pool operator key is that it can easily be used in existing wallets, including hardware wallets.
{% endhint %}

Once this succeeds, the signer is eligible for reward slots. The number of reward slots depends on the amount of STX committed to this signer. Even if the signer commits more than the “global minimum”, the minimum amount to receive a slot depends on the amount of STX locked for each cycle.

To act as a signer, each step up to this point must be taken before the prepare phase of the next cycle begins. It is crucial that the signer software is running.

#### Pool operator increases amount committed

Even after the signer commits to a certain amount of STX in the previous step, the signer can increase this amount once more delegations are received. The initial steps must be taken for each Stacker (`delegate-stx` and then `delegate-stack-stx`), and then `stack-aggregation-increase` can be called with the index returned from the first `stack-aggregation-commit-indexed` call and a new signature..

<details>

<summary>Function source code</summary>

```
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

### Step by Step Stacking Guide

Now that you are familiar with the overall stacking flow and the different roles played, let's dive into the step-by-step guide for actually conducting the stacking process.

{% hint style="info" %}
There are several ways you can go about stacking. This guide will cover using Lockstacks, which is a stacking web application and the simplest option.

Additionally, you can choose to call the stacking functions directly from the [deployed contract](https://explorer.hiro.so/txid/0xaf8857ee1e4b8afc72f85b85ad785e1394672743acc63f4df79fb65b5e8b9d2a?chain=testnet) in the explorer.

The fields and process will be the same, but the UI will differ.

Finally, you can stack using JS and the [@stacks/stacking](https://github.com/hirosystems/stacks.js/tree/main/packages/stacking) package if you prefer. Again, the functions and parameters will be the same, you will just be writing your JS code directly instead of using a UI.

If you are interested in using this method, you'll want to follow the [stacking guide](https://docs.hiro.so/stacks.js/guides/how-to-integrate-stacking) created by Hiro, and be sure to integrate the new parameters described in [Hiro's Nakamoto update doc](https://docs.hiro.so/nakamoto/stacks-js).
{% endhint %}

### Step 1: Run a signer

This is a necessary prerequisite to stacking as a solo stacker or pool operator.

Running a signer involves setting up a hosted production environment that includes both a Stacks Node and the Stacks Signer. For more information, refer to the [running a signer doc](running-a-signer.md).

Once the signer software is running, you'll to keep track of the `stacks_private_key` that you used when configuring your signer software. This will be used in subsequent Stacking transactions.

{% hint style="info" %}
In the note above about pool operator vs signer keys, this corresponds to your signer key, not your pool operator wallet
{% endhint %}

### Step 2: Generate a signer key signature

#### Overview of signer keys and signatures

The main difference with Stacking in Nakamoto is that the Signer (either solo Stacker or signer running a pool) needs to include new parameters in their Stacking transactions. These are Clarity transactions that pool operators will call when interacting with the `pox-4.clar` contract. Interacting with that contract is how you as a pool operator actually stack your STX tokens.

Here is an overview of the fields you will need to pass. We'll cover how to get and pass these fields as we dive further into this doc.

{% hint style="info" %}
The current pox-4 contract address can be found by visiting the following endpoint of the Hiro API: [https://api.testnet.hiro.so/v2/pox](https://api.testnet.hiro.so/v2/pox).

You can then visit the [Nakamoto Explorer](https://explorer.hiro.so/?chain=testnet) to view the contract and pass in the contract id.

You may want to review this contract to familiarize yourself with it.
{% endhint %}

1. `signer-key`: the public key that corresponds to the `stacks_private_key` your signer is using
2. `signer-signature`: a signature that demonstrates that you actually controls your `signer-key`. Because signer keys need to be unique, this is also a safety check to ensure that other Stackers can’t use someone else’s public key
3. `max-amount`: The maximum amount of ustx (1 stx = 1,000,000 ustx) that can be locked in the transaction that uses this signature. For example, if calling `stack-increase`, then this parameter dictates the maximum amount of ustx that can be used to add more locked STX
4. `auth-id`: a random integer that prevents re-use of a particular signature, similar to how nonces are used with transactions

Signer signatures are signatures created using a particular signer key. They demonstrate that the controller of that signer key is allowing a Stacker to use their signing key. The signer signature’s message hash is created using the following data:

* `method`: a string that indicates the Stacking method that is allowed to utilize this signature. The valid options are `stack-increase`, `stack-stx`, `stack-extend`, or `agg-commit` (for stack-aggregation-commit)
* `max-amount`: described above
* `auth-id`: described above
* `period`: a value from 0-12, which indicates how long the Stacker is allowed to lock their STX for in this particular Stacking transaction. For `agg-commit`, this must be equal to 1
* `reward-cycle`: This represents the reward cycle in which the Stacking transaction can be confirmed (see the note above on passing in the correct reward cycle for `stack-stx` vs `stack-aggregation-commit`)
* `pox-address`: The Bitcoin address that is allowed to be used for receiving rewards. This corresponds to the Bitcoin address associated with your signer

Now that we have an overview of role and contents of signatures, let's see how to actually generate them. You have several options available.

#### Generating your signature with stacks.js

The [@stacks/stacking](https://www.npmjs.com/package/@stacks/stacking) NPM package provides interfaces to generate and use signer signatures. You'll need to use `@stacks/stacking` package version 6.13.0.

There is a new function called `signPoxSignature` that will allow you to generate this signature and pass it in to the stacking function.

More information and code samples can be found on [Hiro's Nakamoto docs](https://docs.hiro.so/nakamoto/stacks-js).

#### Generating your signature using the stacks-signer CLI

If you already have your signer configured and set up, you can use the stacks-signer CLI to generate this signature. You can either SSH into your running signer or use the stacks-signer CLI locally. If using the CLI locally, you will need to ensure you have a matching configuration file located on your filesystem. Having a matching configuration file is important to ensure that the signer public key you make in Stacking transactions is the same as in your hosted signer.

The CLI command is:

```bash
stacks-signer generate-stacking-signature \
  --pox-address bc1... \
  --reward-cycle 100 \
  --config ./config.toml \
  --period 1 \
  --topic stack-stx
```

These arguments are:

* pox-address: the BTC address where the signer wants to receive Stacking rewards
* reward-cycle: For solo stacking, this must refer to the current reward cycle where the user will broadcast their Stacking transaction. For the stack-aggregation-commit transaction, used in delegated signing, this should match the reward-cycle they are using as an argument in stack-aggregation-commit.
* config: path to a local Signer configuration file
* period: for solo stacking, this refers to the lock-period argument the user makes in stack-stx and the extend-count argument in stack-extend. **For stack-aggregation-commit, this must equal 1**.
* topic: This string is dependent on the Stacking function where the signature will be used.
  * For stack-stx, the topic needs to be `stack-stx`
  * For stack-extend, the topic needs to be `stack-extend`
  * For stack-aggregation-commit, the topic needs to be `agg-commit`

Once the command is run, the CLI will output two fields:

* Signature: 0xaaaaaaaaa
* Public Key: 0xbbbbbb

You will use both the signature and public key when calling Stacking transactions from your pool operator address as outlined above. Remember that this may be different than your signer address.

#### Generating your signature with Lockstacks

Lockstacks is a web application that provides an easy-to-use interface for stacking and generating signatures. We'll cover using Lockstacks for stacking at the end of this document, here we will cover how to use it to generate a signature.

{% hint style="info" %}
At the time of writing, this has only been tested using the [Leather](https://leather.io) wallet.
{% endhint %}

You can visit [lockstacks.com](https://lockstacks.com) to generate a signer key signature. Make sure you’re connected to the correct network.\
\
To generate a signer key signature, it’s important that you’ve logged in Leather with the same secret key that was used to [generate your signer key](running-a-signer.md#preflight-setup-1), not the account that will serve as your pool operator address. Once you’ve setup that account on Leather, you can log in to Lockstacks.\
\
Click the link “Signer key signature” at the bottom of the page. This will open the “generate a signer key signature” page.

<figure><img src="../../.gitbook/assets/image (2).png" alt=""><figcaption></figcaption></figure>

The fields are:

* Reward cycle:
  * For all solo stacking transactions, this must equal the current reward cycle, not the cycle in which they will start stacking. The field defaults to the current reward cycle.
  * For stack-aggregation-commit, this field must equal the cycle used in that function’s “reward cycle” argument. Typically, that equates to current\_cycle + 1.
* Bitcoin address: the PoX reward address that can be used
* Topic: the stacking function that will use this signature
* Max amount: max amount of STX that can be used. Defaults to “max possible amount”
* Auth ID: defaults to random int
* Duration: must match the number of cycles used in the stacking transaction. **For stack-aggregation-commit, use “1”**.

{% hint style="warning" %}
Each of these fields must be exactly matched in order for the Stacking transaction to work. Future updates to Lockstacks will verify the signature before the transaction is made.
{% endhint %}

Click the “generate signature” button to popup a Leather page where you can generate the signature. Once you submit that popup, Lockstacks will have the signer key and signature you generated.

After you sign that message, you'll see the information you need to share with Stackers who are delegating to you, including the signer public key and signature.

You can click the “copy” icon next to “signer details to share with stackers”. This will copy a JSON string, which can be directly pasted into the Lockstacks page where you make your Stacking transaction. Alternatively, this information can be shared and entered manually.

We'll cover the Lockstacks pages for actually making those transactions in the next section of this document.

#### Using a hardware or software wallet to generate signatures

When the signer is configured with a `stacks_private_key`, the signer may want to be able to use that key in a wallet to make stacking signatures.

If the signer uses a tool like [@stacks/cli](https://docs.hiro.so/get-started/command-line-interface) to generate the key, the CLI also outputs a mnemonic (aka “seed phrase”) that can be imported into a wallet. Because the Stacks CLI uses the standard derivation path for generating Stacks keys, any Stacks wallet will default to having that same private key when the wallet is imported from a derivation path. Similarly, if a hardware wallet is setup with that mnemonic, then the Signer can use a wallet like Leather to make stacking signatures.

The workflow for using a setting up a wallet to generate signatures would be:

1. Use @stacks/cli to generate the keychain and private key.
   1. Typically, when using a hardware wallet, it’s better to generate the mnemonic on the hardware wallet. For this use case, however, the signer software needs the private key, and hardware wallets (by design) don’t allow exporting private keys.
2. Take the `privateKey` from the CLI output and add it to your signer’s configuration.
3. Take the mnemonic (24 words) and either:
   1. Setup a new hardware wallet with this mnemonic
   2. Store it somewhere securely, like a password manager. When the signer needs to generate signatures for Stacking transactions, they can import it into either Leather or XVerse.

When the user needs to generate signatures:

1. Setup your wallet with your signer key’s private key. Either:
   1. Setup your Leather wallet with a Ledger hardware wallet
   2. Import your mnemonic into Leather, XVerse, or another Stacks wallet
2. Open an app that has stacking signature functionality built-in
3. Connect your wallet to the app (aka sign in)
4. In the app, enter your PoX address and “submit”
5. The app will popup a window in your wallet that prompts you to sign the information
   1. The app will show clear information about what you’re signing
6. Create the signature
   1. If using a Ledger, confirm on your device
7. The app will display two results:
   1. Your signer key, which is the public key associated with your signer’s key
   2. Your signer signature
8. Finally, make a Stacking transaction using the signer key and signer signature.

Now that you have your signer signature generated, it's time to start stacking. This process will vary depending on your chosen method. We've included instructions for solo stacking and stacking as a pool operator below.

### Step 3a: Stack as a solo stacker

#### stack-stx

To start, you'll visit Lockstacks and click the “Stack independently” button on the home page.

This page will allow you to input the following input:

* The amount of STX you want to lock
* The duration (in number of cycles) to lock for
* Your BTC address where you will receive Stacking rewards
* New fields:
  * Your signer public key
  * Your signer key signature (this is what you generated in the previous step)
  * Auth ID
  * Max amount

#### stack-extend

If you want to extend the amount of time that your STX will be locked for, you can use the stack-extend page on Lockstacks.

If you’re already stacking, the home page will provide a link to “view stacking details”. From there, you can choose to extend.

On this page are the following fields:

* The number of cycles you want to extend for
* Your BTC address to receive rewards
* New fields:
  * Signer public key
  * Signer key signature

### Step 3b: Stack as a pool operator

The first step with delegated stacking involves a stacker delegating their Stacks to a specific pool operator. Stackers can do this by visiting the “Stack in a pool” page on Lockstacks.

As the pool operator, you must provide a STX address (a “pool admin address”) that will manage delegations. As discussed in previous sections, this is a separate address from the signer’s private key, and this can be any address. This address is what will be used when making transactions to confirm and aggregate delegated STX.

Pool operators can log in to LockStacks and visit [https://lockstacks.com/pool-admin](https://lockstacks.com/pool-admin) to make pool management transactions.

#### delegate-stack-stx

Once a user has delegated to a pool operator, the pool operator must call `delegate-stack-stx` for each individual stacker.

#### stack-aggregation-commit

Once a pool has enough delegated STX to become a signer, the pool admin needs to visit the `stack-aggregation-commit` page on Lockstacks. The pool operator enters the following information:

* Reward cycle: the reward cycle where the operator is “commiting” delegated STX. This must be done for every individual reward cycle where the pool will be acting as a signer.
* BTC address
* New fields:
  * Signer public key
  * Signer key signature (generated in a previous step using the signer key)
  * Auth ID
  * Max amount

Once this transaction has been confirmed, the pool operator is eligible to be a signer for an upcoming reward cycle.

### Relationship between manual stacking transactions and the running signer

This section describes the various transactions that signers need to make in order to be registered as a signer for a certain reward cycle. The order of operations between the automated signer and the stacking transactions that need to be done “manually” is important for ensuring that a signer is fully set up for a certain reward cycle.

<figure><img src="../../.gitbook/assets/Untitled design (1).png" alt=""><figcaption></figcaption></figure>

#### Prerequisite: ensure the signer is hosted and running

It's important to emphasize the importance of getting the signer running in a hosted environment before making Stacking transactions. If the signer doesn’t do that, they run the risk of being registered as a signer without their signer software being ready to run DKG and other important consensus mechanisms.

Some of the important things to double check to ensure the signer is “running” are:

* The signer software is configured with a private key that the user can access (either through SSH or other means). This is important because their signer needs to utilize this private key to generate signer key signatures that are used in Stacking transactions.
* The signer software is properly configured to make RPC calls to a Stacks node. This refers to the `endpoint` signer configuration field. If properly configured, there should be logs in the Stacks node that show the RPC calls being made from the signer.
* The stacks node is properly configured to send events to the signer. This refers to the \[\[`event_observers`]] field in the Stacks Node’s configuration. If properly configured, the signer should have logs indicating that it’s receiving events from the Stacks node.

### How a signer becomes registered in the signer set

Each of the stacking transactions described above are done “manually”. More specifically, this means that none of these transactions are executed automatically by the signer software. The transactions must be done “out of band”.

In order for a signer to actually be registered in a reward cycle, there need to be manual transactions made in the `pox-4` contract. While the signer software is running, it is continually polling the Stacks node and asking “am I a signer in reward cycle N?”.

If these manual transactions are confirmed, and the signer has enough STX associated with the signer’s public key, the signer will be registered as a signer in the signer set.

#### Solo stacking

The workflow for solo stackers is more simple, because there are less stacking transactions that need to be made.

For solo stacking, the only transaction that needs to be made is `stack-stx`. Included in this transaction’s payload is the signer’s public key.

In order for the signer to be registered in reward cycle N+1, the `stack-st`x transaction must be confirmed during the first 2000 blocks of reward cycle N. The last 100 blocks of cycle N (the “prepare phase”) is where DKG occurs.

The start of the prepare phase is when Stacks nodes determine the official signer set of the next reward cycle.

#### Delegated Stacking

The workflow for delegated signers is more complex, because it requires more transactions.

This workflow is explained more in a previous section, but the high-level workflow is:

1. Stackers delegate their STX to a pool operator
2. The pool operator makes `delegate-stack-stx` transactions to “approve” specific stackers. This needs to be called for every individual stacker that delegates to them.
3. The pool operator makes a `stack-aggregation-commit` transaction to “commit” all of its delegated STX up to this point.

Similar to solo stacking, these steps must be made before the prepare phase of an upcoming reward cycle.

{% hint style="warning" %}
Even after you Stack, you may still see a message that says:

```
Signer is not registered for the current reward cycle (557) or next reward cycle (558). Waiting for confirmed registration...
```

This is normal and means that you have stacked, but have not yet reach the prepare phase for your chosen reward cycle. Assuming you have met the stacking minimum, your signer will be picked up and registered during this prepare phase.
{% endhint %}

### Once a signer is registered in the signer set

During the prepare phase before a reward cycle, Stacks nodes automatically determine the signer set for the upcoming cycle. When this occurs, the Stacks nodes make an “internal” transaction to update the `.signers` contract with the list of signers.

The signer software is continuously polling the Stacks node to see if it is registered for a cycle. If the signer software finds that it is registered (by matching its public key to the signers stored in the `signers` contract) it begins performing its duties as a signer.

During the prepare phase, the signers perform DKG through StackerDB messages. Once an aggregate public key is determined, the signer automatically makes a `vote-for-aggregate-key` transaction. No out-of-band action is needed to be taken for this to occur.

During the instantiation phase (before fast blocks and full Nakamoto rules go live), the signer must pay a STX transaction fee for this transaction to be confirmed. Critically, this means that a minimum balance must be kept in the STX address associated with the signer’s key. There is a config field called `tx_fee_ms` (transaction fee in micro-stacks) that can be optionally configured to set the fee for these transactions. If the config field is omitted, the fee defaults to 10,000 micro-stacks (0.01 STX).

During the Activation phase (after fast blocks and full Nakamoto rules have been activated), the signer doesn’t need to pay fees for this transaction, so no STX balance needs to be kept in that address.
