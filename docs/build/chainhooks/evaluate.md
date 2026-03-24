---
description: Replay any block height or hash against a chainhook to debug, backfill, or re-process historical events.
---

# Replay a block

{% hint style="info" %}
This page is migrated from the [Hiro documentation](https://docs.hiro.so/en/tools/chainhooks/evaluate).
{% endhint %}

The evaluate endpoint replays any single block you choose—live or historical—against one of your registered chainhooks so you can validate filters without waiting for live traffic. Provide either a block height or block hash to target the exact block you care about.

Use it to reproduce missed deliveries, inspect payload schemas after filter changes, or test webhook infrastructure with known blocks before enabling a hook in production.

## evaluateChainhook

### Evaluation Methods

| Method | Parameter | Example |
|--------|-----------|---------|
| **By height** | `block_height` | `{ block_height: 100000 }` |
| **By hash** | `index_block_hash` | `{ index_block_hash: '0xa204...' }` |

### Example

{% tabs %}
{% tab title="with-block-height.ts" %}
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
{% endtab %}

{% tab title="with-block-hash.ts" %}
```ts
import { ChainhooksClient, CHAINHOOKS_BASE_URL } from '@hirosystems/chainhooks-client';

const client = new ChainhooksClient({
  baseUrl: CHAINHOOKS_BASE_URL.testnet,
  apiKey: process.env.HIRO_API_KEY!,
});

await client.evaluateChainhook('chainhook-uuid', {
  index_block_hash: '0xa204...',
});
```
{% endtab %}
{% endtabs %}

Returns HTTP `204 No Content`. If filters match, webhook payload is sent to your `action.url`.

## Use Cases

| Use Case | Description | Example |
|----------|-------------|---------|
| **Debug** | Investigate missed events | Replay a block height that should have triggered |
| **Backfill** | Index historical data | Process older blocks created before the hook existed |
| **Re-process** | Fix webhook handler issues | Re-evaluate a block after patching infrastructure |

## Next steps

- [Filter Reference](reference/filters.md): Configure which events to match
- [Evaluate endpoint](https://docs.hiro.so/apis/chainhooks-api/reference/chainhooks/evaluate-chainhook): Replay past blocks through the API
