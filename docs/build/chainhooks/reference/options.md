---
description: Complete reference for all Chainhooks configuration options
---

# Options

{% hint style="info" %}
This page is migrated from the [Hiro documentation](https://docs.hiro.so/en/tools/chainhooks/reference/options).
{% endhint %}

Options control payload enrichment and evaluation windows for your chainhook. The `options` field is optional and can be omitted or set to `null`.

{% hint style="info" %}
All boolean options default to `false` if omitted. Integer options are optional.
{% endhint %}

---

## Payload options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `decode_clarity_values` | boolean | `false` | Include human-readable Clarity values |
| `include_contract_abi` | boolean | `false` | Include contract ABI on deployments |
| `include_contract_source_code` | boolean | `false` | Include source code on deployments |
| `include_post_conditions` | boolean | `false` | Include post-conditions in metadata |
| `include_raw_transactions` | boolean | `false` | Include raw transaction hex |
| `include_block_metadata` | boolean | `false` | Include block metadata (Stacks & Bitcoin) |
| `include_block_signatures` | boolean | `false` | Include block signatures and signers |
| `enable_on_registration` | boolean | `false` | Enable chainhook immediately on creation |
| `expire_after_evaluations` | integer | none | Expire after N blocks evaluated |
| `expire_after_occurrences` | integer | none | Expire after N matches |

### decode_clarity_values

Include human-readable `repr` (and inferred types) alongside `hex` for arguments, logs, and results.

- **Type**: `boolean`
- **Default**: `false`

```json
{
  "options": {
    "decode_clarity_values": true
  }
}
```

---

### include_contract_abi

Include the contract ABI on deployment operations. This improves argument typing when decoding.

- **Type**: `boolean`
- **Default**: `false`

```json
{
  "options": {
    "include_contract_abi": true
  }
}
```

---

### include_contract_source_code

Include the contract source code on deployment operations.

- **Type**: `boolean`
- **Default**: `false`

```json
{
  "options": {
    "include_contract_source_code": true
  }
}
```

---

### include_post_conditions

Include decoded post-conditions in transaction metadata.

- **Type**: `boolean`
- **Default**: `false`

```json
{
  "options": {
    "include_post_conditions": true
  }
}
```

---

### include_raw_transactions

Include raw transaction hex in transaction metadata.

- **Type**: `boolean`
- **Default**: `false`

```json
{
  "options": {
    "include_raw_transactions": true
  }
}
```

---

### include_block_metadata

Include block metadata for both Stacks and Bitcoin blocks, with execution costs, transaction count, etc.

- **Type**: `boolean`
- **Default**: `false`

```json
{
  "options": {
    "include_block_metadata": true
  }
}
```

---

### include_block_signatures

Include signer information and signatures in block metadata.

- **Type**: `boolean`
- **Default**: `false`

```json
{
  "options": {
    "include_block_signatures": true
  }
}
```

---

## Activation Options

### enable_on_registration

Enable the chainhook immediately upon registration/creation. By default, a new chainhook is disabled upon creation.

- **Type**: `boolean`
- **Default**: `false`

```json
{
  "options": {
    "enable_on_registration": true
  }
}
```

When set to `true`, the response will include `status.enabled = true` and the chainhook will start processing events immediately.

---

## Expiration Options

### expire_after_evaluations

Automatically expire the chainhook after evaluating this many blocks.

- **Type**: `integer`
- **Default**: None (no expiration)

```json
{
  "options": {
    "expire_after_evaluations": 10000
  }
}
```

This chainhook will expire after evaluating 10,000 blocks.

---

### expire_after_occurrences

Automatically expire the chainhook after this many matching occurrences.

- **Type**: `integer`
- **Default**: None (no expiration)

```json
{
  "options": {
    "expire_after_occurrences": 250
  }
}
```

This chainhook will expire after triggering 250 times.
