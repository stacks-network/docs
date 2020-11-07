**[@blockstack/clarity](../README.md)**

> [Globals](../globals.md) / "packages/clarity-native-bin/src/cargoBuild"

# Module: "packages/clarity-native-bin/src/cargoBuild"

## Index

### Variables

- [CORE_GIT_REPO](_packages_clarity_native_bin_src_cargobuild_.md#core_git_repo)

### Functions

- [cargoInstall](_packages_clarity_native_bin_src_cargobuild_.md#cargoinstall)
- [checkCargoStatus](_packages_clarity_native_bin_src_cargobuild_.md#checkcargostatus)

## Variables

### CORE_GIT_REPO

• `Const` **CORE_GIT_REPO**: \"https://github.com/blockstack/stacks-blockchain.git\" = "https://github.com/blockstack/stacks-blockchain.git"

_Defined in [packages/clarity-native-bin/src/cargoBuild.ts:7](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity-native-bin/src/cargoBuild.ts#L7)_

## Functions

### cargoInstall

▸ **cargoInstall**(`opts`: { gitBranch?: undefined \| string ; gitCommitHash?: undefined \| string ; gitTag?: undefined \| string ; logger: [ILogger](../interfaces/_packages_clarity_native_bin_src_logger_.ilogger.md) ; outputFilePath: string ; overwriteExisting: boolean }): Promise\<boolean>

_Defined in [packages/clarity-native-bin/src/cargoBuild.ts:25](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity-native-bin/src/cargoBuild.ts#L25)_

#### Parameters:

| Name   | Type                                                                                                                                                                                                                                                  |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `opts` | { gitBranch?: undefined \| string ; gitCommitHash?: undefined \| string ; gitTag?: undefined \| string ; logger: [ILogger](../interfaces/_packages_clarity_native_bin_src_logger_.ilogger.md) ; outputFilePath: string ; overwriteExisting: boolean } |

**Returns:** Promise\<boolean>

---

### checkCargoStatus

▸ **checkCargoStatus**(`logger`: [ILogger](../interfaces/_packages_clarity_native_bin_src_logger_.ilogger.md)): Promise\<boolean>

_Defined in [packages/clarity-native-bin/src/cargoBuild.ts:9](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity-native-bin/src/cargoBuild.ts#L9)_

#### Parameters:

| Name     | Type                                                                         |
| -------- | ---------------------------------------------------------------------------- |
| `logger` | [ILogger](../interfaces/_packages_clarity_native_bin_src_logger_.ilogger.md) |

**Returns:** Promise\<boolean>
