**[@stacks/auth](../README.md)**

> [Globals](../globals.md) / ["encryption/src/sha2Hash"](../modules/_encryption_src_sha2hash_.md) / Sha2Hash

# Interface: Sha2Hash

## Hierarchy

- **Sha2Hash**

## Implemented by

- [WebCryptoSha2Hash](../classes/_encryption_src_sha2hash_.webcryptosha2hash.md)

## Index

### Methods

- [digest](_encryption_src_sha2hash_.sha2hash.md#digest)

## Methods

### digest

▸ **digest**(`data`: Buffer, `algorithm?`: \"sha256\" \| \"sha512\"): Promise\<Buffer>

_Defined in [packages/encryption/src/sha2Hash.ts:7](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/sha2Hash.ts#L7)_

#### Parameters:

| Name         | Type                     |
| ------------ | ------------------------ |
| `data`       | Buffer                   |
| `algorithm?` | \"sha256\" \| \"sha512\" |

**Returns:** Promise\<Buffer>
