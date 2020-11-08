**[@stacks/auth](../README.md)**

> [Globals](../globals.md) / "encryption/src/aesCipher"

# Module: "encryption/src/aesCipher"

## Index

### Classes

- [NodeCryptoAesCipher](../classes/_encryption_src_aescipher_.nodecryptoaescipher.md)
- [WebCryptoAesCipher](../classes/_encryption_src_aescipher_.webcryptoaescipher.md)

### Interfaces

- [AesCipher](../interfaces/_encryption_src_aescipher_.aescipher.md)

### Type aliases

- [CipherAlgorithm](_encryption_src_aescipher_.md#cipheralgorithm)
- [NodeCryptoCreateCipher](_encryption_src_aescipher_.md#nodecryptocreatecipher)
- [NodeCryptoCreateDecipher](_encryption_src_aescipher_.md#nodecryptocreatedecipher)

### Functions

- [createCipher](_encryption_src_aescipher_.md#createcipher)

## Type aliases

### CipherAlgorithm

Ƭ **CipherAlgorithm**: \"aes-256-cbc\" \| \"aes-128-cbc\"

_Defined in [packages/encryption/src/aesCipher.ts:6](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/aesCipher.ts#L6)_

---

### NodeCryptoCreateCipher

Ƭ **NodeCryptoCreateCipher**: createCipheriv

_Defined in [packages/encryption/src/aesCipher.ts:3](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/aesCipher.ts#L3)_

---

### NodeCryptoCreateDecipher

Ƭ **NodeCryptoCreateDecipher**: createDecipheriv

_Defined in [packages/encryption/src/aesCipher.ts:4](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/aesCipher.ts#L4)_

## Functions

### createCipher

▸ **createCipher**(): Promise\<[AesCipher](../interfaces/_encryption_src_aescipher_.aescipher.md)>

_Defined in [packages/encryption/src/aesCipher.ts:109](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/aesCipher.ts#L109)_

**Returns:** Promise\<[AesCipher](../interfaces/_encryption_src_aescipher_.aescipher.md)>
