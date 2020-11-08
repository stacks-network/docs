**[@stacks/auth](../README.md)**

> [Globals](../globals.md) / ["encryption/src/hmacSha256"](../modules/_encryption_src_hmacsha256_.md) / NodeCryptoHmacSha256

# Class: NodeCryptoHmacSha256

## Hierarchy

- **NodeCryptoHmacSha256**

## Implements

- [Hmac](../interfaces/_encryption_src_hmacsha256_.hmac.md)

## Index

### Constructors

- [constructor](_encryption_src_hmacsha256_.nodecryptohmacsha256.md#constructor)

### Properties

- [createHmac](_encryption_src_hmacsha256_.nodecryptohmacsha256.md#createhmac)

### Methods

- [digest](_encryption_src_hmacsha256_.nodecryptohmacsha256.md#digest)

## Constructors

### constructor

\+ **new NodeCryptoHmacSha256**(`createHmac`: [NodeCryptoCreateHmac](../modules/_encryption_src_hmacsha256_.md#nodecryptocreatehmac)): [NodeCryptoHmacSha256](_encryption_src_hmacsha256_.nodecryptohmacsha256.md)

_Defined in [packages/encryption/src/hmacSha256.ts:10](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/hmacSha256.ts#L10)_

#### Parameters:

| Name         | Type                                                                                   |
| ------------ | -------------------------------------------------------------------------------------- |
| `createHmac` | [NodeCryptoCreateHmac](../modules/_encryption_src_hmacsha256_.md#nodecryptocreatehmac) |

**Returns:** [NodeCryptoHmacSha256](_encryption_src_hmacsha256_.nodecryptohmacsha256.md)

## Properties

### createHmac

• **createHmac**: [NodeCryptoCreateHmac](../modules/_encryption_src_hmacsha256_.md#nodecryptocreatehmac)

_Defined in [packages/encryption/src/hmacSha256.ts:10](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/hmacSha256.ts#L10)_

## Methods

### digest

▸ **digest**(`key`: Buffer, `data`: Buffer): Promise\<Buffer>

_Implementation of [Hmac](../interfaces/\_encryption_src_hmacsha256_.hmac.md)\_

_Defined in [packages/encryption/src/hmacSha256.ts:16](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/hmacSha256.ts#L16)_

#### Parameters:

| Name   | Type   |
| ------ | ------ |
| `key`  | Buffer |
| `data` | Buffer |

**Returns:** Promise\<Buffer>
