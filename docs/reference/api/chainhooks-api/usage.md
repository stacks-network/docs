# Usage

The Chainhooks API uses standard HTTPS JSON requests and requires a Hiro API key on every request.

## Authentication

Create or manage your API keys in [Hiro Platform](https://platform.hiro.so/), then send the key in the `x-api-key` header:

```bash
curl https://api.testnet.hiro.so/chainhooks/v1/me/ \
  -H "x-api-key: YOUR_API_KEY"
```

For broader key-management guidance, see [API Keys](../api-keys.md).

## Base URLs

```text
Testnet: https://api.testnet.hiro.so/chainhooks/v1
Mainnet: https://api.mainnet.hiro.so/chainhooks/v1
```

Test on testnet first, then promote the same workflow to mainnet once your filters and webhook handling are stable.

## Request conventions

Most endpoints accept JSON request bodies and expect these headers:

```http
Content-Type: application/json
x-api-key: YOUR_API_KEY
```

Example: create a Chainhook for Stacks token transfer events.

```bash
curl -X POST https://api.testnet.hiro.so/chainhooks/v1/me/ \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-chainhook",
    "version": "1",
    "chain": "stacks",
    "network": "testnet",
    "filters": {
      "events": [
        {
          "type": "stx_transfer",
          "sender": "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"
        }
      ]
    },
    "action": {
      "type": "http_post",
      "url": "https://example.com/webhooks"
    }
  }'
```

## Common operations

List all Chainhooks:

```bash
curl https://api.testnet.hiro.so/chainhooks/v1/me/ \
  -H "x-api-key: YOUR_API_KEY"
```

Fetch a single Chainhook:

```bash
curl https://api.testnet.hiro.so/chainhooks/v1/me/{uuid} \
  -H "x-api-key: YOUR_API_KEY"
```

Enable a Chainhook:

```bash
curl -X PATCH https://api.testnet.hiro.so/chainhooks/v1/me/{uuid}/enabled \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"enabled": true}'
```

Evaluate a Chainhook against historical data before enabling it:

```bash
curl -X POST https://api.testnet.hiro.so/chainhooks/v1/me/{uuid}/evaluate \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"block_height": 150000}'
```

Delete a Chainhook:

```bash
curl -X DELETE https://api.testnet.hiro.so/chainhooks/v1/me/{uuid} \
  -H "x-api-key: YOUR_API_KEY"
```

## Response codes

| Code | Meaning |
| --- | --- |
| `200` | Request succeeded |
| `204` | Request succeeded without a response body |
| `400` | Invalid request body or parameters |
| `401` | Missing or invalid API key |
| `404` | The requested Chainhook was not found |
| `429` | Rate limit exceeded |
| `5xx` | Server-side error |

Inspect the response headers described in [Response Headers](../response-headers.md) and apply retry logic when you receive `429` responses.

## Webhook security

Webhook payloads include an `x-chainhook-consumer-secret` header. Validate that value in your webhook consumer before processing the payload:

```javascript
app.post('/webhooks', (req, res) => {
  const receivedSecret = req.headers['x-chainhook-consumer-secret'];
  const expectedSecret = process.env.CHAINHOOK_CONSUMER_SECRET;

  if (receivedSecret !== expectedSecret) {
    return res.status(401).send('Unauthorized');
  }

  res.sendStatus(200);
});
```

Rotate the secret periodically and store it server-side only.

## Operational guidance

- Start on testnet before enabling production webhooks.
- Create Chainhooks in a disabled state, evaluate them, then enable them.
- Retry `429` and transient `5xx` responses with backoff.
- Use HTTPS webhook endpoints and verify the consumer secret on every delivery.
