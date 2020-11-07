**[@blockstack/clarity](../README.md)**

> [Globals](../globals.md) / ["packages/clarity/src/core/transaction"](../modules/_packages_clarity_src_core_transaction_.md) / Transaction

# Class: Transaction

## Hierarchy

- **Transaction**

## Index

### Constructors

- [constructor](_packages_clarity_src_core_transaction_.transaction.md#constructor)

### Properties

- [method](_packages_clarity_src_core_transaction_.transaction.md#method)
- [receipt](_packages_clarity_src_core_transaction_.transaction.md#receipt)
- [sender](_packages_clarity_src_core_transaction_.transaction.md#sender)

### Methods

- [sign](_packages_clarity_src_core_transaction_.transaction.md#sign)
- [validate](_packages_clarity_src_core_transaction_.transaction.md#validate)

## Constructors

### constructor

\+ **new Transaction**(`method?`: [Method](../interfaces/_packages_clarity_src_core_types_.method.md)): [Transaction](_packages_clarity_src_core_transaction_.transaction.md)

_Defined in [packages/clarity/src/core/transaction.ts:6](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/core/transaction.ts#L6)_

#### Parameters:

| Name      | Type                                                                |
| --------- | ------------------------------------------------------------------- |
| `method?` | [Method](../interfaces/_packages_clarity_src_core_types_.method.md) |

**Returns:** [Transaction](_packages_clarity_src_core_transaction_.transaction.md)

## Properties

### method

• `Optional` **method**: [Method](../interfaces/_packages_clarity_src_core_types_.method.md)

_Defined in [packages/clarity/src/core/transaction.ts:6](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/core/transaction.ts#L6)_

---

### receipt

• `Optional` **receipt**: [Receipt](../interfaces/_packages_clarity_src_core_types_.receipt.md)

_Defined in [packages/clarity/src/core/transaction.ts:5](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/core/transaction.ts#L5)_

---

### sender

• `Optional` **sender**: undefined \| string

_Defined in [packages/clarity/src/core/transaction.ts:4](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/core/transaction.ts#L4)_

## Methods

### sign

▸ **sign**(`sender`: string): Promise\<boolean>

_Defined in [packages/clarity/src/core/transaction.ts:19](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/core/transaction.ts#L19)_

#### Parameters:

| Name     | Type   |
| -------- | ------ |
| `sender` | string |

**Returns:** Promise\<boolean>

---

### validate

▸ **validate**(): Promise\<boolean>

_Defined in [packages/clarity/src/core/transaction.ts:12](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/core/transaction.ts#L12)_

**Returns:** Promise\<boolean>
