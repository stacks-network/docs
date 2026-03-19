# Stacks Blockchain API

{% hint style="info" %}
For the complete OpenAPI spec, navigate [here](https://raw.githubusercontent.com/hirosystems/stacks-blockchain-api/master/openapi.yaml).
{% endhint %}

The Stacks API provides comprehensive access to Stacks blockchain data through a high-performance REST interface. Built on cached responses and optimized indexing, it delivers transaction data, smart contract information, account balances, and block details with minimal latency.

<details>

<summary>Who is this API for?</summary>

The Stacks Blockchain API is a hosted, indexed REST API that caches and indexes on-chain data so you can query it efficiently. It is distinct from the [Stacks Node RPC API](../stacks-node-rpc/), which exposes only the minimal set of endpoints built into every Stacks node.

If you need rich query capabilities (transaction history, token transfers, smart contract events, paginated lists, etc.) without running your own infrastructure, the Stacks Blockchain API is the right choice.

</details>

{% hint style="info" %}
This API is developed and hosted by [Hiro](https://www.hiro.so/). The public base URL is `https://api.hiro.so`.
{% endhint %}

### Key features

- **Real-time data ingestion** -- Continuously indexes blockchain activity as it happens
- **Cached responses** -- Optimized performance through intelligent caching strategies
- **Complete data access** -- Transaction history, smart contracts, accounts, and blocks

### Usage

```bash
curl -L 'https://api.hiro.so/extended' -H 'Accept: application/json'
```

For more usage examples, see [Usage](usage.md).

{% hint style="warning" %}
All Stacks Blockchain API responses include rate limit headers that help you monitor your API usage. If you need help building with the Stacks Blockchain API, reach out on the **#api** channel on [Discord](https://stacks.chat/) under the Hiro Developer Tools section. There's also a [weekly office hours](https://www.addevent.com/event/kI22007085) call every Wednesday at 1pm ET.
{% endhint %}
