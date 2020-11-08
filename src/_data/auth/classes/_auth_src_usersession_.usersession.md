**[@stacks/auth](../README.md)**

> [Globals](../globals.md) / ["auth/src/userSession"](../modules/_auth_src_usersession_.md) / UserSession

# Class: UserSession

Represents an instance of a signed in user for a particular app.

A signed in user has access to two major pieces of information
about the user, the user's private key for that app and the location
of the user's gaia storage bucket for the app.

A user can be signed in either directly through the interactive
sign in process or by directly providing the app private key.

## Hierarchy

- **UserSession**

## Index

### Constructors

- [constructor](_auth_src_usersession_.usersession.md#constructor)

### Properties

- [appConfig](_auth_src_usersession_.usersession.md#appconfig)
- [store](_auth_src_usersession_.usersession.md#store)

### Methods

- [decryptContent](_auth_src_usersession_.usersession.md#decryptcontent)
- [encryptContent](_auth_src_usersession_.usersession.md#encryptcontent)
- [generateAndStoreTransitKey](_auth_src_usersession_.usersession.md#generateandstoretransitkey)
- [getAuthResponseToken](_auth_src_usersession_.usersession.md#getauthresponsetoken)
- [handlePendingSignIn](_auth_src_usersession_.usersession.md#handlependingsignin)
- [isSignInPending](_auth_src_usersession_.usersession.md#issigninpending)
- [isUserSignedIn](_auth_src_usersession_.usersession.md#isusersignedin)
- [loadUserData](_auth_src_usersession_.usersession.md#loaduserdata)
- [makeAuthRequest](_auth_src_usersession_.usersession.md#makeauthrequest)
- [signUserOut](_auth_src_usersession_.usersession.md#signuserout)

## Constructors

### constructor

\+ **new UserSession**(`options?`: undefined \| { appConfig?: [AppConfig](_auth_src_appconfig_.appconfig.md) ; sessionOptions?: [SessionOptions](../interfaces/_auth_src_sessiondata_.sessionoptions.md) ; sessionStore?: [SessionDataStore](_auth_src_sessionstore_.sessiondatastore.md) }): [UserSession](_auth_src_usersession_.usersession.md)

_Defined in [packages/auth/src/userSession.ts:49](https://github.com/blockstack/blockstack.js/blob/26419086/packages/auth/src/userSession.ts#L49)_

Creates a UserSession object

#### Parameters:

| Name       | Type                                                                                                                                                                                                                                                     | Description |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `options?` | undefined \| { appConfig?: [AppConfig](_auth_src_appconfig_.appconfig.md) ; sessionOptions?: [SessionOptions](../interfaces/_auth_src_sessiondata_.sessionoptions.md) ; sessionStore?: [SessionDataStore](_auth_src_sessionstore_.sessiondatastore.md) } |             |

**Returns:** [UserSession](_auth_src_usersession_.usersession.md)

## Properties

### appConfig

• **appConfig**: [AppConfig](_auth_src_appconfig_.appconfig.md)

_Defined in [packages/auth/src/userSession.ts:47](https://github.com/blockstack/blockstack.js/blob/26419086/packages/auth/src/userSession.ts#L47)_

---

### store

• **store**: [SessionDataStore](_auth_src_sessionstore_.sessiondatastore.md)

_Defined in [packages/auth/src/userSession.ts:49](https://github.com/blockstack/blockstack.js/blob/26419086/packages/auth/src/userSession.ts#L49)_

## Methods

### decryptContent

▸ **decryptContent**(`content`: string, `options?`: undefined \| { privateKey?: undefined \| string }): Promise\<Buffer \| string>

_Defined in [packages/auth/src/userSession.ts:389](https://github.com/blockstack/blockstack.js/blob/26419086/packages/auth/src/userSession.ts#L389)_

Decrypts data encrypted with `encryptContent` with the
transit private key.

#### Parameters:

| Name       | Type                                              | Description        |
| ---------- | ------------------------------------------------- | ------------------ |
| `content`  | string                                            | encrypted content. |
| `options?` | undefined \| { privateKey?: undefined \| string } |                    |

**Returns:** Promise\<Buffer \| string>

decrypted content.

---

### encryptContent

▸ **encryptContent**(`content`: string \| Buffer, `options?`: [EncryptContentOptions](../interfaces/_encryption_src_encryption_.encryptcontentoptions.md)): Promise\<string>

_Defined in [packages/auth/src/userSession.ts:372](https://github.com/blockstack/blockstack.js/blob/26419086/packages/auth/src/userSession.ts#L372)_

Encrypts the data provided with the app public key.

#### Parameters:

| Name       | Type                                                                                        | Description         |
| ---------- | ------------------------------------------------------------------------------------------- | ------------------- |
| `content`  | string \| Buffer                                                                            | the data to encrypt |
| `options?` | [EncryptContentOptions](../interfaces/_encryption_src_encryption_.encryptcontentoptions.md) |                     |

**Returns:** Promise\<string>

Stringified ciphertext object

---

### generateAndStoreTransitKey

▸ **generateAndStoreTransitKey**(): string

_Defined in [packages/auth/src/userSession.ts:149](https://github.com/blockstack/blockstack.js/blob/26419086/packages/auth/src/userSession.ts#L149)_

Generates a ECDSA keypair to
use as the ephemeral app transit private key
and store in the session.

**Returns:** string

the hex encoded private key

---

### getAuthResponseToken

▸ **getAuthResponseToken**(): string

_Defined in [packages/auth/src/userSession.ts:161](https://github.com/blockstack/blockstack.js/blob/26419086/packages/auth/src/userSession.ts#L161)_

Retrieve the authentication token from the URL query

**Returns:** string

the authentication token if it exists otherwise `null`

---

### handlePendingSignIn

▸ **handlePendingSignIn**(`authResponseToken?`: string): Promise\<[UserData](../interfaces/_auth_src_userdata_.userdata.md)>

_Defined in [packages/auth/src/userSession.ts:212](https://github.com/blockstack/blockstack.js/blob/26419086/packages/auth/src/userSession.ts#L212)_

Try to process any pending sign in request by returning a `Promise` that resolves
to the user data object if the sign in succeeds.

#### Parameters:

| Name                | Type   | Default value               | Description                              |
| ------------------- | ------ | --------------------------- | ---------------------------------------- |
| `authResponseToken` | string | this.getAuthResponseToken() | the signed authentication response token |

**Returns:** Promise\<[UserData](../interfaces/_auth_src_userdata_.userdata.md)>

that resolves to the user data object if successful and rejects
if handling the sign in request fails or there was no pending sign in request.

---

### isSignInPending

▸ **isSignInPending**(): boolean

_Defined in [packages/auth/src/userSession.ts:181](https://github.com/blockstack/blockstack.js/blob/26419086/packages/auth/src/userSession.ts#L181)_

Check if there is a authentication request that hasn't been handled.

Also checks for a protocol echo reply (which if detected then the page
will be automatically redirected after this call).

**Returns:** boolean

`true` if there is a pending sign in, otherwise `false`

---

### isUserSignedIn

▸ **isUserSignedIn**(): boolean

_Defined in [packages/auth/src/userSession.ts:200](https://github.com/blockstack/blockstack.js/blob/26419086/packages/auth/src/userSession.ts#L200)_

Check if a user is currently signed in.

**Returns:** boolean

`true` if the user is signed in, `false` if not.

---

### loadUserData

▸ **loadUserData**(): [UserData](../interfaces/_auth_src_userdata_.userdata.md)

_Defined in [packages/auth/src/userSession.ts:355](https://github.com/blockstack/blockstack.js/blob/26419086/packages/auth/src/userSession.ts#L355)_

Retrieves the user data object. The user's profile is stored in the key [Profile](_profile_src_profile_.profile.md).

**Returns:** [UserData](../interfaces/_auth_src_userdata_.userdata.md)

User data object.

---

### makeAuthRequest

▸ **makeAuthRequest**(`transitKey?`: undefined \| string, `redirectURI?`: undefined \| string, `manifestURI?`: undefined \| string, `scopes?`: ([AuthScope](../enums/_auth_src_constants_.authscope.md) \| string)[], `appDomain?`: undefined \| string, `expiresAt?`: number, `extraParams?`: any): string

_Defined in [packages/auth/src/userSession.ts:112](https://github.com/blockstack/blockstack.js/blob/26419086/packages/auth/src/userSession.ts#L112)_

Generates an authentication request that can be sent to the Blockstack
browser for the user to approve sign in. This authentication request can
then be used for sign in by passing it to the [[redirectToSignInWithAuthRequest]]
method.

_Note_: This method should only be used if you want to use a customized authentication
flow. Typically, you'd use [[redirectToSignIn]] which is the default sign in method.

#### Parameters:

| Name           | Type                                                                  | Default value        | Description                                                                                                                                                                                    |
| -------------- | --------------------------------------------------------------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `transitKey?`  | undefined \| string                                                   | -                    | A HEX encoded transit private key.                                                                                                                                                             |
| `redirectURI?` | undefined \| string                                                   | -                    | Location to redirect the user to after sign in approval.                                                                                                                                       |
| `manifestURI?` | undefined \| string                                                   | -                    | Location of this app's manifest file.                                                                                                                                                          |
| `scopes?`      | ([AuthScope](../enums/_auth_src_constants_.authscope.md) \| string)[] | -                    | The permissions this app is requesting. The default is `store_write`.                                                                                                                          |
| `appDomain?`   | undefined \| string                                                   | -                    | The origin of the app.                                                                                                                                                                         |
| `expiresAt`    | number                                                                | nextHour().getTime() | The time at which this request is no longer valid.                                                                                                                                             |
| `extraParams`  | any                                                                   | {}                   | Any extra parameters to pass to the authenticator. Use this to pass options that aren't part of the Blockstack authentication specification, but might be supported by special authenticators. |

**Returns:** string

the authentication request

---

### signUserOut

▸ **signUserOut**(`redirectURL?`: undefined \| string): void

_Defined in [packages/auth/src/userSession.ts:404](https://github.com/blockstack/blockstack.js/blob/26419086/packages/auth/src/userSession.ts#L404)_

Sign the user out and optionally redirect to given location.

#### Parameters:

| Name           | Type                | Description                                                                                    |
| -------------- | ------------------- | ---------------------------------------------------------------------------------------------- |
| `redirectURL?` | undefined \| string | Location to redirect user to after sign out. Only used in environments with `window` available |

**Returns:** void
