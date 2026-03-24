---
description: Create and activate chainhooks using the Chainhooks SDK
---

# Create chainhooks

{% hint style="info" %}
This page is migrated from the [Hiro documentation](https://docs.hiro.so/en/tools/chainhooks/create).
{% endhint %}

Creates a new chainhook configuration. By default, new chainhooks are created in a disabled state unless `enable_on_registration` is set to `true`.

## registerChainhook

### Example

```ts
import { ChainhooksClient, CHAINHOOKS_BASE_URL } from '@hirosystems/chainhooks-client';

const client = new ChainhooksClient({
  baseUrl: CHAINHOOKS_BASE_URL.testnet,
  apiKey: process.env.HIRO_API_KEY!,
});

const chainhook = await client.registerChainhook({
  version: '1',
  name: 'my-chainhook',
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

console.log('Chainhooks UUID:', chainhook.uuid);
console.log('Enabled:', chainhook.status.enabled); // true
```

If you don't set `enable_on_registration`, the chainhook will be created but disabled by default.

---

## enableChainhook

Enable or disable a single chainhook by UUID. This allows you to enable chainhooks after registration or pause without deleting it.

### Examples

```typescript
// Enable a chainhook
await client.enableChainhook('chainhook-uuid', true);

// Disable a chainhook
await client.enableChainhook('chainhook-uuid', false);
```

Returns HTTP `204 No Content` on success.

---

## bulkEnableChainhooks

Enable or disable multiple chainhooks at once using filters. This is useful for managing many chainhooks programmatically.

### By UUIDs

Enable specific chainhooks by their UUIDs (maximum 200):

```typescript
await client.bulkEnableChainhooks({
  enabled: true,
  filters: {
    uuids: [
      'uuid-1',
      'uuid-2',
      'uuid-3',
    ],
  },
});
```

### By Webhook URL

Enable all chainhooks that POST to a specific URL:

```typescript
await client.bulkEnableChainhooks({
  enabled: true,
  filters: {
    webhook_url: 'https://example.com/webhooks',
  },
});
```

### By Status

Enable all chainhooks with a specific status:

```typescript
await client.bulkEnableChainhooks({
  enabled: true,
  filters: {
    statuses: ['inactive'],
  },
});
```

### Combined Filters

Use multiple filters together:

```typescript
await client.bulkEnableChainhooks({
  enabled: false, // Disable matching chainhooks
  filters: {
    webhook_url: 'https://old-server.com/webhooks',
    statuses: ['active'],
  },
});
```

This will disable all active chainhooks that POST to the old webhook URL.

## Next steps

- [Evaluate](evaluate.md): Test chainhooks against past blocks
- [Filter Reference](reference/filters.md): Explore all filter options
