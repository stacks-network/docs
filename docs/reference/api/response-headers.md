# Response Headers

{% hint style="info" %}
These response headers apply to Hiro-hosted API endpoints. Self-hosted nodes may return different headers.
{% endhint %}

{% hint style="info" %}
**Source:** This page is adapted from the [Hiro documentation](https://docs.hiro.so/resources/guides/response-headers). Hiro is a developer tooling company that provides hosted API services for the Stacks ecosystem.
{% endhint %}

All Hiro APIs return response headers that provide important information about rate limits and usage quotas. These headers are separated by service type (Stacks vs Bitcoin) to provide more granular control over API usage.

The following headers are returned with every API response:

```terminal
$ curl -I https://api.hiro.so/extended/v1/info -H 'x-api-key: your-api-key'
```

| Header | Description |
|:-------|:------------|
| `ratelimit-limit` | The rate limit ceiling for that endpoint |
| `ratelimit-remaining` | The number of requests left for the current window |
| `ratelimit-reset` | The time when the rate limit window resets (Unix timestamp) |
| `retry-after` | Time to wait before retrying (only present when rate limited) |

## Service-specific headers

Hiro APIs include additional headers that provide granular rate limit information per service type, reflecting the separation of rate limits between Stacks and Bitcoin services.

### Stacks service headers

When calling Stacks-related endpoints (Stacks Blockchain API, Token Metadata API, etc), you'll receive:

```typescript
// Example: Fetching Stacks account info
const response = await fetch('https://api.hiro.so/extended/v1/address/SP318Q55DEKHRXJK696033DQN5C54D9K2EE6DHRWP/assets', {
  headers: { 'x-api-key': apiKey }
});

console.log(response)

// New headers in response:
// x-ratelimit-cost-stacks: 1
// x-ratelimit-limit-stacks-minute: 500
// x-ratelimit-remaining-stacks-minute: 499
```

| Header | Description |
|:-------|:------------|
| `x-ratelimit-cost-stacks` | The quota cost for this specific request |
| `x-ratelimit-limit-stacks-second` | Per-second limit for Stacks services |
| `x-ratelimit-remaining-stacks-second` | Remaining requests this second |
| `x-ratelimit-limit-stacks-minute` | Per-minute limit for Stacks services |
| `x-ratelimit-remaining-stacks-minute` | Remaining requests this minute |
| `x-ratelimit-limit-stacks-month` | Monthly limit for Stacks services |
| `x-ratelimit-remaining-stacks-month` | Remaining requests this month |

### Bitcoin service headers

{% hint style="info" %}
Bitcoin service headers (`x-ratelimit-*-bitcoin`) apply to the Ordinals and Runes APIs hosted by Hiro. For full documentation on these APIs, see the [Hiro documentation](https://docs.hiro.so/apis/ordinals-api).
{% endhint %}

When calling Bitcoin-related endpoints (Ordinals API, Runes API), you'll receive:

```typescript
// Example: Fetching inscription data
const response = await fetch('https://api.hiro.so/ordinals/v1/inscriptions', {
  headers: { 'x-api-key': apiKey }
});

console.log(response)

// New headers in response:
// x-ratelimit-cost-bitcoin: 1
// x-ratelimit-limit-bitcoin-minute: 500
// x-ratelimit-remaining-bitcoin-minute: 499
```

| Header | Description |
|:-------|:------------|
| `x-ratelimit-cost-bitcoin` | The quota cost for this specific request |
| `x-ratelimit-limit-bitcoin-second` | Per-second limit for Bitcoin services |
| `x-ratelimit-remaining-bitcoin-second` | Remaining requests this second |
| `x-ratelimit-limit-bitcoin-minute` | Per-minute limit for Bitcoin services |
| `x-ratelimit-remaining-bitcoin-minute` | Remaining requests this minute |
| `x-ratelimit-limit-bitcoin-month` | Monthly limit for Bitcoin services |
| `x-ratelimit-remaining-bitcoin-month` | Remaining requests this month |

## Service classification

APIs are classified into service types based on their URL path:

| Service Type | Path Pattern | Examples |
|:-------------|:-------------|:---------|
| Bitcoin | `/ordinals/*` | Ordinals API endpoints |
| Bitcoin | `/runes/*` | Runes API endpoints |
| Stacks | All other paths | Stacks Blockchain API, Token Metadata API, Signer Metrics API, Explorer, and other services |

{% hint style="info" %}
The `x-ratelimit-cost-*` header shows the exact quota cost for each request, which may vary based on the endpoint and parameters used. Platform services (Platform API, Devnet) have separate rate limiting.
{% endhint %}

## Further reading

- [Rate limiting](rate-limits.md)
- [API keys](api-keys.md)
