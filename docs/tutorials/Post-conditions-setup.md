# Module 33: Frontend - Dynamic Post-Conditions

**Author:** @jadonamite
**Difficulty:** Intermediate
**Time:** 20 Minutes

**Post-Conditions** are Stacks' superpower. They are a security layer enforced by the wallet (and the chain) that says: *"If this transaction tries to steal more than X tokens from me, abort it immediately."*

In Ethereum, you blindly `approve(infinite)`. In Stacks, you sign *"I will send exactly 100 STX"*.

However, you cannot hardcode these. If the price of an item changes, or the user selects a different quantity, your app must **dynamically calculate** the post-conditions in JavaScript before triggering the wallet.

This module teaches you how to construct strict Fungible and Non-Fungible post-conditions programmatically.

## 1. The Dependencies

We use the Post-Condition builders from `@stacks/transactions`.

```bash
npm install @stacks/transactions

```

## 2. The Anatomy of a Post-Condition

To build one, you need three things:

1. **Who:** The principal (usually the User).
2. **Condition:** `willSendEq` (Exactly), `willSendGte` (Greater than/Eq), `willSendLte` (Less than/Eq).
3. **Asset:** STX, a SIP-010 Token, or a SIP-009 NFT.

## 3. Implementation: Dynamic Builder

Let's build a utility that generates conditions for a "Buy with Token" scenario.

* **Scenario:** User pays `price` amount of `Token A`.
* **Safety:** We define a condition that they send **exactly** that amount.

**File:** `utils/post-conditions.ts`

```typescript
import { 
  Pc, 
  uintCV, 
  createAssetInfo, 
  FungibleConditionCode, 
  NonFungibleConditionCode 
} from '@stacks/transactions';

// Configuration for your specific token
// Asset Info format: "ContractAddress.ContractName::TokenName"
const MY_TOKEN_CONTRACT = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
const MY_TOKEN_NAME = 'my-token';
const MY_ASSET_NAME = 'cool-coin';

export const createPaymentCondition = (
  userAddress: string, 
  amount: number, // Raw amount (e.g., 50.5 tokens)
  decimals: number = 6
) => {
  
  // 1. Handle Decimals (JS Math is scary, use BigInt/Strings in prod)
  // 50.5 * 1,000,000 = 50,500,000 micro-tokens
  const microAmount = BigInt(Math.floor(amount * Math.pow(10, decimals)));

  // 2. Define the Asset Identifier
  // This tells the chain EXACTLY which token contract we are talking about
  const assetInfo = createAssetInfo(
    MY_TOKEN_CONTRACT,
    MY_TOKEN_NAME,
    MY_ASSET_NAME
  );

  // 3. Construct the Condition
  // "User Address WILL SEND EQUAL TO microAmount of assetInfo"
  return Pc.principal(userAddress)
    .willSendEq(microAmount)
    .ft(assetInfo);
};

// Bonus: NFT Transfer Condition
// "User WILL SEND the NFT with ID 42"
export const createNftTransferCondition = (
  userAddress: string,
  nftId: number
) => {
  const assetInfo = createAssetInfo(
    MY_TOKEN_CONTRACT, 
    'my-nft-contract', 
    'super-rare-card'
  );

  return Pc.principal(userAddress)
    .willSendAsset()
    .nft(assetInfo, uintCV(nftId));
};

```

## 4. Usage in the Wallet Request

Now we plug this into the `request` or `openContractCall` flow.

```typescript
import { createPaymentCondition } from './utils/post-conditions';

const handleBuy = async () => {
  const price = 100; // 100 Tokens
  const user = userSession.loadUserData().profile.stxAddress.testnet;

  // Generate the condition dynamically
  const pc = createPaymentCondition(user, price);

  await window.StacksProvider.request({
    method: 'stx_callContract',
    params: {
      contractAddress: 'ST1...',
      contractName: 'marketplace',
      functionName: 'buy-item',
      functionArgs: [/*...*/],
      
      // PASS IT HERE
      postConditions: [pc] 
    }
  });
};

```

## 5. Modes: Allow vs. Deny

In the code above, we didn't specify a mode. The default is usually **Deny Mode**.

* **Deny Mode (Safe):** The transaction fails if the contract tries to move *anything* not explicitly listed in the `postConditions` array.
* **Allow Mode (Risky):** The transaction succeeds even if the contract moves unlisted assets.

**Frontend Tip:** Always use Deny Mode. It forces you to be explicit about what your contract does, which builds user trust. If your user sees "This transaction will transfer 100 STX" vs "This transaction will transfer 100 STX and *Unspecified Assets*", they will trust the former.

## 6. Summary Checklist

* [ ] **Asset Info:** Did you double-check the contract name and token name (e.g., `::cool-coin`) matches the Clarity code exactly?
* [ ] **Micro-Units:** Did you convert the display amount (10) to the chain amount (10,000,000)?
* [ ] **Ownership:** Did you use the *User's* address for the principal? You cannot set post-conditions for someone else.
