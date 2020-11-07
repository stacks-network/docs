**[@blockstack/clarity](../README.md)**

> [Globals](../globals.md) / ["packages/clarity/src/core/client"](../modules/_packages_clarity_src_core_client_.md) / Client

# Class: Client

## Hierarchy

- **Client**

## Index

### Constructors

- [constructor](_packages_clarity_src_core_client_.client.md#constructor)

### Properties

- [filePath](_packages_clarity_src_core_client_.client.md#filepath)
- [name](_packages_clarity_src_core_client_.client.md#name)
- [provider](_packages_clarity_src_core_client_.client.md#provider)

### Methods

- [checkContract](_packages_clarity_src_core_client_.client.md#checkcontract)
- [createQuery](_packages_clarity_src_core_client_.client.md#createquery)
- [createTransaction](_packages_clarity_src_core_client_.client.md#createtransaction)
- [deployContract](_packages_clarity_src_core_client_.client.md#deploycontract)
- [submitQuery](_packages_clarity_src_core_client_.client.md#submitquery)
- [submitTransaction](_packages_clarity_src_core_client_.client.md#submittransaction)

## Constructors

### constructor

\+ **new Client**(`name`: string, `filePath`: string, `provider`: [Provider](../interfaces/_packages_clarity_src_core_provider_.provider.md)): [Client](_packages_clarity_src_core_client_.client.md)

_Defined in [packages/clarity/src/core/client.ts:9](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/core/client.ts#L9)_

#### Parameters:

| Name       | Type                                                                       |
| ---------- | -------------------------------------------------------------------------- |
| `name`     | string                                                                     |
| `filePath` | string                                                                     |
| `provider` | [Provider](../interfaces/_packages_clarity_src_core_provider_.provider.md) |

**Returns:** [Client](_packages_clarity_src_core_client_.client.md)

## Properties

### filePath

• **filePath**: string

_Defined in [packages/clarity/src/core/client.ts:8](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/core/client.ts#L8)_

---

### name

• **name**: string

_Defined in [packages/clarity/src/core/client.ts:7](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/core/client.ts#L7)_

---

### provider

• **provider**: [Provider](../interfaces/_packages_clarity_src_core_provider_.provider.md)

_Defined in [packages/clarity/src/core/client.ts:9](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/core/client.ts#L9)_

## Methods

### checkContract

▸ **checkContract**(): Promisevoid

_Defined in [packages/clarity/src/core/client.ts:17](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/core/client.ts#L17)_

**Returns:** Promisevoid

---

### createQuery

▸ **createQuery**(`params`: { atChaintip?: undefined \| false \| true ; method?: [Method](../interfaces/_packages_clarity_src_core_types_.method.md) }): [Query](_packages_clarity_src_core_query_.query.md)

_Defined in [packages/clarity/src/core/client.ts:60](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/core/client.ts#L60)_

Creates a request that won't change the state of the blockchain.

#### Parameters:

| Name     | Type                                                                                                                       | Description                                                                                                                                                                   |
| -------- | -------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `params` | { atChaintip?: undefined \| false \| true ; method?: [Method](../interfaces/_packages_clarity_src_core_types_.method.md) } | object containing details of the blockchain function to call [Method](../interfaces/_packages_clarity_src_core_types_.method.md) and whether to advance the blockchain or not |

**Returns:** [Query](_packages_clarity_src_core_query_.query.md)

---

### createTransaction

▸ **createTransaction**(`params?`: undefined \| { method?: [Method](../interfaces/_packages_clarity_src_core_types_.method.md) }): [Transaction](_packages_clarity_src_core_transaction_.transaction.md)

_Defined in [packages/clarity/src/core/client.ts:29](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/core/client.ts#L29)_

#### Parameters:

| Name      | Type                                                                                          |
| --------- | --------------------------------------------------------------------------------------------- |
| `params?` | undefined \| { method?: [Method](../interfaces/_packages_clarity_src_core_types_.method.md) } |

**Returns:** [Transaction](_packages_clarity_src_core_transaction_.transaction.md)

---

### deployContract

▸ **deployContract**(): Promise\<[Receipt](../interfaces/_packages_clarity_src_core_types_.receipt.md)>

_Defined in [packages/clarity/src/core/client.ts:24](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/core/client.ts#L24)_

**Returns:** Promise\<[Receipt](../interfaces/_packages_clarity_src_core_types_.receipt.md)>

---

### submitQuery

▸ **submitQuery**(`query`: [Query](_packages_clarity_src_core_query_.query.md)): Promise\<[Receipt](../interfaces/_packages_clarity_src_core_types_.receipt.md)>

_Defined in [packages/clarity/src/core/client.ts:72](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/core/client.ts#L72)_

Submits the given transaction or read-only request
without changing the state of the blockchain. Any change will be rolledback
after the request.

#### Parameters:

| Name    | Type                                                | Description                        |
| ------- | --------------------------------------------------- | ---------------------------------- |
| `query` | [Query](_packages_clarity_src_core_query_.query.md) | usualy created using `createQuery` |

**Returns:** Promise\<[Receipt](../interfaces/_packages_clarity_src_core_types_.receipt.md)>

---

### submitTransaction

▸ **submitTransaction**(`tx`: [Transaction](_packages_clarity_src_core_transaction_.transaction.md)): Promise\<[Receipt](../interfaces/_packages_clarity_src_core_types_.receipt.md)>

_Defined in [packages/clarity/src/core/client.ts:34](https://github.com/blockstack/clarity-js-sdk/blob/711ac7c/packages/clarity/src/core/client.ts#L34)_

#### Parameters:

| Name | Type                                                                  |
| ---- | --------------------------------------------------------------------- |
| `tx` | [Transaction](_packages_clarity_src_core_transaction_.transaction.md) |

**Returns:** Promise\<[Receipt](../interfaces/_packages_clarity_src_core_types_.receipt.md)>
