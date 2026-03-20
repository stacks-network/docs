# Response Headers

Hiro-hosted APIs return response headers that help you inspect rate limits, remaining quota, and retry timing.

## Standard rate limit headers

The following headers may be returned with API responses:

```bash
curl -I https://api.hiro.so/extended/v1/info \
  -H 'x-api-key: YOUR_API_KEY'
```

| Header | Description |
| --- | --- |
| `ratelimit-limit` | The limit for the current window |
| `ratelimit-remaining` | Requests remaining in the current window |
| `ratelimit-reset` | When the current window resets |
| `retry-after` | How long to wait before retrying after rate limiting |

## Stacks service headers

Stacks-focused Hiro APIs can also return service-specific quota headers:

```typescript
const response = await fetch(
  'https://api.hiro.so/extended/v1/address/SP318Q55DEKHRXJK696033DQN5C54D9K2EE6DHRWP/assets',
  {
    headers: { 'x-api-key': apiKey },
  }
);

console.log(response.headers.get('x-ratelimit-cost-stacks'));
```

| Header | Description |
| --- | --- |
| `x-ratelimit-cost-stacks` | Quota cost for the request |
| `x-ratelimit-limit-stacks-second` | Per-second limit for Stacks services |
| `x-ratelimit-remaining-stacks-second` | Remaining requests this second |
| `x-ratelimit-limit-stacks-minute` | Per-minute limit for Stacks services |
| `x-ratelimit-remaining-stacks-minute` | Remaining requests this minute |
| `x-ratelimit-limit-stacks-month` | Monthly limit for Stacks services |
| `x-ratelimit-remaining-stacks-month` | Remaining requests this month |

{% hint style="info" %}
Exact header sets can vary by product. Use the headers returned by the API you are calling as the source of truth.
{% endhint %}

## Using these headers

- Log rate limit headers in your backend so you can detect sustained pressure before you hit hard limits.
- Back off when `ratelimit-remaining` reaches zero or when the response includes `retry-after`.
- Monitor `x-ratelimit-cost-stacks` for requests that consume more than one unit of quota.

See also [Rate Limits](rate-limits.md) and [API Keys](api-keys.md).
