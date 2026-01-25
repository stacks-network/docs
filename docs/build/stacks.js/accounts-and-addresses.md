# Accounts & Addresses

<div data-with-frame="true"><figure><img src="../.gitbook/assets/acounts-and-addresses.png" alt=""><figcaption></figcaption></figure></div>

Stacks uses the concept of an "account" to represent a user's identity. An account is identified by a unique address derived from the account's public key.

{% hint style="info" %}
In Stacks, the terms address and principal are used interchangeably.
{% endhint %}

## Address formats

Stacks addresses use different prefixes to indicate the network they belong to, making it easy to distinguish between mainnet and testnet addresses.

```ts
// Mainnet address starts with 'SP'
const mainnetAddress = 'SP3FGQ8Z7JY9BWYZ5WM53E0M9NK7WHJF0691NZ159';

// Mainnet multisig address starts with 'SM'
const multisigMainnetAddress = 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4'

// Testnet multisig address starts with 'SN'
const multisigTestnetAddress = 'SNJSPGVBFZHPXGESC9ZQWVFSNF4RHNNRTW2HYYJ7'

// Testnet address starts with 'ST'
const testnetAddress = 'ST2F4BK4GZH6YFBNHYDDGN4T1RKBA7DA1BJZPJEJJ';
```

The address format ensures that tokens on testnet cannot be accidentally sent to mainnet addresses and vice versa.

## Getting an address

There are several ways to obtain a Stacks address depending on your use case and what cryptographic material you have available.

{% stepper %}
{% step %}
**Using Stacks Connect**

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
**Using a seed phrase**

For programmatic wallet generation or when restoring accounts from backup, you can derive addresses from a seed phrase (also known as a mnemonic).

<pre class="language-ts"><code class="lang-ts">import { generateWallet, generateSecretKey, type Wallet, Account } from '@stacks/wallet-sdk';
import { privateKeyToAddress, privateKeyToPublic } from '@stacks/transactions'

// Generate a new 24-word seed phrase
const secretKey: string = generateSecretKey();

// Or use an existing seed phrase
// const secretKey = 'already owned seed phrase ...';

const wallet: Wallet = await generateWallet({
  secretKey,
  password: 'optional-encryption-password',
});

// Get the first account's public key and address
const <a data-footnote-ref href="#user-content-fn-1">account</a>: Account = wallet.accounts[0];
const publicKey = privateKeyToPublic(account.stxPrivateKey);
const mainnetAddress = privateKeyToAddress(account.stxPrivateKey, 'mainnet');

console.log('Private key:', account.stxPrivateKey);
console.log('Address:', mainnetAddress);
// Private key: 97ff523937735dc6c9e3180f98a6aa94f526fbe072230b99e07482260f59988c01
// Address: SP1WNA65XE3M665RJ9AC81J18XPMJ5QC5XJDHWXE
</code></pre>

Each wallet can contain multiple accounts, all derived from the same seed phrase using different derivation paths.
{% endstep %}

{% step %}
**Using a private key**

If you already have a private key, you can directly derive the corresponding address without going through the wallet generation process.

{% hint style="info" %}
Stacks-formatted private keys append a trailing `0x01` to the 32-byte private key to indicate that the derived public key must be encoded in compressed form.
{% endhint %}

```ts
import { privateKeyToAddress, TransactionVersion } from '@stacks/transactions';

// 32-byte hexadecimal private key (64 or 66 characters)
const privateKey = 'your-private-key-here';

// For mainnet
const mainnetAddress = privateKeyToAddress(
  privateKey, 
  'mainnet'
);

// For testnet
const testnetAddress = privateKeyToAddress(
  privateKey, 
  'testnet'
);
```

The same private key will generate different addresses for mainnet and testnet due to the network-specific version bytes.
{% endstep %}

{% step %}
**Using a public key**

When you only have access to a public key (for example, in a watch-only wallet scenario), you can still derive the corresponding address.

```ts
import { publicKeyToAddress, TransactionVersion } from '@stacks/transactions';

// Compressed public key (66 characters starting with 02 or 03)
const publicKey = '03b3e0a76b292b2c83fc0ac14ae6160d0438ebe94e14bbb7d0ded3c217f3d29ba7';

// For mainnet
const mainnetAddress = publicKeyToAddress(
  publicKey,
  'mainnet'
);

// For testnet  
const testnetAddress = publicKeyToAddress(
  publicKey,
  'testnet'
);
```

This is useful for creating watch-only wallets or verifying addresses without access to private keys.
{% endstep %}

{% step %}
**Using a bitcoin address**

Bitcoin and Stacks share a similar address generation scheme based on the P2PKH format, which allows for both a Bitcoin & Stacks address to share the same public key hash. If you base58check decode a legacy bitcoin address, you can reveal the public key hash, which can then be used to generate its respective c32check encoded Stacks address.

```typescript
import { b58ToC32 } from 'c32check';

let bitcoinAddress = '16EMaNw3pkn3v6f2BgnSSs53zAKH4Q8YJg'
let stacksAddress = b58ToC32(b58addr)
// SPWNYDJ3STG7XH7ERWXMV6MQ7Q6EATWVY5Q1QMP8
```
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

[^1]: {\
    stxPrivateKey: '97c584a81cf96234b0eebc064314487c5b43c4f48ed980242376100f972d1c5701',\
    dataPrivateKey: '7f6b9d706a3b884d76cf1e11e5b7033549274b3ab3db0e6bc7b64124b5cba328',\
    appsKey: 'xprvA14CAxv1AS7na2JcYPSyFvCvrp5AJgjTq3JTS1io8GUqtEL4mUBXn2QMFA8wzS1UnDoURkHG1Sim66C6sqHHM98dfj1hPFym8No7nHQwSU7',\
    salt: 'a53b30a8e72e677632e102eda44100dc2a397e8ced966d11904b57cad90ba48f',\
    index: 0\
    }
