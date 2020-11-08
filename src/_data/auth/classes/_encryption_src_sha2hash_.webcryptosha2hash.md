**[@stacks/auth](../README.md)**

> [Globals](../globals.md) / ["encryption/src/sha2Hash"](../modules/_encryption_src_sha2hash_.md) / WebCryptoSha2Hash

# Class: WebCryptoSha2Hash

## Hierarchy

- **WebCryptoSha2Hash**

## Implements

- [Sha2Hash](../interfaces/_encryption_src_sha2hash_.sha2hash.md)

## Index

### Constructors

- [constructor](_encryption_src_sha2hash_.webcryptosha2hash.md#constructor)

### Properties

- [subtleCrypto](_encryption_src_sha2hash_.webcryptosha2hash.md#subtlecrypto)

### Methods

- [digest](_encryption_src_sha2hash_.webcryptosha2hash.md#digest)

## Constructors

### constructor

\+ **new WebCryptoSha2Hash**(`subtleCrypto`: SubtleCrypto): [WebCryptoSha2Hash](_encryption_src_sha2hash_.webcryptosha2hash.md)

_Defined in [packages/encryption/src/sha2Hash.ts:34](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/sha2Hash.ts#L34)_

#### Parameters:

| Name           | Type         |
| -------------- | ------------ |
| `subtleCrypto` | SubtleCrypto |

**Returns:** [WebCryptoSha2Hash](_encryption_src_sha2hash_.webcryptosha2hash.md)

## Properties

### subtleCrypto

• **subtleCrypto**: SubtleCrypto

_Defined in [packages/encryption/src/sha2Hash.ts:34](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/sha2Hash.ts#L34)_

## Methods

### digest

▸ **digest**(`data`: Buffer, `algorithm?`: string): Promise\<Buffer>

_Defined in [packages/encryption/src/sha2Hash.ts:40](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/sha2Hash.ts#L40)_

#### Parameters:

| Name        | Type   | Default value |
| ----------- | ------ | ------------- |
| `data`      | Buffer | -             |
| `algorithm` | string | "sha256"      |

**Returns:** Promise\<Buffer>
