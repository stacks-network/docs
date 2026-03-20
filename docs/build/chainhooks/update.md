---
description: Update Hiro Chainhooks without recreating them.
---

# Update Chainhooks

Use `updateChainhook()` to adjust filters, webhook destinations, and options without replacing the hook.

{% hint style="info" %}
This flow is documented from the SDK side. If you need the underlying API operations, use the Hiro Chainhooks API reference in the Stacks docs `reference` space.
{% endhint %}

## Basic update

```ts
import { ChainhooksClient, CHAINHOOKS_BASE_URL } from '@hirosystems/chainhooks-client';

const client = new ChainhooksClient({
  baseUrl: CHAINHOOKS_BASE_URL.testnet,
  apiKey: process.env.HIRO_API_KEY!,
});

await client.updateChainhook('chainhook-uuid', {
  name: 'updated-chainhook-name',
  filters: {
    events: [{ type: 'ft_transfer', asset_identifier: 'SP...ABC.token::usdc' }],
  },
});
```

## Add an event filter safely

Fetch the current definition first so you do not accidentally overwrite existing filters:

```ts
const current = await client.getChainhook(uuid);

await client.updateChainhook(uuid, {
  filters: {
    events: [
      ...(current.definition.filters.events ?? []),
      { type: 'contract_call', contract_identifier: 'SP...XYZ.counter' },
    ],
  },
});
```

## Update multiple fields

```ts
await client.updateChainhook('chainhook-uuid', {
  name: 'updated-name',
  filters: { events: [{ type: 'stx_transfer', sender: 'SP...SENDER' }] },
  action: { type: 'http_post', url: 'https://new-url.com/webhooks' },
  options: { decode_clarity_values: true },
});
```

## Next steps

- [Fetch chainhooks](fetch.md)
- [Filter reference](reference/filters.md)
