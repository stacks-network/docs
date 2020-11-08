**[@stacks/auth](../README.md)**

> [Globals](../globals.md) / "encryption/src/sha2Hash"

# Module: "encryption/src/sha2Hash"

## Index

### Classes

- [NodeCryptoSha2Hash](../classes/_encryption_src_sha2hash_.nodecryptosha2hash.md)
- [WebCryptoSha2Hash](../classes/_encryption_src_sha2hash_.webcryptosha2hash.md)

### Interfaces

- [Sha2Hash](../interfaces/_encryption_src_sha2hash_.sha2hash.md)

### Type aliases

- [NodeCryptoCreateHash](_encryption_src_sha2hash_.md#nodecryptocreatehash)

### Functions

- [createSha2Hash](_encryption_src_sha2hash_.md#createsha2hash)
- [hashSha256Sync](_encryption_src_sha2hash_.md#hashsha256sync)
- [hashSha512Sync](_encryption_src_sha2hash_.md#hashsha512sync)

## Type aliases

### NodeCryptoCreateHash

Ƭ **NodeCryptoCreateHash**: createHash

_Defined in [packages/encryption/src/sha2Hash.ts:4](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/sha2Hash.ts#L4)_

## Functions

### createSha2Hash

▸ **createSha2Hash**(): Promise\<[Sha2Hash](../interfaces/_encryption_src_sha2hash_.sha2hash.md)>

_Defined in [packages/encryption/src/sha2Hash.ts:62](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/sha2Hash.ts#L62)_

**Returns:** Promise\<[Sha2Hash](../interfaces/_encryption_src_sha2hash_.sha2hash.md)>

---

### hashSha256Sync

▸ **hashSha256Sync**(`data`: Buffer): Buffer

_Defined in [packages/encryption/src/sha2Hash.ts:71](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/sha2Hash.ts#L71)_

#### Parameters:

| Name   | Type   |
| ------ | ------ |
| `data` | Buffer |

**Returns:** Buffer

---

### hashSha512Sync

▸ **hashSha512Sync**(`data`: Buffer): Buffer

_Defined in [packages/encryption/src/sha2Hash.ts:77](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/sha2Hash.ts#L77)_

#### Parameters:

| Name   | Type   |
| ------ | ------ |
| `data` | Buffer |

**Returns:** Buffer
