---
description: Frequently asked questions about Hiro Chainhooks.
---

# FAQ

## Versioning and migration

<details>
<summary>What happened to legacy Chainhooks v1?</summary>

Legacy Chainhooks v1 was deprecated on March 9, 2026. Use the current SDK and API flows documented in these build and reference sections for new work, and follow the [migration guide](migration.md) when moving older definitions forward.

</details>

<details>
<summary>How do I migrate older chainhooks?</summary>

Use the [migration guide](migration.md) to map v1 predicates to the current event-based filter model, register a v2 hook, test deliveries, and then retire the legacy definition.

</details>

## Operating questions

<details>
<summary>Can I edit an existing chainhook?</summary>

Yes. Use the SDK or API to update a chainhook definition in place. Start with the [update guide](update.md).

</details>

<details>
<summary>Can I filter by multiple event types?</summary>

Yes. Add multiple entries to `filters.events`. A chainhook triggers when any event filter matches. See [filters](reference/filters.md#combining-filters).

</details>

<details>
<summary>What happens if my webhook endpoint is down?</summary>

Chainhooks retries deliveries and may pause the hook if the endpoint continues to fail. After you recover the consumer, use [evaluate](evaluate.md) to replay known blocks if needed.

</details>

<details>
<summary>Can I test chainhooks against historical blocks?</summary>

Yes. Use [evaluate](evaluate.md) to replay a specific block height or block hash.

</details>

## Support

- Discord: `#chainhook` in [Stacks Discord](https://stacks.chat/)
- Product access and API keys: [Hiro Platform](https://platform.hiro.so)
