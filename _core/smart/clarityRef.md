---
layout: core
description: "Blockstack smart contracting language"
permalink: /:collection/:path.html
---
# Language Reference

This file contains the reference for the Clarity language. 

* TOC
{:toc}

## Supported types

This section lists the types available to smart contracts. The only atomic types supported by the Clarity are booleans, integers, fixed length buffers, and principals. 

### Int type

The integer type in the Clarity language is a 16-byte signed integer, which allows it to specify the maximum amount of microstacks spendable in a single Stacks transfer. The special `BlockHeightInt` you can obtain with the `get-block-info` function.

### Uint type

The unsigned integer type (`uint`) in the Clarity language is a 16-byte unsigned integer. Using the unsigned type can ensure that any value underflows (negative numbers) will cause a transaction to be aborted.

Anywhere a developer wishes to use a literal unsigned integer (for example, incrementing or decrementing an input by a constant) the integer literal should use the `u` prefix, e.g., `u123`.

### Bool type

Supports values of `'true` or `'false`. 

### Buffer type

Buffer types represent fixed-length byte buffers. A Buffer can either be constructed using:
- String literals, for example `"alice.id"` or `hash160("bob.id")`,
- Hexadecimals literals, for example `0xABCDEF`.

All of the hash functions return buffers:

`hash160`
`sha256`
`keccak256`

The block properties `header-hash`, `burnchain-header-hash`, and `vrf-seed` are all buffers.

### List type

Clarity supports lists of the atomic types. However, the only variable length lists in the language appear as function inputs.

### Principal type

Clarity provides this primitive for checking whether or not the smart contract transaction was signed by a particular principal. Principals represent a spending entity and are roughly equivalent to a Stacks address. The principal's signature is not checked by the smart contract, but by the virtual machine. A smart contract function can use the  globally defined `tx-sender` variable to obtain the current principal.

Smart contracts may also be principals (represented by the smart contract's identifier). However, there is no private key associated with the smart contract, and it cannot broadcast a signed transaction on the blockchain. A smart contract uses the special variable `contract-name` to refer to its own principal.

[//]: #  You can use the `is-contract?` to determine whether a given principal corresponds to a smart contract. 

### Tuple type

To support the use of named fields in keys and values, Clarity  allows the construction of named tuples using a function `(tuple ...)`, for example

```cl
(define-constant imaginary-number-a (tuple (real 1) (i 2)))
(define-constant imaginary-number-b (tuple (real 2) (i 3)))
```

This allows for creating named tuples on the fly, which is useful for data maps where the keys and values are themselves named tuples. Values in a given mapping are set or fetched using:

<table class="uk-table uk-table-small">
<tr>
  <th class="uk-width-small">Function</th>
  <th>Description</th>
</tr>
<tr>
  <td><code>(map-get map-name key-tuple)</code></td>
  <td>Fetches the value associated with a given key in the map, or returns <code>none</code> if there is no such value.</td>
</tr>
<tr>
   <td><code>(map-set! map-name key-tuple value-tuple)</code></td>
  <td>Sets the value of key-tuple in the data map</td>
</tr>
  <tr>
   <td><code>(map-insert! map-name key-tuple value-tuple)</code></td>
  <td>Sets the value of key-tuple in the data map if and only if an entry does not already exist.</td>
</tr>
  <tr>
   <td><code>(map-delete! map-name key-tuple)</code></td>
  <td>Deletes key-tuple from the data map.</td>
</tr>
</table>


To access a named value of a given tuple, the `(get name tuple)` function returns that item from the tuple.

### Optional type

Represents an optional value. This is used in place of the typical usage of "null" values in other languages, and represents a type that can either be some value or `none`. Optional types are used as the return types of data-map functions.

### Response type

Response types represent the result of a public function. Use this type to indicate and return data associated with the execution of the function. Also, the response should indicate whether the function error'ed (and therefore did not materialize any data in the database) or ran `ok` (in which case data materialized in the database).

Response types contain two subtypes -- a response type in the event of `ok` (that is, a public function returns an integer code on success) and an `err` type (that is, a function returns a buffer on error).

### Algebraic

Clarity supports limited algebraic data types, it has an `(optional A)` type and a `(response A B)` type.  An `(optioanl A)` type can either be `(some A)` or `(none)`, and a `(response A B)` type can either be `(ok A)` or `(err B)`.  For example, `(some u3)` and `(none)` would have type `(optional uint)`, and `(ok \"woot!\")` and `(err 'false)` would have type `(response (buff 5) bool)`.

The algebraic data types have two variants (e.g. `(some ...)` or `(none)`; `(ok ...)` or `(err ...)`).

The `default-to`, `expects`, and `expects-err!` functions unpack algebraic data types. To *unpack* means to extract one of the "inner" types.  Unpacking an `(optional A)` means to do something to get at `A`, and unpacking `(response A B)` means to do something to get at ether `A` or `B` (where "do something" is specific to the function doing the unpacking). The built-in functions that "unpack" an algebraic data type each behave differently.  


## Keyword reference

{% capture keyword_list %}
{% for entry in site.data.clarityRef.keywords %}
{{ entry.name }}||{{ entry.output_type }}||{{ entry.description }}||{{ entry.example }}
{% if forloop.last == false %}::{% endif%}
{% endfor %}
{% endcapture %}
{% assign keyword_array = keyword_list | split: '::' | sort %}	
{% for keyword in keyword_array %}
{% assign keyword_vals = keyword | split: '||' %}
### {{keyword_vals[0] | lstrip | rstrip}}

<code>{{keyword_vals[1] | lstrip | rstrip }}</code> 

{{keyword_vals[2]}}

**Example**

```cl
{{keyword_vals[3] | lstrip | rstrip }}
```
<hr class="uk-divider-icon">
{% endfor %}


## Function reference

{% capture function_list %}
{% for entry in site.data.clarityRef.functions %}
{{ entry.name }}||{{ entry.signature }}||{{ entry.input_type }}||{{ entry.output_type }}||{{ entry.description }}||{{ entry.example }}
{% if forloop.last == false %}::{% endif%}
{% endfor %}
{% endcapture %}
{% assign function_array = function_list | split: '::' | sort %}	
{% for function in function_array %}
{% assign function_vals = function | split: '||' %}
### {{function_vals[0] | lstrip | rstrip}}

**Syntax**
```{{function_vals[1] | lstrip | rstrip }} ```

INPUT: <code>{{function_vals[2] | lstrip | rstrip }}</code><br>
OUTPUT: <code>{{function_vals[3] | lstrip | rstrip }}</code>

{{function_vals[4]}}

**Example**

```cl
{{function_vals[5] | lstrip | rstrip }}
```
<hr class="uk-divider-icon">
{% endfor %}

