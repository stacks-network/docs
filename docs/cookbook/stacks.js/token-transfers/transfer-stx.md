# Transfer STX

{% code fullWidth="false" expandable="true" %}
```typescript
import {
  broadcastTransaction,
  makeSTXTokenTransfer,
  Pc,
  PostConditionMode,
} from "@stacks/transactions";

// Define sender and recipient
const senderAddress = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
const recipientAddress = "ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5";

// Create post-condition to ensure exact amount is sent
const postConditions = Pc.principal(senderAddress)
  .willSendEq(1000000)  // 1 STX in micro-STX
  .ustx();

// Configure transaction options
const txOptions = {
  recipient: recipientAddress,
  amount: 1000000,  // 1 STX in micro-STX
  senderKey: "753b7cc01a1a2e86221266a154af739463fce51219d97e4f856cd7200c3bd2a601",
  network: 'testnet',
  memo: "Transfer memo",  // Optional memo field
  postConditions: [postConditions],
  postConditionMode: PostConditionMode.Deny,
};

// Create and broadcast the transaction
const transaction = await makeSTXTokenTransfer(txOptions);
const broadcastResponse = await broadcastTransaction({ transaction });
console.log("Transaction ID:", broadcastResponse.txid);
```
{% endcode %}

### Description

Send STX tokens between addresses with post-conditions for secure transfers

### Use Cases

* Transferring STX tokens securely between addresses
* Validating transaction amounts for secure transfers

### Key Concepts

* **Post-conditions** - Ensure the exact amount of STX is transferred
