**[@stacks/auth](../README.md)**

> [Globals](../globals.md) / ["auth/src/sessionStore"](../modules/_auth_src_sessionstore_.md) / SessionDataStore

# Class: SessionDataStore

An abstract class representing the SessionDataStore interface.

## Hierarchy

- **SessionDataStore**

## Index

### Constructors

- [constructor](_auth_src_sessionstore_.sessiondatastore.md#constructor)

### Methods

- [deleteSessionData](_auth_src_sessionstore_.sessiondatastore.md#deletesessiondata)
- [getSessionData](_auth_src_sessionstore_.sessiondatastore.md#getsessiondata)
- [setSessionData](_auth_src_sessionstore_.sessiondatastore.md#setsessiondata)

## Constructors

### constructor

\+ **new SessionDataStore**(`sessionOptions?`: [SessionOptions](../interfaces/_auth_src_sessiondata_.sessionoptions.md)): [SessionDataStore](_auth_src_sessionstore_.sessiondatastore.md)

_Defined in [packages/auth/src/sessionStore.ts:9](https://github.com/blockstack/blockstack.js/blob/26419086/packages/auth/src/sessionStore.ts#L9)_

#### Parameters:

| Name              | Type                                                                     |
| ----------------- | ------------------------------------------------------------------------ |
| `sessionOptions?` | [SessionOptions](../interfaces/_auth_src_sessiondata_.sessionoptions.md) |

**Returns:** [SessionDataStore](_auth_src_sessionstore_.sessiondatastore.md)

## Methods

### deleteSessionData

▸ **deleteSessionData**(): boolean

_Defined in [packages/auth/src/sessionStore.ts:28](https://github.com/blockstack/blockstack.js/blob/26419086/packages/auth/src/sessionStore.ts#L28)_

**Returns:** boolean

---

### getSessionData

▸ **getSessionData**(): SessionData

_Defined in [packages/auth/src/sessionStore.ts:17](https://github.com/blockstack/blockstack.js/blob/26419086/packages/auth/src/sessionStore.ts#L17)_

**Returns:** SessionData

---

### setSessionData

▸ **setSessionData**(`session`: SessionData): boolean

_Defined in [packages/auth/src/sessionStore.ts:24](https://github.com/blockstack/blockstack.js/blob/26419086/packages/auth/src/sessionStore.ts#L24)_

#### Parameters:

| Name      | Type        |
| --------- | ----------- |
| `session` | SessionData |

**Returns:** boolean
