**[@stacks/auth](../README.md)**

> [Globals](../globals.md) / ["encryption/src/pbkdf2"](../modules/_encryption_src_pbkdf2_.md) / Pbkdf2

# Interface: Pbkdf2

## Hierarchy

- **Pbkdf2**

## Implemented by

- [NodeCryptoPbkdf2](../classes/_encryption_src_pbkdf2_.nodecryptopbkdf2.md)
- [WebCryptoPartialPbkdf2](../classes/_encryption_src_pbkdf2_.webcryptopartialpbkdf2.md)
- [WebCryptoPbkdf2](../classes/_encryption_src_pbkdf2_.webcryptopbkdf2.md)

## Index

### Methods

- [derive](_encryption_src_pbkdf2_.pbkdf2.md#derive)

## Methods

### derive

▸ **derive**(`password`: string, `salt`: Buffer, `iterations`: number, `keyLength`: number, `digest`: [Pbkdf2Digests](../modules/_encryption_src_pbkdf2_.md#pbkdf2digests)): Promise\<Buffer>

_Defined in [packages/encryption/src/pbkdf2.ts:6](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/pbkdf2.ts#L6)_

#### Parameters:

| Name         | Type                                                                 |
| ------------ | -------------------------------------------------------------------- |
| `password`   | string                                                               |
| `salt`       | Buffer                                                               |
| `iterations` | number                                                               |
| `keyLength`  | number                                                               |
| `digest`     | [Pbkdf2Digests](../modules/_encryption_src_pbkdf2_.md#pbkdf2digests) |

**Returns:** Promise\<Buffer>
