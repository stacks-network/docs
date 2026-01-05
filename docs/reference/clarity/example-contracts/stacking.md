# stacking

Stacking is implemented as a smart contract using Clarity. You can always find the Stacking contract identifier using the Stacks Blockchain API [`v2/pox` endpoint](https://docs.hiro.so/api#operation/get_pox_info).

Currently, stacking uses the pox-4 contract. The deployed pox-4 contract and included comments can be [viewed in the explorer](https://explorer.hiro.so/txid/SP000000000000000000002Q6VF78.pox-4?chain=mainnet).

In this walkthrough, we'll cover the entire stacking contract from start to finish, including descriptions of the various functions and errors, and when you might use/encounter them.

Rather than walking through the contract line by line, which you can do by simply reading the contract code and the comments, we'll instead explore it from the perspective of conducting stacking operations, including solo stacking, delegating, and running a pool.

At the bottom you will find a list of some errors you may run into and their explanations.

There are a few utilities that make interacting with this contract easier including [Leather Earn](https://earn.leather.io/) as an UI and the [@stacks/stacking package](https://www.npmjs.com/package/@stacks/stacking) for a JS library.

Hiro has a [detailed guide](https://docs.hiro.so/stacks.js/guides/how-to-integrate-stacking) available for stacking using this library as well as a [Nakamoto guide](https://docs.hiro.so/nakamoto/stacks-js) specifically for the additions made to work with `pox-4`.

***

## Solo Stacking

Solo stacking is the simplest option, and begins by calling the `stack-stx` function.

### stack-stx

This function locks up the given amount of STX for the given lock period (number of reward cycles) for the `tx-sender`.

Here's the full code for that function, then we'll dive into how it works below that.

{% code title="pox-4: stack-stx" %}
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
{% endcode %}

First let's cover the needed parameters.

* `amount-ustx` is the amount of STX you would like to lock, denoted in micro-STX, or uSTX (1 STX = 1,000,000 uSTX).
* `pox-addr` is a tuple that encodes the Bitcoin address to be used for the PoX rewards, details below.
* `start-burn-ht` is the Bitcoin block height you would like to begin stacking. You will receive rewards in the reward cycle following `start-burn-ht`. Importantly, `start-burn-ht` may not be further into the future than the current reward cycle, and in most cases should be set to the current burn block height.
* `lock-period` sets the number of reward cycles you would like you lock your STX for, this can be between 1 and 12.
* `signer-sig` is a unique generated signature that proves ownership of this signer.
* `signer-key` is the public key of your signer.
* `max-amount` sets the maximum amount allowed to be stacked during the provided stacking period.
* `auth-id` is a unique string to prevent re-use of this stacking transaction.

{% hint style="warning" %}
It's important to make sure that these fields match what you pass in to the signer signature generation. If they don't, you will likely get error 35 (`ERR_INVALID_SIGNATURE_PUBKEY`) when trying to submit this transaction as the signer signature will not be valid.
{% endhint %}

### Supported Reward Address Types

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

The `stack-stx` function performs several checks including:

* The `start-burn-ht` results in the next reward cycle
* The function is being called by the `tx-sender` or an allowed contract caller
* The `tx-sender` is not currently stacking or delegating
* The `tx-sender` has enough funds
* The given `signer-key` is valid, proving ownership
* Stacking can be performed (amount meets minimum threshold, lock period and bitcoin address are valid)

Next the function registers the provided PoX address for the next reward cycle, assigns its specific reward slot, and adds it to the `stacking-state` map, which keeps track of all current stackers per reward cycle.

Finally it returns the lock-up information so the node can carry out the lock. This step is what actually locks the STX and prevents the stacker from using them on-chain.

From here, the locked STX tokens will be unlocked automatically at the end of the lock period. The stacker can also call `stack-increase` or `stack-extend` to increase the amount locked or extend the time.

***

## Delegated Stacking

Delegated stacking is essentially a multi-step process where delegators give pool operators permission to lock STX on their behalf. The typical flow:

{% stepper %}
{% step %}
#### Step: Delegator delegates their STX to a pool operator

The delegator calls `delegate-stx` to record that they delegate a given amount to a specific pool operator. This does not lock the STX — it only records the delegation permission.
{% endstep %}

{% step %}
#### Step: Pool operator stacks delegated STX (partial)

The pool operator calls `delegate-stack-stx` for each delegator they will lock on behalf of. This marks those STX as partially stacked (not yet in the official reward set).
{% endstep %}

{% step %}
#### Step: Pool operator commits aggregated locks

When the pool operator has aggregated enough delegated STX, they call `stack-aggregation-commit-indexed` (wraps `inner-stack-aggregation-commit`) to commit the aggregated stake into the reward set for the reward cycle.
{% endstep %}
{% endstepper %}

There are also alternative actions like revoking delegation (see contract functions).

***

### delegate-stx

This function is called by the individual stacker delegating their STX to a pool operator. An individual stacker choosing to delegate does not need to run their own signer.

This function does not actually lock the STX, but just allows the pool operator to issue the lock.

{% code title="pox-4: delegate-stx" %}
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
{% endcode %}

Parameters:

* `amount-ustx`: amount delegating (uSTX)
* `delegate-to`: Stacks address of the pool operator
* `until-burn-ht`: optional expiry burn height for the delegation
* `pox-addr`: optional Bitcoin address where this delegator wants rewards sent (if supplied, pool operator must send rewards to this address)

Checks: caller allowed, `pox-addr` version valid if provided, delegator not already delegating. Updates `delegation-state`. No STX are locked yet — the pool operator must call `delegate-stack-stx`.

***

### delegate-stack-stx

Called by the pool operator to partially stack a delegator's STX.

{% code title="pox-4: delegate-stack-stx" %}
```clojure
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
{% endcode %}

This function validates the delegation record, ensures the delegator has the funds and is not already stacking, runs lightweight stacking checks, registers the partial stacked amount, and updates `stacking-state`. The STX remain partially stacked until the operator commits.

***

### stack-aggregation-commit-indexed / inner-stack-aggregation-commit

The `stack-aggregation-commit-indexed` function wraps the private `inner-stack-aggregation-commit`. The private function commits partially stacked amounts into the reward set so each pox-addr obtains a reward-slot index.

{% code title="pox-4: inner-stack-aggregation-commit" %}
```clojure
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
{% endcode %}

Key points:

* Validates caller and signer signature.
* Validates stacking conditions.
* Adds the aggregated pox-addr to the reward cycle and returns its reward-set index.
* Deletes the partial-stacked entry and logs it.

***

## How Stacking Reward Distribution Works

All of the above stacking functions take a `pox-addr` field that corresponds to a Bitcoin address where BTC rewards will be sent. It's important to understand how these addresses are used and how reward distribution is handled.

How Bitcoin rewards are distributed is primarily up to the discretion of the pool operator. Since PoX reward distributions are handled using Bitcoin transactions, there is currently not an effective way to automate their distribution to individual delegated stackers.

Role of `pox-addr` by function:

* stack-stx: Bitcoin address for the solo stacker to receive rewards.
* delegate-stx: Optional. If omitted, the pool operator decides where to send this delegator's rewards. If provided, the pool operator must send rewards to that address. Note: if provided, the delegator must have enough STX to meet the minimum stacking amount (each unique `pox-addr` consumes a reward slot).
* delegate-stack-stx and stack-aggregation-commit-indexed: `pox-addr` is where the pool operator will receive BTC rewards for that aggregated stake. Pool operators typically use wrapper contracts or off-chain accounting to distribute BTC to delegators.

***

## Errors

You may encounter several errors when trying to perform stacking operations. Below are some of the more common errors with explanations and how to resolve them.

<details>

<summary>Error 35 - ERR_INVALID_SIGNATURE_PUBKEY</summary>

This is likely the most common error you will encounter, and you'll usually see it in a failed `stack-stx` or `stack-aggregation-commit` transaction.

This error occurs in `consume-signer-key-authorization` which is called any time a signer signature is provided.

Possible causes:

* The public key you used to generate the signer signature is not the same as the one you are passing in to the `signer-key` field.
* One of the fields you passed in to generate your signer signature does not match the field you passed in to either the `stack-stx` or `stack-aggregation-commit` function.

How to fix: verify that the signer signature was generated using the exact same signer public key and parameters (amount, pox-addr/reward-cycle, lock period, max-amount, auth-id, etc.) as what you are passing into the contract call.

</details>

<details>

<summary>Error 4 - ERR_STACKING_NO_SUCH_PRINCIPAL</summary>

This error means the contract lookup for a partially stacked entry failed. The stacking contract looks up partially stacked STX (after `delegate-stack-stx`) by the key `(pox-addr, stx-address, reward-cycle)`. If any of those parameters are wrong when generating the signature or calling `stack-aggregation-commit`, the lookup will fail.

How to fix: check that the `pox-addr`, `stacker` principal (stx address), and `reward-cycle` values match exactly what was used in `delegate-stack-stx` / the signature generation.

</details>

<details>

<summary>Error 24 - ERR_INVALID_START_BURN_HEIGHT</summary>

This means the `start-burn-height` parameter parsed was invalid (it corresponded to a past or future cycle rather than the current next reward cycle). You will mostly see this in `stack-stx` or `delegate-stack-stx` failed transactions.

How to fix: set `start-burn-ht` to the current burn block height corresponding to the next reward cycle (or compute it using node APIs / libraries that map burn height to reward cycles).

</details>
