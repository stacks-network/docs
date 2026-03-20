---
description: Migrate legacy Hiro Chainhooks definitions to the current event-based format.
---

# Migration Guide

{% hint style="warning" %}
Legacy Chainhooks v1 was deprecated on March 9, 2026. Keep migration work explicit and validate deliveries before removing legacy hooks.
{% endhint %}

## What you'll do

- Inventory your existing v1 chainhooks
- Map predicate-based definitions to the current event-based schema
- Register and validate v2 hooks
- Retire the legacy definitions after parity checks

## Prerequisites

- A Hiro API key with access to the legacy Platform API and current Chainhooks API
- A webhook destination you can inspect during migration
- Optional: `@hirosystems/chainhooks-client` if you want to use the SDK path

{% stepper %}
{% step %}
#### List existing v1 chainhooks

```ts
const response = await fetch(
  `https://api.platform.hiro.so/v1/ext/${process.env.HIRO_API_KEY}/chainhooks`,
  {
    headers: {
      'content-type': 'application/json',
    },
  }
);

const chainhooks = await response.json();
```
{% endstep %}

{% step %}
#### Map the legacy schema to the current schema

| v1 | v2 | Notes |
| --- | --- | --- |
| `if_this.scope` | `filters.events[].type` | Replace scope and action pairs with a concrete event type |
| `if_this.actions` | `type` | For example, `transfer` becomes `*_transfer` |
| `then_that.http_post.url` | `action.url` | Delivery target stays the same |
| `networks.mainnet` | `network: "mainnet"` | Create one hook per network |
| `authorization_header` | Consumer secret | Rotate a consumer secret after registration |

Legacy example:

```json
{
  "name": "stx-transfers",
  "networks": {
    "mainnet": {
      "if_this": { "scope": "stx_event", "actions": ["transfer"] },
      "then_that": { "http_post": { "url": "https://example.com/webhooks" } }
    }
  }
}
```

Current example:

```json
{
  "version": "1",
  "name": "stx-transfers",
  "chain": "stacks",
  "network": "mainnet",
  "filters": {
    "events": [{ "type": "stx_transfer" }]
  },
  "action": {
    "type": "http_post",
    "url": "https://example.com/webhooks"
  },
  "options": {
    "decode_clarity_values": true,
    "enable_on_registration": true
  }
}
```
{% endstep %}

{% step %}
#### Register the new hook

Use either the REST API or the SDK.

{% tabs %}
{% tab title="REST API" %}
```ts
const response = await fetch('https://api.hiro.so/chainhooks/v1/me/', {
  method: 'POST',
  headers: {
    'x-api-key': process.env.HIRO_API_KEY!,
    'content-type': 'application/json',
  },
  body: JSON.stringify(v2Chainhook),
});
```
{% endtab %}
{% tab title="SDK" %}
```ts
import { ChainhooksClient, CHAINHOOKS_BASE_URL } from '@hirosystems/chainhooks-client';

const client = new ChainhooksClient({
  baseUrl: CHAINHOOKS_BASE_URL.mainnet,
  apiKey: process.env.HIRO_API_KEY!,
});

const chainhook = await client.registerChainhook(v2Chainhook);
```
{% endtab %}
{% endtabs %}
{% endstep %}

{% step %}
#### Validate deliveries and retire the legacy hook

Keep both versions active until you confirm delivery parity.

```ts
const chainhook = await client.getChainhook(uuid);
console.log(chainhook.status.enabled);
```

Delete the legacy definition only after the new hook is producing the expected payloads:

```ts
await fetch(
  `https://api.platform.hiro.so/v1/ext/${process.env.HIRO_API_KEY}/chainhooks/${uuid}`,
  {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
    },
  }
);
```
{% endstep %}
{% endstepper %}

## Common mappings

| v1 | Typical actions | Current type |
| --- | --- | --- |
| `stx_event` | `transfer` | `stx_transfer` |
| `contract_call` | n/a | `contract_call` |
| `ft_event` | `transfer` | `ft_transfer` |
| `nft_event` | `transfer`, `mint` | `nft_transfer`, `nft_mint` |

## Replay historical blocks

The current Chainhooks model does not use a start-block field for backfills. Instead, use [evaluate](evaluate.md) to replay specific historical blocks through the same webhook destination.
