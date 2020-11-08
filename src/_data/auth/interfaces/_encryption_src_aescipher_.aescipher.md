**[@stacks/auth](../README.md)**

> [Globals](../globals.md) / ["encryption/src/aesCipher"](../modules/_encryption_src_aescipher_.md) / AesCipher

# Interface: AesCipher

## Hierarchy

- **AesCipher**

## Implemented by

- [NodeCryptoAesCipher](../classes/_encryption_src_aescipher_.nodecryptoaescipher.md)
- [WebCryptoAesCipher](../classes/_encryption_src_aescipher_.webcryptoaescipher.md)

## Index

### Methods

- [decrypt](_encryption_src_aescipher_.aescipher.md#decrypt)
- [encrypt](_encryption_src_aescipher_.aescipher.md#encrypt)

## Methods

### decrypt

▸ **decrypt**(`algorithm`: [CipherAlgorithm](../modules/_encryption_src_aescipher_.md#cipheralgorithm), `key`: Buffer, `iv`: Buffer, `data`: Buffer): Promise\<Buffer>

_Defined in [packages/encryption/src/aesCipher.ts:11](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/aesCipher.ts#L11)_

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

_Defined in [packages/encryption/src/aesCipher.ts:9](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/aesCipher.ts#L9)_

#### Parameters:

| Name        | Type                                                                        |
| ----------- | --------------------------------------------------------------------------- |
| `algorithm` | [CipherAlgorithm](../modules/_encryption_src_aescipher_.md#cipheralgorithm) |
| `key`       | Buffer                                                                      |
| `iv`        | Buffer                                                                      |
| `data`      | Buffer                                                                      |

**Returns:** Promise\<Buffer>
