# Stacks Blockchain API

{% hint style="info" %}
For the complete OpenAPI spec, navigate [here](https://raw.githubusercontent.com/hirosystems/stacks-blockchain-api/master/openapi.yaml).
{% endhint %}

The Stacks Blockchain API is a REST API developed and hosted by [Hiro](https://www.hiro.so/) that extends the [Stacks Node RPC API](../stacks-node-rpc/) with additional indexed endpoints. While every Stacks node exposes a minimal set of RPC endpoints (account balances, contract calls, transaction broadcasting), the Blockchain API continuously ingests and indexes on-chain activity into a PostgreSQL database, making it possible to query transaction history, token transfers, smart contract events, and paginated lists of blocks — data that is not directly available from a Stacks node alone.

The public base URL is `https://api.hiro.so`. No infrastructure setup is required, so you can start querying immediately.

<details>

<summary>Who is this API for?</summary>

The Stacks Blockchain API is the recommended API for wallets, dApps, explorers, and general developers who need rich query capabilities without running their own node. It proxies all standard [Stacks Node RPC](../stacks-node-rpc/) endpoints and adds the `/extended/` family of indexed endpoints on top.

If you need a more decentralized setup or want direct access to the raw node RPC without a third-party service, see the [Stacks Node RPC API](../stacks-node-rpc/). For exchange or institutional integrations using the Coinbase Mesh standard, see the [Stacks Mesh API](../stacks-mesh-api/).

</details>

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
All Stacks Blockchain API responses include rate limit headers that help you monitor your API usage.
{% endhint %}

{% hint style="info" %}
Need help building with the Stacks Blockchain API? Reach out on the **#api** channel on [Discord](https://stacks.chat/) under the Hiro Developer Tools section.
{% endhint %}
