# Accounts & Addresses

Stacks uses the concept of an "account" to represent a user's identity on the blockchain. An account is identified by a unique address derived from the account's public key.

## Address formats

Stacks addresses use different prefixes to indicate the network they belong to, making it easy to distinguish between mainnet and testnet addresses.

```ts
// Mainnet address starts with 'SP'
const mainnetAddress = 'SP3FGQ8Z7JY9BWYZ5WM53E0M9NK7WHJF0691NZ159';

// Testnet address starts with 'ST'
const testnetAddress = 'ST2F4BK4GZH6YFBNHYDDGN4T1RKBA7DA1BJZPJEJJ';
```

The address format ensures that tokens on testnet cannot be accidentally sent to mainnet addresses and vice versa.

## Getting an address

There are several ways to obtain a Stacks address depending on your use case and what cryptographic material you have available.

{% stepper %}
{% step %}
### Using Stacks Connect

When building user-facing applications, you'll typically get addresses from users who connect their wallets through Stacks Connect.

```ts
import { connect, getLocalStorage, request } from '@stacks/connect';

async function handleWalletConnection() {
  // Connect to wallet
  const response = await connect();
  
  // Get stored addresses
  const data = getLocalStorage();
  const stxAddresses = data.addresses.stx;
  
  if (stxAddresses && stxAddresses.length > 0) {
    const address = stxAddresses[0].address;
    console.log('STX Address:', address);
    // 'SP1MXSZF4NFC8JQ1TTYGEC2WADMC7Y3GHVZYRX6RF'
  }
  
  // Get detailed account info if needed
  const accounts = await request('stx_getAccounts');
  console.log('Account details:', accounts.addresses[0]);
}
```

Stacks Connect stores the connected addresses in local storage, allowing your app to persist the connection across page reloads.
{% endstep %}

{% step %}
### Using a seed phrase

For programmatic wallet generation or when restoring accounts from backup, you can derive addresses from a seed phrase (also known as a mnemonic).

```ts
import { generateWallet, generateSecretKey } from '@stacks/wallet-sdk';

async function createWalletFromSeed() {
  // Generate a new 24-word seed phrase
  const secretKey = generateSecretKey();
  
  // Or use an existing seed phrase
  // const secretKey = 'already owned seed phrase ...';
  
  const wallet = await generateWallet({
    secretKey,
    password: 'optional-encryption-password',
  });
  
  // Get the first account's address
  const account = wallet.accounts[0];
  const mainnetAddress = account.address;
  
  console.log('Address:', mainnetAddress);
  console.log('Private key:', account.stxPrivateKey);
}
```

Each wallet can contain multiple accounts, all derived from the same seed phrase using different derivation paths.
{% endstep %}

{% step %}
### Using a private key

If you already have a private key, you can directly derive the corresponding address without going through the wallet generation process.

```ts
import { privateKeyToAddress, TransactionVersion } from '@stacks/transactions';

function getAddressFromPrivateKey() {
  // Compressed private key (64 or 66 characters)
  const privateKey = 'your-private-key-here';
  
  // For mainnet
  const mainnetAddress = privateKeyToAddress(
    privateKey, 
    TransactionVersion.Mainnet
  );
  
  // For testnet
  const testnetAddress = privateKeyToAddress(
    privateKey, 
    TransactionVersion.Testnet
  );
  
  console.log('Mainnet:', mainnetAddress);
  console.log('Testnet:', testnetAddress);
}
```

The same private key will generate different addresses for mainnet and testnet due to the network-specific version bytes.
{% endstep %}

{% step %}
### Using a public key

When you only have access to a public key (for example, in a watch-only wallet scenario), you can still derive the corresponding address.

```ts
import { publicKeyToAddress, TransactionVersion } from '@stacks/transactions';

function getAddressFromPublicKey() {
  // Compressed public key (66 characters starting with 02 or 03)
  const publicKey = '03b3e0a76b292b2c83fc0ac14ae6160d0438ebe94e14bbb7d0ded3c217f3d29ba7';
  
  // For mainnet
  const mainnetAddress = publicKeyToAddress(
    publicKey,
    TransactionVersion.Mainnet
  );
  
  // For testnet  
  const testnetAddress = publicKeyToAddress(
    publicKey,
    TransactionVersion.Testnet
  );
  
  console.log('Mainnet:', mainnetAddress);
  // 'SP1MXSZF4NFC8JQ1TTYGEC2WADMC7Y3GHVZYRX6RF'
}
```

This is useful for creating watch-only wallets or verifying addresses without access to private keys.
{% endstep %}
{% endstepper %}

## Address validation

Before sending transactions, it's important to validate that addresses are properly formatted.

```ts
import { validateStacksAddress } from '@stacks/transactions';

function isValidAddress(address: string): boolean {
  try {
    // Check if it's a valid mainnet address
    if (address.startsWith('SP')) {
      return validateStacksAddress(address);
    }
    
    // Check if it's a valid testnet address
    if (address.startsWith('ST')) {
      return validateStacksAddress(address);
    }
    
    return false;
  } catch (error) {
    return false;
  }
}

// Examples
console.log(isValidAddress('SP3FGQ8Z7JY9BWYZ5WM53E0M9NK7WHJF0691NZ159')); // true
console.log(isValidAddress('invalid-address')); // false
```

Always validate addresses before using them in transactions to prevent loss of funds due to typos or formatting errors.

