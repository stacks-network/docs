# makeSTXTokenTransfer

Constructs and signs a STX token transfer transaction. This is the primary function for sending STX from one address to another. For multi-sig transactions, all signer keys are provided and the transaction is signed automatically.

If you need to sign the transaction separately (e.g. with a hardware wallet), use `makeUnsignedSTXTokenTransfer` instead.

***

### Usage

```ts
import { makeSTXTokenTransfer } from '@stacks/transactions';

const transaction = await makeSTXTokenTransfer({
  recipient: 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5',
  amount: 1000000n, // in microSTX (1 STX = 1,000,000 microSTX)
  senderKey: 'b244296d5907de9864c0b0d51f98a13c52890be0404e83f273144004b81874603',
  memo: 'test transfer',
  network: 'testnet',
  fee: 200n,
  nonce: 0n,
});

const serializedTx = transaction.serialize();
```

#### Notes

- The `amount` is denominated in **microSTX** (1 STX = 1,000,000 microSTX).
- If `fee` is omitted, the fee is estimated automatically via the network.
- If `nonce` is omitted, the nonce is fetched automatically from the network.
- For multi-sig transfers, provide `signerKeys`, `publicKeys`, and `numSignatures` instead of `senderKey`.
- The `memo` field is optional and limited to 34 bytes.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/builders.ts#L206)**

***

### Signature

```ts
function makeSTXTokenTransfer(
  txOptions: SignedTokenTransferOptions | SignedMultiSigTokenTransferOptions
): Promise<StacksTransactionWire>
```

***

### Returns

`Promise<StacksTransactionWire>`

A promise that resolves to a signed `StacksTransactionWire` object, ready to be broadcast.

***

### Parameters

#### txOptions (required)

* **Type**: `SignedTokenTransferOptions | SignedMultiSigTokenTransferOptions`

```ts
// Single-sig options
interface SignedTokenTransferOptions extends TokenTransferOptions {
  senderKey: PrivateKey;
}

// Multi-sig options
type SignedMultiSigTokenTransferOptions = TokenTransferOptions & {
  publicKeys: PublicKey[];
  numSignatures: number;
  signerKeys: PrivateKey[];
  address?: string;
};

// Shared base options
type TokenTransferOptions = {
  /** The recipient address (STX address or contract ID) */
  recipient: string | PrincipalCV;
  /** Amount to transfer in microSTX */
  amount: IntegerType;
  /** Optional memo string (max 34 bytes) */
  memo?: string;
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
