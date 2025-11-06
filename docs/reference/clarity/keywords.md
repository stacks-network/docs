---
description: The complete reference guide to all Clarity keywords.
---

# Keywords

{% hint style="info" %}
The Nakamoto hard fork will introduce a few new Clarity keywords. It's important to note that even with the new block production mechanism, the `block-height` keyword behavior will not change. It will simply correspond to the current tenure height. This means any Clarity contracts using this keyword will be backwards compatible after the Nakamoto Upgrade.
{% endhint %}

### block-height

Introduced in: Clarity 1

output: `uint`

description:

Returns the current block height of the Stacks blockchain in Clarity 1 and 2. Upon activation of epoch 3.0, `block-height` will return the same value as `tenure-height`. In Clarity 3, `block-height` is removed and has been replaced with `stacks-block-height`.

example:

```clarity
(> block-height u1000) ;; returns true if the current block-height has passed 1000 blocks.
```

***

### burn-block-height

{% hint style="warning" %}
There is a bug in Clarity 3 when `burn-block-height` is used within an `at-block` expression. Normally, keywords executed within an `at-block` expression will return the data for that specified block. This bug causes `burn-block-height` always to return the burn block at the current chain tip, even within an `at-block` expression. This behavior affects any Clarity 3 contracts and will be fixed in a future hard fork.
{% endhint %}

Introduced in: Clarity 1

output: `uint`

description:

Returns the current block height of the underlying burn blockchain as a uint

example:

```clarity
(> burn-block-height 1000) ;; returns true if the current height of the underlying burn blockchain has passed 1000 blocks.
```

***

### chain-id

Introduced in: Clarity 2

output: `uint`

description:

Returns the 32-bit chain ID of the blockchain running this transaction

example:

```clarity
(print chain-id) ;; Will print 'u1' if the code is running on mainnet, and 'u2147483648' on testnet, and other values on different chains.
```

***

### contract-caller

Introduced in: Clarity 1

output: `principal`

description:

Returns the caller of the current contract context. If this contract is the first one called by a signed transaction, the caller will be equal to the signing principal. If `contract-call?` was used to invoke a function from a new contract, `contract-caller` changes to the _calling_ contract's principal. If `as-contract` is used to change the `tx-sender` context, `contract-caller` _also_ changes to the same contract principal.

example:

```clarity
(print contract-caller) ;; Will print out a Stacks address of the transaction sender
```

{% hint style="warning" %}
Use caution when leveraging all contract calls, particularly tx-sender and contract-caller as based on the design, you can unintentionally introduce attack surface area. [Read more](https://www.setzeus.com/community-blog-posts/clarity-carefully-tx-sender).
{% endhint %}

***

### current-contract

Introduced in: Clarity 4

output: `principal`

description: Returns the principal of the current contract.

example:

```
(stx-transfer? u1000000 tx-sender current-contract)
```

***

### false

Introduced in: Clarity 1

output: `bool`

description:

Boolean false constant.

example:

```clarity
(and true false) ;; Evaluates to false
(or false true)  ;; Evaluates to true
```

***

### is-in-mainnet

Introduced in: Clarity 2

output: `bool`

description:

Returns a boolean indicating whether or not the code is running on the mainnet

example:

```clarity
(print is-in-mainnet) ;; Will print 'true' if the code is running on the mainnet
```

***

### is-in-regtest

Introduced in: Clarity 1

output: `bool`

description:

Returns whether or not the code is running in a regression test

example:

```clarity
(print is-in-regtest) ;; Will print 'true' if the code is running in a regression test
```

***

### none

Introduced in: Clarity 1

output: `(optional ?)`

description:

Represents the _none_ option indicating no value for a given optional (analogous to a null value).

example:

```clarity
(define-public (only-if-positive (a int))
  (if (> a 0)
      (some a)
      none))
(only-if-positive 4) ;; Returns (some 4)
(only-if-positive (- 3)) ;; Returns none
```

```clarity
(print stx-liquid-supply) ;; Will print out the total number of liqui
```

***

### stacks-block-height

Introduced in: Clarity 3

output: `uint`

description:

Returns the current Stacks block height.

example:

```clarity
(print stacks-block-height) ;; Will print out the current Stacks block height
```

***

### stacks-block-time

Introduced in: Clarity 4

output: `uint`

description: Returns the timestamp of the current block in seconds since the Unix epoch

{% hint style="info" %}
This same timestamp can also be retrieved for previous blocks using `(get-stacks-block-info? time height)`, which exists since Clarity 3, but cannot be used for the current block.

Note that `stacks-block-time` will properly account for the context of an `at-block` expression. If the `at-block` sets the context to a block that is from before Clarity 4 has activated, attempting to use `stacks-block-time` in that context will result in a runtime error.
{% endhint %}

```
(if (> stacks-block-time 1755820800)
  (print "after 2025-07-22")
  (print "before 2025-07-22"))
```

***

### stx-liquid-supply

Introduced in: Clarity 1

output: `uint`

description:

Returns the total number of micro-STX (uSTX) that are liquid in the system as of this block.

example:

```clarity
(print stx-liquid-supply) ;; Will print out the total number of liquid uSTX
```

***

### tenure-height

Introduced in: Clarity 3

output: `uint`

description:

Returns the number of tenures that have passed. When the Nakamoto block-processing starts, this will be equal to the chain length.

example:

```clarity
(print tenure-height) ;; Will print out the current tenure height
```

***

### true

Introduced in: Clarity 1

output: `bool`

description:

Boolean true constant.

example:

```clarity
(and true false) ;; Evaluates to false
(or false true)  ;; Evaluates to true
```

***

### tx-sender

Introduced in: Clarity 1

output: `principal`

description:

Returns the original sender of the current transaction, or if `as-contract` was called to modify the sending context, it returns that contract principal.

example:

```clarity
(print tx-sender) ;; Will print out a Stacks address of the transaction sender
```

{% hint style="warning" %}
Use caution when leveraging all contract calls, particularly tx-sender and contract-caller as based on the design, you can unintentionally introduce attack surface area. [Read more](https://www.setzeus.com/community-blog-posts/clarity-carefully-tx-sender).
{% endhint %}

***

### tx-sponsor?

Introduced in: Clarity 2

output: `optional principal`

description:

Returns the sponsor of the current transaction if there is a sponsor, otherwise returns None.

example:

```clarity
(print tx-sponsor?) ;; Will print out an optional value containing the Stacks address of the transaction sponsor
```
