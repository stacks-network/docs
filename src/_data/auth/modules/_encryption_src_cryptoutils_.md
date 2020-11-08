**[@stacks/auth](../README.md)**

> [Globals](../globals.md) / "encryption/src/cryptoUtils"

# Module: "encryption/src/cryptoUtils"

## Index

### Interfaces

- [NodeCryptoLib](../interfaces/_encryption_src_cryptoutils_.nodecryptolib.md)
- [WebCryptoLib](../interfaces/_encryption_src_cryptoutils_.webcryptolib.md)

### Type aliases

- [TriplesecDecryptSignature](_encryption_src_cryptoutils_.md#triplesecdecryptsignature)

### Variables

- [NO_CRYPTO_LIB](_encryption_src_cryptoutils_.md#no_crypto_lib)

### Functions

- [getCryptoLib](_encryption_src_cryptoutils_.md#getcryptolib)
- [isNodeCryptoAvailable](_encryption_src_cryptoutils_.md#isnodecryptoavailable)
- [isSubtleCryptoAvailable](_encryption_src_cryptoutils_.md#issubtlecryptoavailable)

## Type aliases

### TriplesecDecryptSignature

Ƭ **TriplesecDecryptSignature**: (arg: { data: Buffer ; key: Buffer }, cb: (err: Error \| null, buff: Buffer \| null) => void) => void

_Defined in [packages/encryption/src/cryptoUtils.ts:34](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/cryptoUtils.ts#L34)_

## Variables

### NO_CRYPTO_LIB

• `Const` **NO_CRYPTO_LIB**: \"Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.\" = "Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available."

_Defined in [packages/encryption/src/cryptoUtils.ts:31](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/cryptoUtils.ts#L31)_

## Functions

### getCryptoLib

▸ **getCryptoLib**(): Promise\<[WebCryptoLib](../interfaces/_encryption_src_cryptoutils_.webcryptolib.md) \| [NodeCryptoLib](../interfaces/_encryption_src_cryptoutils_.nodecryptolib.md)>

_Defined in [packages/encryption/src/cryptoUtils.ts:51](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/cryptoUtils.ts#L51)_

**Returns:** Promise\<[WebCryptoLib](../interfaces/_encryption_src_cryptoutils_.webcryptolib.md) \| [NodeCryptoLib](../interfaces/_encryption_src_cryptoutils_.nodecryptolib.md)>

---

### isNodeCryptoAvailable

▸ **isNodeCryptoAvailable**\<T>(`withFeature`: (nodeCrypto: "crypto") => boolean \| T): false \| T

_Defined in [packages/encryption/src/cryptoUtils.ts:5](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/cryptoUtils.ts#L5)_

#### Type parameters:

| Name |
| ---- |
| `T`  |

#### Parameters:

| Name          | Type                                   |
| ------------- | -------------------------------------- |
| `withFeature` | (nodeCrypto: "crypto") => boolean \| T |

**Returns:** false \| T

---

### isSubtleCryptoAvailable

▸ **isSubtleCryptoAvailable**(): boolean

_Defined in [packages/encryption/src/cryptoUtils.ts:1](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/cryptoUtils.ts#L1)_

**Returns:** boolean
