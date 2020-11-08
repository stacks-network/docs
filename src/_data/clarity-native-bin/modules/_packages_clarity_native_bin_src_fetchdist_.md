**[@blockstack/clarity-native-bin](../README.md)**

> [Globals](../globals.md) / "packages/clarity-native-bin/src/fetchDist"

# Module: "packages/clarity-native-bin/src/fetchDist"

## Index

### Enumerations

- [SupportedDistArch](../enums/_packages_clarity_native_bin_src_fetchdist_.supporteddistarch.md)
- [SupportedDistPlatform](../enums/_packages_clarity_native_bin_src_fetchdist_.supporteddistplatform.md)

### Variables

- [DIST_DOWNLOAD_URL_TEMPLATE](_packages_clarity_native_bin_src_fetchdist_.md#dist_download_url_template)

### Functions

- [fetchDistributable](_packages_clarity_native_bin_src_fetchdist_.md#fetchdistributable)
- [getDownloadUrl](_packages_clarity_native_bin_src_fetchdist_.md#getdownloadurl)
- [isDistAvailable](_packages_clarity_native_bin_src_fetchdist_.md#isdistavailable)

## Variables

### DIST_DOWNLOAD_URL_TEMPLATE

• `Const` **DIST_DOWNLOAD_URL_TEMPLATE**: string = "https://github.com/blockstack/clarity-js-sdk/releases/" + "download/{tag}/clarity-cli-{platform}-{arch}.tar.gz"

_Defined in [packages/clarity-native-bin/src/fetchDist.ts:12](https://github.com/blockstack/clarity-js-sdk/blob/316fb4e/packages/clarity-native-bin/src/fetchDist.ts#L12)_

## Functions

### fetchDistributable

▸ **fetchDistributable**(`opts`: { logger: [ILogger](../interfaces/_packages_clarity_native_bin_src_logger_.ilogger.md) ; outputFilePath: string ; overwriteExisting: boolean ; versionTag: string }): Promise\<boolean>

_Defined in [packages/clarity-native-bin/src/fetchDist.ts:96](https://github.com/blockstack/clarity-js-sdk/blob/316fb4e/packages/clarity-native-bin/src/fetchDist.ts#L96)_

Returns true if install was successful.

#### Parameters:

| Name   | Type                                                                                                                                                                | Description |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `opts` | { logger: [ILogger](../interfaces/_packages_clarity_native_bin_src_logger_.ilogger.md) ; outputFilePath: string ; overwriteExisting: boolean ; versionTag: string } |             |

**Returns:** Promise\<boolean>

---

### getDownloadUrl

▸ **getDownloadUrl**(`logger`: [ILogger](../interfaces/_packages_clarity_native_bin_src_logger_.ilogger.md), `versionTag`: string): string \| false

_Defined in [packages/clarity-native-bin/src/fetchDist.ts:81](https://github.com/blockstack/clarity-js-sdk/blob/316fb4e/packages/clarity-native-bin/src/fetchDist.ts#L81)_

Gets a download url for a dist archive containing a binary that
can run in the currently executing system OS and architecture.
Returns false if system is incompatible with known available distributables.

#### Parameters:

| Name         | Type                                                                         |
| ------------ | ---------------------------------------------------------------------------- |
| `logger`     | [ILogger](../interfaces/_packages_clarity_native_bin_src_logger_.ilogger.md) |
| `versionTag` | string                                                                       |

**Returns:** string \| false

---

### isDistAvailable

▸ **isDistAvailable**(`logger?`: [ILogger](../interfaces/_packages_clarity_native_bin_src_logger_.ilogger.md)): { arch: [SupportedDistArch](../enums/_packages_clarity_native_bin_src_fetchdist_.supporteddistarch.md) ; platform: [SupportedDistPlatform](../enums/_packages_clarity_native_bin_src_fetchdist_.supporteddistplatform.md) } \| false

_Defined in [packages/clarity-native-bin/src/fetchDist.ts:32](https://github.com/blockstack/clarity-js-sdk/blob/316fb4e/packages/clarity-native-bin/src/fetchDist.ts#L32)_

Checks if the currently executing platform and architecture has an distributable available
for download.

#### Parameters:

| Name      | Type                                                                         | Description                                                    |
| --------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `logger?` | [ILogger](../interfaces/_packages_clarity_native_bin_src_logger_.ilogger.md) | Optionally log error message for unsupported platform or arch. |

**Returns:** { arch: [SupportedDistArch](../enums/_packages_clarity_native_bin_src_fetchdist_.supporteddistarch.md) ; platform: [SupportedDistPlatform](../enums/_packages_clarity_native_bin_src_fetchdist_.supporteddistplatform.md) } \| false
