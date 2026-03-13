# Transfer a SIP10 token

{% code fullWidth="false" expandable="true" %}
```typescript
import {
  broadcastTransaction,
  Cl,
  makeContractCall,
  Pc,
  PostConditionMode,
} from "@stacks/transactions";

// Token contract details
const tokenAddress = "SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9";
const tokenName = "wrapped-bitcoin";
const contractIdentifier = `${tokenAddress}.${tokenName}`;

// Create post-condition to ensure exact amount is transferred
const postConditions = [
  Pc.principal("SP2C20XGZBAYFZ1NYNHT1J6MGBGVX9X7X3P7LAX7K")
    .willSendEq(100000000) // 1 wBTC (8 decimals)
    .ft(contractIdentifier, tokenName)
];

const txOptions = {
  contractAddress: tokenAddress,
  contractName: tokenName,
  functionName: "transfer",
  functionArgs: [
    Cl.uint(100000000), // amount (with decimals)
    Cl.principal("SP2C20XGZBAYFZ1NYNHT1J6MGBGVX9X7X3P7LAX7K"), // sender
    Cl.principal("SP31DA84DWTF6510EW6DCTC3GB3XH1EEBGP7MYT2"), // recipient
    Cl.none(), // optional memo
  ],
  senderKey: "753b7cc01a1a2e86221266a154af739463fce51219d97e4f856cd7200c3bd2a601",
  validateWithAbi: true,
  network: 'mainnet,
  postConditions,
  postConditionMode: PostConditionMode.Deny,
};

const transaction = await makeContractCall(txOptions);
const broadcastResponse = await broadcastTransaction({ 
  transaction,
  network: STACKS_MAINNET,
});

console.log("Transaction ID:", broadcastResponse.txid);
```
{% endcode %}

### Description

Transfer fungible tokens using the SIP-10 standard with post-conditions

### Use Cases

* Transferring fungible tokens between wallets
* Integrating token transfers in dApps
* Building DEX or swap functionality
* Implementing payment systems with custom tokens

### Key Concepts

* **Standard interface** - All SIP-10 tokens implement `transfer`, `get-balance`, etc.
* **Post-conditions** - Protect users by ensuring exact amounts are transferred
* **Memos** - Optional field for including transfer notes
* SIP-10 is the fungible token standard on Stacks, similar to ERC-20
