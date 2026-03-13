# Return an entry from a map

{% code fullWidth="false" expandable="true" %}
```typescript
import { Cl, cvToHex } from "@stacks/transactions";

// Query a map entry from a contract
const contractAddress = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
const contractName = "my-contract";
const mapName = "user-balances";

// Create the map key (e.g., a principal)
const mapKey = Cl.standardPrincipal("ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5");

const response = await fetch(
  `https://api.hiro.so/v2/map_entry/${contractAddress}/${contractName}/${mapName}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cvToHex(mapKey)),
  }
);

const result = await response.json();
const data = result.data ? Cl.deserialize(result.data) : null;

console.log("Map value:", data);
```
{% endcode %}

### Description

Query contract map data using the Stacks API map\_entry endpoint

### Use Cases

* Reading user balances from token contracts
* Checking NFT ownership records
* Retrieving configuration values from contracts
* Monitoring contract state without transactions

### Key Concepts

* **POST request** - Send the serialized map key
* **Hex encoding** - Keys must be hex-encoded Clarity values
* **Response format** - Returns hex-encoded Clarity value or null
