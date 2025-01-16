# Solo Stack

This doc assumes you are familiar with stacking at a conceptual level. If not, you may want to read the [Stacking](../../concepts/block-production/stacking.md) concept guide.

The guide below applies to those who want to solo stack, meaning they meet the minimum stacking requirement and need to either run a signer or collaborate with a signer.

{% hint style="info" %}
There is a dapp created by DegenLabs for [solo stacking](https://solo.stacking.tools/) without needing a signer, as DegenLabs operates a signer. This is likely the easiest option for solo stacking. We'll cover this option below.
{% endhint %}

If you prefer to participate in a pool by delegating your STX, you do not need to operate a signer either. If you fall into this category, check out the [Stack with a Pool](stack-with-a-pool.md) guide.

### Solo Stacker Flow

{% hint style="info" %}
Note that in order to solo stack, you need to have the minimum number of STX tokens. This number can be found by visiting the pox endpoint of Hiro's API at [https://api.mainnet.hiro.so/v2/pox](https://api.mainnet.hiro.so/v2/pox) and looking at the `min_threshold_ustx` field. (1 STX = 1,000,000 uSTX)
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

* Amount: Denoted in uSTX (1 STX = 1,000,000 uSTX)
* PoX Address: the BTC wallet address where to receive Stacking rewards
* Start burn height: the current BTC block height
* Lock period: the number of cycles to lock for (between 1 and 12)
* Signer key: the **public** key that your signer is using
* Signer signature: the signature that proves control of this signer key
* Max Amount: This parameter is used to validate the signer signature provided. It represents the maximum number of uSTX that can be stacked in this transaction.
* Auth Id: This parameter is used to validate the signer signature provided. It is a random integer that prevents the re-use of this particular signer signature.

Solo stackers have two choices when it comes to operating as a signer. They can choose to run a signer themselves or work with a signer on their behalf.

#### Option 1: Act as a signer

In the “prepare phase” before the next stacking cycle (last 100 blocks), the exact set of Stackers will be selected based on the amount of STX stacked. Just like in previous versions of PoX, each Stacker will have some number of reward slots based on the amount of STX locked.

**It is critical that solo stackers have their signer running during this period.** The prepare phase is when distributed key generation (DKG) occurs, which is used when validating blocks by signers.

In general, you don’t need to do anything actively during this period, other than monitoring your signer software to ensure it’s running properly.

#### Option 2: Work with a signer

If you do not want to operate a signer on your own, you can work with another signer. To do this, you will need to collaborate with them to get their signer key and signer signature (details in the following sections), which will have to be passed when calling the stacking functions.

Rather than needing to find a signer to collaborate with, you can use the solo stacking dapp created by DegenLabs in order to use their signer to solo stack. They've created a UI that makes this process really simple.

They also have a tool for you to generate a signer signature if you prefer to call the stacking functions yourself.

#### Extending the stacking period

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

* Extend count: the number of cycles to add to your lock period. The resulting lock period cannot be larger than 12. For example, if you're currently locked with 6 cycles remaining, the maximum number you can extend is 6.
* Pox Address: the BTC address to receive rewards
* Signer public key: the public key used for signing. This can stay the same, or you can use a new key.
* Signer signature: a signature proving control of your signing key
* Max Amount: This parameter is used to validate the signer signature provided. It represents the maximum number of uSTX (1 stx = 1,000,000 uSTX) that can be stacked in this transaction.
* Auth Id: This parameter is used to validate the signer signature provided. It is a random integer that prevents the re-use of this particular signer signature.

#### Increasing the stacking amount

The stacking amount can also be increased while actively Stacking. The increased position will take effect starting with the next Stacking cycle. The function called is `stack-increase`.

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
* Max Amount: This parameter is used to validate the signer signature provided. It represents the maximum number of uSTX (1 stx = 1,000,000 uSTX) that can be stacked in this transaction.
* Auth Id: This parameter is used to validate the signer signature provided. It is a random integer that prevents the re-use of this particular signer signature.

### Step by Step Stacking Guide

Now that you are familiar with the overall stacking flow and the different roles played, let's dive into the step-by-step guide for actually conducting the stacking process.

{% hint style="info" %}
There are several ways you can go about stacking. This guide will cover using Lockstacks, which is a stacking web application and the simplest option.

Additionally, you can choose to call the stacking functions directly from the [deployed contract](https://explorer.hiro.so/txid/SP000000000000000000002Q6VF78.pox-4?chain=mainnet) in the explorer.

The fields and process will be the same, but the UI will differ.

Finally, you can stack using JS and the [@stacks/stacking](https://github.com/hirosystems/stacks.js/tree/main/packages/stacking) package if you prefer. Again, the functions and parameters will be the same, you will just be writing your JS code directly instead of using a UI.

If you are interested in using this method, you'll want to follow the [stacking guide](https://docs.hiro.so/stacks.js/guides/how-to-integrate-stacking) created by Hiro, and be sure to integrate the new parameters described in [Hiro's Nakamoto update doc](https://docs.hiro.so/nakamoto/stacks-js).
{% endhint %}

### Step 1: Run or work with a signer

This is a necessary prerequisite to stacking as a solo stacker or pool operator.

Running a signer involves setting up a hosted production environment that includes both a Stacks Node and the Stacks Signer. For more information, refer to the [running a signer doc](../running-a-signer/).

Once the signer software is running, you'll have to keep track of the `stacks_private_key` that you used when configuring your signer software. This will be used in subsequent Stacking transactions.

{% hint style="info" %}
In the note above about pool operator vs signer keys, this corresponds to your signer key, not your pool operator wallet
{% endhint %}

Alternatively, you can work with a signer and have them perform step 2 below on your behalf.

### Step 2: Generate a signer key signature

#### Overview of signer keys and signatures

The main difference with Stacking in Nakamoto is that the Signer (either solo Stacker or signer running a pool) needs to include new parameters in their Stacking transactions. These are Clarity transactions that Stackers will call when interacting with the `pox-4.clar` contract. Interacting with this contract is how you as a Stacker actually stack your STX tokens.

{% hint style="info" %}
The current pox-4 contract address can be found by visiting the following endpoint of the Hiro API: [https://api.mainnet.hiro.so/v2/pox](https://api.mainnet.hiro.so/v2/pox).

You can then visit the [Explorer](https://explorer.hiro.so/?chain=mainnet) to view the contract and pass in the contract id.

You may want to review this contract to familiarize yourself with it.
{% endhint %}

Here is an overview of the fields you will need to pass. We'll cover how to get and pass these fields as we dive further into this doc:
1. `signer-key`: the public key that corresponds to the `stacks_private_key` your signer is using
2. `signer-signature`: a signature that demonstrates that you actually controls your `signer-key`. Because signer keys need to be unique, this is also a safety check to ensure that other Stackers can’t use someone else’s public key
3. `max-amount`: The maximum amount of ustx (1 STX = 1,000,000 uSTX) that can be locked in the transaction that uses this signature. For example, if calling `stack-increase`, then this parameter dictates the maximum amount of uSTX that can be used to add more locked STX
4. `auth-id`: a random integer that prevents the re-use of a particular signature, similar to how nonces are used with transactions. Must be less than 14 characters

Signer signatures are signatures created using a particular signer key. They demonstrate that the controller of that signer key is allowing a Stacker to use their signing key. The signer signature’s message hash is created using the following data:

* `method`: a string that indicates the Stacking method that is allowed to utilize this signature. The valid options are `stack-increase`, `stack-stx`, `stack-extend`, `agg-commit` (for stack-aggregation-commit-indexed), or `agg-increase` (for stack-aggregation-increase)
* `max-amount`: described above
* `auth-id`: described above
* `period`: a value between 1 and 12, which indicates the number of cycles that the Stacker is allowed to lock their STX for in this particular Stacking transaction. For `agg-commit`, this must be equal to 1
* `reward-cycle`: This represents the reward cycle in which the Stacking transaction can be confirmed. For solo stacking operations (`stack-stx`, `stack-extend` and `stack-increase`), this has to be set as the current cycle.
* `pox-address`: The Bitcoin address that is allowed to be used for receiving rewards. This can be set to any Bitcoin address that you have access to.

Now that we have an overview of role and contents of signatures, let's see how to actually generate them. You have several options available.

**Generating your signature with Degen Labs stacks.tools**

Degen Labs has a signature generation tool that will generate a signature using their signer. This is the quickest and simplest option. To generate a signature using this method, all you need to do is visit their [signature tool](https://signature.stacking.tools/) and pass in the relevant information as covered on this page.

#### Generating your signature with stacks.js

The [@stacks/stacking](https://www.npmjs.com/package/@stacks/stacking) NPM package provides interfaces to generate and use signer signatures.

There is a function called `signPoxSignature` that will allow you to generate this signature and pass it in to the stacking function.

More information and code samples can be found on [Hiro's Nakamoto docs](https://docs.hiro.so/nakamoto/stacks-js).

#### Generating your signature using the stacks-signer CLI

If you already have your signer configured and set up, you can use the `stacks-signer` CLI to generate this signature. You can either SSH into your running signer or use the `stacks-signer` CLI locally. If using the CLI locally, you will need to ensure you have a matching configuration file located on your filesystem. Having a matching configuration file is important to ensure that the signer public key you make in Stacking transactions is the same as in your hosted signer.

The CLI command is:

```bash
# Max Amount equivallent to 1M STX
# Auth Id should be a random string less than 14 characters
stacks-signer generate-stacking-signature \
  --method stack-stx \
  --max-amount 1000000000000 \
  --auth-id 71948271489 \
  --period 1 \
  --reward-cycle 100 \
  --pox-address bc1... \
  --config ./config.toml \
  --json
```

These arguments match those described in section [Overview of signer keys and signatures](stacking-flow.md#overview-of-signer-keys-and-signatures), with the addition of:

* `--config`, to provide the configuration file path
* `--json`, to optionally output the resulting signature in JSON

You can use the following command to generate a random `32` bit integer as `auth-id`:

```bash
python3 -c 'import secrets; print(secrets.randbits(32))'
```

Once the `generate-stacking-signature` command is run, the CLI will output a JSON:

```json
{"authId":"1234","maxAmount":"12345","method":"stack-stx","period":1,"poxAddress":"bc1...","rewardCycle":100,"signerKey":"aaaaaaaa","signerSignature":"bbbbbbbbbbb"}
```

You will use the JSON when calling Stacking transactions from your Stacker address as outlined above. Remember that this may be different than your signer address.

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
  * For stack-aggregation-commit-indexed, this field must equal the cycle used in that function’s “reward cycle” argument. Typically, that equates to current\_cycle + 1.
* Bitcoin address: the PoX reward address that can be used
* Topic: the stacking function that will use this signature
* Max amount: max amount of STX that can be used. Defaults to “max possible amount”
* Auth ID: defaults to random int
* Duration: must match the number of cycles used in the stacking transaction. **For stack-aggregation-commit, use “1”**.

{% hint style="warning" %}
Each of these fields must be exactly matched in order for the Stacking transaction to work. Future updates to Lockstacks will verify the signature before the transaction is made.
{% endhint %}

Click the “generate signature” button to popup a Leather page where you can generate the signature. Once you submit that popup, Lockstacks will have the signer key and signature you generated.

After you sign that message, you'll see the information you can use in your Stacking transactions, including the signer public key and signature.

You can click the “copy” icon next to “signer details to share with stackers”. This will copy a JSON string, which can be directly pasted into the Lockstacks page where you make your Stacking transaction. Alternatively, this information can be entered manually.

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

Now that you have your signer signature generated, it's time to start stacking. This process will vary depending on your chosen method. We've included instructions for solo stacking using [Leather Earn](https://earn.leather.io/sign-in?chain=mainnet) below.

### Step 3: Stack your STX

#### stack-stx

To start, you'll visit [Lockstacks](https://lockstacks.com) and click the “Stack independently” button on the home page.

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
  * Auth ID
  * Max amount

#### stack-increase

If you want to increase the amount of STX locked, you can use the stack-increase page on Lockstacks.

If you’re already stacking, the home page will provide a link to “view stacking details”. From there, you can choose to increase.

On this page are the following fields:

* The amount of STX you want to increase by
* New fields:
  * Signer public key
  * Signer key signature
  * Auth ID
  * Max amount
