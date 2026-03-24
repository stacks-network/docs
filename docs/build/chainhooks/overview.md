---
description: Chainhooks is a webhook service for the Stacks blockchain that lets you register event streams and define precise filters to capture on-chain data as it happens.
---

# Chainhooks

{% hint style="info" %}
This page is migrated from the [Hiro documentation](https://docs.hiro.so/en/tools/chainhooks).
{% endhint %}

## Overview

Chainhooks makes it easy to subscribe to blockchain activity on Stacks by registering event streams, filtering for exactly the data you care about, and sending it straight to your app in real time.

With Chainhooks 2.0 (Beta), you can manage chainhooks through:
- **[Chainhooks SDK](quickstart.md)** - TypeScript/JavaScript client for programmatic management
- **[Hiro Platform](https://platform.hiro.so)** - Web-based UI for visual chainhook creation
- **[Chainhooks API](https://docs.hiro.so/apis/chainhooks-api)** - Direct REST API access

## Key Features

- **Reorg-aware indexing** - Automatically handles blockchain forks and reorganizations
- **Event filtering** - Define custom logic to trigger actions on specific blockchain events
- **Historical evaluation** - Test chainhooks against past blocks for indexing or debugging

## Next steps

- [SDK introduction](quickstart.md): Get started with the Chainhooks SDK
- [Migration guide](migration.md): Migration guide for upgrading to Chainhooks 2.0 (Beta)

{% hint style="info" %}
### Need help with Chainhooks?
Reach out to us on the **#chainhook** channel on [Discord](https://stacks.chat/) under the Hiro Developer Tools section.
{% endhint %}
