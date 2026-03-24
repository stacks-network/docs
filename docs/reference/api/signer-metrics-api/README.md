# Signer Metrics API

Monitor and analyze signer behavior on the Stacks network via REST.

{% hint style="info" %}
This page is migrated from the [Hiro documentation](https://docs.hiro.so/en/apis/signer-metrics-api).
{% endhint %}

## Overview

The Signer Metrics API provides comprehensive monitoring capabilities for signers on the Stacks network through a REST interface. Built for network analysis and performance tracking, it delivers detailed information about active signers, block acceptance rates, and timing metrics across PoX cycles.

## Key features

- **Signer monitoring** - Track active signers and their performance metrics
- **Block analysis** - Aggregated signer information for block validation
- **PoX cycle tracking** - Monitor signer participation across cycles

## Usage

```bash
curl -L 'https://api.hiro.so/signer-metrics/v1/cycles/95/signers' -H 'Accept: application/json'
```

For more usage examples, click [here](usage.md).

## API Reference

{% hint style="info" %}
For the complete interactive API reference, see the [Signer Metrics API Reference on Hiro Docs](https://docs.hiro.so/en/apis/signer-metrics-api/reference/signers).
{% endhint %}

### Available Endpoints

| Endpoint | Description |
|----------|-------------|
| Block proposals | Retrieve block proposal data for signers |
| Blocks | Get aggregated signer information for blocks |
| Info/status | Check the API status and info |
| PoX cycle signer | Get metrics for a specific signer in a PoX cycle |
| PoX cycle signers | List all signers and their metrics for a PoX cycle |

{% hint style="info" %}
### Need help building with the Signer Metrics API?
Reach out to us on the **#api** channel on [Discord](https://stacks.chat/) under the Hiro Developer Tools section. There's also a [weekly office hours](https://www.addevent.com/event/kI22007085) call every Wednesday at 1pm ET.
{% endhint %}
