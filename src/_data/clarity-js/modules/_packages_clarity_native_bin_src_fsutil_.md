**[@blockstack/clarity](../README.md)**

> [Globals](../globals.md) / "packages/clarity-native-bin/src/fsUtil"

# Module: "packages/clarity-native-bin/src/fsUtil"

## Index

### Functions

- [getExecutableFileName](_packages_clarity_native_bin_src_fsutil_.md#getexecutablefilename)
- [makeUniqueTempDir](_packages_clarity_native_bin_src_fsutil_.md#makeuniquetempdir)
- [moveFromPath](_packages_clarity_native_bin_src_fsutil_.md#movefrompath)
- [verifyOutputFile](_packages_clarity_native_bin_src_fsutil_.md#verifyoutputfile)

## Functions

### getExecutableFileName

▸ **getExecutableFileName**(`file`: string): string

_Defined in [packages/clarity-native-bin/src/fsUtil.ts:18](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity-native-bin/src/fsUtil.ts#L18)_

If the current platform is Windows then returns [[file]] with
the `.exe` extension appended.
Otherwise, returns the given [[file]] unchanged.

#### Parameters:

| Name   | Type   | Description                  |
| ------ | ------ | ---------------------------- |
| `file` | string | A file name or path to file. |

**Returns:** string

---

### makeUniqueTempDir

▸ **makeUniqueTempDir**(): string

_Defined in [packages/clarity-native-bin/src/fsUtil.ts:6](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity-native-bin/src/fsUtil.ts#L6)_

**Returns:** string

---

### moveFromPath

▸ `Const`**moveFromPath**(`opts`: { inputFilePAth: string ; logger: [ILogger](../interfaces/_packages_clarity_native_bin_src_logger_.ilogger.md) ; outputFilePath: string }): boolean

_Defined in [packages/clarity-native-bin/src/fsUtil.ts:71](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity-native-bin/src/fsUtil.ts#L71)_

#### Parameters:

| Name   | Type                                                                                                                                      |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `opts` | { inputFilePAth: string ; logger: [ILogger](../interfaces/_packages_clarity_native_bin_src_logger_.ilogger.md) ; outputFilePath: string } |

**Returns:** boolean

---

### verifyOutputFile

▸ **verifyOutputFile**(`logger`: [ILogger](../interfaces/_packages_clarity_native_bin_src_logger_.ilogger.md), `overwriteExisting`: boolean, `outputFilePath`: string): boolean

_Defined in [packages/clarity-native-bin/src/fsUtil.ts:32](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity-native-bin/src/fsUtil.ts#L32)_

Ensures the provided output directory exists and is writable.
Deletes the provided output file if it already exists and overwrite has been specified.

#### Parameters:

| Name                | Type                                                                         |
| ------------------- | ---------------------------------------------------------------------------- |
| `logger`            | [ILogger](../interfaces/_packages_clarity_native_bin_src_logger_.ilogger.md) |
| `overwriteExisting` | boolean                                                                      |
| `outputFilePath`    | string                                                                       |

**Returns:** boolean
