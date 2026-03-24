# Chainhooks API

REST API for managing Chainhooks programmatically.

{% hint style="info" %}
This page is migrated from the [Hiro documentation](https://docs.hiro.so/en/apis/chainhooks-api).
{% endhint %}

## Overview

The Chainhooks API is a REST API that allows you to programmatically manage chainhooks, configure event filters, and control webhook delivery. It provides the same functionality covered in the [Chainhooks SDK introduction](https://docs.hiro.so/en/tools/chainhooks/introduction) through direct HTTP requests.

## Key Features

- **Full chainhook management** - Create, read, update, and delete chainhooks
- **Webhook configuration** - Set up HTTP POST endpoints for event delivery
- **Evaluation endpoints** - Test chainhooks against historical blocks

## Base URLs

The Chainhooks API is available on both mainnet and testnet:

```
Testnet: https://api.testnet.hiro.so/chainhooks/v1
Mainnet: https://api.mainnet.hiro.so/chainhooks/v1
```

## API Reference

{% hint style="info" %}
For the complete interactive API reference with all endpoints, request/response schemas, and try-it-out functionality, see the [Chainhooks API Reference on Hiro Docs](https://docs.hiro.so/en/apis/chainhooks-api/reference/chainhooks).
{% endhint %}

### Available Endpoints

| Endpoint | Description |
|----------|-------------|
| Register chainhook | Create a new chainhook with event filters and webhook delivery |
| Get all chainhooks | List all registered chainhooks |
| Get one chainhook | Retrieve a specific chainhook by UUID |
| Update chainhook | Modify an existing chainhook configuration |
| Delete chainhook | Remove a registered chainhook |
| Evaluate chainhook | Test a chainhook against historical blocks |
| Enable chainhook | Enable a specific chainhook |
| Disable chainhook | Disable a specific chainhook |
| Bulk enable/disable | Enable or disable multiple chainhooks matching filters |
| Get status | Retrieve the current status of a chainhook |
| Rotate secret | Rotate the consumer secret for webhook security |
| Delete secret | Remove the consumer secret |

## Next Steps

- [Usage Guide](usage.md): Authentication and best practices
- [API Reference](https://docs.hiro.so/en/apis/chainhooks-api/reference/chainhooks): Complete endpoint documentation

{% hint style="info" %}
### Need help building with the Chainhooks API?
Reach out to us on the **#chainhook** channel on [Discord](https://stacks.chat/) under Hiro Developer Tools. There's also a [weekly office hours](https://www.addevent.com/event/oL21905919) call every Thursday at 11am ET.
{% endhint %}
