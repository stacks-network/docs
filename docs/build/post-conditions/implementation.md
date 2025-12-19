---
description: Learn how to add post-conditions to protect your Stacks transactions.
---

# Implementing Post-Conditions

Post-conditions are a powerful security feature in Stacks that protect users from unexpected transaction outcomes. This tutorial will walk you through implementing post-conditions in your applications to ensure transactions behave exactly as users expect.

## What you'll learn

* Construct post-conditions using the `Pc` helper API
* Add post-conditions to different transaction types
* Configure post-condition modes for transaction security
* Implement post-conditions for STX, fungible tokens, and NFTs
* Handle semi-fungible tokens (SFTs) with post-conditions

## Prerequisites

* Basic understanding of Stacks transactions
* Stacks.js library installed (`npm install @stacks/transactions`)
* A development environment set up for Stacks

## Constructing post-conditions

The Pc helper in Stacks.js provides a fluent, BDD-inspired API for constructing post-conditions. Start with `Pc.principal()` to specify which address will be verified, then chain methods to define the condition.

```ts
import { Pc } from '@stacks/transactions';

// Basic structure of a post-condition
const postCondition = Pc
  .principal('STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6')
  .willSendEq(1000)
  .ustx();
```

The Pc helper uses method chaining for intuitive condition building. Your IDE will provide auto-completion for available methods at each step.

## Available transfer methods

Post-conditions support different comparison operators and asset types. Choose the appropriate method based on your security requirements.

### STX and fungible token methods

```ts
// Exact amount
Pc.principal(address).willSendEq(1000).ustx();

// Greater than or equal
Pc.principal(address).willSendGte(500).ustx();

// Less than
Pc.principal(address).willSendLt(2000).ustx();
```

Comparison methods available:

* `.willSendEq(amount)` - Exactly equal to amount
* `.willSendGte(amount)` - Greater than or equal to amount
* `.willSendGt(amount)` - Greater than amount
* `.willSendLte(amount)` - Less than or equal to amount
* `.willSendLt(amount)` - Less than amount

### Asset type methods

```ts
// STX transfers
.ustx()

// Fungible token transfers
.ft(contractAddress, tokenName)

// NFT transfers
.nft(assetIdentifier, tokenId)
```

### NFT-specific methods

```ts
// Ensure NFT is sent
Pc.principal(address).willSendAsset().nft(...);

// Ensure NFT is NOT sent
Pc.principal(address).willNotSendAsset().nft(...);
```

## Setting the post-condition mode

The post-condition mode determines how the Stacks blockchain handles asset transfers not explicitly covered by your post-conditions. This is a critical security setting.

```ts
import { PostConditionMode, makeContractCall } from '@stacks/transactions';

const tx = await makeContractCall({
  // ... other transaction properties
  postConditionMode: PostConditionMode.Deny, // Recommended default
  postConditions: [
    // your post-conditions here
  ],
});
```

Mode options:

* PostConditionMode.Deny (default): Transaction fails if any unspecified transfers occur
* PostConditionMode.Allow: Transaction allows transfers beyond specified post-conditions

## Common implementation patterns

### STX transfer post-conditions

Protect STX transfers by specifying exact amounts or ranges.

```ts
import { Pc, makeSTXTokenTransfer } from '@stacks/transactions';

// Exact amount post-condition
const exactAmountCondition = Pc
  .principal('STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6')
  .willSendEq(1000)
  .ustx();

// Use in a transaction
const tx = await makeSTXTokenTransfer({
  recipient: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  amount: 1000,
  postConditions: [exactAmountCondition],
  postConditionMode: PostConditionMode.Deny,
  // ... other properties
});
```

### Fungible token post-conditions

Ensure fungible tokens are transferred as expected in contract calls.

```ts
import { Pc, makeContractCall } from '@stacks/transactions';

// Minimum amount condition
const ftCondition = Pc
  .principal('STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6')
  .willSendGte(500)
  .ft('STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6.token-ft', 'token');

// Use in a contract call
const tx = await makeContractCall({
  contractAddress: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6',
  contractName: 'token-transfer',
  functionName: 'transfer',
  functionArgs: [
    // ... function arguments
  ],
  postConditions: [ftCondition],
  // ... other properties
});
```

### NFT transfer post-conditions

Control NFT ownership changes with specific post-conditions.

```ts
import { Pc, Cl } from '@stacks/transactions';

// Ensure NFT is sent
const sendNftCondition = Pc
  .principal('STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6')
  .willSendAsset()
  .nft('STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6.nft-contract::nft-name', Cl.uint(1));

// Ensure NFT is NOT sent (protection against unwanted transfers)
const keepNftCondition = Pc
  .principal('STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6')
  .willNotSendAsset()
  .nft('STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6.nft-contract::nft-name', Cl.uint(1));
```

Use `willNotSendAsset()` to protect valuable NFTs from being transferred unexpectedly.

### Semi-fungible token (SFT) post-conditions

SFTs require special handling as they have both fungible and non-fungible properties.

```ts
import { Cl, Pc } from '@stacks/transactions';

// SFT as NFT (specific token ID)
const sftNftCondition = Pc
  .principal('STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6')
  .willSendAsset()
  .nft(
    'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.sft-contract::sft-id',
    Cl.tuple({
      'token-id': Cl.uint(1),
      owner: Cl.principal('STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6')
    })
  );

// SFT as FT (amount-based)
const sftFtCondition = Pc
  .principal('STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6')
  .willSendEq(500)
  .ft('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.sft-contract', 'sft-token');
```

## Multiple post-conditions

Complex transactions often require multiple post-conditions to fully protect all asset transfers.

```ts
const tx = await makeContractCall({
  // ... transaction properties
  postConditions: [
    // Sender must send exactly 1000 uSTX
    Pc.principal(senderAddress).willSendEq(1000).ustx(),

    // Contract must send at least 100 tokens to user
    Pc.principal(contractAddress).willSendGte(100)
      .ft(contractAddress + '.my-token', 'my-token'),

    // User must not lose their NFT
    Pc.principal(senderAddress).willNotSendAsset()
      .nft(nftContract + '::my-nft', Cl.uint(1)),
  ],
  postConditionMode: PostConditionMode.Deny,
});
```
