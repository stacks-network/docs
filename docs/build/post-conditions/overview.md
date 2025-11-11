# Overview

Learn how post-conditions protect users from unexpected transaction outcomes.

Post-conditions are security features in Stacks that protect users by ensuring transactions execute exactly as expected. They verify that specific asset transfers occur during a transaction, and if the conditions aren't satisfied, the entire transaction fails with no state changes.

## What are post-conditions?

Post-conditions act as safeguards that verify asset transfers match your expectations. They can check STX transfers, fungible tokens, and non-fungible token ownership changes.

```ts
import { Pc } from '@stacks/transactions';

const tx = await makeContractCall({
  // ...
  postConditions: [
    Pc.principal('STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6').willSendEq(1000).ustx(),
  ],
});
```

Post-conditions only verify that assets are sent, not received. They cannot guarantee the final recipient of tokens.

## Using the Pc helper

The `Pc` helper provides a fluent API for creating post-conditions with better type safety and readability.

```ts
import { Pc } from '@stacks/transactions';

// STX transfer post-condition
const stxCondition = Pc
  .principal('STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6')
  .willSendGte(1000)
  .ustx();

// Fungible token post-condition
const ftCondition = Pc
  .principal('STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6')
  .willSendEq(50)
  .ft('SP3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH335.my-token', 'my-token');

// NFT post-condition
const nftCondition = Pc
  .principal('STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6')
  .willSendAsset()
  .nft('SP3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH335.my-nft::my-asset', Cl.uint(1));
```

## Manual creation

Create post-conditions manually using type definitions when building conditions dynamically.

```ts
import {
  StxPostCondition,
  FungiblePostCondition,
  NonFungiblePostCondition
} from '@stacks/transactions';

// STX post-condition
const stxPostCondition: StxPostCondition = {
  type: 'stx-postcondition',
  address: 'SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B',
  condition: 'gte', // 'eq' | 'gt' | 'gte' | 'lt' | 'lte'
  amount: '100',
};
```

Available condition types:

* `eq`: Exactly equal to amount
* `gt`: Greater than amount
* `gte`: Greater than or equal to amount
* `lt`: Less than amount
* `lte`: Less than or equal to amount

### Fungible tokens

```ts
const ftPostCondition: FungiblePostCondition = {
  type: 'ft-postcondition',
  address: 'SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B',
  condition: 'eq',
  amount: '100',
  asset: 'SP3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH335.my-ft-token::my-token',
};
```

### Non-fungible tokens

```ts
const nftPostCondition: NonFungiblePostCondition = {
  type: 'nft-postcondition',
  address: 'SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02B',
  condition: 'sent', // 'sent' | 'not-sent'
  asset: 'SP3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH335.my-nft::my-asset',
  assetId: Cl.uint(602),
};
```

## Post-condition mode

Control how unspecified asset transfers are handled with post-condition mode.

```ts
import { PostConditionMode } from '@stacks/transactions';

const tx = await makeContractCall({
  // ...
  postConditionMode: PostConditionMode.Deny,
  postConditions: [
    // your conditions
  ],
});
```

{% hint style="warning" %}
Post-condition mode\
Always use `Deny` mode unless you have a specific reason to allow additional transfers. This provides maximum security for users.
{% endhint %}
