**[@stacks/auth](../README.md)**

> [Globals](../globals.md) / "auth/src/profile"

# Module: "auth/src/profile"

## Index

### Interfaces

- [ProfileLookupOptions](../interfaces/_auth_src_profile_.profilelookupoptions.md)

### Functions

- [lookupProfile](_auth_src_profile_.md#lookupprofile)

## Functions

### lookupProfile

▸ **lookupProfile**(`options`: [ProfileLookupOptions](../interfaces/_auth_src_profile_.profilelookupoptions.md)): Promise\<Record\<string, any>>

_Defined in [packages/auth/src/profile.ts:20](https://github.com/blockstack/blockstack.js/blob/26419086/packages/auth/src/profile.ts#L20)_

Look up a user profile by blockstack ID

#### Parameters:

| Name      | Type                                                                             |
| --------- | -------------------------------------------------------------------------------- |
| `options` | [ProfileLookupOptions](../interfaces/_auth_src_profile_.profilelookupoptions.md) |

**Returns:** Promise\<Record\<string, any>>

that resolves to a profile object
