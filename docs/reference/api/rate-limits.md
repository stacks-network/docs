# Rate Limiting

{% hint style="info" %}
These rate limits apply to Hiro-hosted API endpoints. Self-hosted nodes have no rate limits.
{% endhint %}

{% hint style="info" %}
**Source:** This page is adapted from the [Hiro documentation](https://docs.hiro.so/resources/guides/rate-limits). Hiro is a developer tooling company that provides hosted API services for the Stacks ecosystem.
{% endhint %}

## API rate limits

The following rate-limits (in requests per minute, or RPM) are applicable for [all Hiro APIs](https://www.hiro.so/blog/updated-rate-limits-for-hiro-apis):

| API key | Rate Limit                        |
|:--------|:----------------------------------|
| No      | 50 requests per minute (RPM) per client IP, for unauthenticated traffic |
| Yes     | 500 requests per minute (RPM), regardless of origin IP, with an authenticated API key |

Rate limits are split between two service types based on the API path:
- **Bitcoin services** (`/ordinals/*` and `/runes/*` paths): Ordinals API and Runes API
- **Stacks services** (all other paths): [Stacks Blockchain API](stacks-blockchain-api/), Token Metadata API, Signer Metrics API, Explorer endpoints, and other Hiro services

Each service type has its own independent quota, allowing you to use both Stacks and Bitcoin APIs without one affecting the other's rate limits. For more details, see our guide on [response headers](response-headers.md).

{% hint style="info" %}
Platform services (Platform API, Devnet) have separate rate limiting and are not part of this quota system.
{% endhint %}

{% hint style="info" %}
You can create an API key for free in the [Hiro Platform](https://platform.hiro.so) by creating an account.
{% endhint %}

## STX Faucet rate limits

Note: this faucet is for Stacks testnet and provides testnet STX, which has no monetary value.

| Type                        | Rate Limit                  |
|:-----------------------------|:-----------------------------|
| Stacking requests           | 1 request per 2 days        |
| Regular STX requests | 1 request per minute (RPM)     |
