# Network Configuration

Configure and customize Stacks network connections.

## Overview

Stacks.js supports multiple networks—mainnet for production, testnet for development, and custom networks for local testing. Proper network configuration ensures your app connects to the right blockchain instance with optimal settings.

## Basic network setup

Configure standard networks:

```ts
import { STACKS_MAINNET, STACKS_TESTNET, STACKS_DEVNET } from '@stacks/network'

console.log(STACKS_MAINNET)
{
  chainId: 1,
  transactionVersion: 0,
  peerNetworkId: 385875968,
  magicBytes: 'X2',
  bootAddress: 'SP000000000000000000002Q6VF78',
  addressVersion: { singleSig: 22, multiSig: 20 },
  client: { baseUrl: 'https://api.mainnet.hiro.so' }
}

console.log(STACKS_TESTNET)
{
  chainId: 2147483648,
  transactionVersion: 128,
  peerNetworkId: 4278190080,
  magicBytes: 'T2',
  bootAddress: 'ST000000000000000000002AMW42H',
  addressVersion: { singleSig: 26, multiSig: 21 },
  client: { baseUrl: 'https://api.testnet.hiro.so' }
}

console.log(STACKS_DEVNET)
{
  chainId: 2147483648,
  transactionVersion: 128,
  peerNetworkId: 4278190080,
  magicBytes: 'id',
  bootAddress: 'ST000000000000000000002AMW42H',
  addressVersion: { singleSig: 26, multiSig: 21 },
  client: { baseUrl: 'http://localhost:3999' }
}
```

## Custom network configuration

Create a network with an API key:

```typescript
import { createNetwork } from '@stacks/network'

// Create a network with options object
const network = createNetwork({
  network: 'mainnet',
  apiKey: 'my-api-key',
});
```

Create networks with custom node URLs and middleware:

```ts
import { createNetwork } from '@stacks/network'
import { createApiKeyMiddleware, createFetchFn, FetchMiddleware } from '@stacks/common'

let loggingMiddleware: FetchMiddleware = {
  pre: (context) => {
    console.log('Before request:', context);
    // Optionally modify the request
    return { ... }
  },
  post: async (context) => {
    console.log('After request:', context.response.status);
    // Optionally modify the response
    return { ... }
  }
};

let apiKeyMiddleware = createApiKeyMiddleware({
    apiKey: 'YOUR-API-KEY',
})

let customFetchFn = createFetchFn(apiKeyMiddleware, loggingMiddleware)

// Pass your customNetwork into any function that accepts a `network` param
export const customNetwork = createNetwork(
    {
        network: 'mainnet',
        client: {
            baseUrl: 'https://my-custom-mainnet-node',
            fetch: customFetchFn
        }
    }
)
```

## Environment-based configuration

Manage networks across environments:

```ts
// config/network.ts
import {
  StacksNetwork,
  STACKS_MAINNET,
  STACKS_TESTNET,
  STACKS_DEVNET,
} from '@stacks/network';

interface NetworkConfig {
  network: StacksNetwork;
  explorerUrl: string;
  faucetUrl?: string;
}

const configs: Record<string, NetworkConfig> = {
  production: {
    network: STACKS_MAINNET,
    explorerUrl: 'https://explorer.stacks.co',
  },
  staging: {
    network: STACKS_TESTNET,
    explorerUrl: 'https://explorer.stacks.co/?chain=testnet',
    faucetUrl: 'https://api.testnet.hiro.so/extended/v1/faucets/stx',
  },
  development: {
    network: STACKS_DEVNET,
    explorerUrl: 'http://localhost:8000',
  },
};

export function getNetworkConfig(): NetworkConfig {
  const env = process.env.NODE_ENV || 'development';
  return configs[env];
}

// Usage
const { network } = getNetworkConfig();
```

## Network detection and validation

Detect and validate network connections:

```ts
async function detectNetwork(url: string): Promise<'mainnet' | 'testnet' | 'unknown'> {
  try {
    const response = await fetch(`${url}/v2/info`);
    const info = await response.json();

    // Check network ID
    if (info.network_id === 1) {
      return 'mainnet';
    } else if (info.network_id === 2147483648) {
      return 'testnet';
    }

    return 'unknown';
  } catch (error) {
    console.error('Failed to detect network:', error);
    return 'unknown';
  }
}

// Validate network matches expectation
async function validateNetwork(
  network: StacksNetwork,
  expected: 'mainnet' | 'testnet'
): Promise<boolean> {
  const detected = await detectNetwork(network.coreApiUrl);

  if (detected !== expected) {
    console.warn(`Network mismatch! Expected ${expected}, got ${detected}`);
    return false;
  }

  return true;
}
```

## Advanced network features

### Custom headers and authentication

Add authentication or custom headers:

```ts
class AuthenticatedNetwork extends StacksMainnet {
  private apiKey: string;

  constructor(apiKey: string) {
    super();
    this.apiKey = apiKey;
  }

  createFetchFn(): FetchFn {
    return (url: string, init?: RequestInit) => {
      const headers = {
        ...init?.headers,
        'x-api-key': this.apiKey,
        'x-client-version': '1.0.0',
      };

      return fetch(url, { ...init, headers });
    };
  }
}

// Usage
const network = new AuthenticatedNetwork(process.env.API_KEY!);
```

### Request retry and timeout

Implement resilient network requests:

```ts
class ResilientNetwork extends StacksTestnet {
  private maxRetries = 3;
  private timeout = 30000; // 30 seconds

  createFetchFn(): FetchFn {
    return async (url: string, init?: RequestInit) => {
      for (let attempt = 0; attempt < this.maxRetries; attempt++) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), this.timeout);

          const response = await fetch(url, {
            ...init,
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (!response.ok && attempt < this.maxRetries - 1) {
            // Retry on server errors
            if (response.status >= 500) {
              await this.delay(1000 * Math.pow(2, attempt));
              continue;
            }
          }

          return response;
        } catch (error) {
          if (attempt === this.maxRetries - 1) throw error;
          await this.delay(1000 * Math.pow(2, attempt));
        }
      }

      throw new Error('Max retries exceeded');
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

## Network-specific configurations

### Configure by chain ID

Set up network based on chain identifier:

```ts
function getNetworkByChainId(chainId: number): StacksNetwork {
  switch (chainId) {
    case 1: // Mainnet
      return STACKS_MAINNET;
    case 2147483648: // Testnet
      return STACKS_TESTNET;
    default:
      throw new Error(`Unknown chain ID: ${chainId}`);
  }
}
```

## Best practices

* Use environment variables: Never hardcode network URLs
* Implement retry logic: Networks can be temporarily unavailable
* Monitor connection health: Detect and handle network issues
* Cache network info: Reduce redundant API calls
* Validate network type: Ensure you're on the expected network

## Common issues

<details>

<summary>CORS errors</summary>

```ts
// Configure proxy for development
const devNetwork = new StacksTestnet({
  url: '/api', // Proxy through your dev server
});

// Or use CORS-enabled endpoints
const corsNetwork = new StacksTestnet({
  url: 'https://api.testnet.hiro.so',
});
```

</details>

<details>

<summary>Timeout handling</summary>

```ts
// Add timeout to all requests
class TimeoutNetwork extends StacksMainnet {
  async fetchWithTimeout(url: string, timeout = 30000): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw new Error(`Request timeout: ${url}`);
    }
  }
}
```

</details>
