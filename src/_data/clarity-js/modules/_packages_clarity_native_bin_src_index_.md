**[@blockstack/clarity](../README.md)**

> [Globals](../globals.md) / "packages/clarity-native-bin/src/index"

# Module: "packages/clarity-native-bin/src/index"

## Index

### Variables

- [BLOCKSTACK_CORE_SOURCE_BRANCH_ENV_VAR](_packages_clarity_native_bin_src_index_.md#blockstack_core_source_branch_env_var)
- [BLOCKSTACK_CORE_SOURCE_PATH_ENV_VAR](_packages_clarity_native_bin_src_index_.md#blockstack_core_source_path_env_var)
- [BLOCKSTACK_CORE_SOURCE_TAG_ENV_VAR](_packages_clarity_native_bin_src_index_.md#blockstack_core_source_tag_env_var)
- [CORE_SDK_TAG](_packages_clarity_native_bin_src_index_.md#core_sdk_tag)

### Functions

- [getDefaultBinaryFilePath](_packages_clarity_native_bin_src_index_.md#getdefaultbinaryfilepath)
- [getOverriddenCoreSource](_packages_clarity_native_bin_src_index_.md#getoverriddencoresource)
- [getThisPackageDir](_packages_clarity_native_bin_src_index_.md#getthispackagedir)
- [install](_packages_clarity_native_bin_src_index_.md#install)
- [installDefaultPath](_packages_clarity_native_bin_src_index_.md#installdefaultpath)

## Variables

### BLOCKSTACK_CORE_SOURCE_BRANCH_ENV_VAR

• `Const` **BLOCKSTACK_CORE_SOURCE_BRANCH_ENV_VAR**: \"BLOCKSTACK_CORE_SOURCE_BRANCH\" = "BLOCKSTACK_CORE_SOURCE_BRANCH"

_Defined in [packages/clarity-native-bin/src/index.ts:15](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity-native-bin/src/index.ts#L15)_

---

### BLOCKSTACK_CORE_SOURCE_PATH_ENV_VAR

• `Const` **BLOCKSTACK_CORE_SOURCE_PATH_ENV_VAR**: \"BLOCKSTACK_CORE_SOURCE_PATH\" = "BLOCKSTACK_CORE_SOURCE_PATH"

_Defined in [packages/clarity-native-bin/src/index.ts:16](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity-native-bin/src/index.ts#L16)_

---

### BLOCKSTACK_CORE_SOURCE_TAG_ENV_VAR

• `Const` **BLOCKSTACK_CORE_SOURCE_TAG_ENV_VAR**: \"BLOCKSTACK_CORE_SOURCE_TAG\" = "BLOCKSTACK_CORE_SOURCE_TAG"

_Defined in [packages/clarity-native-bin/src/index.ts:14](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity-native-bin/src/index.ts#L14)_

---

### CORE_SDK_TAG

• `Const` **CORE_SDK_TAG**: \"clarity-sdk-v0.1.2\" = "clarity-sdk-v0.1.2"

_Defined in [packages/clarity-native-bin/src/index.ts:12](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity-native-bin/src/index.ts#L12)_

Should correspond to both a git tag on the blockstack-core repo and a
set of clarity-binary distributables uploaded to the cloud storage endpoint.

## Functions

### getDefaultBinaryFilePath

▸ **getDefaultBinaryFilePath**(`__namedParameters?`: { checkExists: boolean = true; versionTag: undefined \| string }): string

_Defined in [packages/clarity-native-bin/src/index.ts:58](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity-native-bin/src/index.ts#L58)_

Returns the full file path of the native clarity-cli executable.
Throws an error if it does not exist.

#### Parameters:

| Name                | Type                                                             | Default value |
| ------------------- | ---------------------------------------------------------------- | ------------- |
| `__namedParameters` | { checkExists: boolean = true; versionTag: undefined \| string } | {}            |

**Returns:** string

---

### getOverriddenCoreSource

▸ **getOverriddenCoreSource**(): false \| { specifier: \"branch\" \| \"tag\" \| \"path\" ; value: string }

_Defined in [packages/clarity-native-bin/src/index.ts:24](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity-native-bin/src/index.ts#L24)_

A git tag or branch name can be specified as an env var.
See [BLOCKSTACK_CORE_SOURCE_TAG_ENV_VAR](_packages_clarity_native_bin_src_index_.md#blockstack_core_source_tag_env_var) and [BLOCKSTACK_CORE_SOURCE_BRANCH_ENV_VAR](_packages_clarity_native_bin_src_index_.md#blockstack_core_source_branch_env_var).

**Returns:** false \| { specifier: \"branch\" \| \"tag\" \| \"path\" ; value: string }

If an environment var is specified then returns the tag/branch string value.
Otherwise returns false.

---

### getThisPackageDir

▸ **getThisPackageDir**(): string

_Defined in [packages/clarity-native-bin/src/index.ts:47](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity-native-bin/src/index.ts#L47)_

Resolve the directory of the currently executing package

**`see`** https://stackoverflow.com/a/49455609/794962

**Returns:** string

---

### install

▸ **install**(`opts`: { fromSource: boolean ; logger: [ILogger](../interfaces/_packages_clarity_native_bin_src_logger_.ilogger.md) ; outputFilePath: string ; overwriteExisting: boolean ; versionTag: string }): Promise\<boolean>

_Defined in [packages/clarity-native-bin/src/index.ts:134](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity-native-bin/src/index.ts#L134)_

#### Parameters:

| Name   | Type                                                                                                                                                                                      |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `opts` | { fromSource: boolean ; logger: [ILogger](../interfaces/_packages_clarity_native_bin_src_logger_.ilogger.md) ; outputFilePath: string ; overwriteExisting: boolean ; versionTag: string } |

**Returns:** Promise\<boolean>

---

### installDefaultPath

▸ **installDefaultPath**(): Promise\<boolean>

_Defined in [packages/clarity-native-bin/src/index.ts:74](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity-native-bin/src/index.ts#L74)_

**Returns:** Promise\<boolean>
