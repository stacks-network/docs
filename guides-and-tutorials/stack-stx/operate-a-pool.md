# Operate a Pool

This doc assumes you are familiar with stacking at a conceptual level. If not, you may want to read the [Stacking](../../concepts/block-production/stacking.md) concept guide.

The guide below applies to those who want to operate a pool, meaning they want to have stackers delegate STX tokens to them. If you choose to operate a pool you will either need to run your own signer or collaborate with one.

### Pool Operator Stacking Flow

For pool operators, the flow is a bit different than solo stacking. Remember that as a pool operator, other stackers are delegating their STX to you to stack on behalf of them. This additional role adds a couple of extra steps to your stacking flow if operating as a pool operator.

Similar to the changes to solo Stacking, the big difference for delegation flows is the inclusion of signer keys and signatures. Because signers need to make transactions to “finalize” a delegation, these new arguments add new complexities to the signer.

#### Delegator initiates delegation

{% hint style="info" %}
This step does not apply to pool operators/signers. It is included here to illustrate the end-to-end flow, but if you are operating as a pool operator/signer you will not perform this step. Instead, users delegate their stx to you as the pool operator.
{% endhint %}

The first step, where the delegator sets up their delegation to a pool operator, is to call `delegate-stx`. This function does not directly delegate the stx, but rather allows the pool operator to issue the stacking lock on behalf of the user calling this function. You can think of calling this function as the delegator giving permission to the pool operator to stack on their behalf.

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
* Until burn height: an optional argument when the delegation expires. If none is used, the delegation permission expires only when explicitly revoked.
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
In the Definitions and Roles section in the previous document, we described how the pool operator and signer may be the same entity, but not necessarily have the same address.

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

Now that you are familiar with the overall stacking flow and the different roles played, let's dive into the step-by-step guide for actually conducting the stacking process as apool operator.

{% hint style="info" %}
There are several ways you can go about stacking. This guide will cover using Lockstacks, which is a stacking web application and the simplest option.

Additionally, you can choose to call the stacking functions directly from the [deployed contract](https://explorer.hiro.so/txid/0xaf8857ee1e4b8afc72f85b85ad785e1394672743acc63f4df79fb65b5e8b9d2a?chain=testnet) in the explorer.

The fields and process will be the same, but the UI will differ.

Finally, you can stack using JS and the [@stacks/stacking](https://github.com/hirosystems/stacks.js/tree/main/packages/stacking) package if you prefer. Again, the functions and parameters will be the same, you will just be writing your JS code directly instead of using a UI.

If you are interested in using this method, you'll want to follow the [stacking guide](https://docs.hiro.so/stacks.js/guides/how-to-integrate-stacking) created by Hiro, and be sure to integrate the new parameters described in [Hiro's Nakamoto update doc](https://docs.hiro.so/nakamoto/stacks-js).
{% endhint %}

### Step 1: Run or work with a signer

This is a necessary prerequisite to stacking as a pool operator. You will either need to run your own signer or work with one and have them conduct step 2 on your behalf and give you their signer signature.

Running a signer involves setting up a hosted production environment that includes both a Stacks Node and the Stacks Signer. For more information, refer to the [running a signer doc](../running-a-signer/).

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

**Generating your signature with Degen Labs stacks.tools**

Degen Labs has a signature generation tool that will generator a signature using their signer. This is the quickest and simplest option. To generate a signature using this method, all you need to do is visit their [signature tool](https://signature.stacking.tools/) and pass in the relevant information as covered on this page.

#### Generating your signature with stacks.js

The [@stacks/stacking](https://www.npmjs.com/package/@stacks/stacking) NPM package provides interfaces to generate and use signer signatures. You'll need to use `@stacks/stacking` package version 6.13.0.

There is a new function called `signPoxSignature` that will allow you to generate this signature and pass it in to the stacking function.

More information and code samples can be found on [Hiro's Nakamoto docs](https://docs.hiro.so/nakamoto/stacks-js).

#### Generating your signature using the stacks-signer CLI

If you already have your signer configured and set up, you can use the stacks-signer CLI to generate this signature. You can either SSH into your running signer or use the stacks-signer CLI locally. If using the CLI locally, you will need to ensure you have a matching configuration file located on your filesystem. Having a matching configuration file is important to ensure that the signer public key you make in Stacking transactions is the same as in your hosted signer.

The CLI command is:

```bash
stacks-signer generate-stacking-signature \
  --method stack-stx \
  --max-amount 1000000000000 \
  --auth-id 12345 \
  --period 1 \
  --reward-cycle 100 \
  --pox-address bc1... \
  --config ./config.toml \
  --json
```

These arguments match those described in section [Overview of signer keys and signatures](operate-a-pool.md#overview-of-signer-keys-and-signatures), with the addition of:

* `--config`, to provide the configuration file path;
* `--json`, to optionally output the resulting signature in JSON.

You can use the following command to generate a random `128` bit integer as `auth-id`:

```bash
python3 -c 'import secrets; print(secrets.randbits(128))'
```

Once the `generate-stacking-signature` command is run, the CLI will output a JSON:

```json
{"authId":"12345","maxAmount":"1234","method":"stack-stx","period":1,"poxAddress":"bc1...","rewardCycle":100,"signerKey":"aaaaaaaa","signerSignature":"bbbbbbbbbbb"}
```

You will use the JSON when calling Stacking transactions from your pool operator address as outlined above. Remember that this may be different than your signer address.

#### Generating your signature with Lockstacks

Lockstacks is a web application that provides an easy-to-use interface for stacking and generating signatures. We'll cover using Lockstacks for stacking at the end of this document, here we will cover how to use it to generate a signature.

{% hint style="info" %}
At the time of writing, this has only been tested using the [Leather](https://leather.io) wallet.
{% endhint %}

You can visit [lockstacks.com](https://lockstacks.com) to generate a signer key signature. Make sure you’re connected to the correct network.\
\
To generate a signer key signature, it’s important that you’ve logged in Leather with the same secret key that was used to [generate your signer key](../running-a-signer/#preflight-setup-1), not the account that will serve as your pool operator address. Once you’ve setup that account on Leather, you can log in to Lockstacks.\
\
Click the link “Signer key signature” at the bottom of the page. This will open the “generate a signer key signature” page.

<figure><img src="../../.gitbook/assets/image (2) (1).png" alt=""><figcaption></figcaption></figure>

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

### Step 3: Stack as a pool operator

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

For more on the relationship between automated signing and manual stacking transactions, be sure to check out the main [Stack STX](./) doc.
