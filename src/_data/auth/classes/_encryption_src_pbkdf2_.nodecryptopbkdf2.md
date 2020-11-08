**[@stacks/auth](../README.md)**

> [Globals](../globals.md) / ["encryption/src/pbkdf2"](../modules/_encryption_src_pbkdf2_.md) / NodeCryptoPbkdf2

# Class: NodeCryptoPbkdf2

## Hierarchy

- **NodeCryptoPbkdf2**

## Implements

- [Pbkdf2](../interfaces/_encryption_src_pbkdf2_.pbkdf2.md)

## Index

### Constructors

- [constructor](_encryption_src_pbkdf2_.nodecryptopbkdf2.md#constructor)

### Properties

- [nodePbkdf2](_encryption_src_pbkdf2_.nodecryptopbkdf2.md#nodepbkdf2)

### Methods

- [derive](_encryption_src_pbkdf2_.nodecryptopbkdf2.md#derive)

## Constructors

### constructor

\+ **new NodeCryptoPbkdf2**(`nodePbkdf2`: [NodePbkdf2Fn](../modules/_encryption_src_pbkdf2_.md#nodepbkdf2fn)): [NodeCryptoPbkdf2](_encryption_src_pbkdf2_.nodecryptopbkdf2.md)

_Defined in [packages/encryption/src/pbkdf2.ts:18](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/pbkdf2.ts#L18)_

#### Parameters:

| Name         | Type                                                               |
| ------------ | ------------------------------------------------------------------ |
| `nodePbkdf2` | [NodePbkdf2Fn](../modules/_encryption_src_pbkdf2_.md#nodepbkdf2fn) |

**Returns:** [NodeCryptoPbkdf2](_encryption_src_pbkdf2_.nodecryptopbkdf2.md)

## Properties

### nodePbkdf2

• **nodePbkdf2**: [NodePbkdf2Fn](../modules/_encryption_src_pbkdf2_.md#nodepbkdf2fn)

_Defined in [packages/encryption/src/pbkdf2.ts:18](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/pbkdf2.ts#L18)_

## Methods

### derive

▸ **derive**(`password`: string, `salt`: Buffer, `iterations`: number, `keyLength`: number, `digest`: [Pbkdf2Digests](../modules/_encryption_src_pbkdf2_.md#pbkdf2digests)): Promise\<Buffer>

_Implementation of [Pbkdf2](../interfaces/\_encryption_src_pbkdf2_.pbkdf2.md)\_

_Defined in [packages/encryption/src/pbkdf2.ts:24](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/pbkdf2.ts#L24)_

#### Parameters:

| Name         | Type                                                                 |
| ------------ | -------------------------------------------------------------------- |
| `password`   | string                                                               |
| `salt`       | Buffer                                                               |
| `iterations` | number                                                               |
| `keyLength`  | number                                                               |
| `digest`     | [Pbkdf2Digests](../modules/_encryption_src_pbkdf2_.md#pbkdf2digests) |

**Returns:** Promise\<Buffer>
