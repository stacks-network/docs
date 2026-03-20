# Usage

The Signer Metrics API follows standard REST conventions over HTTPS.

## Base URL

```text
https://api.hiro.so
```

## Making requests

Fetch signer participation data for a reward cycle:

```bash
curl -L 'https://api.hiro.so/signer-metrics/v1/cycles/95/signers' \
  -H 'Accept: application/json'
```

For authenticated traffic, add your Hiro API key:

```bash
curl -L 'https://api.hiro.so/signer-metrics/v1/cycles/95/signers' \
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

- Use [Response Headers](../response-headers.md) to inspect rate limit information.
- For signer host monitoring, pair this API with the Grafana-based guide in the Operate docs.
