---
title: Kata kunci
description: Lihat daftar rinci semua kata kunci untuk bahasa Clarity.
tags:
  - clarity
---

![](/img/keywords.jpg)
## Referensi kata kunci

Detailed list of all keywords for the Clarity language.


### contract-caller
#### output: `principal`
#### description:
Returns the caller of the current contract context. If this contract is the first one called by a signed transaction, the caller will be equal to the signing principal. If `contract-call?` was used to invoke a function from a new contract, `contract-caller` changes to the _calling_ contract's principal. If `as-contract` is used to change the `tx-sender` context, `contract-caller` _also_ changes to the same contract principal.
#### example:
```clarity
(print contract-caller) ;; Will print out a Stacks address of the transaction sender
```

### tx-sender
#### output: `principal`
#### description:
Returns the original sender of the current transaction, or if `as-contract` was called to modify the sending context, it returns that contract principal.
#### example:
```clarity
(print tx-sender) ;; Will print out a Stacks address of the transaction sender
```

### block-height
#### output: `uint`
#### description:
Returns the current block height of the Stacks blockchain as an uint
#### example:
```clarity
(> block-height 1000) ;; returns true if the current block-height has passed 1000 blocks.
```

### burn-block-height
#### output: `uint`
#### description:
Returns the current block height of the underlying burn blockchain as a uint
#### example:
```clarity
(> burn-block-height 1000) ;; returns true if the current height of the underlying burn blockchain has passed 1000 blocks.
```

### none
#### output: `(optional ?)`
#### description:
Represents the _none_ option indicating no value for a given optional (analogous to a null value).
#### example:
```clarity
(define-public (only-if-positive (a int))
  (if (> a 0)
      (some a)
      none))
(only-if-positive 4) ;; Returns (some 4)
(only-if-positive (- 3)) ;; Returns none
```

### true
#### output: `bool`
#### description:
Boolean true constant.
#### example:
```clarity
(and true false) ;; Evaluates to false
(or false true)  ;; Evaluates to true
```

### false
#### output: `bool`
#### description:
Boolean false constant.
#### example:
```clarity
(and true false) ;; Evaluates to false
(or false true)  ;; Evaluates to true
```

### stx-liquid-supply
#### output: `uint`
#### description:
Returns the total number of micro-STX (uSTX) that are liquid in the system as of this block.
#### example:
```clarity
(print stx-liquid-supply) ;; Will print out the total number of liquid uSTX
```

### is-in-regtest
#### output: `bool`
#### description:
Returns whether or not the code is running in a regression test
#### example:
```clarity
(print is-in-regtest) ;; Will print 'true' if the code is running in a regression test

```

