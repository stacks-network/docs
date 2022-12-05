---
title: Fungsi
description: Lihat daftar rinci semua fungsi untuk bahasa Clarity.
tags:
  - clarity
---

## Fungsi

Detailed list of all functions for the Clarity language.

### + (add)
#### input: `int, ... | uint, ...`
#### output: `int | uint`
#### signature: `(+ i1 i2...)`
#### description:
Adds a variable number of integer inputs and returns the result. In the event of an _overflow_, throws a runtime error.
#### example:
```clarity
(+ 1 2 3)   ;; Returns 6
(+ 2 3)     ;; Returns 5
(+ 1 2 3 4) ;; Returns 10
(+ 9 -3)    ;; Returns 6
(+ -3 -2)   ;; Returns -5
```

### - (subtract)
#### input: `int, ... | uint, ...`
#### output: `int | uint`
#### signature: `(- i1 i2...)`
#### description:
Subtracts a variable number of integer inputs and returns the result. In the event of an _underflow_, throws a runtime error.
#### example:
```clarity
(- 2 1 1) ;; Returns 0
(- 0 3)   ;; Returns -3
(- 5 -3)  ;; Returns 8
(- -4 -5) ;; Returns 1
```

### * (multiply)
#### input: `int, ... | uint, ...`
#### output: `int | uint`
#### signature: `(* i1 i2...)`
#### description:
Multiplies a variable number of integer inputs and returns the result. In the event of an _overflow_, throws a runtime error.
#### example:
```clarity
(* 2 3)   ;; Returns 6
(* 5 2)   ;; Returns 10
(* 2 2 2) ;; Returns 8
(* 3 -2)  ;; Returns -6
(* -1 -2) ;; Returns 2
```

### / (divide)
#### input: `int, ... | uint, ...`
#### output: `int | uint`
#### signature: `(/ i1 i2...)`
#### description:
Divides a variable number of integer inputs and returns the _integer part_ of the result. In the event of _division by zero_, throws a runtime error.

#### example:
```clarity
(/ 2 3)    ;; Returns 0
(/ 5 2)    ;; Returns 2
(/ 4 2 2)  ;; Returns 1
(/ -10 2)  ;; Returns -5
(/ -8 -2)  ;; Returns 4
(/ -9 4)   ;; Returns -2
```

### >= (greater than or equal)
#### input: `int, int | uint, uint`
#### output: `bool`
#### signature: `(>= i1 i2)`
#### deskripsi:
Compares two integers, returning `true` if `i1` is greater than or equal to `i2` and `false` otherwise.
#### contoh:
```clarity
(>= 1 1) ;; Returns true
(>= 5 2) ;; Returns true
```

### <= (less than or equal)
#### input: `int, int | uint, uint`
#### output: `bool`
#### signature: `(<= i1 i2)`
#### deskripsi:
Compares two integers, returning true if `i1` is less than or equal to `i2` and `false` otherwise.
#### contoh:
```clarity
(<= 1 1) ;; Returns true
(<= 5 2) ;; Returns false
```

### < (less than)
#### input: `int, int | uint, uint`
#### output: `bool`
#### signature: `(< i1 i2)`
#### deskripsi:
Compares two integers, returning `true` if `i1` is less than `i2` and `false` otherwise.
#### contoh:
```clarity
(< 1 2) ;; Returns true
(< 5 2) ;; Returns false
```

### > (greater than)
#### input: `int, int | uint, uint`
#### output: `bool`
#### signature: `(> i1 i2)`
#### deskripsi:
Compares two integers, returning `true` if `i1` is greater than `i2` and false otherwise.
#### contoh:
```clarity
(> 1 2) ;; Returns false
(> 5 2) ;; Returns true
```

### to-int
#### input: `uint`
#### output: `int`
#### signature: `(to-int u)`
#### deskripsi:
Tries to convert the `uint` argument to an `int`. Will cause a runtime error and abort if the supplied argument is >= `pow(2, 127)``
#### contoh:
```clarity
(to-int u238) ;; Returns 238
```

### to-uint
#### input: `int`
#### output: `uint`
#### signature: `(to-uint i)`
#### deskripsi:
Tries to convert the `int` argument to a `uint`. Will cause a runtime error and abort if the supplied argument is negative.
#### contoh:
```clarity
(to-uint 238) ;; Returns u238
```

### mod
#### input: `int, int | uint, uint`
#### output: `int | uint`
#### signature: `(mod i1 i2)`
#### description:
Returns the integer remainder from integer dividing `i1` by `i2`. In the event of a division by zero, throws a runtime error.
#### example:
```clarity
(mod 2 3) ;; Returns 2
(mod 5 2) ;; Returns 1
(mod 7 1) ;; Returns 0
```

### pow
#### input: `int, int | uint, uint`
#### output: `int | uint`
#### signature: `(pow i1 i2)`
#### description:
Returns the result of raising `i1` to the power of `i2`. In the event of an _overflow_, throws a runtime error. Note: Corner cases are handled with the following rules:
  * if both `i1` and `i2` are `0`, return `1`
  * if `i1` is `1`, return `1`
  * if `i1` is `0`, return `0`
  * if `i2` is `1`, return `i1`
  * if `i2` is negative or greater than `u32::MAX`, throw a runtime error
#### example:
```clarity
(pow 2 3) ;; Returns 8
(pow 2 2) ;; Returns 4
(pow 7 1) ;; Returns 7
```

### sqrti
#### input: `int | uint`
#### output: `int | uint`
#### signature: `(sqrti n)`
#### description:
Returns the largest integer that is less than or equal to the square root of `n`.  Fails on a negative numbers.
#### example:
```clarity
(sqrti u11) ;; Returns u3
(sqrti 1000000) ;; Returns 1000
(sqrti u1) ;; Returns u1
(sqrti 0) ;; Returns 0
```

### log2
#### input: `int | uint`
#### output: `int | uint`
#### signature: `(log2 n)`
#### description:
Returns the _integer part_ of the power to which the number 2 must be raised to obtain the value `n`. Fails on zero or a negative number.
#### example:
```clarity
(log2 u8)   ;; Returns u3
(log2 8)    ;; Returns 3
(log2 u1)   ;; Returns u0
(log2 1000) ;; Returns 9
```

### xor
#### input: `int, int | uint, uint`
#### output: `int | uint`
#### signature: `(xor i1 i2)`
#### description:
Returns the result of bitwise exclusive or'ing `i1` with `i2`.
#### example:
```clarity
(xor 1 2) ;; Returns 3
(xor 120 280) ;; Returns 352
```

### and
#### input: `bool, ...`
#### output: `bool`
#### signature: `(and b1 b2 ...)`
#### description:
Returns `true` if all boolean inputs are `true`. Importantly, the supplied arguments are evaluated in-order and lazily. Lazy evaluation means that if one of the arguments returns `false`, the function short-circuits, and no subsequent arguments are evaluated.
#### example:
```clarity
(and true false) ;; Returns false
(and (is-eq (+ 1 2) 1) (is-eq 4 4)) ;; Returns false
(and (is-eq (+ 1 2) 3) (is-eq 4 4)) ;; Returns true
```

### or
#### input: `bool, ...`
#### output: `bool`
#### signature: `(or b1 b2 ...)`
#### description:
Returns `true` if any boolean inputs are `true`. Importantly, the supplied arguments are evaluated in-order and lazily. Lazy evaluation means that if one of the arguments returns `true`, the function short-circuits, and no subsequent arguments are evaluated.
#### example:
```clarity
(or true false) ;; Returns true
(or (is-eq (+ 1 2) 1) (is-eq 4 4)) ;; Returns true
(or (is-eq (+ 1 2) 1) (is-eq 3 4)) ;; Returns false
(or (is-eq (+ 1 2) 3) (is-eq 4 4)) ;; Returns true
```

### not
#### input: `bool`
#### output: `bool`
#### signature: `(not b1)`
#### description:
Returns the inverse of the boolean input.
#### example:
```clarity
(not true) ;; Returns false
(not (is-eq 1 2)) ;; Returns true
```

### is-eq
#### input: `A, A, ...`
#### output: `bool`
#### signature: `(is-eq v1 v2...)`
#### description:
Compares the inputted values, returning `true` if they are all equal. Note that _unlike_ the `(and ...)` function, `(is-eq ...)` will _not_ short-circuit. All values supplied to is-eq _must_ be the same type.
#### example:
```clarity
(is-eq 1 1) ;; Returns true
(is-eq true false) ;; Returns false
(is-eq \"abc\" 234 234) ;; Throws type error
```

### if
#### input: `bool, A, A`
#### output: `A`
#### signature: `(if bool1 expr1 expr2)`
#### description:
The `if` function admits a boolean argument and two expressions which must return the same type. In the case that the boolean input is `true`, the `if` function evaluates and returns `expr1`. If the boolean input is `false`, the `if` function evaluates and returns `expr2`.
#### example:
```clarity
(if true 1 2) ;; Returns 1
(if (> 1 2) 1 2) ;; Returns 2
```

### let
#### input: `((name1 AnyType) (name2 AnyType) ...), AnyType, ... A`
#### output: `A`
#### signature: `(let ((name1 expr1) (name2 expr2) ...) expr-body1 expr-body2 ... expr-body-last)`
#### description:
The `let` function accepts a list of `variable name` and `expression` pairs, evaluating each expression and _binding_ it to the corresponding variable name. `let` bindings are sequential: when a `let` binding is evaluated, it may refer to prior binding. The _context_ created by this set of bindings is used for evaluating its body expressions. The let expression returns the value of the last such body expression. Note: intermediary statements returning a response type must be checked`
#### example:
```clarity
(let ((a 2) (b (+ 5 6 7))) (print a) (print b) (+ a b)) ;; Returns 20
(let ((a 5) (c (+ a 1)) (d (+ c 1)) (b (+ a c d))) (print a) (print b) (+ a b)) ;; Returns 23
```

### map
#### input: `Function(A, B, ..., N) -> X, sequence_A, sequence_B, ..., sequence_N`
#### output: `(list X)`
#### signature: `(map func sequence_A sequence_B ... sequence_N)`
#### description:
The `map` function applies the function `func` to each corresponding element of the input sequences, and outputs a _list_ of the same type containing the outputs from those function applications. Applicable sequence types are `(list A)`, `buff`, `string-ascii` and `string-utf8`, for which the corresponding element types are, respectively, `A`, `(buff 1)`, `(string-ascii 1)` and `(string-utf8 1)`. The `func` argument must be a literal function name. Also, note that, no matter what kind of sequences the inputs are, the output is always a list.
#### example:
```clarity
(map not (list true false true false)) ;; Returns (false true false true)
(map + (list 1 2 3) (list 1 2 3) (list 1 2 3)) ;; Returns (3 6 9)
(define-private (a-or-b (char (string-utf8 1))) (if (is-eq char u\"a\") u\"a\" u\"b\"))
(map a-or-b u\"aca\") ;; Returns (u\"a\" u\"b\" u\"a\")
(define-private (zero-or-one (char (buff 1))) (if (is-eq char 0x00) 0x00 0x01))
(map zero-or-one 0x000102) ;; Returns (0x00 0x01 0x01)
```

### fold
#### input: `Function(A, B) -> B, sequence_A, B`
#### output: `B`
#### signature: `(fold func sequence_A initial_B)`
#### description:
The `fold` function condenses `sequence_A` into a value of type `B` by recursively applies the function `func` to each element of the input sequence _and_ the output of a previous application of `func`.

`fold` uses `initial_B` in the initial application of `func`, along with the first element of `sequence_A`. The resulting value of type `B` is used for the next application of `func`, along with the next element of `sequence_A` and so on. `fold` returns the last value of type `B` returned by these successive applications `func`.

Applicable sequence types are `(list A)`, `buff`, `string-ascii` and `string-utf8`, for which the corresponding element types are, respectively, `A`, `(buff 1)`, `(string-ascii 1)` and `(string-utf8 1)`. The `func` argument must be a literal function name.

#### example:
```clarity
(fold * (list 2 2 2) 1) ;; Returns 8
(fold * (list 2 2 2) 0) ;; Returns 0
;; calculates (- 11 (- 7 (- 3 2)))
(fold - (list 3 7 11) 2) ;; Returns 5 
(define-private (concat-string (a (string-ascii 20)) (b (string-ascii 20))) (unwrap-panic (as-max-len? (concat a b) u20)))
(fold concat-string \"cdef\" \"ab\")   ;; Returns \"fedcab\"
(fold concat-string (list \"cd\" \"ef\") \"ab\")   ;; Returns \"efcdab\"
(define-private (concat-buff (a (buff 20)) (b (buff 20))) (unwrap-panic (as-max-len? (concat a b) u20)))
(fold concat-buff 0x03040506 0x0102)   ;; Returns 0x060504030102
```

### append
#### input: `list A, A`
#### output: `list`
#### signature: `(append (list 1 2 3 4) 5)`
#### description:
The `append` function takes a list and another value with the same entry type, and outputs a list of the same type with max_len += 1.
#### example:
```clarity
(append (list 1 2 3 4) 5) ;; Returns (1 2 3 4 5)
```

### concat
#### input: `sequence_A, sequence_A`
#### output: `sequence_A`
#### signature: `(concat sequence1 sequence2)`
#### description:
The `concat` function takes two sequences of the same type, and returns a concatenated sequence of the same type, with the resulting sequence_len = sequence1_len + sequence2_len. Applicable sequence types are `(list A)`, `buff`, `string-ascii` and `string-utf8`.

#### example:
```clarity
(concat (list 1 2) (list 3 4)) ;; Returns (1 2 3 4)
(concat \"hello \" \"world\") ;; Returns \"hello world\"
(concat 0x0102 0x0304) ;; Returns 0x01020304
```

### as-max-len?
#### input: `sequence_A, uint`
#### output: `(optional sequence_A)`
#### signature: `(as-max-len? sequence max_length)`
#### description:
The `as-max-len?` function takes a sequence argument and a uint-valued, literal length argument. The function returns an optional type. If the input sequence length is less than or equal to the supplied max_length, this returns `(some sequence)`, otherwise it returns `none`. Applicable sequence types are `(list A)`, `buff`, `string-ascii` and `string-utf8`. `
#### example:
```clarity
(as-max-len? (list 2 2 2) u3) ;; Returns (some (2 2 2))
(as-max-len? (list 1 2 3) u2) ;; Returns none
(as-max-len? \"hello\" u10) ;; Returns (some \"hello\")
(as-max-len? 0x010203 u10) ;; Returns (some 0x010203)
```

### len
#### input: `sequence_A`
#### output: `uint`
#### signature: `(len sequence)`
#### description:
The `len` function returns the length of a given sequence. Applicable sequence types are `(list A)`, `buff`, `string-ascii` and `string-utf8`. `
#### example:
```clarity
(len \"blockstack\") ;; Returns u10
(len (list 1 2 3 4 5)) ;; Returns u5
(len 0x010203) ;; Returns u3
```

### element-at
#### input: `sequence_A, uint`
#### output: `(optional A)`
#### signature: `(element-at sequence index)`
#### description:
The `element-at` function returns the element at `index` in the provided sequence. Applicable sequence types are `(list A)`, `buff`, `string-ascii` and `string-utf8`, for which the corresponding element types are, respectively, `A`, `(buff 1)`, `(string-ascii 1)` and `(string-utf8 1)`. `
#### example:
```clarity
(element-at \"blockstack\" u5) ;; Returns (some \"s\")
(element-at (list 1 2 3 4 5) u5) ;; Returns none
(element-at (list 1 2 3 4 5) (+ u1 u2)) ;; Returns (some 4)
(element-at \"abcd\" u1) ;; Returns (some \"b\")
(element-at 0xfb01 u1) ;; Returns (some 0x01)
```

### index-of
#### input: `sequence_A, A`
#### output: `(optional uint)`
#### signature: `(index-of sequence item)`
#### description:
The `index-of` function returns the first index at which `item` can be found, using `is-eq` checks, in the provided sequence. Applicable sequence types are `(list A)`, `buff`, `string-ascii` and `string-utf8`, for which the corresponding element types are, respectively, `A`, `(buff 1)`, `(string-ascii 1)` and `(string-utf8 1)`. If the target item is not found in the sequence (or if an empty string or buffer is supplied), this function returns `none`.
#### example:
```clarity
(index-of \"blockstack\" \"b\") ;; Returns (some u0)
(index-of \"blockstack\" \"k\") ;; Returns (some u4)
(index-of \"blockstack\" \"\") ;; Returns none
(index-of (list 1 2 3 4 5) 6) ;; Returns none
(index-of 0xfb01 0x01) ;; Returns (some u1)
```

### list
#### input: `A, ...`
#### output: `(list A)`
#### signature: `(list expr1 expr2 expr3 ...)`
#### description:
The `list` function constructs a list composed of the inputted values. Each supplied value must be of the same type.
#### example:
```clarity
(list (+ 1 2) 4 5) ;; Returns (3 4 5)
```

### var-get
#### input: `VarName`
#### output: `A`
#### signature: `(var-get var-name)`
#### description:
The `var-get` function looks up and returns an entry from a contract's data map. The value is looked up using `var-name`.
#### example:
```clarity
(define-data-var cursor int 6)
(var-get cursor) ;; Returns 6
```

### var-set
#### input: `VarName, AnyType`
#### output: `bool`
#### signature: `(var-set var-name expr1)`
#### description:
The `var-set` function sets the value associated with the input variable to the inputted value. The function always returns `true`.
#### example:
```clarity
(define-data-var cursor int 6)
(var-get cursor) ;; Returns 6
(var-set cursor (+ (var-get cursor) 1)) ;; Returns true
(var-get cursor) ;; Returns 7
```

### map-get?
#### input: `MapName, tuple`
#### output: `(optional (tuple))`
#### signature: `(map-get? map-name key-tuple)`
#### description:
The `map-get?` function looks up and returns an entry from a contract's data map. The value is looked up using `key-tuple`. If there is no value associated with that key in the data map, the function returns a `none` option. Otherwise, it returns `(some value)`.
#### example:
```clarity
(define-map names-map { name: (string-ascii 10) } { id: int })
(map-set names-map { name: \"blockstack\" } { id: 1337 })
(map-get? names-map (tuple (name \"blockstack\"))) ;; Returns (some (tuple (id 1337)))
(map-get? names-map { name: \"blockstack\" }) ;; Same command, using a shorthand for constructing the tuple
```

### map-set
#### input: `MapName, tuple_A, tuple_B`
#### output: `bool`
#### signature: `(map-set map-name key-tuple value-tuple)`
#### description:
The `map-set` function sets the value associated with the input key to the inputted value. This function performs a _blind_ update; whether or not a value is already associated with the key, the function overwrites that existing association.

Note: the `value-tuple` requires 1 additional byte for storage in the materialized blockchain state, and therefore the maximum size of a value that may be inserted into a map is MAX_CLARITY_VALUE - 1.
#### example:
```clarity
(define-map names-map { name: (string-ascii 10) } { id: int })
(map-set names-map { name: \"blockstack\" } { id: 1337 }) ;; Returns true
(map-set names-map (tuple (name \"blockstack\")) (tuple (id 1337))) ;; Same command, using a shorthand for constructing the tuple
```

### map-insert
#### input: `MapName, tuple_A, tuple_B`
#### output: `bool`
#### signature: `(map-insert map-name key-tuple value-tuple)`
#### description:
The `map-insert` function sets the value associated with the input key to the inputted value if and only if there is not already a value associated with the key in the map. If an insert occurs, the function returns `true`. If a value already existed for this key in the data map, the function returns `false`.

Note: the `value-tuple` requires 1 additional byte for storage in the materialized blockchain state, and therefore the maximum size of a value that may be inserted into a map is MAX_CLARITY_VALUE - 1.
#### example:
```clarity
(define-map names-map { name: (string-ascii 10) } { id: int })
(map-insert names-map { name: \"blockstack\" } { id: 1337 }) ;; Returns true
(map-insert names-map { name: \"blockstack\" } { id: 1337 }) ;; Returns false
(map-insert names-map (tuple (name \"blockstack\")) (tuple (id 1337))) ;; Same command, using a shorthand for constructing the tuple
```

### map-delete
#### input: `MapName, tuple`
#### output: `bool`
#### signature: `(map-delete map-name key-tuple)`
#### description:
The `map-delete` function removes the value associated with the input key for the given map. If an item exists and is removed, the function returns `true`. If a value did not exist for this key in the data map, the function returns `false`.
#### example:
```clarity
(define-map names-map { name: (string-ascii 10) } { id: int })
(map-insert names-map { name: \"blockstack\" } { id: 1337 }) ;; Returns true
(map-delete names-map { name: \"blockstack\" }) ;; Returns true
(map-delete names-map { name: \"blockstack\" }) ;; Returns false
(map-delete names-map (tuple (name \"blockstack\"))) ;; Same command, using a shorthand for constructing the tuple
```

### tuple
#### input: `(key-name A), (key-name-2 B), ...`
#### output: `(tuple (key-name A) (key-name-2 B) ...)`
#### signature: `(tuple (key0 expr0) (key1 expr1) ...)`
#### description:
The `tuple` special form constructs a typed tuple from the supplied key and expression pairs. A `get` function can use typed tuples as input to select specific values from a given tuple. Key names may not appear multiple times in the same tuple definition. Supplied expressions are evaluated and associated with the expressions' paired key name.

There is a shorthand using curly brackets of the form {key0: expr0, key1: expr, ...}`
#### example:
```clarity
(tuple (name \"blockstack\") (id 1337)) ;; using tuple
{name: \"blockstack\", id: 1337} ;; using curly brackets
```

### get
#### input: `KeyName, (tuple) | (optional (tuple))`
#### output: `A`
#### signature: `(get key-name tuple)`
#### description:
The `get` function fetches the value associated with a given key from the supplied typed tuple. If an `Optional` value is supplied as the inputted tuple, `get` returns an `Optional` type of the specified key in the tuple. If the supplied option is a `(none)` option, get returns `(none)`.
#### example:
```clarity
(define-map names-map { name: (string-ascii 12) } { id: int })
(map-insert names-map { name: \"blockstack\" } { id: 1337 }) ;; Returns true
(get id (tuple (name \"blockstack\") (id 1337))) ;; Returns 1337
(get id (map-get? names-map (tuple (name \"blockstack\")))) ;; Returns (some 1337)
(get id (map-get? names-map (tuple (name \"non-existent\")))) ;; Returns none
```

### merge
#### input: `tuple, tuple`
#### output: `tuple`
#### signature: `(merge tuple { key1: val1 })`
#### description:
The `merge` function returns a new tuple with the combined fields, without mutating the supplied tuples.
#### example:
```clarity
(define-map users { id: int } { name: (string-ascii 12), address: (optional principal) })
(map-insert users { id: 1337 } { name: \"john\", address: none }) ;; Returns true
(let ((user (unwrap-panic (map-get? users { id: 1337 }))))
(merge user { address: (some 'SPAXYA5XS51713FDTQ8H94EJ4V579CXMTRNBZKSF) })) ;; Returns (tuple (address (some SPAXYA5XS51713FDTQ8H94EJ4V579CXMTRNBZKSF)) (name \"john\"))
```

### begin
#### input: `AnyType, ... A`
#### output: `A`
#### signature: `(begin expr1 expr2 expr3 ... expr-last)`
#### description:
The `begin` function evaluates each of its input expressions, returning the return value of the last such expression. Note: intermediary statements returning a response type must be checked.
#### example:
```clarity
(begin (+ 1 2) 4 5) ;; Returns 5
```

### hash160
#### input: `buff|uint|int`
#### output: `(buff 20)`
#### signature: `(hash160 value)`
#### description:
The `hash160` function computes `RIPEMD160(SHA256(x))` of the inputted value. If an integer (128 bit) is supplied the hash is computed over the little-endian representation of the integer.
#### example:
```clarity
(hash160 0) ;; Returns 0xe4352f72356db555721651aa612e00379167b30f
```

### sha256
#### input: `buff|uint|int`
#### output: `(buff 32)`
#### signature: `(sha256 value)`
#### description:
The `sha256` function computes `SHA256(x)` of the inputted value. If an integer (128 bit) is supplied the hash is computed over the little-endian representation of the integer.
#### example:
```clarity
(sha256 0) ;; Returns 0x374708fff7719dd5979ec875d56cd2286f6d3cf7ec317a3b25632aab28ec37bb
```

### sha512
#### input: `buff|uint|int`
#### output: `(buff 64)`
#### signature: `(sha512 value)`
#### description:
The `sha512` function computes `SHA512(x)` of the inputted value. If an integer (128 bit) is supplied the hash is computed over the little-endian representation of the integer.
#### example:
```clarity
(sha512 1) ;; Returns 0x6fcee9a7b7a7b821d241c03c82377928bc6882e7a08c78a4221199bfa220cdc55212273018ee613317c8293bb8d1ce08d1e017508e94e06ab85a734c99c7cc34
```

### sha512/256
#### input: `buff|uint|int`
#### output: `(buff 32)`
#### signature: `(sha512/256 value)`
#### description:
The `sha512/256` function computes `SHA512/256(x)` (the SHA512 algorithm with the 512/256 initialization vector, truncated to 256 bits) of the inputted value. If an integer (128 bit) is supplied the hash is computed over the little-endian representation of the integer.
#### example:
```clarity
(sha512/256 1) ;; Returns 0x515a7e92e7c60522db968d81ff70b80818fc17aeabbec36baf0dda2812e94a86
```

### keccak256
#### input: `buff|uint|int`
#### output: `(buff 32)`
#### signature: `(keccak256 value)`
#### description:
The `keccak256` function computes `KECCAK256(value)` of the inputted value. Note that this differs from the `NIST SHA-3` (that is, FIPS 202) standard. If an integer (128 bit) is supplied the hash is computed over the little-endian representation of the integer.
#### example:
```clarity
(keccak256 0) ;; Returns 0xf490de2920c8a35fabeb13208852aa28c76f9be9b03a4dd2b3c075f7a26923b4
```

### secp256k1-recover?
#### input: `(buff 32), (buff 65)`
#### output: `(response (buff 33) uint)`
#### signature: `(secp256k1-recover? message-hash signature)`
#### description:
The `secp256k1-recover?` function recovers the public key used to sign the message  which sha256 is `message-hash` with the provided `signature`. If the signature does not match, it will return the error code `(err u1).`. If the signature is invalid, it will return the error code `(err u2).`. The signature includes 64 bytes plus an additional recovery id (00..03) for a total of 65 bytes.
#### example:
```clarity
(secp256k1-recover? 0xde5b9eb9e7c5592930eb2e30a01369c36586d872082ed8181ee83d2a0ec20f04
 0x8738487ebe69b93d8e51583be8eee50bb4213fc49c767d329632730cc193b873554428fc936ca3569afc15f1c9365f6591d6251a89fee9c9ac661116824d3a1301)
 ;; Returns (ok 0x03adb8de4bfb65db2cfd6120d55c6526ae9c52e675db7e47308636534ba7786110)
 ```

### secp256k1-verify
#### input: `(buff 32), (buff 64) | (buff 65), (buff 33)`
#### output: `bool`
#### signature: `(secp256k1-verify message-hash signature public-key)`
#### description:
The `secp256k1-verify` function verifies that the provided signature of the message-hash was signed with the private key that generated the public key. The `message-hash` is the `sha256` of the message. The signature includes 64 bytes plus an optional additional recovery id (00..03) for a total of 64 or 65 bytes. The function throws an unchecked error if the buffers have a wrong length.
#### example:
```clarity
(secp256k1-verify 0xde5b9eb9e7c5592930eb2e30a01369c36586d872082ed8181ee83d2a0ec20f04
 0x8738487ebe69b93d8e51583be8eee50bb4213fc49c767d329632730cc193b873554428fc936ca3569afc15f1c9365f6591d6251a89fee9c9ac661116824d3a1301
 0x03adb8de4bfb65db2cfd6120d55c6526ae9c52e675db7e47308636534ba7786110) ;; Returns true
(secp256k1-verify 0xde5b9eb9e7c5592930eb2e30a01369c36586d872082ed8181ee83d2a0ec20f04
 0x8738487ebe69b93d8e51583be8eee50bb4213fc49c767d329632730cc193b873554428fc936ca3569afc15f1c9365f6591d6251a89fee9c9ac661116824d3a13
 0x03adb8de4bfb65db2cfd6120d55c6526ae9c52e675db7e47308636534ba7786110) ;; Returns true
(secp256k1-verify 0x0000000000000000000000000000000000000000000000000000000000000000
 0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
 0x03adb8de4bfb65db2cfd6120d55c6526ae9c52e675db7e47308636534ba7786110) ;; Returns false
 ```

### print
#### input: `A`
#### output: `A`
#### signature: `(print expr)`
#### description:
The `print` function evaluates and returns its input expression. On Stacks Core nodes configured for development (as opposed to production mining nodes), this function prints the resulting value to `STDOUT` (standard output).
#### example:
```clarity
(print (+ 1 2 3)) ;; Returns 6
```

### contract-call?
#### input: `ContractName, PublicFunctionName, Arg0, ...`
#### output: `(response A B)`
#### signature: `(contract-call? .contract-name function-name arg0 arg1 ...)`
#### description:
The `contract-call?` function executes the given public function of the given contract. You _may not_ use this function to call a public function defined in the current contract. If the public function returns _err_, any database changes resulting from calling `contract-call?` are aborted. If the function returns _ok_, database changes occurred.
#### example:
```clarity

;; instantiate the sample-contracts/tokens.clar contract first!
(as-contract (contract-call? .tokens mint! u19)) ;; Returns (ok u19)
```

### as-contract
#### input: `A`
#### output: `A`
#### signature: `(as-contract expr)`
#### description:
The `as-contract` function switches the current context's `tx-sender` value to the _contract's_ principal and executes `expr` with that context. It returns the resulting value of `expr`.
#### example:
```clarity
(as-contract tx-sender) ;; Returns S1G2081040G2081040G2081040G208105NK8PE5.docs-test
```

### contract-of
#### input: `Trait`
#### output: `principal`
#### signature: `(contract-of .contract-name)`
#### description:
The `contract-of` function returns the principal of the contract implementing the trait.
#### example:
```clarity
(use-trait token-a-trait 'SPAXYA5XS51713FDTQ8H94EJ4V579CXMTRNBZKSF.token-a.token-trait)
(define-public (forward-get-balance (user principal) (contract <token-a-trait>))
  (begin
    (ok (contract-of contract)))) ;; returns the principal of the contract implementing <token-a-trait>
```

### principal-of?
#### input: `(buff 33)`
#### output: `(response principal uint)`
#### signature: `(principal-of? public-key)`
#### description:
The `principal-of?` function returns the principal derived from the provided public key. If the `public-key` is invalid, it will return the error code `(err u1).`. `
#### example:
```clarity
(principal-of? 0x03adb8de4bfb65db2cfd6120d55c6526ae9c52e675db7e47308636534ba7786110) ;; Returns (ok ST1AW6EKPGT61SQ9FNVDS17RKNWT8ZP582VF9HSCP)
```

### at-block
#### input: `(buff 32), A`
#### output: `A`
#### signature: `(at-block id-block-hash expr)`
#### description:
The `at-block` function evaluates the expression `expr` _as if_ it were evaluated at the end of the block indicated by the _block-hash_ argument. The `expr` closure must be read-only.

Note: The block identifying hash must be a hash returned by the `id-header-hash` block information property. This hash uniquely identifies Stacks blocks and is unique across Stacks forks. While the hash returned by `header-hash` is unique within the context of a single fork, it is not unique across Stacks forks.

The function returns the result of evaluating `expr`.

#### example:
```clarity
(define-data-var data int 1)
(at-block 0x0000000000000000000000000000000000000000000000000000000000000000 block-height) ;; Returns u0
(at-block (get-block-info? id-header-hash 0) (var-get data)) ;; Throws NoSuchDataVariable because `data` wasn't initialized at block height 0
```

### get-block-info?
#### input: `BlockInfoPropertyName, BlockHeightInt`
#### output: `(optional buff) | (optional uint)`
#### signature: `(get-block-info? prop-name block-height-expr)`
#### description:
The `get-block-info?` function fetches data for a block of the given block height. The value and type returned are determined by the specified `BlockInfoPropertyName`. If the provided `BlockHeightInt` does not correspond to an existing block prior to the current block, the function returns `none`. The currently available property names are `time`, `header-hash`, `burnchain-header-hash`, `id-header-hash`, `miner-address`, and `vrf-seed`.

The `time` property returns an integer value of the block header time field. This is a Unix epoch timestamp in seconds which roughly corresponds to when the block was mined. **Warning**: this does not increase monotonically with each block and block times are accurate only to within two hours. See [BIP113](https://github.com/bitcoin/bips/blob/master/bip-0113.mediawiki) for more information.

The `header-hash`, `burnchain-header-hash`, `id-header-hash`, and `vrf-seed` properties return a 32-byte buffer.

The `miner-address` property returns a `principal` corresponding to the miner of the given block.

The `id-header-hash` is the block identifier value that must be used as input to the `at-block` function.

#### example:
```clarity
(get-block-info? time u0) ;; Returns (some u1557860301)
(get-block-info? header-hash u0) ;; Returns (some 0x374708fff7719dd5979ec875d56cd2286f6d3cf7ec317a3b25632aab28ec37bb)
(get-block-info? vrf-seed u0) ;; Returns (some 0xf490de2920c8a35fabeb13208852aa28c76f9be9b03a4dd2b3c075f7a26923b4)
```

### err
#### input: `A`
#### output: `(response A B)`
#### signature: `(err value)`
#### description:
The `err` function constructs a response type from the input value. Use `err` for creating return values in public functions. An _err_ value indicates that any database changes during the processing of the function should be rolled back.
#### example:
```clarity
(err true) ;; Returns (err true)
```

### ok
#### input: `A`
#### output: `(response A B)`
#### signature: `(ok value)`
#### description:
The `ok` function constructs a response type from the input value. Use `ok` for creating return values in public functions. An _ok_ value indicates that any database changes during the processing of the function should materialize.
#### example:
```clarity
(ok 1) ;; Returns (ok 1)
```

### some
#### input: `A`
#### output: `(optional A)`
#### signature: `(some value)`
#### description:
The `some` function constructs a `optional` type from the input value.
#### example:
```clarity
(some 1) ;; Returns (some 1)
(is-none (some 2)) ;; Returns false
```

### default-to
#### input: `A, (optional A)`
#### output: `A`
#### signature: `(default-to default-value option-value)`
#### description:
The `default-to` function attempts to 'unpack' the second argument: if the argument is a `(some ...)` option, it returns the inner value of the option. If the second argument is a `(none)` value, `default-to` it returns the value of `default-value`.
#### example:
```clarity
(define-map names-map { name: (string-ascii 12) } { id: int })
(map-set names-map { name: \"blockstack\" } { id: 1337 })
(default-to 0 (get id (map-get? names-map (tuple (name \"blockstack\"))))) ;; Returns 1337
(default-to 0 (get id (map-get? names-map (tuple (name \"non-existant\"))))) ;; Returns 0
```

### asserts!
#### input: `bool, C`
#### output: `bool`
#### signature: `(asserts! bool-expr thrown-value)`
#### description:
The `asserts!` function admits a boolean argument and asserts its evaluation: if bool-expr is `true`, `asserts!` returns `true` and proceeds in the program execution. If the supplied argument is returning a false value, `asserts!` _returns_ `thrown-value` and exits the current control-flow.
#### example:
```clarity
(asserts! (is-eq 1 1) (err 1)) ;; Returns true
```

### unwrap!
#### input: `(optional A) | (response A B), C`
#### output: `A`
#### signature: `(unwrap! option-input thrown-value)`
#### description:
The `unwrap!` function attempts to 'unpack' the first argument: if the argument is an option type, and the argument is a `(some ...)` option, `unwrap!` returns the inner value of the option. If the argument is a response type, and the argument is an `(ok ...)` response, `unwrap!` returns the inner value of the `ok`. If the supplied argument is either an `(err ...)` or a `(none)` value, `unwrap!` _returns_ `thrown-value` from the current function and exits the current control-flow.
#### example:
```clarity
(define-map names-map { name: (string-ascii 12) } { id: int })
(map-set names-map { name: \"blockstack\" } { id: 1337 })
(define-private (get-name-or-err (name (string-ascii 12)))
  (let ((raw-name (unwrap! (map-get? names-map { name: name }) (err 1))))
       (ok raw-name)))

(get-name-or-err \"blockstack\") ;; Returns (ok (tuple (id 1337)))
(get-name-or-err \"non-existant\") ;; Returns (err 1)
```

### unwrap-err!
#### input: `(response A B), C`
#### output: `B`
#### signature: `(unwrap-err! response-input thrown-value)`
#### description:
The `unwrap-err!` function attempts to 'unpack' the first argument: if the argument is an `(err ...)` response, `unwrap-err!` returns the inner value of the `err`. If the supplied argument is an `(ok ...)` value, `unwrap-err!` _returns_ `thrown-value` from the current function and exits the current control-flow.
#### example:
```clarity
(unwrap-err! (err 1) false) ;; Returns 1
```

### unwrap-panic
#### input: `(optional A) | (response A B)`
#### output: `A`
#### signature: `(unwrap-panic option-input)`
#### description:
The `unwrap` function attempts to 'unpack' its argument: if the argument is an option type, and the argument is a `(some ...)` option, this function returns the inner value of the option. If the argument is a response type, and the argument is an `(ok ...)` response, it returns the inner value of the `ok`. If the supplied argument is either an `(err ...)` or a `(none)` value, `unwrap` throws a runtime error, aborting any further processing of the current transaction.
#### example:
```clarity
(define-map names-map { name: (string-ascii 12) } { id: int })
(map-set names-map { name: \"blockstack\" } { id: 1337 })
(unwrap-panic (map-get? names-map { name: \"blockstack\" })) ;; Returns (tuple (id 1337))
(unwrap-panic (map-get? names-map { name: \"non-existant\" })) ;; Throws a runtime exception
```

### unwrap-err-panic
#### input: `(response A B)`
#### output: `B`
#### signature: `(unwrap-err-panic response-input)`
#### description:
The `unwrap-err` function attempts to 'unpack' the first argument: if the argument is an `(err ...)` response, `unwrap` returns the inner value of the `err`. If the supplied argument is an `(ok ...)` value, `unwrap-err` throws a runtime error, aborting any further processing of the current transaction.
#### example:
```clarity
(unwrap-err-panic (err 1)) ;; Returns 1
(unwrap-err-panic (ok 1)) ;; Throws a runtime exception
```

### match
#### input: `(optional A) name expression expression | (response A B) name expression name expression`
#### output: `C`
#### signature: `(match opt-input some-binding-name some-branch none-branch) |
(match-resp input ok-binding-name ok-branch err-binding-name err-branch)`
#### description:
The `match` function is used to test and destructure optional and response types.

If the `input` is an optional, it tests whether the provided `input` is a `some` or `none` option, and evaluates `some-branch` or `none-branch` in each respective case.

Within the `some-branch`, the _contained value_ of the `input` argument is bound to the provided `some-binding-name` name.

Only _one_ of the branches will be evaluated (similar to `if` statements).

If the `input` is a response, it tests whether the provided `input` is an `ok` or `err` response type, and evaluates `ok-branch` or `err-branch` in each respective case.

Within the `ok-branch`, the _contained ok value_ of the `input` argument is bound to the provided `ok-binding-name` name.

Within the `err-branch`, the _contained err value_ of the `input` argument is bound to the provided `err-binding-name` name.

Only _one_ of the branches will be evaluated (similar to `if` statements).

Note: Type checking requires that the type of both the ok and err parts of the response object be determinable. For situations in which one of the parts of a response is untyped, you should use `unwrap-panic` or `unwrap-err-panic` instead of `match`.
#### example:
```clarity

(define-private (add-10 (x (optional int)))
  (match x
  value (+ 10 value)
  10))
(add-10 (some 5)) ;; Returns 15
(add-10 none) ;; Returns 10

(define-private (add-or-pass-err (x (response int (string-ascii 10))) (to-add int))
  (match x
   value (ok (+ to-add value))
   err-value (err err-value)))
(add-or-pass-err (ok 5) 20) ;; Returns (ok 25)
(add-or-pass-err (err \"ERROR\") 20) ;; Returns (err \"ERROR\")
```

### try!
#### input: `(optional A) | (response A B)`
#### output: `A`
#### signature: `(try! option-input)`
#### description:
The `try!` function attempts to 'unpack' the first argument: if the argument is an option type, and the argument is a `(some ...)` option, `try!` returns the inner value of the option. If the argument is a response type, and the argument is an `(ok ...)` response, `try!` returns the inner value of the `ok`. If the supplied argument is either an `(err ...)` or a `none` value, `try!` _returns_ either `none` or the `(err ...)` value from the current function and exits the current control-flow.
#### example:
```clarity
(define-map names-map { name: (string-ascii 12) } { id: int })
(map-set names-map { name: \"blockstack\" } { id: 1337 })
(try! (map-get? names-map { name: \"blockstack\" })) ;; Returns (tuple (id 1337))
(define-private (checked-even (x int))
  (if (is-eq (mod x 2) 0)
      (ok x)
      (err false)))
(define-private (double-if-even (x int))
  (ok (* 2 (try! (checked-even x)))))
(double-if-even 10) ;; Returns (ok 20)
(double-if-even 3) ;; Returns (err false)
```

### is-ok
#### input: `(response A B)`
#### output: `bool`
#### signature: `(is-ok value)`
#### description:
`is-ok` tests a supplied response value, returning `true` if the response was `ok`, and `false` if it was an `err`.
#### example:
```clarity
(is-ok (ok 1)) ;; Returns true
(is-ok (err 1)) ;; Returns false
```

### is-none
#### input: `(optional A)`
#### output: `bool`
#### signature: `(is-none value)`
#### description:
`is-none` tests a supplied option value, returning `true` if the option value is `(none)`, and `false` if it is a `(some ...)`.
#### example:
```clarity
(define-map names-map { name: (string-ascii 12) } { id: int })
(map-set names-map { name: \"blockstack\" } { id: 1337 })
(is-none (get id (map-get? names-map { name: \"blockstack\" }))) ;; Returns false
(is-none (get id (map-get? names-map { name: \"non-existant\" }))) ;; Returns true
```

### is-err
#### input: `(response A B)`
#### output: `bool`
#### signature: `(is-err value)`
#### description:
`is-err` tests a supplied response value, returning `true` if the response was an `err`, and `false` if it was an `ok`.
#### example:
```clarity
(is-err (ok 1)) ;; Returns false
(is-err (err 1)) ;; Returns true
```

### is-some
#### input: `(optional A)`
#### output: `bool`
#### signature: `(is-some value)`
#### description:
`is-some` tests a supplied option value, returning `true` if the option value is `(some ...)`, and `false` if it is a `none`.
#### example:
```clarity

(define-map names-map { name: (string-ascii 12) } { id: int })
(map-set names-map { name: \"blockstack\" } { id: 1337 })
(is-some (get id (map-get? names-map { name: \"blockstack\" }))) ;; Returns true
(is-some (get id (map-get? names-map { name: \"non-existant\" }))) ;; Returns false
```

### filter
#### input: `Function(A) -> bool, sequence_A`
#### output: `sequence_A`
#### signature: `(filter func sequence)`
#### description:
The `filter` function applies the input function `func` to each element of the input sequence, and returns the same sequence with any elements removed for which `func` returned `false`. Applicable sequence types are `(list A)`, `buff`, `string-ascii` and `string-utf8`, for which the corresponding element types are, respectively, `A`, `(buff 1)`, `(string-ascii 1)` and `(string-utf8 1)`. The `func` argument must be a literal function name. `
#### example:
```clarity

(filter not (list true false true false)) ;; Returns (false false)
(define-private (is-a (char (string-utf8 1))) (is-eq char u\"a\"))
(filter is-a u\"acabd\") ;; Returns u\"aa\"
(define-private (is-zero (char (buff 1))) (is-eq char 0x00))
(filter is-zero 0x00010002) ;; Returns 0x0000
```

### ft-get-balance
#### input: `TokenName, principal`
#### output: `uint`
#### signature: `(ft-get-balance token-name principal)`
#### description:
`ft-get-balance` returns `token-name` balance of the principal `principal`. The token type must have been defined using `define-fungible-token`.
#### example:
```clarity
(define-fungible-token stackaroo)
(ft-mint? stackaroo u100 'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR)
(ft-get-balance stackaroo 'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR) ;; Returns u100
```

### nft-get-owner?
#### input: `AssetName, A`
#### output: `(optional principal)`
#### signature: `(nft-get-owner? asset-class asset-identifier)`
#### description:
`nft-get-owner?` returns the owner of an asset, identified by `asset-identifier`, or `none` if the asset does not exist. The asset type must have been defined using `define-non-fungible-token`, and the supplied `asset-identifier` must be of the same type specified in that definition.
#### example:
```clarity
(define-non-fungible-token stackaroo (string-ascii 40))
(nft-mint? stackaroo \"Roo\" 'SPAXYA5XS51713FDTQ8H94EJ4V579CXMTRNBZKSF)
(nft-get-owner? stackaroo \"Roo\") ;; Returns (some SPAXYA5XS51713FDTQ8H94EJ4V579CXMTRNBZKSF)
(nft-get-owner? stackaroo \"Too\") ;; Returns none
```

### ft-transfer?
#### input: `TokenName, uint, principal, principal`
#### output: `(response bool uint)`
#### signature: `(ft-transfer? token-name amount sender recipient)`
#### description:
`ft-transfer?` is used to increase the token balance for the `recipient` principal for a token type defined using `define-fungible-token` by debiting the `sender` principal. In contrast to `stx-transfer?`, any user can transfer the assets. When used, relevant guards need to be added.

This function returns (ok true) if the transfer is successful. In the event of an unsuccessful transfer it returns one of the following error codes:

`(err u1)` -- `sender` does not have enough balance to transfer `(err u2)` -- `sender` and `recipient` are the same principal `(err u3)` -- amount to send is non-positive
#### example:
```clarity
(define-fungible-token stackaroo)
(ft-mint? stackaroo u100 'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR)
(ft-transfer? stackaroo u50 'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR 'SPAXYA5XS51713FDTQ8H94EJ4V579CXMTRNBZKSF) ;; Returns (ok true)
(ft-transfer? stackaroo u60 'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR 'SPAXYA5XS51713FDTQ8H94EJ4V579CXMTRNBZKSF) ;; Returns (err u1)
```

### nft-transfer?
#### input: `AssetName, A, principal, principal`
#### output: `(response bool uint)`
#### signature: `(nft-transfer? asset-class asset-identifier sender recipient)`
#### description:
`nft-transfer?` is used to change the owner of an asset identified by `asset-identifier` from `sender` to `recipient`. The `asset-class` must have been defined by `define-non-fungible-token` and `asset-identifier` must be of the type specified in that definition. In contrast to `stx-transfer?`, any user can transfer the asset. When used, relevant guards need to be added.

This function returns (ok true) if the transfer is successful. In the event of an unsuccessful transfer it returns one of the following error codes:

`(err u1)` -- `sender` does not own the asset `(err u2)` -- `sender` and `recipient` are the same principal `(err u3)` -- asset identified by asset-identifier does not exist
#### example:
```clarity
(define-non-fungible-token stackaroo (string-ascii 40))
(nft-mint? stackaroo \"Roo\" 'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR)
(nft-transfer? stackaroo \"Roo\" 'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR 'SPAXYA5XS51713FDTQ8H94EJ4V579CXMTRNBZKSF) ;; Returns (ok true)
(nft-transfer? stackaroo \"Roo\" 'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR 'SPAXYA5XS51713FDTQ8H94EJ4V579CXMTRNBZKSF) ;; Returns (err u1)
(nft-transfer? stackaroo \"Stacka\" 'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR 'SPAXYA5XS51713FDTQ8H94EJ4V579CXMTRNBZKSF) ;; Returns (err u3)
```

### nft-mint?
#### input: `AssetName, A, principal`
#### output: `(response bool uint)`
#### signature: `(nft-mint? asset-class asset-identifier recipient)`
#### description:
`nft-mint?` is used to instantiate an asset and set that asset's owner to the `recipient` principal. The asset must have been defined using `define-non-fungible-token`, and the supplied `asset-identifier` must be of the same type specified in that definition.

If an asset identified by `asset-identifier` _already exists_, this function will return an error with the following error code:

`(err u1)`

Otherwise, on successfuly mint, it returns `(ok true)`. `
#### example:
```clarity
(define-non-fungible-token stackaroo (string-ascii 40))
(nft-mint? stackaroo \"Roo\" 'SPAXYA5XS51713FDTQ8H94EJ4V579CXMTRNBZKSF) ;; Returns (ok true)
```

### ft-mint?
#### input: `TokenName, uint, principal`
#### output: `(response bool uint)`
#### signature: `(ft-mint? token-name amount recipient)`
#### description:
`ft-mint?` is used to increase the token balance for the `recipient` principal for a token type defined using `define-fungible-token`. The increased token balance is _not_ transfered from another principal, but rather minted.

If a non-positive amount is provided to mint, this function returns `(err 1)`. Otherwise, on successfuly mint, it returns `(ok true)`. `
#### example:
```clarity
(define-fungible-token stackaroo)
(ft-mint? stackaroo u100 'SPAXYA5XS51713FDTQ8H94EJ4V579CXMTRNBZKSF) ;; Returns (ok true)
```

### ft-get-supply
#### input: `TokenName`
#### output: `uint`
#### signature: `(ft-get-supply token-name)`
#### description:
`ft-get-balance` returns `token-name` circulating supply. The token type must have been defined using `define-fungible-token`.
#### example:
```clarity
(define-fungible-token stackaroo)
(ft-mint? stackaroo u100 'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR)
(ft-get-supply stackaroo) ;; Returns u100
```

### ft-burn?
#### input: `TokenName, uint, principal`
#### output: `(response bool uint)`
#### signature: `(ft-burn? token-name amount sender)`
#### description:
`ft-burn?` is used to decrease the token balance for the `sender` principal for a token type defined using `define-fungible-token`. The decreased token balance is _not_ transfered to another principal, but rather destroyed, reducing the circulating supply.

If a non-positive amount is provided to burn, this function returns `(err 1)`. Otherwise, on successfuly burn, it returns `(ok true)`.

#### example:
```clarity

(define-fungible-token stackaroo)
(ft-mint? stackaroo u100 'SPAXYA5XS51713FDTQ8H94EJ4V579CXMTRNBZKSF) ;; Returns (ok true)
(ft-burn? stackaroo u50 'SPAXYA5XS51713FDTQ8H94EJ4V579CXMTRNBZKSF) ;; Returns (ok true)
```

### nft-burn?
#### input: `AssetName, A, principal`
#### output: `(response bool uint)`
#### signature: `(nft-burn? asset-class asset-identifier recipient)`
#### description:
`nft-burn?` is used to burn an asset and remove that asset's owner from the `recipient` principal. The asset must have been defined using `define-non-fungible-token`, and the supplied `asset-identifier` must be of the same type specified in that definition.

If an asset identified by `asset-identifier` _doesn't exist_, this function will return an error with the following error code:

`(err u1)`

Otherwise, on successfuly burn, it returns `(ok true)`. `
#### example:
```clarity
(define-non-fungible-token stackaroo (string-ascii 40))
(nft-mint? stackaroo \"Roo\" 'SPAXYA5XS51713FDTQ8H94EJ4V579CXMTRNBZKSF) ;; Returns (ok true)
(nft-burn? stackaroo \"Roo\" 'SPAXYA5XS51713FDTQ8H94EJ4V579CXMTRNBZKSF) ;; Returns (ok true)
```

### stx-get-balance
#### input: `principal`
#### output: `uint`
#### signature: `(stx-get-balance owner)`
#### description:
`stx-get-balance` is used to query the STX balance of the `owner` principal.

This function returns the STX balance of the `owner` principal. In the event that the `owner` principal isn't materialized, it returns 0.

#### example:
```clarity
(stx-get-balance 'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR) ;; Returns u0
(stx-get-balance (as-contract tx-sender)) ;; Returns u1000
```

### stx-transfer?
#### input: `uint, principal, principal`
#### output: `(response bool uint)`
#### signature: `(stx-transfer? amount sender recipient)`
#### description:
`stx-transfer?` is used to increase the STX balance for the `recipient` principal by debiting the `sender` principal. The `sender` principal _must_ be equal to the current context's `tx-sender`.

This function returns (ok true) if the transfer is successful. In the event of an unsuccessful transfer it returns one of the following error codes:

`(err u1)` -- `sender` does not have enough balance to transfer `(err u2)` -- `sender` and `recipient` are the same principal `(err u3)` -- amount to send is non-positive `(err u4)` -- the `sender` principal is not the current `tx-sender`

#### example:
```clarity

(as-contract
  (stx-transfer? u60 tx-sender 'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR)) ;; Returns (ok true)
(as-contract
  (stx-transfer? u50 'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR tx-sender)) ;; Returns (err u4)
```

### stx-burn?
#### input: `uint, principal`
#### output: `(response bool uint)`
#### signature: `(stx-burn? amount sender)`
#### description:
`stx-burn?` debits the `sender` principal's STX holdings by `amount`, destroying the STX. The `sender` principal _must_ be equal to the current context's `tx-sender`.

This function returns (ok true) if the transfer is successful. In the event of an unsuccessful transfer it returns one of the following error codes:

`(err u1)` -- `sender` does not have enough balance to transfer `(err u3)` -- amount to send is non-positive `(err u4)` -- the `sender` principal is not the current `tx-sender`

#### example:
```clarity
(as-contract
  (stx-burn? u60 tx-sender)) ;; Returns (ok true)
(as-contract
  (stx-burn? u50 'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR)) ;; Returns (err u4)
```

### define-constant
#### input: `MethodSignature, MethodBody`
#### output: `Not Applicable`
#### signature: `(define-constant name expression)`
#### description:
`define-constant` is used to define a private constant value in a smart contract. The expression passed into the definition is evaluated at contract launch, in the order that it is supplied in the contract. This can lead to undefined function or undefined variable errors in the event that a function or variable used in the expression has not been defined before the constant.

Like other kinds of definition statements, `define-constant` may only be used at the top level of a smart contract definition (i.e., you cannot put a define statement in the middle of a function body).

#### example:
```clarity

(define-constant four (+ 2 2))
(+ 4 four) ;; Returns 8
```

### define-private
#### input: `MethodSignature, MethodBody`
#### output: `Not Applicable`
#### signature: `(define-private (function-name (arg-name-0 arg-type-0) (arg-name-1 arg-type-1) ...) function-body)`
#### description:
`define-private` is used to define _private_ functions for a smart contract. Private functions may not be called from other smart contracts, nor may they be invoked directly by users. Instead, these functions may only be invoked by other functions defined in the same smart contract.

Like other kinds of definition statements, `define-private` may only be used at the top level of a smart contract definition (i.e., you cannot put a define statement in the middle of a function body).

Private functions may return any type.
#### example:
```clarity
(define-private (max-of (i1 int) (i2 int))
  (if (> i1 i2)
      i1
      i2))
(max-of 4 6) ;; Returns 6
```

### define-public
#### input: `MethodSignature, MethodBody`
#### output: `Not Applicable`
#### signature: `(define-public (function-name (arg-name-0 arg-type-0) (arg-name-1 arg-type-1) ...) function-body)`
#### description:
`define-public` is used to define a _public_ function and transaction for a smart contract. Public functions are callable from other smart contracts and may be invoked directly by users by submitting a transaction to the Stacks blockchain.

Like other kinds of definition statements, `define-public` may only be used at the top level of a smart contract definition (i.e., you cannot put a define statement in the middle of a function body).

Public functions _must_ return a ResponseType (using either `ok` or `err`). Any datamap modifications performed by a public function is aborted if the function returns an `err` type. Public functions may be invoked by other contracts via `contract-call?`.
#### example:
```clarity
(define-public (hello-world (input int))
  (begin (print (+ 2 input))
         (ok input)))
```

### define-read-only
#### input: `MethodSignature, MethodBody`
#### output: `Not Applicable`
#### signature: `(define-read-only (function-name (arg-name-0 arg-type-0) (arg-name-1 arg-type-1) ...) function-body)`
#### description:
`define-read-only` is used to define a _public read-only_ function for a smart contract. Such functions are callable from other smart contracts.

Like other kinds of definition statements, `define-read-only` may only be used at the top level of a smart contract definition (i.e., you cannot put a define statement in the middle of a function body).

Read-only functions may return any type. However, read-only functions may not perform any datamap modifications, or call any functions which perform such modifications. This is enforced both during type checks and during the execution of the function. Public read-only functions may be invoked by other contracts via `contract-call?`.
#### example:
```clarity
(define-read-only (just-return-one-hundred)
  (* 10 10))
  ```

### define-map
#### input: `MapName, TypeDefinition, TypeDefinition`
#### output: `Not Applicable`
#### signature: `(define-map map-name key-type value-type)`
#### description:
`define-map` is used to define a new datamap for use in a smart contract. Such maps are only modifiable by the current smart contract.

Maps are defined with a key type and value type, often these types are tuple types.

Like other kinds of definition statements, `define-map` may only be used at the top level of a smart contract definition (i.e., you cannot put a define statement in the middle of a function body).
#### example:
```clarity
(define-map squares { x: int } { square: int })
(define-private (add-entry (x int))
  (map-insert squares { x: 2 } { square: (* x x) }))
(add-entry 1)
(add-entry 2)
(add-entry 3)
(add-entry 4)
(add-entry 5)
```

### define-data-var
#### input: `VarName, TypeDefinition, Value`
#### output: `Not Applicable`
#### signature: `(define-data-var var-name type value)`
#### description:
`define-data-var` is used to define a new persisted variable for use in a smart contract. Such variable are only modifiable by the current smart contract.

Persisted variable are defined with a type and a value.

Like other kinds of definition statements, `define-data-var` may only be used at the top level of a smart contract definition (i.e., you cannot put a define statement in the middle of a function body).
#### example:
```clarity
(define-data-var size int 0)
(define-private (set-size (value int))
  (var-set size value))
(set-size 1)
(set-size 2)
```

### define-fungible-token
#### input: `TokenName, <uint>`
#### output: `Not Applicable`
#### signature: `(define-fungible-token token-name <total-supply>)`
#### description:
`define-fungible-token` is used to define a new fungible token class for use in the current contract.

The second argument, if supplied, defines the total supply of the fungible token. This ensures that all calls to the `ft-mint?` function will never be able to create more than `total-supply` tokens. If any such call were to increase the total supply of tokens passed that amount, that invocation of `ft-mint?` will result in a runtime error and abort.

Like other kinds of definition statements, `define-fungible-token` may only be used at the top level of a smart contract definition (i.e., you cannot put a define statement in the middle of a function body).

Tokens defined using `define-fungible-token` may be used in `ft-transfer?`, `ft-mint?`, and `ft-get-balance` functions`
#### example:
```clarity
(define-fungible-token stacks)
(define-fungible-token limited-supply-stacks u100)
```

### define-non-fungible-token
#### input: `AssetName, TypeSignature`
#### output: `Not Applicable`
#### signature: `(define-non-fungible-token asset-name asset-identifier-type)`
#### description:
`define-non-fungible-token` is used to define a new non-fungible token class for use in the current contract. Individual assets are identified by their asset identifier, which must be of the type `asset-identifier-type`. Asset identifiers are _unique_ identifiers.

Like other kinds of definition statements, `define-non-fungible-token` may only be used at the top level of a smart contract definition (i.e., you cannot put a define statement in the middle of a function body).

Assets defined using `define-non-fungible-token` may be used in `nft-transfer?`, `nft-mint?`, and `nft-get-owner?` functions`
#### example:
```clarity
(define-non-fungible-token names (buff 50))
```

### define-trait
#### input: `VarName, [MethodSignature]`
#### output: `Not Applicable`
#### signature: `(define-trait trait-name ((func1-name (arg1-type arg2-type ...) (return-type))))`
#### description:
`define-trait` is used to define a new trait definition for use in a smart contract. Other contracts can implement a given trait and then have their contract identifier being passed as function arguments in order to be called dynamically with `contract-call?`.

Traits are defined with a name, and a list functions defined with a name, a list of argument types, and return type.

Like other kinds of definition statements, `define-trait` may only be used at the top level of a smart contract definition (i.e., you cannot put a define statement in the middle of a function body).

#### example:
```clarity
(define-trait token-trait
    ((transfer? (principal principal uint) (response uint uint))
     (get-balance (principal) (response uint uint))))
```

### use-trait
#### input: `VarName, TraitIdentifier`
#### output: `Not Applicable`
#### signature: `(use-trait trait-alias trait-identifier)`
#### description:
`use-trait` is used to bring a trait, defined in another contract, to the current contract. Subsequent references to an imported trait are signaled with the syntax `<trait-alias>`.

Traits import are defined with a name, used as an alias, and a trait identifier. Trait identifiers can either be using the sugared syntax (.token-a.token-trait), or be fully qualified ('SPAXYA5XS51713FDTQ8H94EJ4V579CXMTRNBZKSF.token-a.token-trait).

Like other kinds of definition statements, `use-trait` may only be used at the top level of a smart contract definition (i.e., you cannot put such a statement in the middle of a function body).
#### example:
```clarity
(use-trait token-a-trait 'SPAXYA5XS51713FDTQ8H94EJ4V579CXMTRNBZKSF.token-a.token-trait)
(define-public (forward-get-balance (user principal) (contract <token-a-trait>))
  (begin
    (ok 1)))
```

### impl-trait
#### input: `TraitIdentifier`
#### output: `Not Applicable`
#### signature: `(impl-trait trait-identifier)`
#### description:
`impl-trait` can be use for asserting that a contract is fully implementing a given trait. Additional checks are being performed when the contract is being published, rejecting the deployment if the contract is violating the trait specification.

Trait identifiers can either be using the sugared syntax (.token-a.token-trait), or be fully qualified ('SPAXYA5XS51713FDTQ8H94EJ4V579CXMTRNBZKSF.token-a.token-trait).

Like other kinds of definition statements, `impl-trait` may only be used at the top level of a smart contract definition (i.e., you cannot put such a statement in the middle of a function body).

#### example:
```clarity
(impl-trait 'SPAXYA5XS51713FDTQ8H94EJ4V579CXMTRNBZKSF.token-a.token-trait)
(define-public (get-balance (account principal))
  (ok u0))
(define-public (transfer? (from principal) (to principal) (amount uint))
  (ok u0))
```
