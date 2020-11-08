**[@stacks/auth](../README.md)**

> [Globals](../globals.md) / ["common/src/utils"](../modules/_common_src_utils_.md) / GetGlobalObjectOptions

# Interface: GetGlobalObjectOptions

## Hierarchy

- **GetGlobalObjectOptions**

## Index

### Properties

- [returnEmptyObject](_common_src_utils_.getglobalobjectoptions.md#returnemptyobject)
- [throwIfUnavailable](_common_src_utils_.getglobalobjectoptions.md#throwifunavailable)
- [usageDesc](_common_src_utils_.getglobalobjectoptions.md#usagedesc)

## Properties

### returnEmptyObject

• `Optional` **returnEmptyObject**: undefined \| false \| true

_Defined in [packages/common/src/utils.ts:243](https://github.com/blockstack/blockstack.js/blob/26419086/packages/common/src/utils.ts#L243)_

If the object is not found, return an new empty object instead of undefined.
Requires [throwIfUnavailable](_common_src_utils_.getglobalobjectoptions.md#throwifunavailable) to be falsey.

**`default`** false

---

### throwIfUnavailable

• `Optional` **throwIfUnavailable**: undefined \| false \| true

_Defined in [packages/common/src/utils.ts:233](https://github.com/blockstack/blockstack.js/blob/26419086/packages/common/src/utils.ts#L233)_

Throw an error if the object is not found.

**`default`** false

---

### usageDesc

• `Optional` **usageDesc**: undefined \| string

_Defined in [packages/common/src/utils.ts:237](https://github.com/blockstack/blockstack.js/blob/26419086/packages/common/src/utils.ts#L237)_

Additional information to include in an error if thrown.
