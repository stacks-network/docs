---
description: Retrieve chainhook information using the SDK
---

# Fetch chainhooks

{% hint style="info" %}
This page is migrated from the [Hiro documentation](https://docs.hiro.so/en/tools/chainhooks/fetch).
{% endhint %}

## getChainhooks

Retrieve a paginated list of all your chainhooks.

### Example

```typescript
import { ChainhooksClient, CHAINHOOKS_BASE_URL } from '@hirosystems/chainhooks-client';

const client = new ChainhooksClient({
  baseUrl: CHAINHOOKS_BASE_URL.testnet,
  apiKey: process.env.HIRO_API_KEY!,
});

// Get first page (default: 20 results)
const chainhooks = await client.getChainhooks();

console.log('Total chainhooks:', chainhooks.total);
console.log('Results:', chainhooks.results.length);
console.log('Limit:', chainhooks.limit);
console.log('Offset:', chainhooks.offset);
```

### With options

```typescript
// Get specific page with 50 chainhooks starting from position 100
const chainhooks = await client.getChainhooks({
  limit: 50,
  offset: 100,
});
```

---

## getChainhook

Retrieve a specific chainhook by UUID.

### Example

```typescript
const chainhook = await client.getChainhook('be4ab3ed-b606-4fe0-97c4-6c0b1ac9b185');
```

## Next steps

- [Edit & Update](update.md): Modify existing chainhooks
- [Register & Enable](create.md): Create new chainhooks
