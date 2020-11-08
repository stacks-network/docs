**[@stacks/auth](../README.md)**

> [Globals](../globals.md) / "encryption/src/encryption"

# Module: "encryption/src/encryption"

## Index

### Interfaces

- [EncryptContentOptions](../interfaces/_encryption_src_encryption_.encryptcontentoptions.md)
- [EncryptionOptions](../interfaces/_encryption_src_encryption_.encryptionoptions.md)

### Functions

- [decryptContent](_encryption_src_encryption_.md#decryptcontent)
- [encryptContent](_encryption_src_encryption_.md#encryptcontent)

## Functions

### decryptContent

▸ **decryptContent**(`content`: string, `options?`: undefined \| { privateKey?: undefined \| string }): Promise\<string \| Buffer>

_Defined in [packages/encryption/src/encryption.ts:110](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/encryption.ts#L110)_

Decrypts data encrypted with `encryptContent` with the
transit private key.

#### Parameters:

| Name       | Type                                              | Description        |
| ---------- | ------------------------------------------------- | ------------------ |
| `content`  | string                                            | encrypted content. |
| `options?` | undefined \| { privateKey?: undefined \| string } | -                  |

**Returns:** Promise\<string \| Buffer>

decrypted content.

---

### encryptContent

▸ **encryptContent**(`content`: string \| Buffer, `options?`: [EncryptContentOptions](../interfaces/_encryption_src_encryption_.encryptcontentoptions.md)): Promise\<string>

_Defined in [packages/encryption/src/encryption.ts:58](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/encryption.ts#L58)_

Encrypts the data provided with the app public key.

#### Parameters:

| Name       | Type                                                                                        | Description     |
| ---------- | ------------------------------------------------------------------------------------------- | --------------- |
| `content`  | string \| Buffer                                                                            | data to encrypt |
| `options?` | [EncryptContentOptions](../interfaces/_encryption_src_encryption_.encryptcontentoptions.md) | -               |

**Returns:** Promise\<string>

Stringified ciphertext object
