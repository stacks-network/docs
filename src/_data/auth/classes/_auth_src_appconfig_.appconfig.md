**[@stacks/auth](../README.md)**

> [Globals](../globals.md) / ["auth/src/appConfig"](../modules/_auth_src_appconfig_.md) / AppConfig

# Class: AppConfig

Configuration data for the current app.

On browser platforms, creating an instance of this
class without any arguments will use
`window.location.origin` as the app domain.
On non-browser platforms, you need to
specify an app domain as the second argument.

## Hierarchy

- **AppConfig**

## Index

### Constructors

- [constructor](_auth_src_appconfig_.appconfig.md#constructor)

### Properties

- [appDomain](_auth_src_appconfig_.appconfig.md#appdomain)
- [authenticatorURL](_auth_src_appconfig_.appconfig.md#authenticatorurl)
- [coreNode](_auth_src_appconfig_.appconfig.md#corenode)
- [manifestPath](_auth_src_appconfig_.appconfig.md#manifestpath)
- [redirectPath](_auth_src_appconfig_.appconfig.md#redirectpath)
- [scopes](_auth_src_appconfig_.appconfig.md#scopes)

### Methods

- [manifestURI](_auth_src_appconfig_.appconfig.md#manifesturi)
- [redirectURI](_auth_src_appconfig_.appconfig.md#redirecturi)

## Constructors

### constructor

\+ **new AppConfig**(`scopes?`: string[], `appDomain?`: string \| undefined, `redirectPath?`: string, `manifestPath?`: string, `coreNode?`: string \| undefined, `authenticatorURL?`: string): [AppConfig](_auth_src_appconfig_.appconfig.md)

_Defined in [packages/auth/src/appConfig.ts:57](https://github.com/blockstack/blockstack.js/blob/26419086/packages/auth/src/appConfig.ts#L57)_

#### Parameters:

| Name               | Type                | Default value                                            | Description                                                                                                                   |
| ------------------ | ------------------- | -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `scopes`           | string[]            | DEFAULT_SCOPE.slice()                                    | permissions this app is requesting                                                                                            |
| `appDomain`        | string \| undefined | getGlobalObject('location', { returnEmptyObject: true }) |
| ?.origin           | the app domain      |
| `redirectPath`     | string              | ""                                                       | path on app domain to redirect users to after authentication                                                                  |
| `manifestPath`     | string              | "/manifest.json"                                         | path relative to app domain of app's manifest file                                                                            |
| `coreNode`         | string \| undefined | undefined                                                | override the default or user selected core node                                                                               |
| `authenticatorURL` | string              | DEFAULT_BLOCKSTACK_HOST                                  | the web-based fall back authenticator ([DEFAULT_BLOCKSTACK_HOST](../modules/_auth_src_constants_.md#default_blockstack_host)) |

**Returns:** [AppConfig](_auth_src_appconfig_.appconfig.md)

## Properties

### appDomain

• `Optional` **appDomain**: undefined \| string

_Defined in [packages/auth/src/appConfig.ts:19](https://github.com/blockstack/blockstack.js/blob/26419086/packages/auth/src/appConfig.ts#L19)_

Blockstack apps are uniquely identified by their app domain.

---

### authenticatorURL

• `Optional` **authenticatorURL**: undefined \| string

_Defined in [packages/auth/src/appConfig.ts:57](https://github.com/blockstack/blockstack.js/blob/26419086/packages/auth/src/appConfig.ts#L57)_

The URL of a web-based Blockstack Authenticator to use in the event
the user doesn't have Blockstack installed on their machine. If this
is not specified, the current default in this library will be used.

---

### coreNode

• `Optional` **coreNode**: undefined \| string

_Defined in [packages/auth/src/appConfig.ts:49](https://github.com/blockstack/blockstack.js/blob/26419086/packages/auth/src/appConfig.ts#L49)_

The URL of Blockstack core node to use for this app. If this is
`null`, the core node specified by the user or default core node
will be used.

---

### manifestPath

• **manifestPath**: string

_Defined in [packages/auth/src/appConfig.ts:41](https://github.com/blockstack/blockstack.js/blob/26419086/packages/auth/src/appConfig.ts#L41)_

Path relative to app domain of app's manifest file.

This file needs to have CORS headers set so that it can be fetched
from any origin. Typically this means return the header `Access-Control-Allow-Origin: *`.

---

### redirectPath

• **redirectPath**: string

_Defined in [packages/auth/src/appConfig.ts:32](https://github.com/blockstack/blockstack.js/blob/26419086/packages/auth/src/appConfig.ts#L32)_

Path on app domain to redirect users to after authentication. The
authentication response token will be postpended in a query.

---

### scopes

• **scopes**: ([AuthScope](../enums/_auth_src_constants_.authscope.md) \| string)[]

_Defined in [packages/auth/src/appConfig.ts:25](https://github.com/blockstack/blockstack.js/blob/26419086/packages/auth/src/appConfig.ts#L25)_

An array of string representing permissions requested by the app.

## Methods

### manifestURI

▸ **manifestURI**(): string

_Defined in [packages/auth/src/appConfig.ts:98](https://github.com/blockstack/blockstack.js/blob/26419086/packages/auth/src/appConfig.ts#L98)_

The location of the app's manifest file.

**Returns:** string

- URI

---

### redirectURI

▸ **redirectURI**(): string

_Defined in [packages/auth/src/appConfig.ts:90](https://github.com/blockstack/blockstack.js/blob/26419086/packages/auth/src/appConfig.ts#L90)_

The location to which the authenticator should
redirect the user.

**Returns:** string

- URI
