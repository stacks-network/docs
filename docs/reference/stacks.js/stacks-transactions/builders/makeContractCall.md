# makeContractCall

Constructs and signs a smart contract function call transaction. Calls a public function on a deployed Clarity smart contract.

***

### Usage

```ts
import {
  makeContractCall,
  Cl,
  PostConditionMode,
} from '@stacks/transactions';

const transaction = await makeContractCall({
  contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  contractName: 'my-contract',
  functionName: 'transfer',
  functionArgs: [
    Cl.uint(1000),
    Cl.standardPrincipal('ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5'),
  ],
  senderKey: 'b244296d5907de9864c0b0d51f98a13c52890be0404e83f273144004b81874603',
  network: 'testnet',
  postConditionMode: PostConditionMode.Deny,
  fee: 10000n,
  nonce: 0n,
});

const serializedTx = transaction.serialize();
```

#### Notes

- The `functionArgs` must match the types expected by the Clarity function.
- Use the `Cl` namespace helpers (e.g. `Cl.uint`, `Cl.standardPrincipal`) to construct Clarity values.
- If the contract's ABI is needed for validation, it is fetched automatically unless `validateWithAbi` is set to `false`.
- If `fee` is omitted, the fee is estimated automatically.
- If `nonce` is omitted, the nonce is fetched automatically.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/builders.ts#L565)**

***

### Signature

```ts
function makeContractCall(
  txOptions: SignedContractCallOptions | SignedMultiSigContractCallOptions
): Promise<StacksTransactionWire>
```

***

### Returns

`Promise<StacksTransactionWire>`

A promise that resolves to a signed `StacksTransactionWire` object, ready to be broadcast.

***

### Parameters

#### txOptions (required)

* **Type**: `SignedContractCallOptions | SignedMultiSigContractCallOptions`

```ts
interface SignedContractCallOptions extends ContractCallOptions {
  senderKey: PrivateKey;
}

type SignedMultiSigContractCallOptions = ContractCallOptions & SignedMultiSigOptions;

type ContractCallOptions = {
  /** The address of the contract */
  contractAddress: string;
  /** The name of the contract */
  contractName: string;
  /** The name of the function to call */
  functionName: string;
  /** The arguments to pass to the function */
  functionArgs: ClarityValue[];
  /** Whether to validate the function call against the ABI */
  validateWithAbi?: boolean | ClarityAbi;
  /** Post conditions for the transaction */
  postConditions?: PostCondition[];
  /** Post condition mode (Allow or Deny) */
  postConditionMode?: PostConditionMode;
  /** Whether the transaction is sponsored */
  sponsored?: boolean;
  /** Transaction fee in microSTX */
  fee?: IntegerType;
  /** Transaction nonce */
  nonce?: IntegerType;
} & NetworkClientParam;
```

For single-sig, provide `senderKey`. For multi-sig, provide `publicKeys`, `numSignatures`, and `signerKeys`.
