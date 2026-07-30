# PostConditionType

Enum representing the type of a post-condition. Used internally for serialization.

***

### Usage

```ts
import { PostConditionType } from '@stacks/transactions';

// Check post-condition type
if (pc.type === 'stx-postcondition') {
  // PostConditionType.STX
}
```

[**Reference Link**](https://github.com/stx-labs/stacks.js/blob/b7f0ed3f87cd4c5bfb7ab3c4bd8787c2018e3cec/packages/transactions/src/constants.ts)

***

### Definition

```ts
enum PostConditionType {
  STX = 0x00,
  Fungible = 0x01,
  NonFungible = 0x02,
  Staking = 0x03,
  PoX = 0x04,
}
```

***

### Values

| Value         | Number | Description                                                                                                                                  |
| ------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `STX`         | `0x00` | STX token post-condition                                                                                                                     |
| `Fungible`    | `0x01` | Fungible token (SIP-010) post-condition                                                                                                      |
| `NonFungible` | `0x02` | Non-fungible token (SIP-009) post-condition                                                                                                  |
| `Staking`     | `0x03` | Guards staking STX, or modifying staked STX, for a principal. Mirrors the `STX` shape — principal, a `FungibleConditionCode`, and an amount. |
| `PoX`         | `0x04` | Guards PoX state changes that do not alter locking status. Carries a principal and a `PoxConditionCode`, with no amount.                     |

{% hint style="info" %}
`Staking` and `PoX` were added for Stacks epoch 4.0 and are available in `@stacks/transactions` 7.5.0 and later. The source labels them SIP-044 in its JSDoc; the post-conditions themselves are specified in [SIP-045 §3.4.3](https://github.com/stacksgov/sips/blob/main/sips/sip-045/sip-045-pox-5-bitcoin-staking.md).
{% endhint %}

***

### Related condition codes

The comparator paired with a post-condition depends on its type.

`STX`, `Fungible`, and `Staking` all use `FungibleConditionCode`:

```ts
enum FungibleConditionCode {
  Equal = 0x01,
  Greater = 0x02,
  GreaterEqual = 0x03,
  Less = 0x04,
  LessEqual = 0x05,
}
```

`NonFungible` uses `NonFungibleConditionCode`:

```ts
enum NonFungibleConditionCode {
  Sends = 0x10,
  DoesNotSend = 0x11,
  MaybeSent = 0x12,
}
```

`MaybeSent` was added by [SIP-040](https://github.com/stacksgov/sips/blob/main/sips/sip-040/sip-040-post-conds.md), is enabled from epoch 3.4, and is available in `@stacks/transactions` 7.4.0 and later. It always passes, and still counts as covering that NFT instance under `Deny` or `Originator` mode.

`PoX` uses `PoxConditionCode`:

```ts
enum PoxConditionCode {
  WillNotPerform = 0x30,
  MayPerform = 0x31,
  WillPerform = 0x32,
}
```
