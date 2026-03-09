# makeUnsignedSTXTokenTransfer

Constructs an unsigned STX token transfer transaction. Use this when you need to sign the transaction separately, for example with a hardware wallet or in a multi-step signing process.

***

### Usage

```ts
import {
  makeUnsignedSTXTokenTransfer,
  TransactionSigner,
} from '@stacks/transactions';

const transaction = await makeUnsignedSTXTokenTransfer({
  recipient: 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5',
  amount: 1000000n,
  publicKey: '034f355bdcb7cc0af728ef3cceb9615d90684bb5b2ca5f859ab0f0b704075871aa',
  network: 'testnet',
  fee: 200n,
  nonce: 0n,
  memo: 'test transfer',
});

// Sign later
const signer = new TransactionSigner(transaction);
signer.signOrigin('b244296d5907de9864c0b0d51f98a13c52890be0404e83f273144004b81874603');

const serializedTx = transaction.serialize();
```

#### Notes

- Use `makeSTXTokenTransfer` if you already have the private key available and want to sign in one step.
- If `fee` is omitted, the fee is estimated automatically via the network.
- If `nonce` is omitted, the nonce is fetched automatically from the network.
- For unsigned multi-sig, provide `publicKeys` and `numSignatures` instead of `publicKey`.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/builders.ts#L119)**

***

### Signature

```ts
function makeUnsignedSTXTokenTransfer(
  txOptions: UnsignedTokenTransferOptions | UnsignedMultiSigTokenTransferOptions
): Promise<StacksTransactionWire>
```

***

### Returns

`Promise<StacksTransactionWire>`

A promise that resolves to an unsigned `StacksTransactionWire` object. The transaction must be signed before broadcasting.

***

### Parameters

#### txOptions (required)

* **Type**: `UnsignedTokenTransferOptions | UnsignedMultiSigTokenTransferOptions`

```ts
// Single-sig unsigned options
interface UnsignedTokenTransferOptions extends TokenTransferOptions {
  publicKey: PublicKey;
}

// Multi-sig unsigned options
type UnsignedMultiSigTokenTransferOptions = TokenTransferOptions & {
  publicKeys: PublicKey[];
  numSignatures: number;
  address?: string;
};

// Shared base options
type TokenTransferOptions = {
  recipient: string | PrincipalCV;
  amount: IntegerType;
  memo?: string;
  postConditions?: PostCondition[];
  postConditionMode?: PostConditionMode;
  sponsored?: boolean;
  fee?: IntegerType;
  nonce?: IntegerType;
} & NetworkClientParam;
```

For single-sig, provide `publicKey`. For multi-sig, provide `publicKeys` and `numSignatures`.
