# Build an ft pc

{% code fullWidth="false" expandable="true" %}
```typescript
import { Pc, PostConditionMode } from '@stacks/transactions';

// Create a post-condition for fungible token transfers
const postCondition = Pc.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM")
  .willSendGte(500) // Amount in token's smallest unit
  .ft("ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.token-ft", "my-token");

// Use in transaction options
const txOptions = {
  // ... other transaction options
  postConditions: [postCondition],
  postConditionMode: PostConditionMode.Deny,
};
```
{% endcode %}

### Description

Builds a post-condition that requires the sender to transfer at least 500 units of a fungible token, in the token's smallest unit, and attaches it to a transaction in `Deny` mode.

### Use Cases

* Securing fungible token transfers with amount validation
* Protecting users from unexpected token transfers in DeFi protocols
* Ensuring token swaps happen with expected amounts

### Key Concepts

* `.willSendGte()` - Ensure at least this amount is sent (also supports `willSendEq`, `willSendGt`, `willSendLt`, `willSendLte`)
* `.ft()` - Takes the token contract's identifier (`address.contract-name`) and the token name as defined in that contract
* Staking and PoX post-conditions - Locking STX in `SP000000000000000000002Q6VF78.pox-5` and the four gated PoX actions have their own post-condition types, built with `.ustxToLock()` and `.willPerformPox()` from `@stacks/transactions` 7.5.0. [Build a STX pc](build-a-stx-pc.md) shows both.
