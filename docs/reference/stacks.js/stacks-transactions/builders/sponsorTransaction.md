# sponsorTransaction

Constructs and signs a sponsored transaction as the sponsor. Takes an origin-signed transaction and adds the sponsor's authorization, paying the transaction fee on behalf of the original sender.

***

### Usage

```ts
import {
  makeSTXTokenTransfer,
  sponsorTransaction,
  broadcastTransaction,
} from '@stacks/transactions';

// Step 1: The origin creates a sponsored transaction
const transaction = await makeSTXTokenTransfer({
  recipient: 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5',
  amount: 1000000n,
  senderKey: 'origin-private-key-here',
  network: 'testnet',
  sponsored: true, // Mark as sponsored
});

// Step 2: The sponsor signs the transaction
const sponsoredTx = await sponsorTransaction({
  transaction,
  sponsorPrivateKey: 'sponsor-private-key-here',
  fee: 10000n,
  sponsorNonce: 0n,
  network: 'testnet',
});

// Step 3: Broadcast the sponsored transaction
const result = await broadcastTransaction({ transaction: sponsoredTx, network: 'testnet' });
```

#### Notes

- The original transaction must have `sponsored: true` set when it was created.
- If `fee` is omitted, the fee is estimated automatically.
- If `sponsorNonce` is omitted, the sponsor's nonce is fetched automatically.
- Supported transaction types: token transfers, smart contract deploys, and contract calls.

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/builders.ts#L620)**

***

### Signature

```ts
function sponsorTransaction(
  sponsorOptions: SponsorOptionsOpts
): Promise<StacksTransactionWire>
```

***

### Returns

`Promise<StacksTransactionWire>`

A promise that resolves to a fully-signed sponsored `StacksTransactionWire` object, ready to be broadcast.

***

### Parameters

#### sponsorOptions (required)

* **Type**: `SponsorOptionsOpts`

```ts
type SponsorOptionsOpts = {
  /** The origin-signed transaction */
  transaction: StacksTransactionWire;
  /** The sponsor's private key */
  sponsorPrivateKey: PrivateKey;
  /** The transaction fee amount to sponsor */
  fee?: IntegerType;
  /** The nonce of the sponsor account */
  sponsorNonce?: IntegerType;
  /** The hashmode of the sponsor's address */
  sponsorAddressHashmode?: AddressHashMode;
} & NetworkClientParam;
```
