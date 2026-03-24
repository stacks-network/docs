---
description: TypeScript/JavaScript SDK for managing chainhooks programmatically
---

# Introduction

{% hint style="info" %}
This page is migrated from the [Hiro documentation](https://docs.hiro.so/en/tools/chainhooks/introduction).
{% endhint %}

## Overview

The Chainhooks SDK (`@hirosystems/chainhooks-client`) provides a TypeScript/JavaScript client for programmatically managing chainhooks.

## Installation

{% tabs %}
{% tab title="npm" %}
```bash
npm install @hirosystems/chainhooks-client
```
{% endtab %}

{% tab title="yarn" %}
```bash
yarn add @hirosystems/chainhooks-client
```
{% endtab %}

{% tab title="pnpm" %}
```bash
pnpm add @hirosystems/chainhooks-client
```
{% endtab %}

{% tab title="bun" %}
```bash
bun add @hirosystems/chainhooks-client
```
{% endtab %}
{% endtabs %}

## Quick Example

```typescript
import { ChainhooksClient, CHAINHOOKS_BASE_URL } from '@hirosystems/chainhooks-client';

const client = new ChainhooksClient({
  baseUrl: CHAINHOOKS_BASE_URL.testnet, // or CHAINHOOKS_BASE_URL.mainnet
  apiKey: process.env.HIRO_API_KEY!,
});

// Register and enable a chainhook
const chainhook = await client.registerChainhook({
  version: '1',
  name: 'my-first-chainhook',
  chain: 'stacks',
  network: 'testnet',
  filters: {
    events: [
      {
        type: 'contract_call',
        contract_identifier: 'SP...XYZ.counter',
        function_name: 'increment',
      },
    ],
  },
  action: {
    type: 'http_post',
    url: 'https://example.com/webhooks',
  },
  options: {
    decode_clarity_values: true,
    enable_on_registration: true,
  },
});

console.log('Chainhooks created:', chainhook.uuid);
```

## Base URLs

The SDK provides network-specific constants:

| Network | Constant | URL |
|---------|----------|-----|
| Testnet | `CHAINHOOKS_BASE_URL.testnet` | https://api.testnet.hiro.so |
| Mainnet | `CHAINHOOKS_BASE_URL.mainnet` | https://api.mainnet.hiro.so |

```typescript
import { CHAINHOOKS_BASE_URL } from '@hirosystems/chainhooks-client';

// Testnet (for development)
const testnetClient = new ChainhooksClient({
  baseUrl: CHAINHOOKS_BASE_URL.testnet,
  apiKey: process.env.HIRO_API_KEY!,
});

// Mainnet (for production)
const mainnetClient = new ChainhooksClient({
  baseUrl: CHAINHOOKS_BASE_URL.mainnet,
  apiKey: process.env.HIRO_API_KEY!,
});
```

## Authentication

### Get Your API Key

1. Visit [platform.hiro.so](https://platform.hiro.so)
2. Sign in or create an account
3. Navigate to API Keys section
4. Generate or copy your API key

### Configure Client

```typescript
const client = new ChainhooksClient({
  baseUrl: CHAINHOOKS_BASE_URL.testnet,
  apiKey: process.env.HIRO_API_KEY!, // Store securely in environment variables
});
```

{% hint style="warning" %}
### API keys
Never commit API keys to version control. Always use environment variables or secure secret management.
{% endhint %}

## SDK Methods

The SDK provides the following methods:

### Core Methods

| Method | Description |
|--------|-------------|
| `registerChainhook()` | Create a new chainhook |
| `getChainhooks()` | List all your chainhooks (with pagination) |
| `getChainhook()` | Get a chainhook by UUID |
| `updateChainhook()` | Update an existing chainhook |
| `deleteChainhook()` | Delete a chainhook |

### Activation Methods

| Method | Description |
|--------|-------------|
| `enableChainhook()` | Enable or disable a single chainhook |
| `bulkEnableChainhooks()` | Enable or disable multiple chainhooks with filters |

### Utility Methods

| Method | Description |
|--------|-------------|
| `evaluateChainhook()` | Evaluate a chainhook against specific past blocks |
| `rotateConsumerSecret()` | Rotate the webhook secret for payload verification |

## TypeScript Support

### Available Types

The SDK provides full TypeScript type definitions:

```typescript
import type {
  ChainhookDefinitionSchema,      // Chainhooks configuration
  ChainhookStatusSchema,           // Status and activity info
  EvaluateChainhookRequest,        // Evaluation parameters
  BulkEnableChainhooksRequest,     // Bulk operation filters
} from '@hirosystems/chainhooks-client';
```

## Next Steps

- [Create chainhooks](create.md): Create and activate chainhooks
- [Manage consumer secrets](secrets.md): Learn how to validate Chainhooks delivery
