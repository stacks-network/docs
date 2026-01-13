# Network Configuration

Configure and customize Stacks network connections.

## Overview

Stacks.js supports multiple networks—mainnet for production, testnet for development, and custom networks for local testing. Proper network configuration ensures your app connects to the right blockchain instance with optimal settings.

## Basic network setup

Configure standard networks:

```ts
import { STACKS_MAINNET, STACKS_TESTNET, STACKS_DEVNET } from '@stacks/network'

const mainnetApi = STACKS_MAINNET.client.baseUrl;
// https://api.mainnet.hiro.so

const testnetApi = STACKS_TESTNET.client.baseUrl;
// https://api.testnet.hiro.so

const devnetApi = STACKS_DEVNET.client.baseUrl;
// http://localhost:3999
```

## Custom network configuration

Create networks with custom endpoints:

```ts
import { StacksNetwork } from '@stacks/network';

// Custom mainnet configuration
const customMainnet = new StacksMainnet({
  url: 'https://my-custom-node.com',
  fetchFn: fetch, // Custom fetch implementation
});

// Custom testnet with specific endpoints
const customTestnet = new StacksTestnet({
  url: 'https://my-testnet-node.com:3999',
});

// Fully custom network
class CustomNetwork extends StacksNetwork {
  constructor() {
    super({
      url: 'https://custom-stacks-node.com',
      networkType: 'mainnet', // or 'testnet', 'mocknet'
    });
  }

  // Override methods as needed
  getBroadcastApiUrl() {
    return `${this.coreApiUrl}/custom/broadcast`;
  }
}
```

## Environment-based configuration

Manage networks across environments:

```ts
// config/network.ts
import {
  StacksNetwork,
  StacksMainnet,
  StacksTestnet,
  StacksMocknet
} from '@stacks/network';

interface NetworkConfig {
  network: StacksNetwork;
  apiUrl: string;
  wsUrl?: string;
  explorerUrl: string;
  faucetUrl?: string;
}

const configs: Record<string, NetworkConfig> = {
  production: {
    network: new StacksMainnet(),
    apiUrl: 'https://api.hiro.so',
    wsUrl: 'wss://api.hiro.so',
    explorerUrl: 'https://explorer.hiro.so',
  },
  staging: {
    network: new StacksTestnet(),
    apiUrl: 'https://api.testnet.hiro.so',
    wsUrl: 'wss://api.testnet.hiro.so',
    explorerUrl: 'https://explorer.hiro.so/?chain=testnet',
    faucetUrl: 'https://api.testnet.hiro.so/extended/v1/faucets/stx',
  },
  development: {
    network: new StacksMocknet(),
    apiUrl: 'http://localhost:3999',
    explorerUrl: 'http://localhost:8000',
  },
};

export function getNetworkConfig(): NetworkConfig {
  const env = process.env.NODE_ENV || 'development';
  return configs[env];
}

// Usage
const { network, apiUrl } = getNetworkConfig();
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
      return new StacksMainnet();
    case 2147483648: // Testnet
      return new StacksTestnet();
    default:
      throw new Error(`Unknown chain ID: ${chainId}`);
  }
}

// Dynamic network from wallet
async function getNetworkFromWallet(): Promise<StacksNetwork> {
  const userData = userSession.loadUserData();
  const address = userData.profile.stxAddress.testnet;

  // Determine network from address prefix
  if (address.startsWith('SP') || address.startsWith('SM')) {
    return new StacksMainnet();
  } else if (address.startsWith('ST') || address.startsWith('SN')) {
    return new StacksTestnet();
  }

  throw new Error('Unable to determine network from address');
}
```

### Multi-network support

Support multiple networks simultaneously:

```ts
class NetworkManager {
  private networks: Map<string, StacksNetwork> = new Map();
  private currentNetwork: string = 'testnet';

  constructor() {
    this.networks.set('mainnet', new StacksMainnet());
    this.networks.set('testnet', new StacksTestnet());
    this.networks.set('devnet', new StacksMocknet());
  }

  getNetwork(name?: string): StacksNetwork {
    const networkName = name || this.currentNetwork;
    const network = this.networks.get(networkName);

    if (!network) {
      throw new Error(`Unknown network: ${networkName}`);
    }

    return network;
  }

  setCurrentNetwork(name: string): void {
    if (!this.networks.has(name)) {
      throw new Error(`Unknown network: ${name}`);
    }
    this.currentNetwork = name;
  }

  addCustomNetwork(name: string, url: string): void {
    const network = new StacksNetwork({ url });
    this.networks.set(name, network);
  }
}

// Usage
const manager = new NetworkManager();
const mainnet = manager.getNetwork('mainnet');
manager.setCurrentNetwork('mainnet');
```

## Network connection monitoring

Monitor network health and status:

```ts
class NetworkMonitor {
  private network: StacksNetwork;
  private isHealthy = true;
  private listeners: Set<(healthy: boolean) => void> = new Set();

  constructor(network: StacksNetwork) {
    this.network = network;
    this.startMonitoring();
  }

  private async startMonitoring() {
    setInterval(async () => {
      try {
        const response = await fetch(
          `${this.network.coreApiUrl}/v2/info`,
          { signal: AbortSignal.timeout(5000) }
        );

        const wasHealthy = this.isHealthy;
        this.isHealthy = response.ok;

        if (wasHealthy !== this.isHealthy) {
          this.notifyListeners();
        }
      } catch (error) {
        const wasHealthy = this.isHealthy;
        this.isHealthy = false;

        if (wasHealthy) {
          this.notifyListeners();
        }
      }
    }, 30000); // Check every 30 seconds
  }

  onHealthChange(callback: (healthy: boolean) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners() {
    this.listeners.forEach(callback => callback(this.isHealthy));
  }

  async waitForHealth(timeout = 60000): Promise<void> {
    const start = Date.now();

    while (!this.isHealthy && Date.now() - start < timeout) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    if (!this.isHealthy) {
      throw new Error('Network unhealthy after timeout');
    }
  }
}
```

## WebSocket configuration

Set up real-time connections:

```ts
interface WebSocketConfig {
  url: string;
  reconnectInterval: number;
  maxReconnectAttempts: number;
}

class StacksWebSocketClient {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private reconnectAttempts = 0;

  constructor(network: StacksNetwork) {
    this.config = {
      url: this.getWebSocketUrl(network),
      reconnectInterval: 5000,
      maxReconnectAttempts: 10,
    };
  }

  private getWebSocketUrl(network: StacksNetwork): string {
    const apiUrl = network.coreApiUrl;
    return apiUrl.replace('https://', 'wss://').replace('http://', 'ws://');
  }

  connect(): void {
    this.ws = new WebSocket(this.config.url);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.ws.onclose = () => {
      this.handleReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.config.maxReconnectAttempts) {
      setTimeout(() => {
        this.reconnectAttempts++;
        this.connect();
      }, this.config.reconnectInterval);
    }
  }

  subscribe(event: string, callback: (data: any) => void): void {
    if (!this.ws) throw new Error('WebSocket not connected');

    this.ws.send(JSON.stringify({
      method: 'subscribe',
      params: { event }
    }));

    this.ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.event === event) {
        callback(data);
      }
    };
  }
}
```

## Testing with different networks

Set up tests across networks:

```ts
import { describe, it, beforeEach } from 'vitest';

describe('Cross-network tests', () => {
  const networks = [
    { name: 'mainnet', network: new StacksMainnet() },
    { name: 'testnet', network: new StacksTestnet() },
  ];

  networks.forEach(({ name, network }) => {
    describe(`${name} tests`, () => {
      it('should connect to network', async () => {
        const response = await fetch(`${network.coreApiUrl}/v2/info`);
        expect(response.ok).toBe(true);
      });

      it('should have correct chain ID', async () => {
        const response = await fetch(`${network.coreApiUrl}/v2/info`);
        const info = await response.json();

        if (name === 'mainnet') {
          expect(info.network_id).toBe(1);
        } else {
          expect(info.network_id).toBe(2147483648);
        }
      });
    });
  });
});
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
