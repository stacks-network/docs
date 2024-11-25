# Clarity Keywords

### block-height​ <a href="#block-height" id="block-height"></a>

{% hint style="info" %}
The Nakamoto hard fork will introduce a few new Clarity keywords. It's important to note that even with the new [block production mechanism](../concepts/block-production/), the `block-height` keyword behavior will not change. It will simply correspond to the current tenure height. This means any Clarity contracts using this keyword will be backwards compatible after the Nakamoto Upgrade.
{% endhint %}

Introduced in: Clarity 1

**output: `uint`**

**description:**

Returns the current block height of the Stacks blockchain as an uint

**example:**

```
(> block-height 1000) ;; returns true if the current block-height has passed 1000 blocks.
```

### burn-block-height​ <a href="#burn-block-height" id="burn-block-height"></a>

{% hint style="warning" %}
There is a bug in Clarity 3 when `burn-block-height` is used within an `at-block` expression. Normally, keywords executed within an `at-block` expression will return the data for that specified block. This bug causes `burn-block-height` to always return the burn block at the current chain tip, even within an `at-block` expression. This behavior affects any Clarity 3 contracts and will be fixed in a future hard fork.
{% endhint %}

Introduced in: Clarity 1

**output: `uint`**

**description:**

Returns the current block height of the underlying burn blockchain as a uint

**example:**

```
(> burn-block-height 1000) ;; returns true if the current height of the underlying burn blockchain has passed 1000 blocks.
```

### chain-id​ <a href="#chain-id-clarity2" id="chain-id-clarity2"></a>

Introduced in: Clarity 2

**output: `uint`**

**description:**

Returns the 32-bit chain ID of the blockchain running this transaction

**example:**

```
(print chain-id) ;; Will print 'u1' if the code is running on mainnet, and 'u2147483648' on testnet, and other values on different chains.
```

### contract-caller​ <a href="#contract-caller" id="contract-caller"></a>

Introduced in: Clarity 1

**output: `principal`**

**description:**

Returns the caller of the current contract context. If this contract is the first one called by a signed transaction, the caller will be equal to the signing principal. If `contract-call?` was used to invoke a function from a new contract, `contract-caller` changes to the _calling_ contract's principal. If `as-contract` is used to change the `tx-sender` context, `contract-caller` _also_ changes to the same contract principal.

**example:**

```
(print contract-caller) ;; Will print out a Stacks address of the transaction sender
```

{% hint style="warning" %}
Use caution when leveraging all contract calls, particularly tx-sender and contract-caller as based on the design, you can unintentionally introduce attack surface area. [Read more](https://www.setzeus.com/community-blog-posts/clarity-carefully-tx-sender).
{% endhint %}

### false​ <a href="#false" id="false"></a>

Introduced in: Clarity 1

**output: `bool`**

**description:**

Boolean false constant.

**example:**

```
(and true false) ;; Evaluates to false
(or false true)  ;; Evaluates to true
```

### is-in-mainnet​ <a href="#is-in-mainnet-clarity2" id="is-in-mainnet-clarity2"></a>

Introduced in: Clarity 2

**output: `bool`**

**description:**

Returns a boolean indicating whether or not the code is running on the mainnet

**example:**

```
(print is-in-mainnet) ;; Will print 'true' if the code is running on the mainnet
```

### is-in-regtest​ <a href="#is-in-regtest" id="is-in-regtest"></a>

Introduced in: Clarity 1

**output: `bool`**

**description:**

Returns whether or not the code is running in a regression test

**example:**

```
(print is-in-regtest) ;; Will print 'true' if the code is running in a regression test
```

### none​ <a href="#none" id="none"></a>

Introduced in: Clarity 1

**output: `(optional ?)`**

**description:**

Represents the _none_ option indicating no value for a given optional (analogous to a null value).

**example:**

```
(define-public (only-if-positive (a int))
  (if (> a 0)
      (some a)
      none))
(only-if-positive 4) ;; Returns (some 4)
(only-if-positive (- 3)) ;; Returns none
```

```
(print stx-liquid-supply) ;; Will print out the total number of liqui
```

### **stacks-block-height**

{% hint style="warning" %}
Will be available after the Nakamoto hard fork
{% endhint %}

Introduced in: Clarity 3

**output: `uint`**

**description:**

Returns the current Stacks block height.

**example:**

```
(print stacks-block-height) ;; Will print out the current Stacks block height
```

### stx-liquid-supply​ <a href="#stx-liquid-supply" id="stx-liquid-supply"></a>

Introduced in: Clarity 1

**output: `uint`**

**description:**

Returns the total number of micro-STX (uSTX) that are liquid in the system as of this block.

**example:**

```
(print stx-liquid-supply) ;; Will print out the total number of liquid uSTX
```

### **tenure-height**

{% hint style="warning" %}
Will be available after Nakamoto hard fork
{% endhint %}

Introduced in: Clarity 3

**output: `uint`**

**description:**

Returns the number of tenures that have passed. When the Nakamoto block-processing starts, this will be equal to the chain length.

**example:**

```
(print tenure-height) ;; Will print out the current tenure height
```

### true​ <a href="#true" id="true"></a>

Introduced in: Clarity 1

**output: `bool`**

**description:**

Boolean true constant.

**example:**

```
(and true false) ;; Evaluates to false
(or false true)  ;; Evaluates to true
```

### tx-sender​ <a href="#tx-sender" id="tx-sender"></a>

Introduced in: Clarity 1

**output: `principal`**

**description:**

Returns the original sender of the current transaction, or if `as-contract` was called to modify the sending context, it returns that contract principal.

**example:**

```
(print tx-sender) ;; Will print out a Stacks address of the transaction sender
```

{% hint style="warning" %}
Use caution when leveraging all contract calls, particularly tx-sender and contract-caller as based on the design, you can unintentionally introduce attack surface area. [Read more](https://www.setzeus.com/community-blog-posts/clarity-carefully-tx-sender).
{% endhint %}



### tx-sponsor?​ <a href="#tx-sponsor-clarity2" id="tx-sponsor-clarity2"></a>

Introduced in: Clarity 2

**output: `optional principal`**

**description:**

Returns the sponsor of the current transaction if there is a sponsor, otherwise returns None.

**example:**

```
(print tx-sponsor?) ;; Will print out an optional value containing the Stacks address of the transaction sponsor
```
