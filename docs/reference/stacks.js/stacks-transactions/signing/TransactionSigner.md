# TransactionSigner

A class for signing Stacks transactions. Manages the signing process for both single-sig and multi-sig transactions, as well as sponsored transactions.

***

### Usage

```ts
import {
  makeUnsignedSTXTokenTransfer,
  TransactionSigner,
} from '@stacks/transactions';

// Create an unsigned transaction
const transaction = await makeUnsignedSTXTokenTransfer({
  recipient: 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5',
  amount: 1000000n,
  publicKey: '034f355bdcb7cc0af728ef3cceb9615d90684bb5b2ca5f859ab0f0b704075871aa',
  network: 'testnet',
  fee: 200n,
  nonce: 0n,
});

// Sign with the origin's private key
const signer = new TransactionSigner(transaction);
signer.signOrigin('b244296d5907de9864c0b0d51f98a13c52890be0404e83f273144004b81874603');

// For sponsored transactions
const sponsorSigner = TransactionSigner.createSponsorSigner(
  transaction,
  sponsorSpendingCondition
);
sponsorSigner.signSponsor(sponsorPrivateKey);
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/signer.ts)**

***

### Definition

```ts
class TransactionSigner {
  transaction: StacksTransactionWire;
  sigHash: string;
  originDone: boolean;
  checkOversign: boolean;
  checkOverlap: boolean;

  constructor(transaction: StacksTransactionWire);
}
```

***

### Static Methods

#### TransactionSigner.createSponsorSigner

Creates a signer for the sponsor of a sponsored transaction.

```ts
static createSponsorSigner(
  transaction: StacksTransactionWire,
  spendingCondition: SpendingConditionOpts
): TransactionSigner;
```

***

### Instance Methods

#### signOrigin

Signs the transaction as the origin (sender). For multi-sig, call this multiple times with each signer's key.

```ts
signOrigin(privateKey: PrivateKey): void;
```

#### appendOrigin

Appends a public key to the origin authorization for multi-sig transactions (for signers that did not sign).

```ts
appendOrigin(publicKey: PublicKey): void;
```

#### signSponsor

Signs the transaction as the sponsor.

```ts
signSponsor(privateKey: PrivateKey): void;
```

#### getTxInComplete

Returns a deep clone of the transaction in its current state.

```ts
getTxInComplete(): StacksTransactionWire;
```

#### resume

Resumes signing from a different transaction state.

```ts
resume(transaction: StacksTransactionWire): void;
```
