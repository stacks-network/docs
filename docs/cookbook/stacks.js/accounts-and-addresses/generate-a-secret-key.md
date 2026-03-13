# Generate a secret key

{% code fullWidth="false" expandable="true" %}
```typescript
import { generateSecretKey } from '@stacks/wallet-sdk';

// Generate a 24-word mnemonic (256 bits of entropy)
const mnemonic24 = generateSecretKey();
// Example: "aunt birth lounge misery utility blind holiday walnut fuel make gift parent gap picnic exact various express sphere family nerve oil drill engage youth"

// Generate a 12-word mnemonic (128 bits of entropy)
const mnemonic12 = generateSecretKey(128);
// Example: "winter crash infant long upset beauty cram tank short remain obtain sauce"
```
{% endcode %}

### Description

Create mnemonic seed phrases for wallet generation

### Use Cases

* Creating new wallet seed phrases
* Generating secure entropy for applications
* Building wallet creation flows
* Testing wallet functionality

### Key Concepts

* **Entropy** - Random data used to generate the phrase
* **Word count** - 12 words (128 bits) or 24 words (256 bits)
* **Word list** - Standardized list of 2048 words
* **Checksum** - Built-in error detection
* Mnemonic seed phrases follow the BIP39 standard
