**[@stacks/auth](../README.md)**

> [Globals](../globals.md) / "profile/src/profileTokens"

# Module: "profile/src/profileTokens"

## Index

### Functions

- [extractProfile](_profile_src_profiletokens_.md#extractprofile)
- [signProfileToken](_profile_src_profiletokens_.md#signprofiletoken)
- [verifyProfileToken](_profile_src_profiletokens_.md#verifyprofiletoken)
- [wrapProfileToken](_profile_src_profiletokens_.md#wrapprofiletoken)

## Functions

### extractProfile

▸ **extractProfile**(`token`: string, `publicKeyOrAddress?`: string \| null): Record\<string, any>

_Defined in [packages/profile/src/profileTokens.ts:147](https://github.com/blockstack/blockstack.js/blob/26419086/packages/profile/src/profileTokens.ts#L147)_

Extracts a profile from an encoded token and optionally verifies it,
if `publicKeyOrAddress` is provided.

**`throws`** {Error} - if the token isn't signed by the provided `publicKeyOrAddress`

#### Parameters:

| Name                 | Type           | Default value | Description                                                                       |
| -------------------- | -------------- | ------------- | --------------------------------------------------------------------------------- |
| `token`              | string         | -             | the token to be extracted                                                         |
| `publicKeyOrAddress` | string \| null | null          | the public key or address of the keypair that is thought to have signed the token |

**Returns:** Record\<string, any>

- the profile extracted from the encoded token

---

### signProfileToken

▸ **signProfileToken**(`profile`: any, `privateKey`: string, `subject?`: any, `issuer?`: any, `signingAlgorithm?`: string, `issuedAt?`: Date, `expiresAt?`: Date): string

_Defined in [packages/profile/src/profileTokens.ts:19](https://github.com/blockstack/blockstack.js/blob/26419086/packages/profile/src/profileTokens.ts#L19)_

Signs a profile token

#### Parameters:

| Name               | Type   | Default value | Description                              |
| ------------------ | ------ | ------------- | ---------------------------------------- |
| `profile`          | any    | -             | the JSON of the profile to be signed     |
| `privateKey`       | string | -             | the signing private key                  |
| `subject?`         | any    | -             | the entity that the information is about |
| `issuer?`          | any    | -             | the entity that is issuing the token     |
| `signingAlgorithm` | string | "ES256K"      | the signing algorithm to use             |
| `issuedAt`         | Date   | new Date()    | the time of issuance of the token        |
| `expiresAt`        | Date   | nextYear()    | the time of expiration of the token      |

**Returns:** string

- the signed profile token

---

### verifyProfileToken

▸ **verifyProfileToken**(`token`: string, `publicKeyOrAddress`: string): TokenInterface

_Defined in [packages/profile/src/profileTokens.ts:76](https://github.com/blockstack/blockstack.js/blob/26419086/packages/profile/src/profileTokens.ts#L76)_

Verifies a profile token

**`throws`** {Error} - throws an error if token verification fails

#### Parameters:

| Name                 | Type   | Description                                                                       |
| -------------------- | ------ | --------------------------------------------------------------------------------- |
| `token`              | string | the token to be verified                                                          |
| `publicKeyOrAddress` | string | the public key or address of the keypair that is thought to have signed the token |

**Returns:** TokenInterface

- the verified, decoded profile token

---

### wrapProfileToken

▸ **wrapProfileToken**(`token`: string): object

_Defined in [packages/profile/src/profileTokens.ts:61](https://github.com/blockstack/blockstack.js/blob/26419086/packages/profile/src/profileTokens.ts#L61)_

Wraps a token for a profile token file

#### Parameters:

| Name    | Type   | Description             |
| ------- | ------ | ----------------------- |
| `token` | string | the token to be wrapped |

**Returns:** object

| Name           | Type           |
| -------------- | -------------- |
| `decodedToken` | TokenInterface |
| `token`        | string         |

- including `token` and `decodedToken`
