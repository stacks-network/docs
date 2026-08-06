# PostCondition

Union type representing every kind of post-condition: STX, fungible token, non-fungible token, staking, and PoX.

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

// Staking post condition
const stakingPc: PostCondition = Pc.principal('STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6')
  .willSendLte(1000000)
  .ustxToLock();

// PoX post condition
const poxPc: PostCondition = Pc.principal(
  'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6'
).willNotPerformPox();
```

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/b7f0ed3f87cd4c5bfb7ab3c4bd8787c2018e3cec/packages/transactions/src/postcondition-types.ts)

***

### Definition

```ts
type PostCondition =
  | StxPostCondition
  | FungiblePostCondition
  | NonFungiblePostCondition
  | StakingPostCondition
  | PoxPostCondition;
```

See [PostConditionType](PostConditionType.md) for the wire value each of these serializes to.

***

### Availability

| Member                                                  | Available from                                 |
| ------------------------------------------------------- | ---------------------------------------------- |
| `maybe-sent` on `NonFungiblePostCondition` (SIP-040)    | `@stacks/transactions` 7.4.0, Stacks epoch 3.4 |
| `StakingPostCondition` and `PoxPostCondition` (SIP-045) | `@stacks/transactions` 7.5.0, Stacks epoch 4.0 |

{% hint style="info" %}
Staking and PoX post-conditions are specified in [SIP-045 §3.4.3](https://github.com/stacksgov/sips/blob/main/sips/sip-045/sip-045-pox-5-bitcoin-staking.md). The `@stacks/transactions` JSDoc labels these SIP-044; the two SIPs activated together.
{% endhint %}

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
  /** Comparator: 'sent' | 'not-sent' | 'maybe-sent' */
  condition: NonFungibleComparator;
  /** Asset string: '<contract-id>::<token-name>' */
  asset: AssetString;
  /** Clarity value identifying the specific NFT */
  assetId: ClarityValue;
}
```

`maybe-sent` was added by [SIP-040](https://github.com/stacksgov/sips/blob/main/sips/sip-040/sip-040-post-conds.md). It always passes, and still counts as covering that NFT instance under `Deny` or `Originator` mode.

***

### StakingPostCondition

Guards staking STX or modifying staked STX for a principal. For example, the pox-5 `stake`, `register-for-bond`, and `stake-update` calls. Uses the same comparators as `StxPostCondition`.

```ts
interface StakingPostCondition {
  type: 'staking-postcondition';
  /** Address staking the STX (principal address, contract-id, or 'origin') */
  address: string;
  /** Comparator: 'eq' | 'gt' | 'gte' | 'lt' | 'lte' */
  condition: FungibleComparator;
  /** Amount in microSTX */
  amount: string | bigint | number;
}
```

***

### PoxPostCondition

Guards PoX state changes that do not alter locking status. For example, the pox-5 `unstake`, `unstake-sbtc`, `update-bond-registration`, and `announce-l1-early-exit` calls. Carries only a principal and a condition code.

```ts
interface PoxPostCondition {
  type: 'pox-postcondition';
  /** Address whose PoX actions are constrained (principal address, contract-id, or 'origin') */
  address: string;
  /** Comparator: 'will-not-perform' | 'may-perform' | 'will-perform' */
  condition: PoxComparator;
}
```

```ts
type PoxComparator = 'will-not-perform' | 'may-perform' | 'will-perform';
```

| Comparator         | Meaning                                                 |
| ------------------ | ------------------------------------------------------- |
| `will-not-perform` | The principal must not perform a gated PoX action       |
| `may-perform`      | The principal may or may not perform one; always passes |
| `will-perform`     | The principal must perform a gated PoX action           |
