# makeUnsignedContractDeploy

Constructs an unsigned smart contract deployment transaction. Use this when you need to sign the transaction separately.

***

### Usage

```ts
import {
  makeUnsignedContractDeploy,
  TransactionSigner,
  ClarityVersion,
} from '@stacks/transactions';

const codeBody = `
(define-public (say-hello)
  (ok "hello world"))
`;

const transaction = await makeUnsignedContractDeploy({
  contractName: 'hello-world',
  codeBody,
  publicKey: '034f355bdcb7cc0af728ef3cceb9615d90684bb5b2ca5f859ab0f0b704075871aa',
  network: 'testnet',
  fee: 10000n,
  nonce: 0n,
  clarityVersion: ClarityVersion.Clarity3,
});

// Sign later
const signer = new TransactionSigner(transaction);
signer.signOrigin('b244296d5907de9864c0b0d51f98a13c52890be0404e83f273144004b81874603');
```

#### Notes

- Use `makeContractDeploy` if you have the private key and want to sign in one step.
- If `fee` is omitted, the fee is estimated automatically.
- If `nonce` is omitted, the nonce is fetched automatically.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/builders.ts#L313)**

***

### Signature

```ts
function makeUnsignedContractDeploy(
  txOptions: UnsignedContractDeployOptions | UnsignedMultiSigContractDeployOptions
): Promise<StacksTransactionWire>
```

***

### Returns

`Promise<StacksTransactionWire>`

A promise that resolves to an unsigned `StacksTransactionWire` object. Must be signed before broadcasting.

***

### Parameters

#### txOptions (required)

* **Type**: `UnsignedContractDeployOptions | UnsignedMultiSigContractDeployOptions`

```ts
interface UnsignedContractDeployOptions extends BaseContractDeployOptions {
  publicKey: PublicKey;
}

type UnsignedMultiSigContractDeployOptions = BaseContractDeployOptions & UnsignedMultiSigOptions;

type BaseContractDeployOptions = {
  contractName: string;
  codeBody: string;
  clarityVersion?: ClarityVersion;
  postConditions?: PostCondition[];
  postConditionMode?: PostConditionMode;
  sponsored?: boolean;
  fee?: IntegerType;
  nonce?: IntegerType;
} & NetworkClientParam;
```

For single-sig, provide `publicKey`. For multi-sig, provide `publicKeys` and `numSignatures`.
