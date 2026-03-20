---
description: Complete reference for Hiro Chainhooks configuration options.
---

# Options

Options control payload enrichment, activation, and expiration behavior. Omit the `options` field entirely if you want the defaults.

{% hint style="info" %}
Boolean options default to `false`. Integer expiration options are optional.
{% endhint %}

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `decode_clarity_values` | boolean | `false` | Include decoded Clarity representations |
| `include_contract_abi` | boolean | `false` | Include ABI data on deployments |
| `include_contract_source_code` | boolean | `false` | Include source code on deployments |
| `include_post_conditions` | boolean | `false` | Include decoded post-conditions |
| `include_raw_transactions` | boolean | `false` | Include raw transaction hex |
| `include_block_metadata` | boolean | `false` | Include Stacks and Bitcoin block metadata |
| `include_block_signatures` | boolean | `false` | Include signer metadata |
| `enable_on_registration` | boolean | `false` | Activate the hook immediately |
| `expire_after_evaluations` | integer | none | Expire after N blocks are evaluated |
| `expire_after_occurrences` | integer | none | Expire after N matches |

## Examples

```json
{
  "options": {
    "decode_clarity_values": true,
    "include_post_conditions": true,
    "enable_on_registration": true
  }
}
```

```json
{
  "options": {
    "expire_after_evaluations": 10000
  }
}
```

```json
{
  "options": {
    "expire_after_occurrences": 250
  }
}
```
