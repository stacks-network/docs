---
description: Learn how to add post-conditions to protect your Stacks transactions.
---

# Implementation

Post-conditions are a powerful security feature in Stacks that protect users from unexpected transaction outcomes. This tutorial will walk you through implementing post-conditions in your applications to ensure transactions behave exactly as users expect.

### What you'll learn

* Construct post-conditions using the `Pc` helper API
* Add post-conditions to different transaction types
* Configure post-condition modes for transaction security
* Implement post-conditions for STX, fungible tokens, and NFTs
* Handle semi-fungible tokens (SFTs) with post-conditions
* Use Originator mode to protect only the transaction sender's assets (SIP-040)
* Use the MAY SEND token condition to optionally cover an NFT/SFT transfer (SIP-040)
* Guard staking operations with staking post-conditions (SIP-045)
* Constrain PoX actions with PoX post-conditions (SIP-045)

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

The `Pc` helper uses method chaining for intuitive condition building. Your IDE will provide auto-completion for available methods at each step.

***

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

// STX staking (locking) — SIP-045, epoch 4.0+
.ustxToLock()

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

// Ensure NFT MAY be sent (covers the asset in Deny/Originator allowlist
// without requiring it to actually move). SIP-040, epoch 3.4+.
Pc.principal(address).willMaybeSendAsset().nft(...);

```

Use `willMaybeSendAsset()` when an NFT/SFT transfer is conditional inside the contract and you want the transaction to succeed whether or not it moves. Available from Stacks epoch 3.4 (SIP-040).

### PoX-specific methods (SIP-045)

PoX post-conditions constrain whether a principal performs a gated PoX action. They carry only a principal and a condition code — no asset or amount.

```ts
// Principal will perform a gated PoX action
Pc.principal(address).willPerformPox();

// Principal will not perform any gated PoX action
Pc.principal(address).willNotPerformPox();

// Principal may or may not perform a gated PoX action (always passes)
Pc.principal(address).mayPerformPox();
```

Staking and PoX post-conditions are introduced by SIP-045 and available from Stacks epoch 4.0.

***

## Setting the post-condition mode

The post-condition mode determines how the Stacks protocol handles asset transfers not explicitly covered by your post-conditions. This is a critical security setting.

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

```ts
import { Pc, PostConditionMode, makeContractCall } from '@stacks/transactions';

// Originator mode: protect only the sender's assets in a multi-hop contract call
const tx = await makeContractCall({
  // ... other transaction properties
  postConditionMode: PostConditionMode.Originator,
  postConditions: [
    // Only constrain the origin account's outflows
    Pc.principal(senderAddress).willSendLte(1_000_000).ustx(),
    Pc.principal(senderAddress).willSendLte(50_000_000)
      .ft('SP3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH335.usdcx', 'usdcx'),
  ],
});
```

Mode options:

* PostConditionMode.Deny (default): Transaction fails if any unspecified transfers occur
* PostConditionMode.Originator: Transaction fails only if unspecified transfers originate from the transaction's origin account; transfers between other principals are allowed (SIP-040, epoch 3.4+, live since March 2026)
* PostConditionMode.Allow: Transaction allows transfers beyond specified post-conditions

`Originator` mode is intended for DeFi-style contract calls where intermediate asset routing between contracts is unpredictable. It applies `Deny`-style protection to the origin account's assets while permitting movements between other principals.

***

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

Multi-bin withdrawals (Bitflow DLMM, concentrated-liquidity pools) typically produce one `willMaybeSendAsset()` post-condition per affected bin. The position SFT for each bin may be burned (transferred to the contract) or kept depending on the remaining liquidity after the call. Pairing each per-bin condition with `willSendLte` conditions on the underlying FTs gives the signer a precise upper bound on what can leave their account while allowing the contract to skip burns for bins that retain liquidity.

```ts
// SFT-as-NFT with MAY SEND — for contracts that may or may not transfer
// a specific token-id depending on runtime state (e.g. DLMM/CLMM pools
// where a bin's position SFT is burned only if its liquidity reaches zero).
const sftBinCondition = Pc
  .principal(senderAddress)
  .willMaybeSendAsset()
  .nft(
    'SP000...pool.dlmm-position::position',
    Cl.tuple({
      'pool-id': Cl.uint(1),
      'bin-id': Cl.uint(8421),
      owner: Cl.principal(senderAddress),
    })
  );
```

#### Originator-mode post-conditions for DeFi (SIP-040)

When calling a contract that routes assets through several intermediate contracts, listing every hop in `Deny` mode is brittle. `Originator` mode restricts only the sender's own outflows and allows asset movement between other principals.

```ts
import { Pc, PostConditionMode, makeContractCall } from '@stacks/transactions';

const tx = await makeContractCall({
  contractAddress: 'SP000...router',
  contractName: 'multi-hop-swap',
  functionName: 'swap',
  functionArgs: [ /* ... */ ],
  postConditionMode: PostConditionMode.Originator,
  postConditions: [
    // Cap STX leaving the sender
    Pc.origin().willSendLte(1_000_000).ustx(),
    // Cap USDCx leaving the sender
    Pc.origin().willSendLte(100_000_000)
      .ft('SP3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH335.usdcx', 'usdcx'),
  ],
});
```

`Pc.origin()` is a convenience that binds the post-condition to the transaction's origin account (the signer of the standard authorization structure, not `tx-sender`, and unaffected by `as-contract?`).

### Staking post-conditions (SIP-045)

Staking post-conditions guard staking STX — or modifying staked STX — for a principal. Calls to the pox-5 `stake`, `register-for-bond`, and `stake-update` functions are evaluated against these post-conditions, and the transaction is rejected if the conditions are not met ([SIP-045](https://github.com/stacksgov/sips/blob/main/sips/sip-045/sip-045-pox-5-bitcoin-staking.md)). They use the same comparators as STX post-conditions, and amounts are denoted in uSTX.

```ts
import { Pc, PostConditionMode, makeContractCall } from '@stacks/transactions';

// Assert the principal will lock at least 1 STX
const stakingCondition = Pc
  .principal('SP2ZD731ANQZT6J4K3F5N8A40ZXWXC1XFXHVVQFKE')
  .willSendGte(1000000)
  .ustxToLock();

const tx = await makeContractCall({
  contractAddress: 'SP000000000000000000002Q6VF78',
  contractName: 'pox-5',
  functionName: 'stake',
  functionArgs: [
    // ... function arguments
  ],
  postConditions: [stakingCondition],
  postConditionMode: PostConditionMode.Deny,
  // ... other properties
});
```

Note that `.ustxToLock()` constrains STX being locked for stacking, while `.ustx()` constrains STX being transferred. A staking operation does not transfer STX out of the account, so a plain STX post-condition will not cover it.

### PoX post-conditions (SIP-045)

PoX post-conditions guard PoX state changes that do not alter locking status. This covers the pox-5 `unstake`, `unstake-sbtc`, `update-bond-registration`, and `announce-l1-early-exit` functions ([SIP-045](https://github.com/stacksgov/sips/blob/main/sips/sip-045/sip-045-pox-5-bitcoin-staking.md)). Under SIP-045's Bitcoin staking framework, a participant's L1 commitment can be held as native BTC on Bitcoin L1 or as sBTC on Stacks — `unstake-sbtc` handles the sBTC-form withdrawal, and both are gated by the same PoX post-condition type.

```ts
import { Pc } from '@stacks/transactions';

const principal = 'SP2ZD731ANQZT6J4K3F5N8A40ZXWXC1XFXHVVQFKE';

// Require the principal to perform a gated PoX action
const willPerform = Pc.principal(principal).willPerformPox();

// Protect the principal from any gated PoX action occurring
const willNotPerform = Pc.principal(principal).willNotPerformPox();

// Allow a gated PoX action without requiring it (always passes)
const mayPerform = Pc.principal(principal).mayPerformPox();
```

Use `willNotPerformPox()` when calling an unfamiliar contract to guarantee it cannot change your PoX state as a side effect. Use `willPerformPox()` when the whole point of the transaction is a PoX action and you want the transaction to abort if it silently does not happen.

{% hint style="info" %}
Staking and PoX post-conditions are introduced by SIP-045 and require Stacks epoch 4.0 or later.
{% endhint %}

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
