# Build a STX pc

{% code fullWidth="false" expandable="true" %}
```typescript
import {
  broadcastTransaction,
  makeSTXTokenTransfer,
  Pc,
  PostConditionMode,
} from "@stacks/transactions";

// Create a post-condition that ensures exactly 10 STX is sent
const pc = Pc.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM")
  .willSendEq(10000000)  // 10 STX in micro-STX
  .ustx();

const txOptions = {
  recipient: "ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5",
  amount: 10000000,
  senderKey: "753b7cc01a1a2e86221266a154af739463fce51219d97e4f856cd7200c3bd2a601",
  network: "testnet",
  postConditions: [pc],
  postConditionMode: PostConditionMode.Deny,
};

const transaction = await makeSTXTokenTransfer(txOptions);
const broadcastResponse = await broadcastTransaction(transaction);
console.log("Transaction ID:", broadcastResponse.txid);
```
{% endcode %}

### Description

A helper function that creates a post-condition for STX token transfers using the Pc builder class, ensuring exact amounts are transferred as expected.

### Use Cases

* Securing STX token transfers with transfer amount validation
* Protecting users from unexpected token transfers
* Ensuring contract interactions behave as expected

### Key Concepts

* `Pc.principal()` - Specify the principal that will send tokens
* `.willSendEq()` - Ensure exactly this amount is sent (also supports `willSendGte`, `willSendLte`, `willSendGt`, `willSendLt`)
* `.ustx()` - Specify the token type (micro-STX)
