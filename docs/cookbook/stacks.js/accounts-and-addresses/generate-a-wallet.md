# Generate a wallet

{% code fullWidth="false" expandable="true" %}
```typescript
import { generateWallet, generateSecretKey } from '@stacks/wallet-sdk';
import { privateKeyToAddress } from '@stacks/transactions'

// Generate a new wallet with a new 24-word seed phrase
const secretKey = generateSecretKey(256); // 256 bits = 24 words
const wallet = await generateWallet({
  secretKey,
  password: 'your-secure-password',
});

// Access the first account
const account = wallet.accounts[0];
const mainnetAddress = privateKeyToAddress(account.stxPrivateKey, 'mainnet');
console.log('Mnemonic:', secretKey);
console.log('Address:', mainnetAddress
```
{% endcode %}

### Description

Create a new wallet with mnemonic phrase or restore from existing seed

### Use Cases

* Creating new wallets for users
* Restoring wallets from seed phrases
* Generating deterministic wallet addresses
* Building wallet applications

### Key Concepts

* **Secret key** - Can be a mnemonic phrase or private key
* **Password** - Encrypts the wallet (different from mnemonic passphrase)
* **Accounts** - Multiple accounts can be derived from one seed
* Wallet SDK generates hierarchical deterministic (HD) wallets following BIP32/BIP39 standards
