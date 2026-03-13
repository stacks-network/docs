# Build an ft pc

{% code fullWidth="false" expandable="true" %}
```typescript
import { Pc } from '@stacks/transactions';

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

Create post-conditions for fungible token transfers to ensure exact amounts are transferred as expected

### Use Cases

* Securing fungible token transfers with amount validation
* Protecting users from unexpected token transfers in DeFi protocols
* Ensuring token swaps happen with expected amounts

### Key Concepts

* `.ft()` - Takes two parameters: contract address with asset name and token name as defined in the contract
* The `Pc` builder for fungible tokens provides a fluent interface for creating post-conditions
