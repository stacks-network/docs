**[@stacks/auth](../README.md)**

> [Globals](../globals.md) / ["network/src/index"](../modules/_network_src_index_.md) / StacksMocknet

# Class: StacksMocknet

## Hierarchy

- [StacksMainnet](_network_src_index_.stacksmainnet.md)

  ↳ **StacksMocknet**

## Implements

- [StacksNetwork](../interfaces/_network_src_index_.stacksnetwork.md)
- [StacksNetwork](../interfaces/_network_src_index_.stacksnetwork.md)

## Index

### Properties

- [accountEndpoint](_network_src_index_.stacksmocknet.md#accountendpoint)
- [broadcastEndpoint](_network_src_index_.stacksmocknet.md#broadcastendpoint)
- [chainId](_network_src_index_.stacksmocknet.md#chainid)
- [contractAbiEndpoint](_network_src_index_.stacksmocknet.md#contractabiendpoint)
- [coreApiUrl](_network_src_index_.stacksmocknet.md#coreapiurl)
- [readOnlyFunctionCallEndpoint](_network_src_index_.stacksmocknet.md#readonlyfunctioncallendpoint)
- [transferFeeEstimateEndpoint](_network_src_index_.stacksmocknet.md#transferfeeestimateendpoint)
- [version](_network_src_index_.stacksmocknet.md#version)

### Methods

- [getAbiApiUrl](_network_src_index_.stacksmocknet.md#getabiapiurl)
- [getAccountApiUrl](_network_src_index_.stacksmocknet.md#getaccountapiurl)
- [getBroadcastApiUrl](_network_src_index_.stacksmocknet.md#getbroadcastapiurl)
- [getNameInfo](_network_src_index_.stacksmocknet.md#getnameinfo)
- [getReadOnlyFunctionCallApiUrl](_network_src_index_.stacksmocknet.md#getreadonlyfunctioncallapiurl)
- [getTransferFeeEstimateApiUrl](_network_src_index_.stacksmocknet.md#gettransferfeeestimateapiurl)

## Properties

### accountEndpoint

• **accountEndpoint**: string = "/v2/accounts"

_Implementation of [StacksNetwork](../interfaces/\_network_src_index_.stacksnetwork.md).[accountEndpoint](../interfaces/_network_src_index_.stacksnetwork.md#accountendpoint)\_

_Inherited from [StacksMainnet](\_network_src_index_.stacksmainnet.md).[accountEndpoint](_network_src_index_.stacksmainnet.md#accountendpoint)\_

_Defined in [packages/network/src/index.ts:39](https://github.com/blockstack/blockstack.js/blob/26419086/packages/network/src/index.ts#L39)_

---

### broadcastEndpoint

• **broadcastEndpoint**: string = "/v2/transactions"

_Implementation of [StacksNetwork](../interfaces/\_network_src_index_.stacksnetwork.md).[broadcastEndpoint](../interfaces/_network_src_index_.stacksnetwork.md#broadcastendpoint)\_

_Inherited from [StacksMainnet](\_network_src_index_.stacksmainnet.md).[broadcastEndpoint](_network_src_index_.stacksmainnet.md#broadcastendpoint)\_

_Defined in [packages/network/src/index.ts:37](https://github.com/blockstack/blockstack.js/blob/26419086/packages/network/src/index.ts#L37)_

---

### chainId

• **chainId**: [ChainID](../enums/_common_src_constants_.chainid.md) = ChainID.Testnet

_Implementation of [StacksNetwork](../interfaces/\_network_src_index_.stacksnetwork.md).[chainId](../interfaces/_network_src_index_.stacksnetwork.md#chainid)\_

_Overrides [StacksMainnet](\_network_src_index_.stacksmainnet.md).[chainId](_network_src_index_.stacksmainnet.md#chainid)\_

_Defined in [packages/network/src/index.ts:92](https://github.com/blockstack/blockstack.js/blob/26419086/packages/network/src/index.ts#L92)_

---

### contractAbiEndpoint

• **contractAbiEndpoint**: string = "/v2/contracts/interface"

_Implementation of [StacksNetwork](../interfaces/\_network_src_index_.stacksnetwork.md).[contractAbiEndpoint](../interfaces/_network_src_index_.stacksnetwork.md#contractabiendpoint)\_

_Inherited from [StacksMainnet](\_network_src_index_.stacksmainnet.md).[contractAbiEndpoint](_network_src_index_.stacksmainnet.md#contractabiendpoint)\_

_Defined in [packages/network/src/index.ts:40](https://github.com/blockstack/blockstack.js/blob/26419086/packages/network/src/index.ts#L40)_

---

### coreApiUrl

• **coreApiUrl**: string = "http://localhost:3999"

_Implementation of [StacksNetwork](../interfaces/\_network_src_index_.stacksnetwork.md).[coreApiUrl](../interfaces/_network_src_index_.stacksnetwork.md#coreapiurl)\_

_Overrides [StacksMainnet](\_network_src_index_.stacksmainnet.md).[coreApiUrl](_network_src_index_.stacksmainnet.md#coreapiurl)\_

_Defined in [packages/network/src/index.ts:93](https://github.com/blockstack/blockstack.js/blob/26419086/packages/network/src/index.ts#L93)_

---

### readOnlyFunctionCallEndpoint

• **readOnlyFunctionCallEndpoint**: string = "/v2/contracts/call-read"

_Implementation of [StacksNetwork](../interfaces/\_network_src_index_.stacksnetwork.md).[readOnlyFunctionCallEndpoint](../interfaces/_network_src_index_.stacksnetwork.md#readonlyfunctioncallendpoint)\_

_Inherited from [StacksMainnet](\_network_src_index_.stacksmainnet.md).[readOnlyFunctionCallEndpoint](_network_src_index_.stacksmainnet.md#readonlyfunctioncallendpoint)\_

_Defined in [packages/network/src/index.ts:41](https://github.com/blockstack/blockstack.js/blob/26419086/packages/network/src/index.ts#L41)_

---

### transferFeeEstimateEndpoint

• **transferFeeEstimateEndpoint**: string = "/v2/fees/transfer"

_Implementation of [StacksNetwork](../interfaces/\_network_src_index_.stacksnetwork.md).[transferFeeEstimateEndpoint](../interfaces/_network_src_index_.stacksnetwork.md#transferfeeestimateendpoint)\_

_Inherited from [StacksMainnet](\_network_src_index_.stacksmainnet.md).[transferFeeEstimateEndpoint](_network_src_index_.stacksmainnet.md#transferfeeestimateendpoint)\_

_Defined in [packages/network/src/index.ts:38](https://github.com/blockstack/blockstack.js/blob/26419086/packages/network/src/index.ts#L38)_

---

### version

• **version**: [TransactionVersion](../enums/_common_src_constants_.transactionversion.md) = TransactionVersion.Testnet

_Implementation of [StacksNetwork](../interfaces/\_network_src_index_.stacksnetwork.md).[version](../interfaces/_network_src_index_.stacksnetwork.md#version)\_

_Overrides [StacksMainnet](\_network_src_index_.stacksmainnet.md).[version](_network_src_index_.stacksmainnet.md#version)\_

_Defined in [packages/network/src/index.ts:91](https://github.com/blockstack/blockstack.js/blob/26419086/packages/network/src/index.ts#L91)_

## Methods

### getAbiApiUrl

▸ **getAbiApiUrl**(`address`: string, `contract`: string): string

_Inherited from [StacksMainnet](\_network_src_index_.stacksmainnet.md).[getAbiApiUrl](_network_src_index_.stacksmainnet.md#getabiapiurl)\_

_Defined in [packages/network/src/index.ts:46](https://github.com/blockstack/blockstack.js/blob/26419086/packages/network/src/index.ts#L46)_

#### Parameters:

| Name       | Type   |
| ---------- | ------ |
| `address`  | string |
| `contract` | string |

**Returns:** string

---

### getAccountApiUrl

▸ **getAccountApiUrl**(`address`: string): string

_Inherited from [StacksMainnet](\_network_src_index_.stacksmainnet.md).[getAccountApiUrl](_network_src_index_.stacksmainnet.md#getaccountapiurl)\_

_Defined in [packages/network/src/index.ts:44](https://github.com/blockstack/blockstack.js/blob/26419086/packages/network/src/index.ts#L44)_

#### Parameters:

| Name      | Type   |
| --------- | ------ |
| `address` | string |

**Returns:** string

---

### getBroadcastApiUrl

▸ **getBroadcastApiUrl**(): string

_Inherited from [StacksMainnet](\_network_src_index_.stacksmainnet.md).[getBroadcastApiUrl](_network_src_index_.stacksmainnet.md#getbroadcastapiurl)\_

_Defined in [packages/network/src/index.ts:42](https://github.com/blockstack/blockstack.js/blob/26419086/packages/network/src/index.ts#L42)_

**Returns:** string

---

### getNameInfo

▸ **getNameInfo**(`fullyQualifiedName`: string): Promise\<any>

_Inherited from [StacksMainnet](\_network_src_index_.stacksmainnet.md).[getNameInfo](_network_src_index_.stacksmainnet.md#getnameinfo)\_

_Defined in [packages/network/src/index.ts:56](https://github.com/blockstack/blockstack.js/blob/26419086/packages/network/src/index.ts#L56)_

#### Parameters:

| Name                 | Type   |
| -------------------- | ------ |
| `fullyQualifiedName` | string |

**Returns:** Promise\<any>

---

### getReadOnlyFunctionCallApiUrl

▸ **getReadOnlyFunctionCallApiUrl**(`contractAddress`: string, `contractName`: string, `functionName`: string): string

_Inherited from [StacksMainnet](\_network_src_index_.stacksmainnet.md).[getReadOnlyFunctionCallApiUrl](_network_src_index_.stacksmainnet.md#getreadonlyfunctioncallapiurl)\_

_Defined in [packages/network/src/index.ts:48](https://github.com/blockstack/blockstack.js/blob/26419086/packages/network/src/index.ts#L48)_

#### Parameters:

| Name              | Type   |
| ----------------- | ------ |
| `contractAddress` | string |
| `contractName`    | string |
| `functionName`    | string |

**Returns:** string

---

### getTransferFeeEstimateApiUrl

▸ **getTransferFeeEstimateApiUrl**(): string

_Inherited from [StacksMainnet](\_network_src_index_.stacksmainnet.md).[getTransferFeeEstimateApiUrl](_network_src_index_.stacksmainnet.md#gettransferfeeestimateapiurl)\_

_Defined in [packages/network/src/index.ts:43](https://github.com/blockstack/blockstack.js/blob/26419086/packages/network/src/index.ts#L43)_

**Returns:** string
