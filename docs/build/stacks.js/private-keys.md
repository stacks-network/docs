# Private Keys

Stacks applications can work with either web wallets (such as Leather Wallet or Xverse) that users control, or local accounts you manage the private keys directly.

## Web wallets (user-controlled)

Most users interact with Stacks apps through web wallets, where the wallet handles all private key management and transaction signing.

```ts
import { connect } from '@stacks/connect';

// Users connect their wallet
const response = await connect();
console.log('Connected addresses:', response.addresses);

// The wallet handles all cryptographic operations
// when signing transactions or messages
```

Use web wallets when building user-facing applications where users should maintain control of their keys.

## Local accounts (application-controlled)

Local accounts give your application direct control over private keys, enabling programmatic transaction signing without user interaction.

```ts
import { makeSTXTokenTransfer } from '@stacks/transactions';

// Your application controls the private key
const privateKey = 'your-private-key-here';

const txOptions = {
  recipient: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  amount: 1000000n,
  senderKey: privateKey, // Direct private key usage
  network: 'testnet',
};

const transaction = await makeSTXTokenTransfer(txOptions);
// Transaction is signed programmatically
```

Use local accounts for backend services, automated systems, or development tools that need to sign transactions without user interaction.

## Working with private keys

When building applications that use local accounts, you'll need to generate and manage private keys securely.

### Generating random private keys

Create a new private key for one-time use or testing purposes.

```ts
import { randomPrivateKey } from '@stacks/transactions';

function generateNewAccount() {
  const privateKey = randomPrivateKey();
  console.log('Private key:', privateKey);
  // 'f5a31c1268a1e37d4edaa05c7d11183c5fbf...'
  
  // IMPORTANT: Store this securely!
  // Anyone with this key can control the account
  return privateKey;
}
```

{% hint style="warning" %}
Private keys in Stacks are 256-bit numbers, typically represented as 64-character hexadecimal strings. Anyone with the private key can control the account—store keys securely.
{% endhint %}

## Private key formats

Stacks.js supports multiple private key formats for different use cases.

{% hint style="info" %}
Stacks-formatted private keys append a trailing `0x01` to the 32-byte private key to indicate that the derived public key must be encoded in compressed form.
{% endhint %}

```ts
import { PrivateKey } from '@stacks/transactions';

// Hex string format (most common)
const uncompressedKey = 'f5a31c1268a1e37d4edaa05c7d11183c5fbf...';

// Compressed format with suffix
const compressedKey = 'f5a31c1268a1e37d4edaa05c7d11183c5fbf...01';
```

## Wallet generation with seed phrases

For better security and recoverability, use hierarchical deterministic (HD) wallets based on seed phrases.

{% stepper %}
{% step %}
**Generate a seed phrase**

Create a new 24-word mnemonic seed phrase that can regenerate all wallet accounts.

```ts
import { generateSecretKey } from '@stacks/wallet-sdk';

function createNewWallet() {
  const secretKey = generateSecretKey();
  console.log('Seed phrase:', secretKey);
  // "warrior volume sport ... figure cake since"
  
  // Users should write this down and store it securely
  // This phrase can regenerate all accounts in the wallet
  return secretKey;
}
```

{% hint style="warning" %}
Seed phrases provide a human-readable backup that can restore an entire wallet hierarchy. Users should write this down and store it securely.
{% endhint %}
{% endstep %}

{% step %}
**Create wallet from seed phrase**

Generate a complete wallet structure from a seed phrase, including multiple accounts.

```ts
import { generateWallet, generateSecretKey } from '@stacks/wallet-sdk';

async function setupWallet() {
  // Use existing seed phrase or generate new one
  const seedPhrase = generateSecretKey();
  
  const wallet = await generateWallet({
    secretKey: seedPhrase,
    password: 'optional-encryption-password',
  });
  
  // Access the first account
  const account = wallet.accounts[0];
  console.log('STX private key:', account.stxPrivateKey);
  
  return wallet;
}
```

Each wallet can contain multiple accounts, all derived from the same seed phrase but with different private keys.
{% endstep %}

{% step %}
**Managing multiple accounts**

HD wallets support multiple accounts from a single seed phrase, useful for organizing funds or separating concerns.

```ts
import { generateNewAccount, generateWallet, generateSecretKey } from '@stacks/wallet-sdk';

async function createMultipleAccounts() {
  const seedPhrase = generateSecretKey();
  
  let wallet = await generateWallet({
    secretKey: seedPhrase,
    password: 'my-password',
  });
  
  console.log('Accounts:', wallet.accounts.length); // 1 (default)
  
  // Add more accounts
  wallet = generateNewAccount(wallet);
  wallet = generateNewAccount(wallet);
  
  console.log('Accounts:', wallet.accounts.length); // 3
  
  // Each account has its own keys and address
  wallet.accounts.forEach((account, index) => {
    console.log(`Account ${index}:`, account.stxPrivateKey);
  });
}
```

All accounts can be regenerated from the original seed phrase, making backup simple while maintaining separate addresses.
{% endstep %}
{% endstepper %}
