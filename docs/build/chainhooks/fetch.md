---
description: List and fetch Hiro Chainhooks with the SDK.
---

# Fetch Chainhooks

Use the SDK to paginate through your existing hooks or retrieve one hook by UUID.

## List chainhooks

```ts
import { ChainhooksClient, CHAINHOOKS_BASE_URL } from '@hirosystems/chainhooks-client';

const client = new ChainhooksClient({
  baseUrl: CHAINHOOKS_BASE_URL.testnet,
  apiKey: process.env.HIRO_API_KEY!,
});

const chainhooks = await client.getChainhooks();

console.log('Total chainhooks:', chainhooks.total);
console.log('Results:', chainhooks.results.length);
console.log('Limit:', chainhooks.limit);
console.log('Offset:', chainhooks.offset);
```

### Paginate results

```ts
const chainhooks = await client.getChainhooks({
  limit: 50,
  offset: 100,
});
```

## Fetch a single chainhook

```ts
const chainhook = await client.getChainhook('be4ab3ed-b606-4fe0-97c4-6c0b1ac9b185');
```

## Next steps

- [Update chainhooks](update.md)
- [Create chainhooks](create.md)
