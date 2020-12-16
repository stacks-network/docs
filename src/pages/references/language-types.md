---
title: Types
description: See a detailed list of all types for the Clarity language.
images:
  large: /images/pages/write-smart-contracts.svg
  sm: /images/pages/write-smart-contracts-sm.svg
---

## Clarity Type System

The type system contains the following types:

- `(tuple (key-name-0 key-type-0) (key-name-1 key-type-1) ...)` -
  a typed tuple with named fields.
- `(list max-len entry-type)` - a list of maximum length `max-len`, with
  entries of type `entry-type`
- `(response ok-type err-type)` - object used by public functions to commit
  their changes or abort. May be returned or used by other functions as
  well, however, only public functions have the commit/abort behavior.
- `(optional some-type)` - an option type for objects that can either be
  `(some value)` or `none`
- `(buff max-len)` := byte buffer or maximum length `max-len`.
- `(string-ascii max-len)` := ASCII string of maximum length `max-len`
- `(string-utf8 max-len)` := UTF-8 string of maximum length `max-len` (u"A smiley face emoji \u{1F600} as a utf8 string")
- `principal` := object representing a principal (whether a contract principal
  or standard principal).
- `bool` := boolean value (`true` or `false`)
- `int` := signed 128-bit integer
- `uint` := unsigned 128-bit integer
