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
npm install @hirosystems/clarinet-sdk
```

## Initialize simulated network

### initSimnet

`initSimnet` initializes a simulated network for testing your smart contracts.

Usage:

```
initSimnet(manifestPath?: string): Promise<Simnet>
```

```ts
import { initSimnet } from '@hirosystems/clarinet-sdk';

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

`getMapEntry` retrieves a value from a contract map by its key.

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
// Returns: { type: 10, value: { type: 3 } }
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

`transferSTX` transfers STX between addresses and mines a block.

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

`deployContract` deploys a new contract to simnet and mines a block.

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

`mineBlock` mines a block with multiple transactions.

Usage:

```
mineBlock(txs: Tx[]): ParsedTransactionResult[]
```

```ts
import { tx } from '@hirosystems/clarinet-sdk';
import { Cl } from '@stacks/transactions';

const block = simnet.mineBlock([
  tx.callPublicFn("counter", "increment", [], simnet.deployer),
  tx.transferSTX(19000000, wallet, simnet.deployer),
]);
```

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

## Utility methods

### runSnippet

`runSnippet` executes arbitrary Clarity code without deploying.

Usage:

```
runSnippet(snippet: string): string | ClarityValue
```

```ts
const result = simnet.runSnippet('(stx-account tx-sender)');
// Returns account balance information
```

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
