# Chainhooks API

{% hint style="info" %}
This API is developed and hosted by [Hiro](https://www.hiro.so/). For authentication and quota guidance, see [API Keys](../api-keys.md), [Rate Limits](../rate-limits.md), and [Response Headers](../response-headers.md).
{% endhint %}

The Chainhooks API is a REST API for programmatically creating, updating, evaluating, and deleting Chainhooks. It exposes the same Hiro-hosted service behind the Chainhooks tooling, making it possible to manage webhook-based indexing workflows over HTTP.

Use this API when you want to automate Chainhook lifecycle management from your own backend, CI workflow, or operations tooling instead of configuring everything manually through the Hiro Platform.

### Key features

- Create, inspect, update, enable, and delete Chainhooks over HTTP
- Evaluate Chainhooks against historical chain data before enabling them
- Manage webhook delivery settings and consumer secrets programmatically

### Base URLs

```text
Testnet: https://api.testnet.hiro.so/chainhooks/v1
Mainnet: https://api.mainnet.hiro.so/chainhooks/v1
```

### Example request

```bash
curl https://api.testnet.hiro.so/chainhooks/v1/me/ \
  -H "x-api-key: YOUR_API_KEY"
```

For authentication details, request conventions, and operational guidance, see [Usage](usage.md).

{% hint style="info" %}
Need help building with the Chainhooks API? Reach out in the `#chainhook` channel on [Discord](https://stacks.chat/) under Hiro Developer Tools.
{% endhint %}
