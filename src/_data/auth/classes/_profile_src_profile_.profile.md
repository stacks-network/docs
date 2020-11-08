**[@stacks/auth](../README.md)**

> [Globals](../globals.md) / ["profile/src/profile"](../modules/_profile_src_profile_.md) / Profile

# Class: Profile

Represents a user profile

## Hierarchy

- **Profile**

## Index

### Constructors

- [constructor](_profile_src_profile_.profile.md#constructor)

### Properties

- [\_profile](_profile_src_profile_.profile.md#_profile)

### Methods

- [toJSON](_profile_src_profile_.profile.md#tojson)
- [toToken](_profile_src_profile_.profile.md#totoken)
- [fromToken](_profile_src_profile_.profile.md#fromtoken)
- [makeZoneFile](_profile_src_profile_.profile.md#makezonefile)
- [validateSchema](_profile_src_profile_.profile.md#validateschema)

## Constructors

### constructor

\+ **new Profile**(`profile?`: {}): [Profile](_profile_src_profile_.profile.md)

_Defined in [packages/profile/src/profile.ts:42](https://github.com/blockstack/blockstack.js/blob/26419086/packages/profile/src/profile.ts#L42)_

#### Parameters:

| Name      | Type | Default value |
| --------- | ---- | ------------- |
| `profile` | {}   | {}            |

**Returns:** [Profile](_profile_src_profile_.profile.md)

## Properties

### \_profile

• **\_profile**: { [key:string]: any; }

_Defined in [packages/profile/src/profile.ts:42](https://github.com/blockstack/blockstack.js/blob/26419086/packages/profile/src/profile.ts#L42)_

## Methods

### toJSON

▸ **toJSON**(): object

_Defined in [packages/profile/src/profile.ts:54](https://github.com/blockstack/blockstack.js/blob/26419086/packages/profile/src/profile.ts#L54)_

**Returns:** object

---

### toToken

▸ **toToken**(`privateKey`: string): string

_Defined in [packages/profile/src/profile.ts:58](https://github.com/blockstack/blockstack.js/blob/26419086/packages/profile/src/profile.ts#L58)_

#### Parameters:

| Name         | Type   |
| ------------ | ------ |
| `privateKey` | string |

**Returns:** string

---

### fromToken

▸ `Static`**fromToken**(`token`: string, `publicKeyOrAddress?`: string \| null): [Profile](_profile_src_profile_.profile.md)

_Defined in [packages/profile/src/profile.ts:67](https://github.com/blockstack/blockstack.js/blob/26419086/packages/profile/src/profile.ts#L67)_

#### Parameters:

| Name                 | Type           | Default value |
| -------------------- | -------------- | ------------- |
| `token`              | string         | -             |
| `publicKeyOrAddress` | string \| null | null          |

**Returns:** [Profile](_profile_src_profile_.profile.md)

---

### makeZoneFile

▸ `Static`**makeZoneFile**(`domainName`: string, `tokenFileURL`: string): string

_Defined in [packages/profile/src/profile.ts:72](https://github.com/blockstack/blockstack.js/blob/26419086/packages/profile/src/profile.ts#L72)_

#### Parameters:

| Name           | Type   |
| -------------- | ------ |
| `domainName`   | string |
| `tokenFileURL` | string |

**Returns:** string

---

### validateSchema

▸ `Static`**validateSchema**(`profile`: any, `strict?`: boolean): any

_Defined in [packages/profile/src/profile.ts:62](https://github.com/blockstack/blockstack.js/blob/26419086/packages/profile/src/profile.ts#L62)_

#### Parameters:

| Name      | Type    | Default value |
| --------- | ------- | ------------- |
| `profile` | any     | -             |
| `strict`  | boolean | false         |

**Returns:** any
