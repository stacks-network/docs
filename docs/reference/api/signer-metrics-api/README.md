# Signer Metrics API

{% hint style="info" %}
This API is developed and hosted by [Hiro](https://www.hiro.so/). For authentication and quota guidance, see [API Keys](../api-keys.md), [Rate Limits](../rate-limits.md), and [Response Headers](../response-headers.md).
{% endhint %}

The Signer Metrics API exposes indexed data for monitoring signer participation and behavior on the Stacks network. It is useful when you need to inspect signer performance across reward cycles without querying raw metrics infrastructure yourself.

### Key features

- Reward-cycle views of signer participation and activity
- Aggregated metrics for signer and block analysis
- A simple REST interface for dashboards, monitoring, and incident response workflows

### Example request

```bash
curl -L 'https://api.hiro.so/signer-metrics/v1/cycles/95/signers' \
  -H 'Accept: application/json'
```

For request basics and response codes, see [Usage](usage.md).

{% hint style="info" %}
Need help building with the Signer Metrics API? Reach out in the `#api` channel on [Discord](https://stacks.chat/) under Hiro Developer Tools.
{% endhint %}
