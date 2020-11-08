**[@stacks/auth](../README.md)**

> [Globals](../globals.md) / ["encryption/src/sha2Hash"](../modules/_encryption_src_sha2hash_.md) / NodeCryptoSha2Hash

# Class: NodeCryptoSha2Hash

## Hierarchy

- **NodeCryptoSha2Hash**

## Index

### Constructors

- [constructor](_encryption_src_sha2hash_.nodecryptosha2hash.md#constructor)

### Properties

- [createHash](_encryption_src_sha2hash_.nodecryptosha2hash.md#createhash)

### Methods

- [digest](_encryption_src_sha2hash_.nodecryptosha2hash.md#digest)

## Constructors

### constructor

\+ **new NodeCryptoSha2Hash**(`createHash`: [NodeCryptoCreateHash](../modules/_encryption_src_sha2hash_.md#nodecryptocreatehash)): [NodeCryptoSha2Hash](_encryption_src_sha2hash_.nodecryptosha2hash.md)

_Defined in [packages/encryption/src/sha2Hash.ts:11](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/sha2Hash.ts#L11)_

#### Parameters:

| Name         | Type                                                                                 |
| ------------ | ------------------------------------------------------------------------------------ |
| `createHash` | [NodeCryptoCreateHash](../modules/_encryption_src_sha2hash_.md#nodecryptocreatehash) |

**Returns:** [NodeCryptoSha2Hash](_encryption_src_sha2hash_.nodecryptosha2hash.md)

## Properties

### createHash

• **createHash**: [NodeCryptoCreateHash](../modules/_encryption_src_sha2hash_.md#nodecryptocreatehash)

_Defined in [packages/encryption/src/sha2Hash.ts:11](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/sha2Hash.ts#L11)_

## Methods

### digest

▸ **digest**(`data`: Buffer, `algorithm?`: string): Promise\<Buffer>

_Defined in [packages/encryption/src/sha2Hash.ts:17](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/sha2Hash.ts#L17)_

#### Parameters:

| Name        | Type   | Default value |
| ----------- | ------ | ------------- |
| `data`      | Buffer | -             |
| `algorithm` | string | "sha256"      |

**Returns:** Promise\<Buffer>
