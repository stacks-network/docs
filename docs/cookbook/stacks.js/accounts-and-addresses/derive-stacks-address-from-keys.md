# Derive stacks address from keys

{% code fullWidth="false" expandable="true" %}
```typescript
import { getPublicKeyFromPrivate } from "@stacks/encryption";
import { 
  getAddressFromPrivateKey, 
  getAddressFromPublicKey 
} from "@stacks/transactions";

// Derive address from private key
const privateKey = process.env.PRIVATE_KEY; // Keep this secret!
const addressFromPrivate = getAddressFromPrivateKey(privateKey, "testnet");

// Derive public key and address
const publicKey = getPublicKeyFromPrivate(privateKey);
const addressFromPublic = getAddressFromPublicKey(publicKey, "testnet");

console.log("Address:", addressFromPrivate);
console.log("Public key:", publicKey);
console.log("Same address:", addressFromPrivate === addressFromPublic); // true
```
{% endcode %}

### Description

Generate Stacks addresses from private or public keys using multiple methods

### Use Cases

* Wallet address generation
* Key pair validation
* Address recovery from backup keys
* Multi-signature wallet setup

### Key Concepts

* **Private key** - 32-byte random number (keep secret!)
* **Public key** - Derived from private key using ECDSA
* **Address** - Base58check-encoded hash of public key
* **Network** - Different prefixes for mainnet (SP/SM) vs testnet (ST/SN)
