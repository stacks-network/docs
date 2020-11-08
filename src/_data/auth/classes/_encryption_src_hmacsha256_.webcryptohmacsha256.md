**[@stacks/auth](../README.md)**

> [Globals](../globals.md) / ["encryption/src/hmacSha256"](../modules/_encryption_src_hmacsha256_.md) / WebCryptoHmacSha256

# Class: WebCryptoHmacSha256

## Hierarchy

- **WebCryptoHmacSha256**

## Implements

- [Hmac](../interfaces/_encryption_src_hmacsha256_.hmac.md)

## Index

### Constructors

- [constructor](_encryption_src_hmacsha256_.webcryptohmacsha256.md#constructor)

### Properties

- [subtleCrypto](_encryption_src_hmacsha256_.webcryptohmacsha256.md#subtlecrypto)

### Methods

- [digest](_encryption_src_hmacsha256_.webcryptohmacsha256.md#digest)

## Constructors

### constructor

\+ **new WebCryptoHmacSha256**(`subtleCrypto`: SubtleCrypto): [WebCryptoHmacSha256](_encryption_src_hmacsha256_.webcryptohmacsha256.md)

_Defined in [packages/encryption/src/hmacSha256.ts:25](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/hmacSha256.ts#L25)_

#### Parameters:

| Name           | Type         |
| -------------- | ------------ |
| `subtleCrypto` | SubtleCrypto |

**Returns:** [WebCryptoHmacSha256](_encryption_src_hmacsha256_.webcryptohmacsha256.md)

## Properties

### subtleCrypto

• **subtleCrypto**: SubtleCrypto

_Defined in [packages/encryption/src/hmacSha256.ts:25](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/hmacSha256.ts#L25)_

## Methods

### digest

▸ **digest**(`key`: Buffer, `data`: Buffer): Promise\<Buffer>

_Implementation of [Hmac](../interfaces/\_encryption_src_hmacsha256_.hmac.md)\_

_Defined in [packages/encryption/src/hmacSha256.ts:31](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/hmacSha256.ts#L31)_

#### Parameters:

| Name   | Type   |
| ------ | ------ |
| `key`  | Buffer |
| `data` | Buffer |

**Returns:** Promise\<Buffer>
