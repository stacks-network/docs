**[@blockstack/clarity](../README.md)**

> [Globals](../globals.md) / ["packages/clarity/src/providers/jsonRpc/index"](../modules/_packages_clarity_src_providers_jsonrpc_index_.md) / JsonRpcProvider

# Class: JsonRpcProvider

## Hierarchy

- **JsonRpcProvider**

## Implements

- [Provider](../interfaces/_packages_clarity_src_core_provider_.provider.md)

## Index

### Methods

- [checkContract](_packages_clarity_src_providers_jsonrpc_index_.jsonrpcprovider.md#checkcontract)
- [close](_packages_clarity_src_providers_jsonrpc_index_.jsonrpcprovider.md#close)
- [eval](_packages_clarity_src_providers_jsonrpc_index_.jsonrpcprovider.md#eval)
- [evalRaw](_packages_clarity_src_providers_jsonrpc_index_.jsonrpcprovider.md#evalraw)
- [execute](_packages_clarity_src_providers_jsonrpc_index_.jsonrpcprovider.md#execute)
- [getBlockHeight](_packages_clarity_src_providers_jsonrpc_index_.jsonrpcprovider.md#getblockheight)
- [initialize](_packages_clarity_src_providers_jsonrpc_index_.jsonrpcprovider.md#initialize)
- [launchContract](_packages_clarity_src_providers_jsonrpc_index_.jsonrpcprovider.md#launchcontract)
- [mineBlock](_packages_clarity_src_providers_jsonrpc_index_.jsonrpcprovider.md#mineblock)
- [mineBlocks](_packages_clarity_src_providers_jsonrpc_index_.jsonrpcprovider.md#mineblocks)

## Methods

### checkContract

▸ **checkContract**(`contractFilePath`: string): Promise\<[CheckResult](../interfaces/_packages_clarity_src_core_types_.checkresult.md)>

_Implementation of [Provider](../interfaces/\_packages_clarity_src_core_provider_.provider.md)\_

_Defined in [packages/clarity/src/providers/jsonRpc/index.ts:7](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/providers/jsonRpc/index.ts#L7)_

#### Parameters:

| Name               | Type   |
| ------------------ | ------ |
| `contractFilePath` | string |

**Returns:** Promise\<[CheckResult](../interfaces/_packages_clarity_src_core_types_.checkresult.md)>

---

### close

▸ **close**(): Promise\<void>

_Implementation of [Provider](../interfaces/\_packages_clarity_src_core_provider_.provider.md)\_

_Defined in [packages/clarity/src/providers/jsonRpc/index.ts:54](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/providers/jsonRpc/index.ts#L54)_

**Returns:** Promise\<void>

---

### eval

▸ **eval**(`contractName`: string, `evalStatement`: string, `includeDebugOutput?`: boolean): Promise\<[Receipt](../interfaces/_packages_clarity_src_core_types_.receipt.md)>

_Defined in [packages/clarity/src/providers/jsonRpc/index.ts:36](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/providers/jsonRpc/index.ts#L36)_

#### Parameters:

| Name                 | Type    | Default value |
| -------------------- | ------- | ------------- |
| `contractName`       | string  | -             |
| `evalStatement`      | string  | -             |
| `includeDebugOutput` | boolean | true          |

**Returns:** Promise\<[Receipt](../interfaces/_packages_clarity_src_core_types_.receipt.md)>

---

### evalRaw

▸ **evalRaw**(`evalStatement`: string): Promise\<[Receipt](../interfaces/_packages_clarity_src_core_types_.receipt.md)>

_Implementation of [Provider](../interfaces/\_packages_clarity_src_core_provider_.provider.md)\_

_Defined in [packages/clarity/src/providers/jsonRpc/index.ts:30](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/providers/jsonRpc/index.ts#L30)_

#### Parameters:

| Name            | Type   |
| --------------- | ------ |
| `evalStatement` | string |

**Returns:** Promise\<[Receipt](../interfaces/_packages_clarity_src_core_types_.receipt.md)>

---

### execute

▸ **execute**(`contractName`: string, `functionName`: string, `senderAddress`: string, ...`args`: string[]): Promise\<[Receipt](../interfaces/_packages_clarity_src_core_types_.receipt.md)>

_Implementation of [Provider](../interfaces/\_packages_clarity_src_core_provider_.provider.md)\_

_Defined in [packages/clarity/src/providers/jsonRpc/index.ts:19](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/providers/jsonRpc/index.ts#L19)_

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

_Defined in [packages/clarity/src/providers/jsonRpc/index.ts:50](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/providers/jsonRpc/index.ts#L50)_

**Returns:** Promise\<bigint>

---

### initialize

▸ **initialize**(): Promise\<void>

_Implementation of [Provider](../interfaces/\_packages_clarity_src_core_provider_.provider.md)\_

_Defined in [packages/clarity/src/providers/jsonRpc/index.ts:5](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/providers/jsonRpc/index.ts#L5)_

**Returns:** Promise\<void>

---

### launchContract

▸ **launchContract**(`contractName`: string, `contractFilePath`: string): Promise\<[Receipt](../interfaces/_packages_clarity_src_core_types_.receipt.md)>

_Implementation of [Provider](../interfaces/\_packages_clarity_src_core_provider_.provider.md)\_

_Defined in [packages/clarity/src/providers/jsonRpc/index.ts:13](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/providers/jsonRpc/index.ts#L13)_

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

_Defined in [packages/clarity/src/providers/jsonRpc/index.ts:46](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/providers/jsonRpc/index.ts#L46)_

#### Parameters:

| Name    | Type             |
| ------- | ---------------- |
| `time?` | number \| bigint |

**Returns:** Promise\<void>

---

### mineBlocks

▸ **mineBlocks**(`count`: number \| bigint): Promise\<void>

_Defined in [packages/clarity/src/providers/jsonRpc/index.ts:48](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/providers/jsonRpc/index.ts#L48)_

#### Parameters:

| Name    | Type             |
| ------- | ---------------- |
| `count` | number \| bigint |

**Returns:** Promise\<void>
