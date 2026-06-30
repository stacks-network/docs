---
description: The complete reference guide to all Clarity keywords.
---

# Keywords

### block-height

{% hint style="danger" %}
Deprecated in Clarity 3.
{% endhint %}

Introduced in: Clarity 1

output: `uint`

description:

Returns the current block height of the Stacks blockchain in Clarity 1 and 2.
Upon activation of epoch 3.0, `block-height` will return the same value as `tenure-height`.
In Clarity 3, `block-height` is removed and has been replaced with `stacks-block-height`.

example:

```clarity
(> block-height u1000) ;; returns true if the current block-height has passed 1000 blocks.
```

***

### burn-block-height

Introduced in: Clarity 1

output: `uint`

description:

Returns the current block height of the underlying burn blockchain.

example:

```clarity
(> burn-block-height u832000) ;; returns true if the current height of the underlying burn blockchain has passed 832,000 blocks.
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

Returns the caller of the current contract context. If this contract is the first one called by a signed transaction,
the caller will be equal to the signing principal. If `contract-call?` was used to invoke a function from a new contract, `contract-caller`
changes to the _calling_ contract's principal. If `as-contract` is used to change the `tx-sender` context, `contract-caller` _also_ changes
to the same contract principal.

example:

```clarity
(print contract-caller) ;; Will print out a Stacks address of the transaction sender
```

***

### current-contract

Introduced in: Clarity 4

output: `principal`

description:

Returns the principal of the current contract.

example:

```clarity
(print current-contract) ;; Will print out the Stacks address of the current contract
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

***

### stacks-block-height

Introduced in: Clarity 3

output: `uint`

description:

Returns the current block height of the Stacks blockchain.

example:

```clarity
(<= stacks-block-height u500000) ;; returns true if the current block-height has not passed 500,000 blocks.
```

***

### stacks-block-time

{% hint style="info" %}
This same timestamp can also be retrieved for previous blocks using `(get-stacks-block-info? time height)`, which exists since Clarity 3, but cannot be used for the current block.
{% endhint %}

Introduced in: Clarity 4

output: `uint`

description:

Returns the Unix timestamp (in seconds) of the current Stacks block. Introduced
in Clarity 4. Provides access to the timestamp of the current block, which is
not available with `get-stacks-block-info?`.

example:

```clarity
(>= stacks-block-time u1755820800) ;; returns true if current block timestamp is at or after 2025-07-22.
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

Returns the number of tenures that have passed.
At the start of epoch 3.0, `tenure-height` will return the same value as `block-height`, then it will continue to increase as each tenures passes.

example:

```clarity
(< tenure-height u140000) ;; returns true if the current tenure-height has passed 140,000 blocks.
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

{% hint style="warning" %}
Use caution when leveraging tx-sender, as based on the design, you can unintentionally introduce attack surface area. [Read more](https://www.setzeus.com/community-blog-posts/clarity-carefully-tx-sender).
{% endhint %}

Introduced in: Clarity 1

output: `principal`

description:

Returns the original sender of the current transaction, or if `as-contract` was called to modify the sending context, it returns that
contract principal.

example:

```clarity
(print tx-sender) ;; Will print out a Stacks address of the transaction sender
```

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

***
