---
description: Frequently asked questions about Chainhooks 2.0 (Beta)
---

# FAQ

{% hint style="info" %}
This page is migrated from the [Hiro documentation](https://docs.hiro.so/en/tools/chainhooks/faq).
{% endhint %}

## Chainhooks 2.0 (Beta)

<details>

<summary>What is the goal/purpose of the Chainhooks 2.0 (Beta)?</summary>

Our goal during the Beta is to learn as much as possible about the reliability, performance and developer experience of Chainhooks 2.0 in anticipation of the full release. If you encounter any issues, have any questions, or would like to share feedback during the Beta, please reach out to [beta@hiro.so](mailto:beta@hiro.so).

</details>

<details>

<summary>Is the Chainhooks 2.0 (Beta) free?</summary>

Yes! The Chainhooks 2.0 Beta is free for all participants.

</details>

<details>

<summary>Will there be configuration or rate limits imposed during the Beta?</summary>

All Beta users will initially be constrained to a limit of 10 Chainhooks configurations.

</details>

<details>

<summary>How will Chainhooks be priced following the Beta?</summary>

Chainhooks will be charged using a credit model for each delivery, with users able to select different credit limits depending on their usage. For Chainhooks 2.0 Beta users, your post-beta limits will initially be determined by your existing Hiro subscription tier.

</details>

## Version Management

<details>

<summary>What will happen to existing legacy Chainhooks running on v1.0?</summary>

Users with Chainhooks running on v1.0 will still be able to view them and receive deliveries, but once the beta launches, all new Chainhooks created in the Platform will run on v2.0.

The API will also not support Chainhooks running on v1.0.

{% hint style="info" %}
Learn how to migrate your v1 chainhooks to v2 in the [Migration Guide](migration.md).
{% endhint %}

</details>

<details>

<summary>If v2.0 and v1.0 will be live at the same time, how do we manage both?</summary>

In the Platform, v1 chainhooks are read-only. You can view them and they will continue to deliver events, but you cannot modify them through the Platform UI.

To modify v1 chainhooks programmatically, use the [Platform API](https://docs.hiro.so/apis/platform-api). However, we recommend migrating to v2 chainhooks instead. See the [Migration Guide](migration.md) for a complete walkthrough.

</details>

<details>

<summary>How do I migrate my v1 chainhooks to v2?</summary>

To migrate your v1 chainhooks to v2, follow the steps outlined in the [Migration Guide](migration.md).

</details>

## Platform vs SDK

<details>

<summary>Can I edit my v2 Chainhooks?</summary>

Yes! you can edit your v2 Chainhooks using the [Chainhooks SDK](update.md) or [Chainhooks API](https://docs.hiro.so/apis/chainhooks-api). The Platform does not currently support editing v2 Chainhooks.

</details>

## Common Questions

<details>

<summary>Can I filter by multiple event types?</summary>

Yes! See examples in the [Filter reference](reference/filters.md#combining-filters) guide for examples of combining filters.

</details>

<details>

<summary>What happens if my webhook endpoint is down?</summary>

Chainhooks will retry webhook deliveries and then "pause" your Chainhooks, giving you time to fix the issue and re-enable. Extended downtime may result in missed events, but you can use the [Evaluate](evaluate.md) feature to replay missed blocks.

</details>

<details>

<summary>Can I test chainhooks locally?</summary>

Currently, no. But we are working on a new feature that will help you quickly test chainhook payloads locally without requiring much setup.

</details>

---

## Where to Get Help

- **Discord**: Join the **#chainhook** channel on [Discord](https://stacks.chat/) under Hiro Developer Tools
- **Email Support**: [beta@hiro.so](mailto:beta@hiro.so)

---

## Next Steps

- [Create chainhooks](create.md): Register and enable chainhooks
- [Payload anatomy](reference/payload-anatomy.md): Dive into the anatomy of a chainhook payload
