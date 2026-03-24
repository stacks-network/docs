# Usage

Learn how to authenticate, make requests, and handle responses with the Chainhooks API.

{% hint style="info" %}
This page is migrated from the [Hiro documentation](https://docs.hiro.so/en/apis/chainhooks-api/usage).
{% endhint %}

## Authentication

All Chainhooks API requests require authentication using a Hiro API key.

### Get Your API Key

1. Visit [platform.hiro.so](https://platform.hiro.so)
2. Sign in or create an account
3. Navigate to API Keys
4. Generate or copy your API key

### Using Your API Key

Include your API key in the `x-api-key` header for all requests:

```bash
curl https://api.testnet.hiro.so/chainhooks/v1/me/ \
  -H "x-api-key: YOUR_API_KEY"
```

**Security best practices:**
- Store API keys in environment variables, never in code
- Use different keys for development and production
- Rotate keys periodically
- Never commit keys to version control

## Base URLs

Use the appropriate base URL for your environment:

```
Testnet: https://api.testnet.hiro.so/chainhooks/v1
Mainnet: https://api.mainnet.hiro.so/chainhooks/v1
```

**Always test on testnet first** before deploying to mainnet.

## Request Format

### Headers

All requests should include:

```http
Content-Type: application/json
x-api-key: YOUR_API_KEY
```

### Request Body

Most endpoints accept JSON request bodies. Example for registering a chainhook:

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
      "events": [{
        "type": "stx_transfer",
        "sender": "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"
      }]
    },
    "action": {
      "type": "http_post",
      "url": "https://example.com/webhooks"
    }
  }'
```

## Response Format

### Success Responses

Successful responses return JSON with relevant data:

```json
{
  "uuid": "123e4567-e89b-12d3-a456-426614174000",
  "definition": {
    "name": "my-chainhook",
    "version": "1",
    "chain": "stacks",
    "network": "testnet",
    ...
  },
  "status": {
    "status": "new",
    "enabled": false,
    "created_at": 1234567890,
    ...
  }
}
```

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request succeeded, response body contains data |
| 204 | No Content | Request succeeded, no response body |
| 400 | Bad Request | Invalid request format or parameters |
| 401 | Unauthorized | Missing or invalid API key |
| 404 | Not Found | Chainhook UUID not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Internal server error |

### Error Responses

Error responses include details about what went wrong:

```json
{
  "error": "Invalid request body",
  "details": "filters.events is required"
}
```

## Common Patterns

### List All Chainhooks

```bash
curl https://api.testnet.hiro.so/chainhooks/v1/me/ \
  -H "x-api-key: YOUR_API_KEY"
```

### Get a chainhook

```bash
curl https://api.testnet.hiro.so/chainhooks/v1/me/{uuid} \
  -H "x-api-key: YOUR_API_KEY"
```

### Enable a Chainhook

```bash
curl -X PATCH https://api.testnet.hiro.so/chainhooks/v1/me/{uuid}/enabled \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"enabled": true}'
```

### Delete a Chainhook

```bash
curl -X DELETE https://api.testnet.hiro.so/chainhooks/v1/me/{uuid} \
  -H "x-api-key: YOUR_API_KEY"
```

### Evaluate Against a Block

Test your chainhook against a specific block:

```bash
curl -X POST https://api.testnet.hiro.so/chainhooks/v1/me/{uuid}/evaluate \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"block_height": 150000}'
```

### Bulk Enable/Disable

Enable or disable multiple chainhooks matching filters:

```bash
curl -X PATCH https://api.testnet.hiro.so/chainhooks/v1/me/enabled \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "enabled": false,
    "filters": {
      "webhook_url": "https://old-endpoint.com/webhooks"
    }
  }'
```

## Rate Limits

The Chainhooks API enforces rate limits based on your subscription tier:

- Free tier: 100 requests per minute
- Pro tier: 1000 requests per minute
- Enterprise: Custom limits

When rate limited, you'll receive a `429 Too Many Requests` response. Implement exponential backoff in your application:

```javascript
async function makeRequestWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(url, options);

    if (response.status === 429) {
      const delay = Math.pow(2, i) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      continue;
    }

    return response;
  }

  throw new Error('Max retries exceeded');
}
```

## Webhook Security

### Consumer Secret

When you register a chainhook, webhook payloads include an `x-chainhook-consumer-secret` header. Validate this secret in your webhook endpoint:

```javascript
app.post('/webhooks', (req, res) => {
  const receivedSecret = req.headers['x-chainhook-consumer-secret'];
  const expectedSecret = process.env.CHAINHOOK_CONSUMER_SECRET;

  if (receivedSecret !== expectedSecret) {
    return res.status(401).send('Unauthorized');
  }

  // Process webhook payload
  res.sendStatus(200);
});
```

### Rotate Secret

Periodically rotate your consumer secret:

```bash
curl -X POST https://api.testnet.hiro.so/chainhooks/v1/me/secret \
  -H "x-api-key: YOUR_API_KEY"
```

Store the new secret securely and update your webhook endpoint.

## Best Practices

1. **Start on testnet** - Always test chainhooks on testnet before mainnet
2. **Enable gradually** - Create chainhooks disabled, test with `evaluate`, then enable
3. **Handle errors** - Implement proper error handling and retries
4. **Validate webhooks** - Always verify the consumer secret header
5. **Use HTTPS** - Webhook URLs must use HTTPS for security
6. **Monitor usage** - Track API usage to stay within rate limits
7. **Version control** - Document your chainhook configurations
8. **Clean up** - Delete unused chainhooks to reduce costs

## Pagination

List endpoints support pagination via query parameters:

```bash
# Get first page (default: 20 results)
curl "https://api.testnet.hiro.so/chainhooks/v1/me/?limit=20&offset=0" \
  -H "x-api-key: YOUR_API_KEY"

# Get next page
curl "https://api.testnet.hiro.so/chainhooks/v1/me/?limit=20&offset=20" \
  -H "x-api-key: YOUR_API_KEY"
```

Response includes pagination metadata:

```json
{
  "limit": 20,
  "offset": 0,
  "total": 45,
  "results": [...]
}
```

## Next Steps

- [API Reference](https://docs.hiro.so/en/apis/chainhooks-api/reference/chainhooks): Complete endpoint documentation
- [Filter Reference](https://docs.hiro.so/en/tools/chainhooks/reference/filters): Event filter syntax
