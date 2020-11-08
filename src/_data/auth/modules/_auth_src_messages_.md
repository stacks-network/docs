**[@stacks/auth](../README.md)**

> [Globals](../globals.md) / "auth/src/messages"

# Module: "auth/src/messages"

## Index

### Type aliases

- [AuthMetadata](_auth_src_messages_.md#authmetadata)

### Variables

- [VERSION](_auth_src_messages_.md#version)

### Functions

- [makeAuthRequest](_auth_src_messages_.md#makeauthrequest)

## Type aliases

### AuthMetadata

Ƭ **AuthMetadata**: { email?: undefined \| string ; profileUrl?: undefined \| string }

_Defined in [packages/auth/src/messages.ts:17](https://github.com/blockstack/blockstack.js/blob/26419086/packages/auth/src/messages.ts#L17)_

#### Type declaration:

| Name          | Type                |
| ------------- | ------------------- |
| `email?`      | undefined \| string |
| `profileUrl?` | undefined \| string |

## Variables

### VERSION

• `Const` **VERSION**: \"1.3.1\" = "1.3.1"

_Defined in [packages/auth/src/messages.ts:15](https://github.com/blockstack/blockstack.js/blob/26419086/packages/auth/src/messages.ts#L15)_

## Functions

### makeAuthRequest

▸ **makeAuthRequest**(`transitPrivateKey`: string, `redirectURI?`: undefined \| string, `manifestURI?`: undefined \| string, `scopes?`: ([AuthScope](../enums/_auth_src_constants_.authscope.md) \| string)[], `appDomain?`: undefined \| string, `expiresAt?`: number, `extraParams?`: any): string

_Defined in [packages/auth/src/messages.ts:56](https://github.com/blockstack/blockstack.js/blob/26419086/packages/auth/src/messages.ts#L56)_

Generates an authentication request that can be sent to the Blockstack
browser for the user to approve sign in. This authentication request can
then be used for sign in by passing it to the `redirectToSignInWithAuthRequest`
method.

_Note: This method should only be used if you want to roll your own authentication
flow. Typically you'd use `redirectToSignIn` which takes care of this
under the hood._

#### Parameters:

| Name                | Type                                                                  | Default value         | Description                                                                                                                                                                            |
| ------------------- | --------------------------------------------------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `transitPrivateKey` | string                                                                | -                     | hex encoded transit private key                                                                                                                                                        |
| `redirectURI?`      | undefined \| string                                                   | -                     | location to redirect user to after sign in approval                                                                                                                                    |
| `manifestURI?`      | undefined \| string                                                   | -                     | location of this app's manifest file                                                                                                                                                   |
| `scopes`            | ([AuthScope](../enums/_auth_src_constants_.authscope.md) \| string)[] | DEFAULT_SCOPE.slice() | the permissions this app is requesting                                                                                                                                                 |
| `appDomain?`        | undefined \| string                                                   | -                     | the origin of this app                                                                                                                                                                 |
| `expiresAt`         | number                                                                | nextMonth().getTime() | the time at which this request is no longer valid                                                                                                                                      |
| `extraParams`       | any                                                                   | {}                    | Any extra parameters you'd like to pass to the authenticator. Use this to pass options that aren't part of the Blockstack auth spec, but might be supported by special authenticators. |

**Returns:** string

the authentication request
