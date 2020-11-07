**[@blockstack/clarity](../README.md)**

> [Globals](../globals.md) / ["packages/clarity/src/providers/clarityBin/index"](../modules/_packages_clarity_src_providers_claritybin_index_.md) / NativeClarityBinProvider

# Class: NativeClarityBinProvider

## Hierarchy

- **NativeClarityBinProvider**

## Implements

- [Provider](../interfaces/_packages_clarity_src_core_provider_.provider.md)

## Index

### Constructors

- [constructor](_packages_clarity_src_providers_claritybin_index_.nativeclaritybinprovider.md#constructor)

### Properties

- [allocations](_packages_clarity_src_providers_claritybin_index_.nativeclaritybinprovider.md#allocations)
- [clarityBinPath](_packages_clarity_src_providers_claritybin_index_.nativeclaritybinprovider.md#claritybinpath)
- [closeActions](_packages_clarity_src_providers_claritybin_index_.nativeclaritybinprovider.md#closeactions)
- [dbFilePath](_packages_clarity_src_providers_claritybin_index_.nativeclaritybinprovider.md#dbfilepath)

### Methods

- [checkContract](_packages_clarity_src_providers_claritybin_index_.nativeclaritybinprovider.md#checkcontract)
- [close](_packages_clarity_src_providers_claritybin_index_.nativeclaritybinprovider.md#close)
- [eval](_packages_clarity_src_providers_claritybin_index_.nativeclaritybinprovider.md#eval)
- [evalRaw](_packages_clarity_src_providers_claritybin_index_.nativeclaritybinprovider.md#evalraw)
- [execute](_packages_clarity_src_providers_claritybin_index_.nativeclaritybinprovider.md#execute)
- [getBlockHeight](_packages_clarity_src_providers_claritybin_index_.nativeclaritybinprovider.md#getblockheight)
- [initialize](_packages_clarity_src_providers_claritybin_index_.nativeclaritybinprovider.md#initialize)
- [launchContract](_packages_clarity_src_providers_claritybin_index_.nativeclaritybinprovider.md#launchcontract)
- [mineBlock](_packages_clarity_src_providers_claritybin_index_.nativeclaritybinprovider.md#mineblock)
- [mineBlocks](_packages_clarity_src_providers_claritybin_index_.nativeclaritybinprovider.md#mineblocks)
- [runCommand](_packages_clarity_src_providers_claritybin_index_.nativeclaritybinprovider.md#runcommand)
- [create](_packages_clarity_src_providers_claritybin_index_.nativeclaritybinprovider.md#create)
- [createEphemeral](_packages_clarity_src_providers_claritybin_index_.nativeclaritybinprovider.md#createephemeral)

## Constructors

### constructor

\+ **new NativeClarityBinProvider**(`allocations`: [InitialAllocation](../interfaces/_packages_clarity_src_providers_claritybin_index_.initialallocation.md)[], `dbFilePath`: string, `clarityBinPath`: string): [NativeClarityBinProvider](_packages_clarity_src_providers_claritybin_index_.nativeclaritybinprovider.md)

_Defined in [packages/clarity/src/providers/clarityBin/index.ts:60](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/providers/clarityBin/index.ts#L60)_

#### Parameters:

| Name             | Type                                                                                                        |
| ---------------- | ----------------------------------------------------------------------------------------------------------- |
| `allocations`    | [InitialAllocation](../interfaces/_packages_clarity_src_providers_claritybin_index_.initialallocation.md)[] |
| `dbFilePath`     | string                                                                                                      |
| `clarityBinPath` | string                                                                                                      |

**Returns:** [NativeClarityBinProvider](_packages_clarity_src_providers_claritybin_index_.nativeclaritybinprovider.md)

## Properties

### allocations

• `Readonly` **allocations**: [InitialAllocation](../interfaces/_packages_clarity_src_providers_claritybin_index_.initialallocation.md)[]

_Defined in [packages/clarity/src/providers/clarityBin/index.ts:57](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/providers/clarityBin/index.ts#L57)_

---

### clarityBinPath

• `Readonly` **clarityBinPath**: string

_Defined in [packages/clarity/src/providers/clarityBin/index.ts:59](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/providers/clarityBin/index.ts#L59)_

---

### closeActions

• `Private` **closeActions**: (() => Promise\<any> \| () => any)[] = []

_Defined in [packages/clarity/src/providers/clarityBin/index.ts:60](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/providers/clarityBin/index.ts#L60)_

---

### dbFilePath

• `Readonly` **dbFilePath**: string

_Defined in [packages/clarity/src/providers/clarityBin/index.ts:58](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/providers/clarityBin/index.ts#L58)_

## Methods

### checkContract

▸ **checkContract**(`contractFilePath`: string): Promise\<[CheckResult](../interfaces/_packages_clarity_src_core_types_.checkresult.md)>

_Implementation of [Provider](../interfaces/\_packages_clarity_src_core_provider_.provider.md)\_

_Defined in [packages/clarity/src/providers/clarityBin/index.ts:110](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/providers/clarityBin/index.ts#L110)_

#### Parameters:

| Name               | Type   |
| ------------------ | ------ |
| `contractFilePath` | string |

**Returns:** Promise\<[CheckResult](../interfaces/_packages_clarity_src_core_types_.checkresult.md)>

---

### close

▸ **close**(): Promise\<void>

_Implementation of [Provider](../interfaces/\_packages_clarity_src_core_provider_.provider.md)\_

_Defined in [packages/clarity/src/providers/clarityBin/index.ts:351](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/providers/clarityBin/index.ts#L351)_

**Returns:** Promise\<void>

---

### eval

▸ **eval**(`contractName`: string, `evalStatement`: string, `includeDebugOutput?`: undefined \| false \| true, `atChaintip?`: boolean): Promise\<[Receipt](../interfaces/_packages_clarity_src_core_types_.receipt.md)>

_Defined in [packages/clarity/src/providers/clarityBin/index.ts:225](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/providers/clarityBin/index.ts#L225)_

#### Parameters:

| Name                  | Type                       | Default value |
| --------------------- | -------------------------- | ------------- |
| `contractName`        | string                     | -             |
| `evalStatement`       | string                     | -             |
| `includeDebugOutput?` | undefined \| false \| true | -             |
| `atChaintip`          | boolean                    | true          |

**Returns:** Promise\<[Receipt](../interfaces/_packages_clarity_src_core_types_.receipt.md)>

---

### evalRaw

▸ **evalRaw**(`evalStatement`: string): Promise\<[Receipt](../interfaces/_packages_clarity_src_core_types_.receipt.md)>

_Implementation of [Provider](../interfaces/\_packages_clarity_src_core_provider_.provider.md)\_

_Defined in [packages/clarity/src/providers/clarityBin/index.ts:192](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/providers/clarityBin/index.ts#L192)_

#### Parameters:

| Name            | Type   |
| --------------- | ------ |
| `evalStatement` | string |

**Returns:** Promise\<[Receipt](../interfaces/_packages_clarity_src_core_types_.receipt.md)>

---

### execute

▸ **execute**(`contractName`: string, `functionName`: string, `senderAddress`: string, ...`args`: string[]): Promise\<[Receipt](../interfaces/_packages_clarity_src_core_types_.receipt.md)>

_Implementation of [Provider](../interfaces/\_packages_clarity_src_core_provider_.provider.md)\_

_Defined in [packages/clarity/src/providers/clarityBin/index.ts:153](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/providers/clarityBin/index.ts#L153)_

#### Parameters:

| Name            | Type     |
| --------------- | -------- |
| `contractName`  | string   |
| `functionName`  | string   |
| `senderAddress` | string   |
| `...args`       | string[] |

**Returns:** Promise\<[Receipt](../interfaces/_packages_clarity_src_core_types_.receipt.md)>

---

### getBlockHeight

▸ **getBlockHeight**(): Promise\<bigint>

_Implementation of [Provider](../interfaces/\_packages_clarity_src_core_provider_.provider.md)\_

_Defined in [packages/clarity/src/providers/clarityBin/index.ts:324](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/providers/clarityBin/index.ts#L324)_

**Returns:** Promise\<bigint>

---

### initialize

▸ **initialize**(): Promise\<void>

_Implementation of [Provider](../interfaces/\_packages_clarity_src_core_provider_.provider.md)\_

_Defined in [packages/clarity/src/providers/clarityBin/index.ts:87](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/providers/clarityBin/index.ts#L87)_

**Returns:** Promise\<void>

---

### launchContract

▸ **launchContract**(`contractName`: string, `contractFilePath`: string): Promise\<[Receipt](../interfaces/_packages_clarity_src_core_types_.receipt.md)>

_Implementation of [Provider](../interfaces/\_packages_clarity_src_core_provider_.provider.md)\_

_Defined in [packages/clarity/src/providers/clarityBin/index.ts:127](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/providers/clarityBin/index.ts#L127)_

#### Parameters:

| Name               | Type   |
| ------------------ | ------ |
| `contractName`     | string |
| `contractFilePath` | string |

**Returns:** Promise\<[Receipt](../interfaces/_packages_clarity_src_core_types_.receipt.md)>

---

### mineBlock

▸ **mineBlock**(`time?`: number \| bigint): Promise\<void>

_Implementation of [Provider](../interfaces/\_packages_clarity_src_core_provider_.provider.md)\_

_Defined in [packages/clarity/src/providers/clarityBin/index.ts:274](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/providers/clarityBin/index.ts#L274)_

#### Parameters:

| Name    | Type             |
| ------- | ---------------- |
| `time?` | number \| bigint |

**Returns:** Promise\<void>

---

### mineBlocks

▸ **mineBlocks**(`count`: number \| bigint): Promise\<void>

_Defined in [packages/clarity/src/providers/clarityBin/index.ts:299](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/providers/clarityBin/index.ts#L299)_

#### Parameters:

| Name    | Type             |
| ------- | ---------------- |
| `count` | number \| bigint |

**Returns:** Promise\<void>

---

### runCommand

▸ **runCommand**(`args`: string[], `opts?`: undefined \| { stdin: string }): Promise\<[ExecutionResult](../interfaces/_packages_clarity_src_utils_processutil_.executionresult.md)>

_Defined in [packages/clarity/src/providers/clarityBin/index.ts:73](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/providers/clarityBin/index.ts#L73)_

Run command against a local Blockstack node VM.
Uses `clarity-cli` with the configured native bin path.

#### Parameters:

| Name    | Type                           | Description           |
| ------- | ------------------------------ | --------------------- |
| `args`  | string[]                       | clarity-cli commands. |
| `opts?` | undefined \| { stdin: string } | -                     |

**Returns:** Promise\<[ExecutionResult](../interfaces/_packages_clarity_src_utils_processutil_.executionresult.md)>

---

### create

▸ `Static`**create**(`allocations`: [InitialAllocation](../interfaces/_packages_clarity_src_providers_claritybin_index_.initialallocation.md)[], `dbFilePath`: string, `clarityBinPath`: string): Promise\<[NativeClarityBinProvider](_packages_clarity_src_providers_claritybin_index_.nativeclaritybinprovider.md)>

_Defined in [packages/clarity/src/providers/clarityBin/index.ts:29](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/providers/clarityBin/index.ts#L29)_

Instantiates a new executor. Before returning, ensures db is ready with `initialize`.

#### Parameters:

| Name             | Type                                                                                                        | Description                                                                                                      |
| ---------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `allocations`    | [InitialAllocation](../interfaces/_packages_clarity_src_providers_claritybin_index_.initialallocation.md)[] | -                                                                                                                |
| `dbFilePath`     | string                                                                                                      | File path to the db. If not specified then a temporary file is created and gets deleted when `close` is invoked. |
| `clarityBinPath` | string                                                                                                      | -                                                                                                                |

**Returns:** Promise\<[NativeClarityBinProvider](_packages_clarity_src_providers_claritybin_index_.nativeclaritybinprovider.md)>

---

### createEphemeral

▸ `Static`**createEphemeral**(`clarityBinPath`: string): Promise\<[Provider](../interfaces/_packages_clarity_src_core_provider_.provider.md)>

_Defined in [packages/clarity/src/providers/clarityBin/index.ts:44](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/providers/clarityBin/index.ts#L44)_

Instantiates a new executor pointed at a new temporary database file.
The temp file is deleted when `close` is invoked.
Before returning, ensures db is ready with `initialize`.

#### Parameters:

| Name             | Type   |
| ---------------- | ------ |
| `clarityBinPath` | string |

**Returns:** Promise\<[Provider](../interfaces/_packages_clarity_src_core_provider_.provider.md)>
