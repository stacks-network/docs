# makeUnsignedContractCall

Constructs an unsigned smart contract function call transaction. Use this when you need to sign the transaction separately.

***

### Usage

```ts
import {
  makeUnsignedContractCall,
  Cl,
  TransactionSigner,
} from '@stacks/transactions';

const transaction = await makeUnsignedContractCall({
  contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  contractName: 'my-contract',
  functionName: 'transfer',
  functionArgs: [
    Cl.uint(1000),
    Cl.standardPrincipal('ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5'),
  ],
  publicKey: '034f355bdcb7cc0af728ef3cceb9615d90684bb5b2ca5f859ab0f0b704075871aa',
  network: 'testnet',
  fee: 10000n,
  nonce: 0n,
});

// Sign later
const signer = new TransactionSigner(transaction);
signer.signOrigin('b244296d5907de9864c0b0d51f98a13c52890be0404e83f273144004b81874603');
```

#### Notes

- Use `makeContractCall` if you have the private key and want to sign in one step.
- If `fee` is omitted, the fee is estimated automatically.
- If `nonce` is omitted, the nonce is fetched automatically.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/builders.ts#L449)**

***

### Signature

```ts
function makeUnsignedContractCall(
  txOptions: UnsignedContractCallOptions | UnsignedMultiSigContractCallOptions
): Promise<StacksTransactionWire>
```

***

### Returns

`Promise<StacksTransactionWire>`

A promise that resolves to an unsigned `StacksTransactionWire` object. Must be signed before broadcasting.

***

### Parameters

#### txOptions (required)

* **Type**: `UnsignedContractCallOptions | UnsignedMultiSigContractCallOptions`

```ts
interface UnsignedContractCallOptions extends ContractCallOptions {
  publicKey: PublicKey;
}

type UnsignedMultiSigContractCallOptions = ContractCallOptions & UnsignedMultiSigOptions;

type ContractCallOptions = {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: ClarityValue[];
  validateWithAbi?: boolean | ClarityAbi;
  postConditions?: PostCondition[];
  postConditionMode?: PostConditionMode;
  sponsored?: boolean;
  fee?: IntegerType;
  nonce?: IntegerType;
} & NetworkClientParam;
```

For single-sig, provide `publicKey`. For multi-sig, provide `publicKeys` and `numSignatures`.
