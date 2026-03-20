---
description: Build event-driven Stacks apps with Hiro Chainhooks.
---

# Chainhooks

{% hint style="info" %}
Hiro Chainhooks are documented on Stacks docs, but the service and runtime endpoints remain Hiro-hosted. Use your Hiro API key and `hiro.so` endpoints when creating or managing hooks.
{% endhint %}

## Overview

Chainhooks lets you subscribe to Stacks blockchain activity, filter for the exact events you care about, and deliver those events to your app in real time.

The build-side docs here focus on the Chainhooks SDK and webhook payload model. For the REST API surface, see the Hiro API reference in the Stacks docs `reference` space.

## Key features

- Reorg-aware indexing that emits rollback events when the canonical chain changes
- Event filters for STX, FT, NFT, contract-call, contract-log, and system events
- Historical evaluation so you can replay known blocks against an existing hook
- Programmatic lifecycle management through the Chainhooks SDK

## Recommended workflow

1. Start with the [Quickstart](quickstart.md) to install the SDK and authenticate.
2. Use [Create](create.md) to register and enable hooks.
3. Review the [Reference](reference/README.md) pages before you finalize filters or payload handling.
4. Use [Evaluate](evaluate.md) to replay known blocks while testing your webhook consumer.

{% hint style="success" %}
Need help with Chainhooks? Join `#chainhook` in [Stacks Discord](https://stacks.chat/).
{% endhint %}
