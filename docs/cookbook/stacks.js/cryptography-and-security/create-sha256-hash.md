# Create sha256 hash

{% code fullWidth="false" expandable="true" %}
```typescript
import { sha256 } from "@noble/hashes/sha256";
import { bytesToHex, hexToBytes, utf8ToBytes } from "@stacks/common";
import { bufferCV, stringUtf8CV, serializeCV } from "@stacks/transactions";

// Hash a string (matching Clarity's sha256 output)
function hashString(text: string) {
  const clarityValue = stringUtf8CV(text);
  const serialized = serializeCV(clarityValue);
  return bytesToHex(sha256(serialized));
}

// Hash hex data (matching Clarity's sha256 output)  
function hashHexData(hexData: string) {
  const clarityValue = bufferCV(hexToBytes(hexData));
  const serialized = serializeCV(clarityValue);
  return bytesToHex(sha256(serialized));
}

// Example usage
const hash1 = hashString("Hello World");
console.log("String hash:", hash1);

const hash2 = hashHexData("0x1234567890abcdef");
console.log("Hex hash:", hash2);
```
{% endcode %}

### Description

Generate SHA-256 hashes that match Clarity's hashing output

### Use Cases

* Creating deterministic identifiers
* Verifying data integrity between on-chain and off-chain
* Implementing commit-reveal schemes off-chain
* Building merkle trees compatible with Clarity

### Key Concepts

* **Convert to Clarity value** - Use appropriate CV type (`stringUtf8CV`, `bufferCV`, etc.)
* **Serialize** - Use `serializeCV` to match Clarity's encoding
* **Hash** - Apply SHA-256 to the serialized bytes
