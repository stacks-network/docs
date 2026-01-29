---
description: The complete reference guide to all Clarity functions.
---

# Functions

## Understanding Clarity Function Costs

Clarity function costs determine the computational resources required to execute each operation on the Stacks blockchain. Understanding these costs helps you:

- **Optimize smart contracts** by choosing efficient operations
- **Predict transaction fees** more accurately before deployment
- **Avoid hitting block limits** by understanding which functions are expensive
- **Make informed architecture decisions** when designing contracts

### Cost Dimensions

Clarity costs are measured across five dimensions:

| Dimension | Description |
|-----------|-------------|
| **Runtime** | CPU cycles consumed (primary cost component) |
| **Read Count** | Number of read operations from chain state |
| **Read Length** | Bytes read from chain state |
| **Write Count** | Number of write operations to chain state |
| **Write Length** | Bytes written to chain state |

### Cost Types

- **Static**: Fixed cost regardless of input (e.g., `168 runtime`)
- **Linear**: `cost = a × n + b` where n is input size (e.g., `11n + 125`)
- **NLogN**: `cost = a × n × log₂(n) + b` (e.g., `4n×log₂(n) + 1736`)

### Cost Notation

Throughout this reference, costs are shown as:

```
**cost:** <formula> runtime units [+ I/O costs if applicable]
```

Where `n` typically represents:
- Number of arguments for variadic functions
- Size in bytes for buffer/string operations
- Number of elements for list operations

> **Note**: Cost values are from Clarity 4 (Nakamoto upgrade). Costs may vary between Clarity versions.

---

## \* (multiply)

Introduced in: **Clarity 1**

**input:** `int, ... | uint, ...`\
**output:** `int | uint`\
**signature:** `(* i1 i2...)`\
**cost:** `13n + 125` runtime (where n = number of arguments)

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
**signature:** `(+ i1 i2...)`\
**cost:** `11n + 125` runtime (where n = number of arguments)

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
**signature:** `(- i1 i2...)`\
**cost:** `11n + 125` runtime (where n = number of arguments)

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
**signature:** `(/ i1 i2...)`\
**cost:** `13n + 125` runtime (where n = number of arguments)

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

**input:** `int, int | uint, uint`\
**output:** `bool`\
**signature:** `(< i1 i2)`\
**cost:** `7n + 128` runtime (where n = min input size in bytes)

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

**input:** `int, int | uint, uint`\
**output:** `bool`\
**signature:** `(<= i1 i2)`\
**cost:** `7n + 128` runtime (where n = min input size in bytes)

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
**signature:** `(> i1 i2)`\
**cost:** `7n + 128` runtime (where n = min input size in bytes)

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
**signature:** `(>= i1 i2)`\
**cost:** `7n + 128` runtime (where n = min input size in bytes)

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
**signature:** `(and b1 b2 ...)`\
**cost:** `3n + 120` runtime (where n = number of arguments)

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
**signature:** `(append (list 1 2 3 4) 5)`\
**cost:** `73n + 285` runtime (where n = max(list entry type size, appended value type size) in bytes)

**description:**\
Takes a list and a value of the same entry type, and returns a new list with max\_len += 1 (effectively appending the value).

**example:**

```clojure
(append (list 1 2 3 4) 5) ;; Returns (1 2 3 4 5)
```

***

## as-contract?

Introduced in: **Clarity 4**

{% hint style="info" %}
The previous version of `as-contract`, introduced in Clarity 1, has changed to `as-contract?` in Clarity 4, with several new security enhancements. If you are using Clarity 1-3, the previous signature and description for `as-contract` can be found in the dropdown below.
{% endhint %}

<details>

<summary>Previous <code>as-contract</code></summary>

**input:** `A` **output:** `A` **signature:** `(as-contract expr)`

**description:** Executes `expr` with the tx-sender switched to the contract's principal and returns the result.

**example:**

Copy

```
(as-contract tx-sender) ;; Returns S1G2081040G2081040G2081040G208105NK8PE5.docs-test
```

</details>

**Input**:

* `((with-stx|with-ft|with-nft|with-stacking)*|with-all-assets-unsafe)`: The set of allowances (at most 128) to grant during the evaluation of the body expressions. Note that `with-all-assets-unsafe` is mutually exclusive with other allowances.
* `AnyType* A`: The Clarity expressions to be executed within the context, with the final expression returning type `A`, where `A` is not a `response`

**Output**: `(response A uint)`

**Signature**: `(as-contract? ((with-stx|with-ft|with-nft|with-stacking)*|with-all-assets-unsafe) expr-body1 expr-body2 ... expr-body-last)`

**Description**: Switches the current context's `tx-sender` and `contract-caller` values to the contract's principal and executes the body expressions within that context, then checks the asset outflows from the contract against the granted allowances, in declaration order. If any allowance is violated, the body expressions are reverted and an error is returned. Note that the allowance setup expressions are evaluated before executing the body expressions. The final body expression cannot return a `response` value in order to avoid returning a nested `response` value from `as-contract?` (nested responses are error-prone). Returns:

* `(ok x)` if the outflows are within the allowances, where `x` is the result of the final body expression and has type `A`.
* `(err index)` if an allowance was violated, where `index` is the 0-based index of the first violated allowance in the list of granted allowances, or `u128` if an asset with no allowance caused the violation.

**Example**:

```
(define-public (foo)
  (as-contract? ()
    (try! (stx-transfer? u1000000 tx-sender recipient))
  )
) ;; Returns (err u128)
(define-public (bar)
  (as-contract? ((with-stx u1000000))
    (try! (stx-transfer? u1000000 tx-sender recipient))
  )
) ;; Returns (ok true)
```

***

## as-max-len?

Introduced in: **Clarity 1**

**input:** `sequence_A, uint`\
**output:** `(optional sequence_A)`\
**signature:** `(as-max-len? sequence max_length)`\
**cost:** `475` runtime (static)

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
**signature:** `(asserts! bool-expr thrown-value)`\
**cost:** `128` runtime (static)

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
**signature:** `(at-block id-block-hash expr)`\
**cost:** `1327` runtime + 1 read (static)

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
**signature:** `(begin expr1 expr2 expr3 ... expr-last)`\
**cost:** `151` runtime (static)

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
**signature:** `(bit-and i1 i2...)`\
**cost:** `15n + 129` runtime (where n = number of arguments)

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
**signature:** `(bit-not i1)`\
**cost:** `147` runtime (static)

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
**signature:** `(bit-or i1 i2...)`\
**cost:** `15n + 129` runtime (where n = number of arguments)

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
**signature:** `(bit-shift-left i1 shamt)`\
**cost:** `167` runtime (static)

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
**signature:** `(bit-shift-right i1 shamt)`\
**cost:** `167` runtime (static)

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
**signature:** `(bit-xor i1 i2...)`\
**cost:** `15n + 129` runtime (where n = number of arguments)

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
**signature:** `(buff-to-int-be (buff 16))`\
**cost:** `141` runtime (static)

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
**signature:** `(buff-to-int-le (buff 16))`\
**cost:** `141` runtime (static)

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
**signature:** `(buff-to-uint-be (buff 16))`\
**cost:** `141` runtime (static)

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
**signature:** `(buff-to-uint-le (buff 16))`\
**cost:** `141` runtime (static)

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
**signature:** `(concat sequence1 sequence2)`\
**cost:** `37n + 220` runtime (where n = total sequence length: elements for lists, bytes for buffers/strings)

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
**signature:** `(contract-call? .contract-name function-name arg0 arg1 ...)`\
**cost:** `134` runtime (static, plus callee costs)

**description:**\
Executes a public function on another contract (not the current contract). If that function returns `err`, any DB changes resulting from the call are aborted; if `ok`, DB changes occurred.

**example:**

```clojure
;; instantiate the sample-contracts/tokens.clar contract first
(as-contract (contract-call? .tokens mint! u19)) ;; Returns (ok u19)
```

***

## contract-hash?

Introduced in: **Clarity 4**

**Input**: `principal`

**Output**: `(response (buff 32) uint)`

**Signature**: `(contract-hash? contract-principal)`

**Description**: Returns the SHA-512/256 hash of the code body of the contract principal specified as input, or an error if the principal is not a contract or the specified contract does not exist. Returns:

* `(ok 0x<hash>)`, where `<hash>` is the SHA-512/256 hash of the code body, on success
* `(err u1)` if the principal is not a contract principal
* `(err u2)` if the specified contract does not exist

**Example**:

```
(contract-hash? 'SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2) ;; Returns (ok 0x9f8104ff869aba1205cd5e15f6404dd05675f4c3fe0817c623c425588d981c2f)
```

***

## contract-of

Introduced in: **Clarity 1**

**input:** `Trait`\
**output:** `principal`\
**signature:** `(contract-of trait-reference)`\
**cost:** `13400` runtime (static)

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
**signature:** `(default-to default-value option-value)`\
**cost:** `268` runtime (static)

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
**signature:** `(element-at? sequence index)`\
**cost:** `498` runtime (static)

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
**signature:** `(err value)`\
**cost:** `199` runtime (static)

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
**signature:** `(filter func sequence)`\
**cost:** `407` runtime (static)

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
**signature:** `(fold func sequence_A initial_B)`\
**cost:** `460` runtime (static)

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
**signature:** `(from-consensus-buff? type-signature buffer)`\
**cost:** `3n×log₂(n) + 185` runtime (where n = buffer size)

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
**signature:** `(ft-burn? token-name amount sender)`\
**cost:** `549` runtime + 2 reads + 2 writes

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
**signature:** `(ft-get-balance token-name principal)`\
**cost:** `479` runtime + 1 read

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
**signature:** `(ft-get-supply token-name)`\
**cost:** `420` runtime + 1 read

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
**signature:** `(ft-mint? token-name amount recipient)`\
**cost:** `1479` runtime + 2 reads + 2 writes

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
**signature:** `(ft-transfer? token-name amount sender recipient)`\
**cost:** `549` runtime + 2 reads + 2 writes

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
**signature:** `(get key-name tuple)`\
**cost:** `4n×log₂(n) + 1736` runtime (where n = number of tuple keys)

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
**signature:** `(hash160 value)`\
**cost:** `1n + 188` runtime (where n = serialized input size in bytes)

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
**signature:** `(if bool1 expr1 expr2)`\
**cost:** `168` runtime (static)

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
**signature:** `(index-of? sequence item)`\
**cost:** `1n + 211` runtime (where n = serialized size of sequence + item in bytes)

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
**signature:** `(int-to-ascii (int|uint))`\
**cost:** `147` runtime (static)

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
**signature:** `(int-to-utf8 (int|uint))`\
**cost:** `181` runtime (static)

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
**signature:** `(is-eq v1 v2...)`\
**cost:** `7n + 151` runtime (where n = total serialized input size in bytes)

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
**signature:** `(is-standard standard-or-contract-principal)`\
**cost:** `127` runtime (static)

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
**signature:** `(keccak256 value)`\
**cost:** `1n + 127` runtime (where n = serialized input size in bytes)

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
**signature:** `(len sequence)`\
**cost:** `429` runtime (static)

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
**signature:** `(let ((name1 expr1) ...) expr-body1 ... expr-body-last)`\
**cost:** `117n + 178` runtime (where n = number of bindings)

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
**signature:** `(list expr1 expr2 expr3 ...)`\
**cost:** `14n + 164` runtime (where n = total list size in bytes)

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
**signature:** `(log2 n)`\
**cost:** `133` runtime (static)

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
**signature:** `(map func sequence_A sequence_B ...)`\
**cost:** `1198n + 3067` runtime (where n = number of arguments)

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
**signature:** `(match opt-input some-binding-name some-branch none-branch) | (match-resp input ok-binding-name ok-branch err-binding-name err-branch)`\
**cost:** `264` runtime (static)

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
**signature:** `(merge tuple { key1: val1 })`\
**cost:** `4n + 408` runtime (where n = serialized size of both input tuples in bytes)

**description:**\
Returns a new tuple combining fields (non-mutating).

**example:**

```clojure
(merge user { address: (some 'SPAXYA5X...) }) ;; Returns merged tuple
```

***

## mod

Introduced in: **Clarity 1**

**input:** `int, int | uint, uint`\
**output:** `int | uint`\
**signature:** `(mod i1 i2)`\
**cost:** `141` runtime (static)

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
**signature:** `(not b1)`\
**cost:** `138` runtime (static)

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
**signature:** `(ok value)`\
**cost:** `199` runtime (static)

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
**signature:** `(or b1 b2 ...)`\
**cost:** `3n + 120` runtime (where n = number of arguments)

**description:**\
Returns `true` if any input is `true`. Evaluated in-order and lazily (short-circuits on `true`).

**example:**

```clojure
(or true false) ;; Returns true
```

***

## pow

Introduced in: **Clarity 1**

**input:** `int, int | uint, uint`\
**output:** `int | uint`\
**signature:** `(pow i1 i2)`\
**cost:** `143` runtime (static)

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
**signature:** `(principal-of? public-key)`\
**cost:** `984` runtime (static)

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
**signature:** `(print expr)`\
**cost:** `15n + 1458` runtime (where n = output size in bytes)

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
**signature:** `(replace-at? sequence index element)`\
**cost:** `1n + 561` runtime (where n = sequence type size (max) in bytes)

**description:**\
Returns a new sequence with element at `index` replaced. Returns `none` if index out of bounds.

**example:**

```clojure
(replace-at? u"ab" u1 u"c") ;; Returns (some u"ac")
(replace-at? (list 1 2) u3 4) ;; Returns none
```

***

## restrict-assets?

Introduced in: **Clarity 4**

**Input**:

* `asset-owner`: `principal`: The principal whose assets are being protected.
* `((with-stx|with-ft|with-nft|with-stacking)*)`: The set of allowances (at most 128) to grant during the evaluation of the body expressions .
* `AnyType* A`: The Clarity expressions to be executed within the context, with the final expression returning type `A`, where `A` is not a `response`

**Output**: `(response A uint)`

**Signature**: `(restrict-assets? asset-owner ((with-stx|with-ft|with-nft|with-stacking)*) expr-body1 expr-body2 ... expr-body-last)`

**Description**: Executes the body expressions, then checks the asset outflows against the granted allowances, in declaration order. If any allowance is violated, the body expressions are reverted and an error is returned. Note that the `asset-owner` and allowance setup expressions are evaluated before executing the body expressions. The final body expression cannot return a `response` value in order to avoid returning a nested `response` value from `restrict-assets?` (nested responses are error-prone). Returns:

* `(ok x)` if the outflows are within the allowances, where `x` is the result of the final body expression and has type `A`.
* `(err index)` if an allowance was violated, where `index` is the 0-based index of the first violated allowance in the list of granted allowances, or `u128` if an asset with no allowance caused the violation.

**Example**:

```
(define-public (foo)
  (restrict-assets? tx-sender ()
    (try! (stx-transfer? u1000000 tx-sender 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM))
  )
) ;; Returns (err u128)
(define-public (bar)
  (restrict-assets? tx-sender ()
    (+ u1 u2)
  )
) ;; Returns (ok u3)
```

***

## secp256k1-recover?

Introduced in: **Clarity 1**

**input:** `(buff 32), (buff 65)`\
**output:** `(response (buff 33) uint)`\
**signature:** `(secp256k1-recover? message-hash signature)`\
**cost:** `8655` runtime (static)

**description:**\
Recovers the public key from a signature over message-hash. Returns `(err u1)` if signature doesn't match, `(err u2)` if signature invalid.

**example:** (see original)

***

## secp256k1-verify

Introduced in: **Clarity 1**

**input:** `(buff 32), (buff 64) | (buff 65), (buff 33)`\
**output:** `bool`\
**signature:** `(secp256k1-verify message-hash signature public-key)`\
**cost:** `8349` runtime (static)

**description:**\
Verifies that `signature` of `message-hash` was produced by `public-key`. Signature is 64 or 65 bytes.

**example:** (see original)

***

## secp256r1-verify

**Input**: `(buff 32), (buff 64), (buff 33)`

**Output**: `bool`

**Signature**: `(secp256r1-verify message-hash signature public-key)`

**Description**: The `secp256r1-verify` function verifies that the provided `signature` of the `message-hash` was produced by the private key corresponding to `public-key`. The `message-hash` is the SHA-256 hash of the message. The `signature` must be 64 bytes (compact signature). Returns `true` if the signature is valid for the given `public-key` and message hash, otherwise returns `false`.

**Example**:

```clojure
(secp256r1-verify 0x033510403a646d23ee4f005061c2ca6af5da7c32c83758e8e9b6ac4cc1c2153c
  0x9608dc164b76d2e19365ffa67b48981e441d323c3109718aee245d6ac8ccd21ddadadb94303c922c0d79d131ea59a0b6ba83e1157695db01189bb4b7e9f14b72 0x037a6b62e3c8b14f1b5933f5d5ab0509a8e7d95a111b8d3b264d95bfa753b00296) ;; Returns true
(secp256r1-verify 0x0000000000000000000000000000000000000000000000000000000000000000
  0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
  0x037a6b62e3c8b14f1b5933f5d5ab0509a8e7d95a111b8d3b264d95bfa753b00296) ;; Returns false
```

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
**signature:** `(slice? sequence left-position right-position)`\
**cost:** `448` runtime (static)

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
**signature:** `(some value)`\
**cost:** `199` runtime (static)

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
**signature:** `(sqrti n)`\
**cost:** `142` runtime (static)

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
**signature:** `(stx-account owner)`\
**cost:** `4654` runtime + 1 read (static)

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
**signature:** `(stx-burn? amount sender)`\
**cost:** `4640` runtime + 1 read + 1 write

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
**signature:** `(stx-get-balance owner)`\
**cost:** `4294` runtime + 1 read (static)

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
**signature:** `(stx-transfer-memo? amount sender recipient memo)`\
**cost:** `4709` runtime + 1 read + 1 write

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
**signature:** `(stx-transfer? amount sender recipient)`\
**cost:** `4640` runtime + 1 read + 1 write

**description:**\
Transfers STX (microstacks) from `sender` to `recipient`. `sender` must be current `tx-sender`. Returns `(ok true)` or errors: `(err u1)` insufficient funds, `(err u2)` same principal, `(err u3)` non-positive amount, `(err u4)` sender not tx-sender.

**example:**

```clojure
(as-contract (stx-transfer? u60 tx-sender 'SZ2J6Z...)) ;; Returns (ok true)
```

***

## to-ascii?

Introduced in: **Clarity 4**

**Input**: `int` | `uint` | `bool` | `principal` | `(buff 524284)` | `(string-utf8 262144)`

**Output**: `(response (string-ascii 1048571) uint)`

**Signature**: `(to-ascii? value)`

**Description**: Returns the `string-ascii` representation of the input value in an `ok` response on success. The only error condition is if the input type is `string-utf8` and the value contains non-ASCII characters, in which case, `(err u1)` is returned. Note that the limitation on the maximum sizes of `buff` and `string-utf8` inputs is due to the Clarity value size limit of 1MB. The `(string-utf8 262144)` is the maximum allowed size of a `string-utf8` value, and the `(buff 524284)` limit is chosen because the ASCII representation of a `buff` is `0x` followed by two ASCII characters per byte in the `buff`. This means that the ASCII representation of a `(buff 524284)` is `2 + 2 * 524284 = 1048570` characters at 1 byte each, and the remainder is required for the `response` value wrapping the `string-ascii`.

**Example**:

```clojure
(to-ascii? true) ;; Returns (ok "true")
(to-ascii? 42) ;; Returns (ok "42")
(to-ascii? 'SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF) ;; Returns (ok "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF")
(to-ascii? 0x12345678) ;; Returns (ok "0x12345678")
```

***

## to-consensus-buff?

Introduced in: **Clarity 2**

**input:** `any`\
**output:** `(optional buff)`\
**signature:** `(to-consensus-buff? value)`\
**cost:** `1n + 233` runtime (where n = serialized size in bytes)

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
**signature:** `(to-int u)`\
**cost:** `135` runtime (static)

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
**signature:** `(to-uint i)`\
**cost:** `135` runtime (static)

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
**signature:** `(try! option-input)`\
**cost:** `240` runtime (static)

**description:**\
Unpacks `(some v)` or `(ok v)` returning `v`. If input is `none` or `(err ...)`, `try!` returns the current function's `none` or `(err ...)` and exits control-flow.

**example:** (see original for longer usage)

***

## tuple

Introduced in: **Clarity 1**

**input:** `(key-name A), ...`\
**output:** `(tuple (key-name A) ...)`\
**signature:** `(tuple (key0 expr0) (key1 expr1) ...)`\
**cost:** `10n×log₂(n) + 1876` runtime (where n = number of tuple keys)

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

{% hint style="info" %}
The following 5 `with-*` functions are meant to be used inside the new `restrict-assets?` function. See the tutorial on Restricting Assets in Clarity for more info on how to use this function.
{% endhint %}

## with-all-assets-unsafe

Introduced in: **Clarity 4**

**Input**: None

**Output**: Not applicable

**Signature**: `(with-all-assets-unsafe)`

**Description**: Grants unrestricted access to all assets of the contract to the enclosing `as-contract?` expression. Note that this is not allowed in `restrict-assets?` and will trigger an analysis error, since usage there does not make sense (i.e. just remove the `restrict-assets?` instead). **Security Warning:** This should be used with extreme caution, as it effectively disables all asset protection for the contract. This dangerous allowance should only be used when the code executing within the `as-contract?` body is verified to be trusted through other means (e.g. checking traits against an allow list, passed in from a trusted caller), and even then the more restrictive allowances should be preferred when possible.

**Example**:

```clojure
(define-public (execute-trait (trusted-trait <sample-trait>))
  (begin
    (asserts! (is-eq contract-caller TRUSTED_CALLER) ERR_UNTRUSTED_CALLER)
    (as-contract? ((with-all-assets-unsafe))
      (contract-call? trusted-trait execute)
    )
  )
)
```

***

## with-ft

**Input**:

* `contract-id`: `principal`: The contract defining the FT asset.
* `token-name`: `(string-ascii 128)`: The name of the FT or `"*"` for any FT defined in `contract-id`.
* `amount`: `uint`: The amount of FT to grant access to.

**Output**: Not applicable

**Signature**: `(with-ft contract-id token-name amount)`

**Description**: Adds an outflow allowance for `amount` of the fungible token defined in `contract-id` with name `token-name` from the `asset-owner` of the enclosing `restrict-assets?` or `as-contract?` expression. Note that `token-name` should match the name used in the `define-fungible-token` call in the contract. When `"*"` is used for the token name, the allowance applies to **all** FTs defined in `contract-id`.

**Example**:

```clojure
(restrict-assets? tx-sender
  ((with-ft (contract-of token-trait) "stackaroo" u50))
  (try! (contract-call? token-trait transfer u100 tx-sender 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM none))
) ;; Returns (err u0)
(restrict-assets? tx-sender
  ((with-ft (contract-of token-trait) "stackaroo" u50))
  (try! (contract-call? token-trait transfer u20 tx-sender 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM none))
) ;; Returns (ok true)
```

***

## with-nft

**Input**:

* `contract-id`: `principal`: The contract defining the NFT asset.
* `token-name`: `(string-ascii 128)`: The name of the NFT or `"*"` for any NFT defined in `contract-id`.
* `identifiers`: `(list 128 T)`: The identifiers of the token to grant access to.

**Output**: Not applicable

**Signature**: `(with-nft contract-id token-name identifiers)`

**Description**: Adds an outflow allowance for the non-fungible token(s) identified by `identifiers` defined in `contract-id` with name `token-name` from the `asset-owner` of the enclosing `restrict-assets?` or `as-contract?` expression. Note that `token-name` should match the name used in the `define-non-fungible-token` call in the contract. When `"*"` is used for the token name, the allowance applies to **all** NFTs defined in `contract-id`.

**Example**:

```clojure
(restrict-assets? tx-sender
  ((with-nft (contract-of nft-trait) "stackaroo" (list u123)))
  (try! (contract-call? nft-trait transfer u4 tx-sender 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM))
) ;; Returns (err u0)
(restrict-assets? tx-sender
  ((with-nft (contract-of nft-trait) "stackaroo" (list u123)))
  (try! (contract-call? nft-trait transfer u123 tx-sender 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM))
) ;; Returns (ok true)
```

***

## with-stacking

**Input**:

* `amount`: `uint`: The amount of uSTX that can be locked.

**Output**: Not applicable

**Signature**: `(with-stacking amount)`

**Description**: Adds a stacking allowance for `amount` uSTX from the `asset-owner` of the enclosing `restrict-assets?` or `as-contract?` expression. This restricts calls to the active PoX contract that either delegate funds for stacking or stack directly, ensuring that the locked amount is limited by the amount of uSTX specified.

**Example**:

```clojure
(restrict-assets? tx-sender
  ((with-stacking u1000000000000))
  (try! (contract-call? 'SP000000000000000000002Q6VF78.pox-4 delegate-stx
    u1100000000000 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM none none
  ))
) ;; Returns (err u0)
(restrict-assets? tx-sender
  ((with-stacking u1000000000000))
  (try! (contract-call? 'SP000000000000000000002Q6VF78.pox-4 delegate-stx
    u900000000000 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM none none
  ))
) ;; Returns (ok true)
```

***

## with-stx

**Input**:

* `amount`: `uint`: The amount of uSTX to grant access to.

**Output**: Not applicable

**Signature**: `(with-stx amount)`

**Description**: Adds an outflow allowance for `amount` uSTX from the `asset-owner` of the enclosing `restrict-assets?` or `as-contract?` expression.

**Example**:

```
(restrict-assets? tx-sender
  ((with-stx u1000000))
  (try! (stx-transfer? u2000000 tx-sender 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM))
) ;; Returns (err u0)
(restrict-assets? tx-sender
  ((with-stx u1000000))
  (try! (stx-transfer? u1000000 tx-sender 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM))
) ;; Returns (ok true)
```

***

## xor

Introduced in: **Clarity 1**

**input:** `int, int | uint, uint`\
**output:** `int | uint`\
**signature:** `(xor i1 i2)`\
**cost:** `15n + 129` runtime (where n = number of arguments)

**description:**\
Bitwise exclusive OR of `i1` and `i2`.

**example:**

```clojure
(xor 1 2) ;; Returns 3
```
