---
description: Install the Hiro Chainhooks SDK and register your first chainhook.
---

# Quickstart

## Overview

The Chainhooks SDK provides a TypeScript and JavaScript client for creating, listing, updating, evaluating, and securing chainhooks programmatically.

{% stepper %}
{% step %}
#### Install the SDK

Choose your package manager:

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
{% endstep %}

{% step %}
#### Configure the client

Chainhooks uses Hiro-hosted endpoints and a Hiro API key:

```ts
import { ChainhooksClient, CHAINHOOKS_BASE_URL } from '@hirosystems/chainhooks-client';

const client = new ChainhooksClient({
  baseUrl: CHAINHOOKS_BASE_URL.testnet,
  apiKey: process.env.HIRO_API_KEY!,
});
```

Use `CHAINHOOKS_BASE_URL.mainnet` for production traffic.

| Network | Constant | URL |
| --- | --- | --- |
| Testnet | `CHAINHOOKS_BASE_URL.testnet` | `https://api.testnet.hiro.so` |
| Mainnet | `CHAINHOOKS_BASE_URL.mainnet` | `https://api.mainnet.hiro.so` |
{% endstep %}

{% step %}
#### Register your first chainhook

```ts
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

console.log('Created chainhook:', chainhook.uuid);
```
{% endstep %}

{% step %}
#### Store your API key safely

Get your API key from [Hiro Platform](https://platform.hiro.so), then load it from environment variables instead of hard-coding it into your app.

{% hint style="warning" %}
Never commit API keys to source control. Use environment variables or a secrets manager.
{% endhint %}
{% endstep %}
{% endstepper %}

## SDK methods

| Method | Description |
| --- | --- |
| `registerChainhook()` | Create a new chainhook |
| `getChainhooks()` | List your chainhooks with pagination |
| `getChainhook()` | Fetch a single chainhook by UUID |
| `updateChainhook()` | Modify an existing chainhook |
| `deleteChainhook()` | Remove a chainhook |
| `enableChainhook()` | Enable or disable a single chainhook |
| `bulkEnableChainhooks()` | Enable or disable many chainhooks at once |
| `evaluateChainhook()` | Replay a block against a chainhook |
| `rotateConsumerSecret()` | Rotate the webhook secret used for delivery validation |

## Next steps

- [Create chainhooks](create.md)
- [Fetch chainhooks](fetch.md)
- [Manage consumer secrets](secrets.md)
