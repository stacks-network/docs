**[@stacks/auth](../README.md)**

> [Globals](../globals.md) / ["encryption/src/hmacSha256"](../modules/_encryption_src_hmacsha256_.md) / Hmac

# Interface: Hmac

## Hierarchy

- **Hmac**

## Implemented by

- [NodeCryptoHmacSha256](../classes/_encryption_src_hmacsha256_.nodecryptohmacsha256.md)
- [WebCryptoHmacSha256](../classes/_encryption_src_hmacsha256_.webcryptohmacsha256.md)

## Index

### Methods

- [digest](_encryption_src_hmacsha256_.hmac.md#digest)

## Methods

### digest

▸ **digest**(`key`: Buffer, `data`: Buffer): Promise\<Buffer>

_Defined in [packages/encryption/src/hmacSha256.ts:4](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/hmacSha256.ts#L4)_

#### Parameters:

| Name   | Type   |
| ------ | ------ |
| `key`  | Buffer |
| `data` | Buffer |

**Returns:** Promise\<Buffer>
