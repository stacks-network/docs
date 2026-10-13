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
  senderKey: "753b7cc01a1a2e86221266a154af739463fce51219d97e4f856cd7200c3bd2a601", // demo key
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

Builds a post-condition with the `Pc` builder that requires the sender to transfer exactly 10 STX, and attaches it to an STX transfer in `Deny` mode.

### Use Cases

* Securing STX token transfers with transfer amount validation
* Protecting users from unexpected token transfers
* Limiting how much STX a contract call can move from the sender

### Key Concepts

* `Pc.principal()` - Specify the principal that will send tokens
* `.willSendEq()` - Ensure exactly this amount is sent (also supports `willSendGt`, `willSendGte`, `willSendLt`, `willSendLte`)
* `.ustx()` - Specify the token type (micro-STX)
* `.ustxToLock()` - Use in place of `.ustx()` when the call locks STX in `SP000000000000000000002Q6VF78.pox-5` instead of transferring it: `stake`, `register-for-bond` and `stake-update`. The chain is `Pc.principal(sender).willSendEq(amount).ustxToLock()`, with the amount in micro-STX, in `Deny` mode.
* `.willPerformPox()` - For `unstake`, `unstake-sbtc`, `update-bond-registration` and `announce-l1-early-exit`, add `Pc.principal(sender).willPerformPox()`, which takes no amount, in `Deny` or `Originator` mode.

`.ustxToLock()` and `.willPerformPox()` need `@stacks/transactions` 7.5.0 or later and Epoch 4.0. The [`principal`](https://app.gitbook.com/s/GVj1Z9vMuEOMe7oH7Wnq/stacks.js/stacks-transactions/post-conditions/principal) reference documents both methods, [`PostConditionType`](https://app.gitbook.com/s/GVj1Z9vMuEOMe7oH7Wnq/stacks.js/stacks-transactions/types/postconditiontype) lists the wire values, and [Post-condition examples](https://app.gitbook.com/s/Zz9BLmTU9oydDpL3qiUh/post-conditions/examples) shows a `stake` call and a PoX guard.
