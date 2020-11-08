**[@stacks/auth](../README.md)**

> [Globals](../globals.md) / ["network/src/index"](../modules/_network_src_index_.md) / StacksNetwork

# Interface: StacksNetwork

## Hierarchy

- **StacksNetwork**

## Implemented by

- [StacksMainnet](../classes/_network_src_index_.stacksmainnet.md)
- [StacksMocknet](../classes/_network_src_index_.stacksmocknet.md)
- [StacksMocknet](../classes/_network_src_index_.stacksmocknet.md)
- [StacksTestnet](../classes/_network_src_index_.stackstestnet.md)
- [StacksTestnet](../classes/_network_src_index_.stackstestnet.md)

## Index

### Properties

- [accountEndpoint](_network_src_index_.stacksnetwork.md#accountendpoint)
- [broadcastEndpoint](_network_src_index_.stacksnetwork.md#broadcastendpoint)
- [chainId](_network_src_index_.stacksnetwork.md#chainid)
- [contractAbiEndpoint](_network_src_index_.stacksnetwork.md#contractabiendpoint)
- [coreApiUrl](_network_src_index_.stacksnetwork.md#coreapiurl)
- [getAbiApiUrl](_network_src_index_.stacksnetwork.md#getabiapiurl)
- [getAccountApiUrl](_network_src_index_.stacksnetwork.md#getaccountapiurl)
- [getBroadcastApiUrl](_network_src_index_.stacksnetwork.md#getbroadcastapiurl)
- [getNameInfo](_network_src_index_.stacksnetwork.md#getnameinfo)
- [getReadOnlyFunctionCallApiUrl](_network_src_index_.stacksnetwork.md#getreadonlyfunctioncallapiurl)
- [getTransferFeeEstimateApiUrl](_network_src_index_.stacksnetwork.md#gettransferfeeestimateapiurl)
- [readOnlyFunctionCallEndpoint](_network_src_index_.stacksnetwork.md#readonlyfunctioncallendpoint)
- [transferFeeEstimateEndpoint](_network_src_index_.stacksnetwork.md#transferfeeestimateendpoint)
- [version](_network_src_index_.stacksnetwork.md#version)

## Properties

### accountEndpoint

• **accountEndpoint**: string

_Defined in [packages/network/src/index.ts:9](https://github.com/blockstack/blockstack.js/blob/26419086/packages/network/src/index.ts#L9)_

---

### broadcastEndpoint

• **broadcastEndpoint**: string

_Defined in [packages/network/src/index.ts:7](https://github.com/blockstack/blockstack.js/blob/26419086/packages/network/src/index.ts#L7)_

---

### chainId

• **chainId**: [ChainID](../enums/_common_src_constants_.chainid.md)

_Defined in [packages/network/src/index.ts:5](https://github.com/blockstack/blockstack.js/blob/26419086/packages/network/src/index.ts#L5)_

---

### contractAbiEndpoint

• **contractAbiEndpoint**: string

_Defined in [packages/network/src/index.ts:10](https://github.com/blockstack/blockstack.js/blob/26419086/packages/network/src/index.ts#L10)_

---

### coreApiUrl

• **coreApiUrl**: string

_Defined in [packages/network/src/index.ts:6](https://github.com/blockstack/blockstack.js/blob/26419086/packages/network/src/index.ts#L6)_

---

### getAbiApiUrl

• **getAbiApiUrl**: (address: string, contract: string) => string

_Defined in [packages/network/src/index.ts:15](https://github.com/blockstack/blockstack.js/blob/26419086/packages/network/src/index.ts#L15)_

---

### getAccountApiUrl

• **getAccountApiUrl**: (address: string) => string

_Defined in [packages/network/src/index.ts:14](https://github.com/blockstack/blockstack.js/blob/26419086/packages/network/src/index.ts#L14)_

---

### getBroadcastApiUrl

• **getBroadcastApiUrl**: () => string

_Defined in [packages/network/src/index.ts:12](https://github.com/blockstack/blockstack.js/blob/26419086/packages/network/src/index.ts#L12)_

---

### getNameInfo

• **getNameInfo**: (fullyQualifiedName: string) => any

_Defined in [packages/network/src/index.ts:30](https://github.com/blockstack/blockstack.js/blob/26419086/packages/network/src/index.ts#L30)_

Get WHOIS-like information for a name, including the address that owns it,
the block at which it expires, and the zone file anchored to it (if available).

This is intended for use in third-party wallets or in DApps that register names.

**`param`** the name to query. Can be on-chain of off-chain.

**`returns`** a promise that resolves to the WHOIS-like information

---

### getReadOnlyFunctionCallApiUrl

• **getReadOnlyFunctionCallApiUrl**: (contractAddress: string, contractName: string, functionName: string) => string

_Defined in [packages/network/src/index.ts:16](https://github.com/blockstack/blockstack.js/blob/26419086/packages/network/src/index.ts#L16)_

---

### getTransferFeeEstimateApiUrl

• **getTransferFeeEstimateApiUrl**: () => string

_Defined in [packages/network/src/index.ts:13](https://github.com/blockstack/blockstack.js/blob/26419086/packages/network/src/index.ts#L13)_

---

### readOnlyFunctionCallEndpoint

• **readOnlyFunctionCallEndpoint**: string

_Defined in [packages/network/src/index.ts:11](https://github.com/blockstack/blockstack.js/blob/26419086/packages/network/src/index.ts#L11)_

---

### transferFeeEstimateEndpoint

• **transferFeeEstimateEndpoint**: string

_Defined in [packages/network/src/index.ts:8](https://github.com/blockstack/blockstack.js/blob/26419086/packages/network/src/index.ts#L8)_

---

### version

• **version**: [TransactionVersion](../enums/_common_src_constants_.transactionversion.md)

_Defined in [packages/network/src/index.ts:4](https://github.com/blockstack/blockstack.js/blob/26419086/packages/network/src/index.ts#L4)_
