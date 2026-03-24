# Token Metadata API

Fast, reliable metadata for Stacks tokens via REST.

{% hint style="info" %}
This page is migrated from the [Hiro documentation](https://docs.hiro.so/en/apis/token-metadata-api).
{% endhint %}

## Overview

The Token Metadata API provides comprehensive metadata for tokens on the Stacks blockchain through a high-performance REST interface. Built with cached responses and optimized indexing, it delivers fungible token information, NFT properties, and collection data with minimal latency.

## Key features

- **Complete token coverage** - Metadata for fungible, non-fungible, and semi-fungible tokens
- **Cached responses** - Optimized performance through intelligent caching strategies
- **Rich metadata** - Token properties, attributes, and collection information

## Usage

```bash
curl -L 'https://api.hiro.so/metadata/v1/ft' -H 'Accept: application/json'
```

For more usage examples, click [here](usage.md).

{% hint style="info" %}
All Token Metadata API responses include rate limit headers that help you monitor your API usage with Stacks-specific quota information.
{% endhint %}

## API Reference

{% hint style="info" %}
For the complete interactive API reference, see the [Token Metadata API Reference on Hiro Docs](https://docs.hiro.so/en/apis/token-metadata-api/reference/tokens).
{% endhint %}

### Available Endpoints

| Endpoint | Description |
|----------|-------------|
| Info/status | Check the API status and info |
| Fungible tokens | List all fungible tokens with metadata |
| FT metadata | Get metadata for a specific fungible token |
| NFT metadata | Get metadata for a specific non-fungible token |
| SFT metadata | Get metadata for a specific semi-fungible token |

{% hint style="info" %}
### Need help building with the Token Metadata API?
Reach out to us on the **#api** channel on [Discord](https://stacks.chat/) under the Hiro Developer Tools section. There's also a [weekly office hours](https://www.addevent.com/event/kI22007085) call every Wednesday at 1pm ET.
{% endhint %}
