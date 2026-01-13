# Address Validation

Validate and format Stacks addresses and principals.

## Overview

Stacks addresses follow specific formats that differ between mainnet and testnet. Proper validation ensures your application handles addresses correctly, preventing loss of funds and improving user experience. This guide covers address validation, formatting, and conversion utilities.

## Basic address validation

Validate Stacks addresses:

{% code title="basic-validation.ts" %}
```ts
import { 
  validateStacksAddress
} from '@stacks/transactions';

// Validate standard addresses
const isValidMainnet = validateStacksAddress('SP2J6Y09JMFWWZCT4VJX0BA5W7A9HZP5EX96Y6VZY');
console.log('Valid mainnet:', isValidMainnet); // true

const isValidTestnet = validateStacksAddress('ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC');
console.log('Valid testnet:', isValidTestnet); // true

const isInvalid = validateStacksAddress('invalid-address');
console.log('Valid:', isInvalid); // false
```
{% endcode %}

## Address types and detection

Identify address types and networks:

{% code title="address-info.ts" %}
```ts
import { 
  getAddressFromPrivateKey,
  getAddressFromPublicKey,
  TransactionVersion
} from '@stacks/transactions';

// Detect address type from prefix
function getAddressInfo(address: string): {
  type: 'standard' | 'contract' | 'multisig' | 'invalid';
  network: 'mainnet' | 'testnet' | 'unknown';
} {
  if (!validateStacksAddress(address)) {
    return { type: 'invalid', network: 'unknown' };
  }
  
  // Mainnet prefixes
  if (address.startsWith('SP')) {
    return { type: 'standard', network: 'mainnet' };
  } else if (address.startsWith('SM')) {
    return { type: 'multisig', network: 'mainnet' };
  }
  
  // Testnet prefixes
  else if (address.startsWith('ST')) {
    return { type: 'standard', network: 'testnet' };
  } else if (address.startsWith('SN')) {
    return { type: 'multisig', network: 'testnet' };
  }
  
  // Contract address (contains .)
  if (address.includes('.')) {
    const [principal] = address.split('.');
    const info = getAddressInfo(principal);
    return { ...info, type: 'contract' };
  }
  
  return { type: 'invalid', network: 'unknown' };
}

// Usage
const info = getAddressInfo('SP2J6Y09JMFWWZCT4VJX0BA5W7A9HZP5EX96Y6VZY.my-contract');
console.log(info); // { type: 'contract', network: 'mainnet' }
```
{% endcode %}

## Contract address handling

Work with contract principals:

{% code title="contract-address.ts" %}
```ts
// Parse contract address components
function parseContractAddress(contractAddress: string): {
  principal: string;
  contractName: string;
  isValid: boolean;
} {
  const parts = contractAddress.split('.');
  
  if (parts.length !== 2) {
    return { principal: '', contractName: '', isValid: false };
  }
  
  const [principal, contractName] = parts;
  
  const isValid = validateStacksAddress(principal) && 
                  validateContractName(contractName);
  
  return { principal, contractName, isValid };
}

// Build contract address
function buildContractAddress(principal: string, contractName: string): string {
  if (!validateStacksAddress(principal)) {
    throw new Error('Invalid principal address');
  }
  
  if (!validateContractName(contractName)) {
    throw new Error('Invalid contract name');
  }
  
  return `${principal}.${contractName}`;
}

// Validate full contract identifier
function validateContractAddress(address: string): boolean {
  const { isValid } = parseContractAddress(address);
  return isValid;
}

// Usage
const parsed = parseContractAddress('SP2J6Y09JMFWWZCT4VJX0BA5W7A9HZP5EX96Y6VZY.my-token');
console.log(parsed); 
// { principal: 'SP2J6...', contractName: 'my-token', isValid: true }
```
{% endcode %}

## Address conversion utilities

Convert between formats and networks:

{% code title="conversion-utils.ts" %}
```ts
import { c32addressDecode, c32address } from 'c32check';

// Convert between testnet and mainnet addresses
function convertAddressNetwork(
  address: string,
  toNetwork: 'mainnet' | 'testnet'
): string {
  try {
    // Decode the address
    const decoded = c32addressDecode(address);
    
    // Determine new version
    let newVersion: number;
    if (toNetwork === 'mainnet') {
      newVersion = decoded[0] === 26 ? 22 : 20; // Multi-sig or standard
    } else {
      newVersion = decoded[0] === 22 ? 26 : 21; // Multi-sig or standard
    }
    
    // Re-encode with new version
    const newAddress = c32address(newVersion, decoded[1]);
    return newAddress;
  } catch (error) {
    throw new Error('Invalid address format');
  }
}

// Extract address hash
function getAddressHash(address: string): string {
  const decoded = c32addressDecode(address);
  return Buffer.from(decoded[1]).toString('hex');
}

// Check if addresses are same (ignoring network)
function isSameAddress(addr1: string, addr2: string): boolean {
  try {
    const hash1 = getAddressHash(addr1);
    const hash2 = getAddressHash(addr2);
    return hash1 === hash2;
  } catch {
    return false;
  }
}
```
{% endcode %}

## Advanced validation patterns

### Comprehensive address validator

Create a robust validation system:

{% code title="address-validator.ts" %}
```ts
class AddressValidator {
  private cache = new Map<string, boolean>();
  
  validate(address: string, options?: {
    network?: 'mainnet' | 'testnet';
    allowContracts?: boolean;
    allowMultisig?: boolean;
  }): { valid: boolean; reason?: string } {
    // Check cache
    const cacheKey = `${address}-${JSON.stringify(options)}`;
    if (this.cache.has(cacheKey)) {
      return { valid: this.cache.get(cacheKey)! };
    }
    
    // Basic validation
    if (!validateStacksAddress(address)) {
      return { valid: false, reason: 'Invalid address format' };
    }
    
    const info = getAddressInfo(address);
    
    // Check network if specified
    if (options?.network && info.network !== options.network) {
      return { 
        valid: false, 
        reason: `Address is for ${info.network}, expected ${options.network}` 
      };
    }
    
    // Check contract addresses
    if (info.type === 'contract' && !options?.allowContracts) {
      return { valid: false, reason: 'Contract addresses not allowed' };
    }
    
    // Check multisig
    if (info.type === 'multisig' && !options?.allowMultisig) {
      return { valid: false, reason: 'Multisig addresses not allowed' };
    }
    
    // Cache result
    this.cache.set(cacheKey, true);
    
    return { valid: true };
  }
  
  validateBatch(addresses: string[], options?: any): Map<string, boolean> {
    const results = new Map<string, boolean>();
    
    for (const address of addresses) {
      const { valid } = this.validate(address, options);
      results.set(address, valid);
    }
    
    return results;
  }
}
```
{% endcode %}

### Address formatting

Format addresses for display:

{% code title="format-address.tsx" %}
```ts
function formatAddress(
  address: string,
  options?: {
    truncate?: boolean;
    length?: number;
    separator?: string;
  }
): string {
  if (!validateStacksAddress(address)) {
    return 'Invalid Address';
  }
  
  if (options?.truncate) {
    const length = options.length || 8;
    const start = address.slice(0, length);
    const end = address.slice(-length);
    const separator = options.separator || '...';
    return `${start}${separator}${end}`;
  }
  
  return address;
}

// Format for display with copy functionality
function AddressDisplay({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);
  
  const formatted = formatAddress(address, { 
    truncate: true, 
    length: 6 
  });
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="address-display" onClick={copyToClipboard}>
      <code>{formatted}</code>
      {copied && <span>✓ Copied</span>}
    </div>
  );
}
```
{% endcode %}

## Security considerations

Implement secure address handling:

{% code title="security.ts" %}
```ts
// Sanitize user input
function sanitizeAddress(input: string): string {
  // Remove whitespace and common separators
  return input.trim().replace(/[\s\-_]/g, '');
}

// Verify address ownership
async function verifyAddressOwnership(
  address: string,
  signature: string,
  message: string
): Promise<boolean> {
  try {
    // Verify the signature matches the address
    const verified = verifyMessageSignature({
      message,
      signature,
      publicKey: await getPublicKeyFromAddress(address),
    });
    
    return verified;
  } catch {
    return false;
  }
}

// Validate address for specific use case
function validateRecipientAddress(
  address: string,
  options: {
    blockList?: string[];
    allowList?: string[];
    requireMainnet?: boolean;
  }
): { valid: boolean; reason?: string } {
  // Check blocklist
  if (options.blockList?.includes(address)) {
    return { valid: false, reason: 'Address is blocked' };
  }
  
  // Check allowlist
  if (options.allowList && !options.allowList.includes(address)) {
    return { valid: false, reason: 'Address not in allowlist' };
  }
  
  // Check network
  const info = getAddressInfo(address);
  if (options.requireMainnet && info.network !== 'mainnet') {
    return { valid: false, reason: 'Mainnet address required' };
  }
  
  return { valid: true };
}
```
{% endcode %}

## Testing utilities

Test address validation:

{% code title="address-validation.test.ts" %}
```ts
import { describe, it, expect } from 'vitest';

describe('Address validation', () => {
  const validAddresses = [
    'SP2J6Y09JMFWWZCT4VJX0BA5W7A9HZP5EX96Y6VZY',
    'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC',
    'SP2J6Y09JMFWWZCT4VJX0BA5W7A9HZP5EX96Y6VZY.my-contract',
  ];
  
  const invalidAddresses = [
    'invalid',
    'SP2J6Y09JMFWWZCT4VJX0BA5W7A9HZP5EX96Y6VZ', // Too short
    'XP2J6Y09JMFWWZCT4VJX0BA5W7A9HZP5EX96Y6VZY', // Wrong prefix
    'SP2J6Y09JMFWWZCT4VJX0BA5W7A9HZP5EX96Y6VZY.', // Missing contract
  ];
  
  validAddresses.forEach(address => {
    it(`should validate ${address}`, () => {
      expect(validateStacksAddress(address)).toBe(true);
    });
  });
  
  invalidAddresses.forEach(address => {
    it(`should reject ${address}`, () => {
      expect(validateStacksAddress(address)).toBe(false);
    });
  });
});
```
{% endcode %}

## Best practices

* Always validate user input: Never trust addresses from users
* Check network compatibility: Ensure addresses match your network
* Handle edge cases: Contract addresses, multisig, etc.
* Cache validation results: Avoid redundant validation
* Provide clear error messages: Help users fix invalid inputs

## Common mistakes

Not checking network type:

{% code title="bad-vs-good-network.ts" %}
```ts
// Bad: Accepting any valid address
const isValid = validateStacksAddress(userInput);

// Good: Checking network matches
const info = getAddressInfo(userInput);
if (info.network !== 'mainnet') {
  throw new Error('Please use a mainnet address');
}
```
{% endcode %}

Assuming address format:

{% code title="bad-vs-good-parse.ts" %}
```ts
// Bad: Assuming standard address
const [principal, contract] = address.split('.');

// Good: Proper validation
const parsed = parseContractAddress(address);
if (!parsed.isValid) {
  throw new Error('Invalid contract address');
}
```
{% endcode %}
