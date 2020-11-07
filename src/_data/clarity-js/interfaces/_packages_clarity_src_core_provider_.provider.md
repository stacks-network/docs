**[@blockstack/clarity](../README.md)**

> [Globals](../globals.md) / ["packages/clarity/src/core/provider"](../modules/_packages_clarity_src_core_provider_.md) / Provider

# Interface: Provider

## Hierarchy

- **Provider**

## Implemented by

- [JsonRpcProvider](../classes/_packages_clarity_src_providers_jsonrpc_index_.jsonrpcprovider.md)
- [NativeClarityBinProvider](../classes/_packages_clarity_src_providers_claritybin_index_.nativeclaritybinprovider.md)

## Index

### Methods

- [checkContract](_packages_clarity_src_core_provider_.provider.md#checkcontract)
- [close](_packages_clarity_src_core_provider_.provider.md#close)
- [eval](_packages_clarity_src_core_provider_.provider.md#eval)
- [evalRaw](_packages_clarity_src_core_provider_.provider.md#evalraw)
- [execute](_packages_clarity_src_core_provider_.provider.md#execute)
- [getBlockHeight](_packages_clarity_src_core_provider_.provider.md#getblockheight)
- [initialize](_packages_clarity_src_core_provider_.provider.md#initialize)
- [launchContract](_packages_clarity_src_core_provider_.provider.md#launchcontract)
- [mineBlock](_packages_clarity_src_core_provider_.provider.md#mineblock)

## Methods

### checkContract

▸ **checkContract**(`contractFilePath`: string): Promise\<[CheckResult](_packages_clarity_src_core_types_.checkresult.md)>

_Defined in [packages/clarity/src/core/provider.ts:10](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/core/provider.ts#L10)_

#### Parameters:

| Name               | Type   |
| ------------------ | ------ |
| `contractFilePath` | string |

**Returns:** Promise\<[CheckResult](_packages_clarity_src_core_types_.checkresult.md)>

---

### close

▸ **close**(): Promise\<void>

_Defined in [packages/clarity/src/core/provider.ts:31](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/core/provider.ts#L31)_

**Returns:** Promise\<void>

---

### eval

▸ **eval**(`contractName`: string, `evalStatement`: string, `includeDebugOutput?`: undefined \| false \| true, `atChaintip?`: undefined \| false \| true): Promise\<[Receipt](_packages_clarity_src_core_types_.receipt.md)>

_Defined in [packages/clarity/src/core/provider.ts:21](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/core/provider.ts#L21)_

#### Parameters:

| Name                  | Type                       |
| --------------------- | -------------------------- |
| `contractName`        | string                     |
| `evalStatement`       | string                     |
| `includeDebugOutput?` | undefined \| false \| true |
| `atChaintip?`         | undefined \| false \| true |

**Returns:** Promise\<[Receipt](_packages_clarity_src_core_types_.receipt.md)>

---

### evalRaw

▸ **evalRaw**(`evalStatement`: string): Promise\<[Receipt](_packages_clarity_src_core_types_.receipt.md)>

_Defined in [packages/clarity/src/core/provider.ts:25](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/core/provider.ts#L25)_

#### Parameters:

| Name            | Type   |
| --------------- | ------ |
| `evalStatement` | string |

**Returns:** Promise\<[Receipt](_packages_clarity_src_core_types_.receipt.md)>

---

### execute

▸ **execute**(`contractName`: string, `functionName`: string, `senderAddress`: string, ...`args`: string[]): Promise\<[Receipt](_packages_clarity_src_core_types_.receipt.md)>

_Defined in [packages/clarity/src/core/provider.ts:14](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/core/provider.ts#L14)_

#### Parameters:

| Name            | Type     |
| --------------- | -------- |
| `contractName`  | string   |
| `functionName`  | string   |
| `senderAddress` | string   |
| `...args`       | string[] |

**Returns:** Promise\<[Receipt](_packages_clarity_src_core_types_.receipt.md)>

---

### getBlockHeight

▸ **getBlockHeight**(): Promise\<bigint>

_Defined in [packages/clarity/src/core/provider.ts:27](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/core/provider.ts#L27)_

**Returns:** Promise\<bigint>

---

### initialize

▸ **initialize**(): Promise\<void>

_Defined in [packages/clarity/src/core/provider.ts:8](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/core/provider.ts#L8)_

**Returns:** Promise\<void>

---

### launchContract

▸ **launchContract**(`contractName`: string, `contractFilePath`: string): Promise\<[Receipt](_packages_clarity_src_core_types_.receipt.md)>

_Defined in [packages/clarity/src/core/provider.ts:12](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/core/provider.ts#L12)_

#### Parameters:

| Name               | Type   |
| ------------------ | ------ |
| `contractName`     | string |
| `contractFilePath` | string |

**Returns:** Promise\<[Receipt](_packages_clarity_src_core_types_.receipt.md)>

---

### mineBlock

▸ **mineBlock**(`time?`: number \| bigint): Promise\<void>

_Defined in [packages/clarity/src/core/provider.ts:29](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/core/provider.ts#L29)_

#### Parameters:

| Name    | Type             |
| ------- | ---------------- |
| `time?` | number \| bigint |

**Returns:** Promise\<void>
