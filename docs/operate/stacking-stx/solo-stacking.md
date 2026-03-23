# Solo Stacking

This guide covers everything you need to stack independently as a solo stacker: starting, extending, increasing, and stopping your stacking position.

{% hint style="info" %}
This guide assumes you are familiar with stacking at a conceptual level. If not, read the [Stacking](https://app.gitbook.com/s/H74xqoobupBWwBsVMJhK/block-production/stacking) concept guide first.
{% endhint %}

Solo stacking requires meeting the minimum STX threshold and either running a signer or collaborating with one. The minimum amount is dynamic and can be found at the [pox endpoint](https://api.mainnet.hiro.so/v2/pox) under `min_threshold_ustx` (1 STX = 1,000,000 uSTX).

{% hint style="info" %}
[Degen Lab](https://solo.stacking.tools/) provides a solo stacking dapp that lets you stack without running your own signer, as they operate one on your behalf. This is likely the easiest option for solo stacking.
{% endhint %}

If you don't meet the stacking minimum, see the [Stack with a Pool](stack-with-a-pool.md) guide instead.

## Prerequisites

Before you begin, make sure you have:

1. **A running signer** or a signer you are collaborating with. See the [Run a Signer](../run-a-signer/) guide.
2. **A signer key signature** for the stacking transaction you want to make. See [Generate a Signer Signature](generate-signer-signature.md).
3. **Sufficient STX** — at or above the minimum stacking threshold.

{% hint style="info" %}
There are several ways to make stacking transactions. This guide covers using [Leather Earn](https://earn.leather.io/), which is the simplest option. You can also call the stacking functions directly from the [deployed contract](https://explorer.hiro.so/txid/SP000000000000000000002Q6VF78.pox-4?chain=mainnet) in the explorer, or use the [@stacks/stacking](https://github.com/stx-labs/stacks.js/tree/main/packages/stacking) NPM package.

The functions and parameters are the same regardless of method.
{% endhint %}

***

## Start Stacking

### Call `stack-stx`

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

The arguments are:

* **Amount**: Denoted in uSTX (1 STX = 1,000,000 uSTX)
* **PoX Address**: the BTC wallet address where you will receive stacking rewards
* **Start burn height**: the current BTC block height
* **Lock period**: the number of cycles to lock for (between 1 and 12)
* **Signer key**: the public key that your signer is using
* **Signer signature**: a signature that proves control of this signer key (see [Generate a Signer Signature](generate-signer-signature.md))
* **Max Amount**: used to validate the signer signature; represents the maximum number of uSTX that can be stacked in this transaction
* **Auth Id**: used to validate the signer signature; a random integer that prevents re-use of this particular signature

### Using Leather Earn

Visit [Leather Earn](https://earn.leather.io/) and click the "Stack independently" button on the home page. You will be prompted to enter:

* The amount of STX to lock
* The duration (number of cycles) to lock for
* Your BTC address for stacking rewards
* Your signer public key
* Your signer key signature
* Auth ID
* Max amount

{% hint style="info" %}
When using Leather Earn, you can paste the JSON output from the signature generation step directly into the form.
{% endhint %}

### Acting as a signer vs. working with one

**Option 1: Act as a signer.** If you run your own signer, ensure it is running during the prepare phase (last 100 blocks before the next cycle). This is when distributed key generation (DKG) occurs. You don't need to do anything actively during this period other than monitoring your signer.

**Option 2: Work with a signer.** If you don't want to run a signer yourself, you can collaborate with an existing one. You'll need their signer key and a signer signature generated for your stacking transaction. [Degen Lab's solo stacking dapp](https://solo.stacking.tools/) simplifies this process by providing their signer for you to use.

***

## Extend Your Lock Period

You can extend your lock period while actively stacking by calling `stack-extend`. You can also rotate your signer key and change your Bitcoin reward address as part of this call.

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

The arguments are:

* **Extend count**: the number of cycles to add to your lock period. The resulting total lock period cannot exceed 12. For example, if you have 6 cycles remaining, the maximum you can extend is 6.
* **Pox Address**: the BTC address to receive rewards. This can be changed from your original address.
* **Signer public key**: the public key used for signing. This can stay the same, or you can rotate to a new key. See [Key and Address Rotation](key-and-address-rotation.md).
* **Signer signature**: a signature proving control of your signing key (see [Generate a Signer Signature](generate-signer-signature.md))
* **Max Amount**: used to validate the signer signature
* **Auth Id**: used to validate the signer signature

### Using Leather Earn

If you're already stacking, the Leather Earn home page will show a link to "view stacking details". From there, you can choose to extend. The form asks for:

* The number of cycles to extend for
* Your BTC address for rewards
* Signer public key
* Signer key signature
* Auth ID
* Max amount

***

## Increase Your Stacked Amount

You can increase the amount of STX locked while actively stacking. The increased position takes effect starting with the next stacking cycle. Call the `stack-increase` function.

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

* **Increase by**: the amount of uSTX to add to your locked amount
* **Signer public key**: the public key used for signing. This can stay the same, or you can use a new key.
* **Signer signature**: a signature proving control of your signing key (see [Generate a Signer Signature](generate-signer-signature.md))
* **Max Amount**: used to validate the signer signature; represents the maximum number of uSTX (1 STX = 1,000,000 uSTX) that can be stacked in this transaction
* **Auth Id**: used to validate the signer signature

### Using Leather Earn

If you're already stacking, the home page will show a link to "view stacking details". From there, choose to increase. The form asks for:

* The amount of STX to increase by
* Signer public key
* Signer key signature
* Auth ID
* Max amount

***

## Stop Stacking

When stacking solo, your STX is locked for a fixed period defined when you initiated stacking or extended the lock period. **No additional action is required to stop stacking** — your tokens unlock automatically when the lock period expires.

{% hint style="info" %}
Both the `stack-stx` and `stack-extend` functions emit an event that includes the `unlock-burn-height` field. This is the burn block height at which your tokens will be automatically unlocked.
{% endhint %}

To avoid your position being extended, simply do not call `stack-extend` before the current lock period ends. Once the lock period expires, your STX will be returned to your account.

### Monitoring your unlock

* Use your wallet's interface or the [Hiro Explorer](https://explorer.hiro.so/?chain=mainnet) to track the status of your lock period.
* Hiro's API offers an endpoint to [Get account STX balance](https://docs.hiro.so/stacks/api/accounts/stx-balances), which includes the `burnchain_unlock_height` representing when your STX unlock.

***

## How Signer Registration Works

In the prepare phase before the next stacking cycle (last 100 blocks), the signer set is selected based on the amount of STX stacked. For solo stackers, the only transaction needed is `stack-stx` — once it is confirmed during the first 2000 blocks of the current reward cycle, your signer will be registered in the next cycle's signer set.

It is critical that your signer is running during the prepare phase. This is when DKG occurs, and the signer automatically participates — no manual action required beyond monitoring.
