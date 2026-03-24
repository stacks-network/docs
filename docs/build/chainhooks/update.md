---
description: Modify existing chainhooks
---

# Edit chainhooks

{% hint style="info" %}
This page is migrated from the [Hiro documentation](https://docs.hiro.so/en/tools/chainhooks/update).
{% endhint %}

{% hint style="info" %}
The Platform UI does not currently support editing chainhooks. You must use the SDK or API to make updates.
{% endhint %}

With `updateChainhook`, you can adjust an existing definition without downtime: change the webhook URL, capture new events, or fine-tune configuration options as requirements evolve.

## updateChainhook

### Basic Update Example

```typescript
import { ChainhooksClient, CHAINHOOKS_BASE_URL } from '@hirosystems/chainhooks-client';

const client = new ChainhooksClient({
  baseUrl: CHAINHOOKS_BASE_URL.testnet,
  apiKey: process.env.HIRO_API_KEY!,
});

await client.updateChainhook('chainhook-uuid', {
  name: 'Updated chainhook name',
  filters: {
    events: [{ type: 'ft_transfer', asset_identifier: 'SP...ABC.token::usdc' }],
  },
});
```

### Add event filter (while preserving existing events)

In order to add a new event filter to an existing chainhook, you can fetch the current definition, modify it, and then update it.

```typescript
// Good: Fetch first
const current = await client.getChainhook(uuid);
await client.updateChainhook('chainhook-uuid', {
  filters: {
    events: [
      ...(current.definition.filters.events ?? []),
      { type: 'contract_call', contract_identifier: 'SP...XYZ.counter' },
    ],
  },
});

// Bad: Will overwrite any existing events
await client.updateChainhook(uuid, {
  filters: { events: { type: 'contract_call', contract_identifier: 'SP...XYZ.counter' } },
});
```

### Update Multiple Fields

```typescript
await client.updateChainhook('chainhook-uuid', {
  name: 'Updated name',
  filters: { events: [{ type: 'stx_transfer', sender: 'SP...SENDER' }] },
  action: { type: 'http_post', url: 'https://new-url.com/webhooks' },
  options: { decode_clarity_values: true },
});

const updated = await client.getChainhook('chainhook-uuid');
console.log('Updated:', updated.definition.name);
```

## Next steps

- [Get chainhooks](fetch.md): Retrieve chainhook information before updating
- [Filter Reference](reference/filters.md): Explore all filter options
