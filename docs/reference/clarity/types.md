---
description: The complete reference guide to all Clarity types.
---

# Types

### Clarity Type System

The type system contains the following types:

| Types                                                 | Notes                                                                                                                                                                                                         |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `int`                                                 | signed 128-bit integer                                                                                                                                                                                        |
| `uint`                                                | unsigned 128-bit integer                                                                                                                                                                                      |
| `bool`                                                | boolean value (`true` or `false`)                                                                                                                                                                             |
| `principal`                                           | object representing a principal (whether a contract principal or standard principal)                                                                                                                          |
| `(buff max-len)`                                      | The `buff` type in Clarity is a fixed-length byte sequence. You define it with a max length like `(buff 32)`, which represents a byte buffer of up to 32 bytes. Max `buff` length is 1,048,576 bytes (1 MiB). |
| `(string-ascii max-len)`                              | ASCII string of maximum length `max-len` . Max `string-ascii` length is 1,048,576 characters.                                                                                                                 |
| `(string-utf8 max-len)`                               | UTF-8 string of maximum length `max-len` . Max `string-utf8` length is 262,144 characters.                                                                                                                    |
| `(list max-len entry-type)`                           | list of maximum length `max-len`, with entries of type `entry-type`                                                                                                                                           |
| `{label-0: value-type-0, label-1: value-type-1, ...}` | tuple, group of data values with named fields                                                                                                                                                                 |
| `(optional some-type)`                                | an option type for objects that can either be `(some value)` or `none`                                                                                                                                        |
| `(response ok-type err-type)`                         | object used by public functions to commit their changes or abort. May be returned or used by other functions as well, however, only public functions have the commit/abort behavior.                          |
