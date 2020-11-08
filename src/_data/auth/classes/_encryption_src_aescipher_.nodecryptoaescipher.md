**[@stacks/auth](../README.md)**

> [Globals](../globals.md) / ["encryption/src/aesCipher"](../modules/_encryption_src_aescipher_.md) / NodeCryptoAesCipher

# Class: NodeCryptoAesCipher

## Hierarchy

- **NodeCryptoAesCipher**

## Implements

- [AesCipher](../interfaces/_encryption_src_aescipher_.aescipher.md)

## Index

### Constructors

- [constructor](_encryption_src_aescipher_.nodecryptoaescipher.md#constructor)

### Properties

- [createCipher](_encryption_src_aescipher_.nodecryptoaescipher.md#createcipher)
- [createDecipher](_encryption_src_aescipher_.nodecryptoaescipher.md#createdecipher)

### Methods

- [decrypt](_encryption_src_aescipher_.nodecryptoaescipher.md#decrypt)
- [encrypt](_encryption_src_aescipher_.nodecryptoaescipher.md#encrypt)

## Constructors

### constructor

\+ **new NodeCryptoAesCipher**(`createCipher`: [NodeCryptoCreateCipher](../modules/_encryption_src_aescipher_.md#nodecryptocreatecipher), `createDecipher`: [NodeCryptoCreateDecipher](../modules/_encryption_src_aescipher_.md#nodecryptocreatedecipher)): [NodeCryptoAesCipher](_encryption_src_aescipher_.nodecryptoaescipher.md)

_Defined in [packages/encryption/src/aesCipher.ts:17](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/aesCipher.ts#L17)_

#### Parameters:

| Name             | Type                                                                                          |
| ---------------- | --------------------------------------------------------------------------------------------- |
| `createCipher`   | [NodeCryptoCreateCipher](../modules/_encryption_src_aescipher_.md#nodecryptocreatecipher)     |
| `createDecipher` | [NodeCryptoCreateDecipher](../modules/_encryption_src_aescipher_.md#nodecryptocreatedecipher) |

**Returns:** [NodeCryptoAesCipher](_encryption_src_aescipher_.nodecryptoaescipher.md)

## Properties

### createCipher

• **createCipher**: [NodeCryptoCreateCipher](../modules/_encryption_src_aescipher_.md#nodecryptocreatecipher)

_Defined in [packages/encryption/src/aesCipher.ts:15](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/aesCipher.ts#L15)_

---

### createDecipher

• **createDecipher**: [NodeCryptoCreateDecipher](../modules/_encryption_src_aescipher_.md#nodecryptocreatedecipher)

_Defined in [packages/encryption/src/aesCipher.ts:17](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/aesCipher.ts#L17)_

## Methods

### decrypt

▸ **decrypt**(`algorithm`: [CipherAlgorithm](../modules/_encryption_src_aescipher_.md#cipheralgorithm), `key`: Buffer, `iv`: Buffer, `data`: Buffer): Promise\<Buffer>

_Implementation of [AesCipher](../interfaces/\_encryption_src_aescipher_.aescipher.md)\_

_Defined in [packages/encryption/src/aesCipher.ts:38](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/aesCipher.ts#L38)_

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

_Defined in [packages/encryption/src/aesCipher.ts:24](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/aesCipher.ts#L24)_

#### Parameters:

| Name        | Type                                                                        |
| ----------- | --------------------------------------------------------------------------- |
| `algorithm` | [CipherAlgorithm](../modules/_encryption_src_aescipher_.md#cipheralgorithm) |
| `key`       | Buffer                                                                      |
| `iv`        | Buffer                                                                      |
| `data`      | Buffer                                                                      |

**Returns:** Promise\<Buffer>
