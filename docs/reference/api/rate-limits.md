# Rate Limits

Hiro-hosted APIs enforce rate limits to protect shared infrastructure. The effective quota depends on the product you are calling, whether the request is authenticated, and any plan-specific limits attached to your account.

## How limits are applied

- Unauthenticated traffic is typically rate-limited by client IP.
- Authenticated traffic is tracked against the API key you send in `x-api-key`.
- Some Hiro-hosted products expose their own service-specific quota buckets.

The most reliable way to understand your current quota is to inspect the response headers returned by the API you are calling. See [Response Headers](response-headers.md).

{% hint style="info" %}
Platform-managed products can have their own quota rules and are not always part of the same public API rate limit pool.
{% endhint %}

## Working within limits

- Send an API key for production workloads so your usage is attributed correctly.
- Retry `429 Too Many Requests` responses with exponential backoff.
- Cache responses where possible and avoid polling endpoints more aggressively than needed.
- Track `ratelimit-remaining`, `ratelimit-reset`, and any service-specific `x-ratelimit-*` headers in your application logs.

If you need an API key, start with [API Keys](api-keys.md).
