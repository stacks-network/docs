**[@stacks/auth](../README.md)**

> [Globals](../globals.md) / ["encryption/src/hashRipemd160"](../modules/_encryption_src_hashripemd160_.md) / NodeCryptoRipemd160Digest

# Class: NodeCryptoRipemd160Digest

## Hierarchy

- **NodeCryptoRipemd160Digest**

## Implements

- [Ripemd160Digest](../interfaces/_encryption_src_hashripemd160_.ripemd160digest.md)

## Index

### Constructors

- [constructor](_encryption_src_hashripemd160_.nodecryptoripemd160digest.md#constructor)

### Properties

- [nodeCryptoCreateHash](_encryption_src_hashripemd160_.nodecryptoripemd160digest.md#nodecryptocreatehash)

### Methods

- [digest](_encryption_src_hashripemd160_.nodecryptoripemd160digest.md#digest)

## Constructors

### constructor

\+ **new NodeCryptoRipemd160Digest**(`nodeCryptoCreateHash`: [NodeCryptoCreateHash](../modules/_encryption_src_hashripemd160_.md#nodecryptocreatehash)): [NodeCryptoRipemd160Digest](_encryption_src_hashripemd160_.nodecryptoripemd160digest.md)

_Defined in [packages/encryption/src/hashRipemd160.ts:24](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/hashRipemd160.ts#L24)_

#### Parameters:

| Name                   | Type                                                                                      |
| ---------------------- | ----------------------------------------------------------------------------------------- |
| `nodeCryptoCreateHash` | [NodeCryptoCreateHash](../modules/_encryption_src_hashripemd160_.md#nodecryptocreatehash) |

**Returns:** [NodeCryptoRipemd160Digest](_encryption_src_hashripemd160_.nodecryptoripemd160digest.md)

## Properties

### nodeCryptoCreateHash

• **nodeCryptoCreateHash**: [NodeCryptoCreateHash](../modules/_encryption_src_hashripemd160_.md#nodecryptocreatehash)

_Defined in [packages/encryption/src/hashRipemd160.ts:24](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/hashRipemd160.ts#L24)_

## Methods

### digest

▸ **digest**(`data`: Buffer): Buffer

_Implementation of [Ripemd160Digest](../interfaces/\_encryption_src_hashripemd160_.ripemd160digest.md)\_

_Defined in [packages/encryption/src/hashRipemd160.ts:30](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/hashRipemd160.ts#L30)_

#### Parameters:

| Name   | Type   |
| ------ | ------ |
| `data` | Buffer |

**Returns:** Buffer
