**[@stacks/auth](../README.md)**

> [Globals](../globals.md) / ["encryption/src/aesCipher"](../modules/_encryption_src_aescipher_.md) / WebCryptoAesCipher

# Class: WebCryptoAesCipher

## Hierarchy

- **WebCryptoAesCipher**

## Implements

- [AesCipher](../interfaces/_encryption_src_aescipher_.aescipher.md)

## Index

### Constructors

- [constructor](_encryption_src_aescipher_.webcryptoaescipher.md#constructor)

### Properties

- [subtleCrypto](_encryption_src_aescipher_.webcryptoaescipher.md#subtlecrypto)

### Methods

- [decrypt](_encryption_src_aescipher_.webcryptoaescipher.md#decrypt)
- [encrypt](_encryption_src_aescipher_.webcryptoaescipher.md#encrypt)

## Constructors

### constructor

\+ **new WebCryptoAesCipher**(`subtleCrypto`: SubtleCrypto): [WebCryptoAesCipher](_encryption_src_aescipher_.webcryptoaescipher.md)

_Defined in [packages/encryption/src/aesCipher.ts:54](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/aesCipher.ts#L54)_

#### Parameters:

| Name           | Type         |
| -------------- | ------------ |
| `subtleCrypto` | SubtleCrypto |

**Returns:** [WebCryptoAesCipher](_encryption_src_aescipher_.webcryptoaescipher.md)

## Properties

### subtleCrypto

• **subtleCrypto**: SubtleCrypto

_Defined in [packages/encryption/src/aesCipher.ts:54](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/aesCipher.ts#L54)_

## Methods

### decrypt

▸ **decrypt**(`algorithm`: [CipherAlgorithm](../modules/_encryption_src_aescipher_.md#cipheralgorithm), `key`: Buffer, `iv`: Buffer, `data`: Buffer): Promise\<Buffer>

_Implementation of [AesCipher](../interfaces/\_encryption_src_aescipher_.aescipher.md)\_

_Defined in [packages/encryption/src/aesCipher.ts:84](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/aesCipher.ts#L84)_

#### Parameters:

| Name        | Type                                                                        |
| ----------- | --------------------------------------------------------------------------- |
| `algorithm` | [CipherAlgorithm](../modules/_encryption_src_aescipher_.md#cipheralgorithm) |
| `key`       | Buffer                                                                      |
| `iv`        | Buffer                                                                      |
| `data`      | Buffer                                                                      |

**Returns:** Promise\<Buffer>

---

### encrypt

▸ **encrypt**(`algorithm`: [CipherAlgorithm](../modules/_encryption_src_aescipher_.md#cipheralgorithm), `key`: Buffer, `iv`: Buffer, `data`: Buffer): Promise\<Buffer>

_Implementation of [AesCipher](../interfaces/\_encryption_src_aescipher_.aescipher.md)\_

_Defined in [packages/encryption/src/aesCipher.ts:60](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/aesCipher.ts#L60)_

#### Parameters:

| Name        | Type                                                                        |
| ----------- | --------------------------------------------------------------------------- |
| `algorithm` | [CipherAlgorithm](../modules/_encryption_src_aescipher_.md#cipheralgorithm) |
| `key`       | Buffer                                                                      |
| `iv`        | Buffer                                                                      |
| `data`      | Buffer                                                                      |

**Returns:** Promise\<Buffer>
