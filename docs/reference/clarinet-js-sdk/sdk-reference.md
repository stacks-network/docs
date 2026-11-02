# SDK Reference

The Clarinet JS SDK provides a comprehensive suite of helpers for testing and interacting with Clarity smart contracts. From simnet initialization to contract deployment, the SDK streamlines your entire testing workflow.

* Initialize a simulated network: `initSimnet`
* Manage contract state: `getDataVar`, `getMapEntry`
* Call contract functions: `callReadOnlyFn`, `callPublicFn`
* Transfer STX: `transferSTX`
* Deploy contracts: `deployContract`
* Mine blocks: `mineBlock`, `mineEmptyBlock`
* Custom assertions: `toBeOk`, `toBeErr`

## Installation

```bash
npm install @stacks/clarinet-sdk
```

## Initialize simulated network

### initSimnet

`initSimnet` initializes a simulated network for testing your smart contracts.

Usage:

```
initSimnet(manifestPath?: string): Promise<Simnet>
```

```ts
import { initSimnet } from '@stacks/clarinet-sdk';

const simnet = await initSimnet();
```

| Parameter      | Type     | Description                                  |
| -------------- | -------- | -------------------------------------------- |
| `manifestPath` | `string` | Optional path to Clarinet.toml manifest file |

## Simnet properties

### blockHeight

Returns the current block height of simnet.

```ts
const currentBlockHeight = simnet.blockHeight;
// Returns: 1
```

### deployer

Returns the default deployer address as defined in the project file.

```ts
const deployerAddress = simnet.deployer;
// Returns: ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
```

You can also update the deployer:

```ts
simnet.deployer = 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5';
```

### currentEpoch

Returns the current epoch of simnet (e.g., 2.5 for Stacks 2.5).

```ts
const epoch = simnet.currentEpoch;
// Returns: 2.5
```

## Account management

### getAccounts

`getAccounts` retrieves all configured Stacks addresses including wallets, deployers, and faucets.

Usage:

```
getAccounts(): Map<string, string>
```

```ts
const accounts = simnet.getAccounts();
const wallet1 = accounts.get('wallet_1')!;
// Returns: ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5
```

## Asset balances

### getAssetsMap

`getAssetsMap` retrieves asset balances for all addresses, including STX, fungible, and non-fungible tokens.

Usage:

```
getAssetsMap(): Map<string, Map<string, bigint>>
```

```ts
const assets = simnet.getAssetsMap();
const stxBalances = assets.get('STX')!;
const deployerBalance = stxBalances.get(simnet.deployer)!;
// Returns: 100000000000000n
```

## Read contract state

### getDataVar

`getDataVar` retrieves the value of a data variable from a contract.

Usage:

```
getDataVar(contract: string, dataVar: string): ClarityValue
```

```ts
const count = simnet.getDataVar('counter', 'count');
// Returns: { type: 1, value: 1n }
```

| Parameter  | Type     | Description               |
| ---------- | -------- | ------------------------- |
| `contract` | `string` | Contract identifier       |
| `dataVar`  | `string` | Name of the data variable |

### getMapEntry

`getMapEntry` retrieves a value from a contract map by its key. Like the node's map-entry endpoint, it returns `(some value)` for an existing entry and `none` otherwise, including when the map or contract does not exist.

Usage:

```
getMapEntry(contract: string, mapName: string, mapKey: ClarityValue): ClarityValue
```

```ts
import { Cl } from '@stacks/transactions';

const hasParticipated = simnet.getMapEntry(
  "pool",
  "Participants",
  Cl.standardPrincipal(wallet)
);
// Returns: Cl.some(Cl.bool(true)), or Cl.none() if there is no entry
```

| Parameter  | Type           | Description         |
| ---------- | -------------- | ------------------- |
| `contract` | `string`       | Contract identifier |
| `mapName`  | `string`       | Name of the map     |
| `mapKey`   | `ClarityValue` | Key to look up      |

## Call contract functions

### callReadOnlyFn

`callReadOnlyFn` calls read-only functions without mining a block.

Usage:

```
callReadOnlyFn(
  contract: string,
  method: string,
  args: ClarityValue[],
  sender: string
): ParsedTransactionResult
```

```ts
import { Cl } from '@stacks/transactions';

const result = simnet.callReadOnlyFn(
  'pool',
  'get-contribution-amount',
  [Cl.standardPrincipal(wallet)],
  wallet
);
// Returns: { result: { type: 1, value: 42000000n }, events: [] }
```

| Parameter  | Type             | Description         |
| ---------- | ---------------- | ------------------- |
| `contract` | `string`         | Contract identifier |
| `method`   | `string`         | Function name       |
| `args`     | `ClarityValue[]` | Function arguments  |
| `sender`   | `string`         | Sender address      |

### callPublicFn

`callPublicFn` calls public functions and mines a block.

Usage:

```
callPublicFn(
  contract: string,
  method: string,
  args: ClarityValue[],
  sender: string
): ParsedTransactionResult
```

```ts
import { Cl } from '@stacks/transactions';

const result = simnet.callPublicFn(
  'pool',
  'register-participant',
  [Cl.standardPrincipal(wallet)],
  wallet
);
// Mines block and returns result
```

A returned `(err ...)` response does not throw. `callPublicFn`, `callPrivateFn`, `deployContract` and `transferSTX` throw when simnet rejects the transaction. They also throw when simnet includes the transaction but it fails with a runtime error or a post-condition abort. An included failure still consumes the sender's nonce and mines its block. To tell included failures from rejections, use [`mineBlock`](#mineblock).

### callPrivateFn

`callPrivateFn` calls private functions (testing only) and mines a block.

Usage:

```
callPrivateFn(
  contract: string,
  method: string,
  args: ClarityValue[],
  sender: string
): ParsedTransactionResult
```

```ts
const result = simnet.callPrivateFn(
  "pool",
  "reward-participant-points",
  [Cl.standardPrincipal(address1)],
  wallet
);
```

## Transfer STX

`transferSTX` transfers STX between addresses and mines a block. Like `callPublicFn`, it advances one block before executing, even when simnet rejects the transfer.

Self-transfers, zero-amount transfers, and transfers that exceed the sender's unlocked balance throw without consuming a nonce. Inside `mineBlock`, these transfers return a `rejected` outcome instead.

Usage:

```
transferSTX(
  amount: number | bigint,
  recipient: string,
  sender: string
): ParsedTransactionResult
```

```ts
const transfer = simnet.transferSTX(
  42000000, // 42 STX in microSTX
  recipient,
  simnet.deployer
);
// Returns transaction result with transfer event
```

| Parameter   | Type               | Description        |
| ----------- | ------------------ | ------------------ |
| `amount`    | `number \| bigint` | Amount in microSTX |
| `recipient` | `string`           | Recipient address  |
| `sender`    | `string`           | Sender address     |

## Deploy contracts

`deployContract` deploys a new contract to simnet and mines a block. A successful deployment returns `(ok true)`, whatever the contract's final top-level expression evaluates to. To check what the contract did when it initialized, use read-only calls, `getDataVar` and events. To evaluate a snippet and get its value, use [`execute`](#execute).

An unsupported `clarityVersion` throws instead of falling back to the default version. Simnet rejects a duplicate contract name without consuming a nonce.

Usage:

```
deployContract(
  name: string,
  content: string,
  options: DeployContractOptions | null,
  sender: string
): ParsedTransactionResult
```

```ts
const sourceCode = '(define-read-only (say-hi) (ok "Hello World"))';

const contract = simnet.deployContract(
  'hello-world',
  sourceCode,
  { clarityVersion: 2 },
  simnet.deployer
);
```

| Parameter | Type             | Description         |
| --------- | ---------------- | ------------------- |
| `name`    | `string`         | Contract name       |
| `content` | `string`         | Clarity source code |
| `options` | `object \| null` | Deployment options  |
| `sender`  | `string`         | Deployer address    |

## Block mining

### mineBlock

`mineBlock` mines a block with multiple transactions. It advances exactly one block, and all entries execute at that height. It first mines any signed transactions queued with [`broadcastTransaction`](#broadcasttransaction), then the entries in `txs`, in input order.

Usage:

```
mineBlock(txs?: Tx[]): BlockTransactionResult[]
```

```ts
import { tx } from '@stacks/clarinet-sdk';
import { Cl } from '@stacks/transactions';

const block = simnet.mineBlock([
  tx.callPublicFn("counter", "increment", [], simnet.deployer),
  tx.transferSTX(19000000, wallet, simnet.deployer),
]);

for (const outcome of block) {
  if (outcome.status === "success") {
    console.log(outcome.execution.result);
  } else {
    console.log(outcome.status, outcome.error);
  }
}
```

Each result has one of three statuses. A failed entry does not stop the batch. Later entries still execute.

| Status             | Meaning                                                                                                                                                                                                                                          |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `success`          | `execution` holds the parsed result, events and costs.                                                                                                                                                                                           |
| `included_failure` | Simnet included the transaction, but it failed. `error` describes the failure and `kind` is `abort_by_response`, `abort_by_post_condition`, `runtime_error` or `analysis_error`. `execution` is always present. The transaction consumes the nonce, and its payload writes roll back. |
| `rejected`         | Simnet did not include the transaction. `error` gives the reason. Simnet commits no writes and no nonce changes.                                                                                                                                 |

Results for signed transactions also have a `transaction` property with the `txid`, `fee` and `nonce`.

{% hint style="warning" %}
**Migrating from Clarinet SDK 3.x**

Before 4.0, each entry returned the execution result directly, and most failures threw and stopped the batch. Replace direct access such as `block[0].result` with a status check and `block[0].execution.result`.
{% endhint %}

### mineEmptyBlock

`mineEmptyBlock` mines an empty block and increases block height.

Usage:

```
mineEmptyBlock(): number
```

```ts
simnet.mineEmptyBlock();
const newHeight = simnet.blockHeight;
// Returns: 2
```

### mineEmptyBlocks

`mineEmptyBlocks` mines multiple empty blocks.

Usage:

```
mineEmptyBlocks(count?: number): number
```

```ts
simnet.mineEmptyBlocks(5);
const newHeight = simnet.blockHeight;
// Returns: 6
```

## Signed transactions

### broadcastTransaction

`broadcastTransaction` submits a signed, serialized Stacks transaction to the simnet's local mempool. It runs the node's mempool admission checks but does not execute the transaction, charge fees, consume nonces, or advance the chain. Call `mineBlock()` to mine queued transactions.

Usage:

```
broadcastTransaction(rawHex: string): BroadcastTransactionResult
```

On acceptance it returns `{ txid }`. On rejection it returns `{ error, reason, reason_data?, txid? }`.

```ts
import { makeSTXTokenTransfer } from '@stacks/transactions';

const transaction = await makeSTXTokenTransfer({
  network: "testnet",
  senderKey,
  recipient,
  amount: 100n,
  fee: 1000n,
  nonce: simnet.getAccountNonce(sender),
});

const admission = simnet.broadcastTransaction(transaction.serialize());
if ("error" in admission) {
  throw new Error(admission.reason);
}

const [outcome] = simnet.mineBlock();
if (outcome.status === "success") {
  console.log(outcome.transaction?.txid, outcome.execution.result);
}
```

Admission checks signatures, network and epoch rules, nonces, unlocked funds, transfer validity, duplicate deployments, and public-function access and argument types. Admission rejects transactions that call read-only, private or missing functions. The minimum fee is 1 micro-STX per serialized byte. Set `fee` and `nonce` explicitly so Stacks.js does not request them from a remote node.

Admission does not guarantee inclusion, because `mineBlock` checks the current state again. A transaction with a future nonce stays in the queue until `mineBlock` mines the transactions with the earlier nonces. To execute a signed transaction directly, without mempool admission, pass it to `mineBlock` as `{ broadcastTx: rawHex }`.

## Utility methods

### execute

`execute` evaluates arbitrary Clarity code without deploying a contract. The `result` property holds the parsed Clarity value of the expression. If evaluation fails, `execute` throws, so wrap it in `try`/`catch` when you expect a failure.

Usage:

```
execute(snippet: string): ParsedTransactionResult
```

```ts
const { result } = simnet.execute('(stx-account tx-sender)');
// Returns a tuple with the account's locked, unlocked and unlock-height values
```

{% hint style="warning" %}
Clarinet SDK 4.0 removed `simnet.runSnippet(code)`. Replace it with `simnet.execute(code).result`. Unlike `runSnippet`, `execute` throws on failure instead of returning an `"error:"` string.
{% endhint %}

### getContractsInterfaces

`getContractsInterfaces` returns contract interfaces with function signatures and storage.

Usage:

```
getContractsInterfaces(): Map<string, ContractInterface>
```

```ts
const interfaces = simnet.getContractsInterfaces();
const poolInterface = interfaces.get(`${simnet.deployer}.pool`);
// Returns contract interface with functions, maps, variables
```

### getContractSource

`getContractSource` retrieves the source code of a deployed contract.

Usage:

```
getContractSource(contract: string): string | undefined
```

```ts
const source = simnet.getContractSource('pool');
// Returns Clarity source code as string
```

### getContractAST

`getContractAST` returns the Abstract Syntax Tree of a contract.

Usage:

```
getContractAST(contractId: string): ContractAST
```

```ts
const ast = simnet.getContractAST('pool');
// Returns parsed AST structure
```

## Custom matchers

The SDK provides Vitest matchers for Clarity value assertions.

### Response matchers

#### toBeOk

Asserts that a response is `(ok <value>)`.

```ts
expect(result).toBeOk(Cl.uint(1));
```

#### toBeErr

Asserts that a response is `(err <value>)`.

```ts
expect(result).toBeErr(Cl.uint(500));
```

#### toBeSome

Asserts that a response is `(some <value>)`.

```ts
expect(result).toBeSome(Cl.bool(true));
```

#### toBeNone

Asserts that a response is `(none)`.

```ts
expect(result).toBeNone();
```

### Value matchers

#### toBeBool

Asserts a boolean value.

```ts
expect(result).toBeBool(true);
```

#### toBeInt

Asserts a signed integer value.

```ts
expect(result).toBeInt(1); // or 1n
```

#### toBeUint

Asserts an unsigned integer value.

```ts
expect(result).toBeUint(1); // or 1n
```

#### toBeAscii

Asserts a string-ascii value.

```ts
expect(result).toBeAscii('Hello World');
```

#### toBeUtf8

Asserts a string-utf8 value.

```ts
expect(result).toBeUtf8('Hello World');
```

#### toBePrincipal

Asserts a principal value.

```ts
expect(Cl.standardPrincipal(deployer)).toBePrincipal(deployer);
```

#### toBeBuff

Asserts a buffer value.

```ts
const buffer = Uint8Array.from([1, 2, 3, 4]);
expect(result).toBeBuff(buffer);
```

#### toBeList

Asserts a list of Clarity values.

```ts
expect(result).toBeList([
  Cl.standardPrincipal('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'),
  Cl.standardPrincipal('ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5')
]);
```

#### toBeTuple

Asserts a tuple value.

```ts
expect(result).toBeTuple({
  enrollmentBlock: Cl.some(Cl.uint(1)),
  contributionAmount: Cl.some(Cl.uint(19000000))
});
```

### Type checking

#### toHaveClarityType

Checks that a value has the expected Clarity type.

```ts
expect(result).toHaveClarityType(ClarityType.ResponseOk);
```

### Event matchers

#### toContainEqual

Asserts that an events array contains a specific event. This is useful for checking transaction events.

```ts
// STX transfer event
expect(events).toContainEqual({
  event: "stx_transfer_event",
  data: {
    amount: "1000000",
    memo: "",
    recipient: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
    sender: "ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5",
  },
});

// Fungible token transfer event
expect(events).toContainEqual({
  event: "ft_transfer_event",
  data: {
    amount: "1000",
    asset_identifier: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.token::my-token",
    recipient: recipientAddress,
    sender: senderAddress,
  },
});

// NFT transfer event
expect(events).toContainEqual({
  event: "nft_transfer_event",
  data: {
    asset_identifier: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.nft::my-nft",
    value: Cl.serialize(Cl.uint(1)),
    recipient: newOwner,
    sender: previousOwner,
  },
});

// Print event
expect(events).toContainEqual({
  event: "print_event",
  data: {
    contract_id: `${deployer}.my-contract`,
    value: Cl.serialize(Cl.tuple({ message: Cl.stringAscii("Hello") })),
  },
});

// Check only specific properties with objectContaining
expect(events).toContainEqual({
  event: "stx_transfer_event",
  data: expect.objectContaining({
    sender: senderAddress,
    recipient: recipientAddress,
  }),
});
```
