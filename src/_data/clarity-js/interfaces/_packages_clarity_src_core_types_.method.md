**[@blockstack/clarity](../README.md)**

> [Globals](../globals.md) / ["packages/clarity/src/core/types"](../modules/_packages_clarity_src_core_types_.md) / Method

# Interface: Method

Describes a function of a smart contract. This can be
a public or read-only function.

## Hierarchy

- **Method**

## Index

### Properties

- [args](_packages_clarity_src_core_types_.method.md#args)
- [name](_packages_clarity_src_core_types_.method.md#name)

## Properties

### args

• **args**: string[]

_Defined in [packages/clarity/src/core/types.ts:21](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/core/types.ts#L21)_

list of function arguments. Arguments are converted to Clarity Values following
the same rules as if you would enter the values into the command line

---

### name

• **name**: string

_Defined in [packages/clarity/src/core/types.ts:16](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/core/types.ts#L16)_

function name
