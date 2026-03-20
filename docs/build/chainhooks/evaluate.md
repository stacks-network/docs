---
description: Replay a block against a Hiro Chainhook to debug or backfill payloads.
---

# Evaluate Chainhooks

The evaluate endpoint replays a single block against one of your registered chainhooks so you can test filters and webhook consumers without waiting for live traffic.

## Supported inputs

| Method | Parameter | Example |
| --- | --- | --- |
| By height | `block_height` | `{ block_height: 100000 }` |
| By hash | `index_block_hash` | `{ index_block_hash: '0xa204...' }` |

## Evaluate by block height

```ts
import { ChainhooksClient, CHAINHOOKS_BASE_URL } from '@hirosystems/chainhooks-client';

const client = new ChainhooksClient({
  baseUrl: CHAINHOOKS_BASE_URL.testnet,
  apiKey: process.env.HIRO_API_KEY!,
});

await client.evaluateChainhook('chainhook-uuid', {
  block_height: 100000,
});
```

## Evaluate by block hash

```ts
await client.evaluateChainhook('chainhook-uuid', {
  index_block_hash: '0xa204...',
});
```

Successful evaluation returns HTTP `204 No Content`. If the block matches your filters, Chainhooks delivers the payload to your configured webhook URL.

## Common use cases

| Use case | Description |
| --- | --- |
| Debug | Reproduce a block that should have triggered a delivery |
| Backfill | Replay historical activity after creating a new hook |
| Re-process | Test your webhook consumer after an infrastructure fix |

## Next steps

- [Filter reference](reference/filters.md)
- [Payload anatomy](reference/payload-anatomy.md)
