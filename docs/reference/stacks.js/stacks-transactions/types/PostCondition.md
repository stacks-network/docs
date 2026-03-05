# PostCondition

Union type representing the three kinds of post-conditions: STX, fungible token, and non-fungible token.

***

### Usage

```ts
import { Pc, PostCondition } from '@stacks/transactions';

// Build post conditions with the Pc builder
const stxPc: PostCondition = Pc.principal('STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6')
  .willSendEq(10000)
  .ustx();

const ftPc: PostCondition = Pc.principal('STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6')
  .willSendGte(100)
  .ft('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.token', 'token-name');
```

**[Reference Link](https://github.com/stx-labs/stacks.js/tree/main/packages/transactions/src/postcondition-types.ts)**

***

### Definition

```ts
type PostCondition = StxPostCondition | FungiblePostCondition | NonFungiblePostCondition;
```

***

### StxPostCondition

```ts
interface StxPostCondition {
  type: 'stx-postcondition';
  /** Address sending the STX (principal address or contract-id) */
  address: string;
  /** Comparator: 'eq' | 'gt' | 'gte' | 'lt' | 'lte' */
  condition: FungibleComparator;
  /** Amount in microSTX */
  amount: string | bigint | number;
}
```

***

### FungiblePostCondition

```ts
interface FungiblePostCondition {
  type: 'ft-postcondition';
  /** Address sending the asset */
  address: string;
  /** Comparator: 'eq' | 'gt' | 'gte' | 'lt' | 'lte' */
  condition: FungibleComparator;
  /** Asset string: '<contract-id>::<token-name>' */
  asset: AssetString;
  /** Amount of tokens */
  amount: string | bigint | number;
}
```

***

### NonFungiblePostCondition

```ts
interface NonFungiblePostCondition {
  type: 'nft-postcondition';
  /** Address sending the asset */
  address: string;
  /** Comparator: 'sent' | 'not-sent' */
  condition: NonFungibleComparator;
  /** Asset string: '<contract-id>::<token-name>' */
  asset: AssetString;
  /** Clarity value identifying the specific NFT */
  assetId: ClarityValue;
}
```
