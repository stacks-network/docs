**[@blockstack/clarity](../README.md)**

> [Globals](../globals.md) / "packages/clarity/src/utils/fsUtil"

# Module: "packages/clarity/src/utils/fsUtil"

## Index

### Functions

- [fileExists](_packages_clarity_src_utils_fsutil_.md#fileexists)
- [getTempFilePath](_packages_clarity_src_utils_fsutil_.md#gettempfilepath)

## Functions

### fileExists

▸ **fileExists**(`filePath`: string): boolean

_Defined in [packages/clarity/src/utils/fsUtil.ts:13](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/utils/fsUtil.ts#L13)_

#### Parameters:

| Name       | Type   |
| ---------- | ------ |
| `filePath` | string |

**Returns:** boolean

---

### getTempFilePath

▸ **getTempFilePath**(`fileNameTemplate?`: string): string

_Defined in [packages/clarity/src/utils/fsUtil.ts:5](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/utils/fsUtil.ts#L5)_

#### Parameters:

| Name               | Type   | Default value          |
| ------------------ | ------ | ---------------------- |
| `fileNameTemplate` | string | "temp-{uniqueID}-file" |

**Returns:** string
