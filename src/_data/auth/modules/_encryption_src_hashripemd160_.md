**[@stacks/auth](../README.md)**

> [Globals](../globals.md) / "encryption/src/hashRipemd160"

# Module: "encryption/src/hashRipemd160"

## Index

### Classes

- [NodeCryptoRipemd160Digest](../classes/_encryption_src_hashripemd160_.nodecryptoripemd160digest.md)
- [Ripemd160PolyfillDigest](../classes/_encryption_src_hashripemd160_.ripemd160polyfilldigest.md)

### Interfaces

- [Ripemd160Digest](../interfaces/_encryption_src_hashripemd160_.ripemd160digest.md)

### Type aliases

- [NodeCryptoCreateHash](_encryption_src_hashripemd160_.md#nodecryptocreatehash)

### Functions

- [createHashRipemd160](_encryption_src_hashripemd160_.md#createhashripemd160)
- [hashRipemd160](_encryption_src_hashripemd160_.md#hashripemd160)

## Type aliases

### NodeCryptoCreateHash

Ƭ **NodeCryptoCreateHash**: createHash

_Defined in [packages/encryption/src/hashRipemd160.ts:4](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/hashRipemd160.ts#L4)_

## Functions

### createHashRipemd160

▸ **createHashRipemd160**(): [Ripemd160PolyfillDigest](../classes/_encryption_src_hashripemd160_.ripemd160polyfilldigest.md) \| [NodeCryptoRipemd160Digest](../classes/_encryption_src_hashripemd160_.nodecryptoripemd160digest.md)

_Defined in [packages/encryption/src/hashRipemd160.ts:52](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/hashRipemd160.ts#L52)_

**Returns:** [Ripemd160PolyfillDigest](../classes/_encryption_src_hashripemd160_.ripemd160polyfilldigest.md) \| [NodeCryptoRipemd160Digest](../classes/_encryption_src_hashripemd160_.nodecryptoripemd160digest.md)

---

### hashRipemd160

▸ **hashRipemd160**(`data`: Buffer): Buffer

_Defined in [packages/encryption/src/hashRipemd160.ts:66](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/hashRipemd160.ts#L66)_

#### Parameters:

| Name   | Type   |
| ------ | ------ |
| `data` | Buffer |

**Returns:** Buffer
