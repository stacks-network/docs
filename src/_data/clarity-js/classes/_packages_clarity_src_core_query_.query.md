**[@blockstack/clarity](../README.md)**

> [Globals](../globals.md) / ["packages/clarity/src/core/query"](../modules/_packages_clarity_src_core_query_.md) / Query

# Class: Query

## Hierarchy

- **Query**

## Index

### Constructors

- [constructor](_packages_clarity_src_core_query_.query.md#constructor)

### Properties

- [atChaintip](_packages_clarity_src_core_query_.query.md#atchaintip)
- [method](_packages_clarity_src_core_query_.query.md#method)
- [receipt](_packages_clarity_src_core_query_.query.md#receipt)

### Methods

- [validate](_packages_clarity_src_core_query_.query.md#validate)

## Constructors

### constructor

\+ **new Query**(`method?`: [Method](../interfaces/_packages_clarity_src_core_types_.method.md), `atChaintip?`: undefined \| false \| true): [Query](_packages_clarity_src_core_query_.query.md)

_Defined in [packages/clarity/src/core/query.ts:6](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/core/query.ts#L6)_

#### Parameters:

| Name          | Type                                                                |
| ------------- | ------------------------------------------------------------------- |
| `method?`     | [Method](../interfaces/_packages_clarity_src_core_types_.method.md) |
| `atChaintip?` | undefined \| false \| true                                          |

**Returns:** [Query](_packages_clarity_src_core_query_.query.md)

## Properties

### atChaintip

• `Optional` **atChaintip**: undefined \| false \| true

_Defined in [packages/clarity/src/core/query.ts:6](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/core/query.ts#L6)_

---

### method

• `Optional` **method**: [Method](../interfaces/_packages_clarity_src_core_types_.method.md)

_Defined in [packages/clarity/src/core/query.ts:5](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/core/query.ts#L5)_

---

### receipt

• `Optional` **receipt**: [Receipt](../interfaces/_packages_clarity_src_core_types_.receipt.md)

_Defined in [packages/clarity/src/core/query.ts:4](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/core/query.ts#L4)_

## Methods

### validate

▸ **validate**(): Promise\<boolean>

_Defined in [packages/clarity/src/core/query.ts:13](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/core/query.ts#L13)_

**Returns:** Promise\<boolean>
