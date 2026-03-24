---
description: Guide for migrating legacy chainhooks to v2
---

# Migration guide

{% hint style="info" %}
This page is migrated from the [Hiro documentation](https://docs.hiro.so/en/tools/chainhooks/migration).
{% endhint %}

{% hint style="warning" %}
### Deprecation of Chainhooks v1
Legacy v1 chainhooks will be deprecated on March 9th, 2026.
{% endhint %}

## What you'll learn

- Capture and analyze all existing v1 chainhooks.
- Convert predicate-based filters into explicit v2 event definitions.
- Register v2 chainhooks, test delivery, and retire the originals safely.

## Prerequisites

- Hiro API key for access to both the Platform and Chainhooks API.
- (optional) If you use TypeScript and Node.js, you can install the [Chainhooks client library](https://www.npmjs.com/package/@hirosystems/chainhooks-client) to easily parse incoming Chainhooks v2 payloads

{% stepper %}
{% step %}
### Get a list of v1 chainhooks

Use the Platform API to fetch the chainhooks you want to migrate.

```ts
const response = await fetch(`https://api.platform.hiro.so/v1/ext/${process.env.HIRO_API_KEY}/chainhooks`, {
  headers: {
    'content-type': 'application/json'
  }
});

const chainhooks = await response.json();
```
{% endstep %}

{% step %}
### Start mapping to the new v2 format

Translate v1 structures to v2 formats before creating new hooks. The following table shows the mapping between v1 and v2 structures:

| v1 | v2 | Notes |
|------------|-----------|-------|
| `if_this.scope` | `filters.events[].type` | Replace `scope/action` combos with a single event type. |
| `if_this.actions` | `type` | `transfer` maps to `*_transfer`. |
| `then_that.http_post.url` | `action.url` | v2 handles secrets automatically. |
| `networks.mainnet` | `network: "mainnet"` | Create one v2 hook per network. |
| `authorization_header` | Webhook secret management | Use `rotateConsumerSecret()` after registration. |

#### Example

{% tabs %}
{% tab title="Legacy" %}
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
{% endtab %}

{% tab title="v2" %}
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
{% endtab %}
{% endtabs %}

For more details on the format changes, see the [Filters](reference/filters.md) reference guide.
{% endstep %}

{% step %}
### Create v2 chainhooks

Register each chainhook with the SDK or REST API, mirroring the mapped filters.

{% tabs %}
{% tab title="api.ts" %}
```ts
const v2Chainhook = {
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
};

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

{% tab title="sdk.ts" %}
```ts
const client = new ChainhooksClient({
  baseUrl: CHAINHOOKS_BASE_URL.mainnet,
  apiKey: process.env.HIRO_API_KEY!,
});
const chainhook = await client.registerChainhook(
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
);
```
{% endtab %}
{% endtabs %}
{% endstep %}

{% step %}
### Validate and cleanup legacy chainhooks

Stream events through both versions, confirm delivery, then clean up the legacy definitions.

{% hint style="info" %}
### Best practices
Keep both v1 and v2 hooks active until you verify delivery parity.
{% endhint %}

#### Enablement checks on v2

{% tabs %}
{% tab title="api.ts" %}
```ts
const response = await fetch(`https://api.hiro.so/chainhooks/v1/me/${uuid}`, {
  method: 'GET',
  headers: {
    'x-api-key': process.env.HIRO_API_KEY!,
    'content-type': 'application/json',
  },
});

const chainhook = await response.json();
console.log(chainhook.status.enabled);
```
{% endtab %}

{% tab title="sdk.ts" %}
```ts
const chainhook = await client.getChainhook(uuid);
console.log(chainhook.status.enabled);
```
{% endtab %}
{% endtabs %}

#### Delete legacy chainhooks

```ts
const response = await fetch(
  `https://api.platform.hiro.so/v1/ext/${process.env.HIRO_API_KEY}/chainhooks/${uuid}`,{
    method: 'DELETE',
    headers: {
      'content-type': 'application/json'
    }
  }
);

await response.json();
```
{% endstep %}
{% endstepper %}

## Filter reference

### Common scopes

| v1 | Typical Actions | v2 | Extras |
|----------|-----------------|-----------|--------|
| `stx_event` | `transfer` | `stx_transfer` | Include `sender` or `recipient` filters as needed. |
| `contract_call` | n/a | `contract_call` | Add `contract_identifier` and `function_name`. |
| `ft_event` | `transfer` | `ft_transfer` | Specify `asset_identifier`. |
| `nft_event` | `transfer`, `mint` | `nft_transfer` / `nft_mint` | Provide `asset_identifier`. |

For more details, check out the [Filters](reference/filters.md) reference page.

## Replaying past blocks

Chainhooks v2 does not have the ability to specify a **start block** in a hook's configuration for past block scans.

However, you can use the [Replay Block API endpoint](evaluate.md) to request any block replay you need at any time. Once requested, you will receive that block's information through the same webhook payload endpoint you use for real-time updates within a couple seconds.

This method ensures you have complete control over which blocks you need to replay whenever you need to.

## Next steps

- [FAQ](faq.md): Chainhooks 2.0 (Beta) FAQ
- [Filter Reference](reference/filters.md): Filter Reference
