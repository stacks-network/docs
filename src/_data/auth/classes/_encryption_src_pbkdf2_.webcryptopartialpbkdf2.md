**[@stacks/auth](../README.md)**

> [Globals](../globals.md) / ["encryption/src/pbkdf2"](../modules/_encryption_src_pbkdf2_.md) / WebCryptoPartialPbkdf2

# Class: WebCryptoPartialPbkdf2

## Hierarchy

- **WebCryptoPartialPbkdf2**

## Implements

- [Pbkdf2](../interfaces/_encryption_src_pbkdf2_.pbkdf2.md)

## Index

### Constructors

- [constructor](_encryption_src_pbkdf2_.webcryptopartialpbkdf2.md#constructor)

### Properties

- [subtleCrypto](_encryption_src_pbkdf2_.webcryptopartialpbkdf2.md#subtlecrypto)

### Methods

- [derive](_encryption_src_pbkdf2_.webcryptopartialpbkdf2.md#derive)

## Constructors

### constructor

\+ **new WebCryptoPartialPbkdf2**(`subtleCrypto`: SubtleCrypto): [WebCryptoPartialPbkdf2](_encryption_src_pbkdf2_.webcryptopartialpbkdf2.md)

_Defined in [packages/encryption/src/pbkdf2.ts:98](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/pbkdf2.ts#L98)_

#### Parameters:

| Name           | Type         |
| -------------- | ------------ |
| `subtleCrypto` | SubtleCrypto |

**Returns:** [WebCryptoPartialPbkdf2](_encryption_src_pbkdf2_.webcryptopartialpbkdf2.md)

## Properties

### subtleCrypto

• **subtleCrypto**: SubtleCrypto

_Defined in [packages/encryption/src/pbkdf2.ts:98](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/pbkdf2.ts#L98)_

## Methods

### derive

▸ **derive**(`password`: string, `salt`: Buffer, `iterations`: number, `keyLength`: number, `digest`: [Pbkdf2Digests](../modules/_encryption_src_pbkdf2_.md#pbkdf2digests)): Promise\<Buffer>

_Implementation of [Pbkdf2](../interfaces/\_encryption_src_pbkdf2_.pbkdf2.md)\_

_Defined in [packages/encryption/src/pbkdf2.ts:104](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/pbkdf2.ts#L104)_

#### Parameters:

| Name         | Type                                                                 |
| ------------ | -------------------------------------------------------------------- |
| `password`   | string                                                               |
| `salt`       | Buffer                                                               |
| `iterations` | number                                                               |
| `keyLength`  | number                                                               |
| `digest`     | [Pbkdf2Digests](../modules/_encryption_src_pbkdf2_.md#pbkdf2digests) |

**Returns:** Promise\<Buffer>
