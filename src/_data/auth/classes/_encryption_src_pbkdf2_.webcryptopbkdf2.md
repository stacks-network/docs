**[@stacks/auth](../README.md)**

> [Globals](../globals.md) / ["encryption/src/pbkdf2"](../modules/_encryption_src_pbkdf2_.md) / WebCryptoPbkdf2

# Class: WebCryptoPbkdf2

## Hierarchy

- **WebCryptoPbkdf2**

## Implements

- [Pbkdf2](../interfaces/_encryption_src_pbkdf2_.pbkdf2.md)

## Index

### Constructors

- [constructor](_encryption_src_pbkdf2_.webcryptopbkdf2.md#constructor)

### Properties

- [subtleCrypto](_encryption_src_pbkdf2_.webcryptopbkdf2.md#subtlecrypto)

### Methods

- [derive](_encryption_src_pbkdf2_.webcryptopbkdf2.md#derive)

## Constructors

### constructor

\+ **new WebCryptoPbkdf2**(`subtleCrypto`: SubtleCrypto): [WebCryptoPbkdf2](_encryption_src_pbkdf2_.webcryptopbkdf2.md)

_Defined in [packages/encryption/src/pbkdf2.ts:46](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/pbkdf2.ts#L46)_

#### Parameters:

| Name           | Type         |
| -------------- | ------------ |
| `subtleCrypto` | SubtleCrypto |

**Returns:** [WebCryptoPbkdf2](_encryption_src_pbkdf2_.webcryptopbkdf2.md)

## Properties

### subtleCrypto

• **subtleCrypto**: SubtleCrypto

_Defined in [packages/encryption/src/pbkdf2.ts:46](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/pbkdf2.ts#L46)_

## Methods

### derive

▸ **derive**(`password`: string, `salt`: Buffer, `iterations`: number, `keyLength`: number, `digest`: [Pbkdf2Digests](../modules/_encryption_src_pbkdf2_.md#pbkdf2digests)): Promise\<Buffer>

_Implementation of [Pbkdf2](../interfaces/\_encryption_src_pbkdf2_.pbkdf2.md)\_

_Defined in [packages/encryption/src/pbkdf2.ts:52](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/pbkdf2.ts#L52)_

#### Parameters:

| Name         | Type                                                                 |
| ------------ | -------------------------------------------------------------------- |
| `password`   | string                                                               |
| `salt`       | Buffer                                                               |
| `iterations` | number                                                               |
| `keyLength`  | number                                                               |
| `digest`     | [Pbkdf2Digests](../modules/_encryption_src_pbkdf2_.md#pbkdf2digests) |

**Returns:** Promise\<Buffer>
