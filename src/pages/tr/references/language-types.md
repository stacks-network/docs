---
title: Types
description: See a detailed list of all types for the Clarity language.
images:
  large: /images/pages/write-smart-contracts.svg
  sm: /images/pages/write-smart-contracts-sm.svg
---

## Clarity Type System

The type system contains the following types:

- `{label-0: value-type-0, label-1: value-type-1, ...}` - a group of data values with named fields, aka (_record_)[https://www.cs.cornell.edu/courses/cs312/2004fa/lectures/lecture3.htm].
- `(list max-len entry-type)` - a list of maximum length `max-len`, with entries of type `entry-type`
- `(response ok-type err-type)` - object used by public functions to commit their changes or abort. May be returned or used by other functions as well, however, only public functions have the commit/abort behavior.
- `(optional some-type)` - an option type for objects that can either be `(some value)` or `none`
- `(buff max-len)` := byte buffer of maximum length `max-len`.
- `(string-ascii max-len)` := ASCII string of maximum length `max-len`
- `(string-utf8 max-len)` := UTF-8 string of maximum length `max-len` (u"A smiley face emoji \u{1F600} as a utf8 string")
- `principal` := object representing a principal (whether a contract principal or standard principal).
- `bool` := boolean value (`true` or `false`)
- `int` := signed 128-bit integer
- `uint` := unsigned 128-bit integer
