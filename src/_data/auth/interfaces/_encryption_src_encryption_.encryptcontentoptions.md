**[@stacks/auth](../README.md)**

> [Globals](../globals.md) / ["encryption/src/encryption"](../modules/_encryption_src_encryption_.md) / EncryptContentOptions

# Interface: EncryptContentOptions

Specify encryption options, and whether to sign the ciphertext.

## Hierarchy

- [EncryptionOptions](_encryption_src_encryption_.encryptionoptions.md)

  ↳ **EncryptContentOptions**

## Index

### Properties

- [cipherTextEncoding](_encryption_src_encryption_.encryptcontentoptions.md#ciphertextencoding)
- [privateKey](_encryption_src_encryption_.encryptcontentoptions.md#privatekey)
- [publicKey](_encryption_src_encryption_.encryptcontentoptions.md#publickey)
- [sign](_encryption_src_encryption_.encryptcontentoptions.md#sign)
- [wasString](_encryption_src_encryption_.encryptcontentoptions.md#wasstring)

## Properties

### cipherTextEncoding

• `Optional` **cipherTextEncoding**: CipherTextEncoding

_Inherited from [EncryptionOptions](\_encryption_src_encryption_.encryptionoptions.md).[cipherTextEncoding](_encryption_src_encryption_.encryptionoptions.md#ciphertextencoding)\_

_Defined in [packages/encryption/src/encryption.ts:26](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/encryption.ts#L26)_

String encoding format for the cipherText buffer.
Currently defaults to 'hex' for legacy backwards-compatibility.
Only used if the `encrypt` option is also used.
Note: in the future this should default to 'base64' for the significant
file size reduction.

---

### privateKey

• `Optional` **privateKey**: undefined \| string

_Defined in [packages/encryption/src/encryption.ts:47](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/encryption.ts#L47)_

Encrypt the data with the public key corresponding to the supplied private key

---

### publicKey

• `Optional` **publicKey**: undefined \| string

_Defined in [packages/encryption/src/encryption.ts:43](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/encryption.ts#L43)_

Encrypt the data with this key.

---

### sign

• `Optional` **sign**: boolean \| string

_Inherited from [EncryptionOptions](\_encryption_src_encryption_.encryptionoptions.md).[sign](_encryption_src_encryption_.encryptionoptions.md#sign)\_

_Defined in [packages/encryption/src/encryption.ts:18](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/encryption.ts#L18)_

If set to `true` the data is signed using ECDSA on SHA256 hashes with the user's
app private key. If a string is specified, it is used as the private key instead
of the user's app private key.

**`default`** false

---

### wasString

• `Optional` **wasString**: undefined \| false \| true

_Inherited from [EncryptionOptions](\_encryption_src_encryption_.encryptionoptions.md).[wasString](_encryption_src_encryption_.encryptionoptions.md#wasstring)\_

_Defined in [packages/encryption/src/encryption.ts:33](https://github.com/blockstack/blockstack.js/blob/26419086/packages/encryption/src/encryption.ts#L33)_

Specifies if the original unencrypted content is a ASCII or UTF-8 string.
For example stringified JSON.
If true, then when the ciphertext is decrypted, it will be returned as
a `string` type variable, otherwise will be returned as a Buffer.
