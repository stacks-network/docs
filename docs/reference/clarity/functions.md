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

```clarity
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
The `as-max-len?` function takes a sequence argument and a uint-valued, literal length argument. The function returns an optional type. If the input sequence length is less than or equal to the supplied max\_length, this returns `(some sequence)`, otherwise it returns `none`. Applicable sequence types are `(list A)`, `buff`, `string-ascii` and `string-utf8`.

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
The `asserts!` function admits a boolean argument and asserts its evaluation: if bool-expr is `true`, `asserts!` returns `true` and proceeds in the program execution. If the supplied argument is returning a false value, `asserts!` _returns_ `thrown-value` and exits the current control-flow.

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
The `at-block` function evaluates the expression `expr` _as if_ it were evaluated at the end of the block indicated by the _block-hash_ argument. The `expr` closure must be read-only.

Note: The block identifying hash must be a hash returned by the `id-header-hash` block information property. This hash uniquely identifies Stacks blocks and is unique across Stacks forks. While the hash returned by `header-hash` is unique within the context of a single fork, it is not unique across Stacks forks.

The function returns the result of evaluating `expr`.

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
Shifts all the bits in `i1` to the left by the number of places specified in `shamt` modulo 128 (the bit width of Clarity integers).

Note that there is a deliberate choice made to ignore arithmetic overflow for this operation. In use cases where overflow should be detected, developers should use `*`, `/`, and `pow` instead of the shift operators.

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
Shifts all the bits in `i1` to the right by the number of places specified in `shamt` modulo 128 (the bit width of Clarity integers). When `i1` is a `uint` (unsigned), new bits are filled with zeros. When `i1` is an `int` (signed), the sign is preserved, meaning that new bits are filled with the value of the previous sign-bit.

Note that there is a deliberate choice made to ignore arithmetic overflow for this operation. In use cases where overflow should be detected, developers should use `*`, `/`, and `pow` instead of the shift operators.

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
Converts a byte buffer to a signed integer use a big-endian encoding. The byte buffer can be up to 16 bytes in length. If there are fewer than 16 bytes, as this function uses a big-endian encoding, the input behaves as if it is zero-padded on the _left_.

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
Converts a byte buffer to a signed integer use a little-endian encoding. The byte buffer can be up to 16 bytes in length. If there are fewer than 16 bytes, as this function uses a little-endian encoding, the input behaves as if it is zero-padded on the _right_.

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
Converts a byte buffer to an unsigned integer use a big-endian encoding. The byte buffer can be up to 16 bytes in length. If there are fewer than 16 bytes, as this function uses a big-endian encoding, the input behaves as if it is zero-padded on the _left_.

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
Converts a byte buffer to an unsigned integer use a little-endian encoding.. The byte buffer can be up to 16 bytes in length. If there are fewer than 16 bytes, as this function uses a little-endian encoding, the input behaves as if it is zero-padded on the _right_.

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
The `contract-call?` function executes the given public function of the given contract. You _may not_ use this function to call a public function defined in the current contract. If the public function returns _err_, any database changes resulting from calling `contract-call?` are aborted. If the function returns _ok_, database changes occurred.

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

```clarity
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
The `default-to` function attempts to 'unpack' the second argument: if the argument is a `(some ...)` option, it returns the inner value of the option. If the second argument is a `(none)` value, `default-to` it returns the value of `default-value`.

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
`define-constant` is used to define a private constant value in a smart contract. The expression passed into the definition is evaluated at contract launch, in the order that it is supplied in the contract. This can lead to undefined function or undefined variable errors in the event that a function or variable used in the expression has not been defined before the constant.

Like other kinds of definition statements, `define-constant` may only be used at the top level of a smart contract definition (i.e., you cannot put a define statement in the middle of a function body).

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
`define-data-var` is used to define a new persisted variable for use in a smart contract. Such variable are only modifiable by the current smart contract.

Persisted variable are defined with a type and a value.

Like other kinds of definition statements, `define-data-var` may only be used at the top level of a smart contract definition (i.e., you cannot put a define statement in the middle of a function body).

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
`define-fungible-token` is used to define a new fungible token class for use in the current contract.

The second argument, if supplied, defines the total supply of the fungible token. This ensures that all calls to the `ft-mint?` function will never be able to create more than `total-supply` tokens. If any such call were to increase the total supply of tokens passed that amount, that invocation of `ft-mint?` will result in a runtime error and abort.

Like other kinds of definition statements, `define-fungible-token` may only be used at the top level of a smart contract definition (i.e., you cannot put a define statement in the middle of a function body).

Tokens defined using `define-fungible-token` may be used in `ft-transfer?`, `ft-mint?`, and `ft-get-balance` functions

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
`define-map` is used to define a new datamap for use in a smart contract. Such maps are only modifiable by the current smart contract.

Maps are defined with a key type and value type, often these types are tuple types.

Like other kinds of definition statements, `define-map` may only be used at the top level of a smart contract definition (i.e., you cannot put a define statement in the middle of a function body).

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
`define-non-fungible-token` is used to define a new non-fungible token class for use in the current contract. Individual assets are identified by their asset identifier, which must be of the type `asset-identifier-type`. Asset identifiers are _unique_ identifiers.

Like other kinds of definition statements, `define-non-fungible-token` may only be used at the top level of a smart contract definition (i.e., you cannot put a define statement in the middle of a function body).

Assets defined using `define-non-fungible-token` may be used in `nft-transfer?`, `nft-mint?`, and `nft-get-owner?` functions

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
`define-private` is used to define _private_ functions for a smart contract. Private functions may not be called from other smart contracts, nor may they be invoked directly by users. Instead, these functions may only be invoked by other functions defined in the same smart contract.

Like other kinds of definition statements, `define-private` may only be used at the top level of a smart contract definition (i.e., you cannot put a define statement in the middle of a function body).

Private functions may return any type.

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
`define-public` is used to define a _public_ function and transaction for a smart contract. Public functions are callable from other smart contracts and may be invoked directly by users by submitting a transaction to the Stacks blockchain.

Like other kinds of definition statements, `define-public` may only be used at the top level of a smart contract definition (i.e., you cannot put a define statement in the middle of a function body).

Public functions _must_ return a ResponseType (using either `ok` or `err`). Any datamap modifications performed by a public function is aborted if the function returns an `err` type. Public functions may be invoked by other contracts via `contract-call?`.

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
`define-read-only` is used to define a _public read-only_ function for a smart contract. Such functions are callable from other smart contracts.

Like other kinds of definition statements, `define-read-only` may only be used at the top level of a smart contract definition (i.e., you cannot put a define statement in the middle of a function body).

Read-only functions may return any type. However, read-only functions may not perform any datamap modifications, or call any functions which perform such modifications. This is enforced both during type checks and during the execution of the function. Public read-only functions may be invoked by other contracts via `contract-call?`.

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
`define-trait` is used to define a new trait definition for use in a smart contract. Other contracts can implement a given trait and then have their contract identifier being passed as a function argument in order to be called dynamically with `contract-call?`.

Traits are defined with a name, and a list functions, defined with a name, a list of argument types, and return type.

In Clarity 1, a trait type can be used to specify the type of a function parameter. A parameter with a trait type can be used as the target of a dynamic `contract-call?`. A principal literal (e.g. `ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.foo`) may be passed as a trait parameter if the specified contract implements all of the functions specified by the trait. A trait value (originating from a parameter with trait type) may also be passed as a trait parameter if the types are the same.

Beginning in Clarity 2, a trait can be used in all of the same ways that a built-in type can be used, except that it cannot be stored in a data var or map, since this would inhibit static analysis. This means that a trait type can be embedded in a compound type (e.g. `(optional <my-trait>)` or `(list 4 <my-trait>)`) and a trait value can be bound to a variable in a `let` or `match` expression. In addition to the principal literal and trait value with matching type allowed in Clarity 1, Clarity 2 also supports implicit casting from a compatible trait, meaning that a value of type `trait-a` may be passed to a parameter with type `trait-b` if `trait-a` includes all of the requirements of `trait-b` (and optionally additional functions).

Like other kinds of definition statements, `define-trait` may only be used at the top level of a smart contract definition (i.e., you cannot put a define statement in the middle of a function body).

**example:**

```clarity
(define-trait token-trait
  ((transfer? (principal principal uint) (response uint uint))
  (get-balance (principal) (response uint uint))))
```

***

## element-at?

Introduced in: **Clarity 2**

**input:** `sequence_A, uint`\
**output:** `(optional A)`\
**signature:** `(element-at? sequence index)`\
**cost:** `498` runtime (static)

**description:**\
The `element-at?` function returns the element at `index` in the provided sequence. Applicable sequence types are `(list A)`, `buff`, `string-ascii` and `string-utf8`, for which the corresponding element types are, respectively, `A`, `(buff 1)`, `(string-ascii 1)` and `(string-utf8 1)`. In Clarity1, `element-at` must be used (without the `?`). The `?` is added in Clarity2 for consistency -- built-ins that return responses or optionals end in `?`. The Clarity1 spelling is left as an alias in Clarity2 for backwards compatibility.

**example:**

```clojure
(element-at? "blockstack" u5) ;; Returns (some "s")
(element-at? (list 1 2 3 4 5) u5) ;; Returns none
(element-at? (list 1 2 3 4 5) (+ u1 u2)) ;; Returns (some 4)
(element-at? "abcd" u1) ;; Returns (some "b")
(element-at? 0xfb01 u1) ;; Returns (some 0x01)
```

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
The `filter` function applies the input function `func` to each element of the input sequence, and returns the same sequence with any elements removed for which `func` returned `false`. Applicable sequence types are `(list A)`, `buff`, `string-ascii` and `string-utf8`, for which the corresponding element types are, respectively, `A`, `(buff 1)`, `(string-ascii 1)` and `(string-utf8 1)`. The `func` argument must be a literal function name.

**example:**

```clarity
(filter not (list true false true false)) ;; Returns (false false)
(define-private (is-a (char (string-utf8 1))) 
  (is-eq char u"a"))
(filter is-a u"acabd") ;; Returns u"aa"
(define-private (is-zero (char (buff 1)))
  (is-eq char 0x00))
(filter is-zero 0x00010002) ;; Returns 0x0000
```

***

## fold

Introduced in: **Clarity 1**

**input:** `Function(A, B) -> B, sequence_A, B`\
**output:** `B`\
**signature:** `(fold func sequence_A initial_B)`\
**cost:** `460` runtime (static)

**description:**\
The `fold` function condenses `sequence_A` into a value of type `B` by recursively applies the function `func` to each element of the input sequence _and_ the output of a previous application of `func`.

`fold` uses `initial_B` in the initial application of `func`, along with the first element of `sequence_A`. The resulting value of type `B` is used for the next application of `func`, along with the next element of `sequence_A` and so on. `fold` returns the last value of type `B` returned by these successive applications `func`.

Applicable sequence types are `(list A)`, `buff`, `string-ascii` and `string-utf8`, for which the corresponding element types are, respectively, `A`, `(buff 1)`, `(string-ascii 1)` and `(string-utf8 1)`. The `func` argument must be a literal function name.

**example:**

```clarity
(fold * (list 2 2 2) 1) ;; Returns 8
(fold * (list 2 2 2) 0) ;; Returns 0
;; calculates (- 11 (- 7 (- 3 2)))
(fold - (list 3 7 11) 2) ;; Returns 5 
(define-private (concat-string (a (string-ascii 20)) (b (string-ascii 20))) 
  (unwrap-panic (as-max-len? (concat a b) u20)))
(fold concat-string "cdef" "ab")   ;; Returns "fedcab"
(fold concat-string (list "cd" "ef") "ab")   ;; Returns "efcdab"
(define-private (concat-buff (a (buff 20)) (b (buff 20)))
  (unwrap-panic (as-max-len? (concat a b) u20)))
(fold concat-buff 0x03040506 0x0102)   ;; Returns 0x060504030102
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
`from-consensus-buff?` is a special function that will deserialize a buffer into a Clarity value, using the SIP-005 serialization of the Clarity value. The type that `from-consensus-buff?` tries to deserialize into is provided by the first parameter to the function. If it fails to deserialize the type, the method returns `none`.

**example:**

```clarity
(from-consensus-buff? int 0x0000000000000000000000000000000001) ;; Returns (some 1)
(from-consensus-buff? uint 0x0000000000000000000000000000000001) ;; Returns none 
(from-consensus-buff? uint 0x0100000000000000000000000000000001) ;; Returns (some u1)
(from-consensus-buff? bool 0x0000000000000000000000000000000001) ;; Returns none
(from-consensus-buff? bool 0x03) ;; Returns (some true)
(from-consensus-buff? bool 0x04) ;; Returns (some false)
(from-consensus-buff? principal 0x051fa46ff88886c2ef9762d970b4d2c63678835bd39d) ;; Returns (some SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR)
(from-consensus-buff? { abc: int, def: int } 0x0c00000002036162630000000000000000000000000000000003036465660000000000000000000000000000000004) ;; Returns (some (tuple (abc 3) (def 4)))
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
In Clarity 3, `get-block-info?` is removed. In its place, `get-stacks-block-info?` can be used to retrieve information about a Stacks block and `get-tenure-info?` can be used to get information pertaining to the tenure. The `get-block-info?` function fetches data for a block of the given _Stacks_ block height. The value and type returned are determined by the specified `BlockInfoPropertyName`. If the provided `block-height` does not correspond to an existing block prior to the current block, the function returns `none`. The currently available property names are as follows:

* `burnchain-header-hash`: This property returns a `(buff 32)` value containing the header hash of the burnchain (Bitcoin) block that selected the Stacks block at the given Stacks chain height.
* `id-header-hash`: This property returns a `(buff 32)` value containing the _index block hash_ of a Stacks block. This hash is globally unique, and is derived from the block hash and the history of accepted PoX operations. This is also the block hash value you would pass into `(at-block)`.
* `header-hash`: This property returns a `(buff 32)` value containing the header hash of a Stacks block, given a Stacks chain height. \*_WARNING_ this hash is not guaranteed to be globally unique, since the same Stacks block can be mined in different PoX forks. If you need global uniqueness, you should use `id-header-hash`.
* `miner-address`: This property returns a `principal` value corresponding to the miner of the given block. **WARNING** In Stacks 2.1, this is not guaranteed to be the same `principal` that received the block reward, since Stacks 2.1 supports coinbase transactions that pay the reward to a contract address. This is merely the address of the `principal` that produced the block.
* `time`: This property returns a `uint` value of the block header time field. This is a Unix epoch timestamp in seconds which roughly corresponds to when the block was mined. This timestamp comes from the burnchain block. **Note**: this does not increase monotonically with each block and block times are accurate only to within two hours. See [BIP113](https://github.com/bitcoin/bips/blob/master/bip-0113.mediawiki) for more information. For blocks mined after epoch 3.0, all Stacks blocks in one tenure will share the same timestamp. To get the Stacks block time for a block in epoch 3.0+, use `get-stacks-block-info?`.
* `vrf-seed`: This property returns a `(buff 32)` value of the VRF seed for the corresponding block.
* `block-reward`: This property returns a `uint` value for the total block reward of the indicated Stacks block. This value is only available once the reward for the block matures. That is, the latest `block-reward` value available is at least 101 Stacks blocks in the past (on mainnet). The reward includes the coinbase, the anchored block's transaction fees, and the shares of the confirmed and produced microblock transaction fees earned by this block's miner. Note that this value may be smaller than the Stacks coinbase at this height, because the miner may have been punished with a valid `PoisonMicroblock` transaction in the event that the miner published two or more microblock stream forks. Added in Clarity 2.
* `miner-spend-total`: This property returns a `uint` value for the total number of burnchain tokens (i.e. satoshis) spent by all miners trying to win this block. Added in Clarity 2.
* `miner-spend-winner`: This property returns a `uint` value for the number of burnchain tokens (i.e. satoshis) spent by the winning miner for this Stacks block. Note that this value is less than or equal to the value for `miner-spend-total` at the same block height. Added in Clarity 2.

**example:**

```clarity
(get-block-info? time u0) ;; Returns (some u1557860301) 
(get-block-info? header-hash u0) ;; Returns (some 0x374708fff7719dd5979ec875d56cd2286f6d3cf7ec317a3b25632aab28ec37bb)
(get-block-info? vrf-seed u0) ;; Returns (some 0xf490de2920c8a35fabeb13208852aa28c76f9be9b03a4dd2b3c075f7a26923b4)
```

***

## get-burn-block-info?

Introduced in: **Clarity 2**

**input:** `BurnBlockInfoPropertyName, uint`\
**output:** `(optional buff) | (optional (tuple ...))`\
**signature:** `(get-burn-block-info? prop-name block-height)`

**description:**\
The `get-burn-block-info?` function fetches data for a block of the given _burnchain_ block height. The value and type returned are determined by the specified `BlockInfoPropertyName`. Valid values for `block-height` only include heights between the burnchain height at the time the Stacks chain was launched, and the last-processed burnchain block. If the `block-height` argument falls outside of this range, then `none` shall be returned.

The following `BlockInfoPropertyName` values are defined:

* The `header-hash` property returns a 32-byte buffer representing the header hash of the burnchain block at burnchain height `block-height`.
* The `pox-addrs` property returns a tuple with two items: a list of up to two PoX addresses that received a PoX payout at that block height, and the amount of burnchain tokens paid to each address (note that per the blockchain consensus rules, each PoX payout will be the same for each address in the block-commit transaction). The list will include burn addresses -- that is, the unspendable addresses that miners pay to when there are no PoX addresses left to be paid. During the prepare phase, there will be exactly one burn address reported. During the reward phase, up to two burn addresses may be reported in the event that some PoX reward slots are not claimed.

The `addrs` list contains the same PoX address values passed into the PoX smart contract:

* They each have type signature `(tuple (hashbytes (buff 32)) (version (buff 1)))`
* The `version` field can be any of the following:
  * `0x00` means this is a p2pkh address, and `hashbytes` is the 20-byte hash160 of a single public key
  * `0x01` means this is a p2sh address, and `hashbytes` is the 20-byte hash160 of a redeemScript script
  * `0x02` means this is a p2wpkh-p2sh address, and `hashbytes` is the 20-byte hash160 of a p2wpkh witness script
  * `0x03` means this is a p2wsh-p2sh address, and `hashbytes` is the 20-byte hash160 of a p2wsh witness script
  * `0x04` means this is a p2wpkh address, and `hashbytes` is the 20-byte hash160 of the witness script
  * `0x05` means this is a p2wsh address, and `hashbytes` is the 32-byte sha256 of the witness script
  * `0x06` means this is a p2tr address, and `hashbytes` is the 32-byte sha256 of the witness script

**example:**

```clarity
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
The `get-stacks-block-info?` function fetches data for a block of the given _Stacks_ block height. The value and type returned are determined by the specified `StacksBlockInfoPropertyName`. If the provided `stacks-block-height` does not correspond to an existing block prior to the current block, the function returns `none`. The currently available property names are as follows:

* `id-header-hash`: This property returns a `(buff 32)` value containing the _index block hash_ of a Stacks block. This hash is globally unique, and is derived from the block hash and the history of accepted PoX operations. This is also the block hash value you would pass into `(at-block)`.
* `header-hash`: This property returns a `(buff 32)` value containing the header hash of a Stacks block, given a Stacks chain height. **WARNING** this hash is not guaranteed to be globally unique, since the same Stacks block can be mined in different PoX forks. If you need global uniqueness, you should use `id-header-hash`.
* `time`: This property returns a `uint` value of the block header time field. This is a Unix epoch timestamp in seconds which roughly corresponds to when the block was mined. For a block mined before epoch 3.0, this timestamp comes from the burnchain block. **Note**: this does not increase monotonically with each block and block times are accurate only to within two hours. See [BIP113](https://github.com/bitcoin/bips/blob/master/bip-0113.mediawiki) for more information. For a block mined after epoch 3.0, this timestamp comes from the Stacks block header. **Note**: this is the time, according to the miner, when the mining of this block started, but is not guaranteed to be accurate. This time will be validated by the signers to be:
* Greater than the timestamp of the previous block
* At most 15 seconds into the future (according to their own local clocks)

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
The `get-tenure-info?` function fetches data for the tenure at the given block height. The value and type returned are determined by the specified `TenureInfoPropertyName`. If the provided `stacks-block-height` does not correspond to an existing block prior to the current block, the function returns `none`. The currently available property names are as follows:

* `burnchain-header-hash`: This property returns a `(buff 32)` value containing the header hash of the burnchain (Bitcoin) block that selected the tenure at the given height.
* `miner-address`: This property returns a `principal` value corresponding to the miner of the given tenure. **WARNING** This is not guaranteed to be the same `principal` that received the block reward, since Stacks 2.1+ supports coinbase transactions that pay the reward to a contract address. This is merely the address of the `principal` that produced the tenure.
* `time`: This property returns a `uint` Unix epoch timestamp in seconds which roughly corresponds to when the tenure was started. This timestamp comes from the burnchain block. **Note**: this does not increase monotonically with each tenure and tenure times are accurate only to within two hours. See [BIP113](https://github.com/bitcoin/bips/blob/master/bip-0113.mediawiki) for more information.
* `vrf-seed`: This property returns a `(buff 32)` value of the VRF seed for the corresponding tenure.
* `block-reward`: This property returns a `uint` value for the total block reward of the indicated tenure. This value is only available once the reward for the tenure matures. That is, the latest `block-reward` value available is at least 101 Stacks blocks in the past (on mainnet). The reward includes the coinbase, the anchored tenure's transaction fees, and the shares of the confirmed and produced microblock transaction fees earned by this block's miner. Note that this value may be smaller than the Stacks coinbase at this height, because the miner may have been punished with a valid `PoisonMicroblock` transaction in the event that the miner published two or more microblock stream forks.
* `miner-spend-total`: This property returns a `uint` value for the total number of burnchain tokens (i.e. satoshis) spent by all miners trying to win this tenure.
* `miner-spend-winner`: This property returns a `uint` value for the number of burnchain tokens (i.e. satoshis) spent by the winning miner for this tennure. Note that this value is less than or equal to the value for `miner-spend-total` at the same tenure height.

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

## index-of?

Introduced in: **Clarity 2**

**input:** `sequence_A, A`\
**output:** `(optional uint)`\
**signature:** `(index-of? sequence item)`\
**cost:** `1n + 211` runtime (where n = serialized size of sequence + item in bytes)

**description:**\
Returns first index of `item` in sequence using `is-eq`. Returns `none` if not found or if empty string/buffer. In Clarity 1, `index-of` must be used (without the `?`). The `?` is added in Clarity 2 for consistency -- built-ins that return responses or optionals end in `?`. The Clarity 1 spelling is left as an alias in Clarity 2 for backwards compatibility.

**example:**

```clojure
(index-of? "blockstack" "b") ;; Returns (some u0)
(index-of? "blockstack" "k") ;; Returns (some u4)
(index-of? "blockstack" "") ;; Returns none
(index-of? (list 1 2 3 4 5) 6) ;; Returns none
(index-of? 0xfb01 0x01) ;; Returns (some u1)
```

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

## map-delete​

Introduced in: **Clarity 1**

**input:** `MapName, tuple`

**output:** `bool`

**signature:** `(map-delete map-name key-tuple)`

**description:**

The `map-delete` function removes the value associated with the input key for the given map. If an item exists and is removed, the function returns `true`. If a value did not exist for this key in the data map, the function returns `false`.

**example:**

```clarity
(define-map names-map { name: (string-ascii 10) } { id: int })
(map-insert names-map { name: "blockstack" } { id: 1337 }) ;; Returns true
(map-delete names-map { name: "blockstack" }) ;; Returns true
(map-delete names-map { name: "blockstack" }) ;; Returns false
(map-delete names-map (tuple (name "blockstack"))) ;; Same command, using a shorthand for constructing the tuple
```

***

## map-get?​

Introduced in: **Clarity 1**

**input:** `MapName, tuple`

**output:** `(optional (tuple))`

**signature:** `(map-get? map-name key-tuple)`

**description:**

The `map-get?` function looks up and returns an entry from a contract's data map. The value is looked up using `key-tuple`. If there is no value associated with that key in the data map, the function returns a `none` option. Otherwise, it returns `(some value)`.

**example:**

```clarity
(define-map names-map { name: (string-ascii 10) } { id: int })
(map-set names-map { name: "blockstack" } { id: 1337 })
(map-get? names-map (tuple (name "blockstack"))) ;; Returns (some (tuple (id 1337)))
(map-get? names-map { name: "blockstack" }) ;; Same command, using a shorthand for constructing the tuple
```

***

## map-insert​

Introduced in: **Clarity 1**

**input:** `MapName, tuple_A, tuple_B`

**output:** `bool`

**signature:** `(map-insert map-name key-tuple value-tuple)`

**description:**

The `map-insert` function sets the value associated with the input key to the inputted value if and only if there is not already a value associated with the key in the map. If an insert occurs, the function returns `true`. If a value already existed for this key in the data map, the function returns `false`.

Note: the `value-tuple` requires 1 additional byte for storage in the materialized blockchain state, and therefore the maximum size of a value that may be inserted into a map is MAX\_CLARITY\_VALUE - 1.

**example:**

```clarity
(define-map names-map { name: (string-ascii 10) } { id: int })
(map-insert names-map { name: "blockstack" } { id: 1337 }) ;; Returns true
(map-insert names-map { name: "blockstack" } { id: 1337 }) ;; Returns false
(map-insert names-map (tuple (name "blockstack")) (tuple (id 1337))) ;; Same command, using a shorthand for constructing the tuple
```

***

## map-set​

Introduced in: **Clarity 1**

**input:** `MapName, tuple_A, tuple_B`

**output:** `bool`

**signature:** `(map-set map-name key-tuple value-tuple)`

**description:**

The `map-set` function sets the value associated with the input key to the inputted value. This function performs a _blind_ update; whether or not a value is already associated with the key, the function overwrites that existing association.

Note: the `value-tuple` requires 1 additional byte for storage in the materialized blockchain state, and therefore the maximum size of a value that may be inserted into a map is MAX\_CLARITY\_VALUE - 1.

**example:**

```clarity
(define-map names-map { name: (string-ascii 10) } { id: int })
(map-set names-map { name: "blockstack" } { id: 1337 }) ;; Returns true
(map-set names-map (tuple (name "blockstack")) (tuple (id 1337))) ;; Same command, using a shorthand for constructing the tuple
```

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

## nft-burn?​

Introduced in: **Clarity 1**

**input:** `AssetName, A, principal`

**output:** `(response bool uint)`

**signature:** `(nft-burn? asset-class asset-identifier sender)`

**description:**

`nft-burn?` is used to burn an asset that the `sender` principal owns. The asset must have been defined using `define-non-fungible-token`, and the supplied `asset-identifier` must be of the same type specified in that definition.

On a successful burn, it returns `(ok true)`. In the event of an unsuccessful burn it returns one of the following error codes:

`(err u1)` -- `sender` does not own the specified asset `(err u3)` -- the asset specified by `asset-identifier` does not exist

**example:**

```clarity
(define-non-fungible-token stackaroo (string-ascii 40))
(nft-mint? stackaroo "Roo" 'SPAXYA5XS51713FDTQ8H94EJ4V579CXMTRNBZKSF) ;; Returns (ok true)
(nft-burn? stackaroo "Roo" 'SPAXYA5XS51713FDTQ8H94EJ4V579CXMTRNBZKSF) ;; Returns (ok true)
```

***

## nft-get-owner?​

Introduced in: **Clarity 1**

**input:** `AssetName, A`

**output:** `(optional principal)`

**signature:** `(nft-get-owner? asset-class asset-identifier)`

**description:**

`nft-get-owner?` returns the owner of an asset, identified by `asset-identifier`, or `none` if the asset does not exist. The asset type must have been defined using `define-non-fungible-token`, and the supplied `asset-identifier` must be of the same type specified in that definition.

**example:**

```clarity
(define-non-fungible-token stackaroo (string-ascii 40))
(nft-mint? stackaroo "Roo" 'SPAXYA5XS51713FDTQ8H94EJ4V579CXMTRNBZKSF)
(nft-get-owner? stackaroo "Roo") ;; Returns (some SPAXYA5XS51713FDTQ8H94EJ4V579CXMTRNBZKSF)
(nft-get-owner? stackaroo "Too") ;; Returns none
```

***

## nft-mint?​

Introduced in: **Clarity 1**

**input:** `AssetName, A, principal`

**output:** `(response bool uint)`

**signature:** `(nft-mint? asset-class asset-identifier recipient)`

**description:**

`nft-mint?` is used to instantiate an asset and set that asset's owner to the `recipient` principal. The asset must have been defined using `define-non-fungible-token`, and the supplied `asset-identifier` must be of the same type specified in that definition.

If an asset identified by `asset-identifier` _already exists_, this function will return an error with the following error code:

`(err u1)`

Otherwise, on successfuly mint, it returns `(ok true)`.

**example:**

```clarity
(define-non-fungible-token stackaroo (string-ascii 40))
(nft-mint? stackaroo "Roo" 'SPAXYA5XS51713FDTQ8H94EJ4V579CXMTRNBZKSF) ;; Returns (ok true)
```

***

## nft-transfer?​

Introduced in: **Clarity 1**

**input:** `AssetName, A, principal, principal`

**output:** `(response bool uint)`

**signature:** `(nft-transfer? asset-class asset-identifier sender recipient)`

**description:**

`nft-transfer?` is used to change the owner of an asset identified by `asset-identifier` from `sender` to `recipient`. The `asset-class` must have been defined by `define-non-fungible-token` and `asset-identifier` must be of the type specified in that definition. In contrast to `stx-transfer?`, any user can transfer the asset. When used, relevant guards need to be added.

This function returns (ok true) if the transfer is successful. In the event of an unsuccessful transfer it returns one of the following error codes:

`(err u1)` -- `sender` does not own the asset `(err u2)` -- `sender` and `recipient` are the same principal `(err u3)` -- asset identified by asset-identifier does not exist

**example:**

```clarity
(define-non-fungible-token stackaroo (string-ascii 40))
(nft-mint? stackaroo "Roo" 'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR)
(nft-transfer? stackaroo "Roo" 'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR 'SPAXYA5XS51713FDTQ8H94EJ4V579CXMTRNBZKSF) ;; Returns (ok true)
(nft-transfer? stackaroo "Roo" 'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR 'SPAXYA5XS51713FDTQ8H94EJ4V579CXMTRNBZKSF) ;; Returns (err u1)
(nft-transfer? stackaroo "Stacka" 'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR 'SPAXYA5XS51713FDTQ8H94EJ4V579CXMTRNBZKSF) ;; Returns (err u3)
```

***

## not

Introduced in: **Clarity 1**

**input:** `bool`\
**output:** `bool`\
**signature:** `(not b1)`\
**cost:** `138` runtime (static)

**description:**\
Returns the inverse of the boolean input.

**example:**

```clojure
(not true) ;; Returns false
(not (is-eq 1 2)) ;; Returns true
```

***

## ok

Introduced in: **Clarity 1**

**input:** `A`\
**output:** `(response A B)`\
**signature:** `(ok value)`\
**cost:** `199` runtime (static)

**description:**\
The `ok` function constructs a response type from the input value. Use `ok` for creating return values in public functions. An _ok_ value indicates that any database changes during the processing of the function should materialize.

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
Returns `true` if any boolean inputs are `true`. Importantly, the supplied arguments are evaluated in-order and lazily. Lazy evaluation means that if one of the arguments returns `true`, the function short-circuits, and no subsequent arguments are evaluated.

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
Returns the result of raising `i1` to the power of `i2`. In the event of an _overflow_, throws a runtime error. Note: Corner cases are handled with the following rules:

* if both `i1` and `i2` are `0`, return `1`
* if `i1` is `1`, return `1`
* if `i1` is `0`, return `0`
* if `i2` is negative or greater than `u32::MAX`, throw a runtime error

**example:**

```clojure
(pow 2 3) ;; Returns 8
(pow 2 2) ;; Returns 4
(pow 7 1) ;; Returns 7
```

***

## principal-construct?

Introduced in: **Clarity 2**

**input:** `(buff 1), (buff 20), [(string-ascii 40)]`\
**output:** `(response principal { error_code: uint, principal: (option principal) })`\
**signature:** `(principal-construct? (buff 1) (buff 20) [(string-ascii 40)])`

**description:**\
A principal value represents either a set of keys, or a smart contract. The former, called a _standard principal_, is encoded as a `(buff 1)` _version byte_, indicating the type of account and the type of network that this principal can spend tokens on, and a `(buff 20)` _public key hash_, characterizing the principal's unique identity. The latter, a _contract principal_, is encoded as a standard principal concatenated with a `(string-ascii 40)` _contract name_ that identifies the code body.

The `principal-construct?` function allows users to create either standard or contract principals, depending on which form is used. To create a standard principal, `principal-construct?` would be called with two arguments: it takes as input a `(buff 1)` which encodes the principal address's `version-byte`, a `(buff 20)` which encodes the principal address's `hash-bytes`. To create a contract principal, `principal-construct?` would be called with three arguments: the `(buff 1)` and `(buff 20)` to represent the standard principal that created the contract, and a `(string-ascii 40)` which encodes the contract's name. On success, this function returns either a standard principal or contract principal, depending on whether or not the third `(string-ascii 40)` argument is given.

This function returns a `Response`. On success, the `ok` value is a `Principal`. The `err` value is a value tuple with the form `{ error_code: uint, value: (optional principal) }`.

If the single-byte `version-byte` is in the valid range `0x00` to `0x1f`, but is not an appropriate version byte for the current network, then the error will be `u0`, and `value` will contain `(some principal)`, where the wrapped value is the principal. If the `version-byte` is not in this range, however, then the `value` will be `none`.

If the `version-byte` is a `buff` of length 0, if the single-byte `version-byte` is a value greater than `0x1f`, or the `hash-bytes` is a `buff` of length not equal to 20, then `error_code` will be `u1` and `value` will be `None`.

If a name is given, and the name is either an empty string or contains ASCII characters that are not allowed in contract names, then `error_code` will be `u2`.

Note: This function is only available starting with Stacks 2.1.

**example:**

```clarity
(principal-construct? 0x1a 0xfa6bf38ed557fe417333710d6033e9419391a320) ;; Returns (ok ST3X6QWWETNBZWGBK6DRGTR1KX50S74D3425Q1TPK)
(principal-construct? 0x1a 0xfa6bf38ed557fe417333710d6033e9419391a320 "foo") ;; Returns (ok ST3X6QWWETNBZWGBK6DRGTR1KX50S74D3425Q1TPK.foo)
(principal-construct? 0x16 0xfa6bf38ed557fe417333710d6033e9419391a320) ;; Returns (err (tuple (error_code u0) (value (some SP3X6QWWETNBZWGBK6DRGTR1KX50S74D3433WDGJY))))
(principal-construct? 0x16 0xfa6bf38ed557fe417333710d6033e9419391a320 "foo") ;; Returns (err (tuple (error_code u0) (value (some SP3X6QWWETNBZWGBK6DRGTR1KX50S74D3433WDGJY.foo))))
(principal-construct? 0x   0xfa6bf38ed557fe417333710d6033e9419391a320) ;; Returns (err (tuple (error_code u1) (value none)))
(principal-construct? 0x16 0xfa6bf38ed557fe417333710d6033e9419391a3)   ;; Returns (err (tuple (error_code u1) (value none)))
(principal-construct? 0x20 0xfa6bf38ed557fe417333710d6033e9419391a320) ;; Returns (err (tuple (error_code u1) (value none)))
(principal-construct? 0x1a 0xfa6bf38ed557fe417333710d6033e9419391a320 "") ;; Returns (err (tuple (error_code u2) (value none)))
(principal-construct? 0x1a 0xfa6bf38ed557fe417333710d6033e9419391a320 "foo[") ;; Returns (err (tuple (error_code u2) (value none)))
```

***

## principal-destruct?

Introduced in: **Clarity 2**

**input:** `principal`\
**output:** `(response (tuple ...) (tuple ...))`\
**signature:** `(principal-destruct? principal-address)`

**description:**\
A principal value represents either a set of keys, or a smart contract. The former, called a _standard principal_, is encoded as a `(buff 1)` _version byte_, indicating the type of account and the type of network that this principal can spend tokens on, and a `(buff 20)` _public key hash_, characterizing the principal's unique identity. The latter, a _contract principal_, is encoded as a standard principal concatenated with a `(string-ascii 40)` _contract name_ that identifies the code body.

`principal-destruct?` will decompose a principal into its component parts: either`{version-byte, hash-bytes}` for standard principals, or `{version-byte, hash-bytes, name}` for contract principals.

This method returns a `Response` that wraps this data as a tuple.

If the version byte of `principal-address` matches the network (see `is-standard`), then this method returns the pair as its `ok` value.

If the version byte of `principal-address` does not match the network, then this method returns the pair as its `err` value.

In both cases, the value itself is a tuple containing three fields: a `version` value as a `(buff 1)`, a `hash-bytes` value as a `(buff 20)`, and a `name` value as an `(optional (string-ascii 40))`. The `name` field will only be `(some ..)` if the principal is a contract principal.

Note: This function is only available starting with Stacks 2.1.

**example:**

```clarity
(principal-destruct? 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6) ;; Returns (ok (tuple (hash-bytes 0x164247d6f2b425ac5771423ae6c80c754f7172b0) (name none) (version 0x1a)))
(principal-destruct? 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6.foo) ;; Returns (ok (tuple (hash-bytes 0x164247d6f2b425ac5771423ae6c80c754f7172b0) (name (some "foo")) (version 0x1a)))
(principal-destruct? 'SP3X6QWWETNBZWGBK6DRGTR1KX50S74D3433WDGJY) ;; Returns (err (tuple (hash-bytes 0xfa6bf38ed557fe417333710d6033e9419391a320) (name none) (version 0x16)))
(principal-destruct? 'SP3X6QWWETNBZWGBK6DRGTR1KX50S74D3433WDGJY.foo) ;; Returns (err (tuple (hash-bytes 0xfa6bf38ed557fe417333710d6033e9419391a320) (name (some "foo")) (version 0x16)))
```

***

## principal-of?

Introduced in: **Clarity 1**

**input:** `(buff 33)`\
**output:** `(response principal uint)`\
**signature:** `(principal-of? public-key)`\
**cost:** `984` runtime (static)

**description:**\
The `principal-of?` function returns the principal derived from the provided public key. If the `public-key` is invalid, it will return the error code `(err u1).`.

Note: Before Stacks 2.1, this function has a bug, in that the principal returned would always be a testnet single-signature principal, even if the function were run on the mainnet. Starting with Stacks 2.1, this bug is fixed, so that this function will return a principal suited to the network it is called on. In particular, if this is called on the mainnet, it will return a single-signature mainnet principal.

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
The `print` function evaluates and returns its input expression. On Stacks Core nodes configured for development (as opposed to production mining nodes), this function prints the resulting value to `STDOUT` (standard output).

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
The `replace-at?` function takes in a sequence, an index, and an element, and returns a new sequence with the data at the index position replaced with the given element. The given element's type must match the type of the sequence, and must correspond to a single index of the input sequence. The return type on success is the same type as the input sequence.

If the provided index is out of bounds, this functions returns `none`.

**example:**

```clojure
(replace-at? u"ab" u1 u"c") ;; Returns (some u"ac")
(replace-at? 0x00112233 u2 0x44) ;; Returns (some 0x00114433)
(replace-at? "abcd" u3 "e") ;; Returns (some "abce")
(replace-at? (list 1) u0 10) ;; Returns (some (10))
(replace-at? (list (list 1) (list 2)) u0 (list 33)) ;; Returns (some ( (33) (2)))
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

```clarity
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
The `secp256k1-recover?` function recovers the public key used to sign the message which sha256 is `message-hash` with the provided `signature`. If the signature does not match, it will return the error code `(err u1).`. If the signature is invalid, it will return the error code `(err u2).`. The signature includes 64 bytes plus an additional recovery id (00..03) for a total of 65 bytes.

**example:**

```clarity
(secp256k1-recover? 0xde5b9eb9e7c5592930eb2e30a01369c36586d872082ed8181ee83d2a0ec20f04 0x8738487ebe69b93d8e51583be8eee50bb4213fc49c767d329632730cc193b873554428fc936ca3569afc15f1c9365f6591d6251a89fee9c9ac661116824d3a1301) ;; Returns (ok 0x03adb8de4bfb65db2cfd6120d55c6526ae9c52e675db7e47308636534ba7786110)
```

***

## secp256k1-verify

Introduced in: **Clarity 1**

**input:** `(buff 32), (buff 64) | (buff 65), (buff 33)`\
**output:** `bool`\
**signature:** `(secp256k1-verify message-hash signature public-key)`\
**cost:** `8349` runtime (static)

**description:**\
The `secp256k1-verify` function verifies that the provided signature of the message-hash was signed with the private key that generated the public key. The `message-hash` is the `sha256` of the message. The signature includes 64 bytes plus an optional additional recovery id (00..03) for a total of 64 or 65 bytes.

**example:**

```clarity
(secp256k1-verify 0xde5b9eb9e7c5592930eb2e30a01369c36586d872082ed8181ee83d2a0ec20f04 0x8738487ebe69b93d8e51583be8eee50bb4213fc49c767d329632730cc193b873554428fc936ca3569afc15f1c9365f6591d6251a89fee9c9ac661116824d3a1301 0x03adb8de4bfb65db2cfd6120d55c6526ae9c52e675db7e47308636534ba7786110) ;; Returns true
(secp256k1-verify 0xde5b9eb9e7c5592930eb2e30a01369c36586d872082ed8181ee83d2a0ec20f04 0x8738487ebe69b93d8e51583be8eee50bb4213fc49c767d329632730cc193b873554428fc936ca3569afc15f1c9365f6591d6251a89fee9c9ac661116824d3a13 0x03adb8de4bfb65db2cfd6120d55c6526ae9c52e675db7e47308636534ba7786110) ;; Returns true
(secp256k1-verify 0x0000000000000000000000000000000000000000000000000000000000000000 0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000 0x03adb8de4bfb65db2cfd6120d55c6526ae9c52e675db7e47308636534ba7786110) ;; Returns false
```

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

## sha256​

Introduced in: **Clarity 1**

**input:** `buff|uint|int`

**output:** `(buff 32)`

**signature:** `(sha256 value)`

**description:**

The `sha256` function computes `SHA256(x)` of the inputted value. If an integer (128 bit) is supplied the hash is computed over the little-endian representation of the integer.

**example:**

```clarity
(sha256 0) ;; Returns 0x374708fff7719dd5979ec875d56cd2286f6d3cf7ec317a3b25632aab28ec37bb
```

***

## sha512​

Introduced in: **Clarity 1**

**input:** `buff|uint|int`

**output:** `(buff 64)`

**signature:** `(sha512 value)`

**description:**

The `sha512` function computes `SHA512(x)` of the inputted value. If an integer (128 bit) is supplied the hash is computed over the little-endian representation of the integer.

**example:**

```clarity
(sha512 1) ;; Returns 0x6fcee9a7b7a7b821d241c03c82377928bc6882e7a08c78a4221199bfa220cdc55212273018ee613317c8293bb8d1ce08d1e017508e94e06ab85a734c99c7cc34
```

***

## sha512/256​

Introduced in: **Clarity 1**

**input:** `buff|uint|int`

**output:** `(buff 32)`

**signature:** `(sha512/256 value)`

**description:**

The `sha512/256` function computes `SHA512/256(x)` (the SHA512 algorithm with the 512/256 initialization vector, truncated to 256 bits) of the inputted value. If an integer (128 bit) is supplied the hash is computed over the little-endian representation of the integer.

**example:**

```clarity
(sha512/256 1) ;; Returns 0x515a7e92e7c60522db968d81ff70b80818fc17aeabbec36baf0dda2812e94a86
```

***

## slice?

Introduced in: **Clarity 2**

**input:** `sequence_A, uint, uint`\
**output:** `(optional sequence_A)`\
**signature:** `(slice? sequence left-position right-position)`\
**cost:** `448` runtime (static)

**description:**\
The `slice?` function attempts to return a sub-sequence of that starts at `left-position` (inclusive), and ends at `right-position` (non-inclusive). If `left_position`==`right_position`, the function returns an empty sequence. If either `left_position` or `right_position` are out of bounds OR if `right_position` is less than `left_position`, the function returns `none`.

**example:**

```clarity
(slice? "blockstack" u5 u10) ;; Returns (some "stack")
(slice? (list 1 2 3 4 5) u5 u9) ;; Returns none
(slice? (list 1 2 3 4 5) u3 u4) ;; Returns (some (4))
(slice? "abcd" u1 u3) ;; Returns (some "bc")
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
The `some` function constructs a `optional` type from the input value.

**example:**

```clojure
(some 1) ;; Returns (some 1)
(is-none (some 2)) ;; Returns false
```

***

## sqrti

Introduced in: **Clarity 1**

**input:** `int | uint`\
**output:** `int | uint`\
**signature:** `(sqrti n)`\
**cost:** `142` runtime (static)

**description:**\
Returns the largest integer that is less than or equal to the square root of `n`.\
Fails on a negative numbers.

**example:**

```clojure
(sqrti u11) ;; Returns u3
(sqrti 1000000) ;; Returns 1000
(sqrti u1) ;; Returns u1
(sqrti 0) ;; Returns 0
```

***

## string-to-int?​

Introduced in: **Clarity 2**

**input:** `(string-ascii 1048576) | (string-utf8 262144)`

**output:** `(optional int)`

**signature:** `(string-to-int? (string-ascii|string-utf8))`

**description:**

Converts a string, either `string-ascii` or `string-utf8`, to an optional-wrapped signed integer. If the input string does not represent a valid integer, then the function returns `none`. Otherwise it returns an integer wrapped in `some`.

Note: This function is only available starting with Stacks 2.1.

**example:**

```clarity
(string-to-int? "1") ;; Returns (some 1)
(string-to-int? u"-1") ;; Returns (some -1)
(string-to-int? "a") ;; Returns none
```

***

## string-to-uint?​

Introduced in: **Clarity 2**

**input:** `(string-ascii 1048576) | (string-utf8 262144)`

**output:** `(optional uint)`

**signature:** `(string-to-uint? (string-ascii|string-utf8))`

**description:**

Converts a string, either `string-ascii` or `string-utf8`, to an optional-wrapped unsigned integer. If the input string does not represent a valid integer, then the function returns `none`. Otherwise it returns an unsigned integer wrapped in `some`.

Note: This function is only available starting with Stacks 2.1.

**example:**

```clarity
(string-to-uint? "1") ;; Returns (some u1)
(string-to-uint? u"1") ;; Returns (some u1)
(string-to-uint? "a") ;; Returns none
```

***

## stx-account

Introduced in: **Clarity 2**

**input:** `principal`\
**output:** `(tuple (locked uint) (unlock-height uint) (unlocked uint))`\
**signature:** `(stx-account owner)`\
**cost:** `4654` runtime + 1 read (static)

**description:**\
`stx-account` is used to query the STX account of the `owner` principal.

This function returns a tuple with the canonical account representation for an STX account. This includes the current amount of unlocked STX, the current amount of locked STX, and the unlock height for any locked STX, all denominated in microstacks.

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
`stx-burn?` decreases the `sender` principal's STX holdings by `amount`, specified in microstacks, by destroying the STX. The `sender` principal _must_ be equal to the current context's `tx-sender`.

This function returns (ok true) if the transfer is successful. In the event of an unsuccessful transfer it returns one of the following error codes:

`(err u1)` -- `sender` does not have enough balance to transfer `(err u3)` -- amount to send is non-positive `(err u4)` -- the `sender` principal is not the current `tx-sender`

**example:**

```clojure
(as-contract  (stx-burn? u60 tx-sender)) ;; Returns (ok true)
(as-contract  (stx-burn? u50 'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR)) ;; Returns (err u4)
```

***

## stx-get-balance

Introduced in: **Clarity 1**

**input:** `principal`\
**output:** `uint`\
**signature:** `(stx-get-balance owner)`\
**cost:** `4294` runtime + 1 read (static)

**description:**\
`stx-get-balance` is used to query the STX balance of the `owner` principal.

This function returns the STX balance, in microstacks (1 STX = 1,000,000 microstacks), of the `owner` principal. In the event that the `owner` principal isn't materialized, it returns 0.

**example:**

```clojure
(stx-get-balance 'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR) ;; Returns u0
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
`stx-transfer?` is used to increase the STX balance for the `recipient` principal by debiting the `sender` principal by `amount`, specified in microstacks. The `sender` principal _must_ be equal to the current context's `tx-sender`.

This function returns (ok true) if the transfer is successful. In the event of an unsuccessful transfer it returns one of the following error codes:

`(err u1)` -- `sender` does not have enough balance to transfer `(err u2)` -- `sender` and `recipient` are the same principal `(err u3)` -- amount to send is non-positive `(err u4)` -- the `sender` principal is not the current `tx-sender`

**example:**

```clojure
(as-contract  (stx-transfer? u60 tx-sender 'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR)) ;; Returns (ok true)
(as-contract  (stx-transfer? u60 tx-sender 'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR)) ;; Returns (ok true)
(as-contract  (stx-transfer? u50 'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR tx-sender)) ;; Returns (err u4)
```

***

## to-ascii?

Introduced in: **Clarity 4**

**Input**: `int` | `uint` | `bool` | `principal` | `(buff 524284)` | `(string-utf8 262144)`

**Output**: `(response (string-ascii 1048571) uint)`

**Signature**: `(to-ascii? value)`

**Description**: Returns the `string-ascii` representation of the input value in an `ok` response on success. The only error condition is if the input type is `string-utf8` and the value contains non-ASCII characters, in which case, `(err u1)` is returned. Note that the limitation on the maximum sizes of `buff` and `string-utf8` inputs is due to the Clarity value size limit of 1MB. The `(string-utf8 262144)` is the maximum allowed size of a `string-utf8` value, and the `(buff 524284)` limit is chosen because the ASCII representation of a `buff` is `0x` followed by two ASCII characters per byte in the `buff`. This means that the ASCII representation of a `(buff 524284)` is `2 + 2 * 524284 = 1048570` characters at 1 byte each, and the remainder is required for the `response` value wrapping the `string-ascii`.

**Example**:

```clarity
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
`to-consensus-buff?` is a special function that will serialize any Clarity value into a buffer, using the SIP-005 serialization of the Clarity value. Not all values can be serialized: some value's consensus serialization is too large to fit in a Clarity buffer (this is because of the type prefix in the consensus serialization).

If the value cannot fit as serialized into the maximum buffer size, this returns `none`, otherwise, it will be `(some consensus-serialized-buffer)`. During type checking, the analyzed type of the result of this method will be the maximum possible consensus buffer length based on the inferred type of the supplied value.

**example:**

```clarity
(to-consensus-buff? 1) ;; Returns (some 0x0000000000000000000000000000000001)
(to-consensus-buff? u1) ;; Returns (some 0x0100000000000000000000000000000001)
(to-consensus-buff? true) ;; Returns (some 0x03)
(to-consensus-buff? false) ;; Returns (some 0x04)
(to-consensus-buff? none) ;; Returns (some 0x09)
(to-consensus-buff? 'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR) ;; Returns (some 0x051fa46ff88886c2ef9762d970b4d2c63678835bd39d)
(to-consensus-buff? { abc: 3, def: 4 }) ;; Returns (some 0x0c00000002036162630000000000000000000000000000000003036465660000000000000000000000000000000004)
```

***

## to-int

Introduced in: **Clarity 1**

**input:** `uint`\
**output:** `int`\
**signature:** `(to-int u)`\
**cost:** `135` runtime (static)

**description:**\
Tries to convert the `uint` argument to an `int`. Will cause a runtime error and abort if the supplied argument is >= `pow(2, 127)`

**example:**

```clarity
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
Tries to convert the `int` argument to a `uint`. Will cause a runtime error and abort if the supplied argument is negative.

**example:**

```clarity
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
The `try!` function attempts to 'unpack' the first argument: if the argument is an option type, and the argument is a `(some ...)` option, `try!` returns the inner value of the option. If the argument is a response type, and the argument is an `(ok ...)` response, `try!` returns the inner value of the `ok`. If the supplied argument is either an `(err ...)` or a `none` value, `try!` _returns_ either `none` or the `(err ...)` value from the current function and exits the current control-flow.

**example:**

```clarity
(define-map names-map { name: (string-ascii 12) } { id: int })
(map-set names-map { name: "blockstack" } { id: 1337 })
(try! (map-get? names-map { name: "blockstack" })) ;; Returns (tuple (id 1337))
(define-private (checked-even (x int))  
  (if (is-eq (mod x 2) 0)      
    (ok x)      
    (err false)))
(define-private (double-if-even (x int))  
  (ok (* 2 (try! (checked-even x)))))
(double-if-even 10) ;; Returns (ok 20)
(double-if-even 3) ;; Returns (err false)
```

***

## tuple

Introduced in: **Clarity 1**

**input:** `(key-name A), ...`\
**output:** `(tuple (key-name A) ...)`\
**signature:** `(tuple (key0 expr0) (key1 expr1) ...)`\
**cost:** `10n×log₂(n) + 1876` runtime (where n = number of tuple keys)

**description:**\
The `tuple` special form constructs a typed tuple from the supplied key and expression pairs. A `get` function can use typed tuples as input to select specific values from a given tuple. Key names may not appear multiple times in the same tuple definition. Supplied expressions are evaluated and associated with the expressions' paired key name.

There is a shorthand using curly brackets of the form {key0: expr0, key1: expr, ...}

**example:**

```clojure
(tuple (name "blockstack") 
(id 1337)) ;; using tuple    
{name: "blockstack", id: 1337} ;; using curly brackets
```

***

## unwrap!

Introduced in: **Clarity 1**

**input:** `(optional A) | (response A B), C`

**output:** `A`

**signature:** `(unwrap! option-input thrown-value)`

**description:**

The `unwrap!` function attempts to 'unpack' the first argument: if the argument is an option type, and the argument is a `(some ...)` option, `unwrap!` returns the inner value of the option. If the argument is a response type, and the argument is an `(ok ...)` response, `unwrap!` returns the inner value of the `ok`. If the supplied argument is either an `(err ...)` or a `(none)` value, `unwrap!` _returns_ `thrown-value` from the current function and exits the current control-flow.

**example:**

```clarity
(define-map names-map { name: (string-ascii 12) } { id: int })
(map-set names-map { name: "blockstack" } { id: 1337 })
(define-private (get-name-or-err (name (string-ascii 12)))  
  (let ( (raw-name (unwrap! (map-get? names-map { name: name }) (err 1))))       
  (ok raw-name)))
(get-name-or-err "blockstack") ;; Returns (ok (tuple (id 1337)))
(get-name-or-err "non-existant") ;; Returns (err 1)
```

***

## unwrap-err!

Introduced in: **Clarity 1**

**input:** `(response A B), C`

**output:** `B`

**signature:** `(unwrap-err! response-input thrown-value)`

**description:**

The `unwrap-err!` function attempts to 'unpack' the first argument: if the argument is an `(err ...)` response, `unwrap-err!` returns the inner value of the `err`. If the supplied argument is an `(ok ...)` value, `unwrap-err!` _returns_ `thrown-value` from the current function and exits the current control-flow.

**example:**

```clarity
(unwrap-err! (err 1) false) ;; Returns 1
```

***

## unwrap-err-panic​

Introduced in: **Clarity 1**

**input:** `(response A B)`

**output:** `B`

**signature:** `(unwrap-err-panic response-input)`

**description:**

The `unwrap-err` function attempts to 'unpack' the first argument: if the argument is an `(err ...)` response, `unwrap` returns the inner value of the `err`. If the supplied argument is an `(ok ...)` value, `unwrap-err` throws a runtime error, aborting any further processing of the current transaction.

**example:**

```clarity
(unwrap-err-panic (err 1)) ;; Returns 1
(unwrap-err-panic (ok 1)) ;; Throws a runtime exception
```

***

## unwrap-panic​

Introduced in: **Clarity 1**

**input:** `(optional A) | (response A B)`

**output:** `A`

**signature:** `(unwrap-panic option-input)`

**description:**

The `unwrap` function attempts to 'unpack' its argument: if the argument is an option type, and the argument is a `(some ...)` option, this function returns the inner value of the option. If the argument is a response type, and the argument is an `(ok ...)` response, it returns the inner value of the `ok`. If the supplied argument is either an `(err ...)` or a `(none)` value, `unwrap` throws a runtime error, aborting any further processing of the current transaction.

**example:**

```clarity
(define-map names-map { name: (string-ascii 12) } { id: int })
(map-set names-map { name: "blockstack" } { id: 1337 })
(unwrap-panic (map-get? names-map { name: "blockstack" })) ;; Returns (tuple (id 1337))
(unwrap-panic (map-get? names-map { name: "non-existant" })) ;; Throws a runtime exception
```

***

## use-trait

Introduced in: **Clarity 1**

**input:** `VarName, TraitIdentifier`\
**output:** `Not Applicable`\
**signature:** `(use-trait trait-alias trait-identifier)`

**description:**\
`use-trait` is used to bring a trait, defined in another contract, to the current contract. Subsequent references to an imported trait are signaled with the syntax `<trait-alias>`.

Traits import are defined with a name, used as an alias, and a trait identifier. Trait identifiers can either be using the sugared syntax (.token-a.token-trait), or be fully qualified ('SPAXYA5XS51713FDTQ8H94EJ4V579CXMTRNBZKSF.token-a.token-trait).

Like other kinds of definition statements, `use-trait` may only be used at the top level of a smart contract definition (i.e., you cannot put such a statement in the middle of a function body).

**example:**

```clarity
(use-trait token-a-trait 'SPAXYA5XS51713FDTQ8H94EJ4V579CXMTRNBZKSF.token-a.token-trait)
(define-public (forward-get-balance (user principal) (contract <token-a-trait>))  
  (begin (ok 1)))
```

***

## var-get​

Introduced in: **Clarity 1**

**input:** `VarName`

**output:** `A`

**signature:** `(var-get var-name)`

**description:**

The `var-get` function looks up and returns an entry from a contract's data map. The value is looked up using `var-name`.

**example:**

```clarity
(define-data-var cursor int 6)
(var-get cursor) ;; Returns 6
```

***

## var-set​

Introduced in: **Clarity 1**

**input:** `VarName, AnyType`

**output:** `bool`

**signature:** `(var-set var-name expr1)`

**description:**

The `var-set` function sets the value associated with the input variable to the inputted value. The function always returns `true`.

**example:**

```clarity
(define-data-var cursor int 6)
(var-get cursor) ;; Returns 6
(var-set cursor (+ (var-get cursor) 1)) ;; Returns true
(var-get cursor) ;; Returns 7
```

***

{% hint style="info" %}
The following 5 `with-*` functions are meant to be used inside the new `restrict-assets?` function.
{% endhint %}

## with-all-assets-unsafe

Introduced in: **Clarity 4**

**Input**: None

**Output**: Not applicable

**Signature**: `(with-all-assets-unsafe)`

**Description**: Grants unrestricted access to all assets of the contract to the enclosing `as-contract?` expression. Note that this is not allowed in `restrict-assets?` and will trigger an analysis error, since usage there does not make sense (i.e. just remove the `restrict-assets?` instead). **Security Warning:** This should be used with extreme caution, as it effectively disables all asset protection for the contract. This dangerous allowance should only be used when the code executing within the `as-contract?` body is verified to be trusted through other means (e.g. checking traits against an allow list, passed in from a trusted caller), and even then the more restrictive allowances should be preferred when possible.

**Example**:

```clarity
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

```clarity
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

```clarity
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

```clarity
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

```clarity
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
Returns the result of bitwise exclusive or'ing `i1` with `i2`.

**example:**

```clojure
(xor 1 2) ;; Returns 3
(xor 120 280) ;; Returns 352
```
