# Usage

The Token Metadata API follows standard REST conventions over HTTPS.

## Base URL

```text
https://api.hiro.so
```

## Making requests

Fetch fungible token metadata:

```bash
curl -L 'https://api.hiro.so/metadata/v1/ft' \
  -H 'Accept: application/json'
```

Many integrations can start without an API key. For production traffic and higher quotas, send your Hiro API key in the `x-api-key` header:

```bash
curl -L 'https://api.hiro.so/metadata/v1/ft' \
  -H 'Accept: application/json' \
  -H 'x-api-key: YOUR_API_KEY'
```

For more detail on key management and quotas, see [API Keys](../api-keys.md) and [Rate Limits](../rate-limits.md).

## Response codes

| Code | Meaning |
| --- | --- |
| `200` | Successful request |
| `400` | Invalid parameters |
| `401` | Missing API key where required |
| `403` | Invalid API key |
| `404` | Resource not found |
| `429` | Rate limit exceeded |
| `5xx` | Server-side error |

## Related guidance

- Use [Response Headers](../response-headers.md) to inspect remaining quota.
- If your token metadata changes over time, emit SIP-019 update notifications from your contract so downstream indexers can refresh cached metadata.
