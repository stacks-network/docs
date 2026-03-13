# Create a sponsored tx

{% code fullWidth="false" expandable="true" %}
```typescript
import { bytesToHex } from "@stacks/common";
import {
  broadcastTransaction,
  deserializeTransaction,
  makeContractCall,
  sponsorTransaction,
  BufferReader,
  AnchorMode,
  Cl,
} from "@stacks/transactions";

// Step 1: User creates the transaction with sponsored flag
const userTxOptions = {
  contractAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  contractName: "my-contract",
  functionName: "my-function",
  functionArgs: [Cl.uint(123)],
  fee: 0, // User doesn't pay fees
  senderKey: "b244296d5907de9864c0b0d51f98a13c52890be0404e83f273144cd5b9960eed01",
  network: 'testnet',
  sponsored: true, // Mark as sponsored
};

const transaction = await makeContractCall(userTxOptions);
const serializedTx = bytesToHex(transaction.serialize());

// Step 2: Send serialized transaction to sponsor
// (In practice, this would be sent to a sponsorship service)

// Step 3: Sponsor signs and pays fees
const sponsorKey = "753b7cc01a1a2e86221266a154af739463fce51219d97e4f856cd7200c3bd2a601";
const deserializedTx = deserializeTransaction(serializedTx);
const sponsoredTx = await sponsorTransaction({
  transaction: deserializedTx,
  sponsorPrivateKey: sponsorKey,
  fee: 1000, // Sponsor pays the fee
  sponsorNonce: 0,
});

// Step 4: Broadcast the sponsored transaction
const broadcastResponse = await broadcastTransaction({
  transaction: sponsoredTx,
  network: STACKS_TESTNET,
});

console.log("Sponsored transaction ID:", broadcastResponse.txid);
```
{% endcode %}

### Description

Build transactions where a sponsor pays the fees on behalf of users

### Use Cases

* Onboarding new users without STX for fees
* Subsidizing transaction costs for dApp users
* Enterprise applications paying for user transactions
* Gaming applications with seamless user experience

### Key Concepts

* **User** - Creates and signs the transaction with `sponsored: true`
* **Sponsor** - Pays the fees and broadcasts the transaction
* Sponsored transactions have two parties
