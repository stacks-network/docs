# StacksTransactionWire

The core class representing a Stacks transaction. Contains the transaction's version, chain ID, authorization, payload, and post conditions. Returned by all builder functions.

***

### Usage

```ts
import {
  makeSTXTokenTransfer,
  StacksTransactionWire,
} from '@stacks/transactions';

const transaction = await makeSTXTokenTransfer({
  recipient: 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5',
  amount: 1000000n,
  senderKey: 'b244296d5907de9864c0b0d51f98a13c52890be0404e83f273144004b81874603',
  network: 'testnet',
});

// Serialize to hex
const hex = transaction.serialize();

// Serialize to bytes
const bytes = transaction.serializeBytes();

// Get transaction ID
const txid = transaction.txid();

// Modify fee and nonce
transaction.setFee(5000n);
transaction.setNonce(10n);
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/transaction.ts#L64)**

***

### Definition

```ts
class StacksTransactionWire {
  transactionVersion: TransactionVersion;
  chainId: ChainId;
  auth: Authorization;
  payload: PayloadWire;
  postConditionMode: PostConditionMode;
  postConditions: LengthPrefixedList<PostConditionWire>;
  anchorMode: AnchorMode; // deprecated

  constructor(opts: {
    payload: PayloadInput;
    auth: Authorization;
    postConditions?: LengthPrefixedList<PostConditionWire>;
    postConditionMode?: PostConditionMode;
    transactionVersion?: TransactionVersion;
    chainId?: ChainId;
    network?: StacksNetworkName | StacksNetwork;
  });
}
```

***

### Instance Methods

#### serialize

Serializes the transaction to a hex string.

```ts
serialize(): string;
```

#### serializeBytes

Serializes the transaction to a `Uint8Array`.

```ts
serializeBytes(): Uint8Array;
```

#### txid

Computes and returns the transaction ID.

```ts
txid(): string;
```

#### setFee

Sets the transaction fee (in microSTX).

```ts
setFee(amount: IntegerType): void;
```

#### setNonce

Sets the transaction nonce.

```ts
setNonce(nonce: IntegerType): void;
```

#### setSponsor

Sets the sponsor spending condition (for sponsored transactions).

```ts
setSponsor(sponsorSpendingCondition: SpendingConditionOpts): void;
```

#### setSponsorNonce

Sets the sponsor's nonce (for sponsored transactions).

```ts
setSponsorNonce(nonce: IntegerType): void;
```

#### verifyOrigin

Verifies the origin's signature(s) on the transaction.

```ts
verifyOrigin(): string;
```

#### appendPubkey

Appends a public key to the spending condition (for multi-sig transactions).

```ts
appendPubkey(publicKey: PublicKey): void;
```
