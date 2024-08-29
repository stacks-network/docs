# Stacking

Stacking is implemented as a smart contract using Clarity. You can always find the Stacking contract identifier using the Stacks Blockchain API [`v2/pox` endpoint](https://docs.hiro.so/api#operation/get\_pox\_info).

Currently stacking uses the pox-4 contract. The deployed pox-4 contract and included comments can be [viewed in the explorer](https://explorer.hiro.so/txid/SP000000000000000000002Q6VF78.pox-4?chain=mainnet).

In this walkthrough, we'll cover the entire stacking contract from start to finish, including descriptions of the various functions and errors, and when you might use/encounter them.

If you are running into a specific stacking error, jump to the [errors section](stacking.md#errors).

Rather than walking through the contract line by line, which you can do by simply reading the contract code and the comments, we'll instead explore it from the perspective of conducting stacking operations, including solo stacking, delegating, and running a pool.

At the bottom you will find a list of some errors you may run into and their explanations.

There are a few utilities that make interacting with this contract easier including [Lockstacks](https://lockstacks.com) as a UI and the [@stacks/stacking package](https://www.npmjs.com/package/@stacks/stacking) for a JS library.

Hiro has a [detailed guide](https://docs.hiro.so/stacks.js/guides/how-to-integrate-stacking) available for stacking using this library as well as a [Nakamoto guide](https://docs.hiro.so/nakamoto/stacks-js) specifically for the additions made to work with `pox-4`.

### Prerequisites

If you are not familiar with stacking as a concept, it will be useful to [familiarize yourself with that first](../concepts/block-production/stacking.md) before diving into the contract.

### Solo Stacking

Solo stacking is the simplest option, and begins by calling the `stack-stx` function.

#### stack-stx

This function locks up the given amount of STX for the given lock period (number of reward cycles) for the `tx-sender`.

Here's the full code for that function, then we'll dive into how it works below that.

```clojure
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

First let's cover the needed parameters.

* `amount-ustx` is the amount of STX you would like to lock, denoted in micro-STX, or uSTX (1 STX = 1,000,000 uSTX)
* `pox-addr` is a tuple that encodes the Bitcoin address to be used for the PoX rewards, details below
* `start-burn-ht` is the Bitcoin block height you would like to begin stacking. You will receive rewards in the reward cycle following `start-burn-ht`. Importantly, `start-burn-ht` may not be further into the future than the next reward cycle, and in most cases should be set to the current burn block height.
* `lock-period` sets the number of reward cycles you would like you lock your STX for, this can be 1-12
* `signer-sig` is a unique generatedf signature that proves ownership of this signer. Further details for its role and how to generate it can be found in the [How to Stack](../guides-and-tutorials/stack-stx/stacking-flow.md) doc
* `signer-key` is the public key of your signer, more details in the [How to Run a Signer](../guides-and-tutorials/running-a-signer/) doc
* `max-amount` sets the maximum amount allowed to be stacked during the provided stacking period
* `auth-id` is a unique string to prevent re-use of this stacking transaction

{% hint style="warning" %}
It's important to make sure that these fields match what you pass in to the signer signature generation. If they don't, you will likely get error 35 (`ERR_INVALID_SIGNATURE_PUBKEY`) \
when trying to submit this transaction as the signer signature will not be valid.
{% endhint %}

#### Supported Reward Address Types

{% hint style="info" %}
For the `pox-addr` field, the `version` buffer must represent what kind of bitcoin address is being submitted. These are all the possible values you can pass here depending on your address type:

```clojure
(define-constant ADDRESS_VERSION_P2PKH 0x00)
(define-constant ADDRESS_VERSION_P2SH 0x01)
(define-constant ADDRESS_VERSION_P2WPKH 0x02)
(define-constant ADDRESS_VERSION_P2WSH 0x03)
(define-constant ADDRESS_VERSION_NATIVE_P2WPKH 0x04)
(define-constant ADDRESS_VERSION_NATIVE_P2WSH 0x05)
(define-constant ADDRESS_VERSION_NATIVE_P2TR 0x06)
```

The `hashbytes` are the 20 hash bytes of the bitcoin address. You can obtain that from a bitcoin library, for instance using [`bitcoinjs-lib`](https://github.com/bitcoinjs/bitcoinjs-lib):

```javascript
const btc = require("bitcoinjs-lib");
console.log(
  "0x" +
    btc.address
      .fromBase58Check("1C56LYirKa3PFXFsvhSESgDy2acEHVAEt6")
      .hash.toString("hex")
);
```
{% endhint %}

The first thing the `stack-stx` function will do perform several checks including:

* The `start-burn-ht` results in the next reward cycle
* The function is being called by the `tx-sender` or an allowed contract caller
* The `tx-sender` is not currently stacking or delegating
* The `tx-sender` has enough funds
* The given `signer-key` is valid, proving ownership
* Stacking can be performed. This is determined through additional checks including if the amount meets the minimum stacking threshold and if the lock period and provided Bitcoin address are valid

You can explore the private functions that handle these checks to see exactly how they do so.

Next we register the provided PoX address for the next reward cycle, assign its specific reward slot, and add it to the `stacking-state` map, which keeps track of all current stackers per reward cycle.

Finally we return the lock up information so the node can carry out the lock by reading this information. This step is what actually locks the STX and prevents the stacker from using them on-chain.

From here, the locked STX tokens will be unlocked automatically at the end of the lock period.

The other option is that the stacker can call the `stack-increase` or `stack-extend` functions to either increase the amount of STX they have locked or increase the amount of time to lock them, respectively.

### Delegated Stacking

Delegated stacking has a few additional steps to it. It is essentially a three-step process:

* Delegator delegates their STX to a pool operator
* Pool operator stacks their delegated STX
* Pool operator commits an aggregate of all STX delegated to them

There are also a few alternative steps here depending on the action you want to take.

* Revoke delegation
*

Each of these steps has a corresponding function. Let's dig into them.

#### delegate-stx

This function is called by the individual stacker delegating their STX to a pool operator. An individual stacker choosing to delegate does not need to run their own signer.

This function does not actually lock the STX, but just allows the pool operator to issue the lock.

```clojure
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

This function takes a few parameters:

* `amount-ustx` is the amount the stacker is delegating denoted in uSTX
* `delegate-to` is the Stacks address of the pool operator (or delegate) being delegated to
* `until-burn-ht` is an optional parameter that describes when this delegation expires
* `pox-addr` is an optional Bitcoin address. If this is provided, the pool operator must send rewards to this address. If it is not provided, it is up to the discretion of the pool operator where to send the rewards.

It first runs through a few checks to ensure that the function caller is allowed, the provided `pox-addr` is valid, and that the stacker is not already delegating.&#x20;

Finally it updates the `delegation-state` of the contract with the details.

At this point, no STX have been locked. The pool operator next needs to call the `delegate-stack-stx` function in order to partially lock the STX.

#### delegate-stack-stx

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

At this point, the stacker has given their permission to the pool operator to delegate their STX on their behalf.

The delegation is now in the hands of the pool operator to stack these delegated STX using the `delegate-stack-stx` function.

This function can only be called after a stacker has called their respective `delegate-stx` function and must be called by the pool operator for each instance of a stacker calling `delegate-stx`.

Like the other functions, this function takes in several parameters and runs through several checks before updating the contract state.

* `stacker` is the principal of the stacker who has delegated their STX
* `amount-ustx` is the amount they have delegated in uSTX
* `pox-addr` is the Bitcoin address the rewards will be sent to. If the stacker passed this field in to their `delegate-stx` function, this must be the same value
* `start-burn-ht` corresponds to the field passed in by the stacker
* `lock-period` corresponds to the same field that the stacker passed in

Now we assign a few variables using `let` before running several checks.

* `first-reward-cycle` is set to the next reward cycle automatically
* `specified-reward-cycle` is the reward cycle that the passed-in `start-burn-ht` parameter falls within
* `unlock-burn-height` is the Bitcoin block height at which the stackers STX will be unlocked

Now we proceed to run through some checks including:

* The first reward cycle is the same as the specified reward cycle
* The function is being called by the `tx-sender` or an approved contract
* That the stacker actually delegated to the contract caller
* Then we get the information from the delegation and make sure the information we are passing here matches it
* That the stacker is not currently stacking
* They have sufficient unlocked funds
* Run the `minimal-can-stack-stx` to run a few additional checks to make sure stacking can occur

Next we call a function called `add-pox-partial-stacked` which will add this stacker to a `partial-stacked-by-cycle` map.

After those checks and partial stacking, we update the `stacking-state` map and return the information for the node to process.

At this point this stacker's STX are considered partially stacked. We still need to perform one more step as the pool operator in order to officially lock them.

#### stack-aggregation-commit

The `stack-aggregation-commit` function is just a wrapper for the private `inner-stack-aggregation-commit` function, so that is the source code included here.

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

This function contains many of the same parameters as the `stack-stx` function, with a few changes:

* `pox-addr` is a tuple that encodes the Bitcoin address to be used for the PoX rewards, details below
* `reward-cycle` is the reward cycle that these delegated STX will be stacked in
* `signer-sig` is a unique generated signature that proves ownership of this signer. Further details for its role and how to generate it can be found in the [How to Stack](../guides-and-tutorials/stack-stx/stacking-flow.md) doc
* `signer-key` is the public key of your signer, more details in the [How to Run a Signer](../guides-and-tutorials/running-a-signer/) doc
* `max-amount` sets the maximum amount allowed to be stacked during the provided stacking period
* `auth-id` is a unique string to prevent re-use of this stacking transaction

{% hint style="warning" %}
It's important to make sure that these fields match what you pass in to the signer signature generation. If they don't, you will likely get error 35 (`ERR_INVALID_SIGNATURE_PUBKEY`) when trying to submit this transaction as the signer signature will not be valid.
{% endhint %}

The first thing we do is pull the partially stacked STX that have been added to the contract state via our `delegate-stack-stx` calls.

Next we run through many of the same checks as in previous functions:

* Making sure the contract caller is allowed
* Making sure the signer signature is valid
* Making sure we can actually perform this stacking operation

Now we take all of the delegated STX and actually add it to the reward cycle. At this point the pool operator has a reward slot in the chosen cycle.

We don't need to update the stacking state because we already did that in the `delegate-stack-stx` function.

All we need to do is delete and log the partially stacked STX state.

### How Stacking Reward Distribution Works

All of the above stacking functions take in a `pox-reward` field that corresponds to a Bitcoin address where BTC rewards will be sent. It's important to understand how these addresses are used and how reward distribution is handled in general.

How Bitcoin rewards are distributed is primarily up to the discretion of the pool operator. Since PoX reward distributions are handled using Bitcoin transactions, there is currently not an effective way to automate their distribution to individual delegated stackers.

Let's go over the role of `pox-addr` in each function and how it should be used.

#### stack-stx

This is the simplest option and simply corresponds to the Bitcoin address that the stacker would like to receive their rewards.

#### delegate-stx

In this function, which is the one that the delegator will be calling to give permission to the pool operator to stack on their behalf, the `pox-addr` argument is optional.

If no `pox-addr` argument is not passed in, the pool operator determines where this delegator's rewards are sent.

If a `pox-addr` is passed in, then rewards must be distributed to that address. **However, if this is passed in, the delegator must have enough STX to meet the minimum stacking amount.**

The reason is because there are a finite amount of reward slots (4,000) and each `pox-addr` takes up one of these reward slots.

Stackers need to be able to stack the minimum in order to be eligible for one of these reward slots. A delegator may choose to delegate to a pool (even if they meet the minimum stacking requirement) if they do not want to handle the infrastructure of running a signer or the actual stacking operations, which is why this option exists.

#### delegate-stack-stx and stack-aggregation-commit

In both of these functions, `pox-addr` corresponds to the address where the pool operator would like the rewards to be sent.

At this point, it is up to the pool operator to determine how to allocate rewards. In most cases, a pool operator will use a wrapper contract in order to transparently track this information on-chain, and manually send rewards out to participants according to the proportion that they delegated.

### Errors

You may encounter several errors when trying to perform stacking operations. We won't cover them all in detail here, as you can see the error in the failed transaction and trace the source code to find it.

But we will cover some of the more common errors you may encounter, what they mean, and how to resolve them.

#### Error 35 - `ERR_INVALID_SIGNATURE_PUBKEY`

This is likely the most common error you will encounter, and you'll usually see it in a failed `stack-stx` or `stack-aggregation-commit` transaction.

This error actually occurs in the `consume-signer-key-authorization` which is called any time we pass in a signer signature.

This means one of two things:

* The public key you used to generate the signer signature is not the same as the one you are passing in to the `signer-key` field
* One of the fields you passed in to generate your signer signature does not match the field you passed in to either the `stack-stx` or `stack-aggregation-commit` function

To fix this, check all of the data you passed in to see where the mismatch is.

#### Error 4 - ERR\_STACKING\_NO\_SUCH\_PRINCIPAL

The stacking contract looks up partially stacked stx (after you have called `delegate-stack-stx`) with the lookup key `(pox-addr, stx-address, reward-cycle`. This error means that either when you generated your signature or called the `stack-aggregation-commit` function, you passed in the wrong parameter for one of these. More information in the [stacking guide](../guides-and-tutorials/stack-stx/stacking-flow.md#delegator-initiates-delegation).

#### Error 24 -&#x20;

`24` : the `start-burn-height` param was invalid
