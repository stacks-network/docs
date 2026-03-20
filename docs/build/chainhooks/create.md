---
description: Create, enable, and bulk-manage Hiro Chainhooks with the SDK.
---

# Create Chainhooks

New chainhooks are created in a disabled state unless you set `enable_on_registration` to `true`.

## Register a chainhook

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

console.log('Chainhook UUID:', chainhook.uuid);
console.log('Enabled:', chainhook.status.enabled);
```

## Enable or disable a single chainhook

```ts
await client.enableChainhook('chainhook-uuid', true);
await client.enableChainhook('chainhook-uuid', false);
```

Successful enablement updates return HTTP `204 No Content`.

## Bulk enable or disable chainhooks

### By UUID

```ts
await client.bulkEnableChainhooks({
  enabled: true,
  filters: {
    uuids: ['uuid-1', 'uuid-2', 'uuid-3'],
  },
});
```

### By webhook URL

```ts
await client.bulkEnableChainhooks({
  enabled: true,
  filters: {
    webhook_url: 'https://example.com/webhooks',
  },
});
```

### By status

```ts
await client.bulkEnableChainhooks({
  enabled: true,
  filters: {
    statuses: ['inactive'],
  },
});
```

### Combined filters

```ts
await client.bulkEnableChainhooks({
  enabled: false,
  filters: {
    webhook_url: 'https://old-server.com/webhooks',
    statuses: ['active'],
  },
});
```

## Next steps

- [Evaluate chainhooks](evaluate.md)
- [Filter reference](reference/filters.md)
