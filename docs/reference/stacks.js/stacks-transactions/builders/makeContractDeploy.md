# makeContractDeploy

Constructs and signs a smart contract deployment transaction. Deploys a Clarity smart contract to the Stacks blockchain.

***

### Usage

```ts
import { makeContractDeploy, ClarityVersion } from '@stacks/transactions';

const codeBody = `
(define-public (say-hello)
  (ok "hello world"))
`;

const transaction = await makeContractDeploy({
  contractName: 'hello-world',
  codeBody,
  senderKey: 'b244296d5907de9864c0b0d51f98a13c52890be0404e83f273144004b81874603',
  network: 'testnet',
  fee: 10000n,
  nonce: 0n,
  clarityVersion: ClarityVersion.Clarity3,
});

const serializedTx = transaction.serialize();
```

#### Notes

- The `codeBody` should be a valid Clarity source code string.
- If `clarityVersion` is omitted, the latest available version is used.
- If `fee` is omitted, the fee is estimated automatically.
- If `nonce` is omitted, the nonce is fetched automatically.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/builders.ts#L283)**

***

### Signature

```ts
function makeContractDeploy(
  txOptions: SignedContractDeployOptions | SignedMultiSigContractDeployOptions
): Promise<StacksTransactionWire>
```

***

### Returns

`Promise<StacksTransactionWire>`

A promise that resolves to a signed `StacksTransactionWire` object, ready to be broadcast.

***

### Parameters

#### txOptions (required)

* **Type**: `SignedContractDeployOptions | SignedMultiSigContractDeployOptions`

```ts
interface SignedContractDeployOptions extends BaseContractDeployOptions {
  senderKey: PrivateKey;
}

type SignedMultiSigContractDeployOptions = BaseContractDeployOptions & SignedMultiSigOptions;

type BaseContractDeployOptions = {
  /** The name for the deployed contract */
  contractName: string;
  /** The Clarity source code for the contract */
  codeBody: string;
  /** The Clarity version to use (defaults to latest) */
  clarityVersion?: ClarityVersion;
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
