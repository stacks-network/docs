**[@stacks/auth](../README.md)**

> [Globals](../globals.md) / ["auth/src/constants"](../modules/_auth_src_constants_.md) / AuthScope

# Enumeration: AuthScope

Non-exhaustive list of common permission scopes.

## Index

### Enumeration members

- [email](_auth_src_constants_.authscope.md#email)
- [publish_data](_auth_src_constants_.authscope.md#publish_data)
- [store_write](_auth_src_constants_.authscope.md#store_write)

## Enumeration members

### email

• **email**: = "email"

_Defined in [packages/auth/src/constants.ts:40](https://github.com/blockstack/blockstack.js/blob/26419086/packages/auth/src/constants.ts#L40)_

Request the user's email if available.

---

### publish_data

• **publish_data**: = "publish_data"

_Defined in [packages/auth/src/constants.ts:36](https://github.com/blockstack/blockstack.js/blob/26419086/packages/auth/src/constants.ts#L36)_

Publish data so that other users of the app can discover and interact with the user.
The user's files stored on Gaia hub are made visible to others via the `apps` property in the
user’s `profile.json` file.

---

### store_write

• **store_write**: = "store_write"

_Defined in [packages/auth/src/constants.ts:30](https://github.com/blockstack/blockstack.js/blob/26419086/packages/auth/src/constants.ts#L30)_

Read and write data to the user's Gaia hub in an app-specific storage bucket.
This is the default scope.
