# Token Metadata API

{% hint style="info" %}
This API is developed and hosted by [Hiro](https://www.hiro.so/). For authentication and quota guidance, see [API Keys](../api-keys.md), [Rate Limits](../rate-limits.md), and [Response Headers](../response-headers.md).
{% endhint %}

The Token Metadata API provides indexed metadata for fungible tokens, non-fungible tokens, and token collections on Stacks. It is designed for wallets, explorers, and apps that need a fast way to resolve token metadata without building their own indexing pipeline.

### Key features

- Indexed metadata for fungible, non-fungible, and semi-fungible tokens
- Cached responses for low-latency metadata lookups
- Support for SIP-016 metadata patterns and update notifications

### Example request

```bash
curl -L 'https://api.hiro.so/metadata/v1/ft' \
  -H 'Accept: application/json'
```

For request basics and response codes, see [Usage](usage.md).

{% hint style="warning" %}
Token Metadata API responses include rate limit headers. Use them to track your current quota and request cost.
{% endhint %}

{% hint style="info" %}
Need help building with the Token Metadata API? Reach out in the `#api` channel on [Discord](https://stacks.chat/) under Hiro Developer Tools.
{% endhint %}
