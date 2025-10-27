---
description: The complete reference guide to all Clarity functions.
---

# Functions

## \* (multiply)

Introduced in: **Clarity 1**

**input:** `int, ... | uint, ...`\
**output:** `int | uint`\
**signature:** `(* i1 i2...)`

**description:**\
Multiplies a variable number of integer inputs and returns the result. In the event of an _overflow_, throws a runtime error.

**example:**

```clojure
(* 2 3) ;; Returns 6
(* 5 2) ;; Returns 10
(* 2 2 2) ;; Returns 8
```

***

## + (add)

Introduced in: **Clarity 1**

**input:** `int, ... | uint, ...`\
**output:** `int | uint`\
**signature:** `(+ i1 i2...)`

**description:**\
Adds a variable number of integer inputs and returns the result. In the event of an _overflow_, throws a runtime error.

**example:**

```clojure
(+ 1 2 3) ;; Returns 6
```

***

## - (subtract)

Introduced in: **Clarity 1**

**input:** `int, ... | uint, ...`\
**output:** `int | uint`\
**signature:** `(- i1 i2...)`

**description:**\
Subtracts a variable number of integer inputs and returns the result. In the event of an _underflow_, throws a runtime error.

**example:**

```clojure
(- 2 1 1) ;; Returns 0
(- 0 3) ;; Returns -3
```

***

## / (divide)

Introduced in: **Clarity 1**

**input:** `int, ... | uint, ...`\
**output:** `int | uint`\
**signature:** `(/ i1 i2...)`

**description:**\
Integer divides a variable number of integer inputs and returns the result. In the event of division by zero, throws a runtime error.

**example:**

```clojure
(/ 2 3) ;; Returns 0
(/ 5 2) ;; Returns 2
(/ 4 2 2) ;; Returns 1
```

***

## < (less than)

Introduced in: **Clarity 1**

**input:** `int, int | uint, uint | string-ascii, string-ascii | string-utf8, string-utf8 | buff, buff`\
**output:** `bool`\
**signature:** `(< i1 i2)`

**description:**\
Compares two integers (or other comparable types), returning `true` if `i1` is less than `i2` and `false` otherwise. i1 and i2 must be of the same type.

* Starting with Stacks 1.0: comparable types are `int` and `uint`.
* Starting with Stacks 2.1: comparable types also include `string-ascii`, `string-utf8` and `buff`.

**example:**

```clojure
(< 1 2) ;; Returns true
(< 5 2) ;; Returns false
(< "aaa" "baa") ;; Returns true
(< "aa" "aaa") ;; Returns true
(< 0x01 0x02) ;; Returns true
(< 5 u2) ;; Throws type error
```

***

## <= (less than or equal)

Introduced in: **Clarity 1**

**input:** `int, int | uint, uint | string-ascii, string-ascii | string-utf8, string-utf8 | buff, buff`\
**output:** `bool`\
**signature:** `(<= i1 i2)`

**description:**\
Compares two values, returning `true` if `i1` is less than or equal to `i2`. Types must match. Same type support notes as `<`.

**example:**

```clojure
(<= 1 1) ;; Returns true
(<= 5 2) ;; Returns false
(<= "aaa" "baa") ;; Returns true
(<= "aa" "aaa") ;; Returns true
(<= 0x01 0x02) ;; Returns true
(<= 5 u2) ;; Throws type error
```

***

## > (greater than)

Introduced in: **Clarity 1**

**input:** `int, int | uint, uint | string-ascii, string-ascii | string-utf8, string-utf8 | buff, buff`\
**output:** `bool`\
**signature:** `(> i1 i2)`

**description:**\
Compares two values, returning `true` if `i1` is greater than `i2`. Types must match. Same type support notes as `<`.

**example:**

```clojure
(> 1 2) ;; Returns false
(> 5 2) ;; Returns true
(> "baa" "aaa") ;; Returns true
(> "aaa" "aa") ;; Returns true
(> 0x02 0x01) ;; Returns true
(> 5 u2) ;; Throws type error
```

***

## >= (greater than or equal)

Introduced in: **Clarity 1**

**input:** `int, int | uint, uint | string-ascii, string-ascii | string-utf8, string-utf8 | buff, buff`\
**output:** `bool`\
**signature:** `(>= i1 i2)`

**description:**\
Compares two values, returning `true` if `i1` is greater than or equal to `i2`. Types must match. Same type support notes as `<`.

**example:**

```clojure
(>= 1 1) ;; Returns true
(>= 5 2) ;; Returns true
(>= "baa" "aaa") ;; Returns true
(>= "aaa" "aa") ;; Returns true
(>= 0x02 0x01) ;; Returns true
(>= 5 u2) ;; Throws type error
```

***

## and

Introduced in: **Clarity 1**

**input:** `bool, ...`\
**output:** `bool`\
**signature:** `(and b1 b2 ...)`

**description:**\
Returns `true` if all boolean inputs are `true`. Arguments are evaluated in-order and lazily (short-circuits on `false`).

**example:**

```clojure
(and true false) ;; Returns false
(and (is-eq (+ 1 2) 1) (is-eq 4 4)) ;; Returns false
(and (is-eq (+ 1 2) 3) (is-eq 4 4)) ;; Returns true
```

***

## append

Introduced in: **Clarity 1**

**input:** `list A, A`\
**output:** `list`\
**signature:** `(append (list 1 2 3 4) 5)`

**description:**\
Takes a list and a value of the same entry type, and returns a new list with max\_len += 1 (effectively appending the value).

**example:**

```clojure
(append (list 1 2 3 4) 5) ;; Returns (1 2 3 4 5)
```

***

## as-contract

Introduced in: **Clarity 1**

**input:** `A`\
**output:** `A`\
**signature:** `(as-contract expr)`

**description:**\
Executes `expr` with the tx-sender switched to the contract's principal and returns the result.

**example:**

```clojure
(as-contract tx-sender) ;; Returns S1G2081040G2081040G2081040G208105NK8PE5.docs-test
```

***

## as-max-len?

Introduced in: **Clarity 1**

**input:** `sequence_A, uint`\
**output:** `(optional sequence_A)`\
**signature:** `(as-max-len? sequence max_length)`

**description:**\
If the sequence length ≤ max\_length, returns `(some sequence)`, otherwise `none`. Applies to `(list A)`, `buff`, `string-ascii`, `string-utf8`.

**example:**

```clojure
(as-max-len? (list 2 2 2) u3) ;; Returns (some (2 2 2))
(as-max-len? (list 1 2 3) u2) ;; Returns none
(as-max-len? "hello" u10) ;; Returns (some "hello")
(as-max-len? 0x010203 u10) ;; Returns (some 0x010203)
```

***

## asserts!

Introduced in: **Clarity 1**

**input:** `bool, C`\
**output:** `bool`\
**signature:** `(asserts! bool-expr thrown-value)`

**description:**\
If `bool-expr` is `true`, returns `true` and continues. If `false`, returns `thrown-value` and exits current control-flow.

**example:**

```clojure
(asserts! (is-eq 1 1) (err 1)) ;; Returns true
```

***

## at-block

Introduced in: **Clarity 1**

**input:** `(buff 32), A`\
**output:** `A`\
**signature:** `(at-block id-block-hash expr)`

**description:**\
Evaluates `expr` as if evaluated at the end of the block identified by `id-block-hash`. `expr` must be read-only. The block hash must be from `id-header-hash`.

**example:**

```clojure
(define-data-var data int 1)
(at-block 0x0000000000000000000000000000000000000000000000000000000000000000 block-height) ;; Returns u0
(at-block (get-block-info? id-header-hash 0) (var-get data)) ;; Throws NoSuchDataVariable because `data` wasn't initialized at block height 0
```

***

## begin

Introduced in: **Clarity 1**

**input:** `AnyType, ... A`\
**output:** `A`\
**signature:** `(begin expr1 expr2 expr3 ... expr-last)`

**description:**\
Evaluates each expression in order and returns the value of the last expression. Note: intermediary statements returning a response type must be checked.

**example:**

```clojure
(begin (+ 1 2) 4 5) ;; Returns 5
```

***

## bit-and

Introduced in: **Clarity 2**

**input:** `int, ... | uint, ...`\
**output:** `int | uint`\
**signature:** `(bit-and i1 i2...)`

**description:**\
Bitwise AND across a variable number of integer inputs.

**example:**

```clojure
(bit-and 24 16) ;; Returns 16
(bit-and 28 24 -1) ;; Returns 24
(bit-and u24 u16) ;; Returns u16
(bit-and -128 -64) ;; Returns -128
```

***

## bit-not

Introduced in: **Clarity 2**

**input:** `int | uint`\
**output:** `int | uint`\
**signature:** `(bit-not i1)`

**description:**\
Returns the one's complement (bitwise NOT) of `i1`.

**example:**

```clojure
(bit-not 3) ;; Returns -4
(bit-not u128) ;; Returns u340282366920938463463374607431768211327
(bit-not 128) ;; Returns -129
(bit-not -128) ;; Returns 127
```

***

## bit-or

Introduced in: **Clarity 2**

**input:** `int, ... | uint, ...`\
**output:** `int | uint`\
**signature:** `(bit-or i1 i2...)`

**description:**\
Bitwise inclusive OR across a variable number of integer inputs.

**example:**

```clojure
(bit-or 4 8) ;; Returns 12
(bit-or 1 2 4) ;; Returns 7
(bit-or 64 -32 -16) ;; Returns -16
(bit-or u2 u4 u32) ;; Returns u38
```

***

## bit-shift-left

Introduced in: **Clarity 2**

**input:** `int, uint | uint, uint`\
**output:** `int | uint`\
**signature:** `(bit-shift-left i1 shamt)`

**description:**\
Shifts bits of `i1` left by `shamt` modulo 128. Does not check for arithmetic overflow — use `*`, `/`, `pow` if overflow detection is needed.

**example:**

```clojure
(bit-shift-left 2 u1) ;; Returns 4
(bit-shift-left 16 u2) ;; Returns 64
(bit-shift-left -64 u1) ;; Returns -128
(bit-shift-left u4 u2) ;; Returns u16
(bit-shift-left 123 u9999999999) ;; Returns -170141183460469231731687303715884105728
(bit-shift-left -1 u7) ;; Returns -128
(bit-shift-left -1 u128) ;; Returns -1
```

***

## bit-shift-right

Introduced in: **Clarity 2**

**input:** `int, uint | uint, uint`\
**output:** `int | uint`\
**signature:** `(bit-shift-right i1 shamt)`

**description:**\
Shifts bits of `i1` right by `shamt` modulo 128. For `uint` fills with zeros; for `int` preserves sign bit. Does not check for arithmetic overflow.

**example:**

```clojure
(bit-shift-right 2 u1) ;; Returns 1
(bit-shift-right 128 u2) ;; Returns 32
(bit-shift-right -64 u1) ;; Returns -32
(bit-shift-right u128 u2) ;; Returns u32
(bit-shift-right 123 u9999999999) ;; Returns 0
(bit-shift-right -128 u7) ;; Returns -1
```

***

## bit-xor

Introduced in: **Clarity 2**

**input:** `int, ... | uint, ...`\
**output:** `int | uint`\
**signature:** `(bit-xor i1 i2...)`

**description:**\
Bitwise exclusive OR across a variable number of integer inputs.

**example:**

```clojure
(bit-xor 1 2) ;; Returns 3
(bit-xor 120 280) ;; Returns 352
(bit-xor -128 64) ;; Returns -64
(bit-xor u24 u4) ;; Returns u28
(bit-xor 1 2 4 -1) ;; Returns -8
```

***

## buff-to-int-be

Introduced in: **Clarity 2**

**input:** `(buff 16)`\
**output:** `int`\
**signature:** `(buff-to-int-be (buff 16))`

**description:**\
Converts a buffer to a signed integer using big-endian encoding. Buffer up to 16 bytes; if fewer, it behaves as if left-zero-padded. Available starting Stacks 2.1.

**example:**

```clojure
(buff-to-int-be 0x01) ;; Returns 1
(buff-to-int-be 0x00000000000000000000000000000001) ;; Returns 1
(buff-to-int-be 0xffffffffffffffffffffffffffffffff) ;; Returns -1
(buff-to-int-be 0x) ;; Returns 0
```

***

## buff-to-int-le

Introduced in: **Clarity 2**

**input:** `(buff 16)`\
**output:** `int`\
**signature:** `(buff-to-int-le (buff 16))`

**description:**\
Converts a buffer to a signed integer using little-endian encoding. Up to 16 bytes; fewer bytes behave as right-zero-padded. Available starting Stacks 2.1.

**example:**

```clojure
(buff-to-int-le 0x01) ;; Returns 1
(buff-to-int-le 0x01000000000000000000000000000000) ;; Returns 1
(buff-to-int-le 0xffffffffffffffffffffffffffffffff) ;; Returns -1
(buff-to-int-le 0x) ;; Returns 0
```

***

## buff-to-uint-be

Introduced in: **Clarity 2**

**input:** `(buff 16)`\
**output:** `uint`\
**signature:** `(buff-to-uint-be (buff 16))`

**description:**\
Converts a buffer to an unsigned integer using big-endian encoding. Up to 16 bytes; fewer bytes behave as left-zero-padded. Available starting Stacks 2.1.

**example:**

```clojure
(buff-to-uint-be 0x01) ;; Returns u1
(buff-to-uint-be 0x00000000000000000000000000000001) ;; Returns u1
(buff-to-uint-be 0xffffffffffffffffffffffffffffffff) ;; Returns u340282366920938463463374607431768211455
(buff-to-uint-be 0x) ;; Returns u0
```

***

## buff-to-uint-le

Introduced in: **Clarity 2**

**input:** `(buff 16)`\
**output:** `uint`\
**signature:** `(buff-to-uint-le (buff 16))`

**description:**\
Converts a buffer to an unsigned integer using little-endian encoding. Up to 16 bytes; fewer bytes behave as right-zero-padded. Available starting Stacks 2.1.

**example:**

```clojure
(buff-to-uint-le 0x01) ;; Returns u1
(buff-to-uint-le 0x01000000000000000000000000000000) ;; Returns u1
(buff-to-uint-le 0xffffffffffffffffffffffffffffffff) ;; Returns u340282366920938463463374607431768211455
(buff-to-uint-le 0x) ;; Returns u0
```

***

## concat

Introduced in: **Clarity 1**

**input:** `sequence_A, sequence_A`\
**output:** `sequence_A`\
**signature:** `(concat sequence1 sequence2)`

**description:**\
Concatenates two sequences of the same type. Applicable to `(list A)`, `buff`, `string-ascii`, `string-utf8`.

**example:**

```clojure
(concat (list 1 2) (list 3 4)) ;; Returns (1 2 3 4)
(concat "hello " "world") ;; Returns "hello world"
(concat 0x0102 0x0304) ;; Returns 0x01020304
```

***

## contract-call?

Introduced in: **Clarity 1**

**input:** `ContractName, PublicFunctionName, Arg0, ...`\
**output:** `(response A B)`\
**signature:** `(contract-call? .contract-name function-name arg0 arg1 ...)`

**description:**\
Executes a public function on another contract (not the current contract). If that function returns `err`, any DB changes resulting from the call are aborted; if `ok`, DB changes occurred.

**example:**

```clojure
;; instantiate the sample-contracts/tokens.clar contract first
(as-contract (contract-call? .tokens mint! u19)) ;; Returns (ok u19)
```

***

## contract-of

Introduced in: **Clarity 1**

**input:** `Trait`\
**output:** `principal`\
**signature:** `(contract-of .contract-name)`

**description:**\
Returns the principal of the contract implementing the trait.

**example:**

```clojure
(use-trait token-a-trait 'SPAXYA5XS51713FDTQ8H94EJ4V579CXMTRNBZKSF.token-a.token-trait)
(define-public (forward-get-balance (user principal) (contract <token-a-trait>))
  (begin
    (ok (contract-of contract)))) ;; returns the principal of the contract implementing <token-a-trait>
```

***

## default-to

Introduced in: **Clarity 1**

**input:** `A, (optional A)`\
**output:** `A`\
**signature:** `(default-to default-value option-value)`

**description:**\
If the second argument is `(some v)`, returns `v`. If it is `none`, returns `default-value`.

**example:**

```clojure
(define-map names-map { name: (string-ascii 12) } { id: int })
(map-set names-map { name: "blockstack" } { id: 1337 })
(default-to 0 (get id (map-get? names-map (tuple (name "blockstack"))))) ;; Returns 1337
(default-to 0 (get id (map-get? names-map (tuple (name "non-existant"))))) ;; Returns 0
```

***

## define-constant

Introduced in: **Clarity 1**

**input:** `MethodSignature, MethodBody`\
**output:** `Not Applicable`\
**signature:** `(define-constant name expression)`

**description:**\
Defines a private constant evaluated at contract launch. Must be top-level. Be mindful of definition order.

**example:**

```clojure
(define-constant four (+ 2 2))
(+ 4 four) ;; Returns 8
```

***

## define-data-var

Introduced in: **Clarity 1**

**input:** `VarName, TypeDefinition, Value`\
**output:** `Not Applicable`\
**signature:** `(define-data-var var-name type value)`

**description:**\
Defines a new persisted variable for the contract. Only modifiable by the contract. Must be top-level.

**example:**

```clojure
(define-data-var size int 0)
(define-private (set-size (value int))
  (var-set size value))
(set-size 1)
(set-size 2)
```

***

## define-fungible-token

Introduced in: **Clarity 1**

**input:** `TokenName, <uint>`\
**output:** `Not Applicable`\
**signature:** `(define-fungible-token token-name <total-supply>)`

**description:**\
Defines a fungible token class in the contract. Optional total supply caps minting. Must be top-level.

**example:**

```clojure
(define-fungible-token stacks)
(define-fungible-token limited-supply-stacks u100)
```

***

## define-map

Introduced in: **Clarity 1**

**input:** `MapName, TypeDefinition, TypeDefinition`\
**output:** `Not Applicable`\
**signature:** `(define-map map-name key-type value-type)`

**description:**\
Defines a data map stored by the contract. Must be top-level.

**example:**

```clojure
(define-map squares { x: int } { square: int })
(define-private (add-entry (x int))
  (map-insert squares { x: 2 } { square: (* x x) }))
(add-entry 1)
(add-entry 2)
```

***

## define-non-fungible-token

Introduced in: **Clarity 1**

**input:** `AssetName, TypeSignature`\
**output:** `Not Applicable`\
**signature:** `(define-non-fungible-token asset-name asset-identifier-type)`

**description:**\
Defines an NFT class in the contract. Asset identifiers must be unique. Must be top-level.

**example:**

```clojure
(define-non-fungible-token names (buff 50))
```

***

## define-private

Introduced in: **Clarity 1**

**input:** `MethodSignature, MethodBody`\
**output:** `Not Applicable`\
**signature:** `(define-private (function-name (arg-name-0 arg-type-0) ...) function-body)`

**description:**\
Defines a private function callable only within the contract. Must be top-level.

**example:**

```clojure
(define-private (max-of (i1 int) (i2 int))
  (if (> i1 i2)
    i1
    i2))
(max-of 4 6) ;; Returns 6
```

***

## define-public

Introduced in: **Clarity 1**

**input:** `MethodSignature, MethodBody`\
**output:** `Not Applicable`\
**signature:** `(define-public (function-name (arg-name-0 arg-type-0) ...) function-body)`

**description:**\
Defines a public transaction function. Must return a ResponseType (`ok` or `err`). DB changes are aborted if `err`. Must be top-level.

**example:**

```clojure
(define-public (hello-world (input int))
  (begin
    (print (+ 2 input))
    (ok input)))
```

***

## define-read-only

Introduced in: **Clarity 1**

**input:** `MethodSignature, MethodBody`\
**output:** `Not Applicable`\
**signature:** `(define-read-only (function-name (arg-name-0 arg-type-0) ...) function-body)`

**description:**\
Defines a public read-only function. Cannot modify data maps or call mutating functions. May return any type. Must be top-level.

**example:**

```clojure
(define-read-only (just-return-one-hundred)
  (* 10 10))
```

***

## define-trait

Introduced in: **Clarity 1**

**input:** `VarName, [MethodSignature]`\
**output:** `Not Applicable`\
**signature:** `(define-trait trait-name ((func1-name (arg1-type ...) (return-type))))`

**description:**\
Defines a trait (interface) other contracts can implement. Must be top-level. Notes about Clarity 1 vs Clarity 2 trait usage and implicit casting in Clarity 2 are included.

**example:**

```clojure
(define-trait token-trait
  ((transfer? (principal principal uint) (response uint uint))
  (get-balance (principal) (response uint uint))))
```

***

## element-at

Introduced in: **Clarity 1**

**input:** `sequence_A, uint`\
**output:** `(optional A)`\
**signature:** `(element-at? sequence index)`

**description:**\
Returns the element at `index` in the sequence as an optional. Applicable types: `(list A)`, `buff`, `string-ascii`, `string-utf8`. In Clarity 1 spelled `element-at` (alias).

**example:**

```clojure
(element-at? "blockstack" u5) ;; Returns (some "s")
(element-at? (list 1 2 3 4 5) u5) ;; Returns none
(element-at? (list 1 2 3 4 5) (+ u1 u2)) ;; Returns (some 4)
(element-at? "abcd" u1) ;; Returns (some "b")
(element-at? 0xfb01 u1) ;; Returns (some 0x01)
```

***

## element-at?

Introduced in: **Clarity 2**

(Same as element-at; retained as Clarity 2 preferred spelling)

**example:** (see element-at above)

***

## err

Introduced in: **Clarity 1**

**input:** `A`\
**output:** `(response A B)`\
**signature:** `(err value)`

**description:**\
Constructs an `err` response. Use for returning errors from public functions; indicates DB changes should be rolled back.

**example:**

```clojure
(err true) ;; Returns (err true)
```

***

## filter

Introduced in: **Clarity 1**

**input:** `Function(A) -> bool, sequence_A`\
**output:** `sequence_A`\
**signature:** `(filter func sequence)`

**description:**\
Filters elements of a sequence by applying `func` to each element and keeping those where `func` returns `true`. `func` must be a literal function name. Applies to `(list A)`, `buff`, `string-ascii`, `string-utf8`.

**example:**

```clojure
(filter not (list true false true false)) ;; Returns (false false)
(define-private (is-a (char (string-utf8 1)))
  (is-eq char u"a"))
(filter is-a u"acabd") ;; Returns u"aa"
```

***

## fold

Introduced in: **Clarity 1**

**input:** `Function(A, B) -> B, sequence_A, B`\
**output:** `B`\
**signature:** `(fold func sequence_A initial_B)`

**description:**\
Reduces a sequence to a single value by applying `func` cumulatively, starting with `initial_B`.

**example:**

```clojure
(fold * (list 2 2 2) 1) ;; Returns 8
(fold - (list 3 7 11) 2) ;; Returns 5
```

(Examples showing string/buffer concatenation omitted here; see original for fuller set.)

***

## from-consensus-buff?

Introduced in: **Clarity 2**

**input:** `type-signature(t), buff`\
**output:** `(optional t)`\
**signature:** `(from-consensus-buff? type-signature buffer)`

**description:**\
Deserializes a buffer into a Clarity value using SIP-005 consensus serialization. Returns `some` on success, `none` on failure.

**example:**

```clojure
(from-consensus-buff? int 0x0000000000000000000000000000000001) ;; Returns (some 1)
(from-consensus-buff? uint 0x0000000000000000000000000000000001) ;; Returns none
(from-consensus-buff? bool 0x03) ;; Returns (some true)
(from-consensus-buff? principal 0x051fa46ff88886c2ef9762d970b4d2c63678835bd39d) ;; Returns (some SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR)
```

***

## ft-burn?

Introduced in: **Clarity 1**

**input:** `TokenName, uint, principal`\
**output:** `(response bool uint)`\
**signature:** `(ft-burn? token-name amount sender)`

**description:**\
Burns (destroys) `amount` of `token-name` from `sender`'s balance. On success returns `(ok true)`. Error `(err u1)` - insufficient balance or non-positive amount.

**example:**

```clojure
(define-fungible-token stackaroo)
(ft-mint? stackaroo u100 'SPAXYA5XS51713FDTQ8H94EJ4V579CXMTRNBZKSF) ;; Returns (ok true)
(ft-burn? stackaroo u50 'SPAXYA5XS51713FDTQ8H94EJ4V579CXMTRNBZKSF) ;; Returns (ok true)
```

***

## ft-get-balance

Introduced in: **Clarity 1**

**input:** `TokenName, principal`\
**output:** `uint`\
**signature:** `(ft-get-balance token-name principal)`

**description:**\
Returns the `token-name` balance for `principal`. Token must be defined with `define-fungible-token`.

**example:**

```clojure
(define-fungible-token stackaroo)
(ft-mint? stackaroo u100 'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR)
(ft-get-balance stackaroo 'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR) ;; Returns u100
```

***

## ft-get-supply

Introduced in: **Clarity 1**

**input:** `TokenName`\
**output:** `uint`\
**signature:** `(ft-get-supply token-name)`

**description:**\
Returns circulating supply for the `token-name`. Token must be defined with `define-fungible-token`.

**example:**

```clojure
(define-fungible-token stackaroo)
(ft-mint? stackaroo u100 'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR)
(ft-get-supply stackaroo) ;; Returns u100
```

***

## ft-mint?

Introduced in: **Clarity 1**

**input:** `TokenName, uint, principal`\
**output:** `(response bool uint)`\
**signature:** `(ft-mint? token-name amount recipient)`

**description:**\
Mints `amount` of `token-name` to `recipient`. Non-positive amount returns `(err 1)`. On success returns `(ok true)`.

**example:**

```clojure
(define-fungible-token stackaroo)
(ft-mint? stackaroo u100 'SPAXYA5XS51713FDTQ8H94EJ4V579CXMTRNBZKSF) ;; Returns (ok true)
```

***

## ft-transfer?

Introduced in: **Clarity 1**

**input:** `TokenName, uint, principal, principal`\
**output:** `(response bool uint)`\
**signature:** `(ft-transfer? token-name amount sender recipient)`

**description:**\
Transfers `amount` of `token-name` from `sender` to `recipient` (token must be defined in contract). Anyone can call; proper guards are expected. Returns `(ok true)` on success. Error codes: `(err u1)` insufficient balance, `(err u2)` sender==recipient, `(err u3)` non-positive amount.

**example:**

```clojure
(define-fungible-token stackaroo)
(ft-mint? stackaroo u100 'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR)
(ft-transfer? stackaroo u50 'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR 'SPAXYA5XS51713FDTQ8H94EJ4V579CXMTRNBZKSF) ;; Returns (ok true)
```

***

## get

Introduced in: **Clarity 1**

**input:** `KeyName, (tuple) | (optional (tuple))`\
**output:** `A`\
**signature:** `(get key-name tuple)`

**description:**\
Fetches value associated with `key-name` from a tuple. If an optional tuple is supplied and is `none`, returns `none`.

**example:**

```clojure
(define-map names-map { name: (string-ascii 12) } { id: int })
(map-insert names-map { name: "blockstack" } { id: 1337 })
(get id (tuple (name "blockstack") (id 1337))) ;; Returns 1337
(get id (map-get? names-map (tuple (name "blockstack")))) ;; Returns (some 1337)
(get id (map-get? names-map (tuple (name "non-existent")))) ;; Returns none
```

***

## get-block-info?

Introduced in: **Clarity 1**

**input:** `BlockInfoPropertyName, uint`\
**output:** `(optional buff) | (optional uint)`\
**signature:** `(get-block-info? prop-name block-height)`

**description:**\
Fetches data for a Stacks block at given block height. If the height doesn't exist prior to current block, returns `none`. Property names and returned types described; newer Clarity versions split this into `get-stacks-block-info?` and `get-tenure-info?`. See original for full list of properties and notes.

**example:**

```clojure
(get-block-info? time u0) ;; Returns (some u1557860301)
(get-block-info? header-hash u0) ;; Returns (some 0x3747...)
```

***

## get-burn-block-info?

Introduced in: **Clarity 2**

**input:** `BurnBlockInfoPropertyName, uint`\
**output:** `(optional buff) | (optional (tuple ...))`\
**signature:** `(get-burn-block-info? prop-name block-height)`

**description:**\
Fetches burnchain block data for the given burnchain height. Valid properties include `header-hash` and `pox-addrs`. See original for full tuple shape of `pox-addrs`.

**example:**

```clojure
(get-burn-block-info? header-hash u677050) ;; Returns (some 0xe671...)
(get-burn-block-info? pox-addrs u677050) ;; Returns (some (tuple (addrs (...)) (payout u123)))
```

***

## get-stacks-block-info?

Introduced in: **Clarity 3**

**input:** `StacksBlockInfoPropertyName, uint`\
**output:** `(optional buff), (optional uint)`\
**signature:** `(get-stacks-block-info? prop-name stacks-block-height)`

**description:**\
Replacement for `get-block-info?` in Clarity 3; fetches Stacks block data for a given height. See original for property list and behavior differences before/after epoch 3.0.

**example:**

```clojure
(get-stacks-block-info? time u0) ;; Returns (some u1557860301)
(get-stacks-block-info? header-hash u0) ;; Returns (some 0x3747...)
```

***

## get-tenure-info?

Introduced in: **Clarity 3**

**input:** `TenureInfoPropertyName, uint`\
**output:** `(optional buff) | (optional uint)`\
**signature:** `(get-tenure-info? prop-name stacks-block-height)`

**description:**\
Fetches tenure-related info at the given block height (burnchain header for tenure, miner address, time, vrf-seed, block reward, miner spend totals). Returns `none` if height is not prior to current block. See original for full notes.

**example:**

```clojure
(get-tenure-info? time u0) ;; Returns (some u1557860301)
(get-tenure-info? vrf-seed u0) ;; Returns (some 0xf490...)
```

***

## hash160

Introduced in: **Clarity 1**

**input:** `buff|uint|int`\
**output:** `(buff 20)`\
**signature:** `(hash160 value)`

**description:**\
Computes RIPEMD160(SHA256(x)). If input is an integer, it is hashed over its little-endian representation.

**example:**

```clojure
(hash160 0) ;; Returns 0xe4352f72...
```

***

## if

Introduced in: **Clarity 1**

**input:** `bool, A, A`\
**output:** `A`\
**signature:** `(if bool1 expr1 expr2)`

**description:**\
Conditional expression: evaluates and returns `expr1` if `bool1` is true, otherwise `expr2`. Both exprs must return the same type.

**example:**

```clojure
(if true 1 2) ;; Returns 1
(if (> 1 2) 1 2) ;; Returns 2
```

***

## impl-trait

Introduced in: **Clarity 1**

**input:** `TraitIdentifier`\
**output:** `Not Applicable`\
**signature:** `(impl-trait trait-identifier)`

**description:**\
Asserts that the contract implements the given trait. Checked at publish time. Must be top-level.

**example:**

```clojure
(impl-trait 'SPAXYA5XS51713FDTQ8H94EJ4V579CXMTRNBZKSF.token-a.token-trait)
(define-public (get-balance (account principal))
  (ok u0))
```

***

## index-of

Introduced in: **Clarity 1**

**input:** `sequence_A, A`\
**output:** `(optional uint)`\
**signature:** `(index-of? sequence item)`

**description:**\
Returns first index of `item` in sequence using `is-eq`. Returns `none` if not found or if empty string/buffer. Clarity 1 spelling: `index-of` (alias).

**example:**

```clojure
(index-of? "blockstack" "b") ;; Returns (some u0)
(index-of? (list 1 2 3 4 5) 6) ;; Returns none
```

***

## index-of?

Introduced in: **Clarity 2**

(Same as index-of; retained for Clarity 2)

***

## int-to-ascii

Introduced in: **Clarity 2**

**input:** `int | uint`\
**output:** `(string-ascii 40)`\
**signature:** `(int-to-ascii (int|uint))`

**description:**\
Converts an integer to its ASCII string representation. Available starting Stacks 2.1.

**example:**

```clojure
(int-to-ascii 1) ;; Returns "1"
(int-to-ascii -1) ;; Returns "-1"
```

***

## int-to-utf8

Introduced in: **Clarity 2**

**input:** `int | uint`\
**output:** `(string-utf8 40)`\
**signature:** `(int-to-utf8 (int|uint))`

**description:**\
Converts an integer to its UTF-8 string representation. Available starting Stacks 2.1.

**example:**

```clojure
(int-to-utf8 1) ;; Returns u"1"
(int-to-utf8 -1) ;; Returns u"-1"
```

***

## is-eq

Introduced in: **Clarity 1**

**input:** `A, A, ...`\
**output:** `bool`\
**signature:** `(is-eq v1 v2...)`

**description:**\
Returns `true` if all inputs are equal. Unlike `and`, does not short-circuit. All arguments must be the same type.

**example:**

```clojure
(is-eq 1 1) ;; Returns true
(is-eq true false) ;; Returns false
(is-eq "abc" "abc") ;; Returns true
```

***

## is-err / is-ok / is-none / is-some

Introduced in: **Clarity 1**

* `(is-err value)` returns `true` if `value` is `(err ...)`.
* `(is-ok value)` returns `true` if `value` is `(ok ...)`.
* `(is-none value)` returns `true` if `value` is `none`.
* `(is-some value)` returns `true` if `value` is `(some ...)`.

**examples:**

```clojure
(is-err (err 1)) ;; Returns true
(is-ok (ok 1)) ;; Returns true
(is-none none) ;; Returns true
(is-some (some 1)) ;; Returns true
```

***

## is-standard

Introduced in: **Clarity 2**

**input:** `principal`\
**output:** `bool`\
**signature:** `(is-standard standard-or-contract-principal)`

**description:**\
Tests whether a principal matches the current network type (mainnet vs testnet) and therefore can spend tokens on that network. Available starting Stacks 2.1.

**example:**

```clojure
(is-standard 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6) ;; true on testnet; false on mainnet
```

***

## keccak256

Introduced in: **Clarity 1**

**input:** `buff|uint|int`\
**output:** `(buff 32)`\
**signature:** `(keccak256 value)`

**description:**\
Computes KECCAK256(value). If input is an integer, it is hashed over its little-endian representation.

**example:**

```clojure
(keccak256 0) ;; Returns 0xf490de29...
```

***

## len

Introduced in: **Clarity 1**

**input:** `sequence_A`\
**output:** `uint`\
**signature:** `(len sequence)`

**description:**\
Returns length of a sequence. Applies to `(list A)`, `buff`, `string-ascii`, `string-utf8`.

**example:**

```clojure
(len "blockstack") ;; Returns u10
(len (list 1 2 3 4 5)) ;; Returns u5
(len 0x010203) ;; Returns u3
```

***

## let

Introduced in: **Clarity 1**

**input:** `((name1 AnyType) ...), AnyType, ... A`\
**output:** `A`\
**signature:** `(let ((name1 expr1) ...) expr-body1 ... expr-body-last)`

**description:**\
Binds sequential variables then evaluates the body expressions in that context. Returns last body expression's value.

**example:**

```clojure
(let ((a 2) (b (+ 5 6 7)))
  (print a)
  (print b)
  (+ a b)) ;; Returns 20
```

***

## list

Introduced in: **Clarity 1**

**input:** `A, ...`\
**output:** `(list A)`\
**signature:** `(list expr1 expr2 expr3 ...)`

**description:**\
Constructs a list from supplied values (must be same type).

**example:**

```clojure
(list (+ 1 2) 4 5) ;; Returns (3 4 5)
```

***

## log2

Introduced in: **Clarity 1**

**input:** `int | uint`\
**output:** `int | uint`\
**signature:** `(log2 n)`

**description:**\
Returns floor(log2(n)). Fails on negative numbers.

**example:**

```clojure
(log2 u8) ;; Returns u3
(log2 8) ;; Returns 3
```

***

## map

Introduced in: **Clarity 1**

**input:** `Function(A, B, ..., N) -> X, sequence_A, sequence_B, ...`\
**output:** `(list X)`\
**signature:** `(map func sequence_A sequence_B ...)`

**description:**\
Applies `func` to each corresponding element of input sequences and returns a list of results. `func` must be a literal function name. Output is always a list.

**example:**

```clojure
(map + (list 1 2 3) (list 1 2 3) (list 1 2 3)) ;; Returns (3 6 9)
```

***

## map-delete / map-get? / map-insert / map-set

Introduced in: **Clarity 1**

Operations for manipulating contract data maps:

* `(map-delete map-name key-tuple)` — removes entry; returns `true` if removed, `false` if none existed.
* `(map-get? map-name key-tuple)` — returns `(some value)` or `none`.
* `(map-insert map-name key-tuple value-tuple)` — inserts only if key absent; returns `true` if inserted, `false` if existed.
* `(map-set map-name key-tuple value-tuple)` — blind overwrite; returns `true`.

Examples exist in the original content (omitted here for brevity).

***

## match

Introduced in: **Clarity 1**

**input:** `(optional A) name expression expression | (response A B) name expression name expression`\
**output:** `C`\
**signature:** `(match opt-input some-binding-name some-branch none-branch) | (match-resp input ok-binding-name ok-branch err-binding-name err-branch)`

**description:**\
Destructures `optional` and `response` types and evaluates only the matching branch. See original for type-checking caveats.

**example:**

```clojure
(define-private (add-10 (x (optional int)))
  (match x
    value (+ 10 value)
    10))
(add-10 (some 5)) ;; Returns 15
(add-10 none) ;; Returns 10
```

***

## merge

Introduced in: **Clarity 1**

**input:** `tuple, tuple`\
**output:** `tuple`\
**signature:** `(merge tuple { key1: val1 })`

**description:**\
Returns a new tuple combining fields (non-mutating).

**example:**

```clojure
(merge user { address: (some 'SPAXYA5X...) }) ;; Returns merged tuple
```

***

## mod

Introduced in: **Clarity 1**

**input:** `int, int | uint, uint | string-ascii, string-ascii | string-utf8, string-utf8 | buff, buff`\
**output:** `int | uint`\
**signature:** `(mod i1 i2)`

**description:**\
Returns remainder of integer division; division by zero throws runtime error.

**example:**

```clojure
(mod 5 2) ;; Returns 1
```

***

## nft-burn? / nft-get-owner? / nft-mint? / nft-transfer?

Introduced in: **Clarity 1**

NFT operations for assets defined with `define-non-fungible-token`:

* `(nft-mint? asset-class asset-identifier recipient)` — mint; returns `(ok true)` or `(err u1)` if exists.
* `(nft-get-owner? asset-class asset-identifier)` — returns `(some owner)` or `none`.
* `(nft-transfer? asset-class asset-identifier sender recipient)` — transfer; returns `(ok true)` or errors.
* `(nft-burn? asset-class asset-identifier sender)` — burn; returns `(ok true)` or errors.

Examples present in original content.

***

## not

Introduced in: **Clarity 1**

**input:** `bool`\
**output:** `bool`\
**signature:** `(not b1)`

**description:**\
Boolean negation.

**example:**

```clojure
(not true) ;; Returns false
```

***

## ok

Introduced in: **Clarity 1**

**input:** `A`\
**output:** `(response A B)`\
**signature:** `(ok value)`

**description:**\
Constructs an `ok` response. Use for successful public function returns.

**example:**

```clojure
(ok 1) ;; Returns (ok 1)
```

***

## or

Introduced in: **Clarity 1**

**input:** `bool, ...`\
**output:** `bool`\
**signature:** `(or b1 b2 ...)`

**description:**\
Returns `true` if any input is `true`. Evaluated in-order and lazily (short-circuits on `true`).

**example:**

```clojure
(or true false) ;; Returns true
```

***

## pow

Introduced in: **Clarity 1**

**input:** `int, int | uint, uint | string-ascii, string-ascii | string-utf8, string-utf8 | buff, buff`\
**output:** `int | uint`\
**signature:** `(pow i1 i2)`

**description:**\
Returns i1^i2. Throws runtime error on overflow. Special-case rules for 0^0, i1==1, etc. Throws runtime error if exponent negative or > u32::MAX.

**example:**

```clojure
(pow 2 3) ;; Returns 8
```

***

## principal-construct?

Introduced in: **Clarity 2**

**input:** `(buff 1), (buff 20), [(string-ascii 40)]`\
**output:** `(response principal { error_code: uint, principal: (option principal) })`\
**signature:** `(principal-construct? (buff 1) (buff 20) [(string-ascii 40)])`

**description:**\
Constructs a standard or contract principal from version byte and hash bytes, optionally with contract name. Returns `ok` with principal or `err` tuple with error code and optional principal. Available starting Stacks 2.1.

**example:** (see original for many examples)

***

## principal-destruct?

Introduced in: **Clarity 2**

**input:** `principal`\
**output:** `(response (tuple ...) (tuple ...))`\
**signature:** `(principal-destruct? principal-address)`

**description:**\
Decomposes a principal into `{version, hash-bytes, name}` tuple. Returns `ok` if version matches network, otherwise `err`. Available starting Stacks 2.1.

**example:** (see original)

***

## principal-of?

Introduced in: **Clarity 1**

**input:** `(buff 33)`\
**output:** `(response principal uint)`\
**signature:** `(principal-of? public-key)`

**description:**\
Derives the principal from a compressed public key. Returns `(err u1)` if invalid. Note: pre-2.1 bug returned testnet principals irrespective of network; fixed in 2.1.

**example:**

```clojure
(principal-of? 0x03adb8de4b...) ;; Returns (ok ST1AW6E...)
```

***

## print

Introduced in: **Clarity 1**

**input:** `A`\
**output:** `A`\
**signature:** `(print expr)`

**description:**\
Evaluates and returns its argument. On dev nodes prints to STDOUT.

**example:**

```clojure
(print (+ 1 2 3)) ;; Returns 6
```

***

## replace-at?

Introduced in: **Clarity 2**

**input:** `sequence_A, uint, A`\
**output:** `(optional sequence_A)`\
**signature:** `(replace-at? sequence index element)`

**description:**\
Returns a new sequence with element at `index` replaced. Returns `none` if index out of bounds.

**example:**

```clojure
(replace-at? u"ab" u1 u"c") ;; Returns (some u"ac")
(replace-at? (list 1 2) u3 4) ;; Returns none
```

***

## secp256k1-recover?

Introduced in: **Clarity 1**

**input:** `(buff 32), (buff 65)`\
**output:** `(response (buff 33) uint)`\
**signature:** `(secp256k1-recover? message-hash signature)`

**description:**\
Recovers the public key from a signature over message-hash. Returns `(err u1)` if signature doesn't match, `(err u2)` if signature invalid.

**example:** (see original)

***

## secp256k1-verify

Introduced in: **Clarity 1**

**input:** `(buff 32), (buff 64) | (buff 65), (buff 33)`\
**output:** `bool`\
**signature:** `(secp256k1-verify message-hash signature public-key)`

**description:**\
Verifies that `signature` of `message-hash` was produced by `public-key`. Signature is 64 or 65 bytes.

**example:** (see original)

***

## sha256 / sha512 / sha512/256

Introduced in: **Clarity 1**

Hash functions:

* `(sha256 value)` → `(buff 32)`
* `(sha512 value)` → `(buff 64)`
* `(sha512/256 value)` → `(buff 32)`

If integer supplied, hashed over little-endian representation.

**examples:**

```clojure
(sha256 0) ;; Returns 0x374708ff...
(sha512 1) ;; Returns 0x6fcee9a7...
(sha512/256 1) ;; Returns 0x515a7e92...
```

***

## slice?

Introduced in: **Clarity 2**

**input:** `sequence_A, uint, uint`\
**output:** `(optional sequence_A)`\
**signature:** `(slice? sequence left-position right-position)`

**description:**\
Returns subsequence \[left, right). If left==right returns empty sequence. Returns `none` if out of bounds or right < left.

**example:**

```clojure
(slice? "blockstack" u5 u10) ;; Returns (some "stack")
(slice? "abcd" u2 u2) ;; Returns (some "")
(slice? "abcd" u3 u1) ;; Returns none
```

***

## some

Introduced in: **Clarity 1**

**input:** `A`\
**output:** `(optional A)`\
**signature:** `(some value)`

**description:**\
Constructs `(some value)`.

**example:**

```clojure
(some 1) ;; Returns (some 1)
```

***

## sqrti

Introduced in: **Clarity 1**

**input:** `int | uint`\
**output:** `int | uint`\
**signature:** `(sqrti n)`

**description:**\
Returns floor(sqrt(n)). Fails on negative numbers.

**example:**

```clojure
(sqrti u11) ;; Returns u3
```

***

## string-to-int? / string-to-uint?

Introduced in: **Clarity 2**

**input:** `(string-ascii 1048576) | (string-utf8 262144)`\
**output:** `(optional int)` / `(optional uint)`\
**signature:** `(string-to-int? str)` / `(string-to-uint? str)`

**description:**\
Parse string to int/uint. Returns `(some value)` on success, `none` on failure. Available starting Stacks 2.1.

**example:**

```clojure
(string-to-int? "1") ;; Returns (some 1)
(string-to-uint? "1") ;; Returns (some u1)
(string-to-int? "a") ;; Returns none
```

***

## stx-account

Introduced in: **Clarity 2**

**input:** `principal`\
**output:** `(tuple (locked uint) (unlock-height uint) (unlocked uint))`\
**signature:** `(stx-account owner)`

**description:**\
Query the STX account for `owner`. Returns locked, unlock-height, and unlocked amounts (microstacks). Available starting Clarity 2.

**example:**

```clojure
(stx-account 'SZ2J6ZY48G...) ;; Returns (tuple (locked u0) (unlock-height u0) (unlocked u0))
```

***

## stx-burn?

Introduced in: **Clarity 1**

**input:** `uint, principal`\
**output:** `(response bool uint)`\
**signature:** `(stx-burn? amount sender)`

**description:**\
Destroys `amount` of STX from `sender` (microstacks). `sender` must be current `tx-sender`. Returns `(ok true)` on success. Error codes: `(err u1)` insufficient balance, `(err u3)` non-positive amount, `(err u4)` sender not tx-sender.

**example:**

```clojure
(as-contract (stx-burn? u60 tx-sender)) ;; Returns (ok true)
```

***

## stx-get-balance

Introduced in: **Clarity 1**

**input:** `principal`\
**output:** `uint`\
**signature:** `(stx-get-balance owner)`

**description:**\
Returns STX balance (microstacks) of `owner`. If owner not materialized returns 0.

**example:**

```clojure
(stx-get-balance (as-contract tx-sender)) ;; Returns u1000
```

***

## stx-transfer-memo?

Introduced in: **Clarity 2**

**input:** `uint, principal, principal, buff`\
**output:** `(response bool uint)`\
**signature:** `(stx-transfer-memo? amount sender recipient memo)`

**description:**\
Same as `stx-transfer?` but includes a `memo` buffer. Returns same error codes as `stx-transfer?`.

**example:**

```clojure
(as-contract (stx-transfer-memo? u60 tx-sender 'SZ2J6Z... 0x010203)) ;; Returns (ok true)
```

***

## stx-transfer?

Introduced in: **Clarity 1**

**input:** `uint, principal, principal`\
**output:** `(response bool uint)`\
**signature:** `(stx-transfer? amount sender recipient)`

**description:**\
Transfers STX (microstacks) from `sender` to `recipient`. `sender` must be current `tx-sender`. Returns `(ok true)` or errors: `(err u1)` insufficient funds, `(err u2)` same principal, `(err u3)` non-positive amount, `(err u4)` sender not tx-sender.

**example:**

```clojure
(as-contract (stx-transfer? u60 tx-sender 'SZ2J6Z...)) ;; Returns (ok true)
```

***

## to-consensus-buff?

Introduced in: **Clarity 2**

**input:** `any`\
**output:** `(optional buff)`\
**signature:** `(to-consensus-buff? value)`

**description:**\
Serializes a Clarity value using SIP-005 consensus serialization. If serialized size fits into a buffer, returns `(some buff)`, else `none`. During type checking the maximal possible buffer length is inferred. Available starting Clarity 2.

**example:**

```clojure
(to-consensus-buff? 1) ;; Returns (some 0x0000...01)
(to-consensus-buff? true) ;; Returns (some 0x03)
```

***

## to-int

Introduced in: **Clarity 1**

**input:** `uint`\
**output:** `int`\
**signature:** `(to-int u)`

**description:**\
Converts `uint` to `int`. Runtime error if argument >= 2^127.

**example:**

```clojure
(to-int u238) ;; Returns 238
```

***

## to-uint

Introduced in: **Clarity 1**

**input:** `int`\
**output:** `uint`\
**signature:** `(to-uint i)`

**description:**\
Converts `int` to `uint`. Runtime error if argument is negative.

**example:**

```clojure
(to-uint 238) ;; Returns u238
```

***

## try!

Introduced in: **Clarity 1**

**input:** `(optional A) | (response A B)`\
**output:** `A`\
**signature:** `(try! option-input)`

**description:**\
Unpacks `(some v)` or `(ok v)` returning `v`. If input is `none` or `(err ...)`, `try!` returns the current function's `none` or `(err ...)` and exits control-flow.

**example:** (see original for longer usage)

***

## tuple

Introduced in: **Clarity 1**

**input:** `(key-name A), ...`\
**output:** `(tuple (key-name A) ...)`\
**signature:** `(tuple (key0 expr0) (key1 expr1) ...)`

**description:**\
Constructs a typed tuple. Shorthand using curly braces `{ key: val, ... }` is available.

**example:**

```clojure
(tuple (name "blockstack") (id 1337))
{name: "blockstack", id: 1337}
```

***

## unwrap! / unwrap-err! / unwrap-err-panic / unwrap-panic

Introduced in: **Clarity 1**

Utilities for unpacking optionals and responses with different failure behaviors:

* `(unwrap! option-or-response thrown-value)` — returns inner value or returns `thrown-value` from current function.
* `(unwrap-err! response-input thrown-value)` — returns err value or returns `thrown-value` if ok.
* `(unwrap-err-panic response-input)` — returns err inner value or throws runtime error if ok.
* `(unwrap-panic option-or-response)` — returns inner value or throws runtime error if none/err.

**example:** (see original for usage)

***

## use-trait

Introduced in: **Clarity 1**

**input:** `VarName, TraitIdentifier`\
**output:** `Not Applicable`\
**signature:** `(use-trait trait-alias trait-identifier)`

**description:**\
Imports an external trait under an alias for use in the contract (must be top-level).

**example:**

```clojure
(use-trait token-a-trait 'SPAXYA5X....token-a.token-trait)
```

***

## var-get / var-set

Introduced in: **Clarity 1**

* `(var-get var-name)` — returns the value of a data var.
* `(var-set var-name expr)` — sets the data var; returns `true`.

**example:**

```clojure
(define-data-var cursor int 6)
(var-get cursor) ;; Returns 6
(var-set cursor (+ (var-get cursor) 1)) ;; Returns true
```

***

## xor

Introduced in: **Clarity 1**

**input:** `int, int | uint, uint | string-ascii, string-ascii | string-utf8, string-utf8 | buff, buff`\
**output:** `int | uint`\
**signature:** `(xor i1 i2)`

**description:**\
Bitwise exclusive OR of `i1` and `i2`.

**example:**

```clojure
(xor 1 2) ;; Returns 3
```
